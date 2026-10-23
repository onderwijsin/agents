---
name: notion-task-management
description: Manage the user's existing Notion Acties task database with the correct schema, task conventions, identity, and safe read/write workflow. Use for creating tasks, finding or reviewing tasks, updating task properties or content, planning, deduplicating commitments, checking backlog, or interpreting task status and ownership. Works with the Notion connector and complements the notion-formatting skill for page-body changes.
---

# Notion task management

Work only in the existing Notion **Acties** task data source identified in [task-database-schema.md](references/task-database-schema.md). This skill supplies shared database knowledge and conventions; **it does not grant permission to edit**. The calling user or agent remains responsible for write permissions, source research, and any approval requirements.

## Workflow

1. **Determine the operation and authority.** Decide whether the request is a lookup, creation, review, proposed update, or explicitly authorized modification. Identify which tasks are in scope and which changes require approval. Never assume the user has approved status, dates, ownership, deletion, or substantive edits.
2. **Load the schema.** Read [task-database-schema.md](references/task-database-schema.md) before querying or writing. Fetch the specified live Notion data source once per run to confirm its property names, types, status values, and IDs. **The live schema wins** if it has changed; stop or report a mismatch rather than silently writing to a guessed field.
3. **Read and select tasks.** Use the named collection, exact property names, and the current Notion connector. Apply explicit scope filters. Paginate until the relevant records are covered; saved views may be useful entry points but are not guaranteed to contain all matching tasks. Include related parent/subtasks when relevant. Before modifying an existing page, fetch its latest state.
4. **Apply task conventions.** Read [conventions.md](references/conventions.md) when creating, updating, deduplicating, categorizing, or planning tasks. Preserve the distinction between actual commitments (`Uiterste datum`) and personal planning (`Gepland voor`). Use source-grounded values only; leave uncertain properties empty and ask or flag conflicts.
5. **Write conservatively, when permitted.** Prefer property-level edits and targeted page-body changes over page replacement. For every task-body creation or edit, invoke the separately installed `notion-formatting` skill to prepare native Notion blocks and verify formatting. Check for duplicates before creation and never blindly retry a possibly successful write.
6. **Verify and report.** Read back every changed task to confirm the expected properties, content, and links. Get Notion's generated numeric task ID rather than inventing one. Report task URLs, numeric IDs, what was applied versus proposed, evidence, and any failures. Never claim an unverified write succeeded.

## Reference files

- **[task-database-schema.md](references/task-database-schema.md)**: database/data source identifiers, user identity, exact live property names and types, select/status options, and write-format details. Read for every database operation.
- **[conventions.md](references/conventions.md)**: property population rules, lifecycle meanings, duplication, task-description structure, safe updating, and quality checks. Read for tasks that do more than a simple lookup.

Keep task-specific decision workflows (for example, weekly reviews or daily commitment detection) in their calling agent instructions, not in this shared skill.
