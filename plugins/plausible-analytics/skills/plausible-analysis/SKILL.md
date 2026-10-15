---
name: plausible-analysis
description: Analyseer websiteverkeer, verkeersbronnen, UTM-campagnes en gemeten doelconversies met de gekoppelde Plausible-app. Gebruik voor het vinden van sites en ingestelde doelen, prestatieoverzichten, paginaranglijsten, periode- of sitevergelijkingen en rapporten in de chat, met grafieken of als PDF. Niet voor algemene bedrijfsanalyses zonder Plausible-websitegegevens.
license: MIT
---

# Plausible-analyse

Beantwoord de websitevraag met de gekoppelde Plausible-app, in de taal van de gebruiker.
Baseer waarnemingen op de opgehaalde metingen en benoem mogelijke verklaringen en
voorgestelde vervolgcontroles afzonderlijk.

## Bepaal de rapportageafbakening

Bepaal site/domein, rapportagetijdzone van de site, exacte periode, vraag, meetwaarden en
gewenste uitvoervorm uit het gesprek en de site-instellingen. Lees vóór de eerste query
de [querygids](references/queries.md). Gebruik `get_sites` om de bedoelde site, tijdzone
en lokale datum (`today`) op te halen: met `site_id` voor een genoemde site, met
`use_default: true` voor de ingestelde standaardsite, of zonder selectie om toegankelijke
sites te vinden. Vraag alleen om een keuze wanneer meerdere sites passend zijn.

Controleer `status` en `timezone_status`. Bij `unsupported`, `permission_denied` of
`unavailable` is de configuratie onbekend; vraag alleen de essentiële ontbrekende
informatie en vraag niet impliciet om ruimere rechten. Leid de tijdzone niet af uit de
locatie van de gebruiker of de server. Een query met expliciete datums kan voorlopig
doorgaan met de vermelding dat de tijdzone onbekend is; relatieve datums en vergelijkingen
met afgestemde periodes vereisen een bevestigde tijdzone. Gebruik de site-lokale `today`
voor relatieve periodes en vraag bij ontbrekende metadata naar de site-instelling.

Gebruik voor ‘de afgelopen 30 dagen’ standaard de 30 volledige dagen tot en met gisteren
in de tijdzone van de site en vermeld die keuze. ‘Vorige maand’ betekent de vorige
kalendermaand. Leid ontbrekende jaartallen af uit de context en vermeld ze. Benoem bij
een expliciet gevraagde lopende periode dat deze onvolledig is en vermeld het ophaalmoment.
Vergelijk waar mogelijk even lange verstreken periodes. Behoud expliciet gevraagde
kalendermaanden en benoem verschillen in lengte. Markeer onvolledige eerste en laatste
tijdvakken.

## Bevraag en controleer

Gebruik de kleinste query die de vraag beantwoordt en voeg alleen een uitsplitsing toe
als die nodig is voor de analyse. Bepaal of geïmporteerde historie bij de vraag hoort:
standaard wordt alleen eigen Plausible-tracking gebruikt. Gebruik `include_imports: true`
voor gevraagde geïmporteerde historie en houd dezelfde instelling bij vergelijkingen en
vervolgqueries. Controleer de feitelijke importdekking voordat je resultaten vergelijkt.

- Overzicht: gebruik `get_aggregate` voor `visitors`, `visits`, `pageviews`, `bounce_rate`
  en `visit_duration`; dit zijn de standaardmeetwaarden van deze tool. Gebruik de
  periodeaggregaten in plaats van dagelijkse bezoekersaantallen op te tellen of
  dagelijkse percentages te middelen.
- Best presterende pagina’s: gebruik `get_breakdown` met `event:page` en zet de
  meetwaarde waarop je rangschikt vooraan. Gebruik bij ‘beste’ zonder nadere doelstelling
  standaard bezoekers en vermeld die keuze. Voeg paginaweergaven toe als context en
  vermeld dat het om een top N gaat.
- Herkomst van paginaverkeer: bevestig de bedoelde pagina’s en vraag bron/kanaal en
  relevante UTM-uitsplitsingen op met hetzelfde paginafilter. Presenteer afzonderlijke
  uitsplitsingen afzonderlijk; ze tonen geen gezamenlijke bron-campagnerelatie aan.
- Periodevergelijking: gebruik `compare_periods`, met de referentieperiode in A en de
  te beoordelen periode in B. Voeg `get_timeseries` alleen toe wanneer een trend gevraagd
  is of nodig is om de verandering te duiden.
- Betaalde campagnes: gebruik een aangetoond betaald kanaal of een bevestigde
  UTM-conventie; verkeer van Google omvat ook organisch verkeer. Vraag een gefilterde
  tijdreeks op met consistente definities.
- Aanmeldingen: gebruik `get_goals` om het ingestelde doel en de definitie te vinden,
  ook wanneer het geen conversies heeft. Gebruik de geretourneerde `display_name` als
  `goal` in `get_conversions`, met een meetbare pagina-afbakening. Volg alle doelpagina’s
  voordat je concludeert dat een doel ontbreekt. Mislukte ontdekking betekent onbekende
  configuratie; lege conversieresultaten bewijzen niet dat het doel ontbreekt. Leg uit
  wanneer de relatie tussen pagina en aanmelding niet meetbaar is.
- Weekhistorie: gebruik `get_timeseries` met wekelijkse tijdvakken en exacte grenzen
  voor zes maanden. Behoud de geretourneerde tijdvaklabels en benoem onvolledige eerste
  en laatste weken.
