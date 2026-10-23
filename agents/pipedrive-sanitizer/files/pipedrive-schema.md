# Pipedrive account, entities, filters and field mapping

## Fixed account and filter contract

| Setting                     | Value                                                           |
| --------------------------- | --------------------------------------------------------------- |
| Permitted account           | Onderwijsloket (`current_user.company_domain = onderwijsloket`) |
| Excluded account            | Trainees in onderwijs                                           |
| Daily person filter         | **7732**                                                        |
| Historical person filter    | **7731**                                                        |
| Person completion field     | **`Laatste agent check`**                                       |
| Completion custom field key | `6d63a8f42835d6397050f4790a247d4d8fb0abaa`                      |
| Completion field type       | Pipedrive `date`, use `YYYY-MM-DD` in `Europe/Amsterdam`        |

Call `getAccountContext` at the start of each run and verify the Pipedrive company domain, field key/type, and accessible account. Abort on any mismatch; never guess user IDs or custom-field keys. Do not fetch actual contacts merely to verify a filter's ID; a real scanning run verifies the query as it starts.

**Saved filter semantics matter:** `getPersons(filter_id=...)` is the authoritative candidate/eligibility query. The Pipedrive MCP documents that `filter_id` can override other person filters, including ID and owner selection. **Do not assume** `updated_since`, `updated_until`, `owner_id`, or `ids` are applied as an intersection when `filter_id` is present. For daily filter 7732, do not apply a client-side reporting-window cutoff to its results.

### Daily selection and note propagation

Filter **7732** is the authoritative Pipedrive-defined **daily candidate set**. Maintain its owner/label restrictions and daily freshness/exclusion rules **in Pipedrive**, not in agent instructions. It intentionally uses relative “on or after yesterday” conditions and requires `Laatste agent check` to be empty. That empty check-date condition helps prevent already-checked people from recurring. Never override it with an unfiltered person query.

Pipedrive cannot express the exact Amsterdam interval `[2026-10-21 00:00, 2026-10-22 00:00)`, so filter 7732 is intentionally broader than the nominal reporting period. The Run's exact Amsterdam and UTC boundaries remain authoritative reporting metadata, but they are not a client-side cutoff. Scan every filter-selected person and all directly linked notes. Do not discard a candidate, label it a window mismatch, or mark the Run `Partial` solely because `update_time`, `add_time`, or another returned date falls outside the nominal interval. Report the broader selection as a coverage caveat.

The MCP does **not** expose filter definitions for runtime verification, so treat the documented filter behavior as deployment configuration. A genuine configuration error requires concrete evidence beyond an out-of-interval returned date.

**Observed source behavior supplied by the operator:** creating or editing a note directly associated with a person updates that person's `update_time`. Therefore the daily agent does **not** need an independent global `getNotes(updated_since=...)` discovery sweep. Instead it enumerates filter 7732 persons, then fetches and scans **all** their directly linked notes. Test this source behavior with a controlled edit before production; if it stops holding, changed-note coverage is no longer assured and the workflow must be revised.

**Accepted limitation:** comparison of the date-only `Laatste agent check` with the person's modification **calendar date** can also suppress a genuine person or note change made later that same day. The operator explicitly accepts this risk. Report it as a known limitation rather than claiming perfect change detection.

Do not silently apply different owner/label criteria, reinterpret the saved filter as an unfiltered population, or treat the filter's selected rows as proof that the linked notes were fully scanned. Report that its relative-date selection is intentionally broader than the declared reporting window.

### Timestamp interpretation

- Pipedrive timestamps ending in `Z` are UTC.
- Convert them to `Europe/Amsterdam` before display and before any local-date comparison.
- `2026-10-22T21:10:00Z` converts to `2026-10-22 23:10 CEST`; this is consistent with a 23:10 Amsterdam edit and is not evidence of a timezone mismatch.

Filter 7731 may define the historical backlog (for example, by `Laatste agent check` not set). Its conditions are maintained in Pipedrive and are not reconstructed or replaced in the agent prompt.

## Supported entities and actual MCP tools

| Entity             | Discovery                                                            | Full detail | Approved write                              |
| ------------------ | -------------------------------------------------------------------- | ----------- | ------------------------------------------- |
| Person             | `getPersons` with `filter_id=7732` or `7731`, paginated via `cursor` | `getPerson` | `updatePerson`                              |
| Direct person note | `getNotes(person_id=...)`, paginated via `start`/`limit`             | `getNote`   | `updateNote` (`content` replaces full note) |

Use exact tool names exposed by the installed Pipedrive MCP; not every deployment may grant the write tools. Never add unrelated entity tools just to infer additional context. Do not infer that a person fetch includes notes. Follow note pagination until exhausted. **Do not call** `getActivities`, `getActivity`, or `updateActivity`, even if those tools remain available.

