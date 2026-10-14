![Stichting Onderwijs in](https://raw.githubusercontent.com/onderwijsin/.github/main/banner.png)

# Onderwijs in · Agents

Reusable AI capabilities for communications, editorial work, research,
and operations. [Onderwijs in](https://onderwijsin.nl) is a Dutch nonprofit helping
more talented people find their way into education. We share generic capabilities
under the [MIT license](LICENSE) so other organizations can reuse and improve them.

An **Agent Skill** is a folder of Markdown instructions and optional resources that
teaches an AI assistant when and how to perform a reusable task. A **plugin** packages
skills and, when needed, connections to external services for installation together.
A **marketplace** is a catalog that helps people discover and install plugins.

## Use the collection

| Name                                                               | Type   | Description                                                                                                                                                                              |
| ------------------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Onderwijs in Redacteur](plugins/onderwijs-in-redacteur/README.md) | Plugin | Edit Dutch content for tone, structure and content type, check spelling, review ideas, and write drafts using current Onderwijs in content through MCP. Returns written results in chat. |

Our deployment target is the _ChatGPT Business workspace_ marketplace. Administrators
can import a GitHub catalog through the GUI, then colleagues can discover and install
available plugins without using Git or a terminal. See the
[marketplace distribution guide](docs/marketplace-distribution.md) for prerequisites,
import settings, sync, and workspace permissions.

| Platform                 | Current repository support                                                      |
| ------------------------ | ------------------------------------------------------------------------------- |
| ChatGPT / Codex          | Local marketplace entry and portable package; workspace/runtime testing pending |
| Claude Code              | Matching marketplace and compatibility overlay; runtime testing pending         |
| Other Agent Skills hosts | Portable instructions; the editorial skills require their whole plugin package  |

Portable files do not guarantee identical tools, permissions, or behavior on every host.

## Contribute

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Propose a reusable capability through a
GitHub issue, then contribute it through a reviewed pull request. Nontechnical colleagues
can contribute task examples, instructions, and feedback without writing software.

- [Vision and development direction](docs/vision.md): priorities and dynamic references through Directus.
- [Architecture](ARCHITECTURE.md): sources of truth and lifecycle.
- [Contributor setup](docs/getting-started.md): local tools and quality checks.
- [Creating skills](docs/creating-skills.md): portable instructions and metadata.
- [Creating plugins](docs/creating-plugins.md): packaging and provider compatibility.
- [Agent instructions](AGENTS.md): working contract for coding assistants.

The organization may later manage dynamic skill references through Directus and MCP.
That is an exploration only; GitHub remains the source of truth for static content.
