import { access, readdir, readFile, realpath, stat } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "yaml";
import { z } from "zod";

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
          }),
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

/** Require a regular file and return its UTF-8 contents. */
async function file(path: string): Promise<string> {
  if (!(await stat(path)).isFile()) throw new Error(`${path}: expected a file`);
  return readFile(path, "utf8");
}

/** List content directories, accepting an empty directory and its .gitkeep. */
async function directories(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true });
  const names: string[] = [];
  for (const entry of entries) {
    if (entry.name === ".gitkeep" && entry.isFile()) continue;
    if (!entry.isDirectory())
      throw new Error(`${join(path, entry.name)}: expected a content directory`);
    name.parse(entry.name);
    names.push(entry.name);
  }
  return names.sort();
}

/** Reject repeated names within a catalog or installable skill scope. */
function unique(names: string[], context: string): void {
  if (new Set(names).size !== names.length) throw new Error(`${context}: duplicate names`);
}

/** Require a referenced file to exist and stay inside its distribution boundary. */
async function containedFile(path: string, boundary: string): Promise<void> {
  const actual = await realpath(path);
  const root = await realpath(boundary);
  const offset = relative(root, actual);
  if (offset === ".." || offset.startsWith(`..${sep}`)) {
    throw new Error(`${path}: reference escapes ${boundary}`);
  }
  await file(actual);
}

/** Check inline and reference-style Markdown file links, excluding fenced examples. */
async function links(path: string, boundary: string): Promise<void> {
  const content = (await file(path)).replace(/^(`{3,}|~{3,}).*\n[\s\S]*?^\1[^\n]*$/gm, "");
  const destinations = [
    ...content.matchAll(/!?\[[^\]\n]*\]\(<?([^\s)>]+)>?(?:\s+["'][^\n]*["'])?\)/g),
    ...content.matchAll(/^\s*\[[^\]]+\]:\s*<?([^\s>]+)>?/gm),
  ];
  for (const match of destinations) {
    const destination = match[1];
    if (!destination || /^(?:[a-z][a-z\d+.-]*:|#)/i.test(destination)) continue;
    const target = decodeURIComponent(destination.split(/[?#]/)[0] ?? "");
    if (!target) continue;
    const resolved = resolve(dirname(path), target);
    const actual = await realpath(resolved);
    const offset = relative(await realpath(boundary), actual);
    if (offset === ".." || offset.startsWith(`..${sep}`))
      throw new Error(`${path}: link escapes package: ${target}`);
    // Directory links are valid for browsing the repository.
    await stat(actual);
  }
}

/** Validate skill frontmatter and package-local references. */
async function skill(path: string, boundary = path): Promise<void> {
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
  await markdownFiles(path, boundary);
}

/** Validate optional connection files and require the Claude overlay to match canonical settings. */
async function connections(path: string, metadata: z.infer<typeof pluginMetadata>): Promise<void> {
  const hasFile = async (target: string): Promise<boolean> => {
    try {
      await access(target);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") return false;
      throw error;
    }
  };
  const mcpPath = join(path, "mcp.json");
  const overlayPath = join(path, ".claude-plugin/plugin.json");
  const hasMcp = await hasFile(mcpPath);
  if (hasMcp) await containedFile(mcpPath, path);
  const mcp = hasMcp ? mcpMetadata.parse(await json(mcpPath)) : undefined;
  if (await hasFile(overlayPath)) {
    await containedFile(overlayPath, path);
    const overlay = claudePluginMetadata.parse(await json(overlayPath));
    if (
      ["name", "version", "description"].some(
        (key) =>
          overlay[key as "name" | "version" | "description"] !==
          metadata[key as "name" | "version" | "description"],
      )
    )
      throw new Error(`${overlayPath}: identity must match root plugin.json`);
    if (!mcp || Object.keys(overlay.mcpServers).length !== Object.keys(mcp.mcpServers).length)
      throw new Error(`${overlayPath}: MCP servers must match root mcp.json`);
    for (const [serverName, server] of Object.entries(overlay.mcpServers)) {
      if (server.url !== mcp.mcpServers[serverName]?.url)
        throw new Error(`${overlayPath}: MCP endpoint must match root mcp.json`);
    }
  }
}

/** Recursively validate Markdown links without following symlinked resources. */
async function markdownFiles(path: string, boundary: string): Promise<void> {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isSymbolicLink())
      throw new Error(`${child}: symlinks are not distributable resources`);
    if (entry.isDirectory()) await markdownFiles(child, boundary);
    else if (entry.name.endsWith(".md")) await links(child, boundary);
  }
}

/** Validate the repository's documented local catalog and content contracts. */
export async function validate(root: string): Promise<void> {
  const primary = openAICatalog.parse(await json(join(root, ".agents/plugins/marketplace.json")));
  const claude = claudeCatalog.parse(await json(join(root, ".claude-plugin/marketplace.json")));
  if (primary.name !== claude.name) throw new Error("Marketplace names must agree");
  unique(
    primary.plugins.map((entry) => entry.name),
    "OpenAI catalog",
  );
  unique(
    claude.plugins.map((entry) => entry.name),
    "Claude catalog",
  );
  const pluginNames = await directories(join(root, "plugins"));
  if (
    primary.plugins.length !== pluginNames.length ||
    claude.plugins.length !== pluginNames.length
  ) {
    throw new Error("Catalogs must contain exactly one entry per plugin directory");
  }
  for (const pluginName of pluginNames) {
    const expected = `./plugins/${pluginName}`;
    if (
      primary.plugins.find((entry) => entry.name === pluginName)?.source.path !== expected ||
      claude.plugins.find((entry) => entry.name === pluginName)?.source !== expected
    ) {
      throw new Error(`${pluginName}: missing or inconsistent catalog source`);
    }
    const path = join(root, "plugins", pluginName);
    await containedFile(join(path, "plugin.json"), path);
    const metadata = pluginMetadata.parse(await json(join(path, "plugin.json")));
    if (metadata.name !== pluginName) throw new Error(`${path}: plugin name must match directory`);
    await connections(path, metadata);
    await file(join(path, "README.md"));
    const bundled = await directories(join(path, "skills"));
    if (!bundled.length)
      throw new Error(
        `${path}: initial tooling supports skills-based plugins; extend it before introducing MCP-only packages`,
      );
    unique(bundled, path);
    for (const skillName of bundled) await skill(join(path, "skills", skillName), path);
    await markdownFiles(path, path);
  }
  for (const skillName of await directories(join(root, "skills"))) {
    const path = join(root, "skills", skillName);
    await file(join(path, "README.md"));
    await skill(path);
  }
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "TASK.md")
      await links(join(root, entry.name), root);
  }
  await markdownFiles(join(root, "docs"), root);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL("../", import.meta.url));
  try {
    await validate(root);
    console.log("Repository validation passed (catalogs, content, and local Markdown file links).");
  } catch (error: unknown) {
    console.error(
      "Repository validation failed:",
      error instanceof Error ? error.message : String(error),
    );
    process.exitCode = 1;
  }
}
