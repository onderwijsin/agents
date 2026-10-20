import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  access,
  mkdtemp,
  mkdir,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { stripAnsi } from "consola/utils";
import { formatReport, inspect, validate } from "./validate.js";

/** Create an isolated empty scaffold for a validator contract test. */
async function fixture(run: (root: string) => Promise<void>): Promise<void> {
  const root = await mkdtemp(join(tmpdir(), "agents-validation-"));
  try {
    for (const path of [".agents/plugins", ".claude-plugin", "plugins", "docs"]) {
      await mkdir(join(root, path), { recursive: true });
    }
    await writeFile(
      join(root, ".agents/plugins/marketplace.json"),
      JSON.stringify({ name: "test", interface: { displayName: "Test" }, plugins: [] }),
    );
    await writeFile(
      join(root, ".claude-plugin/marketplace.json"),
      JSON.stringify({ name: "test", owner: { name: "Test" }, plugins: [] }),
    );
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

/** Write a bundled skill with supplied metadata for boundary tests. */
async function addSkill(
  root: string,
  metadata: string,
  body = "# Draft\n\nWrite a draft.",
): Promise<void> {
  const plugin = await addPlugin(root);
  const path = join(plugin, "skills", "draft");
  await writeFile(join(path, "SKILL.md"), `---\n${metadata}\n---\n${body}\n`);
}

test("empty catalogs and a single-skill plugin without connections pass", async () => {
  await fixture(async (root) => {
    await validate(root);
    await addSkill(root, "name: draft\ndescription: Write a draft when asked.");
    await validate(root);
  });
});

test("catalog disagreement and unknown fields fail", async () => {
  await fixture(async (root) => {
    await writeFile(
      join(root, ".claude-plugin/marketplace.json"),
      JSON.stringify({ name: "other", owner: { name: "Test" }, plugins: [] }),
    );
    await assert.rejects(validate(root), /names must agree/);
    await writeFile(
      join(root, ".agents/plugins/marketplace.json"),
      JSON.stringify({ name: "test", interface: { displayName: "Test" }, plugins: [], typo: true }),
    );
    await assert.rejects(validate(root), /Unrecognized key/);
  });
});

test("missing plugin files and catalog duplication fail", async () => {
  await fixture(async (root) => {
    const entry = {
      name: "draft",
      source: { source: "local", path: "./plugins/draft" },
      policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
      category: "Productivity",
    };
    await writeFile(
      join(root, ".agents/plugins/marketplace.json"),
      JSON.stringify({ name: "test", interface: { displayName: "Test" }, plugins: [entry, entry] }),
    );
    await assert.rejects(validate(root), /duplicate names/);
    await writeFile(
      join(root, ".agents/plugins/marketplace.json"),
      JSON.stringify({ name: "test", interface: { displayName: "Test" }, plugins: [entry] }),
    );
    await writeFile(
      join(root, ".claude-plugin/marketplace.json"),
      JSON.stringify({
        name: "test",
        owner: { name: "Test" },
        plugins: [{ name: "draft", source: "./plugins/draft" }],
      }),
    );
    await mkdir(join(root, "plugins/draft"));
    await assert.rejects(validate(root), /ENOENT/);
    await writeFile(
      join(root, "plugins/draft/plugin.json"),
      JSON.stringify({
        $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
        name: "draft",
        version: "0.1.0",
        description: "Draft text.",
      }),
    );
    await writeFile(join(root, "plugins/draft/README.md"), "# Draft\n");
    await mkdir(join(root, "plugins/draft/skills"));
    await mkdir(join(root, "plugins/draft/skills/draft"));
    await writeFile(
      join(root, "plugins/draft/skills/draft/SKILL.md"),
      "---\nname: draft\ndescription: Draft text when asked.\n---\n# Draft\n\nWrite text.\n",
    );
    await validate(root);
  });
});

test("invalid skill metadata and missing instructions fail", async () => {
  await fixture(async (root) => {
    await addSkill(root, "name: other\ndescription: Write a draft.");
    await assert.rejects(validate(root), /name must match/);
    await writeFile(
      join(root, "plugins/draft/skills/draft/SKILL.md"),
      "---\nname: draft\ndescription: Draft\nmetadata:\n  version: 1\n---\n# Draft\n",
    );
    await assert.rejects(validate(root), /expected string/);
    await writeFile(
      join(root, "plugins/draft/skills/draft/SKILL.md"),
      "---\nname: draft\ndescription: Draft\n---\n",
    );
    await assert.rejects(validate(root), /missing instructions/);
  });
});

test("broken local links fail but fenced examples are ignored", async () => {
  await fixture(async (root) => {
    await writeFile(join(root, "docs/guide.md"), "# Guide\n\n[Missing](missing.md)\n");
    await assert.rejects(validate(root), /missing local resource/);
    await writeFile(join(root, "docs/guide.md"), "# Guide\n\n```md\n[Example](missing.md)\n```\n");
    await validate(root);
  });
});

test("skill references cannot escape the distributable folder", async () => {
  await fixture(async (root) => {
    await writeFile(join(root, "docs/guide.md"), "# Guide\n");
    await addSkill(
      root,
      "name: draft\ndescription: Write a draft.",
      "# Draft\n\n[External](../../../../docs/guide.md)",
    );
    await assert.rejects(validate(root), /link escapes package/);
  });
});

/** Create an installed skill with its own reference for offline boundary tests. */
async function addPlugin(root: string): Promise<string> {
  const path = join(root, "plugins/draft");
  await mkdir(join(path, "skills/draft"), { recursive: true });
  await mkdir(join(path, "skills/draft/reference"));
  await writeFile(join(path, "README.md"), "# Draft\n");
  await writeFile(join(path, "skills/draft/reference/style.md"), "# Style\n");
  await writeFile(
    join(path, "skills/draft/SKILL.md"),
    "---\nname: draft\ndescription: Draft text.\n---\n# Draft\n\n[Style](reference/style.md)\n",
  );
  await writeFile(
    join(path, "plugin.json"),
    JSON.stringify({
      $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
      name: "draft",
      version: "0.1.0",
      description: "Draft text.",
      extensions: {
        "com.openai": { interface: { displayName: "Draft", shortDescription: "Draft text." } },
      },
    }),
  );
  await writeFile(
    join(root, ".agents/plugins/marketplace.json"),
    JSON.stringify({
      name: "test",
      interface: { displayName: "Test" },
      plugins: [
        {
          name: "draft",
          source: { source: "local", path: "./plugins/draft" },
          policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
          category: "Productivity",
        },
      ],
    }),
  );
  await writeFile(
    join(root, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      name: "test",
      owner: { name: "Test" },
      plugins: [{ name: "draft", source: "./plugins/draft" }],
    }),
  );
  return path;
}

/** Write the supported credential-free remote connection subset. */
async function addMcp(path: string, url = "https://example.com/mcp"): Promise<void> {
  await writeFile(
    join(path, "mcp.json"),
    JSON.stringify({
      $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
      mcpServers: { docs: { type: "streamable-http", url } },
    }),
  );
}

test("skill-local references pass while transitive escapes and symlinks fail", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    await validate(root);
    await writeFile(join(root, "docs/outside.md"), "# Outside\n");
    await writeFile(
      join(path, "skills/draft/reference/style.md"),
      "# Style\n\n[Outside](../../../../../docs/outside.md)\n",
    );
    await assert.rejects(validate(root), /link escapes package/);
    await writeFile(join(path, "skills/draft/reference/style.md"), "# Style\n");
    await symlink(join(root, "docs/outside.md"), join(path, "skills/draft/reference/linked.md"));
    await assert.rejects(validate(root), /symlinks are not distributable/);
  });
});

