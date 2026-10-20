import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parseDocument } from "yaml";
import {
  bumpVersion,
  planPreparation,
  planRelease,
  prepareCommit,
  releaseTags,
  selectBump,
} from "./release.js";

/** Run fixture Git commands without involving the contributor's checkout or hooks. */
function git(root: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

/** Commit one fixture snapshot and return its immutable object ID. */
function snapshot(root: string): string {
  git(root, "add", ".");
  git(root, "commit", "--quiet", "--allow-empty", "-m", "fixture");
  return git(root, "rev-parse", "HEAD");
}

/** Write a representative canonical manifest and both supported provider overlays. */
async function plugin(root: string, name: string, version: string): Promise<void> {
  for (const prefix of ["", ".claude-plugin/", ".codex-plugin/"]) {
    const directory = join(root, "plugins", name, prefix);
    await mkdir(directory, { recursive: true });
    await writeFile(
      join(directory, "plugin.json"),
      JSON.stringify({ name, version, description: "Fixture" }, null, 2) + "\n",
    );
  }
  await writeFile(join(root, "plugins", name, "SKILL.md"), "Original\n");
}

/** Exercise release boundaries in a real disposable Git repository. */
async function fixture(run: (root: string, base: string) => Promise<void>): Promise<void> {
  const root = await mkdtemp(join(tmpdir(), "agents-release-test-"));
  try {
    git(root, "init", "--quiet");
    git(root, "config", "user.name", "Fixture");
    git(root, "config", "user.email", "fixture@example.org");
    git(root, "config", "core.hooksPath", "/dev/null");
    await plugin(root, "alpha", "1.2.3");
    await plugin(root, "beta", "0.4.5");
    await run(root, snapshot(root));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("SemVer increments reset lower components, including explicit breaking changes before 1.0", () => {
  assert.equal(bumpVersion("1.2.3", "patch"), "1.2.4");
  assert.equal(bumpVersion("1.2.3", "minor"), "1.3.0");
  assert.equal(bumpVersion("0.4.5", "major"), "1.0.0");
  for (const version of ["01.2.3", "1.2", "1.2.3-rc.1", "1.2.3+build", "foo"]) {
    assert.throws(() => bumpVersion(version, "patch"), /stable SemVer/);
  }
});

test("patch default, global labels, scoped overrides and conflict errors", () => {
  assert.equal(selectBump([], "alpha"), "patch");
  assert.equal(selectBump(["release:minor"], "alpha"), "minor");
  assert.equal(selectBump(["release:major", "release:alpha:patch"], "alpha"), "patch");
  assert.equal(selectBump(["release:major", "release:alpha:patch"], "beta"), "major");
  assert.throws(() => selectBump(["release:minor", "release:major"], "alpha"), /conflicting/);
  assert.throws(
    () => selectBump(["release:alpha:patch", "release:alpha:major"], "alpha"),
    /conflicting/,
  );
});

test("a changed plugin updates all manifests once and leaves other plugins and working files intact", async () => {
  await fixture(async (root, base) => {
    await writeFile(join(root, "plugins/alpha/SKILL.md"), "Changed\n");
    const head = snapshot(root);
    const plan = planRelease(root, base, head);
    assert.deepEqual(plan.versions, { alpha: "1.2.4" });
    assert.equal(plan.updates.length, 3);
    const prepared = await prepareCommit(root, head, plan.updates);
    assert.equal(git(root, "rev-parse", "HEAD"), head);
    assert.equal(git(root, "status", "--porcelain"), "");
    assert.equal(
      JSON.parse(await readFile(join(root, "plugins/alpha/plugin.json"), "utf8")).version,
      "1.2.3",
    );
    assert.equal(git(root, "rev-parse", `${prepared}^`), head);
    assert.equal(planRelease(root, base, prepared).updates.length, 0);
    assert.equal(await prepareCommit(root, prepared, []), prepared);
    assert.deepEqual(releaseTags(root, base, prepared), ["alpha@1.2.4"]);
    git(root, "tag", "alpha@1.2.4", prepared);
    assert.equal(git(root, "rev-parse", "alpha@1.2.4"), prepared);
    assert.equal(planRelease(root, base, prepared, ["release:minor"]).versions.alpha, "1.3.0");
    // A later content change in the same PR still receives only one bump from base.
    git(root, "reset", "--hard", prepared);
    await writeFile(join(root, "plugins/alpha/SKILL.md"), "Changed again\n");
    const again = snapshot(root);
    assert.equal(planRelease(root, base, again).updates.length, 0);
  });
});

test("multiple plugins, binary assets and plugin documentation are independently versioned", async () => {
  await fixture(async (root, base) => {
    await writeFile(join(root, "plugins/alpha/image.png"), Buffer.from([0, 1, 2, 3]));
    await writeFile(join(root, "plugins/beta/README.md"), "Documentation\n");
    const head = snapshot(root);
    assert.deepEqual(
      planRelease(root, base, head, ["release:minor", "release:beta:major"]).versions,
      {
        alpha: "1.3.0",
        beta: "1.0.0",
      },
    );
  });
});

test("repository docs and tooling create no release; version-only edits are restored", async () => {
  await fixture(async (root, base) => {
    await writeFile(join(root, "README.md"), "Repository documentation\n");
    const docs = snapshot(root);
    assert.deepEqual(planRelease(root, base, docs), { updates: [], versions: {} });
    assert.deepEqual(releaseTags(root, base, docs), []);
    await plugin(root, "alpha", "9.0.0");
    const head = snapshot(root);
    const plan = planRelease(root, base, head);
    assert.deepEqual(plan.versions, {});
    assert.equal(plan.updates.length, 3);
    const prepared = await prepareCommit(root, head, plan.updates);
    assert.deepEqual(releaseTags(root, base, prepared), []);
  });
});

test("new plugins preserve initial versions and removed plugins are not released", async () => {
  await fixture(async (root, base) => {
    await plugin(root, "gamma", "0.1.0");
    await rm(join(root, "plugins/beta"), { recursive: true });
    const head = snapshot(root);
    assert.deepEqual(planRelease(root, base, head), { updates: [], versions: { gamma: "0.1.0" } });
    assert.deepEqual(releaseTags(root, base, head), ["gamma@0.1.0"]);
  });
});

test("missing manifests, invalid labels, symlinks and stale bases fail rather than release guessed versions", async () => {
  await fixture(async (root, base) => {
    await writeFile(join(root, "plugins/alpha/SKILL.md"), "Changed\n");
    const head = snapshot(root);
    assert.throws(() => planRelease(root, base, head, ["release:minro"]), /Invalid release label/);
    assert.throws(() => planRelease(root, head, base));
    await rm(join(root, "plugins/alpha/plugin.json"));
    assert.throws(() => planRelease(root, base, snapshot(root)), /plugin.json missing/);
    git(root, "reset", "--hard", head);
    git(
      root,
      "update-index",
      "--cacheinfo",
      "120000",
      git(root, "hash-object", "-w", "--stdin"),
      "plugins/alpha/plugin.json",
    );
    git(root, "commit", "--quiet", "-m", "symlink");
    assert.throws(() => planRelease(root, base, "HEAD"), /regular file/);
  });
});

test("the tagging workflow publishes to a remote, tolerates retries and refuses collisions", async () => {
  await fixture(async (root, base) => {
    await mkdir(join(root, "scripts"));
    await writeFile(
      join(root, "scripts/release.ts"),
      await readFile(new URL("release.ts", import.meta.url)),
    );
    await writeFile(join(root, "plugins/alpha/SKILL.md"), "Changed\n");
    const head = snapshot(root);
    const prepared = await prepareCommit(root, head, planRelease(root, base, head).updates);
    git(root, "reset", "--hard", prepared);
    const remote = join(root, "remote.git");
    git(root, "init", "--bare", "--quiet", remote);
    git(root, "remote", "add", "origin", remote);
    git(root, "push", "--quiet", "origin", `${prepared}:refs/heads/main`);
    await mkdir(join(root, "bin"));
    // Authentication is irrelevant for this local-only remote.
    await writeFile(join(root, "bin/gh"), "#!/bin/sh\nexit 0\n", { mode: 0o755 });
    const workflow = parseDocument(
      await readFile(new URL("../.github/workflows/release.yml", import.meta.url), "utf8"),
    ).toJS() as {
      jobs: { tag: { steps: { run?: string }[] } };
    };
    const script = workflow.jobs.tag.steps.find((step) => step.run)?.run;
    assert.ok(script);
    const run = () =>
      execFileSync("bash", ["-e", "-o", "pipefail", "-c", script], {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          BEFORE: base,
          AFTER: prepared,
          RUNNER_TEMP: root,
          PATH: `${join(root, "bin")}:${process.env.PATH}`,
        },
        stdio: ["ignore", "pipe", "pipe"],
      });
    run();
    assert.equal(git(root, "--git-dir", remote, "rev-parse", "alpha@1.2.4"), prepared);
    run();
    // Simulate a conflicting remote tag without ever force-pushing a real repository.
    git(root, "--git-dir", remote, "update-ref", "refs/tags/alpha@1.2.4", base);
    assert.throws(run, /Tag collision: alpha@1.2.4/);
    assert.equal(git(root, "--git-dir", remote, "rev-parse", "alpha@1.2.4"), base);
  });
});

test("release preparation migrates before versioning and commits resources, deletions and versions together", async () => {
  await fixture(async (root) => {
    await mkdir(join(root, "plugins/alpha/skills/draft"), { recursive: true });
    await mkdir(join(root, "plugins/alpha/reference"));
    await writeFile(join(root, "plugins/alpha/reference/style.md"), "# Style\n");
    await writeFile(
      join(root, "plugins/alpha/skills/draft/SKILL.md"),
      "# Draft\n\n[Style](reference/style.md)\n",
    );
    const base = snapshot(root);
    await writeFile(join(root, "README.md"), "Tooling-only PR\n");
    const head = snapshot(root);
    assert.deepEqual(planRelease(root, base, head).versions, {});
    const plan = await planPreparation(root, base, head);
    assert.deepEqual(plan.versions, { alpha: "1.2.4" });
    const prepared = await prepareCommit(root, head, plan.updates);
    assert.equal(git(root, "rev-parse", `${prepared}^`), head);
    assert.equal(
      git(root, "show", `${prepared}:plugins/alpha/skills/draft/reference/style.md`),
      "# Style",
    );
    assert.equal(
      JSON.parse(git(root, "show", `${prepared}:plugins/alpha/plugin.json`)).version,
      "1.2.4",
    );
    assert.deepEqual((await planPreparation(root, base, prepared)).updates, []);
    assert.equal(git(root, "status", "--porcelain"), "");
    git(root, "reset", "--hard", prepared);
    await writeFile(join(root, "plugins/alpha/skills/draft/SKILL.md"), "# Draft\n");
    const edited = snapshot(root);
    const cleanup = await planPreparation(root, base, edited);
    assert.ok(
      cleanup.updates.some(
        (update) => update.path.endsWith("reference/style.md") && update.content === null,
      ),
    );
    const cleaned = await prepareCommit(root, edited, cleanup.updates);
    assert.equal(
      git(root, "ls-tree", cleaned, "--", "plugins/alpha/skills/draft/reference/style.md"),
      "",
    );
    assert.equal(git(root, "rev-parse", `${cleaned}^`), edited);
  });
});

test("CI requires committed migration output before resource validation", async () => {
  const workflow = parseDocument(
    await readFile(new URL("../.github/workflows/prepare-release.yml", import.meta.url), "utf8"),
  ).toJS() as {
    jobs: { validate: { steps: { name?: string; run?: string }[] } };
  };
  const steps = workflow.jobs.validate.steps;
  const migrate = steps.findIndex((step) => step.name === "Migrate references");
  const committed = steps.findIndex((step) => step.name === "Require committed migration output");
  const validate = steps.findIndex((step) => step.name === "Validate migrated resources");
  assert.ok(migrate >= 0 && migrate < committed && committed < validate);
  assert.match(steps[committed]?.run ?? "", /git diff --exit-code/);
  assert.match(steps[committed]?.run ?? "", /git ls-files --others/);
});
