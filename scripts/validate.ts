import { access, readdir, readFile, realpath, stat } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "yaml";
import { z } from "zod";
import { createConsola } from "consola";
import { colors } from "consola/utils";
import { localMarkdownLinks } from "./markdown-links.ts";

// Offline, read-only validation of repository packaging and installed resources.
// Missing skill resources are errors even when matching shared sources exist.
// Migration, provider installation and live service checks belong to other steps.

// Catalog schemas deliberately accept only the local-source contract supported here.
// Unknown catalog fields fail rather than silently extending distribution behavior.
const name = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const localPath = z.string().regex(/^\.\/plugins\/[a-z0-9]+(?:-[a-z0-9]+)*$/);
const openAIEntry = z.strictObject({
  name,
  source: z.strictObject({ source: z.literal("local"), path: localPath }),
  policy: z.strictObject({
    installation: z.enum(["AVAILABLE", "INSTALLED_BY_DEFAULT", "NOT_AVAILABLE"]),
    authentication: z.enum(["ON_INSTALL", "ON_USE"]),
  }),
  category: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
});
const openAICatalog = z.strictObject({
  name,
  interface: z.strictObject({ displayName: z.string().trim().min(1) }),
  plugins: z.array(openAIEntry),
});
const claudeCatalog = z.strictObject({
  name,
  owner: z.strictObject({ name: z.string().trim().min(1), email: z.email().optional() }),
  plugins: z.array(z.strictObject({ name, source: localPath })),
});
// Validate the portable manifest fields we consume, allowing other root metadata.
// This is not a full certification against the upstream Agent Plugins schema.
const pluginMetadata = z.object({
  $schema: z.literal("https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"),
  name,
  version: z
    .string()
    .regex(
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*)?(?:\+[\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*)?$/,
    ),
  description: z.string().trim().min(1).max(4000),
  extensions: z
    .object({
      "com.openai": z
        .object({
          interface: z.object({
            displayName: z.string().trim().min(1),
            shortDescription: z.string().trim().min(1),
            logo: z
              .string()
              .regex(/^\.\/assets\/.+\.png$/)
              .optional(),
            composerIcon: z
              .string()
              .regex(/^\.\/assets\/.+\.png$/)
              .optional(),
          }),
          apps: z
            .string()
            .regex(/^\.\/.+\.json$/)
            .optional(),
        })
        .optional(),
    })
    .optional(),
});
// Deliberately support only the credential-free remote subset used by this repository.
const remoteMcpServer = z.strictObject({
  type: z.literal("streamable-http"),
  url: z.url().refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  }, "MCP endpoint must use HTTPS without embedded credentials"),
});
const mcpMetadata = z.strictObject({
  $schema: z.literal("https://agent-plugins.org/schemas/1.0.0/mcp.schema.json"),
  mcpServers: z.record(name, remoteMcpServer).refine((servers) => Object.keys(servers).length > 0),
});
const appMetadata = z.strictObject({
  apps: z
    .record(
      name,
      z.strictObject({ id: z.string().trim().min(1), required: z.boolean().optional() }),
    )
    .refine((apps) => Object.keys(apps).length > 0),
});
// Provider overlays repeat canonical identity and translate the supported MCP transport.
const claudePluginMetadata = z.strictObject({
  name,
  version: pluginMetadata.shape.version,
  description: pluginMetadata.shape.description,
  mcpServers: z.record(
    name,
    z.strictObject({ type: z.literal("http"), url: remoteMcpServer.shape.url }),
  ),
});
const skillMetadata = z.strictObject({
  name,
  description: z.string().trim().min(1).max(1024),
  license: z.string().trim().min(1).optional(),
  compatibility: z.string().trim().min(1).max(500).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  "allowed-tools": z.string().trim().min(1).optional(),
});

/** Read JSON as unknown data; schemas validate it at the call site. */
async function json(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"));
}

/**
 * Require a regular file and return UTF-8 contents. stat follows symlinks; callers
 * establish containment separately, and markdownFiles rejects symlinked resources.
 */
