# Plausible

Discover sites and configured goals, then analyze website traffic, pages, acquisition,
UTM campaigns and measured goal conversions through the existing workspace app. One
bundled skill, `plausible-analysis`, covers these related workflows and returns results in the user's language. Install the whole plugin
so its query and output references remain available. No site is hardcoded.

## Usage and output

Ask a website analytics question and name the site when it is not already known. The
skill discovers the site's reporting zone and local date with `get_sites`, checks goal
configuration with `get_goals`, and queries interval KPIs with `get_aggregate`. It uses
paginated breakdowns when needed and separates observations from hypotheses and next
checks. Discovery uses the existing caller access; unavailable metadata remains unknown.

The skill and its self-contained query and output references are written in Dutch;
results follow the language of the user's request. The seven read tools are:

| Tool              | Purpose                                                                         |
| ----------------- | ------------------------------------------------------------------------------- |
| `get_sites`       | Authorized sites, reporting time zones and site-local today; cursor pagination. |
| `get_goals`       | Configured goals, including goals with no activity; cursor pagination.          |
| `get_aggregate`   | Interval-wide totals, rates and averages.                                       |
| `get_timeseries`  | Daily, weekly or monthly trends.                                                |
| `get_breakdown`   | Ranked, paginated results for one dimension.                                    |
| `get_conversions` | Goal activity and conversion rates, optionally per page, with pagination.       |
| `compare_periods` | Two period aggregates, deltas and per-period metadata and coverage.             |

- Chat report: concise interpretation and Markdown KPI or breakdown tables (default).
- Graphs and tables: inline charts when the host can render them, with underlying values.
- PDF report: an actual attachment when the host offers file generation or PDF export.

Charts and PDFs depend on host tools; this package supplies reporting instructions,
not a rendering engine. Unavailable modes produce an explicit limitation and a chat
fallback. There is no required dependency on another analytics, charting or PDF plugin.

## Connection and permissions

`.app.json` maps the required `plausible` app to the supplied workspace ID
`asdk_app_6ad0a3e9dc288191a3e84ecfd5b23683`. Administrators enable the app for intended
roles separately; members authenticate through the host. This package neither deploys
the MCP server nor contains credentials or changes workspace policies.

The analytics tools are read-only. Write is also declared because the app exposes
`send_feedback`, which messages maintainers. The skill requires explicit user
authorization for that message; routine analysis does not send feedback.

## Compatibility and evidence

ChatGPT Business is the intended target. Installation, app mapping, activation, resource
loading, live query behavior, charts and PDF export are **unverified** in that workspace.
The app is unavailable in this development chat, so no live analytics queries were run.
Both catalogs register the package for discovery; neither establishes runtime support.

The Claude overlay at `.claude-plugin/plugin.json` connects the `plausible` HTTP MCP
server to `https://plausible-mcp.onderwijsin.nl/internal`, using the same bundled skills.
Authenticate through the host's OAuth flow with an authorized account. The server's
OAuth configuration must allow the host's callback; the plugin contains no tokens or
client secrets. This endpoint is separate from the OpenAI app mapping, so ChatGPT
continues to use `.app.json` without a second bundled connection.

Claude installation, OAuth, tool activation and representative tasks remain unverified.
Codex requires access to the registered app or equivalent authenticated tools. The
OpenAI presentation uses `assets/plugin-icon.png` for both the logo and composer icon.

Integration references:

