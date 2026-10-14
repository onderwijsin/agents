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

## Gebundelde MCP-verbinding

`mcp.json` declareert de publieke server `https://onderwijsin.nl/mcp` als
`streamable-http`. De verbinding wordt met de plugin geïnstalleerd en vereist
geen authenticatie of afzonderlijk geïnstalleerde ChatGPT-app. De server biedt
uitsluitend lezen; concepten blijven in de chat. Host- en workspacebeleid bepalen
of de verbinding beschikbaar is.

Ontbreekt toegang, controleer in ChatGPT Desktop of de plugin en verbinding zijn
ingeschakeld. Bij een workspaceblokkade is toegang via de beheerder nodig.

### Pluginicoon

`assets/icon.png` wordt gebruikt door `extensions.com.openai.interface.logo` en
`composerIcon` in `plugin.json`. Beide verwijzen naar `./assets/icon.png` volgens de
[OpenAI-presentatiemetadata](https://developers.openai.com/plugins/build/plugins#add-openai-specific-metadata).
Sync de marketplace na het bijwerken van het bestand en controleer beide weergaven.

[Bronnen ophalen](references/bronnen-ophalen.md) beschrijft tools, resources, paginering,
statusfilters en een herstelroute wanneer subtype-metadata en toolschema verschillen.
Bij onbereikbare MCP wordt de inhoudelijke taak gepauzeerd tot actueel brononderzoek
weer mogelijk is. Een actualiteits- of overlapclaim vereist gelezen bronnen.

## Packaging en beoogde hosts

Het rootmanifest en `mcp.json` volgen
[Agent Plugins 1.0.0](https://agent-plugins.org/specification).
OpenAI-presentatie staat in `extensions.com.openai` volgens de
[OpenAI-pluginhandleiding](https://developers.openai.com/plugins/build/plugins).
De Claude-overlay deelt identiteit en vertaalt het transportlabel naar `http`;
skills en referenties blijven gedeeld. Zie de
[Claude-manifestreferentie](https://code.claude.com/docs/en/plugins-reference) en
[MCP-configuratie](https://code.claude.com/docs/en/mcp).

Voor ChatGPT is deze plugin uitsluitend bedoeld voor de desktopapp.
Gebundelde MCP-declaraties veroorzaken volgens de
[importhandleiding](https://help.openai.com/en/articles/20001504-importing-and-syncing-plugin-marketplaces-from-github)
het label Desktop only, ook bij remote HTTPS-servers. ChatGPT op het web wordt
niet ondersteund. Er is geen `.app.json` of afhankelijkheid van een geregistreerde app.
De verbinding gebruikt wel de externe publieke MCP-service.

De portable MCP-schema accepteert geen server-`extensions`, terwijl de OpenAI-handleiding
hier auth-metadata beschrijft. Het pakket bevat geen auth-configuratie; de publieke
server is zonder credentials getest. De eerdere ChatGPT-import van versie 0.1.0
slaagde met Desktop only-notice. Import, icoonweergave, installatie, activatie,
gedeelde referentielading en de vijf taken van versie 0.2.1 moeten nog worden getest.
Claude-installatie en runtimegedrag blijven ongetest.
Volg [de acceptatieproeven](tests/acceptatie.md) vóór uitrol.

## Validatie

Repositorychecks: `pnpm format` en `pnpm check`.
Het README en [de acceptatieproeven](tests/acceptatie.md) blijven bij het installabele pakket.
Offline checks gebruiken geen credentials of live services.
