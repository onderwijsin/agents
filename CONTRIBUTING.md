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
- Create distributable skills in `plugins/<plugin-name>/skills/<skill-name>/`.
  Use a single-skill plugin for an independent capability.
- Include a README for each plugin package with usage, prerequisites, examples,
  supported hosts, and limitations. Keep bundled skill instructions inside their package.
- Update both catalogs when adding a plugin. Catalogs reference plugin packages.
- Version bundled skill changes through the containing plugin; individual skills need no version.
- Add only resources needed by the capability; do not duplicate content for each provider.
- Never include credentials, private organizational data, or personal information in examples.

Submit a focused pull request describing the user benefit, changed behavior, compatibility,
and validation evidence. Run `pnpm check` and manually exercise new content on every platform
claimed as supported. Passing structural checks does not prove runtime compatibility.
Maintainers review before merging; workspace sync can distribute merged catalog entries.
The [release workflow](docs/releases.md) prepares independent plugin versions on PRs before
merge and tags merged versions. Patch is the default; PR labels select minor or major bumps.
No changesets or changelogs are required.
