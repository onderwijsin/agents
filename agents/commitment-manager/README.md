# Commitment Manager

Reusable commitment scanning, task processing and storage skills for a shared team agent.
Notion is the first storage provider. Each colleague supplies personal settings in their manual
or scheduled prompt; no personal database or identity is embedded in the package.

## Installation and use

Upload each required directory from root `skills/` once as a standalone workspace skill, including
its `SKILL.md`, references, assets, scripts and presentation metadata when present. Link all five skills
in the workspace agent builder: `commitment-scanning`, `task-processing`, `task-storage`,
`notion-task-storage` and `notion-formatting`. Cross-skill calls require every named skill to be
uploaded and linked separately; uploading one does not install its dependencies.

Copy the body of [INSTRUCTION.md](INSTRUCTION.md) into the agent instructions and attach
[commitment-manager-reference.md](files/commitment-manager-reference.md). Follow the
[manual deployment guide](../../docs/agent-deployment.md). Connect and authenticate the apps
separately. Editing Git does not update a live agent or uploaded workspace skills.

Workspace agents can use apps (MCPs) and standalone workspace skills. They cannot use plugins
or skills bundled in plugins. This directory defines the agent; its reusable skills are shared root sources. Both use manual
workspace setup, outside marketplace catalogs, plugin manifests and plugin versioning.

For example, save this as the invocation prompt for a host-managed schedule:

```text
Scan my outstanding commitments. Use my Notion task database at <database URL>.
Scan only email, using alex@example.com and team@example.com.
Use Europe/Amsterdam for dates.
```

YAML fields such as `storage_provider`, `destination` and `email_inboxes` work too. The Notion
provider also accepts `database_id` as a destination alias. See the agent's
[configuration reference](files/commitment-manager-reference.md)
for precedence, defaults, source selection and checkpoint isolation. With a destination alone,
Notion mappings are inferred only when unambiguous. Supply field/status overrides when necessary;
the [mapping example](../../skills/notion-task-storage/references/notion-mapping.md) preserves the earlier
Acties naming conventions without embedding a personal identity or database.

Both personal and shared task databases are supported. Set `task_database_mode: personal` or
say “This is my personal task database” when owner properties are absent or should not define
scope. Ownership from verified commitment evidence is preserved in a mapped property or page body.
The default `shared` mode requires a writable accountable-owner mapping and a verified assignment
value for creation. Missing owner fields alone never select personal mode. Duplicate searches
remain complete in either mode, including potentially matching unassigned or differently assigned
tasks in shared databases. See the [storage contract](../../skills/task-storage/references/task-contract.md).

Timezone defaults to `Europe/Amsterdam`, including daylight saving. Override with
`timezone: America/New_York` or “Use New York time.”

Scan scope defaults to the past 24 hours (`scan_window: 24h`), including on first use. Override
with `scan_window: 7d` or “Scan the past seven days”; an explicit dated period takes precedence.
Checkpoint history records coverage without changing the requested window. Older missed intervals
are reported and require an explicitly wider scan for catch-up.

Task content defaults to each commitment's evidence language (`task_language: source`). Override
with a language name or tag, for example `task_language: nl`, or “Create task titles and descriptions
in Dutch.” This controls generated task content, including body labels, independently of the report
language. Original quotes, names, identifiers and provider status values remain intact. Changing
the setting does not translate existing tasks or create duplicates.

## Responsibilities and dependencies

- `commitment-scanning`: read configured sources and return attributable, outstanding candidates.
- `task-processing`: qualify candidates, consolidate evidence and decide whether work is new.
- `task-storage`: provider routing and the normalized persistence contract.
- `notion-task-storage`: live Notion discovery, mapping, queries, creation and verification.
- `notion-formatting`: native Notion page-body formatting and safe verification/repair.

These skills invoke each other by their uploaded workspace names. Each skill keeps its runtime
resources inside its own directory; no runtime file links point to sibling skills.
Slack and Outlook need read access; Notion needs read access and authorized task creation at the
selected destination. Meetings is optional when available in run context. Shared-mailbox author
attribution and source isolation depend on connector capabilities. Service permissions remain
service-enforced; instructions do not enforce database-level access restrictions.

## Migration

Replace the former agent-local `notion-task-management` dependency with the five skills above.
The `notion-formatting` source is in root `skills/`; update the existing workspace skill
rather than creating a separate copy per agent. Existing consumers of `notion-task-management`
need explicit migration to `task-processing`/`task-storage` and invocation configuration; this is
not a drop-in replacement for its broader existing-task maintenance workflow. No live skill is
removed or updated by this repository change.

Replace the agent instruction body and its connected reference together. Remove the old
Acties-specific reference from the deployed agent, and include destination, identity overrides
when needed, and mailbox selection in existing schedules. Old unscoped execution history is
incompatible and must not be reused. The host owns schedule timing; no schedule is embedded here.
The separate onboarding exercise remains an introductory template, not this agent's deployed source.

## Storage maintenance compatibility

The storage contract also supports scoped list/read and caller-authorized update operations for
[Task Manager](../task-manager/README.md). These capabilities do not change Commitment Manager's
creation-only policy: existing tasks remain unchanged except permitted formatting repair of its
own same-run creations. Review this boundary when updating the uploaded storage skills.

`task-storage`, `notion-task-storage` and `notion-formatting` each have one source under root
`skills/`, shared with Task Manager. Keep their `metadata.agents` arrays aligned with agent
frontmatter; `pnpm validate` checks both sides and prints the reverse index. Review both callers before changing or uploading these skills.
There are no per-agent copies or synchronization steps.

## Compatibility and limitations

The target is ChatGPT workspace agents with separately connected apps and manually uploaded
standalone workspace skills. No plugin installation path is provided. At the user's request,
upload, activation, resource loading, representative tasks and acceptance tests were skipped;
production use is the planned first runtime exercise. Repository checks cover formatting, dependency presence, consumer lists, inventories and skill resources, but do not validate deployed configuration or behavior.
Notion is the only implemented provider; other names produce a configuration error without writes.
Duplicate checks are not atomic: concurrent runs against the same destination may race. Avoid
overlapping schedules for the same user/destination. Incomplete searches and uncertain write
responses remain pending rather than triggering blind retries.

Before rollout, exercise both database modes in ChatGPT with authorized fixtures:

| Case                                                     | Expected result                                                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Explicit personal database without owner properties      | Create with verified ownership in the body; duplicate lookup and read-back remain complete.       |
| Shared database with mapped owner                        | Create with the verified subject assigned; retain full duplicate searches including other owners. |
| Shared/default mode without a writable owner mapping     | Block creation and request configuration; preserve the schema.                                    |
| Conflicting mode settings or missing subject attribution | Skip dependent work and report the unresolved configuration or evidence.                          |
| Retry or mode change against the same destination        | Live duplicate checks prevent recreating an existing commitment.                                  |

These mode-specific cases remain runtime-unverified; source review and repository checks do not
establish connector coverage or deployed behavior.

Checked 2026-10-23 against the official
[Agent Skills specification](https://agentskills.io/specification),
[OpenAI skill controls](https://learn.chatgpt.com/docs/enterprise/skills) and
[Notion database guide](https://developers.notion.com/guides/data-apis/working-with-databases).
The local agent frontmatter and task contract are authoring conventions, not provider import
formats or executable adapters. Current connector tools determine supported operations.
