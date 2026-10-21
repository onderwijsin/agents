# Onderwijsloket

Digitale gids voor mensen die werken in het onderwijs verkennen. Het pakket bevat
acht workflows met taakgerichte referenties:

| Skill                                                                  | Gebruik                                                              |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [onderwijsvraag-verkennen](skills/onderwijsvraag-verkennen/SKILL.md)   | Een brede interesse of onduidelijke vraag verhelderen                |
| [adviesvraag-beantwoorden](skills/adviesvraag-beantwoorden/SKILL.md)   | Een concrete informatie- of adviesvraag beantwoorden                 |
| [onderwijsroute-verkennen](skills/onderwijsroute-verkennen/SKILL.md)   | Routes uitleggen of persoonlijk verkennen met de actuele routevragen |
| [opleidingen-vergelijken](skills/opleidingen-vergelijken/SKILL.md)     | Opleidingen en varianten vergelijken op relevante voorkeuren         |
| [ondersteuning-in-de-regio](skills/ondersteuning-in-de-regio/SKILL.md) | Passende regionale ondersteuning vinden                              |
| [ervaringen-ontdekken](skills/ervaringen-ontdekken/SKILL.md)           | Verhalen, podcasts en video's selecteren en bespreken                |
| [adviesgesprek-plannen](skills/adviesgesprek-plannen/SKILL.md)         | Een gesprek plannen na bevestiging van tijdstip en intake            |
| [feedback-geven](skills/feedback-geven/SKILL.md)                       | Een melding voorbereiden en na toestemming indienen                  |

Voorbeelden: “Ik wil in het onderwijs werken. Waar begin ik?”, “Vergelijk deze
opleidingen” en “Ik wil een adviesgesprek plannen”. Installeer het hele pakket en
verbind de host met Onderwijsloket Assistent.

## Bronnen en gegevens

Onderwijsinformatie wordt via de actuele Onderwijsloket MCP opgehaald. Referenties
beschrijven werkwijzen en grenzen; voorbeeldantwoorden zijn patronen met invulplekken
voor gelezen broninformatie. Webonderzoek is alleen een gerichte fallback binnen de
organisaties uit de doorverwijsreferentie.

Beide Onderwijsloket-plugins gebruiken dezelfde
[Onderwijsloket Assistent](https://github.com/onderwijsin/onderwijsloket-assistent).
Beide pakketten koppelen via `.app.json` dezelfde geregistreerde ChatGPT-app:
`asdk_app_6ad7ee6307588191b1302257d85671cc` (door de gebruiker aangeleverd).
Het manifest verwijst ernaar via `extensions.com.openai.apps`, volgens de
[OpenAI-pluginhandleiding](https://developers.openai.com/plugins/build/plugins).
Appbeschikbaarheid en rechten worden afzonderlijk door de workspace beheerd.
Voor rechtstreekse
MCP-configuratie op andere hosts is een deployment-URL nodig; er is geen `mcp.json`
of provider-overlay opgenomen. De API-documentatie-app vervangt de inhoudsbron niet.

Boeken en feedback vereisen hun eigen actietools en expliciete toestemming. De
skills controleren beschikbaarheid vóór persoonlijke intake. Feedback deelt de
volledige huidige conversatie; dossiers worden nooit doorgestuurd naar verwijspartijen.
Dit pakket biedt geen inbox-, CRM- of CMS-schrijftoegang.

## Referenties en verificatie

Gedeelde referenties worden onderhouden in plugin-root `reference/`.
`pnpm references:sync` kopieert de benodigde documenten binnen elke skillgrens;
taakspecifieke referenties blijven in de betreffende skill. Alle acht skills laden
hun referenties via lokale Markdown-links.

Repositorychecks: `pnpm format` en `pnpm check`.

De structuur volgt [Agent Plugins 1.0.0](https://agent-plugins.org/specification)
en de [Agent Skills-specificatie](https://agentskills.io/specification).
Beide repositorycatalogi bevatten dit pakket.

De artikel-, FAQ- en ervaringsverhalenanalyses in de repositorymap `docs/`
verantwoorden de redactionele referenties en zijn geen runtimevereiste.

Voorbeeldgesprekken staan gedeeld in [voorbeeldgesprekken](reference/voorbeeldgesprekken.md).
De repositorynotitie `docs/onderwijsloket-prerelease-review.md` beschrijft
de broncodevergelijking, repositorychecks.
