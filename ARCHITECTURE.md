# Architecture

## Purpose and boundaries

The repository is the source of truth for workspace agent definitions, static AI plugins, and Agent Skills maintained by
Onderwijs in. It organizes reusable capabilities for discovery and installation in AI workspaces,
with ChatGPT Business as the primary distribution target and shared content portable across hosts.

A skill defines when and how to perform a reusable task through Markdown instructions and local
resources. A plugin is an independently distributable package of skills and optional service
connections. A marketplace indexes packages for a provider. MCP exposes external tools and data
at runtime; repository scripts support authoring and validation.

```mermaid
flowchart LR
  G[GitHub: canonical plugins and skills] --> O[.agents/plugins marketplace]
  G --> C[.claude-plugin marketplace]
  O --> B[ChatGPT Business: admin import and sync]
  O --> X[Codex: native marketplace]
  C --> A[Claude Code: marketplace]
  G --> S[Other Agent Skills hosts]
  G --> W[Shared standalone workspace skills]
  W --> U[Manual workspace upload and agent linking]
```

Portable content and packaging preserve shared instructions. Each host determines its execution
environment, available tools, authentication, and permissions. Compatibility is established per
capability and provider, not inferred from marketplace membership.

## Canonical content and provider metadata

| Location                           | Architectural responsibility                                            |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `plugins/<name>/`                  | Independently distributable plugin package and bundled resources        |
| `agents/<name>/`                   | Workspace agent definitions, app policies and connected files           |
| `skills/<name>/`                   | Shared standalone workspace skills for manual upload and agent linking  |
| `.agents/plugins/marketplace.json` | Primary ChatGPT/Codex discovery catalog                                 |
| `.claude-plugin/marketplace.json`  | Claude-compatible discovery catalog                                     |
| `.agents/skills/`                  | Contributor-facing agent skills, separate from distributed capabilities |
| `scripts/`                         | Lightweight repository authoring and validation utilities               |
| `docs/`                            | Authoring, administration, setup, and compatibility guidance            |
| `.github/`                         | Review, validation, and repository maintenance configuration            |
| `.vscode/`                         | Contributor editor configuration                                        |

Each capability has one authored source. Marketplace entries reference the same canonical plugin
directories and agree on identities. Provider-specific manifests and extensions contain only the
metadata or configuration required by their host; they do not duplicate shared skill instructions.

Plugin identity belongs in the root portable `plugin.json`. Bundled skills and resources belong
inside the plugin's distribution boundary. Every marketplace-distributed skill belongs to exactly one plugin.
Plugins contain one or more
skills and are the canonical units of distribution, installation, and versioning. Bundled skill
changes belong to the containing plugin version; skills need no independent version.
Plugin runtime resources resolve within each bundled skill directory, using singular
`reference/` for Markdown reference material and `assets/` for skill assets. Shared
authored references may live at plugin root; reference synchronization supplies only
the copies reachable from each skill's Markdown links. Generated ownership manifests
distinguish those copies from skill-private files. Release preparation synchronizes
references before versioning and commits the output consumed by marketplaces.
Validation checks the installed files without creating them. Plugin presentation
assets remain at plugin root. Symlinks are not distributable.
Repository development skills in `.agents/skills/` remain outside marketplace distribution.

Workspace agents combine instructions and configuration, connected-app policies, attached files,
and workspace skill dependencies. Shared standalone skills live in root `skills/`, with one
authored source per skill and resources kept inside each skill boundary. Agent frontmatter
declares dependencies; each shared skill lists its consumers in `metadata.agents`. Validation
checks that both declarations agree and prints the reverse consumer index.
Workspace skills can serve standalone requests, agents, or both. An empty consumer array records
standalone-only use. Workspace agents can use apps (MCPs) and separately uploaded standalone
workspace skills; plugins and plugin-bundled skills are unavailable to them. Upload each shared
skill once to the ChatGPT workspace, with its skill-local `references/`, assets and scripts, then
attach it to each consuming agent. No agent packaging or skill-copy synchronization
is involved. These skills are outside plugin catalogs and versioning.
Marketplace-distributed skills retain their canonical plugin location and have a separate audience;
marketplace installation does not supply workspace-agent dependencies.
Agent definitions are manually reconciled with ChatGPT through the
[deployment guide](docs/agent-deployment.md); repository changes do not update running agents.
The local agent layout and workspace skill metadata extension are authoring conventions, not
provider import contracts. Deployment guidance records their compatibility limits.

## Authoring, review, and validation

A capability moves from a proposal with user needs and intended hosts to authored content,
validation, host testing, and maintainer review. Approved content and catalog changes enter GitHub
together. Workspace administrators control how reviewed content becomes available to colleagues.

Validation enforces package identities, required files, metadata, resource boundaries, and
consistency between catalogs and canonical content. It also checks agent dependency files,
workspace skill consumer agreement and root README inventory coverage. Format and lint checks support readable,
maintainable instructions. Runtime testing establishes installation, activation, resource access,
and representative behavior on each claimed host. Structural validation and runtime verification
serve distinct purposes; neither substitutes for the other.

Repository tooling remains a small support layer. Scripts implement focused checks or authoring
operations; additional dependencies and abstractions require a concrete need. CI validates changes
with reproducible dependency installation and minimal permissions. The operational contract for
agents is [AGENTS.md](AGENTS.md); authoring and check procedures belong in [docs/](docs/).

## Distribution and workspace governance

GitHub catalogs define discoverable packages. ChatGPT Business administrators import the primary
marketplace and use provider-managed GitHub synchronization. A plugin may reference an existing
registered ChatGPT app without bundling its MCP server; app availability, plugin installation
policies, permissions, and member authentication remain separate workspace controls. Codex and Claude consume
their respective native catalogs. Marketplaces reference plugin packages and synchronize their
bundled contents. GitHub-to-ChatGPT marketplace sync does not discover standalone repository
skills; other hosts may support standalone Agent Skills installation independently.

Repository review governs source changes. Workspace policy governs consumption. Public repository
access, workspace import, and publication in a provider's public directory are separate distribution
boundaries. Administrator procedures and provider-specific behavior are documented in the
[marketplace distribution guide](docs/marketplace-distribution.md).

## External content and services

Static plugin and skill content remains authoritative in GitHub. A capability that consumes
externally managed organizational instructions or references accesses them through an explicit
integration boundary. The external system owns its data, access control, versions, and publication
process; the plugin owns discovery and use of that data within its documented permissions.

Directus-managed references are one possible application of this boundary. Discovery, editing,
validation, or publication through MCP requires a separately defined capability with explicit
review, authentication, and availability contracts. External content management does not replace
GitHub ownership of static packages.

The [vision and development direction](docs/vision.md) describes the goals and development
priorities for capabilities built within these boundaries.