test("missing skill references fail without copying matching plugin-root sources", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    const installed = join(path, "skills/draft/reference/style.md");
    await mkdir(join(path, "reference"));
    await writeFile(join(path, "reference/style.md"), "# Canonical source\n");
    await rm(installed);
    await assert.rejects(
      validate(root),
      /SKILL\.md: missing local resource "reference\/style\.md"/,
    );
    await assert.rejects(access(installed));
    assert.equal(await readFile(join(path, "reference/style.md"), "utf8"), "# Canonical source\n");
    await writeFile(installed, "# Installed reference\n");
    await validate(root);
  });
});

test("skills cannot fall back to plugin-root or sibling-skill resources", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    await mkdir(join(path, "reference"));
    await writeFile(join(path, "reference/style.md"), "# Shared source\n");
    await mkdir(join(path, "skills/other/reference"), { recursive: true });
    await writeFile(
      join(path, "skills/other/SKILL.md"),
      "---\nname: other\ndescription: Another skill.\n---\n# Other\n",
    );
    await writeFile(join(path, "skills/other/reference/style.md"), "# Other\n");
    for (const target of [
      "../../reference/style.md",
      "../other/reference/style.md",
      "reference/../../../reference/style.md",
      "reference/%2e%2e/%2e%2e/%2e%2e/reference/style.md",
    ]) {
      await writeFile(
        join(path, "skills/draft/SKILL.md"),
        `---\nname: draft\ndescription: Draft text.\n---\n# Draft\n\n[Style](${target})\n`,
      );
      await assert.rejects(validate(root), /link escapes package/);
    }
  });
});

