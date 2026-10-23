# Docs Drift

Maintained workspace-agent source for documentation audits and draft PR follow-up.
The orchestration and permissions are in [INSTRUCTION.md](INSTRUCTION.md).
Read-only repository selection and the request template are in the standalone
[github-activity-discovery skill](skills/github-activity-discovery/SKILL.md).
The GitHub account and action policy are in [apps/github.yaml](apps/github.yaml).

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

The historical failing requests were not available, so their exact cause remains
unconfirmed. Search-based discovery relies on GitHub's index; partitioning handles
result limits but does not prove index freshness. Timestamp partitioning, saturated
repository fallback, alternate-default-branch handling, and the revised complete
workflow still require testing in the deployed agent.

## Manual deployment and verification

Follow [agent deployment](../../docs/agent-deployment.md):

1. Upload `skills/github-activity-discovery/` as a standalone workspace skill and
   link it to Docs Drift alongside `docs-sync-audit` and `code-documentation`.
2. Copy the Markdown body of `INSTRUCTION.md`, excluding YAML frontmatter, into
   Docs Drift's instructions editor. Confirm the new skill loads for selection
   and read-only commit-search diagnostics. Audit and writing guidance now load
   when their respective workflow steps begin.

App permissions and connected files are unchanged. This README is maintainer
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

Repository checks validate source quality, not installation or runtime behavior.
Editing Git alone does not update the deployed agent or its schedule.
