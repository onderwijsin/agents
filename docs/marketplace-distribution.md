# Distributing plugins through the workspace marketplace

ChatGPT Business is our first target. Administrators manage the marketplace; colleagues use
the plugin GUI. The catalog now includes
[Onderwijs in Redacteur](../plugins/onderwijs-in-redacteur/README.md),
[Agent-instructie](../plugins/agent-instructie/README.md) and
[Plausible](../plugins/plausible-analytics/README.md).
The editorial plugin references the existing Onderwijs in ChatGPT app through `.app.json`;
it does not bundle an MCP server in the ChatGPT-imported package. The technical app ID
comes from the app URL supplied for this integration and uses OpenAI's documented
`plugin_asdk_app...` identifier format. Workspace role access and runtime behavior still
require verification. Verify feature availability, installation, resource loading and
representative tasks in the workspace before rollout.

Plausible references the existing workspace app with the supplied `asdk_app_...` ID.
Its README records the identifier-format caveat, MCP limitations and pending acceptance
matrix. Enable the app for intended roles separately from installing the plugin, then
verify the mapping in a new chat. Charts and PDF export depend on host capabilities.

## Icon-generator

[Icon-generator](../plugins/icon-generator/README.md) bevat één skill met drie gescheiden
merkstijlen en eigen assetsmappen. De referentie-iconen en afgeleide regels zijn opgenomen.
De catalogi bevatten het pakket; installatie, activatie, referentiegebruik en native
beeldgeneratie zijn nog niet getest. Rond de feasibilitytest in de plugin-README af
voordat de plugin als werkende merkgenerator wordt uitgerold. Er is geen gekoppelde app
of externe beeldservice nodig in de huidige opzet.

## Nieuwsbriefreview en Loops

[Nieuwsbrief stijl review](../plugins/nieuwsbrief-style-review/README.md) koppelt de
bestaande Loops-app. Gebruikers installeren daarnaast de Loops-plugin voor de
externe skills; een appmapping installeert die skills niet mee. De teamgidsen
leggen verplichte themes vast; gedeelde regels leggen UTM-parameters vast. Trainees in onderwijs heeft
algemene stijlregels en conditionele patronen met een vrije inhoudelijke indeling.
Onderwijs in heeft
algemene stijlregels voor alle mailtypen en daarnaast een deep dive-referentie
voor de vaste structuur en templatespecifieke blokken. Campagnes, gepauzeerde workflows en transactionele
drafts vallen binnen de review. Volledige huisstijlgoedkeuring en runtimecompatibiliteit
zijn nog niet aangetoond. Zie de package-README voor rechten, bronnen en acceptatiechecks.

## Nieuwsbriefredactie en afhankelijkheden

Onderwijs in Redacteur koppelt de bestaande Onderwijs in-app en de Loops-app.
De Loops-mapping is optioneel voor websitewerk; voor live nieuwsbriefredactie
zijn Loops, diens relevante skills en `nieuwsbrief-style-review` afzonderlijk nodig.
De host moet de geïnstalleerde externe skill en pakketresources beschikbaar maken.
Er is geen automatische transitive plugininstallatie gedeclareerd. Controleer dit
in een verse chat vóór rollout; `.app.json` levert geen externe skills mee.

De redacteur beheert inhoud, tone of voice en subject/preview; de reviewer beheert
stijl, structuur en uitsluitend subject/preview-aanwezigheid en lengte.
De bestaande Claude-overlay levert alleen de publieke website-MCP. Loops-werk is
niet voor Claude geconfigureerd. Zie de package-README en acceptatiecriteria.

## Discovery and synchronization boundaries

The [official plugin management guide](https://learn.chatgpt.com/docs/enterprise/plugin-management)
describes GitHub import and sync through `.agents/plugins/marketplace.json`. Catalog entries
reference plugins; their bundled skills synchronize with them. As observed in this workspace,
standalone skills in a repository-level `skills/` directory are not automatically discovered
by GitHub-to-ChatGPT marketplace sync. This limitation concerns that distribution route; other
hosts may support standalone skill installation.

Every distributed capability here belongs to one plugin, including skill-only packages.
`.agents/skills/` contains repository development skills and is not marketplace content.
Plugin versions govern bundled content; marketplace sync is not a separate skill release process.

## Administrator import

Follow [official plugin management](https://learn.chatgpt.com/docs/enterprise/plugin-management).
With a workspace admin account and GitHub access to the repository, open **Admin → Plugins →
Add → Import marketplace**. Use these settings for this repository:

| Setting                | Value                                                                           |
| ---------------------- | ------------------------------------------------------------------------------- |
| Source                 | `https://github.com/onderwijsin/agents`                                         |
| Path                   | Leave empty: marketplace is at the repository root                              |
| Branch, tag, or commit | `main` to follow reviewed changes, or a fixed revision for a controlled rollout |

Authorize GitHub access and review import results. Once content exists, configure each imported
plugin's installation policy. Repository catalogs make content discoverable; administrators
control availability and installation for workspace roles.

## Permissions and updates

Importing plugins does not grant connected-app access or authenticate members. For Redacteur,
enable the existing Onderwijs in app for the intended workspace roles separately. Set the
plugin's workspace installation policy to **Available** or **Installed** as appropriate;
repository catalog policy is only metadata and does not override workspace policy or provision
app access. Ensure members have the relevant service access.
See [plugin controls](https://learn.chatgpt.com/docs/enterprise/apps-and-connectors).

New imports enable daily sync. Use **Admin → Plugins → Marketplaces → Sync now** to request an
update. A fixed commit does not follow later commits. Review catalog changes before merging:
sync can introduce new plugins. Inspect sync errors; invalid updates retain the last working copy.
Removing a catalog entry does not remove its imported workspace copy. Deleting a marketplace
removes its imported plugins, so do not use deletion merely to reconnect GitHub access.

GitHub is the public, auditable source of truth; this repository has no deploy or publishing
workflow. Neither a public GitHub repository nor workspace import publishes plugins in the
universal public directory. Distribution targets the internal, admin-imported workspace marketplace.
Colleagues can browse available workspace plugins and install those permitted by their role once
an administrator has imported real content. Report missing access to your workspace administrator.

## Other hosts

Codex can consume `.agents/plugins/marketplace.json` through its native marketplace system.
Claude Code uses `.claude-plugin/marketplace.json`. See the
[Claude marketplace guide](https://code.claude.com/docs/en/plugin-marketplaces) for installation.
These are distribution targets, not tested runtime guarantees; the first package must establish
host-specific compatibility. Other hosts may independently support standalone Agent Skills,
but this repository distributes its capabilities as plugins.

## Empty catalog compatibility for future changes

Empty catalogs remain valid repository scaffolds. Their structural handling rests on these checks:

- The [Codex marketplace parser](https://github.com/openai/codex/blob/main/codex-rs/core-plugins/src/marketplace.rs)
  accepts a plugin list without a minimum length. Its
  [tests](https://github.com/openai/codex/blob/main/codex-rs/core-plugins/src/marketplace_tests.rs)
  include an empty catalog.
- The [Claude marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference#validation-messages)
  classifies an empty plugin list as a warning, rather than an error.

These checks establish structural acceptance, not successful ChatGPT workspace import. Verify
import and installation in the intended workspace before claiming deployment support.