- Meerdere sites: bevraag elke site afzonderlijk met vergelijkbare periodes en filters.
  Stem de bevestigde sitetijdzones af of benoem het verschil. Tel sitebezoekers nooit
  op tot een aantal unieke personen over alle sites heen.

Controleer vóór interpretatie de koppeling tussen labels en waarden, fouten, nullwaarden,
lege resultaten, `query`, `meta`, `imports` en waar van toepassing `pagination`.
Vergelijk bij `compare_periods` de dekking en waarschuwingen van A en B afzonderlijk.
Ontbrekende metadata bevestigt geen volledige dekking.

Volg voor een volledige uitsplitsing `next_offset` met ongewijzigde afbakening en limiet;
voor site- en doelinventarissen gebruik je `next_after` als `after`. Haal voor een top N
alleen de benodigde rijen op. Een laatste pagina is op zichzelf geen volledige inventaris.
Controleer de verzamelde pagina’s en totalen volgens de querygids; benoem onbekende
volledigheid en waarschuwingen. Pagineringsresultaten zijn geen momentopname: gebruik
vaste datums en rapporteer inconsistenties in plaats van volledigheid te veronderstellen.

## Interpreteer de metingen

Hanteer de definities bij de geretourneerde meetwaarden: bezoekers zijn de unieke
bezoekers volgens Plausible binnen de queryafbakening, bezoeken zijn sessies,
paginaweergaven tellen paginaladingen en gebeurtenissen tellen hoe vaak een gebeurtenis
plaatsvond. Een bezoekersaantal met een doelfilter telt converterende bezoekers, niet
alle sitebezoekers. Vermeld tijdsduur in seconden of een duidelijk herkenbare tijdnotatie.
Unieke bezoekers vormen geen op identiteit ontdubbeld aantal personen over apparaten,
sites of afzonderlijk bevraagde periodes heen.

Toon voor aantallen de absolute verandering en een expliciet benoemde relatieve
verandering: `(huidig - referentie) / referentie × 100`. Bij een referentiewaarde van nul
is de relatieve verandering niet gedefinieerd; toon de aantallen en de absolute verandering.
Behoud nullwaarden als niet beschikbaar. Toon veranderingen in percentages als
procentpunten: van 40% naar 35% is −5 procentpunt. Reken met onafgeronde invoer en rond
alleen de getoonde uitkomst af.

Gebruik periodeaggregaten voor totalen, percentages en gemiddelden. Een gemiddelde van
tijdvakpercentages of een optelsom van tijdvakbezoekers geeft niet het perioderesultaat.
Bezoekersaantallen per pagina kunnen overlappen. Combineer alleen optelbare aantallen
waarvan de afbakening aantoonbaar niet overlapt. Vraag voor aandelen een afzonderlijke
noemer op; behandel de top N nooit als het sitetotaal. Onderscheid een gemeten nul van
ontbrekende gegevens, weggelaten rijen of ontbrekende tracking. Toon bij percentages de
bijbehorende aantallen. Kleine aantallen rechtvaardigen voorzichtige beschrijvingen,
geen stellige claims over verbetering of statistische significantie.

Rapporteer ingestelde, geretourneerde conversies als metingen van dat doel, niet als
bewijs van daadwerkelijke aanmeldingen of iedere klik. Behoud de conversienoemer en
filtercontext van de API; vervang deze niet door gebeurtenissen/paginaweergaven. Beschrijf
samenhang rond een uitrol of campagne zonder een oorzakelijk verband te claimen.
Formuleer aanbevelingen als hypotheses en vervolgcontroles. Plausible-verkeer alleen
onderbouwt geen advertentiekosten, ROAS, individuele bezoekersreizen of
campagne-effectiviteit. Omzet vereist een expliciet beschikbare, ingestelde meting.

## Lever de gewenste uitvoer

Lees voor grafieken of PDF de [uitvoervormen](references/output-modes.md). Lever standaard
een beknopt chatrapport. Vermeld site, exacte datums, rapportagetijdzone, volledigheid,
KPI-waarden of gerangschikte resultaten, een korte interpretatie, relevante beperkingen
en een notitie waarmee de analyse kan worden herhaald. Gebruik de taal van de gebruiker
voor tekst, tabellen, grafieklabels en PDF-inhoud.

Vermeld in die notitie waar van toepassing de tool, site, datumgrenzen, meetwaarden,
dimensies, filters, tijdvakgrootte, rijlimiet en opgehaalde pagina’s, importkeuze en
feitelijke dekking, vergelijkingsrichting en het ophaalmoment.
Gebruik een compacte notitie of bijlage in plaats van volledige ruwe tooluitvoer.
Link waar praktisch naar een bekend Plausible-dashboard. De MCP-hostnaam is niet het
analyticsdashboard en een eigen installatie gebruikt niet noodzakelijk plausible.io.
Laat inloggegevens en URL’s met authenticatiegegevens weg.

Rond af wanneer het gevraagde bewijs en resultaat aanwezig en gecontroleerd zijn, of
benoem duidelijk wat de gegevens of werkomgeving niet kunnen leveren. `send_feedback`
stuurt een bericht naar de beheerders: beschrijf knelpunten in het rapport en verstuur
ze alleen wanneer de gebruiker expliciet toestemming geeft voor dat externe bericht.
Laat vertrouwelijke querygegevens weg.
