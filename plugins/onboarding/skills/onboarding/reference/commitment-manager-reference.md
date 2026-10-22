# Commitment Manager — uitvoeringsreferentie

Dit bestand hoort bij de persoonlijke Commitment Manager die de medewerker maakt.
Het bevat geen vaste database, persoonlijke account-ID's, organisatieveldnaam of
verplicht schema. De eigenaar kiest bronnen, bestemming, rechten en eventuele planning.

## Bronidentiteit, scope en bewijs

Identificeer de gebruiker apart in Slack, Outlook, Notion en eventueel Meetings
via de accountgegevens van die bron. Neem een Notion-ID niet over als Slack- of
mailidentiteit. Vraag bij twijfel gericht wie de toezegging heeft gedaan.

- Slack: lees eigen berichten en relevante threads en reacties binnen de gekozen
  kanalen en toegestane privégesprekken. Bewaar echte bericht-ID's en permalinks.
- Outlook Email: begin bij verzonden berichten en lees relevante antwoorden.
  Onderscheid een verzoek, aanvaarding en al geleverde uitvoering. Lees alleen;
  maak ook geen concepten, labels of leesstatuswijzigingen.
- Notion: lees gekozen pagina's, opmerkingen, overlegnotities en besluiten.
  Een toegewezen actie is geen bewijs dat de gebruiker deze heeft aanvaard.
- Meetings: lees beschikbare notities en bijbehorende transcripten waar beschikbaar
  en nodig voor de conclusie. Controleer sprekerstoewijzing; meld ontbrekende of
  onvolledige context. Een samenvatting met een naam is niet altijd voldoende bewijs.

Beperk onderzoek tot het verzoek en de toegestane bronnen. Volg beschikbare paginering
en lees de relevante volledige conversatie voordat je een afspraak kwalificeert.
Claim geen volledige dekking als bron, identiteit, periode of zoekresultaten onzeker zijn.
De e-mailuitzondering en voorwaarden voor andere koppelingen blijven gelden volgens
het bijgevoegde medewerkersbeleid in organization-policy.md; deze agent geeft geen
ruimere toegang of gegevensvrijstelling. Vraag bij een ontbrekende beleidsreferentie
om de toepasselijke voorwaarden voordat je de betreffende bronnen verwerkt.

## Toezegging kwalificeren

Alle voorwaarden moeten aantoonbaar zijn vervuld voordat je een taak aanmaakt:

1. De gebruiker heeft de actie zelf beloofd of duidelijk aanvaard.
2. Een concrete nog openstaande handeling of oplevering is herkenbaar.
3. Het gaat om een afspraak, geen suggestie, erkenning of onbevestigde toewijzing.
4. De actie is niet al uitgevoerd, ingetrokken, overgedragen of vervangen.
5. Geen bestaande taak dekt dezelfde verplichting.

Bepaal uit de context wie wat aan wie heeft toegezegd en wanneer. Los relatieve
termijnen op vanuit de oorspronkelijke bericht- of meetingdatum en bijbehorende
tijdzone. Bewaar een verlopen expliciete deadline; schuif die niet naar vandaag.
Vraag verduidelijking bij onvoldoende bewijs. Een bevestiging van de gebruiker
vereist alsnog een nieuwe controle van bron en taakdatabase voordat je schrijft.

## Bestaande taakdatabase en veldmapping

Bevestig de exacte bestaande bestemming en lees het live schema vóór query's en
schrijfacties. Gebruik aanwezige taakbeheerconventies als die beschikbaar zijn.
Maak geen database of eigenschappen aan en raad geen eigenschapsnamen of gebruikers-ID's.

Leg de mapping naar de werkelijk beschikbare velden vast:

- Actiegerichte titel en geldige beginstatus; eigenaar is de geverifieerde gebruiker.
- Deadline alleen bij een expliciet afgesproken oplevermoment.
- Gepland werkmoment alleen als dat apart is afgesproken; kopieer de deadline niet.
- Ontvanger en projectcontext alleen wanneer uit de bron blijkt wie of wat bedoeld is.
- Echte bron-ID, bronlink en eventueel een controleerbare verwijzing naar de afzonderlijke actie.

Optionele gegevens kunnen in de korte taakinhoud als een passend veld ontbreekt.
Ontbreekt een vereist veld, geldige status of schrijfbaar recht, stop dan de creatie
en meld wat ontbreekt. Vul geen systeem-ID, aanmaaktijd of andere servermetadata in.
Gebruik native Notion-inhoud en bestaande opmaakconventies; controleer de opgeslagen
inhoud. Kopieer geen volledige conversaties of ongerelateerde privégegevens.

## Dubbelen en veilige creatie

