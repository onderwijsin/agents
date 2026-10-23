![Stichting Onderwijs in](https://raw.githubusercontent.com/onderwijsin/.github/main/banner.png)

# Onderwijs in · Agents

Reusable AI capabilities for communications, editorial work, research,
and operations, distributed as plugins, shared workspace skills and maintained agent definitions.
[Onderwijs in](https://onderwijsin.nl) is a Dutch nonprofit helping more talented
people find their way into education. The collection is shared under the
[MIT license](LICENSE); some capabilities are generic, while others require
organization-specific sources, services or configuration.

An **Agent Skill** is a folder of Markdown instructions and optional resources that
teaches an AI assistant when and how to perform a reusable task. A **plugin** packages
skills and, when needed, connections to external services for installation together.
A **marketplace** is a catalog that helps people discover and install plugins. Every
marketplace-distributed skill belongs to a plugin; plugins are our discovery, installation, synchronization,
and versioning units. A plugin may contain one skill or several. Repository development
skills in `.agents/skills/` are separate and are not distributed through our marketplaces.

## Plugins

| Name                                                                   | Type   | Description                                                                                                                                                         |
| ---------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Onboarding](plugins/onboarding/README.md)                             | Plugin | Explore ChatGPT Business with real work and a personal learning route guided by the IT department’s Bert bot; installation and user acceptance remain to be tested. |
| [Onderwijsloket](plugins/onderwijsloket/README.md)                     | Plugin | Explore education careers, pathways, programs, regional support and experiences; plan consultations or prepare feedback with consent.                               |
| [Adviesassistent Onderwijsloket](plugins/adviesassistent/README.md)    | Plugin | Draft advice emails, prepare consultations, write or review knowledge content and fact-check claims using Onderwijsloket sources.                                   |
| [Onderwijs in Redacteur](plugins/onderwijs-in-redacteur/README.md)     | Plugin | Edit and write Dutch website content and newsletters; return text in chat or prepare a Loops draft with separate style-review support.                              |
| [Agent-instructie](plugins/agent-instructie/README.md)                 | Plugin | Write and improve Dutch prompts, skills and AI instructions for nontechnical tasks, with clear requests and verifiable outcomes.                                    |
| [Plausible](plugins/plausible-analytics/README.md)                     | Plugin | Analyze website traffic, acquisition and measured conversions in your language, with chat, chart and PDF reporting.                                                 |
| [Nieuwsbrief stijl review](plugins/nieuwsbrief-style-review/README.md) | Plugin | Review Loops newsletter drafts for team style and formatting, with optional draft corrections and test previews.                                                    |
| [Icon-generator](plugins/icon-generator/README.md)                     | Plugin | Generate PNG icons for three brands using packaged reference icons and brand-specific style rules.                                                                  |

The primary plugin deployment target is the _ChatGPT Business workspace_ marketplace. Administrators
can import a GitHub catalog through the GUI, then colleagues can discover and install
available plugins without using Git or a terminal. See the
[marketplace distribution guide](docs/marketplace-distribution.md) for prerequisites,
import settings, sync, and workspace permissions.

| Platform                 | Current repository support                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| ChatGPT / Codex          | Local marketplace entry and portable package                                                                    |
| Claude Code              | Matching marketplace; overlays where needed                                                                     |
| Other Agent Skills hosts | Portable skill content with its packaged resources; tools and service connections require host-specific support |

Catalog entries describe repository packaging, not live availability or verified runtime support.
Consult each package README for required apps and external skills, host-specific limitations,
and pending acceptance checks. Portable files do not guarantee identical tools, permissions,
or behavior on every host.

## Skills

Shared workspace skills live in root [`skills/`](skills/). They are **not included in marketplace
synchronization**: manually upload each skill, including its references, assets and scripts, to the
ChatGPT workspace. Upload it once, then attach it to any agents that need it. Changes in Git must
also be manually applied to the uploaded workspace skill.

A workspace skill can be used standalone, as a capability of an agent, or both. Its required apps
and other skill dependencies must be available in either case. The Agents column below lists
current agent consumers; each skill also records these in its `metadata.agents` array.

Skills belonging to plugins are always packaged with that plugin under
`plugins/<plugin-name>/skills/` and synchronize with it. They follow the plugin installation route,
separately from the manually uploaded workspace skills listed here. Repository development skills
in `.agents/skills/` remain contributor tooling.

| Name                                                                   | Agents                           | Purpose                                                                              |
| ---------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------ |
| [code-documentation](skills/code-documentation/SKILL.md)               | Docs Drift                       | Write and improve repository, API and code documentation.                            |
| [commitment-scanning](skills/commitment-scanning/SKILL.md)             | Commitment Manager               | Find attributable, outstanding personal commitments in configured sources.           |
| [docs-sync-audit](skills/docs-sync-audit/SKILL.md)                     | Docs Drift                       | Compare documentation with implementation and report evidenced drift.                |
| [github-activity-discovery](skills/github-activity-discovery/SKILL.md) | Docs Drift                       | Discover repositories with relevant activity and diagnose commit-search coverage.    |
| [notion-formatting](skills/notion-formatting/SKILL.md)                 | Commitment Manager, Task Manager | Format, preserve and verify Notion page content during authorized writes.            |
| [notion-task-storage](skills/notion-task-storage/SKILL.md)             | Commitment Manager, Task Manager | Map Notion task schemas, retrieve tasks and verify authorized creation or updates.   |
| [scan-sensitive-data](skills/scan-sensitive-data/SKILL.md)             | Pipedrive Sanitizer              | Classify potentially sensitive information and propose minimal, masked redactions.   |
| [task-processing](skills/task-processing/SKILL.md)                     | Commitment Manager               | Qualify commitments, consolidate evidence and decide whether tasks are missing.      |
| [task-review](skills/task-review/SKILL.md)                             | Task Manager                     | Review existing tasks for completion, planning, aging backlog, quality and priority. |
| [task-storage](skills/task-storage/SKILL.md)                           | Commitment Manager, Task Manager | Route task operations through a provider-neutral storage contract.                   |

## Workspace agents

Workspace agents in [`agents/`](agents/) combine instructions and configuration,
connected-app policies, reference files, and reusable workspace skill dependencies.
They are a separate resource class alongside plugins, with Git as the maintained
source and ChatGPT as the runtime. Workspace agents use apps (MCPs) and separately uploaded
standalone workspace skills; they cannot use plugins or plugin-bundled skills. Agent skill
sources live under root [`skills/`](skills/) for manual upload once per workspace,
then attachment to any consuming agent. Agent frontmatter declares dependencies;
`pnpm validate` checks dependency files, skill consumer agreement and all three README inventories,
then prints the skill consumer index.

| Agent                                                       | Purpose                                                                                                                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Commitment Manager](agents/commitment-manager/README.md)   | Find verified personal commitments and create tasks in a configurable destination; Notion is the first provider.                                                   |
| [Task Manager](agents/task-manager/README.md)               | Review existing tasks, propose planning and priority decisions, and apply narrow verified improvements; invocation-configured with Notion storage.                 |
| [Docs Drift](agents/docs-drift/README.md)                   | Audit documentation against repository activity or explicit full-audit targets, prepare documentation-only draft PRs, and maintain workflow PRs on scheduled runs. |
| [Pipedrive Sanitizer](agents/pipedrive-sanitizer/README.md) | Check Onderwijsloket Pipedrive persons and notes against current policy, record findings in Notion, and apply approved redactions through manual remediation.      |

