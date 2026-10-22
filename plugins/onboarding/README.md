# Onboarding

De Bert-bot van de IT-afdeling begeleidt Nederlandstalige medewerkers van Stichting Onderwijs in door
ChatGPT Business. De plugin bevat één centrale skill, twaalf interactieve modules,
drie volledige agentdefinities, drie skillvoorbeelden voor module 9, een ondersteunende
webcontent-skilldefinitie en fictieve oefenbestanden.
De zichtbare naam is **Onboarding**; de Bert-bot van de IT-afdeling is de fictieve AI-persona.

## Installeren en gebruiken

Installeer het hele pakket via de bestaande Onderwijs in-marketplace. Kies in een
nieuwe zakelijke chat via `@` de plugin **Onboarding** en vraag bijvoorbeeld:

- Ik wil beginnen met de onboarding.
- Hervat mijn onboarding.
- Toon mijn voortgang.
- Ik wil module 6 doen.

De exacte mention wordt via de selector bepaald; `@onboarding` is de beoogde aanroep,
nog geen bewezen installatieresultaat. De skillbeschrijving richt zich op onboarding;
algemene IT-vragen en losse schrijfopdrachten horen buiten deze begeleiding.
Er is geen providerafhankelijk expliciet-only frontmatterveld toegevoegd: de huidige
repository valideert portable metadata, en activatie wordt met gerichte triggers begrensd.

De catalogi registreren het pakket als `AVAILABLE` voor gecontroleerde tests. Er zijn
geen workspace-instellingen gewijzigd. `INSTALLED_BY_DEFAULT` volgt pas na review,
hosttests en afzonderlijk goedgekeurde uitrol; de specificatie vraagt nog geen uitrol.
Synchroniseer de beoordeelde GitHub-revisie via de bestaande beheerroute en test in
een nieuwe chat. Catalogusmetadata installeert geen gekoppelde accounts of rechten.

## Leerroute en resources

[Curriculum](skills/onboarding/reference/curriculum.md) bevat de module-ID's en links.
Modules 1–3 vormen de basis. De overige modules zijn afzonderlijk te kiezen.
De lessen omvatten voice, echte personalisatie-instellingen, een Space-pagina,
projectinstructies en documentupload, lokale bestandsbewerking, plugins, geplande taken,
agent- en skillcreatie, delen en Meetings.

Alle runtimebestanden staan binnen [de skill](skills/onboarding/SKILL.md).
De referenties zijn skill-private en hebben geen gegenereerde duplicaten nodig.
Voorbeelden worden als lesmateriaal aangeboden, niet als automatisch geïnstalleerde
agents of extra geactiveerde skills. De plugin bundelt geen MCP-server of appmapping.

## Vereisten en rechten

Doelomgeving: ChatGPT Business met Work en native Pages. Volledige functionaliteit
vereist privépagina's maken, lezen, terugvinden en bijwerken. Beschikbare native
creators en Scheduled zijn nodig voor de bijbehorende bouwmodules. Sommige stappen
worden via de interface uitgevoerd en daarna door de medewerker bevestigd.

Module 6 vereist de desktopapp, een nieuw lokaal Work-project en een gekoppelde
veilige oefenmap. De geslaagde uitkomst is een gewijzigd bestand op schijf. Uploaden
en downloaden via de webinterface geldt daar niet als vervanging. Module 5 oefent
juist het uploaden van documenten naar de context van een ChatGPT Project.

Meetings wordt voor macOS aanbevolen. Windows-ondersteuning volgt volgens de opdracht
later; een datum en actuele opname-interface zijn niet onafhankelijk geverifieerd.
Controleer de werkelijke beschikbaarheid. Een leesconnector voor meetingnotities
bewijst geen opnamefunctie. Onbeschikbare modules krijgen een afzonderlijke status.

Slack, Outlook Calendar, Onderwijsloket en Onderwijs in zijn optionele verbindingen,
met eigen authenticatie en rechten. Andere koppelingen zijn in principe toegestaan
binnen het beleid. Outlook Email kent een specifieke uitzondering voor zakelijke
mailboxen; Pipedrive verschilt per team en SharePoint is nog niet toegestaan zonder
geteste afscherming. De beleidsreferentie bevat de voorwaarden. Geplande maatregelen
zijn geen bewijs dat een koppeling gebruiksklaar is.
Notion is geen runtimevereiste. De plugin stelt geen betaalde uitbreiding van usage voor.
Het [ChatGPT-beleid voor medewerkers](skills/onboarding/reference/organization-policy.md)
bevat de algemene afspraken voor zakelijk ChatGPT-gebruik. De afzonderlijke
[uitvoeringsregels](skills/onboarding/reference/onboarding-rules.md) sturen de plugin:
oefenmateriaal, toolgebruik en bevestiging van acties. Die zijn geen medewerkersbeleid.
De algemene afspraken moeten vóór uitrol door de beleidsbeheerder worden gecontroleerd;
ze vormen geen complete privacybeoordeling.

