---
name: agent-instructie
description: Schrijf of verbeter prompts, skills en andere AI-instructies voor niet-technische taken. Gebruik wanneer iemand instructies voor een AI wil maken, verduidelijken of beoordelen, bijvoorbeeld voor redactie, onderzoek of werkplanning. Niet bedoeld voor programmeertaken of technische agentconfiguratie.
license: MIT
---

# Agent-instructie

Help de gebruiker instructies te schrijven die een AI betrouwbaar kan volgen. Schrijf
in het Nederlands en gebruik woorden die iemand zonder technische achtergrond begrijpt.
Werk toe naar een direct bruikbare instructie voor de taak van de gebruiker.

## Bepaal wat de instructie moet doen

Haal uit de vraag of bestaande tekst: de taak, de benodigde informatie, het gewenste
resultaat en de belangrijkste eisen. Vraag alleen door als ontbrekende informatie het
resultaat wezenlijk verandert. Benoem kleine aannames en werk daarmee verder.

Maak onderscheid tussen een prompt voor één opdracht en een skill voor een terugkerende
taak. Behoud de gekozen vorm en bedoeling. Schrijf bij een skill een korte beschrijving
die aangeeft bij welke vragen de AI de skill moet gebruiken. Benoem een grens wanneer
verwarring met een andere taak voor de hand ligt.

Bij een skill: bepaal of de AI die bij passende vragen zelf moet kiezen, of dat de
gebruiker die bewust oproept. Behoud een bestaande keuze; gebruik bij ontbreken daarvan
automatische selectie als uitgangspunt. Houd de beschrijving kort: noem de taak en
de verschillende situaties waarin de skill nodig is, zonder lijsten van synoniemen.
Zet het herkenbare taakbegrip vooraan. Instellingen voor uitsluitend handmatig gebruik
verschillen per AI-omgeving; leg ze pas vast als de omgeving bekend is en ze daar worden
ondersteund.

## Schrijf de instructie

- **Begin met de opdracht.** Gebruik een concreet werkwoord, zoals herschrijf, vergelijk
  of plan. Voeg een rol alleen toe als die relevante keuzes helpt maken.
- **Maak het resultaat herkenbaar.** Beschrijf wat de AI oplevert, voor wie, in welke
  vorm en wanneer het klaar is. Vervang woorden als ‘goed’ en ‘volledig’ door eisen die
  de gebruiker kan controleren.
  Geef bij afhankelijke stappen ook aan wanneer elke stap klaar is. ‘Noteer voor elke
  actie wie verantwoordelijk is en wat de deadline is, of markeer wat ontbreekt’ stuurt
  beter dan ‘maak een goede actielijst’. Maak eerst de afrondingseis scherper als de AI
  te snel doorgaat.
- **Geef gerichte context.** Neem alleen achtergrond en regels op die de aanpak of
  uitkomst veranderen. Laat de AI aangeleverde feiten behouden en ontbrekende feiten
  herkenbaar maken in plaats van ze in te vullen.
- **Orden wat bij elkaar hoort.** Zet een regel naast de uitleg of uitzondering die
  erbij hoort. Gebruik een volgorde van stappen als de taak daarvan afhankelijk is;
  gebruik anders korte onderdelen met duidelijke koppen.
- **Beschrijf het gewenste gedrag.** ‘Gebruik alledaagse woorden’ geeft meer richting
  dan ‘wees niet ingewikkeld’. Behoud noodzakelijke grenzen, bijvoorbeeld dat een
  concept pas na toestemming wordt verstuurd.
- **Houd elke regel op één plek.** Schrap herhaling, tegenstrijdigheden en zinnen die
  geen concrete keuze sturen. Geef ruimte waar meerdere uitkomsten passend zijn.
- **Gebruik vaste begrippen.** Kies herkenbare woorden, zoals ‘actielijst’ of
  ‘broncontrole’, en gebruik die consequent in beschrijving, koppen en instructies.
  Licht een ongebruikelijk begrip één keer toe. Herhaal het begrip waar het helpt;
  herhaal niet steeds de volledige uitleg.