async function file(path: string): Promise<string> {
  if (!(await stat(path)).isFile()) throw new Error(`${path}: expected a file`);
  return readFile(path, "utf8");
}

/**
 * List content directories, reporting invalid entries without hiding valid siblings.
 * Empty collections and a regular .gitkeep are allowed; enumeration errors propagate
 * to the caller's rule, while invalid names/files/symlinks get their own failed rule.
 */
async function directories(path: string, checks: Checks): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true });
  const names: string[] = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, "en"))) {
    if (entry.name === ".gitkeep" && entry.isFile()) continue;
    const valid = await checks.run("Content directory name", join(path, entry.name), () => {
      if (!entry.isDirectory())
        throw new Error(`${join(path, entry.name)}: expected a content directory`);
      return name.parse(entry.name);
    });
    if (valid !== undefined) names.push(valid);
  }
  return names.sort();
}

/** Reject repeated names within a catalog or installable skill scope. */
function unique(names: string[], context: string): void {
  if (new Set(names).size !== names.length) throw new Error(`${context}: duplicate names`);
}

/**
 * Validate a manifest-declared resource against its plugin boundary. realpath catches
 * symlink escapes; file then rejects directories. Missing files propagate as errors.
 * The recursive package traversal separately rejects symlinks even within the boundary.
 */
async function containedFile(path: string, boundary: string): Promise<void> {
  const actual = await realpath(path);
  const root = await realpath(boundary);
  const offset = relative(root, actual);
  if (offset === ".." || offset.startsWith(`..${sep}`)) {
    throw new Error(`${path}: reference escapes ${boundary}`);
  }
  await file(actual);
}

/** One independently evaluated rule, including its responsible file and diagnostics. */
export type ValidationResult = {
  rule: string;
  file: string;
  status: "passed" | "failed" | "skipped";
  details: string[];
};
export type ValidationReport = { results: ValidationResult[] };

/** Flatten nested link failures and render schema issues without dumping raw input. */
function diagnostics(error: unknown): string[] {
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => `${issue.path.join(".") || "metadata"}: ${issue.message}`);
  }
  if (error instanceof AggregateError) return error.errors.flatMap(diagnostics);
  return [error instanceof Error ? error.message : String(error)];
}

/** Collect failures at rule boundaries so unrelated checks can continue safely. */
class Checks {
  readonly results: ValidationResult[] = [];

  async run<T>(rule: string, file: string, action: () => Promise<T> | T): Promise<T | undefined> {
    try {
      const value = await action();
      this.results.push({ rule, file, status: "passed", details: [] });
      return value;
    } catch (error: unknown) {
      this.results.push({
        rule,
        file,
        status: "failed",
        details: [...new Set(diagnostics(error))],
      });
      return undefined;
    }
  }

  skip(rule: string, file: string, reason: string): void {
    this.results.push({ rule, file, status: "skipped", details: [reason] });
  }
}

/**
 * Check inline/image links and reference definitions relative to their document.
 * All local targets are evaluated before throwing an aggregate of that file's errors.
 * Fenced examples, URL schemes and anchor-only links are excluded. Query strings and
 * fragments do not affect lookup; percent-encoded paths are decoded before checking.
 * This focused scanner does not validate arbitrary prose, inline-code paths, Markdown
 * anchors or remote URLs, and is not a complete Markdown parser.
 */
async function links(path: string, boundary: string): Promise<void> {
  const errors: unknown[] = [];
  for (const destination of localMarkdownLinks(await file(path))) {
    try {
      const target = decodeURIComponent(destination);
      if (!target) continue;
      const resolved = resolve(dirname(path), target);
      // Check lexical containment before lookup, then real containment for symlink escapes.
      const offset = relative(boundary, resolved);
      if (offset === ".." || offset.startsWith(`..${sep}`))
        throw new Error(`${path}: link escapes package: ${target}`);
      let actual: string;
      try {
        actual = await realpath(resolved);
      } catch (error: unknown) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
          throw new Error(`${path}: missing local resource "${target}" (expected ${resolved})`, {
            cause: error,
          });
        }
        throw error;
      }
      const actualOffset = relative(await realpath(boundary), actual);
      if (actualOffset === ".." || actualOffset.startsWith(`..${sep}`))
        throw new Error(`${path}: link escapes package: ${target}`);
      // Directory links are useful for browsing; a .md target must be a real file.
      if (target.endsWith(".md") && !(await stat(actual)).isFile())
        throw new Error(`${path}: expected a Markdown file: ${target}`);
    } catch (error: unknown) {
      errors.push(error);
    }
  }
  if (errors.length) throw new AggregateError(errors, `Invalid local links in ${path}`);
}

