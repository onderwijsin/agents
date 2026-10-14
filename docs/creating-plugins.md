# Creating a plugin

A plugin packages related skills and optional external service connections into an installable
capability. Propose the intended audience, reusable tasks, supported hosts, and permissions first.

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
verify workspace import and Claude loading in the intended environments. Standalone skill reuse
must produce a self-contained package without maintaining duplicate authored instructions.
