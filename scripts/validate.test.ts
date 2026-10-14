import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { validate } from "./validate.js";

/** Create an isolated empty scaffold for a validator contract test. */
async function fixture(run: (root: string) => Promise<void>): Promise<void> {
  const root = await mkdtemp(join(tmpdir(), "agents-validation-"));
  try {
    for (const path of [".agents/plugins", ".claude-plugin", "plugins", "skills", "docs"]) {
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

/** Write a standalone skill with supplied metadata for boundary tests. */
async function addSkill(
  root: string,
  metadata: string,
  body = "# Draft\n\nWrite a draft.",
): Promise<void> {
  const path = join(root, "skills", "draft");
  await mkdir(path);
  await writeFile(join(path, "README.md"), "# Draft\n");
  await writeFile(join(path, "SKILL.md"), `---\n${metadata}\n---\n${body}\n`);
}

test("empty catalogs and a valid standalone skill pass", async () => {
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
      join(root, "skills/draft/SKILL.md"),
      "---\nname: draft\ndescription: Draft\nmetadata:\n  version: 1\n---\n# Draft\n",
    );
    await assert.rejects(validate(root), /expected string/);
    await writeFile(
      join(root, "skills/draft/SKILL.md"),
      "---\nname: draft\ndescription: Draft\n---\n",
    );
    await assert.rejects(validate(root), /missing instructions/);
  });
});

test("broken local links fail but fenced examples are ignored", async () => {
  await fixture(async (root) => {
    await writeFile(join(root, "docs/guide.md"), "# Guide\n\n[Missing](missing.md)\n");
    await assert.rejects(validate(root), /ENOENT/);
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
      "# Draft\n\n[External](../../docs/guide.md)",
    );
    await assert.rejects(validate(root), /link escapes package/);
  });
});

/** Create a plugin-owned skill and shared reference for offline boundary tests. */
async function addPlugin(root: string): Promise<string> {
  const path = join(root, "plugins/draft");
  await mkdir(join(path, "skills/draft"), { recursive: true });
  await mkdir(join(path, "references"));
  await writeFile(join(path, "README.md"), "# Draft\n");
  await writeFile(join(path, "references/style.md"), "# Style\n");
  await writeFile(
    join(path, "skills/draft/SKILL.md"),
    "---\nname: draft\ndescription: Draft text.\n---\n# Draft\n\n[Style](../../references/style.md)\n",
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

test("bundled shared references pass while escapes and symlinks fail", async () => {
  await fixture(async (root) => {
    const path = await addPlugin(root);
    await validate(root);
    await writeFile(join(root, "docs/outside.md"), "# Outside\n");
    await writeFile(
      join(path, "references/style.md"),
      "# Style\n\n[Outside](../../../docs/outside.md)\n",
    );
    await assert.rejects(validate(root), /link escapes package/);
    await writeFile(join(path, "references/style.md"), "# Style\n");
    await symlink(join(root, "docs/outside.md"), join(path, "references/linked.md"));
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
    await assert.rejects(validate(root), /servers must match/);
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