## Voortgang en privacy

Eén eigen private pagina, **Mijn onboarding met de Bert-bot van de IT-afdeling**, bewaart rol, teams, voorkeuren,
huidige stap en module-uitkomsten. Geen transcript, brondocumenten of inhoud uit
gekoppelde diensten wordt in de voortgang opgenomen. Eigenaar en deelrechten worden
gecontroleerd; zichtbaarheid alleen bewijst geen eigenaarschap.

De [opslaginstructies](skills/onboarding/reference/progress.md) vereisen verse reads,
guarded edits, behoud van andere resultaten en readback. Bij een onzekere actie wordt
eerst gecontroleerd wat is opgeslagen. Bij ontbrekende tools of limieten krijgt de
medewerker een handmatig checkpoint; automatische hervatting wordt dan niet beloofd.
De host bewaart en autoriseert de gegevens. Er is geen externe voortgangsopslag.

## Verificatie en beperkingen

De native Pages-proef in deze ontwikkelchat kon een private pagina aanmaken, lezen,
bijwerken en opnieuw terugvinden. Een edit met een verouderde hash werd afgewezen.
Dit bewijst geen installatie, activatie of hervatting door de plugin in een nieuwe chat.

ChatGPT Business is de beoogde host. De Claude-catalogusvermelding houdt de
repositorycatalogi consistent; Claude en Codex hebben geen geclaimde volledige
runtimecompatibiliteit met deze ChatGPT-leerroute. Er is geen onnodige Claude-overlay.
Gebruik op andere hosts moet ontbrekende native functies als beperking rapporteren.
Vóór uitrol zijn een echte installatie, resource-loadingtest, cross-chat-hervattest,
isolatietest met twee accounts en pilot met drie rolprofielen nodig.

## Officiële bronnen en compatibiliteit

Geraadpleegd op 22 oktober 2026. Deze productcontracten zijn veranderlijk;
workspacebeschikbaarheid moet naast documentatie afzonderlijk worden getest.