Zoek door de volledige aangewezen taakdatabase, inclusief afgeronde en geannuleerde
taken. Combineer bron-ID's en links met inhoudelijke vergelijking van actie, eigenaar,
ontvanger en oplevering. Alleen identieke titels vergelijken is onvoldoende.

- Een bestaande open taak: geen nieuwe taak, ook niet bij andere formulering of bron.
- Een afgeronde taak: alleen een nieuwe taak voor een aantoonbaar nieuwe opleverronde
  of hernieuwde toezegging. Een oude bron opnieuw vinden is onvoldoende.
- Een geannuleerde taak: niet heropenen; een nieuwe taak vereist een expliciete nieuwe afspraak.
- Meerdere bronnen over één toezegging: één taak.
- Meerdere onafhankelijke acties in één bericht: alleen afzonderlijke taken met een
  stabiele actie-identiteit op basis van de echte bron plus een actiediscriminator.
  Verzin geen provider-ID. Bij onduidelijke splitsing of overlap vraag je om een keuze.

Controleer vlak vóór iedere creatie opnieuw op een match. Centraliseer schrijfacties
en vermijd overlappende scans naar dezelfde bestemming. Een zoekcontrole biedt zonder
unieke sleutel of atomiciteit geen garantie tegen gelijktijdige creaties; meld een
resterend conflict in plaats van bestaande taken zelf te verwijderen.

Lees na creatie de taak terug en controleer titel, eigenaar, status, datums, bron,
inhoud en echte taaklink. Vermeld een numeriek taaknummer alleen als de database dat
werkelijk teruggeeft. Alleen geverifieerde creaties tellen mee als aangemaakt.
Bij een onzekere create: zoek met bronidentiteit en inhoud naar het resultaat voordat
je een nieuwe poging overweegt. Kun je de uitkomst niet vaststellen, meld onzekerheid.

## Rechten

Autonome creatie is pas toegestaan nadat de gebruiker daarvoor expliciet toestemming
heeft gegeven voor deze agent en de aangewezen database. Anders lever je voorstellen.
Bestaande taken blijven volledig ongewijzigd: geen heropening, nieuwe deadline,
eigenaarswijziging, annulering of verwijdering. Meld een gewenste wijziging als voorstel.

Alleen een opmaakreparatie aan een door deze agent in dezelfde uitvoering gemaakte
taak valt onder de creatietoestemming; wijzig daarbij geen inhoud of eigenschappen
en lees de pagina opnieuw terug. Geen schrijfacties naar andere Notion-bestemmingen,
Slack, e-mail of Meetings. Geen communicatie of nieuwe beloften namens de gebruiker.

## Herhaalde scans en optionele geschiedenis

Een planning wordt afzonderlijk gekozen en ingesteld; er is geen vaste dagelijkse
frequentie of tijdzone voor alle medewerkers. Bij herhaalde scans gebruik je per bron
het laatste succesvolle checkpoint met minstens 48 uur overlap. Zonder betrouwbare
geschiedenis onderzoek je de voorafgaande zeven dagen. Een gericht verzoek blijft gericht.

Bewaar, alleen als ondersteunde agentmemory beschikbaar is, compacte broncheckpoints,
recent gemaakte taak-ID's met bronidentiteit, dekkingsgaten en expliciete beslissingen.
Geen gekopieerde communicatie. Ontbreekt die voorziening, meld dat herhaalde scans
geen betrouwbaar incrementeel checkpoint hebben en voer opnieuw duplicatechecks uit.

Schuif een broncheckpoint alleen door als die bron voldoende verwerkt is en mogelijke
schrijfacties zijn afgehandeld of openstaande gevallen veilig zijn vastgelegd voor
herstel. Bewaar bij fouten de oude stand en benoem gaten. Geheugen is nooit bewijs dat
een taak wel of niet bestaat; controleer de live database bij iedere uitvoering.

## Rapport

Rapporteer in de gekozen taal, standaard Nederlands. Behoud oorspronkelijke taaknamen
waar praktisch. Gebruik alleen toepasselijke onderdelen:

1. Aangemaakt: geverifieerd aantal, titel, echte taaklink, deadline en ontvanger indien
   bekend, plus oorspronkelijke bronlink. Taaknummer alleen als dat beschikbaar is.
2. Al vastgelegd: aantal of korte samenvatting van bestaande dekking.
3. Verduidelijken: concrete twijfelgevallen met bronnen; voorstellen zijn geen creaties.
4. Dekking en fouten: onderzochte bronnen en periode, ontbrekende toegang, incomplete
   zoekresultaten, checkpointproblemen en onzekere schrijfacties.

Noem altijd het aantal geverifieerd aangemaakte taken, ook nul. Als bestaande taken
niet volledig konden worden gecontroleerd, claim dan niet dat voorstellen zeker
ontbreken in de database. Lever geen algemene activiteitensamenvatting.
