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
- Before a push, `pnpm lint` checks repository Markdown and scripts. Errors abort the push.

Review staged changes before committing. The hooks do not stage unrelated files or replace
`pnpm check`. CI disables local hooks with `HUSKY=0` and runs the full quality gates itself.
See [Husky setup](https://typicode.github.io/husky/get-started.html) and
[lint-staged](https://github.com/lint-staged/lint-staged) for hook behavior.

## Quality commands

| Command             | Purpose                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| `pnpm format`       | Apply Oxfmt formatting                                                 |
| `pnpm format:check` | Check formatting without changing files                                |
| `pnpm lint:md`      | Lint Markdown                                                          |
| `pnpm lint:ts`      | Lint TypeScript with Oxlint                                            |
| `pnpm typecheck`    | Check strict TypeScript types                                          |
| `pnpm validate`     | Validate content, catalogs, and local Markdown file links              |
| `pnpm test`         | Exercise validator failure and success contracts in temporary fixtures |
| `pnpm check`        | Run all quality gates                                                  |

The validator prints a file/context with errors and exits unsuccessfully. Fix the source;
do not weaken checks to hide a failure. Empty plugin catalogs remain valid; distributable
skills belong in `plugins/<plugin-name>/skills/<skill-name>/`, with a README and manifest
at the plugin root. A repository-level `skills/` directory fails validation.
Use [skill authoring](creating-skills.md) or [plugin authoring](creating-plugins.md) for content work.

## Repository tooling and validation scope

This is a content repository. Its validation utilities use TypeScript with strict type checking,
Zod v4 for JSON/YAML boundaries, and Node's test runner through tsx. Keep new utilities lightweight;
JavaScript with JSDoc is preferred unless the task benefits from additional TypeScript modeling.
Oxfmt formats source and Markdown; Oxlint lints scripts; markdownlint-cli2 checks Markdown rules.

The validator covers the local-only catalog subset, matching catalog names and paths, unique
identities, required plugin and skill files, skill frontmatter, and relative Markdown file links.
Empty plugin catalogs are accepted; repository-level distributable skills are rejected. Plugin validation checks required identity fields rather
than certifying the full portable schema. It also checks the documented credential-free HTTPS MCP
subset, matching Claude overlays, OpenAI PNG presentation assets, and plugin-local shared references.
Advanced manifest extensions, other MCP configuration, Markdown anchors, external URLs,
and runtime behavior require targeted checks when introduced.

CI installs dependencies with a frozen lockfile and runs the quality gates. Dependabot proposes
monthly dependency and action updates. `pnpm-workspace.yaml` permits esbuild's dependency build
script for the TypeScript runner. Locally installed contributor skills under `.agents/skills/`
are excluded from formatting and Markdown linting; they are separate from marketplace content.
