# Onboarding

Leer de ChatGPT Business-werkplek gebruiken met de Bert-bot van de IT-afdeling.
Deze plugin begeleidt medewerkers van Stichting Onderwijs in bij hun eerste
stappen én bij het ontdekken van functies voor terugkerend werk.

Je leert door kleine opdrachten zelf uit te voeren, het resultaat te beoordelen
en ermee verder te werken. Bert stemt voorbeelden, uitleg en tempo af op je
werkzaamheden, organisatieonderdeel en ervaring met AI. Je kunt tussendoor stoppen,
later hervatten of een specifieke module kiezen.

## Beginnen

Installeer **Onboarding** via de Onderwijs in-marketplace. Open een zakelijke
ChatGPT-chat, typ `@` en kies de plugin in de selector. Vraag bijvoorbeeld:

- Ik wil beginnen met de onboarding.
- Hervat mijn onboarding.
- Toon mijn voortgang.
- Ik wil leren hoe ik een skill maak.
- Ik wil module 6 doen.

Bij de eerste onboarding vraagt Bert wat voor werk je doet, voor welk
onderdeel je werkt en hoeveel ervaring je hebt met AI. Daarna begeleidt hij je stap voor stap. Je kunt
steeds om meer uitleg, een hoger tempo of een andere oefening vragen.

De plugin begeleidt de onboarding en helpt bij problemen tijdens de oefeningen.
Voor losse werkopdrachten gebruik je een gewone chat of een passende andere plugin;
algemene IT-support loopt via de systeembeheerder.

## Wat leer je?

De onboarding bestaat uit twaalf gewone modules. De eerste drie vormen de basis;
de overige modules kun je afzonderlijk volgen.

| Module | Onderwerp                                                  |
| ------ | ---------------------------------------------------------- |
| 1      | Je eerste gesprek en gerichte vervolgvragen                |
| 2      | 2FA instellen, veilig gebruik, beleid en gebruikslimieten  |
| 3      | Geheugen, schrijfstijl en eigen aangepaste instructies     |
| 4      | Een pagina maken, bewerken en terugvinden                  |
| 5      | Een project met instructies en bestanden inrichten         |
| 6      | Een lokaal document rechtstreeks laten bewerken            |
| 7      | Een plugin installeren, gebruiken en de toegang beoordelen |
| 8      | Een taak plannen en beheren                                |
| 9      | Een eigen skill maken, testen en hergebruiken              |
| 10     | Een eigen agent bouwen en testen                           |
| 11     | Werk delen met de juiste toegang                           |
| 12     | Een fictieve bespreking vastleggen met Meetings            |

Het pakket bevat fictieve oefenbestanden, acht skillvoorbeelden en tien
agentontwerpen. Denk aan een eigen schrijfskill, bronnotities, programmaplanning,
overlegvoorbereiding, een persoonlijke factchecker of een radar voor nieuwe publicaties. Bert biedt passende keuzes
voor Onderwijs in/Projecten, Onderwijsloket en Trainees in onderwijs.
Je eigen ideeën en input staan centraal: je bepaalt welk werk je wilt verbeteren
en ontwikkelt met Bert de aanpak, instructies en tests. Afwijken van de voorbeelden
of een eigen idee combineren wordt aangemoedigd.

Elke skill en agent heeft een eigen uitgewerkt referentiebestand voor inspiratie,
begeleiding en kwaliteitsfeedback. Bert gebruikt dit materiaal achter de schermen
en toont gerichte voorbeelden als je erom vraagt of vastloopt. Je maakt, test en
verbetert een eigen resultaat; een kant-en-klare instructie overnemen is niet het leerdoel.

Bekijk het [curriculum](skills/onboarding/reference/curriculum.md), de
[agentbibliotheek](skills/onboarding/reference/agent-examples.md) en de
[skillbibliotheek](skills/onboarding/reference/skill-examples.md) voor de inhoud.

## Wat heb je nodig?

De plugin is ontworpen voor de zakelijke ChatGPT Business-workspace van Onderwijs in,
met Work en native Pages. Volledige werking in Codex of Claude wordt niet ondersteund.
Voor specifieke oefeningen gelden aanvullende vereisten:

- **Voortgang en pagina's:** toegang tot eigen private native pagina's.
- **Lokale bestanden:** de desktopapp, een lokaal Work-project en een veilige oefenmap.
- **Skills, agents, planning en delen:** toegang tot de bijbehorende functies en rechten.
- **Meetings:** een beschikbare opnamefunctie; de oefening richt zich op macOS.
- **Gegevenskoppelingen:** een toegestane verbinding en waar nodig een eigen zakelijk account.

Bert controleert wat beschikbaar is wanneer je het nodig hebt. Een ontbrekende
functie wordt als beperking vastgelegd; je kunt met andere modules verder.
Een skill uit een plugin is niet automatisch beschikbaar voor een workspace-agent.
Bij die oefening maak je de eigen skill afzonderlijk beschikbaar en test je het hergebruik.

