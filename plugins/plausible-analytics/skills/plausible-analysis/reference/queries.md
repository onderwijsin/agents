# Querygids

De Plausible-app biedt `get_sites` en `get_goals` voor configuratie, vijf statistiektools
voor metingen en `send_feedback` voor berichten aan de beheerders. Voor feedback is
expliciete toestemming van de gebruiker nodig.

## Sites en doelen vinden

`get_sites` accepteert drie alternatieven:

- `site_id`: metadata voor één genoemde site.
- `use_default: true`: de ingestelde standaardsite controleren.
- Geen selectie: toegankelijke sites opsommen. Geef bij vervolgpagina’s `next_after`
  mee als `after`; combineer `after` niet met `site_id` of `use_default`.

Het resultaat bevat `status`, `sites` en `next_after`, en eventueel `message`. Elke site
bevat `site_id`, `timezone`, `timezone_status`, `today` en `is_default`. Gebruik de
site-lokale `today` om relatieve rapportageperiodes te bepalen. Een ontbrekende of
ongeldige tijdzone levert `timezone_status: "unavailable"` en nullwaarden voor
`timezone` en `today` op; er is geen terugval op de server- of gebruikerstijdzone.
Volg de sitepagina’s alleen zolang dat nodig is voor de selectie of een volledige lijst.

`get_goals` accepteert `site_id` (of de ingestelde standaardsite) en optioneel `after`.
Het resultaat bevat `status`, eventueel `site_id`, `goals`, `next_after`, `completeness`
en `message`. Doelen bevatten `display_name`, `goal_type` en, indien aanwezig, `id`,
`event_name`, `page_path`, `custom_props` en aanvullende doeldefinities. Gebruik
`display_name` als `goal` in statistiekqueries, niet automatisch `event_name` of `id`.
Deze inventaris toont configuratie onafhankelijk van activiteit, inclusief doelen
zonder conversies.

Beide tools gebruiken de bestaande toegang van de aanroeper. Interpreteer `status`:

- `available`: de metadata is opgehaald; controleer daarnaast de tijdzonestatus en paginering.
- `unsupported`: het endpoint wordt niet ondersteund.
- `permission_denied`: de bestaande toegang staat de aanvraag niet toe.
- `unavailable`: metadata kan niet worden verkregen, bijvoorbeeld door een ongeldige
  aanvraag, ontbrekende standaardsite, netwerkfout of onverwacht antwoord.

Een mislukte aanvraag betekent onbekende configuratie, geen lege site- of doelenlijst.
Vraag niet impliciet om ruimere inlogrechten en leid configuratie niet af uit activiteit.

Volg voor een volledige doeleninventaris `next_after` als `after` met dezelfde site.
Alleen een eerste antwoord zonder vervolgcursor is op zichzelf `complete`; latere
pagina’s zijn afzonderlijk `partial`. Concludeer pas dat een doel niet is ingesteld
wanneer alle pagina’s vanaf het begin succesvol zijn verzameld en geen vervolgcursor
resteert. Bij een fout of `unknown` blijft de configuratie onvolledig bekend. Stop ook bij een
herhaalde cursor zonder voortgang en rapporteer de onvolledige inventaris.

## Statistiektools kiezen

De vijf statistiektools accepteren `site_id`, een of twee datumbereiken, `page`,
`property_filters` en optioneel `include_imports`. Geef de vastgestelde `site_id`
expliciet mee, ook als de server een standaardsite heeft. Absolute bereiken hebben de
vorm `YYYY-MM-DD,YYYY-MM-DD`; beide datums tellen mee. Relatieve waarden zijn `Nh`,
`Nd`, `Nmo`, `day`, `month`, `year` en `all`, waarbij N een aantal is. Gebruik voor
herhaalbare rapporten en paginering expliciete datums. De tools accepteren geen
ISO-tijdstempels als grenzen of parameter voor de tijdzone. Datums volgen de
rapportagetijdzone van de site.

