# Onderwijsloket prereleasecontrole

Controle van `onderwijsloket` en `adviesassistent`, beide versie `0.2.0`, op
21 oktober 2026. Deze notitie is ontwikkeldocumentatie, geen skillreferentie.

## MCP-broncodevergelijking

Vergeleken met de lokale
[Onderwijsloket Assistent](https://github.com/onderwijsin/onderwijsloket-assistent):
`config/mcp.ts`, `server/mcp/tools/`, `server/mcp/prompts/` en de scheduling- en
feedbackschema's. Lokale broncode kan afwijken van de aangesloten deployment;
de beschikbare toolschema's en serverinstructies blijven tijdens gebruik leidend.

| Onderdeel           | Beoordeling en correctie                                                                                                                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Brononderzoek       | Zoeken ontdekt kandidaten; details onderbouwen claims. Filterdiscovery, waarschuwingen, bronlinks en ontbrekend bewijs worden onderscheiden. Identificerende casusgegevens horen niet in zoektermen; dit is ook expliciet gemaakt voor de publieke plugin.                                 |
| Routes              | Bevestigde keuzes worden opnieuw gevalideerd; alleen een complete geldige vragenlijst leidt tot matching. Route-uitleg zonder matching geeft geen persoonlijke geschiktheidsclaim. Duurvolgorde is geen passendheidsscore.                                                                 |
| Opleidingen         | Varianten behouden hun eigen traject, beschrijving en URL. Labels leveren geen rooster-, kosten- of toelatingsgarantie op.                                                                                                                                                                 |
| Regio               | Zoeklocatie en verruiming blijven zichtbaar. Afstanden naar servicegebiedpunten zijn geen kantoorafstand, reistijd of exacte dekking.                                                                                                                                                      |
| Ervaringen          | Verhaal, metadata en transcriptie worden onderscheiden; geen verzonnen citaten, samenvattingen of afspeelgaranties.                                                                                                                                                                        |
| Boeken              | Hersteld: de taal wordt gekozen vóór `get_scheduling_link`, dat taal als invoer vereist. Intakevragen staan volgens de serverinstructie vet op een eigen regel; links blijven onvet. Complete bevestiging gaat vooraf aan één poging. Onzekere boekingen worden niet automatisch herhaald. |
| Feedback            | De volledige huidige conversatie gaat alleen na afzonderlijke toestemming mee. Geen selectie of samenvatting; oorspronkelijke taak blijft gepauzeerd tot expliciete wissel of afronding. Foutcodes en onzekere opslag worden onderscheiden.                                                |
| Professionele taken | Leestools onderbouwen concepten en notities. Geen verzend-, publicatie-, boekings- of meldingsactie als onderdeel van die workflows.                                                                                                                                                       |

De strengere pluginregels voor minimale persoonsgegevens, eigen contact door de
adviesvrager en webfallback uitsluitend binnen de doorverwijsorganisaties zijn
bewuste opdrachtvereisten. Ze zijn geen afwijking die moet worden verruimd tot
alle externe links uit MCP-content.

## Vergelijking met bestaande plugins

Beoordeeld tegen de vijf overige pluginpakketten en hun toepasselijke skills:

| Vergelijkingsmateriaal   | Toegepast kwaliteitscriterium                                                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent-instructie         | Gerichte intake, concrete taak en resultaat, onderscheid tussen ontbrekende informatie en een redelijke aanname.                                   |
| Onderwijs in Redacteur   | Passende referenties per vorm, betekenisbehoud, volledige tekstoplevering en eindcontrole; eigen Onderwijsloket-merkstem blijft leidend.           |
| Nieuwsbrief stijl review | Externe acties afbakenen, toolbeschikbaarheid controleren en uitsluitend bevestigd succes rapporteren. Geen Loops-specifieke workflow overgenomen. |
| Plausible                | Geen-resultaat, storing en onvolledige informatie onderscheiden; bronbereik en onzekere conclusies zichtbaar maken.                                |
| Icon-generator           | Controleerbare oplevering, expliciete beperkingen en geen claim dat een niet-uitgevoerde controle geslaagd is.                                     |

Alle dertien skills hebben onderscheidende beschrijvingen, processtappen,
voorwaardelijke referentielinks en afrondingscriteria. De voorbeeldverwijzingen
noemen nu de relevante situatie per skill. De tijdelijke professionele starterskill
is vervangen; er blijven acht publieke en vijf professionele workflows over.

Gedeelde bronnen zijn canoniek in plugin-root `reference/`; gegenereerde kopieën
en ownershipmanifesten houden iedere skill zelfstandig qua resourcepaden. De
voorbeeldmails blijven historische stijlvoorbeelden, geen actuele feitenbron.
Onderwijs in Redacteur is ontwerpmateriaal, geen runtimeafhankelijkheid.

## Verificatie

- `pnpm format`: formatting toegepast.
- `pnpm references:sync`: gedeelde bronnen en lokale kopieën gesynchroniseerd.
- `pnpm check`: synchronisatiedrift, formatting, Markdown- en scriptlint,
  typecheck, catalogi, packaging, skillmetadata, resourcegrenzen en toolingtests.
- `git diff --check`: controle op whitespacefouten.
- Geïsoleerde pakketcontrole: beide plugins met gefilterde catalogi naar een
  tijdelijke map gekopieerd en met de repositoryvalidator gecontroleerd;
  geen fallback naar het oorspronkelijke checkout.

Eerdere live leesproeven in deze chat dekten routevragen, opleidingen, regionale
loketten, ervaringsverhalen, FAQ's en volledige artikelen. Er zijn geen boekingen,
feedbackinzendingen, mailverzendingen of publicaties uitgevoerd. In de beschikbare
MCP-toolset van deze sessie zijn scheduling en feedback niet aangeboden.

## Tweede controle

Opnieuw vergeleken met de scheduling- en feedbackprompts en met de eigen
workflowregels. Drie voorbeeldinconsistenties zijn hersteld:

- Boekingsvragen volgen ook in de dialogen de eigen regel voor één vetgedrukte
  vraag op een aparte regel; gesprekstaal gaat vóór het ophalen van metadata.
- De Engelstalige adviesvraag naar werken als leraar krijgt geen tegenvraag of
  opleidingstoelating wordt bedoeld. Een diplomakopie is voor algemene uitleg niet nodig.
- Herhaling van het oorspronkelijke boekingsdoel tijdens feedback wordt eerst als
  probleembeschrijving verwerkt. Bevestiging daarvan is nog geen verzendtoestemming;
  een vraag naar taakwisseling volgt alleen bij daadwerkelijke onduidelijkheid.

De synchrone kopieën, pakketgrenzen en repositorychecks zijn opnieuw gecontroleerd.