/** Validate frontmatter separately so malformed metadata does not hide resource errors. */
async function skill(path: string): Promise<void> {
  const source = await file(join(path, "SKILL.md"));
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!frontmatter?.[1]) throw new Error(`${path}/SKILL.md: missing YAML frontmatter`);
  const document = parseDocument(frontmatter[1]);
  if (document.errors.length)
    throw new Error(
      `${path}/SKILL.md: ${document.errors.map((error) => error.message).join("; ")}`,
    );
  const metadata = skillMetadata.parse(document.toJS());
  if (metadata.name !== path.split(sep).at(-1))
    throw new Error(`${path}: skill name must match directory`);
  if (!source.slice(frontmatter[0].length).trim())
    throw new Error(`${path}/SKILL.md: missing instructions`);
}

/** Missing optional configuration is not failure; permission and other I/O errors are. */
async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return false;
    throw error;
  }
}

/** Check provider resources independently; failed MCP schemas only block MCP-dependent comparisons. */
async function connections(
  path: string,
  metadata: z.infer<typeof pluginMetadata>,
  checks: Checks,
): Promise<void> {
  const openAI = metadata.extensions?.["com.openai"];
  for (const field of ["logo", "composerIcon"] as const) {
    const asset = openAI?.interface[field];
    if (!asset) continue;
    const assetPath = resolve(path, asset);
    await checks.run(`Presentation ${field}`, assetPath, async () => {
      await containedFile(assetPath, path);
      const bytes = await readFile(assetPath);
      // File signature only: dimensions, rendering and host acceptance are not checked.
      if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
        throw new Error(`${assetPath}: expected a PNG image`);
    });
  }
  const appReference = openAI?.apps;
  let appValid = true;
  if (appReference) {
    const appPath = resolve(path, appReference);
    const app = await checks.run("Registered app mapping", appPath, async () => {
      await containedFile(appPath, path);
      return appMetadata.parse(await json(appPath));
    });
    appValid = app !== undefined;
  }
  const mcpPath = join(path, "mcp.json");
  const hasMcp = await checks.run("MCP configuration discovery", mcpPath, () => exists(mcpPath));
  const mcp = hasMcp
    ? await checks.run("MCP configuration", mcpPath, async () => {
        await containedFile(mcpPath, path);
        return mcpMetadata.parse(await json(mcpPath));
      })
    : undefined;
  const overlayPath = join(path, ".claude-plugin/plugin.json");
  const hasOverlay = await checks.run("Claude overlay discovery", overlayPath, () =>
    exists(overlayPath),
  );
  if (!hasOverlay) return;
  const overlay = await checks.run("Claude overlay metadata", overlayPath, async () => {
    await containedFile(overlayPath, path);
    return claudePluginMetadata.parse(await json(overlayPath));
  });
  if (!overlay) {
    checks.skip("Claude overlay consistency", overlayPath, "Overlay metadata is invalid.");
    return;
  }
  await checks.run("Claude identity", overlayPath, () => {
    if (
      ["name", "version", "description"].some(
        (key) =>
          overlay[key as "name" | "version" | "description"] !==
          metadata[key as "name" | "version" | "description"],
      )
    )
      throw new Error(`${overlayPath}: identity must match root plugin.json`);
  });
  if (hasMcp === undefined || (hasMcp && !mcp)) {
    checks.skip("Claude MCP consistency", overlayPath, "MCP configuration could not be validated.");
    return;
  }
  if (!hasMcp && !appValid) {
    checks.skip(
      "Claude MCP consistency",
      overlayPath,
      "Registered app mapping could not be validated.",
    );
    return;
  }
  await checks.run("Claude MCP consistency", overlayPath, () => {
    if (mcp) {
      if (Object.keys(overlay.mcpServers).length !== Object.keys(mcp.mcpServers).length)
        throw new Error(`${overlayPath}: MCP servers must match root mcp.json`);
      for (const [serverName, server] of Object.entries(overlay.mcpServers)) {
        if (server.url !== mcp.mcpServers[serverName]?.url)
          throw new Error(`${overlayPath}: MCP endpoint must match root mcp.json`);
      }
    } else if (!appReference || Object.keys(overlay.mcpServers).length === 0) {
      throw new Error(`${overlayPath}: MCP servers require root mcp.json or a registered app`);
    }
  });
}

