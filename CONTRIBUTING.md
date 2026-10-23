# Contributing

Contributions from skill authors, colleagues, and developers are welcome. Describe a reusable
user need before proposing a solution. Use the skill or plugin proposal issue template; include
example tasks, expected results, intended platforms, and external service requirements.

## Local setup and checks

Install Node.js 24 or later and the exact pnpm version in `package.json` (currently 11.22.0).
Clone the repository and run:

```sh
pnpm install --frozen-lockfile
pnpm format
pnpm check
```

See [getting started](docs/getting-started.md) for editor setup, Git hooks, and individual checks.
Dependency installation enables automatic formatting of staged files before commit and all quality gates
before push. Run `pnpm check` before submitting changes.
The repository is private as an npm package because distribution uses catalogs and package
folders; the repository content itself is open source under MIT.

## Author and submit

- Use lowercase kebab-case directories and matching manifest/frontmatter names.
- Write portable Markdown with concise descriptions explaining when the skill applies.
- Follow [creating skills](docs/creating-skills.md) and [creating plugins](docs/creating-plugins.md).
- Create marketplace-distributed skills in `plugins/<plugin-name>/skills/<skill-name>/`.
  Use a single-skill plugin for an independent capability.
- For workspace agents, create standalone skills in `skills/<skill-name>/`
  for manual upload once per workspace and linking to consuming agents. Declare dependencies
  in agent frontmatter and matching consumer names in each skill's `metadata.agents` array.
  Use `agents: []` for standalone-only skills. Review every consumer before shared changes.
  Agents cannot use plugins or plugin-bundled skills;
  follow [agent deployment](docs/agent-deployment.md).
- Include a README for each plugin package with usage, prerequisites, examples,
  supported hosts, and limitations. Keep bundled skill instructions inside their package.
- Update both catalogs when adding a plugin. Catalogs reference plugin packages.
- Keep the root README inventory tables aligned with `plugins/`, `skills/` and `agents/`.
  Validation checks entries and dependency declarations; it does not validate live deployment.
- Version bundled skill changes through the containing plugin; individual skills need no version.
- Add only resources needed by the capability; do not duplicate content for each provider.
- Author shared references in plugin-root `reference/` and link to their installed
  skill-local paths. Run `pnpm references:sync`, then commit generated copies and
  ownership manifests with the source changes. See the
  [resource contract](docs/reference-synchronization.md).
- Never include credentials, private organizational data, or personal information in examples.

Submit a focused pull request describing the user benefit, changed behavior, compatibility,
and validation evidence. Run `pnpm check` and manually exercise new content on every platform
claimed as supported. Passing structural checks does not prove runtime compatibility.
Maintainers review before merging. Marketplace synchronization distributes plugin content;
root workspace skills and agent definitions require manual workspace updates after review.
The [release workflow](docs/releases.md) prepares independent plugin versions on PRs before
merge and tags merged versions. Patch is the default; PR labels select minor or major bumps.
No changesets or changelogs are required.
