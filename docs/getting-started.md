# Getting started as a contributor

Read the [project overview](../README.md), [architecture](../ARCHITECTURE.md), and
[contribution guide](../CONTRIBUTING.md). Coding assistants must also read [AGENTS.md](../AGENTS.md).
You can propose task instructions and examples in an issue without installing local tools.

## Set up locally

Use Node.js 24 or later and pnpm 11.22.0. If Corepack is installed, `corepack pnpm` selects
the version from `package.json`; otherwise install that pnpm version using its official setup.

```sh
git clone https://github.com/onderwijsin/agents.git
cd agents
pnpm install --frozen-lockfile
pnpm check
```

VS Code recommends `oxc.oxc-vscode` and uses it as the default formatter on save.
`pnpm format` formats supported source and documentation files. The supplied task brief is
excluded from formatting and Markdown linting so its original requirements are preserved.

Dependency versions are pinned exactly. `saveExact: true` in `pnpm-workspace.yaml` makes
`pnpm add` save exact versions instead of ranges. Keep those pins and the lockfile synchronized
when updating dependencies.

## Git hooks

`pnpm install` runs the `prepare` script to install Husky hooks in the local checkout.

- Before a commit, lint-staged passes staged files to Oxfmt and automatically stages the
  formatting changes. It preserves unstaged edits, including edits in partially staged files.
  Oxfmt's configured exclusions still apply; unsupported file types are skipped. Formatting
  errors abort the commit and lint-staged restores the original state.
- Before a push, `pnpm check` runs formatting checks, linting, type checking, content and
  catalog validation, and validator tests. Any failure aborts the push.

Review staged changes before committing. The hooks do not stage unrelated files. Run
`pnpm check` during development as well; CI disables local hooks with `HUSKY=0` and runs
the full quality gates itself.
See [Husky setup](https://typicode.github.io/husky/get-started.html) and
[lint-staged](https://github.com/lint-staged/lint-staged) for hook behavior.

## Quality commands

| Command                 | Purpose                                                                    |
| ----------------------- | -------------------------------------------------------------------------- |
| `pnpm format`           | Apply Oxfmt formatting                                                     |
| `pnpm format:check`     | Check formatting without changing files                                    |
| `pnpm lint:md`          | Lint Markdown                                                              |
| `pnpm lint:ts`          | Lint TypeScript with Oxlint                                                |
| `pnpm typecheck`        | Check strict TypeScript types                                              |
| `pnpm references:sync`  | Synchronize shared plugin references into their skill directories          |
| `pnpm references:check` | Check generated plugin-reference drift without changing files              |
| `pnpm validate`         | Validate plugins, workspace dependencies, consumers, inventories and links |
| `pnpm test`             | Exercise validator and release contracts in temporary fixtures             |
| `pnpm check`            | Run all quality gates                                                      |

The validator prints compact category summaries, followed by individual failures
with responsible files and reasons. Individual successful checks stay out of the detailed output; the declared workspace skill
consumer index is printed separately. Identical skipped-check reasons are grouped. Consola provides terminal
styling; `NO_COLOR=1` disables colors for plain output. It collects independent failures, including every
broken local target in a document, before exiting with status 1 if any check failed.
Checks blocked by invalid metadata are marked skipped; unrelated checks continue.
Reports use repository-relative paths for terminals and CI. Fix the source;
do not weaken checks to hide a failure. Empty plugin catalogs remain valid. Plugin-bundled skills
belong in `plugins/<plugin-name>/skills/<skill-name>/`, with a README and manifest at plugin root.
Shared workspace skills live in root `skills/` for standalone use, agent attachment, or both;
they are manually uploaded and stay outside marketplace synchronization. Agent-local `skills/` directories fail validation.
Use [skill authoring](creating-skills.md) or [plugin authoring](creating-plugins.md) for content work.

## Repository tooling and validation scope

This is a content repository. Its validation utilities use TypeScript with strict type checking,
Zod v4 for JSON/YAML boundaries, and Node's test runner through tsx. Keep new utilities lightweight;
JavaScript with JSDoc is preferred unless the task benefits from additional TypeScript modeling.
Oxfmt formats source and Markdown; Oxlint lints scripts; markdownlint-cli2 checks Markdown rules.

Plugin validation covers the local-only catalog subset, matching names and paths, unique identities,
required files, standard skill frontmatter and Markdown links. It checks the supported credential-free
HTTPS MCP subset, matching Claude overlays, PNG presentation assets and singular `reference/`
directories. This checks the repository's supported subset, not the complete upstream manifest schema.

Root workspace skill validation checks frontmatter, required `metadata.agents` arrays and skill-local
resource links, with plural `references/` allowed. Agent validation checks the local instruction
frontmatter contract, resolves skills to root `skills/<name>/SKILL.md`, apps to each agent's
`apps/<id>.yaml` and connected files to its `files/<name>.md`. It checks dependency existence and
consumer agreement in both directions. Missing or malformed agent declarations prevent a complete
consumer comparison; dependent checks are reported as skipped, with the underlying failure retained.
App policy YAML contents and service-level permission enforcement are not checked.

Root README inventory tables under **Plugins**, **Skills** and **Workspace agents** must list each
corresponding directory exactly once, linking to its `README.md` or `SKILL.md`. Missing, stale or
duplicate entries and incorrect link targets fail. Prose links and fenced examples do not count.
The check does not validate purpose text or human-readable agent names in the table's other columns.

For both deployment routes, referenced files must exist at their exact paths; sibling skills are
not fallbacks. Symlinks and file links escaping a skill's boundary are rejected. Missing linked
resources fail even when a matching source exists elsewhere. Root and documentation links are
checked within the repository boundary; agent README links can navigate to shared root skills.

Plugin reference synchronization is a separate authoring step. Run `pnpm references:sync` when
changing shared plugin sources or their links; `pnpm references:check` detects drift without writing
and runs first in `pnpm check`. CI also requires generated plugin output to be committed. Root
workspace skills have no generated copies or synchronization step. See the
[resource contract](reference-synchronization.md).

Advanced manifest extensions, other MCP configuration, Markdown anchors, external URLs,
and runtime behavior require targeted checks when introduced.

CI installs dependencies with a frozen lockfile and runs the quality gates. Dependabot proposes
monthly dependency and action updates. `pnpm-workspace.yaml` permits esbuild's dependency build
script for the TypeScript runner. Locally installed contributor skills under `.agents/skills/`
are excluded from formatting and Markdown linting; they are separate from marketplace content.

## Plugin releases

See [plugin releases](releases.md) for automatic PR version preparation, SemVer labels,
local preparation commands, merge enforcement and post-merge tagging.
