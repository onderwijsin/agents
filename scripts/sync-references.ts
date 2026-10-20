import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { join, posix, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { localMarkdownLinks } from "./markdown-links.ts";

/** A file replacement or owned-file deletion, relative to the repository root. */
export type ResourceUpdate = { path: string; content: string | null };
/** Filesystem and Git snapshots share a planner; trusted CI never checks out PR code. */
export type ReferenceTree = {
  paths: string[];
  read: (path: string) => Promise<string | undefined>;
};
const ledgerName = ".reference-manifest.json";
type Ledger = { version: 1; files: Record<string, string> };
const digest = (content: string): string => createHash("sha256").update(content).digest("hex");

/** Require normalized repository-relative paths before any filesystem or Git operation. */
function safePath(path: string): string {
  if (
    !path ||
    path.includes("\\") ||
    path.includes("\0") ||
    posix.isAbsolute(path) ||
    posix.normalize(path) !== path ||
    path === ".." ||
    path.startsWith("../")
  ) {
    throw new Error(`Unsafe resource path: ${path}`);
  }
  return path;
}

/** Validate the ownership boundary: only generated Markdown under reference/ may be deleted. */
function ledger(source: string | undefined, path: string): Ledger {
  if (source === undefined) return { version: 1, files: {} };
  const value: unknown = JSON.parse(source);
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).sort().join(",") !== "files,version" ||
    !("version" in value) ||
    value.version !== 1 ||
    !("files" in value) ||
    !value.files ||
    typeof value.files !== "object" ||
    Array.isArray(value.files)
  ) {
    throw new Error(`${path}: invalid reference ownership manifest`);
  }
  const files: Record<string, string> = {};
  for (const [file, hash] of Object.entries(value.files)) {
    safePath(file);
    if (
      !file.startsWith("reference/") ||
      !file.endsWith(".md") ||
      typeof hash !== "string" ||
      !/^[a-f0-9]{64}$/.test(hash)
    ) {
      throw new Error(`${path}: invalid owned reference ${file}`);
    }
    files[file] = hash;
  }
  return { version: 1, files };
}

/**
 * Plan selective, byte-preserving copies using paths in their installed context.
 * Follow Markdown from SKILL.md through shared and private documents, including cycles.
 * Shared sources win only if the target is absent, identical, or matches its recorded
 * generated checksum. Stale files are removed only if still unchanged and owned.
 * A complete plan is built before writing, so broken sources cannot cause partial cleanup.
 */
