# Nieuwsbrief stijl review

Controleer Loops-campagnes, workflowmails en transactionele drafts van Onderwijs in
en Trainees in onderwijs
op stijl en opmaak. Na toestemming kan de skill een draft aanpassen en iedere
opgeslagen wijziging opnieuw controleren. Alleen testpreviews mogen worden
verstuurd; de gebruiker verstuurt de campagne zelf in de Loops-webinterface.

Alle Loops-interactie verloopt uitsluitend via MCP. De agent opent of bedient
geen browser, ook niet voor visuele controle, blokduplicatie of als MCP faalt.
Webinterface-links zijn uitsluitend bedoeld om zelf te openen. Ontbrekende
MCP-functionaliteit blokkeert de afhankelijke handeling. Deze instructie is geen
technische toolblokkade; daarvoor zijn hostrechten nodig.

## Installatie en gebruik

Installeer dit hele pluginpakket via de repositorymarketplace en installeer ook de
[Loops-plugin](https://chatgpt.com/plugins/plugin_asdk_app_6a76060a3cbc81919eaaca7e37e830fe).
Verbind Loops met een account dat toegang heeft tot het gewenste team. Apprechten,
authenticatie en plugininstallatie zijn afzonderlijke voorwaarden.

Start bijvoorbeeld met `@nieuwsbrief stijl review Controleer mijn mailing`.
De exacte vermeldingsnaam hangt af van de host. Geef teamspace en mailingnaam of
link. Bij een concrete link of ID bepaalt de skill het team via gerichte
leeslookups binnen de twee ondersteunde, toegankelijke teams. Alleen als dit niet
eenduidig lukt, vraagt hij om team/toegang of een gecorrigeerde link. Bij een
expliciet gekozen team blijft de lookup beperkt tot dat team. Bekijk de
verbeteracties en geef desgewenst toestemming om ze toe te passen. Na correcties
volgt een nieuwe review en het aanbod om een testpreview te sturen naar een door
jou opgegeven adres. Controleer de laatste versie altijd zelf in Loops.

## Verplichte controles

Subject en previewtekst worden alleen op aanwezigheid en lengte gecontroleerd via
[de lengteregels](skills/nieuwsbrief-style-review/reference/subject-en-previewtekst.md). Inhoudelijke kwaliteit,
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
[Onderwijs in](skills/nieuwsbrief-style-review/reference/onderwijs-in.md) en
[Trainees in onderwijs](skills/nieuwsbrief-style-review/reference/trainees-in-onderwijs.md).
De [gedeelde linkregels](skills/nieuwsbrief-style-review/reference/linkregels.md) verplichten `utm_source=newsletter`,
`utm_medium=loops` en een mailingidentificerende `utm_campaign` op links naar
traineesinonderwijs.nl, onderwijsin.nl en onderwijsloket.com, inclusief subdomeinen.
`utm_content` is optioneel en identificeert een blok of tekst. De [algemene Onderwijs in-gids](skills/nieuwsbrief-style-review/reference/onderwijs-in.md) geldt voor alle
mailtypen: secties, theme-tokens, typografie, radiusregels, patronen en de vaste
footer. Buttons hebben radius 4; secties en gewone afgeronde beelden/vlakken 8.
De [deep dive-gids](skills/nieuwsbrief-style-review/reference/onderwijs-in-deep-dive-template.md) voegt alleen voor
dat format structuur, rubrieken, aantallen en de statische deep dive-gesprekssectie
toe. Andere formats hebben vrije passende inhoudelijke indeling.
De [Trainees in onderwijs-gids](skills/nieuwsbrief-style-review/reference/trainees-in-onderwijs.md) legt de
verplichte header, footer en algemene stijl vast, met vrije inhoudsindeling.
De [Trainees-patronen](skills/nieuwsbrief-style-review/reference/trainees-in-onderwijs-patronen.md) gelden alleen
voor aanwezige agenda-, icoon-, interview- en afsluitblokken. Beide teamgidsen
vereisen betekenisvolle alttekst bij iedere afbeelding.

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
activatie en runtimegedrag zijn nog niet volledig geverifieerd. In issue #19 is
bevestigd dat ChatGPT de skill laadt, maar plugin-rootreferenties niet kan lezen.
Versie 0.1.3 verplaatst de zeven Markdown-referenties naar de skillmap om dit te
testen; de regels blijven gelijk. Afbeeldingen blijven op pluginroot en hun
toegankelijkheid via de skillreader blijft afzonderlijk ongeverifieerd.
Zie het [experimentlog](https://github.com/onderwijsin/agents/blob/main/docs/nieuwsbrief-resource-experiment.md) voor de
openstaande sync- en leestest. Installeer het hele pluginpakket.

## Acceptatie vóór ingebruikname

Alle onderstaande runtimechecks staan nog open. Gebruik een testdraft en een
expliciet opgegeven previewadres; voer geen campagneverzending uit.

| Scenario                                                   | Te verifiëren resultaat                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------ |
| Installeren in ChatGPT en Codex                            | Plugin vindbaar; reviewskill en alle zeven referenties laden.      |
| Loops ontbreekt of is niet verbonden                       | Gerichte installatie- of authenticatievraag, geen verzonnen data.  |
| Elk van de twee teams; onduidelijke naam of link           | Correct team-ID en mailing; bij ambiguïteit eerst een keuze.       |
| Niet vastgelegde huisstijl                                 | Geen huisstijlgoedkeuring of verzonnen teamregels.                 |
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

[Algemene stijl](skills/nieuwsbrief-style-review/reference/onderwijs-in.md) geldt voor alle mails; de
[deep dive-gids](skills/nieuwsbrief-style-review/reference/onderwijs-in-deep-dive-template.md) wordt alleen voor dat
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

| Scenario                                   | Verwacht resultaat                                                                                             |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Deep dive                                  | Algemene regels én vaste deep dive-indeling toepassen.                                                         |
| Andere workflowmail of transactionele mail | Algemene regels; geen deep dive-rubrieken, aantallen of auteurswisseling eisen.                                |
| Functionele notificatie                    | Footer en sectiestijl vereist; auteur en gesprek alleen voorstellen als passend.                               |
| Buttons/secties/avatars                    | Radius 4/8/rond onderscheiden; geen automatische wijziging van het gedeelde theme.                             |
| Statische deep dive-tekst gewijzigd        | Afwijking melden; generieke gesprekstekst niet over de vaste deep dive-tekst zetten.                           |
| Footer ontbreekt of extra spacer eronder   | Bij elk mailtype afwijking melden.                                                                             |
| Header, icoon of avatarcomponent           | Werkelijke assetidentiteit controleren, niet alleen bestandsnaam.                                              |
| Mobiele weergave en afmeldafstand          | Alleen inhoud en stijlen via MCP controleren; geen visuele verificatie uitvoeren of aan de gebruiker opdragen. |

Acceptatie voor de subject- en previewcontrole (nog te testen in de host):

| Scenario                                    | Verwacht resultaat                                                         |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| Subject of preview ontbreekt                | Ontbrekend veld melden, geen inhoud bedenken.                              |
| Subject/preview te lang                     | Tekentelling en lengteadvies; geen inhoudelijke herschrijving.             |
| Inhoud is vaag of clickbait, lengte voldoet | Geen inhoudelijke beoordeling door deze reviewer; dat hoort bij Redacteur. |
| Reviewer zonder Redacteur geïnstalleerd     | Stijl- en lengtecontrole blijft zelfstandig bruikbaar.                     |

## Trainees in onderwijs — acceptatie

De templates, het theme en de header-, logo- en teamcomponenten zijn via MCP
gelezen. De workflowvoorbeelden zijn uitsluitend als leesreferentie gebruikt;
er zijn geen Loops-objecten gewijzigd. De meegeleverde header en iconen zijn
als referentieassets onderzocht. Dit bewijst geen geïnstalleerde hostactivatie
of volledige visuele weergave. De volgende hostchecks staan nog open:

| Scenario                                 | Verwacht resultaat                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| Vrije sectievolgorde of andere aantallen | Geen deep dive-structuur of onnodige secties afdwingen.                                    |
| Header                                   | Juiste component en beeld, padding top/bottom, alttekst; nul witregels vóór eerste sectie. |
| Secties en footer                        | Lichtblauw, 40/30 padding, radius 12; één spacer tussen secties, nul na footer.            |
| Buttons en datumvlakken                  | Radius 8; overige afgeronde content en beelden radius 12.                                  |
| Icoonlijst                               | Witte goedgekeurde icoonbeelden, rand 1 px #c7e6ee, vaste kolommen en itempadding.         |
| Interviewquote                           | Quote links en portret rechts; typegroottes, spacer en brongetrouw citaat behouden.        |
| Teamgroet en gesprek niet relevant       | Geen harde verplichting; vaste footer blijft wel vereist.                                  |
| Ontbrekende alt in beide teams           | Concrete ontbrekende beschrijving melden of veilig mailgebonden corrigeren.                |
| Eigen subdomein met referrer/variabele   | UTM toevoegen met behoud van overige query en personalisatie.                              |
| Gedeeld component met afwijking          | Alleen mailgebonden correctie; anders handmatige actie melden.                             |

## Team bepalen uit een object-ID

De Loops-connector vereist bij toegang tot meerdere teams een `team`-parameter.
Campagne- en email-message-responses leveren geen `teamId`; een lookup zonder
team wordt dan geweigerd. Daarom bepaalt de skill bij een bekende object-ID en
onbekend team het team uit gerichte GET-lookups binnen de twee ondersteunde teams.
Deze route is met een echte campagne gecontroleerd: 404 in het ene team en een
succesvolle lookup in het andere. De email-message-response bevestigde het
campagneverband. Er zijn geen wijzigingen of previews uitgevoerd.

Nog te testen als geïnstalleerde skill:

| Situatie                                 | Verwacht gedrag                                                       |
| ---------------------------------------- | --------------------------------------------------------------------- |
| Link/ID, team onbekend, één succes       | Team overnemen zonder teamvraag; parentstatus controleren.            |
| Team expliciet gekozen, object ontbreekt | Geen automatische overstap naar een ander team.                       |
| Auth-/netwerkfout bij een kandidaatteam  | Niet als 404 behandelen; discoverybeperking melden en gericht vragen. |
| Geen of meerdere treffers                | Geen gok; link/ID of team laten verduidelijken.                       |
| Alleen mailnaam                          | Team vragen vóór zoeken op naam.                                      |
| Los email-message-ID                     | Team en parentverband verifiëren vóór statuscheck en review.          |

## Acceptatie van uitsluitend MCP

Voer deze scenario’s uit in iedere beoogde host; deze criteria zijn nog niet
als hosttest uitgevoerd.

| Scenario                                             | Verwacht resultaat                                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Sectie dupliceren met wijzigingstoestemming          | Alleen via MCP gelezen LMX lokaal bewerken en via MCP opslaan; status en zelfreview blijven verplicht. |
| MCP ondersteunt de benodigde bewerking niet of faalt | Afhankelijke handeling stopt met concrete beperking; geen browser, CLI, SDK of directe HTTP-fallback.  |
| Gekoppelde skill vraagt een browserrender            | Geen browser of visuele verificatie; de review blijft gebaseerd op inhoud en stijlen via MCP.          |
| Mailinglink aangeleverd of bij oplevering gedeeld    | ID via MCP verwerken; link als tekst teruggeven zonder een tab te openen.                              |

## Standaard reviewrapport

Iedere afgeronde review gebruikt het [vaste rapportformat](skills/nieuwsbrief-style-review/reference/reviewrapport.md):
drie tabellen voor concrete verbeteracties, gebruikersverificatie en voorgestelde
UTM-URL’s. Daarna volgen aanvullend advies, de feitelijke Guardian-uitkomst,
wijzigingsstatus en benodigde keuzes. Hercontroles gebruiken hetzelfde format
met resterende bevindingen en een samenvatting van toegepaste acties.

Aanvullende hostacceptatie, nog uit te voeren:

| Scenario                                       | Verwacht resultaat                                                                                               |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Afwijkingen, onzekerheden en ontbrekende UTM’s | Precies drie tabellen met de voorgeschreven kolommen; bestaande regelcodes; volledige voorgestelde URL’s.        |
| Geen afwijkingen of geen UTM-aanpassingen      | Alle drie tabellen blijven aanwezig met expliciete lege-resultaattekst; geen overbodige wijzigingsvraag.         |
| Guardian niet beschikbaar                      | Guardian expliciet niet uitgevoerd melden; geen verzonnen goedkeuring of browserfallback.                        |
| Hercontrole na mutatie                         | Toegepaste acties samengevat, drie tabellen met resterende punten, feitelijke wijzigingsstatus en previewaanbod. |
| Statuscheck weigert review                     | Alleen de blokkade melden, geen ingevuld reviewrapport of suggestie dat controle is uitgevoerd.                  |

Aanvullende rapportcriteria (nog in de host te testen):

- Geen verzoek om visuele verificatie en geen bevinding over een ontbrekende render.
- Acties zijn begrijpelijk zonder kennis van de referentiedocumenten; regelcodes
  blijven in de regelkolom, interne bestandsverwijzingen ontbreken in de uitleg.
- De naam Loops Guardian linkt altijd naar de Guardian-documentatie.
