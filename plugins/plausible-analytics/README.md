# Plausible

Analyze website traffic, pages, acquisition, UTM campaigns and measured goal conversions
through the existing workspace app. One bundled skill, `plausible-analysis`, covers these
related workflows and returns results in the user's language. Install the whole plugin
so its query and output references remain available. No site is hardcoded.

## Usage and output

Ask a website analytics question and name the site when it is not already known. The
skill resolves exact dates and the site's reporting zone, queries relevant measurements,
and separates observations from hypotheses and recommended next checks.

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
OpenAI presentation uses `assets/icon.png` for both the logo and composer icon.

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

The reviewed wrapper has no site/time-zone lookup, offset pagination, time-zone input,
timestamp bounds or imported-history inclusion option. Breakdowns support one dimension
and at most 1000 rows. Comparisons drop upstream metadata; the other tools retain it in
text output. A trailing page wildcard becomes substring matching. The bundled query
guide records how these limits affect results, including native-data coverage.

Conversions require configured, measurable goals. The skill cannot infer visitor
journeys, ad costs or ROAS from traffic, and never treats cross-site visitor sums as
deduplicated people.

## Manual acceptance matrix

All cases are pending runtime testing. Install in the intended host, confirm app access
and automatic activation, and check both bundled references load. Capture actual query
parameters and results for each case using authorized test-site data. Repeat for every
host for which support will be claimed.

| Request                                                 | Acceptance criterion                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| “How did onderwijsin.nl perform in the last 30 days?”   | Five KPIs including visits; exact complete site-local days; interval aggregates and interpretation.     |
| “Which pages performed best last month?”                | Previous calendar month; ranking metric first in query; visitor/pageview distinction and top-N scope.   |
| “Where did traffic to our traineeship pages come from?” | Verified page set; source/channel and relevant UTM filters retained; no invented joint breakdown.       |
| “Compare September with August.”                        | Explicit year; August baseline; absolute/relative count deltas, pp rate deltas and month-length caveat. |
| “Are our Google Ads campaigns sending more visitors?”   | Evidenced paid/UTM filter and comparable trend; missing tags disclosed; no spend or ROAS claim.         |
| “How many webinar registrations came from this page?”   | Confirmed goal and measurable page relationship, or explicit missing measurement/configuration.         |
| “Show traffic per week for the last six months.”        | Exact bounds, weekly table and chart when supported; partial edge weeks and missing buckets labeled.    |
| “Compare these two sites.”                              | Separate site queries and comparable scope/zones; no visitor sum presented as people.                   |
| “Maak hiervan een PDF-rapport.”                         | Actual Dutch PDF attachment with checked values/layout, or explicit unavailable-export fallback.        |
| “What pricing strategy should our company use?”         | No activation without a Plausible website-data question.                                                |

Also exercise zero baselines, null/empty results, unconfigured goals, sparse conversions,
truncation, metadata warnings and unavailable app access. Verify missing history is not
zero-filled, defining filters survive errors, relative dates require a known site zone,
and external feedback requires authorization. Compare the same values across all three
output modes and inspect each PDF page.
