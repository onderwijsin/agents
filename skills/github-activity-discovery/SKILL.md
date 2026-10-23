---
name: github-activity-discovery
description: Discover accessible GitHub repositories with recent commits on a target branch. Use for activity-based repository selection or read-only commit-search diagnostics, including result limits, default-branch exceptions, and missing search results.
metadata:
  agents: [docs-drift]
---

# GitHub activity discovery

Identify repositories with commits on a target branch in a fixed committed-date
window using the configured GitHub connection. This skill is read-only: return
selection evidence and coverage limitations to the caller.

## Inputs and scope

Accept a branch and UTC window from the caller. When omitted, use `main` and the
rolling seven days preceding invocation. The procedure below uses `main`; substitute
the caller's target branch consistently when another branch is requested. Preserve
an existing run's fixed timestamps when retrying or investigating it.

For a diagnostic request, execute only the requested probes, using the request ledger
below, and return it with a concise outcome summary. Do not expand a diagnostic into
repository discovery or an audit unless requested.

## Discover repositories

1. Resolve and record the fixed UTC start and end timestamps from the inputs. Use the same committed-date window throughout discovery.
2. List every repository accessible through the agent's configured `GitHub` connection, following available pagination. Retain owner, archive status, and default branch. Exclude archived repositories from new audits; use this inventory to constrain search results and cover every accessible owner.
3. Divide the fixed window into consecutive 24-hour intervals starting at its start timestamp, with a shorter final interval when necessary. A seven-day run starts with seven intervals per owner. Discover recent commits with `search_commits` across each organization in the inventory for each interval, rather than fetching history for every repository. Use the request below, replacing `OWNER`, `START`, and `END` with the discovered organization and that interval's ISO 8601 UTC bounds. For personal owners, omit `org` and put `user:OWNER` in `query`. Use the agent's own connection; supply an account identifier only if its tool schema requires one.
4. Resolve result limits using the rules below, then group and deduplicate commits by repository and SHA. For inventory repositories whose default branch is `main`, a matching commit qualifies the repository. Commit search searches only the default branch: for repositories whose default branch differs or is unknown, check `main` directly for the same window, even when search found nothing. A missing `main` does not qualify; a failed lookup remains unresolved.
5. Report uncovered owners, unresolved searches, and branch lookup failures separately from repositories with no qualifying activity. Repository `pushed_at` is not evidence of `main` activity.

```json
{
  "org": "OWNER",
  "query": "committer-date:START..END",
  "sort": "committer-date",
  "order": "desc",
  "topn": 100
}
```

Execute the qualifier-only request above for the first interval of each owner as
the discovery probe; retain its results and process it like every other interval.
Successful probes keep the remaining intervals on the organization-wide search
path. `org:OWNER` inside `query` is an alternative to the `org` argument.
`branch:main` is not a commit-search branch filter; guessed message terms such as
`fix` exclude valid commits. Preserve the qualifier-only query even when the tool
description claims a message term is required: observed calls determine support.

### Record request evidence

For every discovery probe, search, retry, and fallback lookup, append a separate
entry to the per-run ledger. Record:

- An entry ID, exact tool name, configured connection, and effective arguments,
  including owner/repository scope, full query string, UTC start/end, sort, order,
  and `topn`. Distinguish omitted arguments and known defaults from explicit values;
  mark unavailable effective values unknown rather than inventing them.
- Observed success/error, returned result count (unknown on an error without
  results), any completeness metadata, and exact error text/code when supplied.
  Distinguish malformed-query/validation errors from other connector failures.
- Interval status, parent/child IDs, retry linkage, and retained results needed
  for repository/SHA deduplication.
- Before switching to direct history, the affected scope and interval, concrete
  reason, and IDs of preceding requests/errors or discrepancy evidence, such as a
  known default-branch SHA and committed timestamp missing from search.

Keep successful empty results distinct from errors and inconsistent results.
Without an actual failed call, report the cause as unverified; connector-description
text alone establishes neither a failure nor a limitation. A successful search must
not be described as unsupported.

