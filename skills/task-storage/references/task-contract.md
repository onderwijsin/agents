# Task storage contract

This is an instruction-level interface, not an executable API or strict prompt syntax.

## Inputs and records

| Concept       | Required handling                                                                                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Destination   | Verified provider, account/workspace and canonical collection identity with permissions for the requested operation.                                                                     |
| Subject       | Human whose tasks are processed; verified provider identity when assignment is required.                                                                                                 |
| Task          | Actionable title, concise context, subject/owner, recipient when known.                                                                                                                  |
| Task language | Resolved language for generated title, description and body labels; preserve it during provider mapping. Evidence quotes, IDs and exact schema/status values retain their original form. |
| Dates         | Agreement timestamp, explicit deadline and separately explicit planned work date; preserve timezone semantics.                                                                           |
| Evidence      | Source-qualified account and actual originating IDs, verified links when available, stable action discriminator and cross-source aliases.                                                |
| Lifecycle     | Normalize existing states to open, completed, cancelled or unknown; retain exact provider values.                                                                                        |
| Stored result | Actual task ID, returned URL when available, normalized fields and verification outcome.                                                                                                 |

Optional concepts may be absent. Title, ownership meaning, evidence and commitment identity must
survive storage; body text can carry concepts without dedicated properties. Never fabricate
provider IDs or source URLs. A commitment identity combines source provider/account, original
record ID and stable action discriminator. Cross-source aliases support repeated discovery;
semantic lookup remains necessary for manually created tasks.

## Database mode and ownership

Receive `task_database_mode: personal | shared`, accepting explicit natural-language equivalents.
Use `shared` when omitted to preserve owner-based selection. Resolve conflicting settings before
querying or writing. Missing owner properties never establish that a database is personal.

- **Personal:** the user explicitly identifies the destination as their personal task database.
  Database membership defines task scope, subject to explicit task IDs or filters. Owner and
  next-action-owner properties are optional and do not filter this scope. Preserve existing
  ownership values; the mode authorizes no reassignment. On creation, preserve the verified
  commitment owner in a mapped property or body. Missing owner properties or values are not
  coherence issues in this mode.
- **Shared:** select tasks whose mapped accountable owner OR next-action owner is the verified
  subject, subject to explicit task IDs or filters. Use whichever ownership mappings exist and
  report missing mappings as scope limitations. If neither is usable, require an explicit task
  selection or clarification; never broaden to the whole database automatically. An explicit
  broader/team selection supersedes owner filtering. Creation requires a writable accountable-owner
  mapping and a resolved assignment value, so new tasks enter the shared ownership workflow.

An explicit selection establishes review scope without inventing ownership. Source attribution
remains required for commitment capture in either mode. Ownership fields, mode and task selection
are independent of permissions and lifecycle requirements.

## Operations

- **Discover:** resolve destination, schema, field/status mappings, required values, account
  identity and relevant provider capabilities. Return ambiguities and unsupported requirements.
- **Search:** find identity, link and semantic matches across every lifecycle state. Paginate
  until relevant coverage is complete. Return matched records, lifecycle and completeness;
  unknown lifecycle or inaccessible relevant records prevents a definitive absence claim.
- **Create:** accept a normalized task and explicit caller authority, recheck duplicates, write
  in the verified destination and return its real reference. Preserve required evidence in
  dedicated fields or body. Do not silently drop required values or fill unknown required fields.
- **Verify:** read back destination, title, lifecycle, ownership, dates, evidence, identity and
  body. Return verified, failed or pending with discrepancies. Creation counts only when verified.

A lookup before creation reduces duplicates but is not atomic. Providers must disclose absent
uniqueness/transaction guarantees. Keep one writer per destination within a run; overlapping
runs can still race. An uncertain response requires lookup before retry, and an inconclusive
lookup keeps the operation pending rather than authorizing another creation.

## Existing-task maintenance

These operations add capabilities without granting authority. A creation-only caller such as
Commitment Manager still leaves existing tasks unchanged. Receive the caller's resolved review
scope, maintenance policy, explicit approvals and read-only mode with each operation.

- **List:** retrieve tasks using the resolved database mode and explicit selection above.
  Include relevant parents and children;
  label contextual relatives outside scope read-only. Return all relevant pages, completeness,
  exact lifecycle values and normalized review states. Active scope excludes completed/cancelled;
  coherence queries may separately include terminal tasks. Unknown states remain visible as gaps.
- **Read:** fetch current properties, body, relations, evidence and revision metadata for a real ID.
  Reject out-of-destination or out-of-scope edits, including contextual relatives.
- **Update:** accept a task ID, field/body patch, observed values or revision, reason/evidence and
  authority for each change. Re-fetch immediately before writing; if a relevant value or meaning
  changed, reassess and obtain renewed approval for materially changed proposals. Apply the
  smallest patch, preserving unrelated content, evidence identities and properties. No schema
  changes, task creation, deletion or relocation is implied by this operation.
- **Verify update:** read back changed values and surrounding preserved content. Return verified,
  failed or pending with actual IDs/links and discrepancies. A timeout is not proof of failure;
  inspect the live task before retrying and skip changes already applied. A partially applied
  patch is reported field by field; do not replay the entire patch blindly.

Normalize optional review concepts: accountable owner, next-action owner, parent/children,
backlog, not-started, next-up, in-progress, blocked, completed, cancelled, task type, workstream,
creation time, substantive-progress date, defer-until, planned date and deadline. Keep exact
provider values alongside them. Last-edited time is metadata, never proof of substantive progress.
Report unsupported optional concepts and skip dependent decisions rather than inventing values.
Missing essential identity, unresolved task scope or lifecycle mappings blocks the affected review.
Owner mappings are required only for operations that depend on assignment or owner-based selection.
Providers must describe update support, preservation, concurrency limitations and retry behavior.
