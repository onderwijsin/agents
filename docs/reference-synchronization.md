# Reference synchronization

Maintain shared reference documents once at plugin root and distribute only the
Markdown each skill needs inside its installed directory. The synchronizer prepares
those copies; the validator independently checks the resulting resource paths.

## Resource paths

Use singular **`reference/`** for reference directories in distributed plugins and
skills. This is the repository's chosen OpenAI-targeted packaging convention; the
[Agent Skills specification](https://agentskills.io/specification) permits additional
directories and illustrates `references/`, so singular spelling is not a universal
specification requirement. The [OpenAI packaging guide](https://developers.openai.com/plugins/build/plugins)
does not establish runtime access to arbitrary plugin-root files. These sources were
consulted on 20 October 2026; verify installed resource access in each claimed host.

- Link from `SKILL.md` with `reference/<file>.md` and `assets/<file>`.
- Inside `reference/`, link to sibling documents with `<file>.md` and to skill assets
  with `../assets/<file>`. Paths are relative to the Markdown file containing the link.
- Keep skill runtime resources inside that skill's directory, including transitive
  reference links. A file at plugin root or in another skill does not satisfy the link.
- Shared authored sources may live in `plugins/<plugin>/reference/`. Write their links
  for the eventual `skills/<skill>/reference/` location. Skill-private references
  are authored directly inside their skill. Author shared content once.
- Plugin presentation icons stay under plugin-root `assets/` as required by the
  manifest; skill reference images belong under skill-local `assets/`.

The validator checks the exact installed paths, including transitive Markdown links
and linked assets, and rejects missing resources, directory targets used as Markdown
files, symlinks and escapes from the skill directory. It also rejects plural
`references/` directories inside distributed plugins. Shared plugin-root source
links are checked in their installed copies, because source and installed resource
contexts differ; symlinks and directory naming are checked in sources too.

Run `pnpm references:sync` after editing shared sources or their Markdown links.
It copies only reachable Markdown references, following transitive links in shared
and skill-private documents. Cycles are supported; unused sources are not copied.
Links already describe the installed context, so copied contents remain identical.
Shared images are not copied: place required images under skill-local `assets/`.

Each skill with generated references has a `.reference-manifest.json` recording
owned paths and SHA-256 checksums. Commit this file together with the copies.
Edit canonical plugin-root sources rather than generated copies. The synchronizer
updates unchanged owned copies, removes unchanged owned files no longer referenced,
and preserves private references. A conflicting private file or edited generated
copy fails rather than being overwritten/deleted. Identical existing copies can be
adopted on first run. Missing required sources, malformed ownership data, traversal
and symlinks fail before the plan is applied. Never hand-edit the ownership manifest.

`pnpm references:check` detects missing or stale generated
output without modifying files; it runs first in `pnpm check`. CI additionally
requires the generated output to be committed. Resource validation remains read-only
and runs after migration: it never moves, copies, generates or repairs files and has
no fallback to shared sources. Migration and validation share the same focused link
scanner; arbitrary prose and inline-code paths are outside its contract. The release
workflow synchronizes resources before versioning and validates the committed result.

## Add or update a shared reference

For a plugin `editor` with a skill `draft`, the authored and installed layout is:

```text
plugins/editor/
  reference/
    style.md                         # authored source
    spelling.md                      # authored source, linked by style.md
  skills/draft/
    SKILL.md                         # links to reference/style.md
    .reference-manifest.json         # generated ownership/checksums
    reference/
      style.md                       # generated copy
      spelling.md                    # generated transitive dependency
      private.md                     # optional skill-private authored document
    assets/
      example.png                    # authored image, not synchronized
```

1. Add or edit `plugins/editor/reference/style.md`. Link to `spelling.md` within
   that document and to `../assets/example.png` if an image is needed.
2. Add a Markdown link to `reference/style.md` in the skill's `SKILL.md`, under the step or
   condition that requires it. Other skills receive the source only if their own
   Markdown graph reaches it. Links in plugin READMEs do not select dependencies.
3. Put required images inside each consuming skill's `assets/`. Keep a private
   reference in the skill itself, with no same-path plugin-root source.
4. Run `pnpm references:sync`, then `pnpm check`. Review the generated diff and
   commit sources, copies and ownership manifests together. Repeat synchronization
   after removing a link so unchanged, no-longer-needed generated files are removed.

If synchronization reports a conflict, preserve any intentional local edits in the
canonical source before restoring the generated copy from its last committed version
and rerunning. For a private-name collision, rename the private file and update its
links. A required deleted canonical source must be restored or its consuming links
removed. The script does not guess ownership or discard edits to resolve conflicts.

## Release integration

Release preparation synchronizes references before calculating plugin versions and
includes generated copies, ownership manifests and stale-file deletions in the
prepared commit. Validation runs afterward against that committed output. The
marketplace therefore consumes the same resources that passed validation. See
[plugin releases](releases.md#workflow-and-extension-points) for workflow ordering
and [contributor setup](getting-started.md) for the complete check commands.
