# Creating a plugin

A plugin packages related skills and optional external service connections into an installable
capability. A skill-only plugin can contain one skill; multi-skill plugins group related tasks
under one identity and version. MCP integrations are optional. Propose the intended audience,
reusable tasks, supported hosts, and permissions first.

## Canonical package

Follow the current [official OpenAI packaging guide](https://developers.openai.com/plugins/build/plugins).
Prefer root `plugin.json` in the portable Agent Plugins format and keep bundled skills inside the
package. This skeleton appears only in documentation:

```text
plugins/<plugin-name>/
  plugin.json
  README.md
  skills/<skill-name>/SKILL.md
  assets/  (only if needed)
```

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "plugin-name",
  "version": "0.1.0",
  "description": "Explain the reusable capability.",
  "author": { "name": "Onderwijs in" }
}
```

Our repository requires explicit semantic versions and nonempty descriptions, even where the
portable schema makes them optional. Directory and package names must match. Add a README with
usage, prerequisites, intended hosts, manual test evidence, and limitations. Follow
[skill authoring](creating-skills.md) for each bundled skill.

OpenAI-specific presentation belongs in `extensions.com.openai`; add a `.codex-plugin/plugin.json`
compatibility overlay only when needed. Consult the
[Claude manifest reference](https://code.claude.com/docs/en/plugins/manifest-reference)
before adding its `.claude-plugin/plugin.json` overlay. Both overlays reference the same bundled
skills. Catalog compatibility alone does not prove that a portable package loads in Claude.

MCP or app configuration is optional and must follow current host documentation. Include no
server, credential, hooks, or placeholder configuration unless the capability needs it.
Extend validation for new manifest fields and integration files in the same change.

Plugin-owned skills may link to shared `references/` within the same plugin root.
Document ownership and require whole-plugin installation; they are not standalone packages.
The validator keeps bundled references within their plugin, rejecting escapes and symlinks.

Registered OpenAI app mappings use `extensions.com.openai.apps` pointing to a package-local
`.app.json`; each named mapping contains the technical registered app ID. The validator checks
that the reference resolves inside the plugin and that the mapping is nonempty. An app mapping
can coexist with a bundled MCP server for hosts that support that packaging.

The initial MCP validation subset supports root `mcp.json` with the Agent Plugins 1.0.0
schema identifier and named `streamable-http` HTTPS connections without headers or credentials.
An optional `.claude-plugin/plugin.json` overlay repeats identity and translates these connections
to Claude's `http` transport; validation requires matching names, versions, descriptions and URLs.
OpenAI presentation checks require nonempty display name and short description when provided.
Other transport, authentication and overlay fields need focused validation before introduction.
OpenAI `logo` and `composerIcon` point to existing PNG files under
`./assets/` inside the package. Validation checks their package boundary and PNG signature.
See [Onderwijs in Redacteur](../plugins/onderwijs-in-redacteur/README.md) for a registered app
reference, its separate Claude MCP configuration, host limitations, and official specification links.

## Catalog entries

Add a local entry to `.agents/plugins/marketplace.json`:

```json
{
  "name": "plugin-name",
  "source": { "source": "local", "path": "./plugins/plugin-name" },
  "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
  "category": "Productivity"
}
```

Add the corresponding entry to `.claude-plugin/marketplace.json`:

```json
{
  "name": "plugin-name",
  "source": "./plugins/plugin-name"
}
```

Paths resolve from the repository root, not the manifest's directory. The validator requires
one entry per package in each catalog with matching names and paths. Remote sources are outside
our initial validation contract; introduce them with focused validation and documentation.

Run `pnpm check` and test installation and behavior on each claimed host before requesting review.
Do not claim compatibility based solely on portable files. Before distributing the first plugin,
verify workspace import and Claude loading in the intended environments. Every distributable
skill has one canonical source inside one plugin. Plugin versions are authoritative for all
bundled changes; there is no independent skill version. The
[release workflow](releases.md) updates manifest versions before merge; use PR labels
for minor or major bumps.

For a skill-only plugin using the standard `skills/` layout, Claude documents its manifest as
optional and derives the name from the marketplace entry. No overlay or empty MCP configuration
is needed. See [Agent-instructie](../plugins/agent-instructie/README.md) for this pattern and
its unverified runtime status.