### Person fields to assess

Scan user-entered strings in relevant standard person properties and **all appropriate free-text custom person fields** found via `getAccountContext` (types such as `varchar`, `varchar_auto`, `text`). Treat names and ordinary business contact details as typically allowed regular personal data, not automatic findings. Do not scan numeric/status/controlled-vocabulary fields as prose without a reason.

Current notable free-text custom person fields include:

| Field                                       | Pipedrive field key                        |
| ------------------------------------------- | ------------------------------------------ |
| `Hoofdvraag`                                | `34fca839b00c03fb5d965ceeb1fce46c5c29c058` |
| `Eventuele deelvraag`                       | `e091d42ad1f6958df19c011a033923eef872bd65` |
| `Terecht gekomen bij Onderwijsloket via...` | `2497849bd945524a39b94eda5914f86fbb4b941e` |
| `(Bij netwerk) Functie contactpersoon:`     | `82bcd22071b9d60d9bac2a75859f62ef81d71f0b` |
| `(Bij netwerk) Afdeling`                    | `e672408c28d899c009788ddab6b90dc232601bf8` |
| `Doorverwezen naar (2021)`                  | `5d2d4a10dc4c98ffe8dd14119ccc6b60b32701ae` |
| `Doorverwezen naar (2020)`                  | `6f9032bc768b088ebed25dbcf3ec06ae06215383` |
| `Persona toelichting`                       | `ec5cbf60b514665aa79935c9a98f66b197712dcb` |
| `Toelichting knelpunten 2023`               | `95e3e68b2e9426db7c20ccbab832885b81669282` |
| `Knelpunt`                                  | `988bab2afdc0aa0c25977eba1a68aad462cef1b4` |

**Do not hardcode this list as exhaustive.** Derive relevant free-text fields afresh from `getAccountContext`. For `getPersons` and `getPerson`, `custom_fields` accepts a maximum of **15 keys** per request; partition retrieval or adjust projection if necessary and verify completeness. Use `include_labels` only when needed for reconciliation/debugging; the configured filter is the intended authoritative selection method.

### Linked notes only

- Fetch all notes with `getNotes(person_id=...)` for **each selected person**, using `start`/`limit` pagination until exhausted. This is essential because `getPerson` does not return all note content.
- Inspect the note's `content`, including text embedded in HTML. Keep the original structure intact during any separately approved edit.
- Only include notes whose record is directly linked to the person (`person_id`); ignore notes attached solely to deals, organizations, leads, projects, tasks or other entities.
- Dedupe note records by note ID. The same person can be rescanned intentionally, but do not create duplicate finding rows for the same unchanged issue.
- Do not use `getNotes(updated_since=...)` for global daily discovery: note changes are assumed to advance the associated person's modification timestamp. No note modification-date filtering is required for the selected person's full note scan.
- **Activities are entirely out of scope.** Do not fetch, scan, report or sanitize them, including activity note fields.

## Allowed source writes

### Routine scan completion, without human review

Only after successful scanning **and persisting every finding** for that person:

```json
{
  "id": 12345,
  "custom_fields": {
    "6d63a8f42835d6397050f4790a247d4d8fb0abaa": "2026-10-22"
  }
}
```

The date and person ID are illustrative. Invoke `updatePerson` with **exactly** those two top-level arguments (`id` and `custom_fields` containing only that key); no name, labels, owner, email, notes, other custom fields, or unrelated keys. Skip an identical date write to avoid a self-created update. Record errors and leave the person unchecked if writing fails.

The single date field is shared across runs and could be shared by **multiple agents**. It records the latest _agreed_ scanning contract, not which agent or which policy version checked a person. Namespace Runs by agent and policy version, and do not treat another agent's stamp as proof of your coverage if its responsibilities differ.

The generic `updatePerson` tool can technically change other fields; unless tool-level argument constraints enforce this, the date-only exception is an **instruction-level restriction, not a technical permission boundary**. Keep tool approval safeguards as available.

### Human-approved redactions

When (and only when) a Result is human-approved and a **manual remediation** run is explicitly requested:

- Re-fetch the current source; compare its update timestamp and the exact target field with the reviewed plan. A changed source without independently provable equivalence is a `Conflict`, never an overwrite.
- For a person, update only the specifically approved text property and preserve every other field.
- For a note, `updateNote(content=...)` **replaces the entire body**; reconstruct it without altering unrelated content, links or formatting. If faithful reconstruction isn't possible, record `Conflict` or `Failed` and refer for manual remediation.
- Re-read the source after the write; mark the Notion Result `Applied` only after verification. Never delete records or make sweeping redactions.

Use source-specific URLs returned by Pipedrive when available; otherwise link to the appropriate person page if verified. Never guess a note deep-link format or put sensitive material in link parameters.