type MarkdownContext = { boundary: string; referenceSource?: string; skillContainer?: string };

/**
 * Traverse without following symlinks. Each document gets one link result containing
 * all its bad targets; a broken document never prevents checking its neighbors.
 * Shared sources skip link lookup because those paths describe installed copies,
 * but naming and symlink rules still apply. Entering a skill narrows the boundary.
 */
async function markdownFiles(
  path: string,
  context: MarkdownContext,
  checks: Checks,
): Promise<void> {
  const entries = await checks.run("Resource directory", path, () =>
    readdir(path, { withFileTypes: true }),
  );
  if (!entries) return;
  await checks.run("Resource layout", path, () => {
    const errors = entries.flatMap((entry) => {
      const child = join(path, entry.name);
      if (entry.isSymbolicLink())
        return [new Error(`${child}: symlinks are not distributable resources`)];
      if (entry.isDirectory() && entry.name === "references")
        return [new Error(`${child}: use the singular reference/ directory`)];
      return [];
    });
    if (errors.length) throw new AggregateError(errors, `Invalid resource layout in ${path}`);
  });
  const isSource =
    context.referenceSource !== undefined &&
    (path === context.referenceSource || path.startsWith(`${context.referenceSource}${sep}`));
  if (path === context.referenceSource)
    checks.skip(
      "Shared source links",
      path,
      "Links are validated in installed skill copies; no resources are copied here.",
    );
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, "en"))) {
    const child = join(path, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      await markdownFiles(
        child,
        { ...context, boundary: path === context.skillContainer ? child : context.boundary },
        checks,
      );
    } else if (entry.name.endsWith(".md") && !isSource) {
      await checks.run("Markdown links", child, () => links(child, context.boundary));
    }
  }
}

/**
 * Collect independent results without logging, mutation or fail-fast behavior.
 * Invalid inputs skip only dependent checks; other plugins and documents still run.
 * The CLI renders this report before choosing its exit code. Tests and callers can
 * inspect it directly, or use validate() when they need rejection on any failure.
 */
