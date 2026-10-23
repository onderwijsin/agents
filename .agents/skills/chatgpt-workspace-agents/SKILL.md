---
name: chatgpt-workspace-agents
description: Create, edit, or review ChatGPT workspace agents under agents/ and shared workspace skills under skills/, including instructions, app policies, connected references and consumer declarations. Prepare manual deployment handoffs for these definitions.
---

# Maintain ChatGPT workspace agents

Use `agents/commitment-manager/` as the structural baseline. Read the target definition
and its dependencies before editing. Apply the repository's writing-for-agents
guidance to instruction and skill changes. Read
[agent best practices](../../../docs/agent-best-practices.md) when designing or reviewing
behavior; read [agent deployment](../../../docs/agent-deployment.md) when preparing
manual workspace updates or checking source-to-UI mappings.

## Dependency boundary

Workspace agents can use apps (MCPs) and separately uploaded standalone workspace skills.
They cannot use plugins or plugin-bundled skills. Author shared sources under root
`skills/<skill-name>/` with all resources needed for individual upload. Upload each source once
to the workspace for standalone use, attachment to agents, or both. Make every required
skill available separately, including cross-skill dependencies; marketplace installation is
not an agent deployment route.

## Layout and names

```text
agents/<agent-name>/
  README.md
  INSTRUCTION.md
  apps/<app-id>.yaml
  files/<reference-name>.md
skills/<skill-name>/
  SKILL.md
  agents/openai.yaml
  references/<topic>.md
  assets/<asset-name>
  scripts/<helper>
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
in root `skills/<name>/` with matching `SKILL.md` names. `pnpm validate` checks all declared
skills, app files and connected files; agent-local skill directories are rejected. Keep the
root README inventories current when adding or removing agents or skills.
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
skill YAML frontmatter (`name`, `description`) followed by Markdown; names match directories.
Root workspace skills additionally require a `metadata.agents` array; use `[]` for standalone-only
skills. Follow [skill authoring](../../../docs/creating-skills.md) for its repository-only extension
and host acceptance limits. Plugin skill metadata retains the standard string-only contract. Preserve applicable `agents/openai.yaml` presentation and invocation
metadata, verifying provider-specific changes against current official guidance.

Root `skills/` holds shared standalone workspace skills outside marketplace catalogs and plugin
versioning. Declare dependencies in agent `INSTRUCTION.md` skill lists and matching consumer
arrays in each root skill's `metadata.agents`. Keep both lists aligned; the validator checks equality.
`pnpm validate` derives and prints the reverse consumer index; fix invalid declarations before
relying on it. Before changing a shared skill, read every consumer's instructions and connected
references and preserve its inputs, outputs, permissions and behavior. Review representative tasks
for all affected consumers; structural checks alone do not prove compatibility. Keep resources
inside each skill; no per-agent copies or synchronization strategy is used.

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
Repository checks validate frontmatter, dependencies, consumer agreement, README inventories and
resource links, not
live app policy enforcement, uploaded configuration or ChatGPT behavior.
Report changed source files, affected UI settings/apps/skills/files, exact check results,
and unverified activation, resource loading, or runtime behavior. Local authoring alone
does not authorize changing a live agent or shared workspace skill. When deployment is
requested, follow the deployment guide and existing user authorization.
