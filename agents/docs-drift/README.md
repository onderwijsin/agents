# Docs Drift

Maintained workspace-agent source for documentation audits and draft PR follow-up.
The orchestration and permissions are in [INSTRUCTION.md](INSTRUCTION.md).
Read-only repository selection and the request template are in the standalone
[github-activity-discovery skill](../../skills/github-activity-discovery/SKILL.md).
The GitHub account and action policy are in [apps/github.yaml](apps/github.yaml).

## Operating modes

One shared agent accepts invocation configuration in manual prompts and saved
host-managed schedule prompts. Read the attached
[configuration reference](files/docs-drift-reference.md) for accepted syntax,
precedence, validation, and lifecycle scope.

- `activity-scan` (default): discover accessible non-archived repositories with
  `main` commits in a fixed UTC window. With no arguments, use the rolling seven
  days ending at run start. Inspect changes and pre-existing drift in adjacent
  documentation. Discovery, audit history, and reviewer counts share the bounds.
- `full-audit`: inventory documentation and implementation across exactly the
  named repositories at `branch` (default `main`), independent of recent commits.
  Report inventoried/deeply inspected counts and remaining surfaces; partial
  inspection never establishes complete coverage. PR branches start from and
  target the selected branch. Missing targets/branches are reported without fallback.
  Reviewer counts use a separate rolling seven-day window on that branch.

```yaml
mode: activity-scan
scan_window: 14d
```

Equivalent: “Scan activity from the last 14 days.” Historical windows accept
`scan_window` with `start` and `end` UTC timestamps; see the reference examples.

```yaml
mode: full-audit
repositories:
  - onderwijsin/nova
  - https://github.com/onderwijsin/directus-extensions
branch: develop
```

Equivalent: “Run a full documentation audit on onderwijsin/nova and
onderwijsin/directus-extensions, branch develop.” A single repository string is
also accepted. Invalid/conflicting configuration asks for clarification in manual
runs and blocks the audit with a report in unattended runs.

Both modes preserve substantiated documentation-only corrections, established
coverage limits, `.agents/skills` exclusion, overlap checks, draft PR markers,
reviewer selection, and no merge/auto-merge rules. Invocation settings do not
extend access or permissions.

Scheduled runs independently maintain existing workflow PRs across accessible
repositories even when no new audit qualifies or audit configuration is blocked.
Manual runs skip PR maintenance, keeping targeted full audits within their named
targets. Scheduled full audits retain that separate maintenance task without
expanding their new-audit targets.

## Commit-search compatibility