Agent READMEs document setup, permissions, configuration and verification status.
Commitment Manager and Task Manager accept personal settings through invocation;
Docs Drift accepts audit scope and mode; Pipedrive Sanitizer retains a fixed
organization-specific service configuration. A listed definition does not establish
that the agent is deployed or available to colleagues.

**Deployment limitation:** Agent definitions are maintained manually in the ChatGPT
web UI; this repository provides no agent marketplace import or automatic sync.
Workspace skills are managed separately and linked to the agent. Local edits have
no effect until copied into the workspace. See [agent deployment](docs/agent-deployment.md)
for the manual setup and update procedure and [agent best practices](docs/agent-best-practices.md)
for authoring guidance.

## Contribute

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Propose a reusable capability through a
GitHub issue, then contribute it through a reviewed pull request. Nontechnical colleagues
can contribute task examples, instructions, and feedback without writing software.

- [Vision and development direction](docs/vision.md): priorities and dynamic references through Directus.
- [Reference synchronization](docs/reference-synchronization.md): shared plugin sources,
  generated skill-local copies, asset placement and validation.
- [Plugin releases](docs/releases.md): reference synchronization, independent versions and Git tags.
- [Architecture](ARCHITECTURE.md): sources of truth and lifecycle.
- [Contributor setup](docs/getting-started.md): local tools and quality checks.
- [Creating skills](docs/creating-skills.md): portable instructions and metadata.
- [Creating plugins](docs/creating-plugins.md): packaging and provider compatibility.
- [Plugin integrations](docs/plugin-integrations.md): app mappings, MCP connections and provider boundaries.
- [Agent deployment](docs/agent-deployment.md): manual setup, skill uploads and runtime verification.
- [Agent best practices](docs/agent-best-practices.md): instruction design, authority and recurring workflows.
- [Agent instructions](AGENTS.md): working contract for coding assistants.

The organization may later manage dynamic skill references through Directus and MCP.
That is an exploration only; GitHub remains the source of truth for static content.