| Tool              | Invoer en gedrag                                                                                                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_aggregate`   | `date_range`, `metrics`, optioneel `goal`; één aggregaat over de periode zonder uitsplitsing. Standaard: `visitors`, `visits`, `pageviews`, `bounce_rate`, `visit_duration`.                                          |
| `get_timeseries`  | `date_range`, `granularity`: `day`/`week`/`month`, `metrics`, optioneel `goal`; groepeert altijd op tijd.                                                                                                             |
| `get_breakdown`   | `date_range`, één `dimension`, `metrics`, `limit` (1–1000, standaard 20) en `offset` (standaard 0).                                                                                                                   |
| `get_conversions` | `date_range`, optioneel `goal`, `breakdown_by_page`, `limit` (1–10000, standaard 10000) en `offset` (standaard 0); vaste meetwaarden: `visitors`, `events`, `conversion_rate`; groepeert op doel en optioneel pagina. |
| `compare_periods` | `period_a`, `period_b`, `metrics`, optioneel `goal`; aggregaten per periode; veranderingen zijn B min A.                                                                                                              |

Gebruik voor een enkel KPI-overzicht `get_aggregate`; tel geen tijdreeksbezoekers op en
gebruik geen dubbele periodevergelijking om één aggregaat te verkrijgen.
`get_timeseries` en `compare_periods` hebben als standaardmeetwaarden `visitors`,
`pageviews`, `bounce_rate` en `visit_duration`; voeg `visits` expliciet toe wanneer nodig.
`get_breakdown` gebruikt standaard `visitors`, `pageviews` en `bounce_rate`; bij een
aangepaste eigenschap vervangt `events` het bouncepercentage.

## Rangschikken en pagineren

`get_breakdown` en `get_conversions` sorteren aflopend op de eerste meetwaarde en daarna
oplopend op alle groeperingsdimensies om gelijke waarden te ordenen. Er is geen vrije
sorteerparameter. Zet de rangschikkingswaarde vooraan in `metrics`. Een op bezoekers
afgekapt resultaat achteraf hersorteren op paginaweergaven levert geen geldige top op
paginaweergaven op; vraag opnieuw op met de juiste meetwaardevolgorde.

Beide tools geven `pagination` terug:

| Veld                               | Betekenis                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| `limit`, `offset`, `returned_rows` | Gevraagde paginagrootte, positie vanaf nul en aantal ontvangen rijen.                |
| `total_rows`                       | Totaal volgens de API, of `null` als het ontbreekt of ongeldig is.                   |
| `has_more`                         | `true` bij meer rijen, `false` bij het einde, `null` als dat niet vaststaat.         |
| `next_offset`                      | Positie voor de volgende aanvraag, of `null` als doorgaan niet mogelijk of nodig is. |
| `completeness`                     | `complete`, `partial` of `unknown` voor dit antwoord.                                |
| `warnings`                         | Waarschuwingen over onbekende totalen, mogelijke limieten of inconsistenties.        |

Voor een top N is verdere paginering niet nodig als voldoende gerangschikte rijen zijn
opgehaald. Volg voor een volledige uitsplitsing `next_offset` met dezelfde site, datums,
meetwaarden, dimensies, filters, importkeuze en limiet. Begin bij `offset: 0`.

Alleen `completeness: "complete"` betekent dat één antwoord alle rijen bevat. Een
laatste vervolgpagina blijft afzonderlijk `partial`, ook bij `has_more: false`.
Beoordeel voor een verzamelde uitsplitsing of de pagina’s aaneengesloten vanaf nul zijn,
de totalen consistent zijn, het aantal verzamelde rijen overeenkomt met `total_rows`
en waarschuwingen geen ontbrekende rijen aangeven.

Een korte of lege pagina bewijst geen volledigheid als totalen ontbreken of ongeldig
zijn: de status blijft dan `unknown`. Een nullwaarde voor `next_offset` bewijst evenmin
dat alles is opgehaald. Ga alleen door zolang de cursor vooruitgaat; stop bij een fout,
geen voortgang of een onoplosbare inconsistentie en rapporteer de resterende beperking.
Paginering is geen momentopname. Houd vaste datums aan en benoem verschuivende totalen
of rijen; ook een expliciete periode kan nog worden aangevuld met gegevens.

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
betekent een letterlijk voorvoegsel. `/traineeship*` selecteert `/traineeship` en
`/traineeship/aanmelden`, maar niet `/archive/traineeship`. Het voorvoegsel is geen
padsegmentgrens: ook `/traineeship-extra` begint ermee. Gebruik exacte paden als de
bedoelde paginaselectie smaller is.

De MCP voert de voorvoegselmatch uit met een ontsnapte, verankerde `matches`-expressie.
Bij een API zonder ondersteuning volgt een fout, zonder ruimere terugval. Geef voor een
bewuste deeltekenreeksmatch geen `page` mee en gebruik `property_filters` met
`property: "event:page"`, `operator: "contains"` en de gewenste waarde. `matches` is
geen vrije operator in `property_filters`.

Pagina- en doelfilters selecteren gebeurtenissen die aan beide voorwaarden voldoen.
Ze reconstrueren geen reeks waarin iemand een pagina leest en elders converteert.
Gebruik `visit:entry_page` alleen voor vragen over sessies die op een bepaalde pagina
beginnen en benoem die afbakening. De MCP biedt geen gedragsfilters voor willekeurige
bezoekersreizen. Corrigeer bij een fout een ongeldige combinatie of benoem de beperking;
laat het filter dat de gebruikersvraag bepaalt nooit stilzwijgend weg.

## Queryvoorbeelden

Vraag één periodeoverzicht op met `get_aggregate`. De standaardmeetwaarden bevatten alle
vijf overzichts-KPI’s. Deze aanvraag vraagt ook geïmporteerde historie; controleer
`imports` om vast te stellen of deze daadwerkelijk is opgenomen.

```json
{
  "site_id": "example.com",
  "date_range": "2025-09-01,2025-09-30",
  "include_imports": true
}
```

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

## Geïmporteerde historie

Alle vijf statistiektools accepteren `include_imports` als boolean. Standaard wordt
alleen eigen Plausible-tracking gebruikt. Geef `true` mee wanneer geïmporteerde historie
bij de vraag hoort en houd die keuze gelijk voor alle bijbehorende queries en periodes.

Bij een expliciete keuze of importmetadata uit de API bevat het resultaat `imports`:

- `requested`: of geïmporteerde historie is gevraagd.
- `imports_included`: `true` of `false`, of `null` wanneer opname niet is bevestigd.
- `imports_skip_reason` en `imports_warning`: reden en waarschuwing, indien geretourneerd.
- `warnings`: dekkingswaarschuwingen voor het rapport.

`include_imports: true` garandeert geen opname. Sommige combinaties van meetwaarden,
filters en dimensies ondersteunen alleen eigen tracking. Benoem bij `false` dat de
gevraagde historie ontbreekt en bij `null` dat de dekking onbekend is. Het ontbreken van
een `imports`-object bevestigt geen opname van geïmporteerde gegevens. Vergelijk bij
`compare_periods` `period_a.imports` en `period_b.imports` afzonderlijk. Een verschil
in dekking beperkt de vergelijkbaarheid; ontbrekende historie betekent geen nul verkeer.

## Gegevensdekking en verwerking van resultaten

Statistiekresultaten behouden in tekst en gestructureerde uitvoer de geretourneerde
`meta` en `query`, inclusief onbekende aanvullende metadatavelden. De gestructureerde
uitvoer labelt bovendien de meetwaarden en dimensies. Koppel de parallelle lijsten in
`results` volgens die volgorde. Gebruik `query` voor de uitgevoerde afbakening en
`meta` voor waarschuwingen, bijvoorbeeld over imports of niet-berekenbare meetwaarden.
Ontbrekende velden blijven afwezig; een expliciet leeg object blijft leeg. Geen van
beide bewijst dat alle relevante gegevens zijn opgenomen.

`compare_periods` geeft deze context per periode terug als `period_a.meta`,
`period_a.query`, `period_b.meta` en `period_b.query`, naast eventuele importdekking.
Behoud de bestaande betekenis van `metrics` en `deltas`: de absolute verandering is
B min A; de relatieve verandering gebruikt A als noemer en is `null` bij een nulbasis
of ontbrekende meetwaarde. Toon bij percentages de absolute verandering als
procentpunten. Lege resultaten en nullwaarden blijven als zodanig behouden.

Neem geretourneerde waarschuwingen over imports, paginering en meetwaarden letterlijk
of zorgvuldig vertaald over. Houd noemers, ontbrekende waarden en niet-beschikbare
meetwaarden zichtbaar. Ontbrekende tijdvakken blijven onbekend, tenzij de metadata of
de API-definitie een nul onderbouwt. Er is geen invoer voor `include.time_labels`.
Een leeg conversieresultaat zegt iets over activiteit binnen die query; gebruik de
volledig opgehaalde doeleninventaris om de configuratie vast te stellen.
