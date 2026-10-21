---
name: onderwijsroute-verkennen
description: Verken mogelijke routes vanuit iemands opleiding naar gewenst werk in het onderwijs, of leg een specifieke route uit. Gebruik de actuele MCP-routevragen voor persoonlijke matching, niet voor een losse begripsvraag.
license: MIT
compatibility: Vereist de inhouds-MCP van Onderwijsloket en de meegeleverde skillreferenties.
---

# Onderwijsroute verkennen

1. Lees [MCP-werkwijze](reference/mcp-werkwijze.md),
   [routevragen en matching](reference/routevragenlijst-en-matching.md) en
   [toelatingsgrenzen](reference/toelating-en-bevoegdheid.md).
2. Bepaal of de gebruiker een bekende route wil begrijpen of persoonlijke matches
   zoekt. Lees voor uitleg het route-detail. Claim zonder matching niet dat die
   route bij de persoon past. Voor matching haal je met
   `get_route_questions` de huidige vragenlijst op en valideer je bekende keuzes opnieuw.
3. Stel de teruggegeven volgende ingeschakelde vraag, één tegelijk. Behoud de
   betekenis van de opties. Laat een voorgestelde keuze bevestigen; veronderstel
   geen diploma-equivalentie. Valideer na elk antwoord en gebruik de teruggegeven
   geldige keuzes. Leg verwijderde vervolgkeuzes na een wijziging kort uit.
4. Gebruik `find_routes` alleen na volledige, geldige beantwoording. Toon een
   klein eerste overzicht met bekende duur en hoofdstappen. Leg uit dat de
   volgorde op duur geen geschiktheidsrangorde is. Verander antwoorden niet om
   matches te produceren en bied vervolgresultaten alleen aan als ze helpen.
5. Lees `get_route` voor een gekozen route of een kleine vergelijking. Licht de
   geordende stappen toe en lees gekoppelde inhoud voor noodzakelijke uitleg.
   Benoem onbekende duur, onvolledige inhoud en wat een opleider of werkgever
   nog moet beoordelen. Gebruik voor verwarrende bewijsstukken
   [onderwijsbegrippen](reference/onderwijsbegrippen-en-kwalificaties.md).

Rond af met mogelijke routes, relevante verschillen en de eerstvolgende stap.
Bij een vastgelopen vragenlijst, geen match of fout benoem je die specifieke
beperking; bied zo nodig [gerichte ondersteuning](reference/advies-en-doorverwijzen.md).
Geen resultaat bewijst niet dat werken in onderwijs onmogelijk is.

Gebruik bij routekeuzes en kwalificatieverwarring de passende
[voorbeeldgesprekken](reference/voorbeeldgesprekken.md).
