# Trainees in onderwijs — herbruikbare secties en patronen

Lees altijd ook de [algemene stijl](trainees-in-onderwijs.md). Deze patronen
bepalen de opmaak van een aanwezig blok, niet welke blokken of hoeveel items een
mail moet bevatten. De inhoud, volgorde en hoeveelheid secties tussen header en
footer zijn vrij. De templates uit de algemene gids zijn uitvoeringsreferenties;
voorbeeldpersonen, tekst en evenementen zijn geen verplichte inhoud.

## Agenda-items

TIO-AGENDA-01: gebruik bij agenda-items een tweekolomsblok per evenement:
links een datumvlak, rechts eventtitel met daaronder datum en locatie.
Een sectiekop zoals “Op de agenda” past bij een agendablok, maar is geen
verplichte rubriek in elke mail. Een inleidende alinea is optioneel.

| Onderdeel      | Stijl en inhoud                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Columns        | `gap=25`, `widths=13,87`, padding boven/onder 12; mobiele stapeling volgt de Loops-standaard.                                              |
| Beide kolommen | `verticalAlignment=middle`.                                                                                                                |
| Datumvlak      | Paragraph, `fontSize=27`, `blockColor=#f7dd00`, `blockBorderRadius=8`, padding alle zijden 8, `align=center`.                              |
| Dagnummer      | Strong, `textColor=#33465e`, twee cijfers `01`–`31`, overeenkomstig de eventdatum.                                                         |
| Rechterkolom   | `paddingTop=8`, `paddingBottom=8`.                                                                                                         |
| Eventtitel     | Paragraph, Strong en Underline, `textColor=#3d285b`; volledige titel binnen één Link. Deze titelaccentkleur is specifiek voor dit patroon. |
| Ondertitel     | Paragraph, `fontSize=12`, Em, datum en locatie; bijvoorbeeld “25 november — Utrecht”, met jaar waar nodig om ambiguïteit te voorkomen.     |

TIO-AGENDA-02: de hele eventtitel linkt naar de bijbehorende event- of aanmeldpagina,
met verplichte UTM's voor eigen domeinen. Dagnummer, ondertitel en bestemming
moeten hetzelfde evenement beschrijven. Maak geen datum op uit een oud template.
Geen lege paragrafen tussen titel en ondertitel of tussen opeenvolgende items;
de itempadding verzorgt de afstand. Er geldt geen Onderwijs in-limiet van 1–5 items.

## Opsomming met illustratieve iconen

TIO-LIJST-01: ieder item heeft twee kolommen: goedgekeurde icoonafbeelding links,
titel en toelichting rechts. Gebruik de witte icoonbeelden uit de algemene gids,
geen emoji of inline Icon als vervanging. De lijst kan informatie, stappen of
keuzes presenteren; de voorbeeldkop “Goed om te weten” is niet verplicht.

| Onderdeel        | Verplichte stijl                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| Columns per item | `gap=12`, `widths=22,78`, `stackOnMobile=false`, padding boven/onder 8.                         |
| Icoon Image      | `width=88`, `borderRadius=12`, `borderWidth=1`, `borderColor=#c7e6ee`; betekenisvolle alttekst. |
| Rechterkolom     | `verticalAlignment=middle`, `paddingRight=8`.                                                   |
| Titel            | Paragraph, Strong, `textColor=#33465e`, 15 px uit het theme.                                    |
| Toelichting      | Paragraph, `fontSize=12`, Text `textColor=#33465e`.                                             |

TIO-LIJST-02: geen lege paragraaf tussen titel en toelichting of tussen
lijstitems. De kolompadding regelt de afstand. Een link op het icoon is alleen
nodig als er een bijbehorende bestemming is; vul geen willekeurige expertise-URL
uit het template in. Een gekoppeld icoon krijgt de echte bestemming en UTM's.
Er zijn geen vaste aantallen of algemene tekenlimieten voor deze lijst.

## Uitgelicht interview met quote

TIO-INTERVIEW-01: plaats het interview in de standaard lichtblauwe sectie.
Volg binnen dit patroon: vette H1 → één lege paragraaf → introductie met een
verifieerbare interviewlink → één lege paragraaf → interviewbutton → quote/portretblok.
Titel, teaser, citaat, naam en functie zijn variabel; de quote blijft exact en
hoort bij de genoemde persoon. Wijzig geen citaat om het aan de vorm aan te passen.

