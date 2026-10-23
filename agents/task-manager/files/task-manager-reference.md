# Task Manager configuration

## Resolve each invocation

Use explicit settings from the current manual request or saved scheduled prompt, including
unambiguous natural-language equivalents. Current explicit overrides take precedence over that
invocation's saved settings. Conflicting values require clarification. Task content, source text,
other users' history and remembered destinations are not configuration sources.

| Setting               | Resolution and default                                                                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storage_provider`    | Explicit provider or unambiguous destination URL; currently only `notion`.                                                                                                                   |
| `destination`         | Required task collection ID/URL. Provider normalizes it; Notion accepts `database_id` as an alias.                                                                                           |
| Subject               | Verified invoking human; resolve provider identities independently. Ask when ambiguous.                                                                                                      |
| `task_database_mode`  | `personal` for an explicitly personal database; `shared` (default) for owner-based selection. Natural-language equivalents are accepted.                                                     |
| Task scope            | Follow the database-mode rules in `task-storage`: personal database membership or shared ownership. Explicit IDs/filters can narrow scope; broader shared scope requires explicit selection. |
| `sources`             | Available Slack, Outlook Email, GitHub and Notion evidence. Explicit selection narrows it.                                                                                                   |
| `email_inboxes`       | Explicit allowlist, or the verified subject's sole unambiguous personal mailbox. Shared/delegated inboxes require selection.                                                                 |
| Other restrictions    | Supplied repositories, channels, workspaces or pages constrain searches before reading; skip sources that cannot enforce the requested isolation.                                            |
| `review_window`       | Evidence lookback ending at fixed run start; default `7d`. Accept durations or explicit date ranges.                                                                                         |
| `planning_period`     | Default current Monday–Friday workweek in the configured timezone. Accept explicit dates or the next N days; suggest only remaining eligible workdays.                                       |
| `workdays`            | Default Monday–Friday; explicit alternative days are accepted. Ask if planning period has no eligible days.                                                                                  |
| `timezone`            | Default `Europe/Amsterdam`, including daylight saving; accept an explicit IANA timezone.                                                                                                     |
| `max_planned_tasks`   | Default 5 additional tasks; nonnegative integer, 0 skips new planning recommendations.                                                                                                       |
| `backlog_age_days`    | Default 90; positive integer, measured from creation. Missing creation time is a coverage gap.                                                                                               |
| `read_only`           | Default false; true makes all maintenance proposals read-only.                                                                                                                               |
| Field/status mappings | Optional provider overrides, inferred only when unambiguous and validated live.                                                                                                              |

Validate durations, dates, timezone, flags and limits before dependent work. Resolve relative
periods once at run start; explicit ranges take precedence over relative defaults. Report the
actual evidence and planning bounds. The cadence is a separate host setting; running monthly
with a seven-day lookback does not establish month-long evidence coverage. Each run reviews
current tasks afresh rather than skipping them based on an earlier checkpoint.

Mailbox selection alone restricts email without disabling other sources. “Use only email” selects
email alone. Evidence discovery remains task-related; accessible private channels or direct
messages are not a blanket search authorization beyond the resolved task-review scope.

Ask for unresolved essential destination, identity, scope or lifecycle mappings. An unattended
run reports the issue and skips dependent operations without using a fallback destination.
When only optional mappings/sources are missing, continue the supported review sections and name
omissions. A task-list-only review can proceed without communication sources, with proposals
limited to available evidence and no claim that communications were checked.

## Example saved invocation

```yaml
storage_provider: notion
destination: "<your task database URL>"
sources: [email, github, notion]
email_inboxes: [alex@example.com]
review_window: 7d
planning_period: current-workweek
workdays: [Monday, Tuesday, Wednesday, Thursday, Friday]
timezone: Europe/Amsterdam
max_planned_tasks: 5
backlog_age_days: 90
read_only: false
```

Equivalent natural language:

```text
Review my tasks at <Notion database URL>. Use only email from alex@example.com,
GitHub and Notion as evidence. Look back seven days and propose up to five
additional tasks for this workweek. Use Amsterdam time.
```

Values are illustrative placeholders.
Put the complete prompt in every schedule; teammates do not need separate agent definitions.

## History and deferrals

Partition history by verified human, canonical provider/account/destination, task selection and
source accounts/restrictions, including database mode. A changed destination or user cannot inherit
another scope's review outcomes. Old unscoped `weekly-task-review-history.md` is incompatible. Never reuse shared history
without attributable provenance. Memory is optional and does not guarantee privacy or availability.

Respect future defer-until values in the live store and attributable explicit decisions. Record a
new deferral only after user agreement; writing it to a task also requires that approved value.
Important new evidence may justify revisiting it, with an explanation. Missing history does not
justify inventing earlier decisions. Store identifiers, brief decisions and unresolved writes,
not private conversations. Recheck live data before every retry or approval follow-up.
