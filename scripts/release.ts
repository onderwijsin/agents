import { execFileSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ReferenceTree, ResourceUpdate } from "./sync-references.ts";

/**
 * Manifest-native release planning shared by CI and local preparation.
 * Read committed snapshots so planning does not depend on unstaged files.
 * GitHub authentication, branch pushes and tag publication belong to the workflows;
 * see docs/releases.md for policy and setup.
 */
type Bump = "patch" | "minor" | "major";
type Manifest = { name: string; version: string; [key: string]: unknown };
type Update = ResourceUpdate;
/**
 * `updates` contains manifest replacements still needed in the head snapshot.
 * `versions` reports release candidates, including plugins already correctly bumped
 * and new plugins whose initial versions need no replacement.
 */
export type ReleasePlan = { updates: Update[]; versions: Record<string, string> };
const overlays = ["plugin.json", ".claude-plugin/plugin.json", ".codex-plugin/plugin.json"];
const pluginName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Run Git without shell interpolation. Revision arguments are resolved before use. */
function git(root: string, args: string[], input?: string): string {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    ...(input === undefined ? {} : { input }),
    maxBuffer: 20 * 1024 * 1024,
  });
}

/** Resolve a revision once, rejecting option injection and non-commit objects. */
function commit(root: string, ref: string): string {
  return git(root, ["rev-parse", "--verify", "--end-of-options", `${ref}^{commit}`]).trim();
}

/**
 * Read a committed regular file without checking out the PR. Missing paths return
 * undefined; symlinks, submodules and directories fail instead of being followed.
 * Git modes 100644 and 100755 both represent regular files.
 */
function blob(root: string, revision: string, path: string): string | undefined {
  const entry = git(root, ["ls-tree", revision, "--", path]).trim();
  if (!entry) return undefined;
  if (!entry.startsWith("100644 blob ") && !entry.startsWith("100755 blob ")) {
    throw new Error(`${path}: expected a regular file`);
  }
  return git(root, ["show", `${revision}:${path}`]);
}

/**
 * Increment stable SemVer and reset the less significant components.
 * Major always increments the major component, including 0.x -> 1.0.0.
 * Prerelease/build versions require a separate promotion policy and are rejected.
 */
export function bumpVersion(version: string, bump: Bump): string {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error(`Release automation requires stable SemVer: ${version}`);
  }
  const [major, minor, patch] = version.split(".").map(BigInt) as [bigint, bigint, bigint];
  if (bump === "major") return `${major + 1n}.0.0`;
  if (bump === "minor") return `${major}.${minor + 1n}.0`;
  return `${major}.${minor}.${patch + 1n}`;
}

/**
 * Validate only release identity and stable version; the repository validator owns
 * the full package contract. Preserve provider metadata for comparison and edits.
 */
function manifest(source: string, name: string): Manifest {
  const value: unknown = JSON.parse(source);
  if (
    !value ||
    typeof value !== "object" ||
    !("name" in value) ||
    value.name !== name ||
    !("version" in value) ||
    typeof value.version !== "string"
  )
    throw new Error(`${name}: invalid plugin identity/version`);
  bumpVersion(value.version, "patch");
  return value as Manifest;
}

/**
 * Resolve release:<plugin>:<bump> over release:<bump>, defaulting to patch.
 * Multiple choices in either applicable scope fail, even when a scoped choice
 * would otherwise override the conflicting PR-wide labels. planRelease validates
 * label syntax; unrelated labels and other plugins' scoped labels are ignored here.
 */
export function selectBump(labels: string[], name: string): Bump {
  const choices = (prefix: string): Bump[] =>
    labels
      .filter((label) => label.startsWith(prefix))
      .map((label) => label.slice(prefix.length))
      .filter(
        (value): value is Bump => value === "patch" || value === "minor" || value === "major",
      );
  const global = choices("release:");
  const scoped = choices(`release:${name}:`);
  if (global.length > 1 || scoped.length > 1)
    throw new Error(`${name}: conflicting release labels`);
  return scoped[0] ?? global[0] ?? "patch";
}

/**
 * Calculate expected versions and manifest replacements without mutating Git or files.
 *
 * @param root Repository working directory used to access Git objects.
 * @param baseRef Main revision against which this PR is being prepared; must be an ancestor of head.
 * @param headRef Committed PR snapshot, possibly containing a previous preparation commit.
 * @param labels Current PR labels selecting global or plugin-specific SemVer bumps.
 * @returns Required edits plus the versions of changed and newly added plugins.
 *
 * Always calculate from base, so reruns and further edits in one PR consume one
 * version bump. New plugins retain their declared version; deleted plugins produce
 * no release. Manifest version-only edits are restored rather than released.
 */
