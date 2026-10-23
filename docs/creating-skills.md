# Creating skills

A skill teaches a reusable capability, including when to use it. Start with a specific audience,
realistic task examples, and clear expected results. Follow the
[Agent Skills specification](https://agentskills.io/specification).

## Choose the deployment route

For a workspace agent, create a standalone skill under
`agents/<agent-name>/skills/<skill-name>/`. Keep resources in its `references/` and `assets/`
directories and upload each skill separately, then link it in the agent builder. Workspace agents
can use apps (MCPs) and standalone workspace skills; plugins and plugin-bundled skills are
unavailable to them. Follow [agent deployment](agent-deployment.md) for that route.

The plugin packaging and versioning rules below apply to marketplace distribution, not to
standalone workspace-agent skills. The instruction and frontmatter guidance applies to both.

## Layout and metadata

Use `plugins/<plugin-name>/skills/<skill-name>/SKILL.md` and document usage in the plugin README.
Create a single-skill plugin for an independent capability, or add the skill to an existing
plugin when its audience and ownership fit. Follow [plugin authoring](creating-plugins.md)
for the manifest and both catalog entries. Runtime `reference/`, `assets/`, and `scripts/`
belong inside the skill directory. The following is a documentation skeleton,
not an existing capability:

```text
plugins/<plugin-name>/
  plugin.json
  README.md
  skills/<skill-name>/
    SKILL.md
    reference/  (only if needed)
    assets/     (only if needed)
```

```yaml
---
name: skill-name
description: Describe the capability and the tasks that should activate it.
license: MIT
---
```

Names must match the containing directory, be 1–64 characters, use lowercase letters, digits,
and single hyphens, and have no leading/trailing hyphen. Descriptions are nonempty and at most
1024 characters. Optional fields are `license`, `compatibility` (at most 500 characters),
`metadata` (string-to-string mapping), and experimental `allowed-tools` (string).
Provider support for experimental fields differs; tool hints do not confer service permissions.

## Write the instructions

Before creating or editing a skill, read and apply the local writing-for-agents skill at
`.agents/skills/writing-for-agents/SKILL.md` (relative to the repository root), then its
`SKILL-MECHANICS.md` reference. It guides context pointers, progressive disclosure, completion
criteria, and pruning. Use it for instruction design; the Agent Skills specification defines
portable packaging and metadata. These contributor instructions are separate from the capability
being authored and should not be bundled into it. If the skill is unavailable locally, make it
available before beginning agent-authored instruction changes.

Explain inputs, steps, expected outputs, verification, and when to ask for missing information.
Keep the body focused and put detailed reference material in local files linked with relative
Markdown paths. Follow the resource contract below. Do not reference a sibling skill or package or rely on
files installed only on the author's computer. Describe external services and environment
requirements explicitly. Avoid model names, host-specific tools, and credentials by default.

## Resource paths and validation

Keep runtime references and assets inside the consuming skill. Use singular
`reference/` for Markdown reference material and `assets/` for images; plugin
presentation icons remain at plugin root.

For shared sources, generated copies, Markdown dependency selection, ownership,
cleanup and synchronization commands, follow
[reference synchronization](reference-synchronization.md). Run synchronization after
changing shared references or their consuming links, then run `pnpm check`.

Use UTF-8 Markdown, one H1, fenced code blocks with languages, and YAML frontmatter only at the
start of `SKILL.md`. Dutch instructions are welcome for Dutch-language work; explain the audience
in the README. Never publish private operational examples.

Run `pnpm check`, then manually try representative tasks and activation/non-activation cases
on each claimed host. The containing plugin is the installation and versioning unit; change
its version when its bundled skills change. Individual skills need no independent version.
`.agents/skills/` holds repository development skills and remains outside this distribution model.
Other hosts can support standalone skill installation, but GitHub-to-ChatGPT marketplace sync
discovers plugin entries and their bundled skills, not a repository-level skills directory.
