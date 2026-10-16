# Icon-generator

Maak PNG-iconen vanuit tekst of een afbeelding in een van drie merkstijlen:
Onderwijs in, Trainees in onderwijs en Onderwijsloket. Eén skill verzorgt generatie,
bewerkingen en reeksen losse iconen met de ingebouwde beeldgeneratie van de host.

Dit is de voorbereide plugin voor [issue #6](https://github.com/onderwijsin/agents/issues/6),
met drie afzonderlijke stijlen in plaats van één vaste huisstijl. De 50 aangeleverde referentie-iconen zijn per merk gebundeld en de drie stijlgidsen zijn
afgeleid uit visuele inspectie en pixelmetingen. Generatie in geïnstalleerde hosts en
consistentie van nieuwe resultaten moeten nog worden getest.

## Gebruik en vereisten

Installeer het volledige pakket via de marketplace; de skill gebruikt bestanden buiten
zijn eigen skillmap en is niet afzonderlijk installeerbaar. De host moet afbeeldingen
kunnen inspecteren, native genereren en bewerken, en downloadbare PNG-bestanden leveren.
Er zijn geen MCP-server, API-sleutels of externe diensten geconfigureerd.

Geef altijd een merkstijl, een onderwerp- of objectbeschrijving en een gewenste grootte:
klein (200 px breed), medium (500 px breed), groot (1000 px breed) of een custom
pixelafmeting. De breedte legt de hoogte niet vast: het ontwerp streeft naar 1:1,
met vrijheid tussen 9:6 en 6:9 (breedte:hoogte). Bij 300 px breed is bijvoorbeeld
300 × 200 of 300 × 320 mogelijk. Referentiemateriaal is optioneel. De skill vraagt ontbrekende inputs samen
uit en wacht met generatie tot alle drie vaststaan. Bij vervolgverzoeken blijven eerdere
keuzes gelden zolang de gebruiker ze niet wijzigt. Uploads ondersteunen het onderwerp of
de compositie; de eigen gebundelde merkbeelden bepalen de stijl.

De [skill](skills/icon-generator/SKILL.md) bevat de gedeelde uitvoering en exportregels.
Elke stijl heeft één canonieke gids en één eigen assetsmap:

| Stijl                 | Stijlgids                                   | Referenties                                                        |
| --------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| Onderwijs in          | [Gids](references/onderwijs-in.md)          | [assets/onderwijsin](assets/onderwijsin/README.md)                 |
| Trainees in onderwijs | [Gids](references/trainees-in-onderwijs.md) | [assets/traineesinonderwijs](assets/traineesinonderwijs/README.md) |
| Onderwijsloket        | [Gids](references/onderwijsloket.md)        | [assets/onderwijsloket](assets/onderwijsloket/README.md)           |

## Referenties en regels aanvullen

1. Voeg per merk de originele iconen aan de eigen assetsmap toe. Leg herkomst en toestemming
   voor publieke verspreiding vast in de README daar; neem een eventuele assetlicentie op.
2. Inspecteer de beelden visueel en meet waar mogelijk palet en transparantie. Leg de
   stijlregels met bronbestandsnamen en uitzonderingen in de eigen gids vast. De voorlopige
   meetwaarden uit het issue gelden niet automatisch voor een van de drie merken.
3. Werk de eigen gids bij met de afgeleide regels. Houd de andere stijlen zelfstandig.
4. Test per merk minimaal drie verschillende onderwerpen naast de referenties. Werk de
   verificatiematrix hieronder bij met host, versie/datum en bewijsbestanden. Verhoog bij
   wijzigingen de pluginversie; gidsen en beelden worden samen met de plugin verspreid.

## Broninspectie

Op 16 oktober 2026 zijn alle 18 Onderwijs in-, 15 Trainees in onderwijs- en 17
Onderwijsloket-iconen visueel bekeken in contactbladen. Per bestand zijn afmetingen en
alpha-extremen gecontroleerd; alle bestanden bevatten alpha 0 en 255. Paletwaarden zijn
bepaald door volledig ondoorzichtige RGB-pixels over het corpus per merk te tellen.
Kleurrollen, perspectief en vormregels zijn visuele interpretaties, geen officiële
merkspecificaties. De originele bestanden zijn ongewijzigd gebleven.

## Compatibiliteit en verificatie

Packaging volgt de [OpenAI pluginhandleiding](https://developers.openai.com/plugins/build/plugins)
en de [Agent Skills-specificatie](https://agentskills.io/specification).
[ChatGPT Images](https://help.openai.com/en/articles/11084440-images-in-chatgpt)
beschrijft beeldgeneratie, uploads en transparante achtergronden. Die hostfuncties bewijzen
niet dat een geïnstalleerde skill zijn gebundelde beelden aan de generator kan doorgeven.
Beide catalogi verwijzen naar dezelfde bron; catalogusregistratie bewijst geen runtimewerking.

| Host                            | Installatie / activatie                               | Beelden lezen / doorgeven | Generatie / bewerking / PNG-alpha     |
| ------------------------------- | ----------------------------------------------------- | ------------------------- | ------------------------------------- |
| ChatGPT Business (primair doel) | Niet getest                                           | Niet getest               | Niet getest                           |
| Codex                           | Niet getest                                           | Niet getest               | Niet getest                           |
| Claude                          | Niet getest; catalogus voor repositorycompatibiliteit | Niet getest               | Native beeldgeneratie niet aangenomen |

De feasibilitytest uit het issue is nog open: voer in de werkelijke ChatGPT Business-workspace
installatie, activatie, uploadgebruik, visueel laden én doorgeven van gebundelde referenties,
generatie, downloaden en vervolgwijziging uit. Controleer PNG-bestandstype, formaat en echte
alpha afzonderlijk. Deze checkout bewijst geen van deze hosteigenschappen. Bij ontbrekende
native mogelijkheden meldt de skill de beperking. Een backend vereist een afzonderlijke opdracht.

Onderstaande acceptatietaken zijn nog niet uitgevoerd; ze wachten op de
hosttest. Geef bij de generatietaken ook een grootte mee, bijvoorbeeld medium.
Herhaal de generatietaken voor elk merk door de stijlnaam te vervangen.

| Testprompt / invoer                                                         | Te beoordelen resultaat                        | Status          |
| --------------------------------------------------------------------------- | ---------------------------------------------- | --------------- |
| “Maak een open boek in de stijl van Onderwijs in.”                          | Herkenbaar concreet onderwerp; eigen merkstijl | Niet uitgevoerd |
| “Maak een school met drie ramen in de stijl van Onderwijs in.”              | Detailniveau en verhoudingen                   | Niet uitgevoerd |
| “Maak samenwerking tussen scholen in de stijl van Onderwijs in.”            | Leesbare abstracte metafoor                    | Niet uitgevoerd |
| “Maak deze microscoop als icoon in de stijl van Onderwijs in.” + foto       | Onderwerp behouden, merkstijl toegepast        | Niet uitgevoerd |
| “Maak een kalender in de stijl van Onderwijs in op een lichte achtergrond.” | Expliciete achtergrond gevolgd                 | Niet uitgevoerd |
| “Maak laptop, map en baret in de stijl van Onderwijs in.”                   | Drie afzonderlijke consistente PNG's           | Niet uitgevoerd |
| “Maak een API-venster met de letters API in de stijl van Onderwijs in.”     | Gevraagde tekst correct                        | Niet uitgevoerd |
| “Maak het vorige icoon eenvoudiger.”                                        | Bewerking behoudt merkstijl en onderwerp       | Niet uitgevoerd |
| “Maak een icoon van een boek.”                                              | Vraagt merkkeuze en grootte                    | Niet uitgevoerd |
| “Vat deze API-documentatie samen.”                                          | Skill activeert niet                           | Niet uitgevoerd |

Controleer bij ontbrekende of onvoltooide stijlbronnen ook dat de skill vóór generatie stopt.
Vervang ontbrekende referenties niet door stockbeelden of verzonnen merkregels.

## Pluginicoon

Het gedeelde logo en composer-icoon staat in `assets/plugin-icon.png`: drie overlappende
tegels met een creatieve vonk, als symbool voor de drie beschikbare stijlen. Dit is de
identiteit van de tool en geen stijlreferentie voor de gegenereerde merkiconen.
Gemaakt met ingebouwde beeldgeneratie op 16 oktober 2026.

Gebruikte prompt: drie overlappende afgeronde geometrische tegels, een vierpuntige creatieve
vonk op de voorste tegel, donkere contouren, oranje accent, witte en lichtgrijze achterste
tegels; compact en leesbaar op klein formaat, zonder tekst, op een transparante achtergrond.
