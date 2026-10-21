# Adviesassistent Onderwijsloket

Ondersteuning voor Onderwijsloket-adviseurs en andere begeleidende professionals.
Het pakket bevat vijf workflows:

| Skill                                                                                        | Gebruik                                                          |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [adviesmail-schrijven-en-beantwoorden](skills/adviesmail-schrijven-en-beantwoorden/SKILL.md) | Een adviesmail schrijven, beantwoorden of redigeren              |
| [kenniscontent-controleren](skills/kenniscontent-controleren/SKILL.md)                       | Een bestaande tekst inhoudelijk en redactioneel verbeteren       |
| [adviesgesprek-voorbereiden](skills/adviesgesprek-voorbereiden/SKILL.md)                     | Een compacte interne voorbereiding met agenda en open vragen     |
| [informatieve-content-schrijven](skills/informatieve-content-schrijven/SKILL.md)             | Een nieuw artikel, FAQ-antwoord of informatief concept schrijven |
| [fact-checker](skills/fact-checker/SKILL.md)                                                 | Een concrete claim toetsen met oordeel, bewijs en afbakening     |

Voorbeelden: “Beantwoord deze adviesmail”, “Controleer dit kennisbankartikel” en
“Toets deze claim over een opleidingsroute”. Installeer het hele pakket en verbind
de host met Onderwijsloket Assistent. Brononderzoek is onderdeel van iedere workflow.

## Werkwijze en bronnen

De workflows leveren volledige concepten of interne notities in de chat. Bij een
expliciete review zonder herschrijven volgt een concrete bevindingenlijst.
De redactionele werkwijze gebruikt gerichte intake, relevante voorbeeldteksten,
betekenisbehoud en een volledige eindcontrole, met de eigen Onderwijsloket-merkstem.

Onderwijsfeiten, aanbod, voorwaarden en contactgegevens komen uit de actuele MCP.
Referenties bevatten proces- en schrijfafspraken. De 30 geanonimiseerde mailwisselingen
zijn stijlmateriaal; ze bewijzen geen actuele onderwijsregel. Factcheckvoorbeelden
gebruiken hypothetische bewijsbeelden. Webonderzoek is uitsluitend een gerichte
fallback binnen de organisaties uit de doorverwijsreferentie.

Deze plugin verstuurt geen mails, publiceert geen content, boekt geen afspraken
en dient geen feedback in. Hij verleent geen inbox-, CRM- of CMS-toegang.
De adviesvrager neemt zelf contact op met verwijspartijen; dossiers worden nooit
gedeeld en de assistent initieert dat contact niet, ook niet op verzoek.

## Bronverbinding en hosts

Beide Onderwijsloket-plugins gebruiken dezelfde
[Onderwijsloket Assistent](https://github.com/onderwijsin/onderwijsloket-assistent).
Beide pakketten koppelen via `.app.json` de geregistreerde ChatGPT-app
`asdk_app_6ad7ee6307588191b1302257d85671cc` (door de gebruiker aangeleverd).
Het manifest verwijst ernaar via `extensions.com.openai.apps`, volgens de
[OpenAI-pluginhandleiding](https://developers.openai.com/plugins/build/plugins).
Appbeschikbaarheid en rechten worden door de workspace beheerd; de professionele
plugin krijgt geen aanvullende datarechten. De API-documentatie-app vervangt deze
inhoudsbron niet.

### Claude Code

[`.claude-plugin/plugin.json`](.claude-plugin/plugin.json) configureert een directe
HTTP MCP-verbinding met `https://assistent.onderwijsin.nl/mcp`. Dit is de bestaande
Onderwijsloket-deployment; er worden geen server of credentials meegeleverd.
De ChatGPT-appmapping blijft afzonderlijk bestaan en wordt niet door Claude gebruikt.
Er is geen root-`mcp.json`, zodat de beheerde ChatGPT-verbinding behouden blijft.

De configuratie volgt de
[Claude-manifestreferentie](https://code.claude.com/docs/en/plugins-reference#mcpservers)
en [MCP-configuratie](https://code.claude.com/docs/en/mcp).
Protocolinitialisatie en tool discovery zijn gecontroleerd. De Claude CLI is lokaal
niet beschikbaar in PATH; native laden en hostauthenticatie zijn hier niet geverifieerd.

De structuur volgt [Agent Plugins 1.0.0](https://agent-plugins.org/specification)
en de [Agent Skills-specificatie](https://agentskills.io/specification).

## Referenties en verificatie

Gedeelde referenties worden onderhouden in plugin-root `reference/`.
`pnpm references:sync` kopieert de benodigde documenten binnen iedere skillgrens;
taakspecifieke documenten en mailvoorbeelden blijven bij hun eigen skill.
Onderwijs in Redacteur diende als ontwerpreferentie; het is geen runtimeafhankelijkheid.

Voer `pnpm format` en `pnpm check` uit. De artikel-, FAQ- en ervaringsverhalenanalyses in repositorymap
`docs/` verantwoorden de redactionele referenties en zijn geen runtimevereiste.

Voorbeeldgesprekken staan gedeeld in [voorbeeldgesprekken](reference/voorbeeldgesprekken.md).
De repositorynotitie `docs/onderwijsloket-prerelease-review.md` beschrijft
de broncodevergelijking en repositorychecks.
