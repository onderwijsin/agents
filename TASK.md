# Task: Scaffold `onderwijsin/agents`

## Objective

Scaffold a new open-source repository named **`onderwijsin/agents`** under the GitHub organization `onderwijsin`.

The repository will become our central, provider-agnostic collection of AI plugins and skills.

**This task is strictly about repository foundations.** Do not implement real plugins or skills yet. We want a clean, well-documented, validated starting point for future development.

## 1. Background and vision

### About Onderwijs in

[Onderwijs in](https://onderwijsin.nl) is a Dutch nonprofit organization focused on bringing more talented people into education.

We're adopting AI throughout our organization, including nontechnical teams working on communications, editorial content, research, operations, and education.

Our goal is to provide colleagues with reusable AI capabilities that can be discovered, installed, and used directly in their AI workspace.

### Long-term goals

- **Provider-agnostic:** build skills and plugins that work across ChatGPT, Codex, Claude, and potentially other AI platforms.
- **GUI-first:** our primary distribution channel is the **ChatGPT Business plugin marketplace**, not developer CLIs.
- **Open source:** publish generic plugins and skills publicly for other organizations to reuse.
- **Reusable capabilities:** skills and plugins should support a variety of tasks, not just one predefined workflow.
- **Easy distribution:** administrators should be able to import our GitHub marketplace into ChatGPT Business, where updates synchronize automatically.
- **Modularity:** plugins may bundle multiple skills and optionally integrate external services through MCP.
- **Quality:** changes should be reviewed, validated, and documented before publication.

Most colleagues will never interact with this GitHub repository directly. They will discover and use plugins through their AI platform's GUI.

### Future direction: dynamically managed skill references

We are also exploring a second system where nontechnical colleagues manage organizational skills through a remote editing and publishing interface (Directus). This would allow plugins in this repository to reference and utilize those dynamically managed skills, capabilities and reference documentation.

Eventually, a stable plugin from this repository might provide capabilities for discovering, editing, validating, and publishing those dynamically managed skills via MCP, eliminating the need for direct Directus editing of that data.

**Do not implement this integration yet.** Just document it as a possible future capability. GitHub remains the source of truth for the static plugins and skills in this repository.

## 2. Reference repository

Study:

**https://github.com/wshobson/agents**

Also review its:

- `README.md`
- `ARCHITECTURE.md`
- `AGENTS.md`
- `CONTRIBUTING.md`
- `.agents/plugins/`
- `.claude-plugin/`
- `.github/workflows/`
- `tools/`
- `evals/`

We like its multi-provider philosophy, plugin organization, marketplace manifests, contributor guidance, and quality controls.

However, it is significantly more complex than our initial needs.

### Adopt

- Monorepo organization for plugins.
- Native marketplace manifest support.
- Portable, Markdown-based skill definitions.
- Clear architectural documentation.
- Strong contribution guidelines.
- Automated validation through GitHub Actions.
- Separation between canonical content and provider-specific integration.

### Adapt

- Give nontechnical, GUI-based usage equal or greater priority than CLI usage.
- Support standalone skills alongside bundled plugin skills.
- Prefer TypeScript and `pnpm` for tooling.
- Keep provider-specific files minimal.
- Start with a very small number of validation utilities.
- Ensure the documentation is understandable to colleagues who aren't software developers.

### Do not copy

- Existing agents, plugins, skills, or commands.
- Large provider-adapter frameworks.
- Python-based generation and installation systems.
- Coding-agent-specific conventions that aren't relevant to this repository.
- Makefile orchestration.
- Evaluation infrastructure.
- Complex automation intended for hundreds of plugins.

Use the reference as architectural inspiration, not as a template to clone wholesale.

## 3. Desired repository structure

Propose and implement something close to:

```text
agents/
├── .agents/
│   └── plugins/
│       └── marketplace.json
├── .claude-plugin/
│   └── marketplace.json
├── .github/
│   ├── workflows/
│   │   └── validate.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── plugins/
│   └── .gitkeep
├── skills/
│   └── .gitkeep
├── scripts/
│   └── validate.ts
├── docs/
│   ├── getting-started.md
│   ├── creating-skills.md
│   ├── creating-plugins.md
│   └── marketplace-distribution.md
├── AGENTS.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── README.md
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── .markdownlint-cli2.jsonc
├── .editorconfig
└── .gitignore
```

Adjust this layout where justified by actual specifications. Avoid creating unnecessary directories or files.

### `plugins/`

Contains fully packaged plugins.

Each future plugin can contain:

- Its own manifest.
- One or more bundled skills.
- Supporting reference files or assets.
- Optional MCP/app configuration.

Plugins should be independently distributable.

### `skills/`

Contains standalone, reusable Agent Skills following the open Agent Skills specification.

These skills should be usable independently of a plugin where supported.

Do not automatically duplicate standalone skills into plugin directories. Document a future reuse/packaging strategy without implementing one prematurely.

### `scripts/`

Contains repository tooling such as manifest validation, structure checks, and eventually marketplace generation.

Do not create a general-purpose framework. Start with the minimum necessary functionality.

### `docs/`

Contains human-readable guides for administrators, contributors, and skill authors.

Keep the documentation structured and approachable. Don't generate excessive placeholder text.

## 4. Marketplace compatibility

ChatGPT Business is our first deployment target, but the underlying skills and plugin content should remain portable.

Research and follow the current official specifications for:

- OpenAI / Codex plugin packaging.
- ChatGPT Business GitHub marketplace import.
- Claude-compatible marketplace manifests.
- Agent Skills.

Prioritize official documentation over assumptions from the reference repository.

Use `.agents/plugins/marketplace.json` as the primary ChatGPT/Codex marketplace entry point.

Include `.claude-plugin/marketplace.json` for Claude compatibility if it can be maintained without duplicating canonical plugin content.

**Important:** the initial repository contains zero plugins.

Determine whether empty marketplace manifests are valid according to the applicable specifications.

If valid, create them. If not, implement a placeholder plugin.

The initial scaffold should pass validation.

Do not implement automatic GitHub-to-ChatGPT deployment: ChatGPT Business already supports importing GitHub marketplaces and synchronizing updates.

Document that integration, including the fact that plugin installation policies and connected-app permissions are managed separately in the workspace.

## 5. Documentation requirements

### `README.md`

This is the public-facing entry point.

It should explain:

- What the repository is.
- What an AI plugin is.
- What an Agent Skill is.
- Why Onderwijs in maintains this repository.
- How to browse available plugins and skills once added.
- How organizations can consume the marketplace through a GUI.
- Which AI platforms are supported or targeted.
- How to contribute.
- Where to find deeper documentation.

Keep it professional, approachable, and concise.

Don't lead with CLI installation instructions. Prioritize the marketplace experience.

Clearly distinguish **currently supported** functionality from planned support.

### `AGENTS.md`

This is particularly important.

Write substantial, actionable instructions for coding agents contributing to this repository.

Include:

- Repository mission and architecture.
- Canonical sources of truth.
- Plugin and skill authoring conventions.
- Provider-agnostic design principles.
- When provider-specific configuration is acceptable.
- Naming and directory conventions.
- Markdown and frontmatter conventions.
- Documentation expectations.
- Quality checks before completion.
- Security and credential-handling rules.
- Guidance for minimizing complexity and dependencies.
- Rules against duplicating plugin content for individual providers.
- Clear distinction between skills, plugins, tools/scripts, and MCP integrations.

Agents must respect the intended architecture rather than introducing unnecessary abstractions.

Explicitly instruct coding agents to consult current official specifications when introducing provider-specific functionality.

In `AGENTS_REFERENCE.md` you will find an example of an AGENTS file we use for typescript code project. A lot of it won't apply here, but it does include usefull reference fo what we expect from an agent, and what an agent workflow shoudl look like. Remove the REFERENCE file when you are do ne writing AGENTS.md

### `ARCHITECTURE.md`

Document:

- High-level system architecture.
- Relationship between plugins, skills, marketplaces, and MCP.
- Canonical content versus provider-specific adapters.
- Repository structure and directory responsibilities.
- Plugin and skill lifecycle.
- Validation and publication strategy.
- ChatGPT Business marketplace integration.
- Future possibilities such as Directus-managed skills.

Include at least one simple Mermaid diagram explaining the relationship between GitHub, marketplace manifests, ChatGPT Business, and other providers.

Explain that runtime capabilities differ between providers, even when packaging is portable.

This should describe the architecture we're actually establishing, not an imaginary fully implemented system.

### `CONTRIBUTING.md`

Document how to:

- Set up the repository locally.
- Run validations.
- Propose a new skill or plugin.
- Submit changes through pull requests.
- Follow naming and documentation conventions.

### `docs/`

Create useful initial guides for:

- Getting started as a contributor.
- Creating a standalone skill.
- Creating a plugin.
- Distributing plugins through the ChatGPT Business GUI marketplace.

Use skeleton examples in documentation where necessary, but don't create actual sample plugins.

## 6. Development tooling

Use:

- TypeScript with strict type checking.
- `pnpm`.
- Zod v4 for validation of external or uncertain structured data.
- `markdownlint-cli2` for Markdown linting.
- ESLint for TypeScript linting, if scripts warrant it.
- A minimal, maintainable dependency set.

Provide scripts such as:

```json
{
  "scripts": {
    "lint:md": "markdownlint-cli2 \"**/*.md\"",
    "lint": "pnpm lint:md && pnpm lint:ts",
    "typecheck": "tsc --noEmit",
    "validate": "tsx scripts/validate.ts",
    "check": "pnpm lint && pnpm typecheck && pnpm validate"
  }
}
```

> EDIT: please use oxlint and oxfmt! and add a .vscode directory whose config sets oxc as default formatter

This is illustrative. Adjust scripts to match the actual scaffold and ensure every command works.

Validation should eventually cover:

- Marketplace manifest schemas.
- Plugin manifest schemas.
- Skill metadata/frontmatter.
- Required skill and plugin files.
- Duplicate names and identifiers.
- Broken local references.
- Compatibility between marketplace entries and plugin directories.

Implement a proportionate foundation now. If there is nothing to validate yet, empty directories should be accepted.

Don't build a custom schema framework when existing schemas or libraries are suitable.

## 7. GitHub workflows

Create a high-quality CI foundation.

At minimum:

**Validation workflow**

- Run on pull requests and pushes to `main`.
- Set appropriate minimal permissions.
- Set up Node.js and pnpm.
- Install dependencies using a frozen lockfile.
- Cache dependencies appropriately.
- Run Markdown linting.
- Run TypeScript linting and type checking.
- Validate repository structure and manifests.
- Fail clearly on validation errors.

**Repository quality**

- Provide a useful pull request template.
- Provide lightweight issue templates for proposing plugins, skills, and reporting bugs.
- Include a Dependabot configuration if justified.
- Use pinned or appropriately versioned GitHub Actions.
- Prevent concurrent or redundant workflow runs where appropriate.
- Avoid unnecessary tokens, secrets, and elevated permissions.

Keep CI fast and predictable.

Don't add release automation or auto-publishing workflows yet.

## 8. Deliberately out of scope

Do not implement:

- Actual skills.
- Actual plugins.
- Example or dummy plugins.
- MCP servers.
- Directus integration.
- Evaluation frameworks (`evals/`).
- Makefiles.
- Python tooling.
- Provider-specific generated distributions.
- Automated releases.
- Publishing to ChatGPT or other marketplaces.
- Complex build pipelines.

We want to establish the architecture without committing prematurely to functionality.

## 9. Quality expectations

- Follow SOLID principles where relevant.
- Prefer simple, functional, composable TypeScript.
- Use explicit types and typed error handling.
- Document functions with JSDoc.
- Use Zod v4 to validate unknown structured input.
- Keep the repository provider-neutral by default.
- Avoid unnecessary abstractions.
- Don't create empty infrastructure merely for possible future features.
- Ensure that all implemented checks pass.
- Keep documentation consistent with the actual implementation.

## 10. Definition of done

The task is complete when:

- [ ] The repository structure is established.
- [ ] `plugins/` and `skills/` are ready for future content.
- [ ] Marketplace manifests are present where valid.
- [ ] `AGENTS.md` provides useful coding-agent guidance.
- [ ] `README.md` clearly communicates the project's purpose.
- [ ] `ARCHITECTURE.md` explains the design and major decisions.
- [ ] Contributor documentation exists.
- [ ] Markdown linting works.
- [ ] TypeScript tooling is configured appropriately.
- [ ] A functional validation workflow exists.
- [ ] All quality checks pass.
- [ ] No real or dummy plugins/skills have been created.

After implementation, provide a concise summary of the scaffold, decisions made, and any open questions requiring future architectural decisions.

**Do not create or publish a GitHub pull request unless explicitly requested.**
