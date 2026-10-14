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

Iedere skill zoekt vóór elke taak via de Onderwijs in-verbinding naar relevant bestaand materiaal en leest
de geselecteerde documenten volledig. De gevonden voorbeelden en actuele metadata
bepalen hoe de schrijfregels worden toegepast. Dit geldt ook voor alleen taal-, toon-
of structuurredactie. Voorbeelden uit een vorige taak vervangen geen nieuwe zoekronde.
Bij lege resultaten wordt breder gezocht; ontbreken voorbeelden, dan wordt dat benoemd.
De referenties zijn redactionele uitgangspunten; bevestigde gebruikersrichtlijnen gaan voor.

## ChatGPT-app en bronverbinding

De plugin verwijst via `.app.json` naar de bestaande geregistreerde Onderwijs in-app
met technische ID `plugin_asdk_app_6acfac4f5ef08191855806720d766a68`. Het rootmanifest
verwijst naar dit bestand via `extensions.com.openai.apps`. Er zit geen `mcp.json`
in de ChatGPT-import, zodat de app-verbinding apart door de workspace wordt beheerd.
De app gebruikt `https://onderwijsin.nl/mcp`; de beschikbare tools en leesrechten
worden bepaald door de bestaande appconfiguratie en workspacebeleid.

Een beheerder moet de bestaande app voor de bedoelde rollen beschikbaar maken en
de plugin-installatie op **Available** of **Installed** zetten. De cataloguspolicy
regelt dit niet en verleent geen app-toegang. Bij ontbrekende toegang controleert
de beheerder zowel pluginbeleid als app-beschikbaarheid.

### Pluginicoon

`assets/icon.png` wordt gebruikt door `extensions.com.openai.interface.logo` en
`composerIcon` in `plugin.json`. Beide verwijzen naar `./assets/icon.png` volgens de
[OpenAI-presentatiemetadata](https://developers.openai.com/plugins/build/plugins#add-openai-specific-metadata).
Sync de marketplace na het bijwerken van het bestand en controleer beide weergaven.

[Bronnen ophalen](references/bronnen-ophalen.md) beschrijft de Onderwijs in-app in ChatGPT,
de MCP-verbinding op andere hosts, tools, resources, paginering,
statusfilters en een herstelroute wanneer subtype-metadata en toolschema verschillen.
Bij een onbereikbare app of MCP-verbinding wordt de inhoudelijke taak gepauzeerd tot actueel brononderzoek
weer mogelijk is. Een actualiteits- of overlapclaim vereist gelezen bronnen.

## Packaging en beoogde hosts

Het rootmanifest volgt [Agent Plugins 1.0.0](https://agent-plugins.org/specification).
OpenAI-presentatie staat in `extensions.com.openai` volgens de
[OpenAI-pluginhandleiding](https://developers.openai.com/plugins/build/plugins); de
`apps`-mapping gebruikt het door OpenAI beschreven `plugin_asdk_app...` technische ID.
De Claude-overlay behoudt een afzonderlijke HTTP MCP-configuratie naar dezelfde
read-only service. Skills en referenties blijven gedeeld. Zie de
[Claude-manifestreferentie](https://code.claude.com/docs/en/plugins-reference) en
[MCP-configuratie](https://code.claude.com/docs/en/mcp).

De repository bevat geen publieke-directorypublicatie: GitHub is de publieke,
controleerbare bron en het doel is de intern geïmporteerde Business-marketplace.
De bestaande app-ID komt uit de door de gebruiker verstrekte ChatGPT-app-URL; de
app-pagina kon hier niet worden geopend. Werkruimte- en roltoegang, verbinding zonder
extra aanmelding, zichtbaarheid van de Desktop only-markering en toolgedrag op web
en mobiel zijn daarom nog niet geverifieerd. Claude-installatie en runtimegedrag
blijven eveneens ongetest.
Volg [de acceptatieproeven](tests/acceptatie.md) vóór uitrol.

## Validatie

Repositorychecks: `pnpm format` en `pnpm check`.
Het README en [de acceptatieproeven](tests/acceptatie.md) blijven bij het installabele pakket.
Offline checks gebruiken geen credentials of live services.
