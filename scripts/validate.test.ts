import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  access,
  lstat,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
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
    await inventoryReadme(root);
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

/** Seed readable inventories; individual tests mutate them to exercise drift detection. */
async function inventoryReadme(root: string): Promise<void> {
  const lines = ["# Collection", ""];
  for (const [directory, heading, label, filename] of [
    ["plugins", "Plugins", "Name", "README.md"],
    ["skills", "Skills", "Name", "SKILL.md"],
    ["agents", "Workspace agents", "Agent", "README.md"],
  ] as const) {
    lines.push(`## ${heading}`, "", `| ${label} | Purpose |`, "| --- | --- |");
    let entries: string[];
    try {
      entries = await readdir(join(root, directory));
    } catch (error: unknown) {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
      entries = [];
    }
    for (const id of entries.sort())
      lines.push(`| [${id}](${directory}/${id}/${filename}) | Purpose. |`);
    lines.push("");
  }
  await writeFile(join(root, "README.md"), lines.join("\n"));
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

test("validation removes only regular .DS_Store files in enumerated directories", async () => {
  await fixture(async (root) => {
    const plugin = await addPlugin(root);
    const agent = await addWorkspaceAgent(root);
    const directories = [
      root,
      join(root, "plugins"),
      plugin,
      join(plugin, "skills"),
      join(plugin, "skills/draft/reference"),
      join(root, "skills"),
      join(root, "skills/shared/references"),
      join(root, "agents"),
      agent,
      join(root, "docs"),
    ];
    const kept = join(plugin, "skills/draft/reference/.DS_Store.backup");
    await writeFile(kept, "keep this file");
    for (const directory of directories) await writeFile(join(directory, ".DS_Store"), "Finder");
    const source = join(plugin, "skills/draft/SKILL.md");
    const original = await readFile(source);
    await validate(root);
    for (const directory of directories)
      await assert.rejects(access(join(directory, ".DS_Store")), { code: "ENOENT" });
    assert.equal(await readFile(kept, "utf8"), "keep this file");
    assert.deepEqual(await readFile(source), original);
    await validate(root);
  });
});

test("validation preserves .DS_Store directories and rejects metadata symlinks", async () => {
  await fixture(async (root) => {
    const plugin = await addPlugin(root);
    const target = join(root, "keep.txt");
    const link = join(plugin, "skills/draft/reference/.DS_Store");
    const directory = join(plugin, "skills/.DS_Store");
    await writeFile(target, "keep the target");
    await symlink(target, link);
    await mkdir(directory);
    await writeFile(join(directory, "keep.txt"), "keep the directory contents");
    await assert.rejects(validate(root), /symlinks are not distributable/);
    assert.ok((await lstat(link)).isSymbolicLink());
    assert.equal(await readFile(target, "utf8"), "keep the target");
    assert.equal(
      await readFile(join(directory, "keep.txt"), "utf8"),
      "keep the directory contents",
    );
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
    await inventoryReadme(root);
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
  await inventoryReadme(root);
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
    await validate(root);
  });
});

test("Claude direct MCP validation is independent of OpenAI app mappings", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    const manifestPath = join(path, "plugin.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    manifest.extensions = {
      "com.openai": {
        interface: { displayName: "Draft", shortDescription: "Draft text." },
        apps: "./missing-app.json",
      },
    };
    await writeFile(manifestPath, JSON.stringify(manifest));
    await mkdir(join(path, ".claude-plugin"));
    const overlayPath = join(path, ".claude-plugin/plugin.json");
    const overlay = {
      name: "draft",
      version: "0.1.0",
      description: "Draft text.",
      mcpServers: { docs: { type: "http", url: "https://example.com/mcp" } },
    };
    await writeFile(overlayPath, JSON.stringify(overlay));
    let report = await inspect(root);
    assert.equal(report.results.find((r) => r.rule === "Registered app mapping")?.status, "failed");
    assert.equal(report.results.find((r) => r.rule === "Claude MCP consistency")?.status, "passed");
    await writeFile(
      overlayPath,
      JSON.stringify({
        ...overlay,
        mcpServers: { docs: { type: "http", url: "http://example.com/mcp" } },
      }),
    );
    report = await inspect(root);
    assert.equal(
      report.results.find((r) => r.rule === "Claude overlay metadata")?.status,
      "failed",
    );
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

/** Add one standalone source and a valid agent with each dependency type. */
async function addWorkspaceAgent(root: string, id = "first"): Promise<string> {
  const path = join(root, "agents", id);
  await mkdir(join(path, "apps"), { recursive: true });
  const consumers = (await readdir(join(root, "agents"))).sort();
  await mkdir(join(root, "skills/shared/references"), { recursive: true });
  await writeFile(
    join(root, "skills/shared/SKILL.md"),
    `---\nname: shared\ndescription: Review tasks when asked.\nmetadata:\n  agents: ${JSON.stringify(consumers)}\n---\n# Review\n\n[Policy](references/policy.md)\n`,
  );
  await writeFile(join(root, "skills/shared/references/policy.md"), "# Policy\n");
  await mkdir(join(path, "apps"), { recursive: true });
  await mkdir(join(path, "files"));
  await writeFile(join(path, "README.md"), "# Agent\n");
  await writeFile(join(path, "apps/microsoft_outlook_email.yaml"), "read_actions: true\n");
  await writeFile(join(path, "files/context.md"), "# Context\n");
  await writeFile(
    join(path, "INSTRUCTION.md"),
    "---\nchannel: chatgpt\napps: [microsoft_outlook_email]\nskills: [shared]\nfiles: [context.md]\nmemory: true\n---\n## Role\nReview the selected tasks.\n",
  );
  await inventoryReadme(root);
  return path;
}

test("standalone workspace skills share one source and derive consumers from agent metadata", async () => {
  await fixture(async (root) => {
    await mkdir(join(root, ".agents/skills/internal"), { recursive: true });
    await writeFile(join(root, ".agents/skills/internal/SKILL.md"), "Contributor instructions");
    await addWorkspaceAgent(root);
    await addWorkspaceAgent(root, "second");
    await mkdir(join(root, "skills/unused"));
    await writeFile(
      join(root, "skills/unused/SKILL.md"),
      "---\nname: unused\ndescription: Draft.\nmetadata:\n  agents: []\n---\n# Draft\n",
    );
    await inventoryReadme(root);
    const original = await readFile(join(root, "skills/shared/SKILL.md"));
    await validate(root);
    const report = await inspect(root);
    assert.deepEqual(report.skillConsumers, { shared: ["first", "second"], unused: [] });
    assert.match(formatReport(report, root), /shared: first, second/);
    assert.match(formatReport(report, root), /unused: no declared agents/);
    assert.deepEqual(await readFile(join(root, "skills/shared/SKILL.md")), original);
  });
});

test("workspace metadata.agents requires unique names and matches both sides of the consumer contract", async () => {
  await fixture(async (root) => {
    await addWorkspaceAgent(root);
    const path = join(root, "skills/shared/SKILL.md");
    const source = await readFile(path, "utf8");
    for (const replacement of [
      "agents: []",
      "agents: [unknown-agent]",
      "agents: [first, first]",
      "agents: first",
    ]) {
      await writeFile(path, source.replace('agents: ["first"]', replacement));
      await assert.rejects(validate(root), /Workspace skill (metadata|agent consistency)/);
    }
    await writeFile(path, source.replace('metadata:\n  agents: ["first"]\n', ""));
    await assert.rejects(validate(root), /Workspace skill metadata/);
    await writeFile(path, source);
    const instruction = join(root, "agents/first/INSTRUCTION.md");
    const originalInstruction = await readFile(instruction, "utf8");
    await writeFile(instruction, originalInstruction.replace("skills: [shared]", "skills: []"));
    await assert.rejects(validate(root), /unexpected: first/);
    await writeFile(instruction, originalInstruction);
    await addWorkspaceAgent(root, "second");
    // Array order is immaterial; unrelated metadata retains the string-value contract.
    await writeFile(
      path,
      source.replace('agents: ["first"]', "agents: [second, first]\n  owner: team"),
    );
    await validate(root);
    await writeFile(path, source);
    await assert.rejects(validate(root), /missing: second/);
  });
  await fixture(async (root) => {
    await addSkill(root, "name: draft\ndescription: Draft.\nmetadata:\n  agents: [first]");
    await assert.rejects(validate(root), /expected string/);
  });
});

test("missing workspace skill, app and file dependencies are all reported without plugin fallback", async () => {
  await fixture(async (root) => {
    const path = await addWorkspaceAgent(root);
    await addPlugin(root);
    const instruction = join(path, "INSTRUCTION.md");
    await writeFile(
      instruction,
      (await readFile(instruction, "utf8")).replace(
        "skills: [shared]",
        "skills: [draft, constructor]",
      ),
    );
    await rm(join(path, "apps/microsoft_outlook_email.yaml"));
    await rm(join(path, "files/context.md"));
    const report = await inspect(root);
    const failures = report.results.filter((result) => result.status === "failed");
    for (const rule of [
      "Workspace agent skill dependency",
      "Workspace agent app dependency",
      "Workspace agent file dependency",
    ]) {
      assert.ok(
        failures.some((result) => result.rule === rule && result.file === instruction),
        rule,
      );
    }
    assert.deepEqual(report.skillConsumers.draft, ["first"]);
    assert.deepEqual(report.skillConsumers.constructor, ["first"]);
    const output = formatReport(report, root);
    for (const target of [
      "skills/draft/SKILL.md",
      "apps/microsoft_outlook_email.yaml",
      "files/context.md",
    ])
      assert.ok(output.includes(target), target);
    await assert.rejects(validate(root), /must exist at/);
  });
});

test("invalid agent metadata blocks dependencies but not skill resources or neighboring agents", async () => {
  await fixture(async (root) => {
    const path = await addWorkspaceAgent(root);
    await addWorkspaceAgent(root, "second");
    await writeFile(
      join(path, "INSTRUCTION.md"),
      "---\nchannel: chatgpt\napps: []\nskills: [shared, shared]\nfiles: []\nmemory: 'true'\n---\n## Role\nReview.\n",
    );
    await writeFile(
      join(root, "skills/shared/references/policy.md"),
      "# Policy\n\n[Missing](missing.md)\n",
    );
    const report = await inspect(root);
    assert.ok(
      report.results.some((r) => r.rule === "Workspace agent metadata" && r.status === "failed"),
    );
    assert.ok(
      report.results.some(
        (r) => r.rule === "Workspace agent dependencies" && r.status === "skipped",
      ),
    );
    assert.ok(report.results.some((r) => r.rule === "Markdown links" && r.status === "failed"));
    assert.deepEqual(report.skillConsumers.shared, ["second"]);
    assert.match(formatReport(report, root), /Index may be incomplete/);
    await writeFile(
      join(path, "INSTRUCTION.md"),
      "---\nskills: []\nskills: []\n---\n## Role\nReview.\n",
    );
    await assert.rejects(validate(root), /unique/);
  });
});

test("workspace dependency names reject traversal and dependency targets must be files", async () => {
  await fixture(async (root) => {
    const path = await addWorkspaceAgent(root);
    const instruction = join(path, "INSTRUCTION.md");
    const source = await readFile(instruction, "utf8");
    for (const [before, after] of [
      ["apps: [microsoft_outlook_email]", "apps: [../other]"],
      ["skills: [shared]", "skills: [../shared]"],
      ["files: [context.md]", "files: [../context.md]"],
    ] as const) {
      await writeFile(instruction, source.replace(before, after));
      await assert.rejects(validate(root), /Workspace agent metadata/);
    }
    await writeFile(instruction, source);
    await rm(join(path, "apps/microsoft_outlook_email.yaml"));
    await mkdir(join(path, "apps/microsoft_outlook_email.yaml"));
    await rm(join(path, "files/context.md"));
    await mkdir(join(path, "files/context.md"));
    const report = await inspect(root);
    assert.equal(
      report.results.filter(
        (r) => /Workspace agent (app|file) dependency/.test(r.rule) && r.status === "failed",
      ).length,
      2,
    );
  });
});

test("workspace skills validate metadata and transitive resources without sibling fallbacks", async () => {
  await fixture(async (root) => {
    await addWorkspaceAgent(root);
    await mkdir(join(root, "skills/other"));
    await writeFile(join(root, "skills/other/SKILL.md"), "# Missing metadata\n");
    await writeFile(
      join(root, "skills/shared/references/policy.md"),
      "# Policy\n\n[Other](../../other/SKILL.md)\n",
    );
    await assert.rejects(validate(root), /missing YAML frontmatter/);
    await assert.rejects(validate(root), /link escapes package/);
    await writeFile(
      join(root, "skills/other/SKILL.md"),
      "---\nname: wrong\ndescription: Draft.\nmetadata:\n  agents: []\n---\n# Draft\n",
    );
    await assert.rejects(validate(root), /name must match directory/);
    await rm(join(root, "skills/shared/SKILL.md"));
    await assert.rejects(validate(root), /Workspace agent skill dependency/);
  });
});

test("workspace skills reject symlinks and agent-local skill directories", async () => {
  await fixture(async (root) => {
    const path = await addWorkspaceAgent(root);
    await mkdir(join(path, "skills/shared"), { recursive: true });
    await assert.rejects(validate(root), /not agent-local skills/);
    await rm(join(path, "skills"), { recursive: true });
    await symlink(
      join(root, "skills/shared/references/policy.md"),
      join(root, "skills/shared/references/linked.md"),
    );
    await assert.rejects(validate(root), /symlinks are not distributable/);
    await rm(join(root, "skills/shared/references/linked.md"));
    await symlink(join(root, "skills/shared"), join(root, "skills/alias"));
    await assert.rejects(validate(root), /expected a content directory/);
    await rm(join(root, "skills/alias"));
    await rm(join(path, "apps/microsoft_outlook_email.yaml"));
    await symlink(
      join(root, "skills/shared/references/policy.md"),
      join(path, "apps/microsoft_outlook_email.yaml"),
    );
    await assert.rejects(validate(root), /reference escapes/);
  });
  await fixture(async (root) => {
    await symlink(join(root, "missing"), join(root, "skills"));
    await assert.rejects(validate(root), /expected a real directory/);
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

test("README inventory tables report missing, stale and duplicate entries independently", async () => {
  await fixture(async (root) => {
    await addPlugin(root);
    await addWorkspaceAgent(root);
    const readme = join(root, "README.md");
    const original = await readFile(readme, "utf8");
    await writeFile(
      readme,
      original
        .replace("| [draft](plugins/draft/README.md) | Purpose. |", "")
        .replace(
          "| [shared](skills/shared/SKILL.md) | Purpose. |",
          "| [ghost](skills/ghost/SKILL.md) | Purpose. |",
        )
        .replace(
          "| [first](agents/first/README.md) | Purpose. |",
          "| [first](agents/first/README.md) | Purpose. |\n| [first](agents/first/README.md) | Again. |",
        ),
    );
    const report = await inspect(root);
    const failures = report.results.filter(
      (r) => r.status === "failed" && /^README .* inventory$/.test(r.rule),
    );
    assert.equal(failures.length, 3);
    const output = formatReport(report, root);
    assert.match(output, /missing: draft/);
    assert.match(output, /missing: shared; unexpected: ghost/);
    assert.match(output, /duplicate names/);
    for (const failure of failures) assert.equal(failure.file, readme);
    await writeFile(readme, original);
    await validate(root);
    await validate(relative(process.cwd(), root));
  });
});

test("README inventories require canonical links in the right table, ignoring prose and fenced examples", async () => {
  await fixture(async (root) => {
    await addPlugin(root);
    const readme = join(root, "README.md");
    const original = await readFile(readme, "utf8");
    const row = "| [draft](plugins/draft/README.md) | Purpose. |";
    await writeFile(
      readme,
      original.replace(row, "") +
        `\n[Draft](plugins/draft/README.md)\n\n\`\`\`md\n${row}\n\`\`\`\n`,
    );
    await assert.rejects(validate(root), /missing: draft/);
    await writeFile(
      readme,
      original.replace(row, "| [Draft](plugins/draft/plugin.json) | Purpose. |"),
    );
    await assert.rejects(validate(root), /expected plugins\/<name>\/README.md/);
    await writeFile(readme, original.replace(row, "| Draft | Purpose. |"));
    await assert.rejects(validate(root), /one local entry link/);
    await writeFile(readme, original.replace("## Plugins", "## Packages"));
    await assert.rejects(validate(root), /exactly one "Plugins" section/);
    await writeFile(readme, original.replace("## Skills\n", "## Skills\n\n## Skills\n"));
    await assert.rejects(validate(root), /exactly one "Skills" section/);
    await rm(readme);
    await assert.rejects(validate(root), /README inventory source/);
  });
});
