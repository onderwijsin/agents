# Onderwijs in Redacteur

Vijf Nederlandstalige skills voor collega's die content van Onderwijs in redigeren,
ideeën toetsen of concepten schrijven. Iedere skill levert het resultaat volledig in de chat.
De drie redactieskills controleren altijd ook spelling, grammatica en interpunctie.

## Kies de taak

| Skill                      | Gebruik                                               | Voorbeeld                                              |
| -------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| `redigeren-toon`           | Bestaande tekst laten klinken als Onderwijs in        | “Herschrijf deze webtekst in onze tone of voice.”      |
| `redigeren-structuur`      | Volgorde, koppen en samenhang verbeteren              | “Maak deze blog logisch en scanbaar.”                  |
| `redigeren-contenttype`    | Tekst passend maken voor type en subtype              | “Maak hiervan een handreiking voor werkgevers.”        |
| `contentidee-toetsen`      | Idee kritisch toetsen aan regels en bestaande content | “Gril dit idee: een nieuw artikel over matching.”      |
| `contentconcept-schrijven` | Nieuw concept uit brief en bronnen schrijven          | “Schrijf een domeinpagina op basis van deze notities.” |

Geef je tekst of idee, doelgroep en beoogd contenttype mee. Relevante bronlinks, feiten,
auteur, doel en gewenste lengte helpen. Ontbrekende feiten blijven herkenbare invulpunten;
de skills verzinnen geen resultaten, citaten of arbeidsvoorwaarden.

De referenties behandelen webpagina's (inclusief doelgroeppagina's), expertise-items,
blogs, vacatures, teamleden, domeinen en initiatieven. Expertise heeft zeven subtypen:
toolkit, rapportage, opiniestuk, inzicht, handreiking, developer resource en case study.

## Referenties en eigenaarschap

Begin bij [de redactionele werkwijze](references/werkwijze.md) en
[de algemene toon](references/toon-en-stijl.md). De referenties bevatten duurzame
schrijfregels, typeopbouw en kwaliteitscriteria. Ze bewaren geen lijsten met bestaande
pagina's, vaste bronvoorbeelden of gedateerde corpusanalyses.

Onderwijs in onderhoudt deze vijf skills en alle referenties als één pluginpakket.
De canonical referenties staan uitsluitend in `references/`. Relatieve links vanuit
de skills blijven binnen deze plugin. Installeer de hele plugin; losse skillmappen zijn
niet zelfstandig distributabel. Er zijn geen kopieën, symlinks of generator nodig.

Iedere skill zoekt vóór elke taak via MCP naar relevant bestaand materiaal en leest
de geselecteerde documenten volledig. De gevonden voorbeelden en actuele metadata
bepalen hoe de schrijfregels worden toegepast. Dit geldt ook voor alleen taal-, toon-
of structuurredactie. Voorbeelden uit een vorige taak vervangen geen nieuwe zoekronde.
Bij lege resultaten wordt breder gezocht; ontbreken voorbeelden, dan wordt dat benoemd.
De referenties zijn redactionele uitgangspunten; bevestigde gebruikersrichtlijnen gaan voor.

## Publieke MCP-verbinding

`mcp.json` verbindt met [de publieke MCP](https://onderwijsin.nl/mcp) via Streamable HTTP.
De server vereist geen authenticatie, API-key, headers of lokale software.
Hij biedt publieke documenten, zoekfuncties, lijsten en resources; deze plugin gebruikt
uitsluitend lezen. Concepten blijven in de chat en worden niet in het CMS opgeslagen.
Workspace- en hostrechten bepalen of de verbinding beschikbaar is.

[Bronnen ophalen](references/bronnen-ophalen.md) beschrijft tools, resources, paginering,
statusfilters en een herstelroute wanneer subtype-metadata en toolschema verschillen.
Bij onbereikbare MCP wordt de inhoudelijke taak gepauzeerd tot actueel brononderzoek
weer mogelijk is. Een actualiteits- of overlapclaim vereist gelezen bronnen.

## Packaging en beoogde hosts

Het rootmanifest en `mcp.json` volgen
[Agent Plugins 1.0.0](https://agent-plugins.org/specification) en de
[MCP-schema](https://agent-plugins.org/schemas/1.0.0/mcp.schema.json).
OpenAI-presentatie gebruikt de
[officiële pluginhandleiding](https://developers.openai.com/plugins/build/plugins);
skills volgen [Agent Skills](https://agentskills.io/specification).
De kleine Claude-overlay volgt de
[manifestreferentie](https://code.claude.com/docs/en/plugins-reference) en
[HTTP MCP-configuratie](https://code.claude.com/docs/en/mcp).
Zij vertaalt alleen het transportlabel naar `http` en herhaalt vereiste provideridentiteit;
skillinhoud en referenties blijven gedeeld.

De gepubliceerde portable MCP-schema accepteert geen server-`extensions`, terwijl de
OpenAI-handleiding daar een `com.openai.auth`-object beschrijft. Dit pakket houdt het
portable bestand schema-conform en bevat geen auth-configuratie; de publieke server
is zonder credentials getest. Of workspace-import expliciete `auth.type: none`
vereist, moet tijdens hostinstallatie worden vastgesteld.

| Omgeving                 | Bewijs                                                                | Nog te verifiëren                                                       |
| ------------------------ | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Repository               | Catalogen, instructies en lokale referentielinks worden gecontroleerd | Geen bewijs van hostinstallatie                                         |
| Publieke MCP             | Initialisatie, discovery en documentlezing zonder auth getest         | Beschikbaarheid kan wijzigen                                            |
| ChatGPT Business / Codex | Canonical pakket en catalogus aangemaakt                              | Import, installatie, activatie, gedeelde referenties, MCP en vijf taken |
| Claude Code              | Overlay en catalogus aangemaakt                                       | Installatie, activatie, gedeelde referenties, MCP en vijf taken         |
| Losse Agent Skills-hosts | Instructies in Agent Skills-formaat                                   | Pluginreferenties maken afzonderlijke installatie ongeschikt            |

Er wordt nog geen geteste runtimecompatibiliteit geclaimd. Volg
[de acceptatieproeven](tests/acceptatie.md) in elke beoogde host vóór uitrol.
De bestaande Onderwijs in-connector is voor documentlezing gebruikt; dit bewijst niet
dat deze nieuwe plugin al is geïnstalleerd.

## Validatie

Repositorychecks: `pnpm format` en `pnpm check`.
Het README en [de acceptatieproeven](tests/acceptatie.md) blijven bij het installabele pakket.
Offline checks gebruiken geen credentials of live services.
