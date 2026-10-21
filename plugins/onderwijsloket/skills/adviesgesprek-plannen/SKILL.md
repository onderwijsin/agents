---
name: adviesgesprek-plannen
description: Help een telefonisch adviesgesprek met Onderwijsloket plannen wanneer de gebruiker dat vraagt. Gebruik ook na instemming met een gesprek bij een onopgeloste complexe adviesvraag; maak geen afspraak zonder bevestiging van de complete boeking.
license: MIT
compatibility: Vereist in ChatGPT toegang tot de geregistreerde onderwijsloket-app; in andere hosts een directe MCP-verbinding. Acties vereisen de bijbehorende schrijftools.
---

# Adviesgesprek plannen

1. Lees [MCP-werkwijze](reference/mcp-werkwijze.md),
   [afspraken en intake](reference/afspraken-en-intake.md),
   [privacy](reference/privacy-en-toestemming.md) en
   [bevestiging en fouten](reference/bevestiging-en-foutafhandeling.md).
   Controleer vóór persoonlijke intake of de benodigde boekingstools beschikbaar
   zijn. Zonder actietool leg je de beperking uit en doe je geen boekingsbelofte.
2. Bepaal eerst de gewenste gesprekstaal vanuit de context en de ondersteunde
   talen in het actuele toolschema; vraag alleen bij onduidelijkheid. Haal daarna
   met `get_scheduling_link` voor die taal de actuele duur en formuliervereisten op.
   Volg de serverinstructies
   voor tijdzone en notatie. Bij een onbruikbaar formulier: geen verzonnen keuzes;
   geef de teruggegeven boekingsroute als alternatief.
3. Vraag naar tijdvoorkeuren en zoek met `get_scheduling_slots`. Volg de actuele
   zoekvensters van de server, respecteer een opgegeven periode en toon een kleine
   selectie van echte tijdsloten met herkenbare tijdzone. Laat de gebruiker kiezen.
4. Doorloop de actuele vereiste intake één vraag tegelijk. Gebruik bekende
   achtergrond met bevestiging, laat onnodige optionele vragen weg en vraag een
   bereikbaar telefoonnummer zonder een opmaaktaak op te leggen.
5. Toon datum, tijd, tijdzone, duur, contactgegevens en volledige ingevulde intake.
   Leg de gegevensverwerking voor de afspraak uit en vraag expliciet of je met
   deze gegevens mag boeken. Verandert iets wezenlijks, laat het opnieuw bevestigen.
6. Gebruik `book_appointment` eenmaal voor de bevestigde poging. Toon alleen na
   succes de teruggegeven bevestiging. Volg bij fout, verdwenen tijdslot of onzekere
   uitkomst de foutreferentie; herhaal een schrijfactie nooit automatisch.

Rond af met het bevestigde resultaat of een eerlijke herstelroute. Bij onzekerheid
laat je eerst de bevestigingsmail controleren, vóór een eventuele nieuwe boeking.
Annuleren en verplaatsen volgen de actuele aanwijzingen van de dienst; claim geen
handeling die niet is uitgevoerd. Geef voorbereiding pas na boeken of op verzoek.

Gebruik bij boekingsbevestiging en onzekere uitkomsten de passende
[voorbeeldgesprekken](reference/voorbeeldgesprekken.md).
