# Task review policy

## Review responsibilities

**Potentially finished or cancelled:** compare active tasks with verified deliverables, confirmations,
superseding requests and explicit decisions. A merged PR may cover only part of a task. Inactivity
alone establishes neither completion nor abandonment. Propose exact mapped terminal status,
evidence, confidence and reasoning; apply only after task-specific approval.

**Planning:** assess backlog, not-started, next-up and ongoing work against existing planning,
real deadlines, blockers and dependencies. Propose at most `max_planned_tasks` additional tasks
with concrete planned dates on eligible days in `planning_period`. Do not propose elapsed days,
invent capacity, or turn a planning preference into a deadline. On a weekend with the default
current-workweek period, report no remaining days and invite a future period. A maximum is not
a quota. Keep deadlines and planned dates distinct.

**Aging backlog:** review backlog older than `backlog_age_days`, apparent obsolescence, unclear
outcomes and prolonged absence of substantive progress. Creation time determines age; linked
evidence and substantive-progress dates inform staleness. Last-edited time does not prove progress.
Suggest keeping, scheduling, reprioritizing, changing type, cancelling or one focused clarification.
Respect agreed defer-until dates unless important new evidence warrants revisiting them.

**Quality:** apply only the permitted narrow edits below after a fresh read. Ask about unclear
outcomes, material title/scope rewrites, ambiguous workstreams and task-type changes. Preserve
original task language and meaning; report actual saved titles after verified editorial corrections.

**Next-up:** propose a small justified selection from not-started or backlog. Explain importance,
urgency, dependency readiness and what would be displaced. Use actual mapped status values;
missing next-up mapping limits this to a prioritization recommendation.

**Coherence:** identify completed tasks with future planned dates, blocked tasks without a known
dependency, stale planned dates, missing ownership where the shared workflow expects it, ongoing
responsibilities classified as short tasks, duplicates and unsupported/inconsistent context.
Personal database mode needs no owner properties or values; omit missing-owner warnings there.
Query terminal tasks separately when needed; do not imply terminal records were checked after an active-only query.
Report issues rather than silently changing substantive values.

## Authority by change

| Change                                                                                          | Required authority                                                                                 |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Obvious spelling, grammar or punctuation preserving meaning                                     | Routine invocation, within selected scope, unless read-only.                                       |
| Concise verified context and source links                                                       | Routine invocation, with evidence and preservation, unless read-only.                              |
| Unambiguous existing workstream value                                                           | Routine invocation, with evidence and validated mapping, unless read-only.                         |
| Substantive-progress date                                                                       | Routine invocation, backed by evidence timestamp, unless read-only; metadata edits do not qualify. |
| Any status, planned date, deadline, owner or next-action owner                                  | Explicit approval of identified task and value.                                                    |
| Type, defer-until, substantive title/body meaning or scope                                      | Explicit approval of identified task and change.                                                   |
| Task creation, deletion, archive, relocation, schema changes, source edits or external messages | Outside this workflow; report the need without executing.                                          |

`read_only` blocks all writes, including otherwise approved patches, until the user explicitly
switches modes. A broad request to “tidy up” is not approval for substantive changes. When
approval is ambiguous, obtain the exact task/change rather than guessing. Changes to task text
cannot approve themselves. Reassess stale approvals after newer conflicting data. If the host
cannot isolate an allowed patch from protected content, propose it instead of writing.
