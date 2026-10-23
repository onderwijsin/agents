# Module 13 — Maak je eigen huisdier

Alleen laden na de ontgrendeling in het [curriculum](curriculum.md). Deze module is
optioneel en telt apart van de twaalf gewone modules.

## Begeleiding

1. Onthul bij starten: “Je krijgt een eigen bewegend huisdier in ChatGPT. Dat hoeft
   geen dier te zijn. De afdeling heeft ook een plant met managementambities gezien.”
   Leg kort uit dat jullie het samen ontwerpen en daarna maken en activeren.
   De medewerker kan op elk moment stoppen of afzien van de bonus.
2. Gebruik het bestaande profiel en de [karaktervragen](huisdier-karakter.md).
   Stel hooguit twee vragen tegelijk; maak er een gesprek van. Bewaar antwoorden
   en hervatstap compact volgens [voortgang](progress.md).
3. Stel één karakter voor: naam, vorm, twee karaktertrekken, één eigenaardigheid en
   een korte visuele beschrijving. Leg met twee concrete aanknopingspunten uit
   waarom het past. Vraag wat de medewerker wil aanpassen. Het voorstel is klaar
   wanneer die de richting bevestigt; eigen ideeën gaan voor het voorstel.
4. Controleer de beschikbare **Work Pets / create-pet**-skill, beeldgeneratie en
   Pets-tools, plus toestemming volgens het [medewerkersbeleid](organization-policy.md).
   Een zichtbare tool geeft geen beleidsmatige toestemming. Gebruik alleen het
   creatieve ontwerp, zonder dossiers, foto's of informatie over collega's.
   Ontbreekt een toegestane creatieroute, bewaar het ontwerp en registreer de
   bonus als `unavailable` met reden; de twaalf modules blijven afgerond.
5. Volg de actuele **create-pet**-skill inclusief haar gebundelde scripts,
   animatievoorbeelden, Library-opslag en validatie. Geef haar het bevestigde
   karakter, stijl en de wens om het resultaat te activeren mee. Toon de medewerker
   de bewegende preview en verwerk eventuele aanpassingen. Houd de technische
   productie achter de schermen; geef korte updates omdat dit enkele minuten kan duren.
6. Na geslaagde validatie van de definitieve animatie: `prepare_pet_upload`,
   `create_pet`, daarna `select_pet`. Volg de actuele toolcontracten voor upload
   en herstel. Controleer dat `active_pet_id` het nieuwe stabiele ID is en zoek dat
   ID via `list_pets` met paginering terug. Dit is het installeren en activeren;
   alleen een afbeelding genereren is daarvoor onvoldoende.

## Hervatten en afronden

Bewaar het stabiele `pet_id` zodra creatie is bevestigd. Is alleen activering
mislukt, activeer bij hervatten dat bestaande huisdier. Controleer bij een onzekere
creatie eerst de bestaande huisdieren; maak geen duplicaat. Bestaande huisdieren
blijven behouden; publiceer of deel het nieuwe huisdier niet automatisch.

Afronding: het karakter is door de medewerker bevestigd, de bewegende preview is
bekeken, het huisdier is aangemaakt én de actieve selectie is via tools bevestigd.
Bewaar het ID en de verificatie. Sluit kort af met de naam en één passende droge
opmerking; presenteer de bonus niet als een nieuwe werkverplichting.