test("transitive references, reference-style links and skill-local assets must exist", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    const skill = join(path, "skills/draft");
    await writeFile(
      join(skill, "reference/style.md"),
      "# Style\n\n[Rules][rules]\n\n[rules]: rules%20guide.md?mode=test#section\n",
    );
    await assert.rejects(validate(root), /style\.md: missing local resource "rules guide\.md"/);
    await writeFile(
      join(skill, "reference/rules guide.md"),
      "# Rules\n\n![Example](../assets/example.png)\n",
    );
    await assert.rejects(
      validate(root),
      /rules guide\.md: missing local resource "\.\.\/assets\/example\.png"/,
    );
    await mkdir(join(skill, "assets"));
    await writeFile(join(skill, "assets/example.png"), "fixture image");
    await validate(root);
    await rm(join(skill, "reference/rules guide.md"));
    await mkdir(join(skill, "reference/rules guide.md"));
    await assert.rejects(validate(root), /expected a Markdown file/);
  });
});

test("singular reference directories are enforced for plugin sources and skill resources", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    for (const parent of [path, join(path, "skills/draft")]) {
      const legacy = join(parent, "references");
      await mkdir(legacy);
      await assert.rejects(validate(root), /use the singular reference\/ directory/);
      await rm(legacy, { recursive: true });
    }
  });
});

test("canonical source links are checked in installed context and sources still reject symlinks", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    await mkdir(join(path, "reference"));
    // This link is valid only after installation into the skill's reference/ directory.
    const source = "# Style\n\n![Example](../assets/example.png)\n";
    await writeFile(join(path, "reference/style.md"), source);
    await validate(root);
    await writeFile(join(path, "skills/draft/reference/style.md"), source);
    await assert.rejects(validate(root), /missing local resource "\.\.\/assets\/example\.png"/);
    await mkdir(join(path, "skills/draft/assets"));
    await writeFile(join(path, "skills/draft/assets/example.png"), "fixture image");
    await validate(root);
    await symlink(join(path, "skills/draft/reference/style.md"), join(path, "reference/linked.md"));
    await assert.rejects(validate(root), /symlinks are not distributable/);
  });
});