- [Portable pluginpackaging en marketplacebeleid](https://developers.openai.com/plugins/build/plugins).
- [OpenAI skills en resourcegrenzen](https://developers.openai.com/plugins/build/skills).
- [Presentatiemetadata en PNG-iconen](https://developers.openai.com/plugins/deploy/submission).
- [ChatGPT Work](https://learn.chatgpt.com/docs/get-started-with-work).
- [ChatGPT en lokale projecten](https://learn.chatgpt.com/docs/projects).
- [Personalisatie](https://learn.chatgpt.com/docs/prompting#personalize-chatgpt).
- [Space en rechten](https://learn.chatgpt.com/docs/enterprise/chatgpt-space).
- [Geplande taken](https://learn.chatgpt.com/docs/automations).
- [Voice](https://learn.chatgpt.com/docs/features/voice).
- [Usage](https://learn.chatgpt.com/docs/pricing#where-can-i-see-my-current-usage-limits).

De agentvoorbeelden volgen de beschikbare toolbeschrijvingen. Onderwijsloket
`list_articles` ondersteunt `-date_updated`; dat is een wijzigingsdatum en wordt
niet als publicatiedatum voorgesteld. Concrete tools worden bij uitvoering opnieuw gecontroleerd.

## Icoon

[Het pluginicoon](assets/plugin-icon.png) is met de ingebouwde ImageGen-tool gemaakt
en visueel gecontroleerd. Hetzelfde vierkante PNG wordt voor logo en composer gebruikt.
Het is een origineel fictief personage, geen medewerkersportret.

Prompt voor hergebruik met de huidige naam (het bestaande icoon blijft ongewijzigd):

```text
Create one square 1024x1024 PNG plugin icon for Onboarding, a Dutch internal ChatGPT
onboarding assistant whose persona is de Bert-bot van de IT-afdeling. Friendly fictional IT colleague,
subtly dry humorous expression, simple round glasses and a laptop with a small
welcoming arrow, no text or lettering. Clean bold flat illustration, professional
yet approachable, warm coral red accent with dark navy and cream, clear large
silhouette and readable at 32px, generous margin, opaque light cream background.
Original fictional character, no real person's likeness. This is a production plugin listing icon.
```

## Herkomst en beheer van het medewerkersbeleid

De algemene AI-afspraken zijn bijgewerkt op basis van
[Beleid AI-gebruik](https://app.notion.com/p/401b66e1be6980a3a490ff33ccff5d05),
geraadpleegd op 22 oktober 2026. De geraadpleegde versie is laatst gewijzigd op
22 oktober 2026 om 13:46 UTC. De hoofdtekst was volledig beschikbaar, inclusief
de connectortabel, e-mailuitzondering en nog onbepaalde bewaartermijn. De ingesloten
categoriedatabase is niet afzonderlijk opgehaald; de referentie volgt de expliciete
categorieën uit de hoofdtekst. De gebruiker heeft dit document als gewijzigd beleid
aangewezen; Notion toont geen native verificatiemarkering.

Dit beleid vervangt de eerdere algemene aannames en blanketverboden voor Outlook
Email en Pipedrive in deze plugin. Een nog te bouwen maskerproces, te testen
afscherming of aangekondigde mailboxmaatregel wordt niet als uitgevoerd aangemerkt.
Er is geen bewaartermijn ingevuld die niet in de bron is vastgesteld.

De aanvullende afspraken over menselijke resultaatcontrole, delen/opnemen,
inloggeheimen en uitsluitend inbegrepen usage blijven gebaseerd op de eerder
vastgelegde workspace- en onboardingopdracht. Zij zijn afzonderlijk aangeduid en
worden niet als nieuwe bepalingen uit Beleid AI-gebruik gepresenteerd.
De uitvoeringsregels voor Bert staan in een afzonderlijke referentie.

De systeembeheerder of bedrijfsvoerder bevestigt vóór uitrol de concrete
beleidsbeheerder en de uitvoering van de connectorvoorwaarden. Medewerkers hoeven
geen Notion-toegang te hebben om de gebundelde beleidsreferentie te gebruiken.

## Onderwijsloket Fact Check Agent — afhankelijkheden en Slack

De medewerker maakt eerst een persoonlijke `fact-checker` in module 9 en hergebruikt
die in de Onderwijsloket Fact Check Agent in module 10. De zelfstandige
[voorbeelddefinitie](skills/onboarding/reference/skill-feiten.md) is inhoudelijk gebaseerd
op `plugins/adviesassistent/skills/fact-checker/SKILL.md`, maar bevat de nodige werkwijze
en criteria zelf. Er worden geen runtimebestanden uit de Adviesassistent-plugin vereist
of automatisch als extra onboarding-subskill geïnstalleerd. Controleer in de agentproef
dat de juiste persoonlijke skill wordt toegepast, ook als een gelijknamige pluginskill
beschikbaar is. De agentdefinitie voegt Slack-contextselectie en antwoordvorm toe.

De gewenste handle is `@factcheck`. De aangeleverde voorbeelden noemden ook
`@factchecker`; dat is geen tweede geconfigureerde handle. De
[officiële Slack-setup](https://learn.chatgpt.com/docs/enterprise/chatgpt-slack-and-teams),
geraadpleegd op 22 oktober 2026, beschrijft de beheerde `@ChatGPT`-surface, gedeelde
verbindingen en toegangscontroles. Dat bewijst niet dat een afzonderlijke agent onder
`@factcheck` kan worden gepubliceerd. Controleer de actuele Workspace Agent-/Slack-
interface, beschikbare skillselectie en routering in de doelworkspace vóór publicatie.
Bouw geen eigen Slack-bot of API-integratie als impliciete workaround.

Er zijn geen Slack-berichten verstuurd, instellingen gewijzigd of agents gepubliceerd.
Controleer vóór publicatie de kanaalroutering, bronrechten en beschikbaarheid van de
vereiste skill in de doelworkspace.

## Contentverbeteraar — auteurschap, bronnen en planning

Het derde agentvoorbeeld richt zich op wekelijkse inhoudelijke websiteverbeteringen.
Het bevat een volledige ondersteunende webcontent-skilldefinitie en een uitvoeringsreferentie.
Deze worden aan de gemaakte agent toegevoegd; de onboarding houdt één actieve centrale skill.
De schrijver, co-auteur en expliciet aangewezen beheerder vormen verschillende selectiegronden.
Een ontbrekend auteurveld wordt geen automatisch eigenaarschapbewijs.

Op 22 oktober 2026 zijn de openbare Onderwijs in MCP-tools voor blogs en pagina's
steekproefsgewijs gelezen. Het blogoverzicht bevatte geen auteursvelden; één volledig
blogdocument bevatte `authors` met naam en profielpad, naast `updated_at` en `publish_date`.
Eén statische paginadetailweergave bevatte geen auteursvermelding. Dat bevestigt dat
lijstmetadata onvoldoende kan zijn, maar bewijst geen complete auteurdekking voor
alle websites, contenttypen of medewerkers. Er is geen persoonlijke corpusreview uitgevoerd.
Onderwijsloket MCP is een andere beschikbare bron met eigen auteursmetadata; de
gekozen connector en selectie worden bij de medewerker afzonderlijk gecontroleerd.

De ondersteunende skill verwijst naar geraadpleegde primaire richtlijnen van W3C WAI
en Google Search Central. Die geven reviewcriteria, geen automatisch inhoudelijk
feitenbewijs of garantie op ranking, conversie of toegankelijkheidsconformiteit.

De agent leest en rapporteert; er is geen websitecontent gewijzigd en geen wekelijkse
taak aangemaakt. De medewerker kiest en bevestigt de werkelijke planning afzonderlijk.
