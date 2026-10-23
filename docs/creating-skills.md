# Creating skills

A skill teaches a reusable capability, including when to use it. Start with a specific audience,
realistic task examples and clear expected results. Use the [Agent Skills specification](https://agentskills.io/specification)
for the portable format and the repository conventions below for its deployment route.

## Choose the deployment route

| Source                            | Use and distribution                                                                         | References                                                                      | Metadata and versioning                                                             |
| --------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `skills/<name>/`                  | Standalone workspace use, attachment to agents, or both; manually upload once per workspace. | Skill-local `references/`.                                                      | Required `metadata.agents` array; no plugin release or marketplace synchronization. |
| `plugins/<plugin>/skills/<name>/` | Always packaged, installed and synchronized with its containing plugin.                      | Skill-local `reference/`; shared plugin references may be synchronized into it. | Standard string-only metadata; containing plugin version.                           |
| `.agents/skills/<name>/`          | Repository development guidance for contributors.                                            | Keep resources with the contributor skill.                                      | Outside workspace uploads and marketplace distribution.                             |

Workspace agents use apps (MCPs) and separately uploaded workspace skills. They cannot use plugins
or plugin-bundled skills. Follow [agent deployment](agent-deployment.md) for manual workspace setup
and [plugin authoring](creating-plugins.md) for manifests and catalog entries. Root workspace skills
remain shared sources; do not nest copies under consuming agents or add them to plugin catalogs.

## Workspace skill layout and metadata

Keep each independently uploadable directory complete:

```text
skills/<skill-name>/
  SKILL.md
  references/<topic>.md  (only if needed)
  assets/<asset-name>    (only if needed)
  scripts/<helper>      (only if needed)
  agents/openai.yaml    (optional presentation metadata)
```

Every root workspace skill requires an explicit consumer list. A standalone-only skill has an
empty array; a skill also used by agents lists their directory names:

```yaml
---
name: skill-name
description: Describe the capability and the tasks that should activate it.
license: MIT
metadata:
  agents: []
---
```

For a shared task skill, for example:

```yaml
metadata:
  agents: [commitment-manager, task-manager]
```

List each dependency in its consuming agent's `INSTRUCTION.md` frontmatter too. Update both sides
together: `pnpm validate` rejects missing, extra, unknown or duplicate consumers, ignoring array
order. It derives a consumer index from agent declarations for review. Keep the root README's
Skills table current; its entries must match the root skill directories.

The array is a repository extension for workspace skills. The Agent Skills specification defines
`metadata` as a string-to-string map, so array acceptance is not portable or verified in ChatGPT,
Codex or Claude. Other workspace metadata entries remain strings. Check target-host acceptance
before uploading; local validation does not prove it. This extension does not apply to plugin skills.

## Plugin skill layout and metadata

Create marketplace-distributed skills inside exactly one plugin and document them in that package's
README. A single-skill plugin serves an independent capability; related skills may share a plugin.

```text
plugins/<plugin-name>/
  plugin.json
  README.md
  skills/<skill-name>/
    SKILL.md
    reference/<topic>.md  (only if needed)
    assets/<asset-name>   (only if needed)
    scripts/<helper>     (only if needed)
```

Plugin skill frontmatter uses the standard format without the workspace-only consumer array:

```yaml
---
name: skill-name
description: Describe the capability and the tasks that should activate it.
license: MIT
---
```

Use the containing plugin version for bundled changes. Keep both marketplace catalogs and the
root README's Plugins table aligned with package additions and removals. Follow
[reference synchronization](reference-synchronization.md) when changing shared plugin references;
that mechanism does not copy or synchronize root workspace skills.

## Common authoring rules

Names match directories, are 1–64 characters, use lowercase letters, digits and single hyphens,
and have no leading/trailing hyphen. Descriptions are nonempty and at most 1024 characters.
Optional standard fields are `license`, `compatibility` (at most 500 characters), `metadata`
(string values, except the workspace extension above) and experimental `allowed-tools` (string).
Tool hints and presentation metadata grant no service permissions.

Before creating or editing a skill, apply `.agents/skills/writing-for-agents/SKILL.md` and its
`SKILL-MECHANICS.md` reference. These contributor instructions guide invocation, context pointers,
progressive disclosure, completion criteria and pruning; do not bundle them into runtime skills.
If unavailable locally, make them available before agent-authored instruction changes.

Explain inputs, steps, expected outputs, verification and when to ask for missing information.
Use UTF-8 Markdown, one H1 and fenced code blocks with language tags. Keep the workflow focused
and link detailed references from the steps that need them. Dutch instructions are welcome for
Dutch-language tasks; explain the audience in the appropriate README. Keep private operational
data and credentials out of examples.

Keep runtime files and transitive links inside the consuming skill's directory, including assets
and helper scripts. Reference them relative to the containing document; sibling skills or plugin-root
files are not runtime file fallbacks. Calls to other skills use their deployed skill names and require
those dependencies to be available separately. Document required services and host capabilities.

## Review, validation and deployment

Before changing a shared workspace skill, inspect every `metadata.agents` consumer's instructions,
connected files, inputs, outputs, permissions and representative tasks. An added capability must
preserve each caller's authority. A consumer list exposes impact; it does not prove compatibility.

Run `pnpm format` and `pnpm check`. Local checks validate metadata, resource links, dependency
presence, consumer consistency and root README inventories. They do not validate activation,
uploaded resource access or behavior. Exercise representative positive, negative and failure cases
on every claimed host and report anything unverified.

Manually upload root workspace skills with their resources; subsequent source changes need a
manual workspace update too. Reconcile UI-only edits before replacing an uploaded skill and verify
all linked agents afterwards. Plugin skills instead follow their plugin's installation, release
and synchronization route. Neither route grants app access or authenticates the user.
