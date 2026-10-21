# Onderwijsloket-plugins

## Doel en startpunt

Twee zelfstandige plugins op dezelfde Onderwijsloket Assistent-MCP en dezelfde
kennisbronnen. `onderwijsloket` begeleidt mensen die werken in het onderwijs
verkennen. Adviesassistent Onderwijsloket (`adviesassistent`) biedt ondersteuning
aan adviseurs en andere begeleiders. Het verschil zit in werkwijze, toon en
oplevering; de professionele plugin krijgt geen aanvullende datarechten.

Dit scaffold bevat per plugin één eerste brononderzoekskill, een manifest, README
en catalogusvermeldingen. Onderstaande skills zijn voorstellen voor verdere
ontwikkeling, geen reeds opgeleverde workflows.

## Onderzoek van de MCP

De [serverrepository](https://github.com/onderwijsin/onderwijsloket-assistent)
is lokaal onderzocht op 21 oktober 2026, inclusief bestaande ongecommitte wijzigingen.
Het lokale werkbestand is geen garantie voor het contract van een deployment.

- Tien kenniscollecties: artikelen, FAQs, sectoren, ervaringsverhalen, opleidingen,
  instellingen, regionale loketten, podcastshows, afleveringen en video's.
- `search_*`, `list_*`, `get_*`, filter/facetdiscovery en leesbare resources;
  geografisch zoeken voor opleidingen, instellingen en loketten.
- Routes via `get_route_questions`, `find_routes` en `get_route`.
- Zeven bestaande prompts voor routes, opleidingsvergelijking, lokaal advies,
  aanvullende artikelen/media, telefonische afspraken en feedback.
- Kennis is alleen-lezen; `book_appointment` en `submit_feedback` hebben bijwerkingen.
  Geen inbox-, CRM-, CMS-schrijf- of vacaturefunctionaliteit aangetroffen.

Belangrijkste contractbronnen in de serverrepository: `config/mcp.ts`,
`server/collections/`, `server/mcp/tools/`, `server/mcp/prompts/` en
`docs/{routes,search,collection-data,collection-resources,mcp-prompts,scheduling,feedback,data-access}.md`.
Gebruik hun actuele schema's en serverprompts; kopieer geen routekeuzes of toolcontracten
naar statische beslisbomen. Hostondersteuning voor MCP-prompts moet worden getest.

## Gekozen skills: Onderwijsloket

| Skill                                       | Resultaat                                                                          | Benodigde referenties                                                              |
| ------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `onderwijsvraag-verkennen` (basis aanwezig) | Brede interesse of onduidelijke vraag verhelderen en een vervolgrichting kiezen    | Gesprekstoon, onderwijsbegrippen en voorbeeldgesprekken                            |
| `onderwijsroute-verkennen`                  | Bevestigde intake, mogelijke routes en concrete stappen                            | Routecontract en prompt, uitleg kwalificaties, grenzen van toelating/bevoegdheid   |
| `adviesvraag-beantwoorden`                  | Een concrete adviesvraag beantwoorden met bronnen en relevante onzekerheden        | Adviesmethodiek, voorbeeldvragen en antwoorden, verificatie- en escalatiecriteria  |
| `opleidingen-vergelijken`                   | Kleine vergelijking op persoonlijke voorkeuren, met ontbrekende gegevens zichtbaar | Opleidingsvormschema's, vergelijkingscriteria en geografische beperkingen          |
| `ondersteuning-in-de-regio`                 | Relevante regionale loketten met onderbouwde contactmogelijkheden                  | Loketdiensten, servicegebiedcontract en verwijzingsafspraken                       |
| `ervaringen-ontdekken`                      | Passende verhalen, podcasts of video's op interesse en formatvoorkeur              | Mediaschema's, transcriptbeperkingen en selectievoorbeelden                        |
| `adviesgesprek-plannen`                     | Telefonisch adviesgesprek boeken na bevestiging van tijdstip en intake             | Actuele scheduling-tools en prompt, intakevelden, bevestigings- en foutafhandeling |
| `feedback-geven`                            | Feedback verzamelen, laten controleren en na toestemming indienen                  | Actueel feedbackcontract en prompt, uitleg over gedeelde conversatie en metadata   |

De verkenningsskill helpt iemand de vraag te vinden; de antwoordskill behandelt een
concrete vraag. De routeskill volgt de bronvragenlijst. Ontwerp de gids met één
vraag tegelijk, beperkte keuzelijsten en uitleg zonder jargon. Ervaringen zijn
voorbeelden, geen garanties. Afspraken alleen op verzoek of bij een onopgeloste
complexe vraag; bevestig vóór boeken en herhaal onzekere boekingen niet automatisch.

## Gekozen skills: Adviesassistent Onderwijsloket

| Skill                                  | Resultaat                                                                         | Benodigde referenties                                                                                 |
| -------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `adviesmail-schrijven-en-beantwoorden` | Nieuwe adviesmail of antwoordconcept op basis van vraag, casus en bronnen         | Merkstem, mailvoorbeelden, goedgekeurde formuleringen, privacy- en doorverwijsafspraken               |
| `kenniscontent-controleren`            | Bestaande tekst met onderbouwde correcties, actualiteitsproblemen en kennishiaten | Bronhiërarchie, actualiteitscriteria, inhoudelijke correctiecriteria en opleverformat                 |
| `adviesgesprek-voorbereiden`           | Beknopte voorbereiding met relevante routes, vragen en bronnen                    | Intakeformat en gespreksstructuur                                                                     |
| `informatieve-content-schrijven`       | Artikel- of FAQ-concept met bronverantwoording                                    | Onderwijsloket-stijlgids, contenttypen/templates, lezersniveau en redactionele reviewcriteria         |
| `fact-checker`                         | Concrete feitelijke claim toetsen met oordeel, bewijs en onzekerheden             | Bronhiërarchie, beoordelingscriteria en voorbeelden van ondersteunde, onjuiste en onbeslisbare claims |

`fact-checker` toetst een concrete feitelijke claim, met bronbewijs en een oordeel
zoals ondersteund, tegengesproken of onvoldoende bewijs. De skill onderscheidt
bronfeiten van interpretatie en benoemt beperkingen. `kenniscontent-controleren`
beoordeelt een volledige tekst op juistheid, actualiteit, volledigheid en nuance.
Mails en content blijven concepten in de chat; verzenden/publiceren vraagt een
aparte integratie en opdracht. Gebruik de Onderwijsloket-merkstem.

### Plaats van adviesvraag-onderbouwen

De oorspronkelijke starterskill verzamelt relevante bronnen, scheidt feiten van
interpretatie en maakt open vragen zichtbaar voordat een professional antwoordt.
Voorbeeld: bij een vraag over zij-instroom geeft die een bronnotitie met beschreven
routes, voorwaarden en punten die een opleider moet bevestigen; nog geen mailtekst.
Deze onderzoeksstap past binnen de vijf gekozen professionele skills en
wordt daarom geen zesde zelfstandige skill. Het bestaande starterbestand blijft
voorlopig staan om het scaffold bruikbaar te houden en wordt bij uitwerking van de
eerste professionele skill vervangen. De vijf bovenstaande skills vormen de doelset.

## Benodigd vóór verdere ontwikkeling

1. Beide pakketten koppelen de door de gebruiker opgegeven ChatGPT-app
   `asdk_app_6ad7ee6307588191b1302257d85671cc` via `.app.json` en
   `extensions.com.openai.apps`. Verifieer de mapping en workspace-toegang.
   De API-documentatie-app is niet de inhouds-MCP. Voor andere hosts is een
   gedeelde deployment-URL nog nodig.
2. Werk skills één voor één uit. De gebruiker levert de benodigde referenties op
   dat moment; verzamel of verzin die nu niet. Bewaar alleen benodigde referenties
   binnen het installabele pakket. Brondata blijft live via MCP.
3. Bepaal de eerstvolgende skill met de gebruiker. De lijsten leggen de scope vast,
   niet de uitvoeringsvolgorde; buiten de bestaande starters zijn nog geen skills uitgewerkt.
4. Test per beoogde host installatie, activatie, resourcegebruik en representatieve
   taken, inclusief bronuitval, lege resultaten en onzekere toelating. Verifieer dat
   twee geïnstalleerde plugins de juiste doelgroepworkflow kiezen. Runtimegedrag,
   appmapping en dubbele MCP-verbindingen zijn nog niet getest.

Feedback deelt volgens het huidige servercontract de volledige huidige conversatie;
dat vraagt een afzonderlijk consentproces, ook bij professionele casussen.
Plugininstructies verlenen of beperken geen servicerechten: eventuele strengere
backofficepermissies moeten door de service en workspace worden afgedwongen.

## Referentiebestanden

De onderstaande bestanden zijn invuldocumenten. Voor Adviesassistent zijn toon,
mailpatronen en doorverwijzen ingevuld op basis van Nieuwe korte adviesmails.
De vijf pagina's onder Redigeerhandleiding 2026 zijn verwerkt in broncontrole,
reviewcriteria, artikelopbouw, beheer, afkortingen en Engelstalige content.
Afspraken spelling/stijl/woordkeuze is verwerkt in Nederlandse spelling,
aanspreekvorm, B2-taalgrens en sectorbegrippen. Afwijkende afkortingsregels zijn
expliciet als bronverschil vastgelegd.
Een gerichte wikiselectie is verwerkt in doorverwijzen, begripsverschillen,
bronbeoordeling en intake voor gespreksvoorbereiding. De concrete kernclaims zijn
op 21 oktober 2026 gecontroleerd bij Nuffic, DUO en Rijksoverheid.
Bronlinks, reikwijdte en onzekerheden staan per document. De overige bestanden
zijn nog leeg. Gedeelde bronnen staan in
plugin-root `reference/`; taakspecifieke bronnen staan in
`skills/<skillnaam>/reference/`. Elke plugin blijft zelfstandig installeerbaar;
gelijknamige documenten in verschillende plugins hebben eigen doelgroepen.
Er zijn geen nieuwe `SKILL.md`-bestanden of runtimekoppelingen toegevoegd.
Gedeelde bronnen worden pas gesynchroniseerd wanneer een uitgewerkte skill ze linkt.

### `onderwijsloket`: gedeeld

| Bestand in `reference/`                  | Beoogd gebruik                                                    |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `toon-en-gespreksvoering.md`             | Alle publieksskills                                               |
| `bronnen-gebruiken.md`                   | Verkennen, beantwoorden, routes, opleidingen, regio en ervaringen |
| `onderwijsbegrippen-en-kwalificaties.md` | Verkennen, routes, beantwoorden en opleidingen                    |
| `advies-en-doorverwijzen.md`             | Verkennen, beantwoorden, routes en regio                          |
| `privacy-en-toestemming.md`              | Adviesgesprek plannen en feedback geven                           |
| `geografisch-zoeken.md`                  | Opleidingen vergelijken en ondersteuning in de regio              |

### `onderwijsloket`: per skill

| Skill                       | Bestanden in eigen `reference/`                                  |
| --------------------------- | ---------------------------------------------------------------- |
| `onderwijsvraag-verkennen`  | `voorbeeldgesprekken.md`                                         |
| `onderwijsroute-verkennen`  | `routevragenlijst-en-matching.md`, `toelating-en-bevoegdheid.md` |
| `adviesvraag-beantwoorden`  | `voorbeeldvragen-en-antwoorden.md`                               |
| `opleidingen-vergelijken`   | `opleidingsvormen-en-vergelijkingscriteria.md`                   |
| `ondersteuning-in-de-regio` | `loketdiensten-en-servicegebieden.md`                            |
| `ervaringen-ontdekken`      | `mediaselectie-en-transcriptbeperkingen.md`                      |
| `adviesgesprek-plannen`     | `afspraken-en-intake.md`, `bevestiging-en-foutafhandeling.md`    |
| `feedback-geven`            | `feedback-en-conversatiedeling.md`                               |

### `adviesassistent`: gedeeld

| Bestand in `reference/`                  | Beoogd gebruik                                |
| ---------------------------------------- | --------------------------------------------- |
| `toon-en-stijl.md`                       | Adviesmails en informatieve content           |
| `bronnen-en-feitencontrole.md`           | Alle professionele skills                     |
| `advies-en-doorverwijzen.md`             | Adviesmails en gespreksvoorbereiding          |
| `privacy-en-casusgegevens.md`            | Adviesmails en gespreksvoorbereiding          |
| `redactionele-reviewcriteria.md`         | Content schrijven en controleren              |
| `onderwijsbegrippen-en-kwalificaties.md` | Adviesmails, content en gespreksvoorbereiding |
| `spelling-en-schrijfwijze.md`            | Nederlandse content schrijven en controleren  |
| `engelstalige-content.md`                | Engelse content schrijven en controleren      |

`contenttypen-en-templates.md` en `artikelstructuur-en-semantiek.md` zijn gedeelde
referenties voor schrijf- en reviewtaken. Voorbeeldvragen en factcheckcasussen
staan per onderwerp in de betreffende skill en worden vanuit hun hoofddocument gelinkt.

### `adviesassistent`: per skill

| Skill                                  | Bestanden in eigen `reference/`              |
| -------------------------------------- | -------------------------------------------- |
| `adviesmail-schrijven-en-beantwoorden` | `mailvoorbeelden-en-formuleringen.md`        |
| `kenniscontent-controleren`            | `actualiteit-en-inhoudelijk-beheer.md`       |
| `adviesgesprek-voorbereiden`           | `intake-en-gespreksstructuur.md`             |
| `informatieve-content-schrijven`       | Gedeelde `contenttypen-en-templates.md`      |
| `fact-checker`                         | `beoordelingscriteria-en-voorbeeldclaims.md` |