Checked on 2026-10-23 against GitHub's official
[commit search syntax](https://docs.github.com/en/search-github/searching-on-github/searching-commits)
and [REST search endpoint](https://docs.github.com/en/rest/search/search#search-commits):

- Commit search searches the default branch. It supports organization, owner,
  repository, and committed-date qualifiers; `branch:main` is not a supported
  commit-search qualifier. Repositories with another default branch need direct
  `main` history checks to preserve the workflow's branch scope.
- The REST endpoint supports `page`, `per_page`, `total_count`, and
  `incomplete_results`. The inspected connector schema exposes `topn` without a
  page argument; its observed response contained only `commits`. The workflow
  therefore partitions saturated queries rather than assuming REST pagination
  or completeness metadata is available through the connector.
- In the Codex connection labelled Agents, a qualifier-only organization query
  returned 100 commits across six repositories. Requesting `topn:200` still
  returned 100; a separate CLI REST query reported 158 matches. Adding
  `branch:main` returned two commits whose messages mentioned that phrase.
  These observations do not establish the deployed agent's account identity.
- The maintainer separately tested `mcp__GitHub__search_commits` in Docs Drift's
  preview with `org: onderwijsin`,
  `query: committer-date:2026-10-16..2026-10-23`, `sort: committer-date`, `order: desc`,
  and `topn: 10`. It returned ten commits across two repositories without an
  account identifier. This verifies broad search on that agent's connection
  despite the connector description claiming a text term is required.
- A further Codex connector query using
  `committer-date:2026-10-23T12:00:00Z..2026-10-23T14:00:00Z` returned one commit
  within that interval, confirming acceptance of UTC timestamp bounds on that
  connection.
- For the fixed UTC window 2026-10-16 00:00 through 2026-10-23 00:00, seven
  daily connector queries returned 148 unique repository/SHA pairs. They exactly
  matched two CLI REST pages (100 and 48 results, both reporting
  `incomplete_results:false`). A separate saturation probe started with the full
  window, returned 100, and recursively bisected it; five requests recovered the
  same 148 pairs. The CLI and connector used their respective authentication;
  this matching result does not establish equal permissions in other scopes.

For [issue #36](https://github.com/onderwijsin/agents/issues/36), the maintainer
confirmed that the preceding skill revision was deployed before the reported run.
Missing deployment does not explain that incident. The historical tool-call trace
was not available, so its root cause remains unverified.

A read-only Codex replay on 2026-10-23 used the Agents connection and the exact tool
`mcp__codex_apps__github_search_commits`. Every call explicitly supplied
`org: onderwijsin`, `sort: committer-date`, `order: desc`, and `topn: 100`, with
`query: committer-date:START..END` and the bounds below. The connection identifier
was supplied through the tool's required `link_id` argument. All seven responses
reported `isError:false` and contained `commits`, without completeness metadata.

| UTC start            | UTC end              | Returned commits |
| -------------------- | -------------------- | ---------------- |
| 2026-10-16T15:20:00Z | 2026-10-17T15:20:00Z | 4                |
| 2026-10-17T15:20:00Z | 2026-10-18T15:20:00Z | 0                |
| 2026-10-18T15:20:00Z | 2026-10-19T15:20:00Z | 9                |
| 2026-10-19T15:20:00Z | 2026-10-20T15:20:00Z | 26               |
| 2026-10-20T15:20:00Z | 2026-10-21T15:20:00Z | 54               |
| 2026-10-21T15:20:00Z | 2026-10-22T15:20:00Z | 42               |
| 2026-10-22T15:20:00Z | 2026-10-23T15:20:00Z | 13               |

Deduplication by repository/SHA retained all 148 commits across nine repositories,
matching the issue's expected result. No requests failed, no intervals saturated,
and no retries or direct-history fallback were needed. The empty interval was a
successful search response. This tests the connector path in Codex, not execution
of the revised instructions inside Docs Drift. Runtime ledgers remain per-run
artifacts rather than repository content.

Search-based discovery relies on GitHub's index; partitioning handles
result limits but does not prove index freshness. Timestamp partitioning, saturated
repository fallback, alternate-default-branch handling, and the revised complete
workflow still require testing in the deployed agent.

## Manual deployment and verification

Follow [agent deployment](../../docs/agent-deployment.md):

1. Upload or reconcile `github-activity-discovery`, `docs-sync-audit` and `code-documentation`
   from their root `skills/` directories once in the workspace. Link all three uploaded skills
   to Docs Drift; root sources are outside marketplace synchronization. Before shared edits,
   check each skill's `metadata.agents` and run `pnpm validate` for matching consumer declarations.
2. Attach `files/docs-drift-reference.md` as `docs-drift-reference.md`, preserving
   its filename alongside the existing `pr-review-follow-up.md`.
3. Copy the Markdown body of `INSTRUCTION.md`, excluding YAML frontmatter, into
   Docs Drift's instructions editor. Confirm the new skill loads for selection
   and read-only commit-search diagnostics. Audit and writing guidance now load
   when their respective workflow steps begin.

The audit-mode change retains the same app permissions and required skill names; its configuration
reference is required. Their canonical skill sources now live under root `skills/`, with
`metadata.agents` arrays and manual workspace uploads as described in the deployment guide. This README is maintainer
documentation, not a connected file. Discovery uses seven 24-hour intervals for
a seven-day window, bisects saturated intervals, and tracks coverage in a run-local
ledger. At the timestamp precision limit it partitions by inventory repository,
then uses direct history for remaining saturated repository intervals. Connector
pagination is not available in the inspected schema; this is a query-partitioning
workaround.

Before a full scheduled run, use a read-only preview to exercise discovery with a
fixed window. Verify an organization query, a saturated window split with boundary
deduplication, a personal owner when accessible, a repository whose default branch
differs from `main`, and failed-search reporting. Compare qualifying repositories
and reviewer counts with direct `main` history for representative repositories.
Confirm required skills and the existing PR-follow-up reference still load. Check
that a diagnostic stops after its requested probes, and that discovery returns
selection evidence and unresolved coverage without auditing or writing changes.
Include a same-second saturation case and an unresolved child interval; verify that
the ledger never marks their parent covered prematurely. These fallback cases were
not exercised by the live connector probes above.

For the issue #36 acceptance check, run a read-only diagnostic in Docs Drift over
2026-10-16T15:20:00Z through 2026-10-23T15:20:00Z using seven 24-hour intervals.
Inspect the actual tool trace and returned ledger for the exact qualifier-only
arguments, observed counts/errors, and any discrepancy from the replay above.
Confirm successful searches stay on the organization-wide path and empty results
remain distinct from malformed-query errors and connector failures. Exercise those
error branches separately and verify the one-retry rule and evidence-backed fallback
scope. Preserve the actual trace when investigating the prior incident; its deployed
skill status is already confirmed. The revised source has not been deployed or
preview-tested by this repository change.

Repository checks validate source quality, not installation or runtime behavior.
Editing Git alone does not update the deployed agent or its schedule.

## Mode verification before deployment

The mode changes are authored source, not a live-agent deployment. Upload the new
reference and update the instruction body manually; retain the existing skills
and PR-follow-up reference. Configure any custom mode/window in the schedule's
saved prompt rather than changing agent-wide defaults.

Preview both YAML and equivalent natural-language prompts. Verify the no-argument
scheduled seven-day scan and independent PR maintenance; relative and historical
windows must match discovery, audit history, and reviewer counts exactly. Exercise
one/multiple full-audit targets, a repository with zero recent commits, and a
non-`main` branch. Inspect inventory counts, remaining surfaces, branch reads,
PR source/base, overlap checks, marker, and reviewer lookback. Test missing targets,
missing branches, absent repositories, contradictory modes, malformed/future
windows, and mode-inapplicable fields. Confirm a manual full audit skips maintenance
and never discovers other repositories; scheduled maintenance remains independent.
Verify configuration-reference loading and unchanged skill activation in ChatGPT.
These mode, installation, resource-loading, and runtime scenarios remain unverified
until exercised in the deployed host; repository checks do not establish them.
