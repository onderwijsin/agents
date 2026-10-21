# Plugin integration audit

Reviewed on 21 October 2026 against the
[OpenAI packaging guide](https://developers.openai.com/plugins/build/plugins),
[Agent Plugins 1.0.0 specification](https://agent-plugins.org/specification),
[Claude manifest reference](https://code.claude.com/docs/en/plugins-reference#mcpservers)
and [Claude MCP guide](https://code.claude.com/docs/en/mcp).

## Separate provider contracts

A registered ChatGPT app mapping in `.app.json` identifies a connection managed by
OpenAI and the workspace. It supplies neither an endpoint nor authentication to
Claude Code. Preserve the supplied app identifiers; the documented `plugin_asdk_app`
URL form alone does not establish that existing `asdk_app` mapping values are invalid.

Portable direct connections are discovered at root `mcp.json`, using its Agent
Plugins schema and `streamable-http` transport. Claude supports an inline
`mcpServers` map in `.claude-plugin/plugin.json` with remote `http` transport.
A Claude-only endpoint does not require a portable connection or an OpenAI app.
Keeping it in the Claude manifest avoids introducing a second direct connection
into the ChatGPT package alongside its managed app mapping.

Repository validation checks the supported HTTPS-only subset and matching plugin
identity. When both portable and Claude configurations exist, server names and
URLs must agree. OpenAI mapping failures are reported independently from Claude
connection validation. This is not validation of every provider-supported option.

## Inventory and findings

| Plugin                   | ChatGPT integration                                  | Claude integration                                   | Finding                                                                                                                                                    |
| ------------------------ | ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Onderwijsloket           | Required registered Onderwijsloket app               | HTTP `https://assistent.onderwijsin.nl/mcp`          | Added the missing Claude overlay with the user-confirmed deployment; ChatGPT mapping unchanged.                                                            |
| Adviesassistent          | Same required Onderwijsloket app                     | Same direct HTTP endpoint                            | Added the matching Claude overlay; no additional server or service permissions.                                                                            |
| Onderwijs in Redacteur   | Required Onderwijs in app; optional Loops app        | HTTP `https://onderwijsin.nl/mcp`                    | Existing website connection retained. Loops and external review skills are intentionally not configured for Claude; the README already distinguishes this. |
| Plausible                | Required registered Plausible app                    | HTTP `https://plausible-mcp.onderwijsin.nl/internal` | Existing endpoint retained. It requires authentication; anonymous rejection does not establish a bad configuration.                                        |
| Nieuwsbrief stijl review | Required registered Loops app; external Loops skills | None                                                 | Documented ChatGPT-oriented integration. No verified direct Loops endpoint or authentication configuration is available; do not invent one.                |
| Agent-instructie         | None                                                 | No external service needed                           | Skill-only plugin; no empty MCP file or provider overlay needed.                                                                                           |
| Icon-generator           | Host image generation                                | No external service declared                         | No missing MCP connection established; host image-generation capability is a separate requirement.                                                         |

All app mappings resolve within their package. Existing Claude overlays agree
with root name, description and version. No credentials were added or changed.

## Verification and limitations

- Anonymous MCP `initialize` against `https://onderwijsin.nl/mcp` succeeded and
  identified `Onderwijs in Public Content MCP`, version `1.13.1`. `tools/list`
  returned 23 tools. No content mutations were invoked.
- Anonymous initialization at the configured Plausible endpoint returned HTTP
  401 with an authentication challenge. Authenticated discovery was not performed;
  no authentication method, credential or OAuth registration was inferred.
- `claude` is not available on the current shell PATH. Native plugin loading,
  provider-side manifest validation and authenticated tool discovery cannot be
  verified here. Protocol probing is not a host-installation result.
- Regression tests cover direct Claude MCP without a ChatGPT mapping, independent
  reporting of a broken app mapping and rejection of insecure Claude endpoints.
- The user confirmed `https://assistent.onderwijsin.nl/mcp`. Initialization
  succeeded as `Onderwijsloket Assistent (experimental)`, version `1.1.0`.
  `tools/list` returned 41 tools, including scheduling and feedback. These actions
  were discovered, not invoked. No authentication challenge occurred during these
  anonymous reads; this does not establish all service permissions or host behavior.

Run `pnpm format` and `pnpm check` for offline configuration and resource validation.