### Process the interval queue

Maintain interval coverage alongside the request evidence above.
Use statuses `pending`, `split`, `covered`, and `unresolved`. Retain it across retries
within this run; rebuild the inventory and window for the next run.

1. Query each pending interval with `topn:100`. A successful response with fewer
   than 100 commits and no explicit incomplete-result signal marks that interval
   `covered` by search. Retain its results, including an empty result when valid.
2. Treat 100 or more commits, or an explicit incomplete-result signal, as potentially
   truncated. Mark the interval `split` and replace it with two pending intervals
   at the midpoint, rounded to a whole UTC second. Query both children; retain their
   results instead of relying on the truncated parent response.
3. Use inclusive ranges `[start, midpoint]` and `[midpoint, end]`, sharing the
   midpoint. Deduplicate retained commits by repository and SHA, and filter them
   to the original fixed window. Split only when the midpoint is strictly inside
   the interval, so both children are smaller. Never advance past the oldest result
   as a cursor: additional commits may share its timestamp.
4. If an interval cannot be split further at one-second precision, or the connector
   rejects finer timestamp bounds, partition that interval by every non-archived
   inventory repository in its scope using `repository_full_name`. This includes
   repositories absent from the truncated response. Apply the same limit checks
   to those requests. Use direct target-branch history for repository intervals
   that remain saturated or incomplete, following available history pagination.
   Mark them covered only when that interval's history has been fully retrieved.
5. A successful empty response follows step 1 unless concrete evidence contradicts
   it. For a failed request or demonstrated discrepancy, retry once with the owner
   qualifier inside `query`, preserving the UTC bounds, sort, order, `topn`, and
   qualifier-only form. Correct malformed arguments according to the observed
   validation error before this retry and record the correction. Check a known
   default-branch commit within the interval when available. Honor service retry
   guidance for rate limits. If failure or incorrect/unresolved search coverage
   persists, use targeted history for the affected scope and interval; record the
   reason and preceding evidence first. If the lookup cannot be completed, mark
   the interval `unresolved` and continue other pending intervals.
6. Finish when no pending intervals remain. A split interval is covered only when
   all its children or replacement repository checks are covered. Report overall
   discovery as `incomplete coverage` if any interval, owner, inventory page, or
   required branch check remains unresolved; known qualifying repositories can
   still be handed to the caller.

Search coverage describes the returned index results, not verified index freshness.
Disclose missing completeness metadata and observed index discrepancies. Use direct
history for affected repositories when search disagrees with known activity. Direct
history is limited to these coverage/failure cases after retry, saturation remaining
after partitioning, and default-branch exceptions in discovery step 4. A successful
probe alone never justifies whole-inventory fallback; an owner-wide failure may
require checking all repositories in that affected scope. A limited response is
never a complete commit count.

## Return selection evidence

Return:

- Fixed UTC start and end timestamps and target branch.
- Accessible repository inventory with owner, archive status, and default branch.
- Qualifying repositories with supporting commit SHAs, committed timestamps, and
  URLs; identify whether evidence came from default-branch search or direct history.
- Interval ledger with covered and unresolved scopes, subdivisions, fallback checks,
  retries, and counts before and after deduplication.
- Repositories without qualifying activity, those without the target branch, and
  unresolved scopes or lookups as separate outcomes.
- Search-index and completeness limitations, including exact failed requests and
  errors when applicable.
- A concise summary of failed requests, retries, and evidence-backed fallback
  reasons, linked to verbose ledger entries. For diagnostics, expose the exact
  qualifier-only request and its observed result or error in the returned ledger.

Selection is finished when every non-archived inventory repository is accounted for
by a covered search scope, a direct branch check, or an explicit unresolved outcome.
Discovery evidence establishes qualification, not a complete history or author count.
Leave full commit inspection, documentation audits, reviewer selection, and writes
to the caller. Reuse any history already retrieved during fallback in that handoff.
