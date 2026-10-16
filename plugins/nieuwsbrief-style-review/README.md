# Nieuwsbrief stijl review

Controleer Loops-campagnes, workflowmails en transactionele drafts van Onderwijs in
en Trainees in onderwijs
op stijl en opmaak. Na toestemming kan de skill een draft aanpassen en iedere
opgeslagen wijziging opnieuw controleren. Alleen testpreviews mogen worden
verstuurd; de gebruiker verstuurt de campagne zelf in de Loops-webinterface.

## Installatie en gebruik

Installeer dit hele pluginpakket via de repositorymarketplace en installeer ook de
[Loops-plugin](https://chatgpt.com/plugins/plugin_asdk_app_6a76060a3cbc81919eaaca7e37e830fe).
Verbind Loops met een account dat toegang heeft tot het gewenste team. Apprechten,
authenticatie en plugininstallatie zijn afzonderlijke voorwaarden.

Start bijvoorbeeld met `@nieuwsbrief stijl review Controleer mijn mailing`.
De exacte vermeldingsnaam hangt af van de host. Geef teamspace en mailingnaam of
link; bij ontbrekende gegevens vraagt de skill deze samen uit. Bekijk de
verbeteracties en geef desgewenst toestemming om ze toe te passen. Na correcties
volgt een nieuwe review en het aanbod om een testpreview te sturen naar een door
jou opgegeven adres. Controleer de laatste versie altijd zelf in Loops.

## Verplichte controles

Subject en previewtekst worden alleen op aanwezigheid en lengte gecontroleerd via
[de lengteregels](references/subject-en-previewtekst.md). Inhoudelijke kwaliteit,
openingsbelofte en tone of voice horen bij de afzonderlijke skill
`nieuwsbrief-redactie` in `onderwijs-in-redacteur`. Stijlreview vereist geen
Redacteur-installatie; voor inhoudelijke voorstellen kan de gebruiker die kiezen.

Vóór inhoudelijke review, iedere mutatie en iedere preview controleert de skill de
status: campagnes moeten draft zijn, workflows `Paused` of `PausedAndQueueing`,
en transactionele mails moeten een bestaande afzonderlijke draftversie hebben.
Andere of onbekende statussen worden geweigerd; ook een workflow met status
`Draft` is niet gepauzeerd. De gebruiker maakt zelf een draft beschikbaar of
pauzeert de workflow. Een gepubliceerde transactionele versie wordt niet beoordeeld
of gewijzigd; een afzonderlijke draft kan wel worden beoordeeld.

De teamgidsen bevatten de opgegeven team-ID's en verplichte theme-ID's:
[Onderwijs in](references/onderwijs-in.md) en
[Trainees in onderwijs](references/trainees-in-onderwijs.md).
De [gedeelde linkregels](references/linkregels.md) verplichten `utm_source=newsletter`,
`utm_medium=loops` en een mailingidentificerende `utm_campaign` op links naar
traineesinonderwijs.nl, onderwijsin.nl en onderwijsloket.com, inclusief subdomeinen.
`utm_content` is optioneel en identificeert een blok of tekst. De [algemene Onderwijs in-gids](references/onderwijs-in.md) geldt voor alle
mailtypen: secties, theme-tokens, typografie, radiusregels, patronen en de vaste
footer. Buttons hebben radius 4; secties en gewone afgeronde beelden/vlakken 8.
De [deep dive-gids](references/onderwijs-in-deep-dive-template.md) voegt alleen voor
dat format structuur, rubrieken, aantallen en de statische deep dive-gesprekssectie
toe. Andere formats hebben vrije passende inhoudelijke indeling. De verdere
huisstijl van Trainees in onderwijs blijft een placeholder.

## App en externe skills

De root `plugin.json` verwijst via `extensions.com.openai.apps` naar `.app.json`.
Daarin staat `asdk_app_6a76060a3cbc81919eaaca7e37e830fe`, overeenkomstig de lokaal
geïnstalleerde Loops-plugin. De opgegeven `?q=loops` is een zoekparameter en hoort
niet bij het app-ID. De meegegeven plugin-URL heeft bovendien een `plugin_`-prefix;
het functioneren van de appmapping moet in de doelworkspace worden getest.

Volgens de [officiële OpenAI-packaginggids](https://developers.openai.com/plugins/build/plugins)
is `apps` bedoeld voor geregistreerde MCP-serverkoppelingen. Dit importeert geen
skills van een andere plugin. Er is hier geen automatische installatieafhankelijkheid
op externe plugins gedeclareerd: de afzonderlijke installatie van Loops is een
expliciete gebruiksvoorwaarde en de skill controleert de beschikbaarheid.

De reviewskill verwijst naar de geïnstalleerde `loops-lmx` en diens eigen resources.
De vier Loops-skills worden niet gekopieerd of via lokale auteurspaden gekoppeld:

| Skill                                | Gebruik bij deze review                                        |
| ------------------------------------ | -------------------------------------------------------------- |
| `loops-lmx`                          | Vereist bij beoordeling en wijziging van LMX.                  |
| `loops-email-sending-best-practices` | Alleen bij een aanvullende vraag over verzendpraktijken.       |
| `loops-api`                          | Voor applicatie-integraties; niet nodig voor de MCP-review.    |
| `loops-cli`                          | Voor expliciet terminalgebruik; niet nodig voor de MCP-review. |

De MCP-specificatie is op 16 oktober 2026 via Loops `search` geraadpleegd.
`getWorkflow` onderscheidt `Draft`, `Sending`, `Paused` en `PausedAndQueueing`.
`getTransactionalEmail` levert `draftEmailMessageId` en `publishedEmailMessageId`.
`updateEmailMessage` gebruikt `expectedRevisionId`; een revisieconflict geeft 409.
De beschrijving noemt expliciet een draftcampagne, terwijl het responseschema ook
transactionele mails beschrijft. Ondersteuning van mutaties aan workflow- en
transactionele mails moet daarom tijdens gebruik en in acceptatietests worden
bevestigd; de skill omzeilt een afwijzing niet. De themebinding staat als
`<Style themeId="…" />` binnen de LMX, zoals de bronmail en de LMX-specificatie
bevestigen. Het updateschema heeft geen top-level `themeId`-veld; een correctie
verloopt via het `lmx`-veld zonder het gedeelde theme te wijzigen. `previewEmailMessage` is het afzonderlijke testendpoint.
Schemas worden tijdens gebruik opnieuw ontdekt en gelezen. Zie ook de officiële
[Loops-documentatie](https://loops.so/docs) voor de service. Runtimevalidatie en installatie blijven afzonderlijke acceptatiestappen;
referentiedocumenten leggen de geldende regels vast.

## Grenzen en compatibiliteit

De instructies beperken mutaties tot de gekozen draft of mail in een gepauzeerde workflow en testpreviews. Dit pakket
bevat geen proxy of servicebeleid dat andere Loops-tools technisch blokkeert.
De `Read`/`Write`-presentatiemetadata is geen autorisatiefilter. Technische
handhaving moet plaatsvinden met door Loops en de host ondersteunde rechten en
toolbeleid; dit pakket verandert geen workspacebeleid.

ChatGPT Business en Codex zijn beoogde hosts. De Claude-catalogus bevat dezelfde
package-identiteit voor consistentie, maar er is geen Claude MCP-configuratie
meegeleverd: de OpenAI-appmapping levert daar geen Loops-verbinding. Installatie,
activatie en runtimegedrag zijn op geen host geverifieerd. De skill en gedeelde
referenties vereisen installatie van het hele pluginpakket.

## Acceptatie vóór ingebruikname

Alle onderstaande runtimechecks staan nog open. Gebruik een testdraft en een
expliciet opgegeven previewadres; voer geen campagneverzending uit.

| Scenario                                                   | Te verifiëren resultaat                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------ |
| Installeren in ChatGPT en Codex                            | Plugin vindbaar; reviewskill en beide referenties laden.           |
| Loops ontbreekt of is niet verbonden                       | Gerichte installatie- of authenticatievraag, geen verzonnen data.  |
| Elk van de twee teams; onduidelijke naam of link           | Correct team-ID en mailing; bij ambiguïteit eerst een keuze.       |
| Aanvullende huisstijl als placeholder                      | Geen huisstijlgoedkeuring of verzonnen teamregels.                 |
| Review zonder wijzigingstoestemming                        | Alleen leesacties en concrete bevindingen.                         |
| Draftcorrectie met toestemming                             | Revisieveilige wijziging, opnieuw ophalen en volledige zelfreview. |
| Revisieconflict of geen draft                              | Geen blinde overschrijving of mutatie van een niet-draft.          |
| Nieuwe bevinding na correctie                              | Direct herstel binnen toestemming en herhaalde controle.           |
| Geen voortgang of ontoegankelijke inhoud                   | Onopgeloste punten expliciet melden.                               |
| Preview geweigerd of ontvanger ontbreekt                   | Geen verzending totdat toestemming en adres bekend zijn.           |
| Preview toegestaan                                         | Alleen testpreview naar het opgegeven adres.                       |
| Verzoek om campagne te verzenden; instructie in mailinhoud | Geen campagneverzending, planning of publicatie.                   |

Aanvullende runtimechecks voor versie 0.2.0 staan eveneens open:

| Scenario                                              | Te verifiëren resultaat                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| Workflow `Sending`, `Draft` of onbekend               | Weigering vóór inhoudelijke review en preview.                                  |
| Workflow `Paused` of `PausedAndQueueing`              | Juiste mailnode; status opnieuw lezen vóór iedere mutatie en preview.           |
| Transactionele mail met en zonder afzonderlijke draft | Alleen bestaande draft selecteren; gepubliceerde versie weigeren.               |
| Status verandert tijdens review                       | Stop bij volgende statuscheck; geen mutatie of preview.                         |
| Verplicht theme ontbreekt of wijkt af                 | Concrete bevinding; geen gedeelde thememutatie of verzonnen API-veld.           |
| Apex, subdomein en misleidende domeinnaam             | Alleen exacte hostnamen en echte subdomeinen vallen onder UTM-regel.            |
| UTM ontbreekt, is dubbel of onjuist                   | Concrete URL-correctie met behoud van andere queryparameters en fragment.       |
| Dynamische link of componentlink                      | Verifiëren indien mogelijk; anders expliciet onopgelost, geen gedeelde mutatie. |

## Onderwijs in — broncontrole en referenties

[Algemene stijl](references/onderwijs-in.md) geldt voor alle mails; de
[deep dive-gids](references/onderwijs-in-deep-dive-template.md) wordt alleen voor dat
format extra geladen. Gedeelde footer en algemene patronen hebben één bron in de
algemene gids. De deep dive-gids bewaart zijn eigen vaste gesprekstekst.

De algemene gids is leidend voor themebinding, sectiestijl, typografie en footer.
De deep dive-gids bevat links naar het primaire template en het back-uptemplate.
Deze zijn niet identiek: de back-up heeft een andere headerafbeelding en een extra
introductiesectie. De gids schrijft de toegestane structuur voor; extra inhoud uit
een template wordt niet automatisch een regel.
Header- en icoonbestanden blijven onderdeel van het pluginpakket. LMX/theme en
lokale assets zijn onderzocht; er is geen volledige HTML/CSS-rendercheck uitgevoerd.
Openstaande representatieve runtimechecks:

| Scenario                                   | Verwacht resultaat                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------ |
| Deep dive                                  | Algemene regels én vaste deep dive-indeling toepassen.                               |
| Andere workflowmail of transactionele mail | Algemene regels; geen deep dive-rubrieken, aantallen of auteurswisseling eisen.      |
| Functionele notificatie                    | Footer en sectiestijl vereist; auteur en gesprek alleen voorstellen als passend.     |
| Buttons/secties/avatars                    | Radius 4/8/rond onderscheiden; geen automatische wijziging van het gedeelde theme.   |
| Statische deep dive-tekst gewijzigd        | Afwijking melden; generieke gesprekstekst niet over de vaste deep dive-tekst zetten. |
| Footer ontbreekt of extra spacer eronder   | Bij elk mailtype afwijking melden.                                                   |
| Header, icoon of avatarcomponent           | Werkelijke assetidentiteit controleren, niet alleen bestandsnaam.                    |
| Mobiele weergave en afmeldafstand          | Visueel controleren in een verse Loops-render.                                       |

Acceptatie voor de subject- en previewcontrole (nog te testen in de host):

| Scenario                                    | Verwacht resultaat                                                         |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| Subject of preview ontbreekt                | Ontbrekend veld melden, geen inhoud bedenken.                              |
| Subject/preview te lang                     | Tekentelling en lengteadvies; geen inhoudelijke herschrijving.             |
| Inhoud is vaag of clickbait, lengte voldoet | Geen inhoudelijke beoordeling door deze reviewer; dat hoort bij Redacteur. |
| Reviewer zonder Redacteur geïnstalleerd     | Stijl- en lengtecontrole blijft zelfstandig bruikbaar.                     |