test("remote MCP enforces HTTPS, transport, schema and credential-free fields", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    await addMcp(path);
    await validate(root);
    for (const url of [
      "http://example.com/mcp",
      "https://user:secret@example.com/mcp",
      "invalid",
    ]) {
      await addMcp(path, url);
      await assert.rejects(validate(root));
    }
    const schema = "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json";
    for (const config of [
      { $schema: "wrong", mcpServers: {} },
      { $schema: schema, mcpServers: {} },
      { $schema: schema, mcpServers: { docs: { type: "http", url: "https://example.com/mcp" } } },
      {
        $schema: schema,
        mcpServers: {
          docs: {
            type: "streamable-http",
            url: "https://example.com/mcp",
            headers: { Authorization: "test-placeholder" },
          },
        },
      },
    ]) {
      await writeFile(join(path, "mcp.json"), JSON.stringify(config));
      await assert.rejects(validate(root));
    }
  });
});

test("Claude overlays must match canonical identity and MCP endpoints", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    await addMcp(path);
    await mkdir(join(path, ".claude-plugin"));
    const overlay = {
      name: "draft",
      version: "0.1.0",
      description: "Draft text.",
      mcpServers: { docs: { type: "http", url: "https://example.com/mcp" } },
    };
    const writeOverlay = async (value: unknown): Promise<void> => {
      await writeFile(join(path, ".claude-plugin/plugin.json"), JSON.stringify(value));
    };
    await writeOverlay(overlay);
    await validate(root);
    for (const field of ["name", "version", "description"]) {
      await writeOverlay({ ...overlay, [field]: field === "version" ? "0.2.0" : "other" });
      await assert.rejects(validate(root), /identity must match/);
    }
    await writeOverlay({ ...overlay, mcpServers: {} });
    await assert.rejects(validate(root), /servers must match/);
    for (const mcpServers of [
      { other: { type: "http", url: "https://example.com/mcp" } },
      { docs: { type: "http", url: "https://other.example.com/mcp" } },
    ]) {
      await writeOverlay({ ...overlay, mcpServers });
      await assert.rejects(validate(root), /endpoint must match/);
    }
    await writeOverlay(overlay);
    await rm(join(path, "mcp.json"));
    await assert.rejects(validate(root), /require root mcp.json or a registered app/);
  });
});

test("registered app references are package-local and support a Claude MCP adapter", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    await writeFile(
      join(path, ".app.json"),
      JSON.stringify({ apps: { docs: { id: "asdk_app_example", required: true } } }),
    );
    const manifest = JSON.parse(await readFile(join(path, "plugin.json"), "utf8")) as Record<
      string,
      unknown
    >;
    manifest.extensions = {
      "com.openai": {
        interface: { displayName: "Draft", shortDescription: "Draft text." },
        apps: "./.app.json",
      },
    };
    await writeFile(
      join(root, "outside.json"),
      JSON.stringify({ apps: { docs: { id: "outside" } } }),
    );
    await writeFile(join(path, "plugin.json"), JSON.stringify(manifest));
    await mkdir(join(path, ".claude-plugin"));
    await writeFile(
      join(path, ".claude-plugin/plugin.json"),
      JSON.stringify({
        name: "draft",
        version: "0.1.0",
        description: "Draft text.",
        mcpServers: { docs: { type: "http", url: "https://example.com/mcp" } },
      }),
    );
    await validate(root);
    manifest.extensions = {
      "com.openai": {
        interface: { displayName: "Draft", shortDescription: "Draft text." },
        apps: "./../../outside.json",
      },
    };
    await writeFile(join(path, "plugin.json"), JSON.stringify(manifest));
    await assert.rejects(validate(root), /reference escapes/);
    manifest.extensions = {
      "com.openai": {
        interface: { displayName: "Draft", shortDescription: "Draft text." },
        apps: "./missing.json",
      },
    };
    await writeFile(join(path, "plugin.json"), JSON.stringify(manifest));
    await assert.rejects(validate(root), /ENOENT/);
  });
});

