# Pipedrive Sanitizer — report and notification contract

Produce a complete **privacy-safe** report in the ChatGPT run, and post one concise **counts-only** summary to the configured Slack channel. Persist Runs/Results in Notion first. A report is an evidence-based review aid, not evidence that the database is legally compliant or that human review has happened.

## Required ChatGPT report

Use this order and these headings. All dates and times should display `Europe/Amsterdam` with an explicit timezone; retain exact UTC boundaries in Notion Runs. Pipedrive timestamps ending in `Z` are UTC and must be converted before display or local-date comparison. For example, `2026-10-22T21:10:00Z` is `2026-10-22 23:10 CEST`.

### 1. Heading and outcome

```
# Pipedrive Sanitizer — [Daily | Historical | Remediation]
Run: <Notion run link> · Status: <Completed | Partial | Failed>
Window: <local start> to <local end>; Pipedrive filter: <7732 | 7731 | n/a>
Policy: <Notion policy version or last-edited/retrieved timestamps>
```

If a run stopped before scanning, state **BLOCKED** prominently, explain the dependency and report zero _completed_ scans; do not manufacture a Run link if none was created.

### 2. Summary and coverage

Show counts with precise definitions:

| Measure                             | Meaning                                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------------------------- |
| Eligible persons                    | Number of unique persons returned by the active saved person filter, if enumeration completed |
| Selected persons                    | Unique eligible persons due for scanning by the selected mode/window                          |
| Persons fully scanned               | Persons whose fields and **all** directly linked notes were assessed and results persisted    |
| Notes scanned                       | Distinct directly linked notes actually inspected (not merely fetched)                        |
| New findings                        | Newly created Results rows                                                                    |
| Existing findings reconfirmed       | Previously recorded issues still present; **not** new alerts                                  |
| Pending review / approved / applied | Explicit Notion Result statuses; never infer approval                                         |
| Errors / skipped / out of scope     | Exact counters and reasons; do not silently omit                                              |

Break findings down by **policy decision**, **severity**, **category**, and **source type** (`Person` / `Note` only). Never include Activity findings or an Activity scanning count. Show the scan mode, eligibility assumption, current Notion policy revision, record retrieval limits, and deduplication outcomes.

For daily filter 7732, distinguish these cases explicitly:

- **Outside the nominal reporting interval but returned by the configured filter:** a normal, intentionally broader candidate-selection outcome. Scan the candidate and all directly linked notes. Report it as a coverage caveat, not an error, skipped record, window mismatch, or reason for `Partial`.
- **Genuine retrieval or configuration error:** examples include wrong filter/account, incomplete pagination, inaccessible required records, a missing required filter condition, or evidence that the configured selector is not operating as intended. Report the concrete error and its effect on status.

The Run's exact UTC and Amsterdam boundaries describe the reporting period and Run identity; they are not a client-side cutoff on filter results. Never silently discard candidates to force them into the nominal interval.

### 3. Findings requiring review

Use a table with one row **per Result** (or a clearly labeled attached full result export if the report exceeds the conversational output limit). Include:

`Finding ID/link | Source type | Person ID | Source record ID | Field | Category | Policy decision | Severity | Confidence | Masked evidence | Proposed minimal remediation | Notion status | Pipedrive link`

**Never display original prohibited values.** Mask health details, financial figures where prohibited, government identifiers, credentials and any other restricted span. Prefer IDs over person names, and omit contact email/phone. `Masked evidence` must not recreate the secret by surrounding context. For links, only use verified Notion/Pipedrive URLs; never put source content or person identifiers into URL query strings unnecessarily.

For numerous findings, group by severity/source in the inline overview, provide the **complete** privacy-safe table in an attached file when possible, and link to the complete Results view in Notion. Do not label a truncated report as complete. If file export isn't available, say so and direct reviewers to the complete saved Notion Results records rather than pretending all rows were displayed.

### 4. Operational status

State exactly:

- **Scan completeness:** completed/partial/failed and why; distinguish a completed historical **batch** from completion of the **entire historical backlog**, and state `backlog_remaining` when known.
- **Person check dates:** how many were updated, skipped as already current, or failed. Remember stamping is independent of human review.
- **Date-only suppression:** same-calendar-day person edits, including note edits that propagate to the parent person, may be missed after stamping; this is a **user-accepted** limitation.
- **Note propagation and filter assumption:** the workflow assumes note edits update `person.update_time` and filter 7732 selects appropriate candidates. The MCP cannot inspect saved-filter rules. Report whether propagation was deployment-tested and any known coverage gap; do not claim that notes were independently date-filtered.
- **Broader daily selection:** filter 7732 intentionally uses relative “on or after yesterday” conditions plus `Laatste agent check` empty because Pipedrive cannot express the exact 24-hour Amsterdam interval. State that candidates outside the nominal interval were still processed when returned by the filter; this caveat alone does not make the run partial.
- **Timestamp interpretation:** state that `Z` timestamps were treated as UTC and converted to `Europe/Amsterdam`. Do not call a correctly converted timestamp a timezone mismatch.
- **Retries/checkpoint:** latest saved checkpoint or next run behavior; no model-memory dependency.
- **Policy/source access:** warn if policy, Notion write, Pipedrive, or Slack lacked necessary permissions.
- **Remediation:** `0 unapproved changes`; identify approved edits only in a manual remediation report.

### 5. Reviewer actions and links

Point to the saved Notion views, not to raw source excerpts:

- [Results review queue](https://app.notion.com/p/401b66e1be698005a4c1fa2b53e89fc7)
- [Scan runs](https://app.notion.com/p/401b66e1be69809c8f9cfaa80bdf4b08)

Ask reviewers to mark true positives `Approved` or false positives `Rejected`, fill `Reviewed by` and `Reviewed at`, and verify `Replacement plan`. Explain that an approved finding will **not** be edited until a later, explicitly invoked **manual remediation** run.

## Slack summary template

Send **one** message per scan, without personal names, IDs of individual contacts, raw excerpts, or details from finding descriptions:

```text
**Pipedrive Sanitizer — Daily scan**
**Status**: <✅ Completed | ⚠️ Partial | ❌ Failed>
**Window**: <local start–end>

**Persons scanned**: <n> · Notes: <n>
**Findings**: <n> new (<n> high, <n> medium, <n> low); <n> awaiting review
**Changes to source content**: 0 (scan-only)

**Review findings**: <Notion Results URL>
**Full report**: <verified ChatGPT run link if available, otherwise Notion Runs URL>

<Optional, only for incomplete runs: **Coverage gap**: concise description>
```

For a **manual remediation** run, replace the source-change line with `Applied: <n> · Conflicts: <n> · Failed: <n>`; never suggest unapproved changes were applied.

If Slack channel is not configured, accessible, or the write tool cannot post on schedule, retain the ChatGPT report, clearly state **Slack notification not delivered**, and do not claim the message was sent. Resolve the channel through an authorized connector or deployment configuration; never post findings into arbitrary channels or DM a guess. Return a real Slack message permalink if the tool provides one.

## Failure and empty-result reports

- **Zero findings** is a normal complete result if all records were inspected. Report zeros explicitly and still send the short Slack summary.
- **Blocked by missing Notion writes or policy:** no Pipedrive check-date updates; list the failed prerequisite.
- **Partial pagination or transient failure:** publish what was scanned and what wasn't, with last durable checkpoint, but never advance the completed daily watermark.
- **No stable ChatGPT URL:** leave Runs.`Report URL` empty; do not fabricate a link. A Notion link is a valid fallback for Slack.
- **Suppressed duplicate:** explain previously recorded finding status without recreating or auto-approving it.
