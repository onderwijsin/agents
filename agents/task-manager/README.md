# Task Manager

Maintainer source for a shared personal-task review agent, complementary to
[Commitment Manager](../commitment-manager/README.md). Commitment Manager captures missing
promises; Task Manager reviews existing tasks, proposes planning and lifecycle decisions, and
applies only narrow, evidence-backed quality improvements. Personal settings come from each
manual or scheduled invocation. Notion is the first storage adapter.

The Dutch [user guide](https://app.notion.com/p/402b66e1be698000b37bf0e529ec0efa) covers daily use.
This README covers maintenance, deployment and verification.

## Composition

| Source                                                     | Responsibility                                                                                                                                       |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [INSTRUCTION.md](INSTRUCTION.md)                           | Role, request modes, workflow, permissions, Memory and report. Frontmatter is a local deployment checklist.                                          |
| [Configuration reference](files/task-manager-reference.md) | Invocation precedence, defaults, scopes, examples and history isolation. Attach with this exact filename.                                            |
| [task-review](skills/task-review/SKILL.md)                 | Review decisions, maintenance permissions and approval follow-ups.                                                                                   |
| [task-storage](skills/task-storage/SKILL.md)               | Provider routing and normalized discovery, listing, reading, search, creation, update and verification contract. Caller authority limits operations. |
| [notion-task-storage](skills/notion-task-storage/SKILL.md) | Live schema mapping, scoped retrieval, targeted patches and read-back.                                                                               |
| [notion-formatting](skills/notion-formatting/SKILL.md)     | Native Notion content, preservation and verification.                                                                                                |
| `apps/`                                                    | Intended end-user access: Notion task updates, read-only Slack, Outlook Email and GitHub.                                                            |

Storage adapters are instruction-level interfaces, not executable code or automatic integrations.
No marketplace or plugin changes are required. Every skill contains its own runtime resources.

## Invocation configuration

A destination and verified human identity are essential. Resolve identity from trusted invocation
and authenticated-account context; ask when ambiguous. Default scope is accountable owner OR
next-action owner, including individually qualifying subtasks. Contextual parents outside scope
remain read-only. Optional mappings that cannot be inferred unambiguously require clarification
or a reported omission. No personal database, account or user ID is embedded here.

```text
Review my tasks in this Notion database: <database URL>.
Use only email from alex@example.com, GitHub and Notion as evidence.
Look back seven days. Propose up to five additional tasks for this workweek.
Use Europe/Amsterdam time. For this first review, make no changes.
```

Natural language and YAML settings are equivalent. See the configuration reference for
`review_window`, `planning_period`, `workdays`, `max_planned_tasks`, `backlog_age_days`,
`read_only`, source allowlists and mapping overrides. Defaults retain seven-day evidence,
the current Monday–Friday workweek, five additional planning suggestions, 90-day backlog age
and Amsterdam time. Reports follow invocation language; existing task language is preserved.
The host sets the interval separately. Save complete configuration in its scheduled prompt;
a different interval does not silently adjust evidence or planning bounds.

The [Notion mapping](skills/notion-task-storage/references/notion-mapping.md) documents aliases,
field/status overrides and optional maintenance concepts. Missing next-action-owner mapping
limits scope to accountable owner and is reported. `review_status_mappings` refine open lifecycle
states for backlog/next-up/blocked reviews. Missing optional progress, deferral or type fields
skip dependent checks; required scope and lifecycle ambiguity blocks the affected review.

## Manual deployment

Follow [agent deployment](../../docs/agent-deployment.md). Repository edits do not update a live
agent, connected file, app policy or uploaded skill.

1. Reconcile the current workspace agent with this source before overwriting UI-only changes.
2. Upload all four `skills/` directories separately through the workspace skills editor,
   including references, assets and presentation metadata. Link each skill to the agent.
   Workspace agents use standalone skills and apps; plugins do not supply their dependencies.
3. Attach `task-manager-reference.md`, preserving its name. Transfer only the Markdown body of
   `INSTRUCTION.md` through the deployment guide's builder prompt, then inspect saved formatting
   and resolved file/skill references. Apply frontmatter settings separately, including Memory.
4. Configure authenticated end-user app connections. Notion needs reads and targeted task updates;
   evidence sources need reads only. `write_actions: true` is broad: inspect actual action controls
   and service access. Prose cannot enforce row-level scope. Resolve permission gaps before writes.
   No task creation, schema modification, deletion, relocation or collaboration actions are needed.
5. Configure any recurrence and timezone in the host, storing the full invocation. Begin with
   `read_only: true` in an authorized test destination, then test narrow writes deliberately.
6. Reopen settings and verify dependency content, identities, file loading, activation, source
   scope and actual saved results. Record revision, agent identity, date, checks and gaps.

## Duplicate skills and compatibility with Commitment Manager

For now, `task-storage`, `notion-task-storage` and `notion-formatting` are complete copies in both
agent directories, as requested. Keep each pair identical when changing them; no shared-reference
or synchronization mechanism is introduced. `task-review` is specific to this workflow;
`commitment-scanning` and `task-processing` are not needed because Task Manager creates no tasks.

The storage contract adds maintenance capabilities while retaining discovery/search/create/verify.
Commitment Manager's caller policy still prohibits existing-task updates except its same-run
formatting repair. Updating the storage skill grants no new caller authority. If both agents link
to one workspace skill, reconcile its content and review both consumers before updating it; local
duplicate sources do not create two separate workspace identities automatically.

Replace the pasted `notion-task-managent`/`notion-task-management` dependency and personal reference
with these four skills and invocation configuration. Old weekly unscoped history is incompatible;
start fresh. Existing schedules must include destination, personal identity choices if needed,
source selection and review/planning preferences. No task data migration is performed.

## Adding a storage provider

Implement the [task contract](skills/task-storage/references/task-contract.md) as a standalone
provider skill with all resources inside its directory. Document destination/account discovery,
identity and lifecycle mappings, scoped complete retrieval, targeted updates, evidence preservation,
read-back, concurrency and retry limitations. Creation remains available only for callers that
authorize it. Add explicit routing to `task-storage`, link the new skill in agent frontmatter and
runtime instructions, and supply its app policy and setup documentation. Maintain both copies of
shared storage skills until shared-source handling is designed separately.

Test the provider with real authorized fixtures before claiming support. Unsupported providers
currently produce a configuration error with no fallback writes. Matching Markdown interfaces
alone do not establish connector or host compatibility.

## Validation and acceptance

Run repository checks:

```sh
pnpm format
pnpm check
```

Also inspect agent frontmatter dependencies, skill frontmatter, resource links, duplicate copies,
permissions and the entire diff, including untracked files. Existing repository checks do not
fully validate agent-local contracts or deployed behavior.

Before rollout, exercise these cases in ChatGPT using authorized fixtures:

| Case                                                                     | Expected result                                                                                 |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Two users, different destinations, missing or stale Memory               | Separate identity/scope/history; no destination reuse or cross-user decisions.                  |
| Owner-only, next-action-owner-only, subtask and contextual parent        | Independent OR scope, complete pagination; out-of-scope relatives remain untouched.             |
| Renamed fields, no numeric ID, ambiguous status, missing optional fields | Live mapping; real IDs/links; essential ambiguity blocks; optional omissions reported.          |
| Configured period/workdays, weekend, different cadence, planning limit 0 | Correct fixed bounds; no elapsed planning days; no invented capacity or silent window change.   |
| Clear completion evidence, merged PR covering only part, inactivity      | Evidence-based proposal only; no automatic terminal status.                                     |
| Editorial fix and verified context/progress date                         | Only permitted patch applied and read back; unrelated content/evidence preserved.               |
| Status/date/owner/type/deferral request and read-only mode               | Exact approval required; read-only blocks every write until explicitly changed.                 |
| Approval followed by newer conflicting data                              | Re-fetch, reassess and renew approval where materially changed.                                 |
| Timeout, partial write, second run                                       | Inspect actual state before retry; no duplicate context or blind replay; report pending fields. |
| Unavailable evidence, incomplete pagination, unsupported provider        | Explicit gaps; no comprehensive claim, unsafe writes or provider fallback.                      |
| Commitment Manager using extended storage copies                         | Existing tasks unchanged; new-task duplicate checks and creation behavior retained.             |

## Provider evidence and current limitations

Checked 2026-10-23 against the official [Agent Skills specification](https://agentskills.io/specification),
[OpenAI skill controls](https://learn.chatgpt.com/docs/enterprise/skills),
[Notion database guide](https://developers.notion.com/guides/data-apis/working-with-databases)
and the connected Notion enhanced Markdown specification. Notion distinguishes databases, data
sources and page properties; connector operations must be inspected live. Local frontmatter and
app YAML are authoring conventions, not official import formats. The workspace-agent dependency
boundary is documented in the repository deployment guide; it is not inferred from file formats.

Source checks and guide editing do not verify live agent installation, activation, resource
loading, connector coverage, task writes, scheduling or Memory isolation. Those acceptance cases
remain unverified until a maintainer runs them in ChatGPT. No live agent or workspace policy is
changed by this refactor. Concurrent writers can race between read and update; avoid overlapping
runs against the same tasks. An incomplete read or uncertain write remains a reported gap.