test("OpenAI presentation rejects empty required fields", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    await writeFile(
      join(path, "plugin.json"),
      JSON.stringify({
        $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
        name: "draft",
        version: "0.1.0",
        description: "Draft text.",
        extensions: {
          "com.openai": { interface: { displayName: " ", shortDescription: "Draft" } },
        },
      }),
    );
    await assert.rejects(validate(root), /Too small/);
  });
});

test("presentation icons require contained PNG assets", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    await writeFile(
      join(path, "plugin.json"),
      JSON.stringify({
        $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
        name: "draft",
        version: "0.2.1",
        description: "Draft text.",
        extensions: {
          "com.openai": {
            interface: {
              displayName: "Draft",
              shortDescription: "Draft text.",
              logo: "./assets/icon.png",
            },
          },
        },
      }),
    );
    await assert.rejects(validate(root), /ENOENT/);
    await mkdir(join(path, "assets"));
    await writeFile(join(path, "assets/icon.png"), "not a PNG");
    await assert.rejects(validate(root), /expected a PNG/);
    await writeFile(
      join(path, "assets/icon.png"),
      Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aH1sAAAAASUVORK5CYII=",
        "base64",
      ),
    );
    await validate(root);
    await rm(join(path, "assets/icon.png"));
    await writeFile(join(root, "outside.png"), "outside");
    await symlink(join(root, "outside.png"), join(path, "assets/icon.png"));
    await assert.rejects(validate(root), /reference escapes/);
  });
});

test("root skills are rejected while repository development skills are outside distribution", async () => {
  await fixture(async (root) => {
    await mkdir(join(root, ".agents/skills/internal"), { recursive: true });
    await writeFile(join(root, ".agents/skills/internal/SKILL.md"), "Contributor instructions");
    await validate(root);
    await mkdir(join(root, "skills"));
    await assert.rejects(validate(root), /Distributable skills belong inside plugins/);
  });
});

test("catalog entries require an existing plugin and matching source", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    const catalogPath = join(root, ".claude-plugin/marketplace.json");
    const catalog = {
      name: "test",
      owner: { name: "Test" },
      plugins: [{ name: "draft", source: "./plugins/missing" }],
    };
    await writeFile(catalogPath, JSON.stringify(catalog));
    await assert.rejects(validate(root), /inconsistent catalog source/);
    catalog.plugins[0]!.source = "./plugins/draft";
    await writeFile(catalogPath, JSON.stringify(catalog));
    await rm(path, { recursive: true });
    await assert.rejects(validate(root), /exactly one entry per plugin/);
  });
});

test("reports include every broken target, successful checks and responsible files", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    await writeFile(
      join(path, "skills/draft/reference/style.md"),
      "# Style\n\n[One](missing-one.md)\n[Two](missing-two.md)\n[Repeated](missing-one.md)\n",
    );
    await writeFile(join(root, "docs/broken.md"), "# Broken\n\n[Three](missing-three.md)\n");
    const report = await inspect(root);
    const failures = report.results.filter((result) => result.status === "failed");
    assert.equal(failures.length, 2);
    assert.equal(failures[0]?.file, join(path, "skills/draft/reference/style.md"));
    assert.equal(failures[0]?.details.length, 2);
    const output = formatReport(report, root);
    for (const target of ["missing-one.md", "missing-two.md", "missing-three.md"])
      assert.ok(output.includes(target));
    assert.match(output, /✓ Plugin packaging\s+\d+ passed/);
    assert.ok(!output.includes("✓ Plugin manifest"));
    assert.ok(!output.includes("✓ Markdown links"));
    assert.ok(!output.includes("plugins/draft/plugin.json"));
    assert.match(output, /Failed \(2\)/);
    assert.match(output, /✗ Resources and links\s+\d+ passed · 2 failed/);
    assert.match(output, /✗ Markdown links — docs\/broken.md/);
    assert.ok(output.endsWith("Result: FAIL"));
    assert.ok(!output.includes(root));
    await assert.rejects(validate(root), (error: unknown) => {
      assert.ok(error instanceof AggregateError);
      assert.equal(error.errors.length, 2);
      assert.match(error.message, /missing-three.md/);
      return true;
    });
  });
});