export async function inspect(root: string): Promise<ValidationReport> {
  const checks = new Checks();
  const primaryPath = join(root, ".agents/plugins/marketplace.json");
  const claudePath = join(root, ".claude-plugin/marketplace.json");
  const primary = await checks.run("OpenAI catalog schema", primaryPath, async () =>
    openAICatalog.parse(await json(primaryPath)),
  );
  const claude = await checks.run("Claude catalog schema", claudePath, async () =>
    claudeCatalog.parse(await json(claudePath)),
  );
  if (primary && claude) {
    await checks.run("Marketplace identity", root, () => {
      if (primary.name !== claude.name) throw new Error("Marketplace names must agree");
    });
  } else checks.skip("Marketplace identity", root, "Both catalogs must have valid metadata.");
  if (primary)
    await checks.run("Unique OpenAI entries", primaryPath, () =>
      unique(
        primary.plugins.map((entry) => entry.name),
        "OpenAI catalog",
      ),
    );
  if (claude)
    await checks.run("Unique Claude entries", claudePath, () =>
      unique(
        claude.plugins.map((entry) => entry.name),
        "Claude catalog",
      ),
    );
  const pluginNames = await checks.run("Plugin directories", join(root, "plugins"), () =>
    directories(join(root, "plugins"), checks),
  );
  if (pluginNames) {
    for (const [catalogPath, catalog] of [
      [primaryPath, primary],
      [claudePath, claude],
    ] as const) {
      if (!catalog) {
        checks.skip("Catalog coverage", catalogPath, "Catalog metadata is invalid.");
        continue;
      }
      await checks.run("Catalog coverage", catalogPath, () => {
        if (catalog.plugins.length !== pluginNames.length)
          throw new Error("Catalogs must contain exactly one entry per plugin directory");
      });
    }
    for (const pluginName of pluginNames) {
      const path = join(root, "plugins", pluginName);
      const expected = `./plugins/${pluginName}`;
      if (primary && claude)
        await checks.run("Catalog source agreement", path, () => {
          if (
            primary.plugins.find((entry) => entry.name === pluginName)?.source.path !== expected ||
            claude.plugins.find((entry) => entry.name === pluginName)?.source !== expected
          )
            throw new Error(`${pluginName}: missing or inconsistent catalog source`);
        });
      else checks.skip("Catalog source agreement", path, "Both catalogs must have valid metadata.");
      const manifestPath = join(path, "plugin.json");
      const metadata = await checks.run("Plugin manifest", manifestPath, async () => {
        await containedFile(manifestPath, path);
        const value = pluginMetadata.parse(await json(manifestPath));
        if (value.name !== pluginName) throw new Error(`${path}: plugin name must match directory`);
        return value;
      });
      if (metadata) await connections(path, metadata, checks);
      else checks.skip("Provider configuration", path, "Root plugin metadata is invalid.");
      await checks.run("Plugin README", join(path, "README.md"), () =>
        file(join(path, "README.md")),
      );
      const bundled = await checks.run(
        "Bundled skill directories",
        join(path, "skills"),
        async () => {
          const names = await directories(join(path, "skills"), checks);
          if (!names.length)
            throw new Error(
              `${path}: initial tooling supports skills-based plugins; extend it before introducing MCP-only packages`,
            );
          unique(names, path);
          return names;
        },
      );
      if (bundled)
        for (const skillName of bundled) {
          const skillPath = join(path, "skills", skillName);
          await checks.run("Skill metadata", join(skillPath, "SKILL.md"), () => skill(skillPath));
        }
      else
        checks.skip(
          "Skill metadata",
          join(path, "skills"),
          "Skill directories could not be validated.",
        );
      await markdownFiles(
        path,
        {
          boundary: path,
          referenceSource: join(path, "reference"),
          skillContainer: join(path, "skills"),
        },
        checks,
      );
    }
  } else
    checks.skip(
      "Plugin validation",
      join(root, "plugins"),
      "Plugin directories could not be validated.",
    );
  await checks.run("Distribution layout", root, async () => {
    if ((await readdir(root)).includes("skills"))
      throw new Error(
        "Distributable skills belong inside plugins; root skills/ is not supported by this repository",
      );
  });
  const rootEntries = await checks.run("Repository directory", root, () =>
    readdir(root, { withFileTypes: true }),
  );
  for (const entry of rootEntries?.sort((a, b) => a.name.localeCompare(b.name, "en")) ?? []) {
    if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "TASK.md") {
      const path = join(root, entry.name);
      await checks.run("Markdown links", path, () => links(path, root));
    }
  }
  // Contributor-local .agents/skills remain outside marketplace validation.
  await markdownFiles(join(root, "docs"), { boundary: root }, checks);
  return { results: checks.results };
}

/** Group low-level rules into a small summary while retaining every result internally. */
function reportCategory(rule: string): string {
  if (/catalog|Marketplace|^Unique .* entries/i.test(rule)) return "Catalogs";
  if (/^Plugin|^Content directory|^Distribution|^Repository/.test(rule)) return "Plugin packaging";
  if (/skill/i.test(rule)) return "Skills";
  if (/Resource|Markdown|Shared source/.test(rule)) return "Resources and links";
  return "Provider configuration";
}

/**
 * Summarize categories; expand failures individually and group identical skip reasons.
 * Styling uses consola's environment-aware colors (including NO_COLOR support).
 * Keep styling off by default for callers needing deterministic plain text.
 */