- [OpenAI packaging](https://developers.openai.com/plugins/build/plugins): portable root
  manifest and `extensions.com.openai.apps` pointing to `.app.json`. The supplied
  `asdk_app_...` ID is preserved, matching the existing package pattern. Current docs
  illustrate `plugin_asdk_app...`; verify the exact mapping during workspace installation
  instead of guessing a replacement.
- [Plausible MCP](https://github.com/onderwijsin/plausible-mcp): tool schemas, filtering
  and authentication.
- [Claude manifest reference](https://code.claude.com/docs/en/plugins/manifest-reference):
  inline `mcpServers` in `.claude-plugin/plugin.json` and shared root `skills/` discovery.
- [Plausible Stats API](https://plausible.io/docs/stats-api): the full API contract;
  this wrapper exposes a subset.
- [Metric definitions](https://plausible.io/docs/metrics-definitions): measurement terminology.

All five statistics tools accept `include_imports`; native-only remains the default.
Explicitly requested imported history is checked against returned coverage, not assumed
from the request. Structured results preserve metadata and resolved queries; comparisons
keep them separately for each period. Breakdowns and conversions expose offsets,
next offsets, totals, completeness and warnings. A terminal page alone does not prove
a complete inventory, and pagination is not a snapshot.

A trailing `page` wildcard selects a literal prefix: `/traineeship*` includes
`/traineeship/apply` and excludes `/archive/traineeship`. This narrows the previous
substring scope. Intentional substring queries must use an `event:page` `contains`
property filter. Deployments without upstream `matches` support return an error
rather than silently widening the page selection.

Discovery depends on the Plausible version and caller permissions. Unsupported or denied
discovery is unknown configuration, not evidence of absent sites or goals. Remaining
query limits include one breakdown dimension, no arbitrary ordering, no timestamp bounds
or time-zone override, no behavioral session filters and no time-label inclusion option.
Breakdown pages contain at most 1000 rows; conversion pages at most 10000. The
[self-contained query guide](skills/plausible-analysis/references/queries.md) describes
parameters, defaults, pagination, filters, coverage and examples.

Conversions require configured, measurable goals. The skill cannot infer visitor
journeys, ad costs or ROAS from traffic, and never treats cross-site visitor sums as
deduplicated people.

## Manual acceptance matrix

All cases are pending runtime testing. Install in the intended host, confirm app access
and automatic activation, and check both bundled references load. Capture actual query
parameters and results for each case using authorized test-site data. Repeat for every
host for which support will be claimed.

| Request                                                 | Acceptance criterion                                                                                                        |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| “How did onderwijsin.nl perform in the last 30 days?”   | Site zone/local date from `get_sites`; five KPIs from `get_aggregate`; exact complete days and interpretation.              |
| “Which pages performed best last month?”                | Previous calendar month; ranking metric first in query; visitor/pageview distinction and top-N scope.                       |
| “Where did traffic to our traineeship pages come from?” | Verified page set; source/channel and relevant UTM filters retained; no invented joint breakdown.                           |
| “Compare September with August.”                        | Explicit year; August baseline; absolute/relative count deltas, pp rate deltas and month-length caveat.                     |
| “Are our Google Ads campaigns sending more visitors?”   | Evidenced paid/UTM filter and comparable trend; missing tags disclosed; no spend or ROAS claim.                             |
| “How many webinar registrations came from this page?”   | Configured goal from `get_goals`, `display_name` used for activity; zero activity distinguished from missing configuration. |
| “Show traffic per week for the last six months.”        | Exact bounds, weekly table and chart when supported; partial edge weeks and missing buckets labeled.                        |
| “Compare these two sites.”                              | Separate site queries and comparable scope/zones; no visitor sum presented as people.                                       |
| “Maak hiervan een PDF-rapport.”                         | Actual Dutch PDF attachment with checked values/layout, or explicit unavailable-export fallback.                            |
| “What pricing strategy should our company use?”         | No activation without a Plausible website-data question.                                                                    |

Also exercise zero baselines, null/empty results, unconfigured goals, sparse conversions,
pagination, metadata warnings and unavailable app access. Verify missing history is not
zero-filled, defining filters survive errors, relative dates use the discovered site zone,
and external feedback requires authorization. Compare the same values across all three
output modes and inspect each PDF page.

Additional acceptance cases for discovery and reporting contracts:

| Case                                      | Acceptance criterion                                                                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List sites or verify the default          | Use `get_sites` with the appropriate selection; follow `next_after` for a full list; use `timezone_status` and site-local `today`.                        |
| Discovery denied or unsupported           | Configuration stays unknown; no activity-based inference or request for elevated credentials.                                                             |
| Goal absent on the first page             | Follow the complete cursor chain before declaring it unconfigured; use `display_name` for statistics.                                                     |
| Multiple breakdown/conversion pages       | Preserve scope and limit across `next_offset`; inspect consistent totals and warnings; the last page is not independently complete.                       |
| Missing/invalid row totals or no progress | Report unknown completeness even for a short/empty page; stop without looping or claiming exhaustiveness.                                                 |
| Imported history requested                | Pass `include_imports: true`; distinguish confirmed, excluded and unknown coverage, independently for each comparison period.                             |
| Structured metadata                       | Inspect preserved `meta` and `query`, including unknown fields, null metrics and empty results; no duplicate queries just to recover comparison metadata. |
| Prefix versus substring scope             | Verify `/traineeship*` excludes `/archive/traineeship`; use an explicit `contains` filter for substring scope.                                            |
