# Acties task database: schema and identifiers

**Snapshot:** 2026-10-20. **Source of truth:** fetch the live data source before each run. Do not rely on this snapshot after schema changes.

## Database and identity

- **Notion database:** Acties (icon: 📌)
- **Database URL:** https://app.notion.com/p/15c2a18de08d4fc48026625625173da9
- **Linked database / working views:** https://app.notion.com/p/f49a28a1cd1c4f8bb5787fc42e7e39dc
- **Data source:** `collection://b6671e64-e68f-4254-9952-3eb599ae5b6a`
- **User ID for personal scope:** `8d725767-28e2-411d-b5cd-907ed7bf85cb`
- **User URI:** `user://8d725767-28e2-411d-b5cd-907ed7bf85cb`
- **Timezone for planning and relative dates:** `Europe/Amsterdam`

Use the exact Notion user URI when identifying or assigning this user's Notion tasks. **Do not assume connector `me` is the same identity**, and do not reuse the Notion ID as a Slack, Outlook, or other-service ID.

## Exact property names and types

| Property name                    | Notion type                  | Meaning / handling                                                                             |
| -------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `Actie`                          | title                        | Short action-oriented task title. Required for a task page.                                    |
| `Status`                         | status                       | Workflow stage; exact options below.                                                           |
| `Soort`                          | select                       | Nature of the item, independent of its status.                                                 |
| `Eigenaar`                       | people                       | Accountable for the result, even when the next action is with somebody else.                   |
| `Ligt bij`                       | people                       | Person responsible for the next action or dependency.                                          |
| `Uiterste datum`                 | date                         | Actual agreed due date / delivery commitment, not a planning placeholder. Formerly `Deadline`. |
| `Gepland voor`                   | date                         | Intended day to work on the task. Not a commitment deadline.                                   |
| `Onderdeel van`                  | text                         | Project, program, workstream, or organizational context as free text. **Not a relation.**      |
| `Toegezegd aan`                  | text                         | Person or group to whom the user committed.                                                    |
| `Bron-ID`                        | text                         | Stable source-qualified origin identifier, useful for deduplication.                           |
| `Bronlink`                       | URL                          | Openable source permalink. Formerly `Link`.                                                    |
| `Laatste inhoudelijke voortgang` | date                         | Last verified, substantive progress, not an incidental edit.                                   |
| `Niet opnieuw voorstellen vóór`  | date                         | Do not repeat a deferred agent proposal before this date.                                      |
| `Taak`                           | relation (self)              | Parent task in this same data source.                                                          |
| `Subtaak`                        | relation (self)              | Child task(s) in this same data source. Formerly `Sub taak`.                                   |
| `userDefined:ID`                 | auto_increment_id, read-only | Notion-generated numeric task ID, presented as `ID` in the UI.                                 |
| `Aangemaakt door`                | created_by, read-only        | User who created the task page.                                                                |
| `Aangemaakt op`                  | created_time, read-only      | Original task creation timestamp.                                                              |
| `Laatst bewerkt door`            | last_edited_by, read-only    | Most recent editing actor.                                                                     |
| `Laatst bewerkt op`              | last_edited_time, read-only  | Most recent Notion edit, **not** evidence of progress.                                         |

There is **no** `Last edited time 1` property (the duplicate was removed). Do not use historical English property names in queries or writes.

## Exact `Status` options

| Notion status group | Exact stored value | Meaning                                             |
| ------------------- | ------------------ | --------------------------------------------------- |
| To do               | `Backlog`          | Potentially useful, not yet scheduled or committed. |
| To do               | `Not started`      | Accepted action not yet underway.                   |
| To do               | `Next up`          | Prioritized for near-term execution.                |
| In progress         | `In progress`      | Work is underway.                                   |
| In progress         | `In review`        | Awaiting review/approval.                           |
| In progress         | `Hold for input`   | Waiting for a dependency or someone else's input.   |
| Complete            | `Done`             | Completed.                                          |
| Complete            | `Cancelled`        | Not to be pursued.                                  |

`Long term task` is obsolete and not a status option. Do not translate the stored English status values or invent additional ones. Use `Soort = Doorlopend` for a long-running responsibility where appropriate.

## Exact `Soort` options

- `Taak` - specific actionable task.
- `Doorlopend` - ongoing responsibility, not a workflow state.
- `Herinnering` - a reminder or follow-up rather than a deliverable.
- `Idee` - an idea, not necessarily an accepted commitment.

## Connector write and query conventions

- Fetch the live schema for the precise names and permitted values. Use `collection://...` as the data source, not the linked view ID, when writing task pages.
- The title property is **`Actie`**, not `Name`, `Title`, or `title`.
- Person properties accept arrays of verified user references (for this user: `["user://8d725767-28e2-411d-b5cd-907ed7bf85cb"]`).
- For date writes via the Notion connector's SQL-style property map, use `date:<Exact Property>:start`, optional `:end`, and `date:<Exact Property>:is_datetime` (0 for date-only, 1 for datetime). Example: `date:Uiterste datum:start` and `date:Uiterste datum:is_datetime`.
- Use the actual `userDefined:ID` generated by Notion for reporting. Never set it yourself.
- In SQL, quote exact property names and use expanded date columns such as `"date:Uiterste datum:start"`.
- Query the whole data source when completeness matters. SQL is convenient for scanning and filtering; if rich-text formatting/mentions matter, use faithful row results or fetch the page before writing.
- Existing views may have specific filters; never assume the currently displayed view covers all tasks, especially when checking duplicates. Preserve the user's scope filter as `Eigenaar` **OR** `Ligt bij` when the request concerns their tasks.
- Avoid any write if a field has disappeared, a value is unsupported, the account identity is uncertain, or live schema disagrees with the reference until the discrepancy is resolved.
