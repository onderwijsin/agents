# Querygids

De Plausible-app biedt vier tools voor het lezen van analyticsgegevens en `send_feedback`
voor berichten aan de beheerders. Deze gids beschrijft hoe je de leestools gebruikt;
voor feedback is expliciete toestemming van de gebruiker nodig.

## Invoer en toolkeuze

Alle vier leestools accepteren `site_id`, een of twee datumbereiken, `page` en
`property_filters`. Geef de vastgestelde `site_id` expliciet mee, ook als de server een
standaardsite heeft. Absolute datumbereiken hebben de vorm `YYYY-MM-DD,YYYY-MM-DD`;
beide datums tellen mee. Relatieve waarden zijn `Nh`, `Nd`, `Nmo`, `day`, `month`,
`year` en `all`, waarbij N een aantal is. Gebruik voor herhaalbare rapporten bij voorkeur
expliciete datums. De tools accepteren geen ISO-tijdstempels als grenzen en geen
parameter voor de tijdzone. Datums volgen de rapportagetijdzone van de site.

| Tool              | Invoer en gedrag                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_timeseries`  | `date_range`, `granularity`: `day`/`week`/`month`, `metrics`, optioneel `goal`; groepeert altijd op tijd.                                               |
| `get_breakdown`   | `date_range`, één `dimension`, `metrics`, `limit` (standaard 20, maximaal 1000); geen paginaverschuiving of expliciete sorteerparameter.                |
| `get_conversions` | `date_range`, optioneel `goal`, `breakdown_by_page`; vaste meetwaarden: `visitors`, `events`, `conversion_rate`; groepeert op doel en optioneel pagina. |
| `compare_periods` | `period_a`, `period_b`, `metrics`, optioneel `goal`; aggregaten over elke periode zonder uitsplitsing; veranderingen zijn B min A.                      |

Er is geen afzonderlijke aggregatietool. Gebruik voor één periode `compare_periods` met
hetzelfde expliciete bereik in A en B. Neem één geretourneerd aggregaat over en negeer
de dubbele waarden en veranderingen. Gebruik bij een gevraagde vergelijking de echte
referentieperiode. Zo voorkom je onjuiste aggregatie van bezoekers uit een tijdreeks.

De standaardmeetwaarden van `get_timeseries` en `compare_periods` zijn `visitors`,
`pageviews`, `bounce_rate` en `visit_duration`. Geef `metrics` expliciet mee wanneer
ook `visits` of andere meetwaarden nodig zijn. `get_breakdown` gebruikt standaard
`visitors`, `pageviews` en `bounce_rate`; bij een aangepaste eigenschap vervangt
`events` het bouncepercentage.

Zet bij een ranglijst de meetwaarde waarop je rangschikt vooraan: zonder tijdsdimensie
sorteert de API aflopend op de eerste meetwaarde. Een afgekapt resultaat dat op bezoekers
is gerangschikt, levert na hersorteren op paginaweergaven geen geldige top op
paginaweergaven op. Vraag opnieuw op met de juiste meetwaardevolgorde. Verhoog de
rijlimiet alleen als dat nodig is. Benoem bij het bereiken van de limiet dat het resultaat
mogelijk is afgekapt; de MCP kan geen volgende pagina ophalen. Ook conversie-uitsplitsingen
hebben geen pagineringsparameters. Claim volledigheid alleen met onderbouwing.

## Meetwaarden en dimensies

`metrics` accepteert `visitors`, `visits`, `pageviews`, `views_per_visit`, `bounce_rate`,
`visit_duration`, `events`, `scroll_depth`, `percentage`, `conversion_rate`,
`group_conversion_rate`, `average_revenue`, `total_revenue` en `time_on_page`.
De beschikbaarheid hangt af van de meting, het ingestelde doel en de combinatie van
filters en dimensies. Een geaccepteerde parameter garandeert geen berekenbare waarde.

`dimension` accepteert:

- Pagina en gebeurtenis: `event:page`, `event:goal`, `event:hostname`.
- Instap en uitstap: `visit:entry_page`, `visit:exit_page`.
- Herkomst: `visit:source`, `visit:channel`, `visit:referrer`, `visit:utm_source`,
  `visit:utm_medium`, `visit:utm_campaign`, `visit:utm_content`, `visit:utm_term`.
- Apparatuur: `visit:device`, `visit:browser`, `visit:browser_version`, `visit:os`,
  `visit:os_version`.
- Geografie: `visit:country`, `visit:region`, `visit:city` en de leesbare varianten
  `visit:country_name`, `visit:region_name`, `visit:city_name`.
- Aangepaste eigenschappen: `event:props:<naam>`. Vraag alleen eigenschappen op waarvan
  bekend is dat ze worden gemeten.

Gebruik bevestigde herkomstwaarden uit gegevens of de UTM-conventies van de gebruiker.
Ontbrekende UTM-tags maken identificatie van campagnes onvolledig. Afzonderlijke
uitsplitsingen naar bron en campagne tonen geen gezamenlijke verdeling.

## Filters

Elke ingang in `property_filters` bevat `property`, `operator` en `values` (een lijst
met tekenreeksen). Geldige operatoren zijn `is`, `is_not`, `contains` en `contains_not`;
standaard is de operator `is`. Doelfilters ondersteunen alleen `is` en `contains`.
Meerdere filters worden gecombineerd met EN. Gebruik voor alternatieve paginapaden één
`event:page`-filter met `is` en meerdere waarden. Combineer in dezelfde aanroep nooit
`page` met een `event:page`-filter, of `goal` met een `event:goal`-filter.

`property` accepteert een ingebouwde dimensie of een aangepaste eigenschap, als kale naam
of als `event:props:<naam>`. De kale naam `plan` verwijst bijvoorbeeld naar
`event:props:plan`.

De verkorte parameter `page` matcht exact, tenzij de waarde eindigt op `*`. Die uitgang
wordt vertaald naar een `contains`-filter op een deel van het pad, niet naar een echte
voorvoegselmatch. `/traineeship*` kan daardoor ook `/archive/traineeship` selecteren.
Gebruik bij voorkeur bevestigde exacte paden. Bekijk bij het zoeken naar passende
pagina’s eerst de gevonden paden voordat je beweert dat de selectie volledig is.

Pagina- en doelfilters selecteren gebeurtenissen die aan beide voorwaarden voldoen.
Ze reconstrueren geen reeks waarin iemand een pagina leest en elders converteert.
Gebruik `visit:entry_page` alleen voor vragen over sessies die op een bepaalde pagina
beginnen en benoem die afbakening. De MCP biedt geen gedragsfilters voor willekeurige
bezoekersreizen. Corrigeer bij een fout een ongeldige combinatie of benoem de beperking;
laat het filter dat de gebruikersvraag bepaalt nooit stilzwijgend weg.

## Queryvoorbeelden

Vraag voor een top 10 op paginaweergaven `get_breakdown` aan met de volgende parameters.
Vervang domein en datums door de bevestigde rapportageafbakening.

```json
{
  "site_id": "example.com",
  "date_range": "2025-09-01,2025-09-30",
  "dimension": "event:page",
  "metrics": ["pageviews", "visitors"],
  "limit": 10
}
```

Vraag voor de herkomst van twee bevestigde pagina’s een gezamenlijke paginaselectie op.
Dit levert een bronuitsplitsing op, geen gezamenlijke bron-campagneuitsplitsing.

```json
{
  "site_id": "example.com",
  "date_range": "2025-09-01,2025-09-30",
  "dimension": "visit:source",
  "metrics": ["visitors", "visits"],
  "property_filters": [
    {
      "property": "event:page",
      "operator": "is",
      "values": ["/traineeship", "/traineeship/aanmelden"]
    }
  ],
  "limit": 20
}
```

## Gegevensdekking en verwerking van resultaten

De tekstresultaten van tijdreeksen, uitsplitsingen en conversies bevatten `results`,
`meta` en `query`. De gestructureerde uitvoer bevat meetwaarde- en dimensielabels en
resultaten, maar laat metadata weg. Lees de tekstuitvoer voor waarschuwingen en de
feitelijk uitgevoerde query. Koppel parallelle lijsten volgens hun opgegeven volgorde,
niet op basis van veronderstelde veldposities.

`compare_periods` laat de metadata en uitgevoerde query van beide periodes weg. Benoem
dat de dekkingswaarschuwingen daardoor niet zichtbaar zijn. Vraag wanneer de dekking
bepalend is voor de conclusie elke periode ook op via een leestool die metadata behoudt,
met passende meetwaarden en dezelfde afbakening, en bekijk de tekstuitvoer. Dit herstelt
de ontbrekende vergelijkingsmetadata niet en bewijst geen gelijke dekking. Benoem
onopgeloste onzekerheid.

De MCP heeft geen invoer voor `include.imports` en vraagt geen geïmporteerde historie op.
Rapporteer de dekking als gegevens uit de eigen Plausible-tracking. Een leeg historisch
resultaat betekent geen nul historisch verkeer. Neem geretourneerde import- of
meetwaardewaarschuwingen letterlijk of zorgvuldig vertaald over.

Ontbrekende tijdvakken blijven onbekend, tenzij de geretourneerde metadata of de
API-definitie een nul onderbouwt. Houd noemers, ontbrekende waarden en niet-beschikbare
meetwaarden zichtbaar in de presentatie. Een leeg conversieresultaat onderscheidt een
niet-ingesteld doel niet van een ingesteld doel zonder gemeten conversies.
