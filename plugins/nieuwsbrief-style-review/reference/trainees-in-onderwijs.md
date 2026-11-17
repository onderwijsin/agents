# Trainees in onderwijs — algemene mailingstijl

## Toepassing

Deze gids bepaalt de stijl van iedere Trainees in onderwijs-mail: campagnes,
workflowmails en transactionele drafts. Na de verplichte header
is de inhoudelijke indeling vrij. Secties mogen naar behoefte worden gekozen,
herordend of weggelaten. Er is geen vaste nieuwsbriefvolgorde, geen algemeen
minimumaantal verhalen en geen deep dive-structuur.

- Team-ID: `cmrtfgzcf02t20jvfse0o2m7j`.
- Verplicht theme: `cmvalvrnd0iil0jwrkc7oov1h`.
- Starttemplate: [Template om te kopiëren](https://app.loops.so/campaigns/cmvalryrk00460jx1h7p0eea3/compose).
- Tweede uitvoeringsreferentie: [back-uptemplate](https://app.loops.so/campaigns/cmvanshkm0ld40jytpwaeh5oz/compose).
- Lees bij iedere review de [gedeelde linkregels](linkregels.md).
- Lees voor gebruikte herbruikbare blokken de
  [secties en patronen](trainees-in-onderwijs-patronen.md).

Deze gids is leidend bij afwijkingen in bestaande mails of templates.
Voorbeeldinhoud, namen, citaten en aantallen uit een template zijn geen vaste
inhoudseisen. Pas alleen de patronen toe die inhoudelijk in de mail voorkomen.
Voeg geen agenda, interview of icoonlijst toe om een template na te bootsen.

## Theme, kleuren en typografie

TIO-THEME-01: bovenaan staat
`<Style themeId="cmvalvrnd0iil0jwrkc7oov1h" />`. Controleer identiteit én
effectieve toepassing. Behoud de binding; kopieer niet alleen vergelijkbare
kleuren naar losse blokken. Wijzig nooit het gedeelde theme.

TIO-TEKST-01: Montserrat met sans-serif fallback. Bodytekst: 15 px, kleur
`#33465e`, regelhoogte 150%, letterspatiëring 0. Koppen zijn vet, in dezelfde
donkerblauwe kleur. H1: 30 px/107%; H2: 24 px/133%; H3: 20 px/160%.
Gebruik gerichte Strong-nadruk en cursief voor citaten, functies en datum/locatie.
Compacte ondersteunende beschrijvingen mogen 12 px zijn. Dwing geen oranje
kopaccenten of andere Onderwijs in-typografie af.

TIO-KNOP-01: buttontekst is altijd vetgedrukt, voor zowel primaire als secundaire
buttons. Controleer de effectieve tekstopmaak, inclusief lokale overrides.

De primaire button geel `#f7dd00`, tekst `#33465e`, 12 px,
vet volgens themeformaat `buttonTextFormat=1`; binnenruimte X=12/Y=8 px,
rand 1 px in `#f7dd00`, radius **8 px** volgens het theme.
Behoud deze buttonradius; voeg geen override naar 12 toe.
Gebruik geen inline Strong-tag binnen een Button. Links en buttons hebben echte
bestemmingen; een templatevoorbeeld als `https://google.com` is geen passende CTA.

TIO-RADIUS-01: secties, callouts en afbeeldingen gebruiken radius **12 px**.
Buttons en datumvlakken zijn vaste uitzonderingen met radius **8 px**.
De teamfoto in component `Team` blijft ongerond (radius **0 px**);
een ontbrekende radius is bij deze afbeelding correct. Het ongeronde buitenste mailvlak met `borderRadius=0` is
geen sectie en hoeft geen radius 12 te krijgen. De lokale radiusregels zijn
leidend boven afwijkende waarden in het theme. Bewaar proporties van logo's
en componentbeelden; pas een ontbrekende afbeeldingsradius zo nodig alleen
mailgebonden toe, zonder een gedeeld component te wijzigen.

## Secties en witruimte

TIO-SECTIE-01: plaats alle inhoud in `Section`-containers met
`blockColor=#eef8fa`, `blockBorderRadius=12` en padding
boven/rechts/onder/links **40/30/40/30 px**.
Alleen de header staat als functioneel element buiten deze containers.
Metadata en visuele spacers zijn geen losse contentsecties.

TIO-RUIMTE-01: tussen twee inhoudssecties staat EXACT één lege paragraaf.
Gebruik `<Paragraph></Paragraph>` of één equivalente paragraaf met één `Br`.
XML-newlines tellen niet als visuele witregel. **Tussen header en eerste sectie staat
geen lege paragraaf**: de headerpadding verzorgt de afstand.

Gebruik tussen gewone tekstalinea's en na een losse hoofdheading één lege
paragraaf om leesgroepen te scheiden. Binnen compacte titel/beschrijving-paren
of opeenvolgende items met eigen top/bottom-padding staan geen extra lege blokken.
De specifieke interviewspacer staat in de patroongids.

## Verplichte header

TIO-HEADER-01: iedere mail begint na de Style-metadata met component
`cmvamz7dm09iz0jypt5ztegl7` (`Header`). Het beeld is
[Header.png](../assets/traineesinonderwijs/Header.png) uit dit pakket.
De websitebestemming is `https://traineesinonderwijs.nl`, aangevuld met
mailinggebonden UTM's; `utm_content=header` mag blijven staan.

De componentwrapper heeft `paddingTop=12` en `paddingBottom=20`.
De uitgeklapte Image heeft eveneens `paddingTop=12`, `paddingBottom=20`,
`width=580`, `borderRadius=12`. Behoud deze expliciete componentinstellingen;
voeg geen lege paragraaf toe om extra afstand te maken. Controleer de afzonderlijke
stijlwaarden; tel de paddinglagen niet op tot een vermeende zichtbare afstand.

Gebruik een beschrijvende alttekst, bijvoorbeeld “Trainees in onderwijs”.
De gehoste afbeelding kan een andere bestandsnaam hebben; verifieer identiteit
via beeldvergelijking of betrouwbare mapping. Een andere URL is geen bewijs van
een andere afbeelding. Een los Image met hetzelfde beeld vervangt de verplichte
componentbinding niet zonder expliciete gebruikersinstructie.

## Afbeeldingen en iconen

TIO-BEELD-01: iedere Image heeft een betekenisvolle niet-lege `alt`, ook
binnen componenten: header, teambeeld, logo, icoon en interviewfoto.
Beschrijf kort wat relevant is voor de ontvanger; raad geen onbekende identiteit.
Een bestandsnaam of “afbeelding” is onvoldoende. Bij onbekende inhoud: markeer
de ontbrekende beschrijving voor bevestiging.

TIO-BEELD-02: behoud beeldverhouding en pas TIO-RADIUS-01 toe: radius 12
voor gewone afbeeldingen, ongerond voor de teamfoto. Benut bij voorkeur de volle
beschikbare breedte van de eigen container of kolom, met responsief gedrag.
Dit is een voorkeur, geen opdracht om een icoon, portret, teambeeld of logo
naar mailbreedte op te rekken. De patroonbreedten gaan voor; vermijd vervorming
en onscherp vergroten. Een pixelbreedte alleen bewijst geen goede mobiele weergave.

TIO-ICOON-01: gebruik voor illustratieve iconen goedgekeurde PNG-afbeeldingen
uit `assets/traineesinonderwijs/icons/`, met witte achtergrond en gecentreerd icoon.
Voorbeelden: [AI.png](../assets/traineesinonderwijs/icons/AI.png) en
[Netwerk.png](../assets/traineesinonderwijs/icons/Netwerk.png).
Image-stijl: radius 12, randbreedte 1 px, randkleur `#c7e6ee`.
Gebruik geen inline SVG of een willekeurige glyph ter vervanging.

## Groet en gesprek

TIO-GROET-01: gebruik waar inhoudelijk passend het afsluitpatroon met groet,
teamnaam, teamcomponent en namen uit de patroongids. De formulering mag bij de
doelgroep passen; forceer deze warme ondertekening niet op een functionele
notificatie.

TIO-GESPREK-01: bied waar passend een afspraak met het programmateam aan via
een geverifieerde SavvyCal-route. Gebruik daarvoor het gesprekspatroon uit de
patroongids, met de juiste route voor doelgroep/traject en verplichte UTM's.
Een ontbrekend gesprekblok is geen fout wanneer het niet bij de mail past.
Verzin geen kalender-ID, deelnemers, beschikbaarheid of persoonlijke boekingslink.

## Theme-tokens

Deze tabel legt de basisconfiguratie van het verplichte theme vast. De lokale
regels hierboven bepalen de toepassing volgens TIO-RADIUS-01, inclusief de
uitzonderingen voor buttons, datumvlakken en de teamfoto.
Wijzig het gedeelde theme niet om een mail te herstellen.
Lege kleurwaarden betekenen niet ingesteld; verzin hiervoor geen kleur.
Afmetingen en letterspatiëring zijn px; regelhoogten percentages.
`buttonTextFormat=1` is de Loops-formatwaarde voor de buttontekst.

| Theme-attribuut         | Waarde         |
| ----------------------- | -------------- |
| `backgroundColor`       | niet ingesteld |
| `backgroundXPadding`    | `10`           |
| `backgroundYPadding`    | `24`           |
| `bodyColor`             | niet ingesteld |
| `bodyFontCategory`      | `sans-serif`   |
| `bodyFontFamily`        | `Montserrat`   |
| `bodyXPadding`          | `0`            |
| `bodyYPadding`          | `0`            |
| `borderColor`           | niet ingesteld |
| `borderRadius`          | `0`            |
| `borderWidth`           | `0`            |
| `buttonBodyColor`       | `#f7dd00`      |
| `buttonBodyXPadding`    | `12`           |
| `buttonBodyYPadding`    | `8`            |
| `buttonBorderColor`     | `#f7dd00`      |
| `buttonBorderRadius`    | `8`            |
| `buttonBorderWidth`     | `1`            |
| `buttonTextColor`       | `#33465e`      |
| `buttonTextFontSize`    | `12`           |
| `buttonTextFormat`      | `1`            |
| `dividerBorderWidth`    | `1`            |
| `dividerColor`          | `#e4e4e7`      |
| `heading1Color`         | `#33465e`      |
| `heading1FontSize`      | `30`           |
| `heading1LetterSpacing` | `0`            |
| `heading1LineHeight`    | `107`          |
| `heading2Color`         | `#33465e`      |
| `heading2FontSize`      | `24`           |
| `heading2LetterSpacing` | `0`            |
| `heading2LineHeight`    | `133`          |
| `heading3Color`         | `#33465e`      |
| `heading3FontSize`      | `20`           |
| `heading3LetterSpacing` | `0`            |
| `heading3LineHeight`    | `160`          |
| `textBaseColor`         | `#33465e`      |
| `textBaseFontSize`      | `15`           |
| `textBaseLetterSpacing` | `0`            |
| `textBaseLineHeight`    | `150`          |
| `textLinkColor`         | niet ingesteld |

## Controlewijze

Controleer de algemene regels op iedere mail en de patroonregels alleen op de
aanwezige blokken. Onderscheid harde stijlfouten van voorkeuren (zoals beeldbreedte)
en contextafhankelijke voorstellen (zoals een gesprekblok). Markeer ontbrekende
assetidentiteit, alttekstinformatie of onzekere linkbestemming als open punt.
Templatevultekst is geen bron voor nieuwe feiten, namen of evenementen.

Controleer opmaak via inhoud, stijlen en uitgeklapte componenten.
Pas geen Onderwijs in-deep dive-aantallen, kopkleuren, volgorde of groet toe.
Subject en preview worden door stijlreview alleen op aanwezigheid en lengte getoetst.
