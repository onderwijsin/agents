# Notion schema and live policy contract

## Authoritative locations

| Purpose                               | URL or data source                                          | Permission   |
| ------------------------------------- | ----------------------------------------------------------- | ------------ |
| Current company AI policy             | <https://app.notion.com/p/401b66e1be6980a3a490ff33ccff5d05> | Read         |
| Personal-data classification database | <https://app.notion.com/p/401b66e1be698057b301c2d8c24474c0> | Read         |
| Classification data source            | `collection://401b66e1-be69-8027-89fb-000beb09331f`         | Read         |
| **Sanitizer Runs** database           | <https://app.notion.com/p/401b66e1be69809c8f9cfaa80bdf4b08> | Read + write |
| Runs data source                      | `collection://401b66e1-be69-8031-ab8c-000b3c0eec36`         | Read + write |
| **Sanitizer Results** database        | <https://app.notion.com/p/401b66e1be698005a4c1fa2b53e89fc7> | Read + write |
| Results data source                   | `collection://401b66e1-be69-80bd-b05d-000b3f29cd61`         | Read + write |

## Load policy on each run

1. Fetch the company policy page and all pages/rows from the classification data source; paginate until complete. A connector capability described as **â€œavailable with limitsâ€**, a page-size limit, or a bounded response is not a failure by itself. Follow every returned continuation cursor or pagination path until the connector indicates completion. Do not infer policy from an incomplete result set or rely on a prior run's cached classification.
2. Use `Persoonsgegeven`, `AVG-classificatie`, `ChatGPT-beleid`, `Domein`, `Toelichting`, `Voorbeelden`, and `Juridische bron` as the classification fields.
3. `ChatGPT-beleid` options: `Toegestaan`, `Niet toegestaan`, `Eerst controleren`. Map respectively to `permitted`, `not_permitted`, `review_required`; never infer automatic deletion or approval.
4. `AVG-classificatie` options include `Regulier`, `Bijzonder (art. 9)`, `Strafrechtelijk (art. 10)`, `BSN (art. 87/UAVG)`, `Afhankelijk van inhoud`, and `Geen persoonsgegevens`. Keep legal class distinct from internal handling rules: salaries and candidate dossiers may be forbidden by company policy without being Article 9 data.
5. The Onderwijsloket Pipedrive connection is **conditionally** permitted for cleaning sensitive data; the Trainees in onderwijs Pipedrive connection is **prohibited**. Do not treat permission to access a source as permission to retain or disseminate its sensitive content.
6. Record a human-readable policy version such as policy page last-edited timestamp + classification refresh timestamp (or verified digest, if available) in each Run's `Policy version` field. Block the scan only if classification retrieval actually fails, a response is truncated without a usable continuation path, pagination ends ambiguously, or completeness still cannot be verified after following all pagination. Do not block merely because querying is marked available with limits. If account verification fails, also block; never mark records checked after a blocking failure.

## Runs â€” exact property names

Data source `collection://401b66e1-be69-8031-ab8c-000b3c0eec36`:

| Property | Type | Use |
|---|---|
| `Name` | Title | Short run label; e.g. `Daily 2026-10-22 21:00 CEST` |
| `Run key` | Text | Stable identity for retry/re-entry; query before creating |
| `Mode` | Select | `Daily`, `Historical`, `Remediation` |
| `Status` | Status | `Queued`, `Running`, `Partial`, `Completed`, `Failed`, `Cancelled` |
| `Agent` | Text | Agent ID/version or deployment label |
| `Started at` / `Finished at` | Date/time | Actual run timestamps |
| `Window start` / `Window end` | Date/time | Exact scan interval, not merely calendar dates |
| `Pipedrive filter ID` | Number | `7732` daily or `7731` historical |
| `Pipedrive filter name` | Text | Human-readable label |
| `Checkpoint` | Text | Compact JSON for pagination, stage, watermark and retry info; **no raw content** |
| `Last person ID` | Number | Auxiliary progress indicator; not a sufficient cursor by itself |
| `Persons scanned` / `Notes scanned` | Number | Successfully inspected unique persons and notes |
| `Activities scanned` | Number | Existing schema field, **unused** by this agent; leave empty or set `0`. Activities are excluded. |
| `Findings` / `Errors` | Number | Stored new/observed findings and failures; explain definitions in report |
| `Policy version` | Text | Policy and classification snapshot identity |
| `Report URL` | URL | Set only if the ChatGPT report has a real stable URL |