TIO-INTERVIEW-02: het quote/portretblok is Columns met twee ColumnItems:
quote, naam en functie links; portret rechts. Laat `gap`, `widths` en mobiele
stapeling op de Loops-standaard zoals in het patroon; forceer geen agenda- of
icoonkolomverhouding op dit blok.

| Onderdeel        | Verplichte stijl                                                                 |
| ---------------- | -------------------------------------------------------------------------------- |
| Linkerkolom      | `verticalAlignment=middle`.                                                      |
| Citaat           | Paragraph, `fontSize=20`, Em.                                                    |
| Spacer na citaat | Precies één lege Paragraph met `fontSize=18`.                                    |
| Naam             | Paragraph met Strong, 15 px en kleur uit theme.                                  |
| Functie          | Paragraph, 15 px en kleur uit theme.                                             |
| Portret          | Image, `width=266`, `borderRadius=12`; alttekst identificeert de juiste persoon. |

Geen extra lege paragraaf tussen naam en functie. De interviewbutton gebruikt
de algemene gele buttonstijl met radius 8. Introductielink en button wijzen naar
hetzelfde interview met consistente UTM's. Het portret hoeft geen extra link te
krijgen om dit patroon te laten voldoen; indien gekoppeld, controleer de bestemming.

## Afsluiting met teambeeld

TIO-TEAM-01: gebruik waar passend deze volgorde in de laatste inhoudssectie of
een aparte afsluitsectie. Beide varianten zijn toegestaan; de algemene sectiestijl
geldt. De groet mag formeler of informeler bij de doelgroep passen.

1. Groet: “Dat was hem voor nu! Je hoort snel weer van ons,”.
2. Nieuwe Paragraph met “Het team van Trainees in onderwijs”, Strong volgens het teampatroon.
3. Eén lege paragraaf.
4. Teamcomponent `cmsdcq1lo00wq0jy76ak7khky` (`Team`).
5. Eén lege paragraaf.
6. Paragraph met Em: “Roos, Laurens, Sasha, Wolf en Sanne.”.

TIO-TEAM-02: de componentwrapper heeft `paddingTop=4`, `paddingBottom=4`.
De afbeelding is 232 px breed, met alt “Het team van Trainees in onderwijs”,
ongerond (radius 0 of niet ingesteld) volgens TIO-RADIUS-01 en bestemming `https://traineesinonderwijs.nl/over-ons/ons-team`
met UTM's. Behoud componentidentiteit, personen en metadata. Pas de namen alleen
aan bij bevestigde teaminformatie; raad geen actuele bezetting. Dit kleine
teambeeld hoeft niet naar volle sectiebreedte te worden vergroot.

Het teambeeld wordt binnen een lichtblauwe sectie getoond; alleen de vaste
logo/social-footer staat erbuiten. De groet is inhoudelijk optioneel, de footer
is altijd verplicht. Na de afsluitsectie één lege paragraaf en dan de footer.

## Gesprek met het programmateam

TIO-AFSPRAAK-01: bied waar inhoudelijk passend een gesprek aan vanuit de vraag
van de ontvanger, met een concrete CTA zoals “Plan een gesprek in”. Gebruik een
standaard lichtblauwe sectie, een vette kop, korte uitleg, één lege paragraaf vóór
de gele button en de algemene buttonstijl met radius 8. Gesprek en groet mogen
samen in één sectie staan of over twee secties verdeeld worden.

Gebruik de geverifieerde SavvyCal-ingang `https://meetings.traineesinonderwijs.nl`
of een voor de doelgroep bevestigde route daaronder. De specifieke route
`/orientatiegesprek-tweedegraads` is uitsluitend passend voor het tweedegraads
oriëntatiegesprek. Een andere doelgroep krijgt geen geraden route; bevestig de
bestemming of gebruik de algemene ingang. Bewaar bestaande boekingsparameters
en voeg de verplichte UTM's toe. De CTA is een link; de reviewer boekt geen afspraak.

## Link- en componentcorrecties

Lees de [gedeelde UTM-regels](linkregels.md), ook voor header, teambeeld en logo.
Verwijder of overschrijf geen referrer-, event- of personalisatieparameter om
tracking toe te voegen. Een query zonder hostname is geen geldige website-URL.
Corrigeer een gedeelde componentweergave alleen met een veilige mailgebonden
wijziging; wijzig nooit het gedeelde component zelf. Kan een host die correctie
niet uitvoeren, rapporteer een concrete handmatige actie in plaats van succes.
