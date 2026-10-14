import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
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
