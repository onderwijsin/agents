![Stichting Onderwijs in](https://raw.githubusercontent.com/onderwijsin/.github/main/banner.png)

# Onderwijs in · Agents

Reusable AI capabilities for communications, editorial work, research,
and operations. [Onderwijs in](https://onderwijsin.nl) is a Dutch nonprofit helping
more talented people find their way into education. We share generic capabilities
under the [MIT license](LICENSE) so other organizations can reuse and improve them.

An **Agent Skill** is a folder of Markdown instructions and optional resources that
teaches an AI assistant when and how to perform a reusable task. A **plugin** packages
skills and, when needed, connections to external services for installation together.
A **marketplace** is a catalog that helps people discover and install plugins. Every
distributable skill belongs to a plugin; plugins are our discovery, installation, synchronization,
and versioning units. A plugin may contain one skill or several. Repository development
skills in `.agents/skills/` are separate and are not distributed through our marketplaces.

## Use the collection

| Name                                                                   | Type   | Description                                                                                                                                |
| ---------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [Onderwijsloket](plugins/onderwijsloket/README.md)                     | Plugin | Explore education careers, pathways, programs, regional support and experiences; plan consultations or prepare feedback with consent.      |
| [Adviesassistent Onderwijsloket](plugins/adviesassistent/README.md)    | Plugin | Draft advice emails, prepare consultations, write or review knowledge content and fact-check claims using Onderwijsloket sources.          |
| [Onderwijs in Redacteur](plugins/onderwijs-in-redacteur/README.md)     | Plugin | Edit and write Dutch website content and newsletters; return text in chat or prepare a Loops draft with separate style-review support.     |
| [Agent-instructie](plugins/agent-instructie/README.md)                 | Plugin | Schrijf en verbeter Nederlandstalige prompts en skills voor niet-technische taken, met duidelijke opdrachten en controleerbare resultaten. |
| [Plausible](plugins/plausible-analytics/README.md)                     | Plugin | Analyze website traffic, acquisition and measured conversions in your language, with chat, chart and PDF reporting.                        |
| [Nieuwsbrief stijl review](plugins/nieuwsbrief-style-review/README.md) | Plugin | Review Loops newsletter drafts for team style and formatting, with optional draft corrections and test previews.                           |
| [Icon-generator](plugins/icon-generator/README.md)                     | Plugin | Genereer PNG-iconen voor drie merken; met eigen referentie-iconen en afgeleide stijlregels per merk.                                       |

Our deployment target is the _ChatGPT Business workspace_ marketplace. Administrators
can import a GitHub catalog through the GUI, then colleagues can discover and install
available plugins without using Git or a terminal. See the
[marketplace distribution guide](docs/marketplace-distribution.md) for prerequisites,
import settings, sync, and workspace permissions.

| Platform                 | Current repository support                                                     |
| ------------------------ | ------------------------------------------------------------------------------ |
| ChatGPT / Codex          | Local marketplace entry and portable package                                   |
| Claude Code              | Matching marketplace; overlays where needed                                    |
| Other Agent Skills hosts | Portable instructions; the editorial skills require their whole plugin package |

Portable files do not guarantee identical tools, permissions, or behavior on every host.

## Contribute

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Propose a reusable capability through a
GitHub issue, then contribute it through a reviewed pull request. Nontechnical colleagues
can contribute task examples, instructions, and feedback without writing software.

- [Vision and development direction](docs/vision.md): priorities and dynamic references through Directus.
- [Reference synchronization](docs/reference-synchronization.md): canonical sources,
  generated skill-local copies, asset placement and validation.
- [Plugin releases](docs/releases.md): reference synchronization, independent versions and Git tags.
- [Architecture](ARCHITECTURE.md): sources of truth and lifecycle.
- [Contributor setup](docs/getting-started.md): local tools and quality checks.
- [Creating skills](docs/creating-skills.md): portable instructions and metadata.
- [Creating plugins](docs/creating-plugins.md): packaging and provider compatibility.
- [Agent instructions](AGENTS.md): working contract for coding assistants.

The organization may later manage dynamic skill references through Directus and MCP.
That is an exploration only; GitHub remains the source of truth for static content.
