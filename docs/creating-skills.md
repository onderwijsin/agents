# Creating a standalone skill

A skill teaches a reusable capability, including when to use it. Start with a specific audience,
realistic task examples, and clear expected results. Follow the
[Agent Skills specification](https://agentskills.io/specification).

## Layout and metadata

Use `skills/<skill-name>/SKILL.md` and add a package README. Optional `references/`, `assets/`,
and `scripts/` belong inside that skill's directory. The following is a documentation skeleton,
not an existing capability:

```text
skills/<skill-name>/
  SKILL.md
  README.md
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
Markdown paths. Include resources in the skill; do not reference a sibling package or rely on
files installed only on the author's computer. Describe external services and environment
requirements explicitly. Avoid model names, host-specific tools, and credentials by default.

Use UTF-8 Markdown, one H1, fenced code blocks with languages, and YAML frontmatter only at the
start of `SKILL.md`. Dutch instructions are welcome for Dutch-language work; explain the audience
in the README. Never publish private operational examples.

Run `pnpm check`, then manually try representative tasks and activation/non-activation cases
on each claimed host. Standalone skills are not marketplace entries. Shared packaging into a
plugin needs an ownership and packaging decision first; no automatic copying exists.