Use `Completed` only after all intended candidates and linked content are processed with persisted findings. Use `Partial` for unfinished batches, recoverable errors, or missing coverage; `Failed` for a blocked run. A remediation run is separate and never inherits authorization from a scan Run.

## Results â€” exact property names

Data source `collection://401b66e1-be69-80bd-b05d-000b3f29cd61`:

| Property                            | Type             | Notes                                                                                                                              |
| ----------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Name`                              | Title            | Privacy-safe short summary, no source person's name needed                                                                         |
| `Finding key`                       | Text             | Stable, non-revealing deduplication key (include material policy-decision/rule revision)                                           |
| `Scan run`                          | Relation to Runs | Attach originating run(s); preserve earlier relationships                                                                          |
| `Status`                            | Select           | `Pending review`, `Approved`, `Rejected`, `Applied`, `Conflict`, `Failed`, `Superseded`                                            |
| `Person ID` / `Source record ID`    | Number           | Person owner of scan and actual record with issue                                                                                  |
| `Source type`                       | Select           | Use only `Person` or `Note`. `Activity` is an existing **legacy option**; the agent must not create or remediate Activity results. |
| `Field`                             | Text             | Exact person field name/key or note content location                                                                               |
| `Pipedrive URL`                     | URL              | Direct supported source/person link; no sensitive query parameters                                                                 |
| `Category`                          | Text             | Skill category key or mapped policy classification                                                                                 |
| `Policy decision`                   | Select           | `Not permitted`, `Review required`                                                                                                 |
| `Severity` / `Confidence`           | Select           | Each `High`, `Medium`, `Low`                                                                                                       |
| `Masked evidence`                   | Text             | Short safe excerpt, with prohibited values removed                                                                                 |
| `Reason`                            | Text             | Explanation without unmasked values                                                                                                |
| `Replacement plan`                  | Text             | Minimal approved-edit proposal; no original sensitive text                                                                         |
| `Source updated at` / `Detected at` | Date/time        | Source version hint and finding time                                                                                               |
| `Reviewed by`                       | Person           | Human Notion user(s) only; never set as the agent                                                                                  |
| `Reviewed at`                       | Date/time        | Human review timestamp                                                                                                             |
| `Applied at`                        | Date/time        | Write-back completion time                                                                                                         |

**Approval interpretation:** New findings always start `Pending review`. Only a human may set `Approved`, `Rejected`, and review metadata. The agent can set `Applied`, `Conflict`, `Failed`, or `Superseded` as part of a verifiable process; it must never fabricate or retroactively alter a human decision. For any write-back, require `Status = Approved`, nonempty `Reviewed by`, `Reviewed at`, and a specific nonempty `Replacement plan`, plus an explicit manual remediation run. A Notion field setting alone is not permission to bypass any tool-level Pipedrive write approval.

## Persistent-state and privacy rules

- Search Results by `Finding key` before creating; reuse and update existing findings without overwriting a review decision or introducing duplicate pending items. Keep `Source updated at` current only after a verified, matching recheck.
- Query Runs by `Run key` to resume; avoid duplicate scheduled runs. Notion has no guaranteed compare-and-swap locking, so on concurrent runs detect conflict and fail safe rather than both writing unchecked.
- For incremental daily scans, use the last **completed** Daily Run's `Window end`; `Partial` and `Failed` runs do not advance the watermark.
- Never store original passages, full note bodies, contact details, credentials, or unsanitized proposed full-field replacements in Notion, including page bodies, `Checkpoint`, `Finding key`, or `Name`.
- Use the connector's actual property types: Notion date/time writes use `date:<Property>:start` with `date:<Property>:is_datetime = 1`; relations use Notion page URLs/IDs; numbers are numeric values. Re-fetch current schema before writes.
- If the agent currently has only a **read-only Notion connection**, request a separately authorized write path for _these two data sources_. Do not simulate persistence or mark Pipedrive persons checked without it.