export function planRelease(
  root: string,
  baseRef: string,
  headRef: string,
  labels: string[] = [],
): ReleasePlan {
  const base = commit(root, baseRef);
  const head = commit(root, headRef);
  // Comparing a stale branch directly with newer main would count main's changes
  // as PR edits. Require the caller to update the branch before planning.
  git(root, ["merge-base", "--is-ancestor", base, head]);
  for (const label of labels) {
    if (
      label.startsWith("release:") &&
      !/^release:(?:[a-z0-9]+(?:-[a-z0-9]+)*:)?(?:patch|minor|major)$/.test(label)
    ) {
      throw new Error(`Invalid release label: ${label}`);
    }
  }
  // Disable rename detection so a plugin rename becomes deletion + new identity.
  // NUL separators preserve filenames containing whitespace or newlines.
  const changed = git(root, [
    "diff",
    "--no-renames",
    "--name-only",
    "-z",
    base,
    head,
    "--",
    "plugins/",
  ])
    .split("\0")
    .filter(Boolean);
  const names = [...new Set(changed.map((path) => path.split("/")[1]!))].sort();
  const plan: ReleasePlan = { updates: [], versions: {} };
  for (const name of names) {
    if (!pluginName.test(name)) throw new Error(`Invalid plugin name: ${name}`);
    const path = `plugins/${name}/plugin.json`;
    const currentSource = blob(root, head, path);
    if (!currentSource) {
      // A removed plugin has no new release; partial deletion is a validation error.
      if (git(root, ["ls-tree", "-r", "--name-only", head, "--", `plugins/${name}/`]).trim()) {
        throw new Error(`${name}: plugin.json missing from remaining plugin files`);
      }
      continue;
    }
    const current = manifest(currentSource, name);
    const previousSource = blob(root, base, path);
    const previous = previousSource === undefined ? undefined : manifest(previousSource, name);
    // Any bundled file counts, including documentation and binary assets. For
    // manifests, compare metadata without version so the bot's own edits cannot
    // trigger another release. Missing/added overlays are package changes too.
    const payloadChanged = changed
      .filter((file) => file.startsWith(`plugins/${name}/`))
      .some((file) => {
        if (!overlays.some((overlay) => file === `plugins/${name}/${overlay}`)) return true;
        const before = blob(root, base, file);
        const after = blob(root, head, file);
        if (before === undefined || after === undefined) return true;
        const withoutVersion = (source: string) => {
          const { version: _version, ...rest } = manifest(source, name);
          return JSON.stringify(rest);
        };
        return withoutVersion(before) !== withoutVersion(after);
      });
    // Preserve a new plugin's initial version; restore the base version when only
    // version fields changed. Existing content changes get exactly one selected bump.
    const version = previous
      ? payloadChanged
        ? bumpVersion(previous.version, selectBump(labels, name))
        : previous.version
      : current.version;
    if (!previous || payloadChanged) plan.versions[name] = version;
    for (const overlay of overlays) {
      const file = `plugins/${name}/${overlay}`;
      const source = blob(root, head, file);
      if (source === undefined) continue; // Synchronize existing overlays without creating new ones.
      const metadata = manifest(source, name);
      if (metadata.version === version) continue;
      // Change only the top-level version text, preserving unrelated formatting and metadata.
      const updated = source.replace(/("version"\s*:\s*")[^"]*(")/, `$1${version}$2`);
      if (manifest(updated, name).version !== version)
        throw new Error(`${file}: cannot update version`);
      plan.updates.push({ path: file, content: updated });
    }
  }
  return plan;
}

/**
 * Create a child of head containing planned manifest edits, without checkout or push.
 *
 * Pass updates from planRelease: paths must be validated package-local manifest paths.
 * A temporary index preserves the contributor's index and working files while Git
 * objects are written to the repository. commit-tree leaves HEAD unchanged and runs
 * no commit hooks. With no edits, return the original head SHA without a new commit.
 *
 * @returns Commit SHA for the workflow to push after checking that the PR has not moved.
 */
export async function prepareCommit(
  root: string,
  headRef: string,
  updates: Update[],
): Promise<string> {
  const head = commit(root, headRef);
  if (!updates.length) return head;
  const directory = await mkdtemp(join(tmpdir(), "agents-release-index-"));
  try {
    const env = { ...process.env, GIT_INDEX_FILE: join(directory, "index") };
    const indexGit = (args: string[]) =>
      execFileSync("git", args, { cwd: root, env, encoding: "utf8" });
    indexGit(["read-tree", head]); // Seed the isolated index with the complete PR snapshot.
    for (const update of updates) {
      if (update.content === null) {
        indexGit(["update-index", "--force-remove", "--", update.path]);
        continue;
      }
      const object = git(root, ["hash-object", "-w", "--stdin"], update.content).trim();
      indexGit(["update-index", "--add", "--cacheinfo", `100644,${object},${update.path}`]);
    }
    // Only the selected blobs differ; all other PR files retain their original objects.
    const tree = indexGit(["write-tree"]).trim();
    return git(root, [
      "-c",
      "user.name=github-actions[bot]",
      "-c",
      "user.email=41898282+github-actions[bot]@users.noreply.github.com",
      "commit-tree",
      tree,
      "-p",
      head,
      "-m",
      "chore: update plugin versions",
    ]).trim();
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

/** Read only regular PR blobs for migration; reject symlinks/submodules before planning. */
function referenceSnapshot(root: string, headRef: string): ReferenceTree {
  const head = commit(root, headRef);
  const entries = git(root, ["ls-tree", "-r", "-z", head, "--", "plugins/"])
    .split("\0")
    .filter(Boolean);
  const paths = entries.map((entry) => {
    const match = /^(100644|100755) blob [a-f0-9]+\t(.+)$/s.exec(entry);
    if (!match?.[2]) throw new Error(`Reference migration requires regular plugin files: ${entry}`);
    return match[2];
  });
  return { paths, read: async (path) => blob(root, head, path) };
}

/**
 * Synchronize before version planning so generated resource changes also cause a bump.
 * The temporary migration commit is only a Git object used for comparing snapshots;
 * the final prepared commit has the original PR head as its parent and includes both
 * resources and versions. No PR code is checked out or executed in the trusted job.
 */
export async function planPreparation(
  root: string,
  base: string,
  head: string,
  labels: string[] = [],
): Promise<ReleasePlan> {
  const { planReferences } = await import("./sync-references.ts");
  const resources = await planReferences(referenceSnapshot(root, head));
  const migrated = await prepareCommit(root, head, resources);
  const versions = planRelease(root, base, migrated, labels);
  return { updates: [...resources, ...versions.updates], versions: versions.versions };
}

/**
 * Derive sorted <plugin>@<version> tag names from the final merged snapshot.
 * The canonical manifest is authoritative; overlays never receive separate tags.
 * This only lists names: release.yml checks remote collisions and publishes them
 * at head. It assumes pre-merge validation already enforced the version policy.
 */
export function releaseTags(root: string, baseRef: string, headRef: string): string[] {
  const base = commit(root, baseRef);
  const head = commit(root, headRef);
  const files = git(root, [
    "diff",
    "--no-renames",
    "--name-only",
    "-z",
    base,
    head,
    "--",
    "plugins/",
  ]).split("\0");
  const tags: string[] = [];
  for (const path of files) {
    const match = /^plugins\/([a-z0-9]+(?:-[a-z0-9]+)*)\/plugin\.json$/.exec(path);
    if (!match?.[1]) continue;
    const source = blob(root, head, path);
    if (!source) continue;
    const current = manifest(source, match[1]);
    const previous = blob(root, base, path);
    if (previous && manifest(previous, match[1]).version === current.version) continue;
    tags.push(`${current.name}@${current.version}`);
  }
  return tags.sort();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // CLI contracts: check is read-only; write edits a clean HEAD checkout locally;
  // prepare creates a Git commit without checkout; tags prints names without tagging.
  // Node 24 runs this dependency-free TypeScript directly in the trusted CI job.
  try {
    const [mode, base, head = "HEAD"] = process.argv.slice(2);
    if (!base || !["check", "prepare", "write", "tags"].includes(mode ?? "")) {
      throw new Error("Usage: node scripts/release.ts <check|prepare|write|tags> <base> [head]");
    }
    const root = process.cwd();
    const labels: unknown = JSON.parse(process.env.RELEASE_LABELS ?? "[]");
    if (!Array.isArray(labels) || !labels.every((label) => typeof label === "string")) {
      throw new Error("RELEASE_LABELS must be a JSON array of strings");
    }
    if (mode === "tags") {
      console.log(releaseTags(root, base, head).join("\n"));
    } else {
      if (mode === "write") {
        if (git(root, ["status", "--porcelain"]).trim())
          throw new Error("Commit your changes before release:prepare");
        if (commit(root, head) !== commit(root, "HEAD")) throw new Error("write requires HEAD");
      }
      if (mode === "check") {
        const { planReferences } = await import("./sync-references.ts");
        const drift = await planReferences(referenceSnapshot(root, head));
        if (drift.length)
          throw new Error(
            `Reference migration is out of date: ${drift.map((update) => update.path).join(", ")}`,
          );
      }
      const plan =
        mode === "check"
          ? planRelease(root, base, head, labels)
          : await planPreparation(root, base, head, labels);
      // Keep diagnostics on stderr: CI captures prepare's stdout as a single SHA,
      // while the tagging workflow consumes one tag per stdout line.
      console.error(JSON.stringify(plan.versions));
      if (mode === "check" && plan.updates.length) {
        throw new Error(
          `Plugin versions need updating: ${plan.updates.map((update) => update.path).join(", ")}`,
        );
      }
      if (mode === "write") {
        const { applyResourceUpdates } = await import("./sync-references.ts");
        await applyResourceUpdates(root, plan.updates);
      }
      if (mode === "prepare") console.log(await prepareCommit(root, head, plan.updates));
    }
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