test("invalid metadata skips dependent checks while resources and neighboring plugins still run", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    await writeFile(join(root, "plugins/not-a-directory.txt"), "invalid entry");
    await writeFile(join(root, ".agents/plugins/marketplace.json"), "{invalid JSON");
    await writeFile(join(path, "plugin.json"), '{"name":"draft"}');
    await writeFile(
      join(path, "skills/draft/SKILL.md"),
      "# No frontmatter\n\n[Missing](reference/missing.md)\n",
    );
    await writeFile(join(root, "docs/valid.md"), "# Valid\n");
    const report = await inspect(root);
    const failed = report.results.filter((result) => result.status === "failed");
    for (const rule of [
      "Content directory name",
      "OpenAI catalog schema",
      "Plugin manifest",
      "Skill metadata",
      "Markdown links",
    ]) {
      assert.ok(
        failed.some((result) => result.rule === rule),
        rule,
      );
    }
    assert.ok(
      report.results.some(
        (result) => result.rule === "Provider configuration" && result.status === "skipped",
      ),
    );
    assert.ok(
      report.results.some(
        (result) => result.file === join(root, "docs/valid.md") && result.status === "passed",
      ),
    );
    const output = formatReport(report, root);
    assert.match(output, /Skipped \(/);
    assert.match(output, /Root plugin metadata is invalid/);
    assert.match(output, /version:/);
  });
});

test("CLI prints the complete report before exiting successfully or unsuccessfully", async () => {
  await fixture(async (root) => {
    await mkdir(join(root, "scripts"));
    const script = join(root, "scripts/validate.ts");
    await writeFile(script, await readFile(new URL("validate.ts", import.meta.url)));
    await writeFile(
      join(root, "scripts/markdown-links.ts"),
      await readFile(new URL("markdown-links.ts", import.meta.url)),
    );
    await symlink(
      fileURLToPath(new URL("../node_modules", import.meta.url)),
      join(root, "node_modules"),
    );
    // Node resolves module URLs through macOS's /var -> /private/var alias.
    const canonicalScript = await realpath(script);
    const run = (color = false) => {
      const env = { ...process.env };
      delete env.NO_COLOR;
      delete env.FORCE_COLOR;
      env[color ? "FORCE_COLOR" : "NO_COLOR"] = "1";
      return spawnSync(process.execPath, [canonicalScript], {
        cwd: root,
        encoding: "utf8",
        env,
      });
    };
    const passed = run();
    assert.equal(passed.status, 0, passed.stderr);
    assert.match(passed.stdout, /✓ Catalogs\s+\d+ passed/);
    assert.match(passed.stdout, /0 failed/);
    assert.ok(!passed.stdout.includes("Failed (0)"));
    assert.ok(!passed.stdout.includes(".agents/plugins/marketplace.json"));
    assert.ok(passed.stdout.trimEnd().endsWith("Result: PASS"));
    await writeFile(join(root, "docs/first.md"), "# First\n\n[Missing](first-missing.md)\n");
    await writeFile(join(root, "docs/second.md"), "# Second\n\n[Missing](second-missing.md)\n");
    const failed = run();
    assert.equal(failed.status, 1);
    assert.match(failed.stdout, /first-missing.md/);
    assert.match(failed.stdout, /second-missing.md/);
    assert.ok(failed.stdout.trimEnd().endsWith("Result: FAIL"));
    assert.equal(failed.stderr, "");
    assert.equal(stripAnsi(failed.stdout), failed.stdout);
    const colored = run(true);
    assert.equal(colored.status, 1);
    assert.notEqual(stripAnsi(colored.stdout), colored.stdout);
    assert.equal(stripAnsi(colored.stdout), failed.stdout);
  });
});