export async function planReferences(tree: ReferenceTree): Promise<ResourceUpdate[]> {
  const paths = [...tree.paths].sort();
  for (const path of paths) safePath(path);
  const updates: ResourceUpdate[] = [];
  for (const entry of paths) {
    const match =
      /^(plugins\/[a-z0-9]+(?:-[a-z0-9]+)*)\/skills\/([a-z0-9]+(?:-[a-z0-9]+)*)\/SKILL\.md$/.exec(
        entry,
      );
    if (!match?.[1] || !match[2]) continue;
    const plugin = match[1];
    const skill = posix.dirname(entry);
    const manifestPath = `${skill}/${ledgerName}`;
    const oldManifest = await tree.read(manifestPath);
    const previous = ledger(oldManifest, manifestPath);
    const generated = new Map<string, string>();
    const visited = new Set<string>();

    const visit = async (document: string): Promise<void> => {
      if (visited.has(document)) return;
      visited.add(document);
      const local = await tree.read(document);
      const offset = posix.relative(skill, document);
      const source = offset.startsWith("reference/")
        ? await tree.read(`${plugin}/${offset}`)
        : undefined;
      let content = local;
      if (source !== undefined) {
        if (local !== undefined && local !== source && digest(local) !== previous.files[offset]) {
          throw new Error(`${document}: refusing to overwrite a private or modified reference`);
        }
        generated.set(offset, source);
        content = source;
      } else if (previous.files[offset] !== undefined) {
        throw new Error(
          `${document}: generated reference has no canonical source (${plugin}/${offset})`,
        );
      }
      if (content === undefined)
        throw new Error(`${document}: missing Markdown reference or canonical source`);
      for (const encoded of localMarkdownLinks(content)) {
        const target = decodeURIComponent(encoded);
        const resolved = posix.resolve("/", posix.dirname(document), target).slice(1);
        if (!resolved.startsWith(`${skill}/`)) {
          throw new Error(`${document}: reference escapes skill root: ${target}`);
        }
        // Images and directory links are checked by validation; migration only copies Markdown.
        if (resolved.endsWith(".md")) await visit(resolved);
      }
    };
    await visit(entry);
    const next: Ledger = { version: 1, files: {} };
    for (const [file, content] of [...generated].sort(([a], [b]) => a.localeCompare(b, "en"))) {
      next.files[file] = digest(content);
      if ((await tree.read(`${skill}/${file}`)) !== content)
        updates.push({ path: `${skill}/${file}`, content });
    }
    for (const [file, hash] of Object.entries(previous.files).sort(([a], [b]) =>
      a.localeCompare(b, "en"),
    )) {
      if (generated.has(file)) continue;
      const current = await tree.read(`${skill}/${file}`);
      if (current === undefined) continue;
      if (digest(current) !== hash)
        throw new Error(`${skill}/${file}: refusing to delete a modified generated reference`);
      updates.push({ path: `${skill}/${file}`, content: null });
    }
    const nextManifest = generated.size ? JSON.stringify(next, null, 2) + "\n" : undefined;
    if (nextManifest !== oldManifest)
      updates.push({ path: manifestPath, content: nextManifest ?? null });
  }
  return updates.sort((a, b) => a.path.localeCompare(b.path, "en"));
}

/** Snapshot installed files without following symlinks, including ancestor directories. */
export async function referenceTree(root: string): Promise<ReferenceTree> {
  const paths: string[] = [];
  const walk = async (path: string): Promise<void> => {
    const info = await lstat(path);
    if (info.isSymbolicLink())
      throw new Error(`${path}: symlinks are not supported by reference migration`);
    if (info.isDirectory()) {
      for (const entry of (await readdir(path)).sort()) await walk(join(path, entry));
    } else if (info.isFile()) paths.push(relative(root, path).split(sep).join("/"));
    else throw new Error(`${path}: expected a regular file or directory`);
  };
  await walk(join(root, "plugins"));
  return {
    paths,
    read: async (path) => {
      safePath(path);
      try {
        return await readFile(join(root, path), "utf8");
      } catch (error: unknown) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") return undefined;
        throw error;
      }
    },
  };
}

/** Apply a completed plan; recheck target parents so symlinks cannot redirect writes. */
export async function applyResourceUpdates(root: string, updates: ResourceUpdate[]): Promise<void> {
  for (const update of updates) {
    safePath(update.path);
    if (!update.path.startsWith("plugins/"))
      throw new Error(`Update outside plugins: ${update.path}`);
    const parts = update.path.split("/");
    for (let index = 1; index <= parts.length; index++) {
      const path = join(root, ...parts.slice(0, index));
      try {
        if ((await lstat(path)).isSymbolicLink())
          throw new Error(`${path}: refusing to write through a symlink`);
      } catch (error: unknown) {
        if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
      }
    }
  }
  for (const update of updates) {
    const path = join(root, update.path);
    if (update.content === null) await unlink(path);
    else {
      await mkdir(posix.dirname(path), { recursive: true });
      await writeFile(path, update.content);
    }
  }
}

/** Read-only drift detection is separate from migration and from resource validation. */
export async function syncReferences(root: string, check = false): Promise<ResourceUpdate[]> {
  const updates = await planReferences(await referenceTree(root));
  if (check && updates.length) {
    throw new Error(
      `Reference migration is out of date:\n${updates.map((update) => `  ${update.content === null ? "remove" : "write"} ${update.path}`).join("\n")}`,
    );
  }
  if (!check) await applyResourceUpdates(root, updates);
  return updates;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const updates = await syncReferences(process.cwd(), process.argv.includes("--check"));
    console.log(`Reference migration: ${updates.length} file(s) changed.`);
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
