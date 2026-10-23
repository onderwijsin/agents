---
name: chatgpt-workspace-agents
description: Create, edit, or review ChatGPT workspace agent source under agents/, including instruction/config files, app policies, connected references, and workspace skill dependencies. Prepare manual deployment handoffs for these definitions.
---

# Maintain ChatGPT workspace agents

Use `agents/commitment-manager/` as the structural baseline. Read the target definition
and its dependencies before editing. Apply the repository's writing-for-agents
guidance to instruction and skill changes. Read
[agent best practices](../../../docs/agent-best-practices.md) when designing or reviewing
behavior; read [agent deployment](../../../docs/agent-deployment.md) when preparing
a manual sync or checking source-to-UI mappings.

## Dependency boundary

Workspace agents can use apps (MCPs) and separately uploaded standalone workspace skills.
They cannot use plugins or plugin-bundled skills. Author dependencies under the agent's
`skills/` directory with all resources needed for individual upload. Upload and link every
required skill separately, including cross-skill dependencies; marketplace installation is
not an agent deployment route.

## Layout and names

```text
agents/<agent-name>/
  INSTRUCTION.md
  apps/<app-id>.yaml
  files/<reference-name>.md
  skills/<skill-name>/
    SKILL.md
    agents/openai.yaml
    references/<topic>.md
    assets/<asset-name>
```

Use lowercase kebab-case for agent and skill directories and reference filenames.
Preserve service IDs such as `microsoft_outlook_email` in app filenames. Add only
needed resources; UI metadata and assets are optional. The baseline workspace
skills use plural `references/`; plugin skills follow their separate singular
`reference/` convention. Keep workspace skill resources inside their skill boundary.

## Instruction and config syntax

`INSTRUCTION.md` begins with YAML frontmatter, followed by the runtime Markdown body:

```yaml
---
channel: chatgpt
apps:
  - slack
  - notion
  - microsoft_outlook_email
skills:
  - notion-formatting
  - commitment-scanning
  - task-processing
  - task-storage
  - notion-task-storage
files:
  - commitment-manager-reference.md
memory: true
---
```

This is a local authoring convention, not an official import format. Use sequences
for dependencies and a Boolean for `memory`. App entries resolve to YAML filename
stems; files resolve directly under `files/`. Skills resolve to workspace dependencies
with matching `SKILL.md` names, locally documented or at an existing canonical source.
Do not introduce speculative configuration keys for future importers.

Begin the runtime body with `## Role`, then use descriptive H2 sections for the
applicable request modes, sources, workflow, decision standards, Memory, permissions,
and report contract. Adapt the sections to the task. Keep YAML out of the body copied
into ChatGPT. Name required skills and connected filenames explicitly, with conditions
for loading them. Local paths do not automatically become runtime resources.

## App policy syntax

Use one YAML mapping per connected app. These are the baseline fields and types;
choose their values from the agent's intended access rather than copying permissions:

```yaml
account_type: end-user
action_safety: allow-low-risk
safety_constraints: []
write_actions: false
read_actions: true
capability_description: >-
  Describe permitted reads, writes, destinations, and excluded actions.
```

Keep booleans unquoted and use `>-` for a folded prose scalar. An empty constraints
list encodes no structured constraints; prose restrictions do not create enforcement.
For nonempty constraints or other account/safety values, verify the actual provider
controls before documenting syntax. Align broad app capabilities with the narrower
agent workflow and record any restriction the UI cannot enforce.

## Connected files and skills

Use connected Markdown files for agent-specific detail, with one descriptive H1 and
sections grouped by responsibility. Reference them by the exact deployed filename.
Keep reusable procedures and supporting schemas in workspace skills. Use standard
skill YAML frontmatter (`name`, `description`) followed by Markdown; names match
directories. Preserve applicable `agents/openai.yaml` presentation and invocation
metadata, verifying provider-specific changes against current official guidance.

Agent-local skill sources document dependencies available through the user's workspace;
they are not owned exclusively by this agent. Inspect other consumers before changing
a shared skill. Maintain one authored source and reference it from other definitions.
Keep workspace-agent skill sources in `agents/<agent-name>/skills/` for standalone upload,
with one canonical source when reused by other agents. These sources are outside marketplace
catalogs and plugin versioning. Plugin-bundled skills cannot satisfy agent dependencies.

Use UTF-8 Markdown, inline code for literal names, numbered steps for workflows,
and fenced code blocks with language tags. Use relative Markdown links for local
navigation and explicit deployed names for runtime loading. Check pasted rendering
for escaped emphasis, literal newline escapes, broken lists, and stale filenames.

## Completion

Review every listed dependency and every changed runtime pointer. Check for conflicting
schedules, permission exceptions, duplicated rules, missing-source behavior, and retry
safety across instructions, files, skills, and app policies. Preserve unrelated baseline
content unless the task authorizes its correction; report relevant contradictions.

Run `pnpm format` and `pnpm check`. Review the full diff, including untracked files.
Repository checks do not validate this local YAML contract or prove ChatGPT behavior.
Report changed source files, affected UI settings/apps/skills/files, exact check results,
and unverified activation, resource loading, or runtime behavior. Local authoring alone
does not authorize changing a live agent or shared workspace skill. When deployment is
requested, follow the deployment guide and existing user authorization.
