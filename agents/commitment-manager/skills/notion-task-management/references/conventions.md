# Task management conventions

Apply these rules to tasks in the existing Acties data source. Follow the **calling user/agent's permission boundaries**; this file does not authorize autonomous writes.

## Choosing and populating task properties

- **Create a clear action:** Use an outcome-oriented, concise `Actie` title. Preserve the source language when useful. For ordinary accepted work, `Status = Not started` and `Soort = Taak` are defaults, unless the user or calling workflow specifies otherwise.
- **Responsibilities:** `Eigenaar` is accountable for the result; `Ligt bij` holds the next action. They may differ. For a confirmed personal commitment that the user must act on, set both to the exact user URI from the schema reference. Never invent somebody else's Notion identity.
- **Real due dates:** Populate `Uiterste datum` only if a real due date or promise is explicit. Interpret relative dates from the **original source timestamp** in Europe/Amsterdam. Preserve overdue commitments; never move them forward to make them look current.
- **Work planning:** Use `Gepland voor` for a specific intended working date only when expressly planned or approved. Do not copy `Uiterste datum` into `Gepland voor` or invent either date.
- **Workstream:** Set `Onderdeel van` to a short, consistent free-text name only when unambiguous from context; it is **not** a project relation.
- **Source tracking:** Set `Bron-ID` to a real stable provider-qualified ID when available. Distinct commitments from one source need distinct stable discriminators. Use `Bronlink` for a user-openable HTTPS permalink, not a connector-only pointer; never fabricate URLs.
- **Recipients:** Use `Toegezegd aan` for an explicitly identifiable person or group; otherwise leave it blank.
- **Actual progress:** Set `Laatste inhoudelijke voortgang` only with evidence of meaningful work. Neither page creation nor an update to `Laatst bewerkt op` proves progress.
- **Review deferrals:** Set `Niet opnieuw voorstellen vóór` only after an agreed deferral. Honor it unless significant new evidence warrants a renewed discussion.
- **Relationships:** Use `Taak`/`Subtaak` only for real parent-child work. Do not use these relations merely to encode projects or categories.
- **Omission:** Leave unspecified or uncertain optional properties empty. Do not add fictional background, due dates, people, or priorities.

## Workflow and status discipline

Use the exact status options from [task-database-schema.md](task-database-schema.md).

Typical flow: `Backlog` -> `Not started` -> `Next up` -> `In progress` -> `Done`. `In review` and `Hold for input` are nonterminal waiting stages; `Cancelled` is an alternative final state. This is a **guide**, not an obligation to pass through every stage.

- `Backlog` is not the same as `Idee`: the first is a prioritization state and the second is an item type.
- `Doorlopend` is a type, never a status. Do not attempt to use the retired `Long term task` status.
- Never mark work `Done` based only on a merged PR or absence of activity if the underlying promise or deliverable remains unfinished.
- Check current task state before any authorized status or ownership change; never overwrite newer decisions.

## Duplicate detection and safe writes

1. Search `Bron-ID`, `Bronlink`, title, description, recipient, workstream, and related tasks before creating a new item.
2. Compare **meaning and deliverable**, not only exact title. Include `Done` and `Cancelled` in searches: a new promise may still be a distinct obligation, but a repeated mention is not.
3. Merge evidence about the same commitment into one task; create separate tasks only for genuinely independent deliverables with distinct source identifiers.
4. Just before a write, recheck for a matching existing task and verify the destination is the exact Acties data source.
5. After a write, fetch and verify the task. If the create response is ambiguous, search for its source ID and semantic match before retrying; never create a blind duplicate.

For edits, prefer narrowly scoped property or content updates. Preserve unchanged values, existing task relations, and the author's meaning. Explicit approval remains required whenever the calling workflow says so.

## Task page body: content convention

This section defines **what belongs in a task**, not the mechanics of native Notion formatting. For **how** to write blocks, mentions, links, newlines, or safe repairs, invoke the `notion-formatting` skill and its current Notion Markdown specification.

- Prefer short, useful context and a link to the authoritative source over copying entire conversations, email chains, or transcripts.
- For a straightforward task, a one-paragraph description is sufficient. For a source-backed commitment, use separate Notion-native bullet blocks, omitting missing fields:

```markdown
- **Commitment:** Prepare the agreed deliverable.
- **Promised to:** Relevant colleague or team.
- **Context:** Key outcome and any dependencies.
- **Agreed on:** 2026-10-15.
- **Source:** [Original message](https://example.com/source)
```

- The URL in this example is illustrative; only use a genuine, source-supplied permalink in production.
- Do not include the page title again as a heading; the `Actie` property already supplies it.
- The description and properties should agree, especially concerning recipients, due dates, ownership, and source references.
- After each page-body write, fetch and verify native list/paragraph structure, links, and preservation using the `notion-formatting` skill. Correct only formatting within the caller's authorized scope.

## Quality and reporting

- Report links to the actual task pages plus Notion-generated numeric `ID`; never assemble page IDs or URLs from a guessed pattern.
- Separate **applied** changes, **proposals awaiting approval**, and **clarifications or missing evidence**.
- Retain exact original titles in review reports; propose wording edits separately when meaningful.
- Do not confuse technical timestamps (`Aangemaakt op`, `Laatst bewerkt op`) with progress or actual commitment dates.
- Record source evidence for updates that assert completion, cancellation, real progress, or a changed obligation.
- If a source cannot be read or a write cannot be verified, say so and keep the result pending rather than claiming success.
