import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  applyResourceUpdates,
  planReferences,
  referenceTree,
  syncReferences,
} from "./sync-references.ts";

/** Real files exercise the source/installed boundary without touching the checkout. */
async function fixture(run: (root: string) => Promise<void>): Promise<void> {
  const root = await mkdtemp(join(tmpdir(), "agents-reference-test-"));
  try {
    await mkdir(join(root, "plugins/editor/reference"), { recursive: true });
    await put(
      root,
      "plugins/editor/skills/first/SKILL.md",
      "# First\n\n[Shared](reference/shared.md)\n[Private](reference/private.md)\n",
    );
    await put(
      root,
      "plugins/editor/skills/first/reference/private.md",
      "# Private\n\n[Extra](extra.md)\n",
    );
    await put(
      root,
      "plugins/editor/skills/second/SKILL.md",
      "# Second\n\n[Extra](reference/extra.md)\n",
    );
    await put(
      root,
      "plugins/editor/reference/shared.md",
      "# Shared\n\n[Extra](extra.md)\n![Image](../assets/example.png)\n",
    );
    await put(root, "plugins/editor/reference/extra.md", "# Extra\n");
    await put(root, "plugins/editor/reference/unused.md", "# Unused\n");
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

/** Create a fixture file while retaining explicit repository-relative test paths. */
async function put(root: string, path: string, content: string): Promise<void> {
  const parts = path.split("/");
  parts.pop();
  await mkdir(join(root, ...parts), { recursive: true });
  await writeFile(join(root, path), content);
}
const skill = "plugins/editor/skills/first";

test("copies only reachable references, follows private/transitive links and cycles, and is idempotent", async () => {
  await fixture(async (root) => {
    await put(root, "plugins/editor/reference/extra.md", "# Extra\n\n[Shared](shared.md)\n");
    await syncReferences(root);
    for (const name of ["first", "second"]) {
      for (const file of ["shared.md", "extra.md"]) {
        assert.equal(
          await readFile(join(root, `plugins/editor/skills/${name}/reference/${file}`), "utf8"),
          await readFile(join(root, `plugins/editor/reference/${file}`), "utf8"),
        );
      }
      await assert.rejects(access(join(root, `plugins/editor/skills/${name}/reference/unused.md`)));
    }
    assert.equal(
      await readFile(join(root, `${skill}/reference/private.md`), "utf8"),
      "# Private\n\n[Extra](extra.md)\n",
    );
    assert.deepEqual(await syncReferences(root), []);
    await put(root, "plugins/editor/reference/shared.md", "# Changed source\n");
    await syncReferences(root);
    assert.equal(
      await readFile(join(root, `${skill}/reference/shared.md`), "utf8"),
      "# Changed source\n",
    );
    assert.deepEqual(await syncReferences(root, true), []);
  });
});

test("each skill gets its own dependency subset and stale owned copies are removed safely", async () => {
  await fixture(async (root) => {
    await syncReferences(root);
    await assert.rejects(access(join(root, "plugins/editor/skills/second/reference/shared.md")));
    await put(root, `${skill}/SKILL.md`, "# First\n\n[Private](reference/private.md)\n");
    await syncReferences(root);
    await assert.rejects(access(join(root, `${skill}/reference/shared.md`)));
    assert.equal(await readFile(join(root, `${skill}/reference/extra.md`), "utf8"), "# Extra\n");
    await put(root, `${skill}/reference/private.md`, "# Private\n");
    await syncReferences(root);
    await assert.rejects(access(join(root, `${skill}/reference/extra.md`)));
    await assert.rejects(access(join(root, `${skill}/.reference-manifest.json`)));
    assert.equal(
      await readFile(join(root, `${skill}/reference/private.md`), "utf8"),
      "# Private\n",
    );
  });
});

test("drift checks and invalid graphs never write partial copies or perform cleanup", async () => {
  await fixture(async (root) => {
    await assert.rejects(syncReferences(root, true), /migration is out of date/);
    await assert.rejects(access(join(root, `${skill}/reference/shared.md`)));
    await put(root, "plugins/editor/reference/extra.md", "# Extra\n\n[Missing](missing.md)\n");
    await assert.rejects(syncReferences(root), /missing Markdown reference or canonical source/);
    await assert.rejects(access(join(root, `${skill}/reference/shared.md`)));
    await assert.rejects(access(join(root, `${skill}/.reference-manifest.json`)));
  });
});

test("private conflicts and edited generated files are preserved rather than overwritten or deleted", async () => {
  await fixture(async (root) => {
    await put(root, `${skill}/reference/shared.md`, "# A private file with the same name\n");
    await assert.rejects(syncReferences(root), /refusing to overwrite/);
    const canonical = await readFile(join(root, "plugins/editor/reference/shared.md"), "utf8");
    // Identical existing copies can be adopted during the initial rollout.
    await put(root, `${skill}/reference/shared.md`, canonical);
    await syncReferences(root);
    await put(root, `${skill}/reference/shared.md`, "# Local edit\n");
    await assert.rejects(syncReferences(root), /refusing to overwrite/);
    await put(root, `${skill}/SKILL.md`, "# First\n\n[Private](reference/private.md)\n");
    await assert.rejects(syncReferences(root), /refusing to delete a modified/);
    assert.equal(
      await readFile(join(root, `${skill}/reference/shared.md`), "utf8"),
      "# Local edit\n",
    );
  });
});

test("a required deleted source fails instead of silently treating its old generated copy as private", async () => {
  await fixture(async (root) => {
    await syncReferences(root);
    await rm(join(root, "plugins/editor/reference/shared.md"));
    await assert.rejects(syncReferences(root), /generated reference has no canonical source/);
    await put(root, `${skill}/SKILL.md`, "# First\n\n[Private](reference/private.md)\n");
    await syncReferences(root);
    await assert.rejects(access(join(root, `${skill}/reference/shared.md`)));
  });
});

test("traversal, malicious ledgers and symlinked sources/targets fail within package boundaries", async () => {
  await fixture(async (root) => {
    for (const target of ["../../reference/extra.md", "reference/%2e%2e/%2e%2e/other.md"]) {
      await put(root, `${skill}/SKILL.md`, `# First\n\n[Escape](${target})\n`);
      await assert.rejects(syncReferences(root), /escapes skill root/);
    }
    await put(root, `${skill}/SKILL.md`, "# First\n\n[Shared](reference/shared.md)\n");
    await put(
      root,
      `${skill}/.reference-manifest.json`,
      JSON.stringify({ version: 1, files: { "reference/../../outside.md": "a".repeat(64) } }),
    );
    await assert.rejects(syncReferences(root), /Unsafe resource path/);
    await rm(join(root, `${skill}/.reference-manifest.json`));
    await symlink(
      join(root, "plugins/editor/reference/shared.md"),
      join(root, `${skill}/reference/shared.md`),
    );
    await assert.rejects(referenceTree(root), /symlinks are not supported/);
    await rm(join(root, `${skill}/reference/shared.md`));
    const updates = await planReferences(await referenceTree(root));
    await mkdir(join(root, "outside"));
    await rm(join(root, `${skill}/reference`), { recursive: true });
    await symlink(join(root, "outside"), join(root, `${skill}/reference`));
    await assert.rejects(
      applyResourceUpdates(root, updates),
      /refusing to write through a symlink/,
    );
    await assert.rejects(access(join(root, "outside/shared.md")));
  });
});
