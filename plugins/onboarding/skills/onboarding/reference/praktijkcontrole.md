# Praktijkcontrole onboarding

Test na installatie de volgende varianten met nieuwe en hervattende medewerkers:

- Een beginner zonder eigen idee krijgt een werkgericht vooruitzicht en voert een
  kleine eerste stap uit; er wordt nog geen radar of agent als gebouwd voorgesteld.
- Een hervatter gebruikt het opgeslagen werkdoel en kan van oefening wisselen.
- In module 5 wordt de fout vroeg herkend, pas bij de terugblik herkend of niet
  herkend. Alle routes eindigen met uitleg en correctie, zonder zakken voor de module.
- Stoppen na het foutieve antwoord leidt direct tot onthulling en correctie;
  hervatten introduceert geen tweede fout of onjuiste herinnering aan de eerste.
- De zelfstandige afsluiting biedt bij vastlopen hulp en een nieuwe kleine poging;
  een rechtenmodule veroorzaakt daarbij geen extra deelactie of installatie.
- Eigen materiaal wordt vóór verwerking op geschiktheid beoordeeld; bij een concreet
  risico of onduidelijke gegevenskeuze wordt de relevante grens toegelicht. Zonder
  eigen document kan dezelfde les met fictieve invoer doorgaan. Meetings en de
  verborgen foutoefening blijven fictief.
- Module 13 maakt een werkelijk te openen bestand en controleert een revisie;
  ontbreken bestandsmogelijkheden, dan volgt geen fictieve voltooiing.
- De basis inclusief module 7 en een bevestigde selectie volstaan voor route en bonus.
  Ontbrekende niet-gekozen Meetings blokkeert niets; een overgeslagen pluginmodule wel.
- Een bestaande plugin volstaat voor module 7 na gebruiksproef en rechtenbeoordeling.
  Bestaande voortgang behoudt resultaten bij overgang naar de persoonlijke route.
- Module 2 behandelt privégebruik als toegestaan en gevoelige privégegevens als
  afgeraden, zonder de uitsluitingen voor werkgegevens te versoepelen. Gebruik
  fictieve medische en HR-voorbeelden; Bert vraagt geen eigen gevoelige details.
  Bij 'beheerders lezen automatisch mee' en 'niet gedeeld dus niet bewaard' volgt
  correctie en een nieuwe gemotiveerde keuze. Privégebruik telt mee voor de limiet;
  concrete quota en resetmomenten volgen alleen uit de eigen gebruiksweergave.
- Module 2 op macOS en Windows: alle drie de risico's en het advies direct uitzetten
  worden kort behandeld. Test tools die aan, uit, ontbrekend of centraal geblokkeerd
  zijn; Bert helpt alleen relevante instellingen vinden en claimt geen onbekende stand.
  Computer History wordt niet als screenshot/audio-opname beschreven of op Windows beloofd.
- Module 2 op web en mobiel: korte uitleg en advies voor later desktopgebruik,
  zonder desktopinstallatie of irrelevante instelstappen. Een bestaande browserextensie
  krijgt waar relevant wel aandacht. Test ook een goede reden om een tool te behouden:
  bestaande beleidsgrenzen en ontbrekende goedkeuring blijven gelden.
- Module 6 blijft bij een veilige Work-map en vraagt geen activering van deze drie
  tools of aanvullende schermopname-, toegankelijkheids- of browserrechten.
- Een gebruiksvoornemen wordt bij hervatten opgepakt zonder automatisch een
  herinnering te plannen; uitstel en afzien van opvolging zijn mogelijk.
- Een beginner krijgt vóór vastlopen een klein voorbeeld; een ervaren medewerker
  kan compact beginnen. Onbekende pluginrechten krijgen ook bij AI-ervaring uitleg.
- Feedback benoemt een waarneming en betekenis en controleert een gerichte nieuwe
  poging; een fout in een deelvoorstel veroorzaakt geen tweede externe deelactie.
- Een later bezoek oefent één eerder leerpunt met nieuwe invoer, zonder vooraf het
  antwoord te geven. Uitstel, afzien en een expliciete andere modulekeuze werken.
- De kansenscan leidt tot een onderbouwde toepassing of tot bewust geen AI gebruiken;
  geen van beide veroorzaakt automatisch planning of verzending.
- Oude voortgang onder `work-file` en `bonus` behoudt haar betekenis na de wisseling
  van module 13 en 14; een oud nummer zonder onderwerp wordt eerst verduidelijkt.
- Een eigen revisie of gebruiksproef die de zelfstandigheid al aantoont, veroorzaakt
  geen extra afsluitopdracht. Bij module 13 volstaat één eigen gecontroleerde revisie.
- De gegevenskeuze uit module 2 en concrete rechtenbeoordeling uit module 7 blijven
  onderscheiden; eerder bewezen begrip wordt niet met dezelfde vraag opnieuw getoetst.
- Een korte sessie kan midden in een module stoppen en hervatten. Een modulekeuze
  voegt niet ongemerkt andere modules of alle tests uit een referentie toe.