## Veilig oefenen

Oefeningen beginnen met fictieve of publieke informatie. Bert legt bij invoeren,
verbinden, plannen, bouwen, delen en opnemen de relevante beleidsafspraak uit.
Je leert zowel de mogelijkheden als de risico's van skills, plugins en agents kennen.
Een zichtbare plugin of leesrecht betekent niet automatisch dat gegevensgebruik is toegestaan.

Het [medewerkersbeleid](skills/onboarding/reference/organization-policy.md) staat
in het pakket, met peildatum en bronverwijzingen. Notion is niet nodig voor de
onboarding en wordt niet gebruikt om beleid of voortgang op te halen.
Geblokkeerde koppelingen zijn geen oefenroute. Open beleidsvragen, zoals de
bewaartermijn voor gesprekken en lopende integratiebeoordelingen, worden als
onbeslist benoemd. De gebundelde referentie wordt door de pakketbeheerder bijgehouden.

## Voortgang bewaren

Bert bewaart je werkprofiel, leervoorkeuren, huidige stap en modulevoortgang op één
eigen private pagina: **Mijn onboarding met de Bert-bot van de IT-afdeling**.
Brondocumenten, transcripten en dossiers horen niet in die voortgang.

Bij hervatten gebruikt Bert je opgeslagen profiel en volgende stap. Als opslaan
niet lukt, krijg je een compact checkpoint om zelf te bewaren en later mee te geven.
Automatisch hervatten vereist werkende native paginaopslag.

## Onderhoud

De plugin bevat één centrale [onboardingskill](skills/onboarding/SKILL.md).
Lesmateriaal en beleidsreferenties staan binnen die skill; de plugin heeft geen
eigen MCP-server of appmapping nodig.

| Onderdeel                          | Waar pas je het aan?                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| Starten, hervatten en begeleiden   | [SKILL.md](skills/onboarding/SKILL.md)                                                     |
| Intake en leertempo                | [Profiel en leertempo](skills/onboarding/reference/learner-profile.md)                     |
| Lesvolgorde en leerdoelen          | [Curriculum](skills/onboarding/reference/curriculum.md) en de daarin gelinkte modules      |
| Algemene modulewerkwijze           | [Modulewerkwijze](skills/onboarding/reference/module-workflow.md)                          |
| Beleid en integratiestatus         | [Medewerkersbeleid](skills/onboarding/reference/organization-policy.md)                    |
| Oefenmateriaal en actiebevestiging | [Uitvoeringsregels](skills/onboarding/reference/onboarding-rules.md)                       |
| Voortgangsopslag                   | [Voortgang](skills/onboarding/reference/progress.md)                                       |
| Agent- en skillvoorbeelden         | De bibliotheken en definities onder `skills/onboarding/reference/`                         |
| Optionele verrassing               | Ontgrendeling en onderhoud via het [curriculum](skills/onboarding/reference/curriculum.md) |
| Fictieve oefenbestanden            | `skills/onboarding/assets/exercise-materials/`                                             |
| Presentatie en icoon               | [plugin.json](plugin.json) en [pluginicoon](assets/plugin-icon.png)                        |

Controleer bij beleidswijzigingen de bronnen die in de beleidsreferentie staan.
Werk de samenvatting, peildatum, betrokken modules en voorbeelden samen bij.
Houd beleidsmatige toestemming, geregistreerde instellingen en persoonlijke toegang
uit elkaar. Neem een geplande maatregel pas als beschikbaar op nadat die is bevestigd.

Gebruik [bouwbegeleiding](skills/onboarding/reference/bouwbegeleiding.md) als uitgangspunt
bij onderhoud van skill- en agentlessen. Houd eigen keuzes en passende afwijkingen
mogelijk en gebruik referenties voor kwaliteit, niet als verplichte eindoplossingen.
Houd bij leswijzigingen de uitleg, oefening en afrondingscriteria bij elkaar.
Bewaar resources binnen de skill en laad detailinformatie alleen voor de relevante
stap. Voeg voorbeelden toe aan de bibliotheken; laat Bert daaruit een kleine,
werkgerichte selectie maken.

## Controleren en distribueren

Voer vanuit de repositoryroot uit:

```sh
pnpm format
pnpm check
```

Gebruik de [releaseworkflow](https://github.com/onderwijsin/agents/blob/main/docs/releases.md) voor pluginversies en de
[marketplacedistributie](https://github.com/onderwijsin/agents/blob/main/docs/marketplace-distribution.md) voor verspreiding.
Installeer het hele pakket zodat de referenties en oefenbestanden meekomen.
Workspacebeleid, toegestane apps en persoonlijke authenticatie worden afzonderlijk beheerd.
