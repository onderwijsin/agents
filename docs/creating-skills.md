# Creating a skill within a plugin

A skill teaches a reusable capability, including when to use it. Start with a specific audience,
realistic task examples, and clear expected results. Follow the
[Agent Skills specification](https://agentskills.io/specification).

## Layout and metadata

Use `plugins/<plugin-name>/skills/<skill-name>/SKILL.md` and document usage in the plugin README.
Create a single-skill plugin for an independent capability, or add the skill to an existing
plugin when its audience and ownership fit. Follow [plugin authoring](creating-plugins.md)
for the manifest and both catalog entries. Optional `references/`, `assets/`, and `scripts/`
belong inside the skill or its containing plugin. The following is a documentation skeleton,
not an existing capability:

```text
plugins/<plugin-name>/
  plugin.json
  README.md
  skills/<skill-name>/
    SKILL.md
    references/  (only if needed)
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
Markdown paths. Skills may
share resources inside their plugin root when the plugin is their explicit installation boundary;
document that they cannot be installed separately. Do not reference a sibling package or rely on
files installed only on the author's computer. Describe external services and environment
requirements explicitly. Avoid model names, host-specific tools, and credentials by default.

Use UTF-8 Markdown, one H1, fenced code blocks with languages, and YAML frontmatter only at the
start of `SKILL.md`. Dutch instructions are welcome for Dutch-language work; explain the audience
in the README. Never publish private operational examples.

Run `pnpm check`, then manually try representative tasks and activation/non-activation cases
on each claimed host. The containing plugin is the installation and versioning unit; change
its version when its bundled skills change. Individual skills need no independent version.
`.agents/skills/` holds repository development skills and remains outside this distribution model.
Other hosts can support standalone skill installation, but GitHub-to-ChatGPT marketplace sync
discovers plugin entries and their bundled skills, not a repository-level skills directory.