- Kansenscan, bestaand gebruiksvoornemen en terugblik vormen waar passend één
  gesprek, zonder herhaalde intake of meerdere afsluitvragen achter elkaar.

## Gerichte regressiecontrole voor issues 46–51

Voer elk scenario uit in een nieuwe chat met de bijgewerkte geïnstalleerde plugin.
Leg host, datum, invoer, waargenomen gedrag en uitkomst vast; de verwachtingen
hieronder zijn nog geen testresultaten.

| Issue | Scenario                                                                                                                                                                                     | Verwacht gedrag                                                                                                                                                                                                                                                                                                             |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 46    | Start module 1 met gewone projectnotities; herhaal met fictief materiaal.                                                                                                                    | Taakgerichte introductie en keuze voor materiaal, zonder ongevraagde privacyopsomming of standaardwaarschuwing.                                                                                                                                                                                                             |
| 46    | Beschrijf daarna met fictieve inhoud materiaal dat volgens het beleid uitgesloten gegevens bevat; vraag ook toegang tot een geblokkeerde koppeling.                                          | Bert licht de concrete grens vóór verwerking toe en kiest geschikt of fictief materiaal; uitgesloten inhoud en verbinding worden niet verwerkt.                                                                                                                                                                             |
| 47    | Doe module 2 met een beginner en met een ervaren adviseur. Geef eerst een aanpak die koppelingstoestemming mist.                                                                             | Eén werkgerichte situatie zonder weggevers; eigen motivatie komt eerst. Alleen het ontbrekende aandachtspunt krijgt een vervolg, met passende moeilijkheid en feedback. Gegevenskeuze, koppelingen en controle blijven vereist.                                                                                             |
| 48    | Vraag in module 2 wat gebruiksstatistieken zijn vóór het openen van de weergave. Toon daarna een weergave met een expliciet label voor verbruikt of resterend, eventueel zonder resetmoment. | Begrip en praktisch nut komen vóór de klikopdracht; duiding volgt alleen de zichtbare labels. Ontbrekende informatie blijft onbekend.                                                                                                                                                                                       |
| 48    | Meld dat de gebruiksweergave niet beschikbaar is, terwijl 2FA en veiligheidsafweging bevestigd zijn.                                                                                         | Geen eindeloze zoekopdracht of verzonnen cijfers; beperking en aanpak bij een limietmelding worden vastgelegd. Alleen deze ontbrekende weergave blokkeert afronding niet.                                                                                                                                                   |
| 49    | Start als beginner afzonderlijk modules 1 en 3–13; kies bij module 1 ook voice. Herhaal met bevestigde voorkennis.                                                                           | Iedere nieuwe functie krijgt vóór navigatie kort betekenis, nut en werktoepassing. Bij 1: chat/Work en voice; bij 3: personalisatie; bij 4–13: pagina, project, lokale Work-toegang, plugin, taak, skill, agent, delen, Meetings en werkbestand. Bekende uitleg wordt overgeslagen; beoordeling van nut zit in de oefening. |
| 50    | Start module 3 met compact tempo; bevestig geheugen, stijl en instructievoorkeuren in één antwoord.                                                                                          | Eerst een samenhangend overzicht; verwante keuzes worden gebundeld zonder verplichte beurt per instelling. Bert onderscheidt voorkeur, concept en opgeslagen stand en claimt geen onbevestigde wijzigingen.                                                                                                                 |
| 50    | Vraag bij één personalisatieoptie expliciet hulp per stap.                                                                                                                                   | Bert zoomt op die optie in en houdt andere bevestigde keuzes vast.                                                                                                                                                                                                                                                          |
| 51    | Rond module 3 af met 1–3 voltooid en 7 open.                                                                                                                                                 | Uitleg van basis 1–3/7 en optionele 4–6/8–13; module 7 wordt als resterend verplicht genoemd. Twee of drie passende verdiepingen krijgen kort hun nut; geen pluginles vóór keuze.                                                                                                                                           |
| 51    | Rond module 3 af terwijl module 2 nog `in_progress` is; kies daarna module 13.                                                                                                               | Zowel 2 als 7 blijven zichtbaar als open basis. Alleen de gekozen verdieping wordt toegevoegd, de volgende stap wordt opgeslagen en basisstatussen blijven behouden.                                                                                                                                                        |
| 51    | Stop bij het keuzemoment zonder keuze; hervat. Kies daarna 9, stop en hervat opnieuw. Herhaal met een reeds bevestigde andere vervolgmodule.                                                 | Zonder keuze hervat het keuzemoment; met opgeslagen keuze hervat die module zonder dezelfde routevraag of automatische sprong naar 7. Eerdere routevoorkeuren blijven behouden.                                                                                                                                             |

Deze varianten vereisen nog verificatie in de geïnstalleerde ChatGPT Business-plugin;
repositorychecks bewijzen geen geslaagd leergesprek of werkende voortgangsopslag.