- **Verwijs gericht.** Als een apart document nodig is, zeg welk document de AI moet
  lezen en wanneer. Houd regels die altijd nodig zijn in de instructie zelf. Stop
  eventuele bijlagen bij de skill, zodat die zelfstandig bruikbaar blijft.

Houd de opdracht en benodigde stappen goed zichtbaar. Zet uitgebreide achtergrond die
alleen voor sommige situaties nodig is in een apart onderdeel of een bijlage met een
duidelijke leesvoorwaarde. Splits een skill pas op als onderdelen zelfstandig nodig
zijn; een extra skill vraagt ook van de gebruiker dat die weet wanneer hij haar gebruikt.
Een extra kop of bestand verbergt latere stappen niet vanzelf voor de AI.

Verwijs voor veranderlijke informatie, zoals afspraken of een huisstijl, naar de actuele
bron die de AI kan raadplegen. Neem alleen de taakgerichte uitleg op die daar ontbreekt.
Als de bron niet toegankelijk is, laat de AI de benodigde informatie vragen in plaats
van doen alsof die is gelezen.

Gebruik een kort voorbeeld wanneer toon, vorm of een lastige keuze daarmee duidelijker
wordt. Leg uit welk kenmerk het voorbeeld laat zien; maak toevallige details geen vaste eis.

Bij een skill: lever de tekst voor `SKILL.md` met bovenaan een naam en beschrijving in
het gebruikelijke metadata-blok. Gebruik een korte naam met kleine letters en
koppeltekens. Voeg alleen bijlagen toe als de taak ze nodig heeft.

## Controleer of de instructie werkt

Lees de tekst alsof je de AI bent die ermee moet werken. Kun je bepalen wanneer de
instructie geldt, welke informatie je gebruikt, wat je moet opleveren en wanneer het
klaar is? Los conflicten op; vraag de gebruiker om een keuze als twee inhoudelijke
eisen niet samen kunnen worden gevolgd.

Beoordeel elke regel: verandert deze een keuze of verbetert deze het resultaat? Schrap
algemene aansporingen zoals ‘doe je best’ en verwijder verouderde afspraken. Als de
meerwaarde van een regel onzeker is, vergelijk bij een proefopdracht het resultaat met
en zonder die regel. Houd de controle gericht op het gewenste gedrag, niet op identieke
bewoordingen: een herhaalbare aanpak kan verschillende goede antwoorden opleveren.

Controleer de instructie met een gewone voorbeeldvraag en een geval met ontbrekende
informatie. Controleer bij een skill ook een vraag waarvoor die niet bedoeld is.
Als uitvoering mogelijk is, probeer de instructie en beoordeel het resultaat tegen de
gestelde eisen. Maak anders duidelijk dat je alleen de tekst hebt beoordeeld. Een
geschreven instructie is nog geen bewijs dat de AI die in de praktijk goed volgt.

## Lever de volledige tekst

Geef de complete, direct bruikbare prompt of skill. Licht belangrijke keuzes of
wijzigingen kort toe en vermeld wat daadwerkelijk is gecontroleerd. Houd deze uitleg
buiten de instructie, zodat de gebruiker de tekst gemakkelijk kan overnemen.

## Voorbeeld van concreter schrijven

‘Maak mijn nieuwsbrief beter’ laat het doel en de grenzen open. Een bruikbare instructie is:

> Herschrijf deze nieuwsbrief voor vrijwilligers. Gebruik een warme, directe toon en
> korte alinea's. Behoud de feiten, datums en links uit de aangeleverde tekst. Lever
> een onderwerpregel en de volledige nieuwsbrief. Benoem ontbrekende informatie die
> nodig is om de tekst te kunnen versturen.

Dit voorbeeld maakt doelgroep, toon, te behouden informatie en resultaat zichtbaar.
Kies bij andere taken de eisen die daarbij passen.