export function formatReport(report: ValidationReport, root: string, styled = false): string {
  const paint = (color: "bold" | "green" | "red" | "yellow" | "dim" | "cyan", text: string) =>
    styled ? colors[color](text) : text;
  const lines = [paint("bold", "Repository validation"), ""];
  const display = (text: string) => text.replaceAll(`${resolve(root)}${sep}`, "");
  const counts = (results: ValidationResult[]) => ({
    passed: results.filter((result) => result.status === "passed").length,
    failed: results.filter((result) => result.status === "failed").length,
    skipped: results.filter((result) => result.status === "skipped").length,
  });
  const categories = new Map<string, ValidationResult[]>();
  for (const result of report.results) {
    const category = reportCategory(result.rule);
    const entries = categories.get(category) ?? [];
    entries.push(result);
    categories.set(category, entries);
  }
  for (const [category, results] of categories) {
    const total = counts(results);
    const status = total.failed
      ? paint("red", "✗")
      : total.skipped
        ? paint("yellow", "–")
        : paint("green", "✓");
    const summary = [
      total.passed ? paint("green", `${total.passed} passed`) : "",
      total.failed ? paint("red", `${total.failed} failed`) : "",
      total.skipped ? paint("yellow", `${total.skipped} skipped`) : "",
    ]
      .filter(Boolean)
      .join(" · ");
    lines.push(`  ${status} ${category.padEnd(24)} ${summary}`);
  }
  const failures = report.results.filter((result) => result.status === "failed");
  if (failures.length) {
    lines.push("", paint("red", `Failed (${failures.length})`));
    for (const result of failures) {
      lines.push(
        `  ${paint("red", "✗")} ${result.rule} — ${paint("cyan", relative(root, result.file) || ".")}`,
      );
      for (const detail of result.details) {
        // The responsible file is already shown in the rule heading.
        const text = display(detail);
        const prefix = `${display(result.file)}: `;
        for (const line of (text.startsWith(prefix) ? text.slice(prefix.length) : text).split(
          "\n",
        )) {
          lines.push(`      ${line}`);
        }
      }
    }
  }
  const skipped = report.results.filter((result) => result.status === "skipped");
  if (skipped.length) {
    lines.push("", paint("yellow", `Skipped (${skipped.length})`));
    const reasons = new Map<string, { rule: string; details: string[]; count: number }>();
    for (const result of skipped) {
      const key = JSON.stringify([result.rule, result.details]);
      const group = reasons.get(key) ?? { rule: result.rule, details: result.details, count: 0 };
      group.count++;
      reasons.set(key, group);
    }
    for (const group of reasons.values()) {
      lines.push(`  ${paint("yellow", "–")} ${group.rule} (${group.count})`);
      for (const detail of group.details) lines.push(`      ${paint("dim", display(detail))}`);
    }
  }
  const total = counts(report.results);
  lines.push(
    "",
    `${total.passed} passed · ${total.failed} failed · ${total.skipped} skipped`,
    paint(total.failed ? "red" : "green", `Result: ${total.failed ? "FAIL" : "PASS"}`),
  );
  return lines.join("\n");
}

/** Preserve the throwing API for callers/tests, with all failures available in the error. */
export async function validate(root: string): Promise<void> {
  const report = await inspect(root);
  const failures = report.results.filter((result) => result.status === "failed");
  if (failures.length) {
    const errors = failures.map(
      (failure) => new Error(`${failure.file}: ${failure.rule}: ${failure.details.join("; ")}`),
    );
    throw new AggregateError(errors, errors.map((error) => error.message).join("\n"));
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // Report first, then set a failing exit code without a redundant exception stack.
  const root = fileURLToPath(new URL("../", import.meta.url));
  const logger = createConsola({ fancy: true, level: 3, formatOptions: { date: false } });
  try {
    const report = await inspect(root);
    logger.log(formatReport(report, root, true));
    if (report.results.some((result) => result.status === "failed")) process.exitCode = 1;
  } catch (error: unknown) {
    logger.error("Validation could not complete:", ...diagnostics(error));
    process.exitCode = 1;
  }
}
