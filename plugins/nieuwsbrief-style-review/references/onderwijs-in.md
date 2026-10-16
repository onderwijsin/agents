# Onderwijs in — algemene mailingstijl

## Toepassing

Deze gids bepaalt de algemene stijl voor elke Onderwijs in-mail: campagnes,
workflowmails, notificaties en transactionele drafts. De inhoudelijke indeling
past bij het doel van de mail. Voor deep dive-nieuwsbrieven geldt aanvullend
[deep dive-template](onderwijs-in-deep-dive-template.md): vaste sectievolgorde,
aantallen, rubriekkoppen en specifieke lokale stijlen.

- Team-ID: `cm4qwmvrg002s22b4zkdokrrw`.
- Theme-ID: `cmjer5zv2000r013qkdqyneg5` (Onderwijs in Theme).
- Pas de [gedeelde linkregels](linkregels.md) op alle mailtypen toe.

Deze gids en de toepasselijke templategids zijn leidend bij de review. Een
bestaande mail of Loops-template met afwijkende opmaak verandert de regels niet.

## Verplichte basis

OI-THEME-01: begin met `<Style themeId="cmjer5zv2000r013qkdqyneg5" />`.
Behoud de binding, niet alleen gelijkende losse stijlen. `themeId` staat in
`Style` binnen het `lmx`-veld, niet als top-level email-updateveld.
Corrigeer mailgebonden en revisieveilig; wijzig nooit het gedeelde theme.
Lokale overrides zijn toegestaan waar deze algemene gids of de templategids ze
voorschrijft. Ontbrekende metadata blijft niet verifieerbaar.

OI-SECTIE-01: plaats inhoud in witte `Section`-containers met
`blockColor=#ffffff`, `blockBorderRadius=8`, padding boven/rechts/onder/links
`32/24/32/24` px. Headerafbeelding en vaste footer staan buiten die containers;
metadata en visuele spacers zijn geen losse inhoud. Aantal, volgorde en inhoud
van secties volgen het maildoel, tenzij een templategids ze vastlegt.

OI-RUIMTE-01: tussen secties EXACT één visueel lege paragraaf; ook vóór de
footer en, bij een headerafbeelding, tussen header en eerste sectie.
Gebruik `<Paragraph></Paragraph>`; één equivalente
`<Paragraph><Br /></Paragraph>` telt ook als één spacer. XML-newlines tellen niet.
Geen extra spacers onder de footer. Gebruik tussen gewone tekstalinea's en na
een losse hoofdheading één lege paragraaf waar dit de leesgroepen scheidt;
voeg geen witregels toe binnen compacte titel/beschrijving-paren of aaneengesloten
itemlijsten die hun eigen top/bottom-padding hebben.

OI-RADIUS-01: standaardradius voor afgeronde secties, vlakken, gewone afbeeldingen
en tegels is **8 px**. Buttons gebruiken **4 px**, overeenkomstig het theme.
Behoud die buttonradius; maak geen override naar 8.
Een ongeronde mailachtergrond, transparante header of logo krijgt geen kunstmatige
afronding. De bestaande ronde teamavatarcomponenten blijven als apart
portretpatroon behouden (68 px breed/radius 68); vervorm geen gedeeld component.

OI-KOP-01: alle headings zijn vet (`Strong` of aantoonbaar equivalente opmaak).
Basiskleur `#3d285b`; benadruk waar inhoudelijk zinvol een betekenisvol deel in
`#ff9255`. Houd het accent selectief, niet de hele kop oranje. Dit is een
contextafhankelijke voorkeur: een vaste rubriekkop mag volledig paars blijven,
zoals de drie gekleurde deep dive-rubriekheaders. H1/H2/H3-grootte volgt het theme;
forceer geen nieuw kopniveau of extra koppen om een voorbeeld na te bouwen.

OI-TEKST-01: Poppins met sans-serif fallback, body 14 px, 150% regelhoogte,
letterspatiëring 0 en kleur `#111826`. Gebruik `#676767` voor ondersteunende
beschrijvingen; compacte toelichting, functie of ondertitel mag 12 px zijn.
Houd primaire tekst leesbaar en maak niet alle bodytekst klein of grijs.
Cursief markeert bijvoorbeeld een functie of datum/locatie; vet markeert een naam
of gerichte nadruk, geen volledige lange bodytekst.

OI-KNOP-01: buttontekst is altijd vetgedrukt, voor zowel primaire als secundaire
buttons. Controleer de effectieve tekstopmaak, inclusief lokale overrides.

De primaire CTA: achtergrond `#ff9255`, tekst `#ffffff`, 16 px,
binnenruimte X=16/Y=12 px, radius 4, randbreedte 0. Gebruik beknopte actiegerichte
tekst. Een secundaire tekstachtige button kan wit met oranje tekst zijn, zoals
het verhaalpatroon in de deep dive-gids; dat is geen tweede algemene CTA-eis.
Gebruik doelbewuste linkbestemmingen en de gedeelde UTM-regels.

## Alttekst bij afbeeldingen

OI-ALT-01: iedere afbeelding heeft een betekenisvolle, niet-lege `alt`, ook in
componenten: header, logo, avatar, verhaal- en expertisebeeld. Beschrijf wat voor
de ontvanger relevant is; een bestandsnaam of alleen “afbeelding” voldoet niet.
Controleer de afgebeelde persoon of inhoud voordat je de beschrijving invult;
raad geen identiteit. Een ontbrekende beschrijving blijft een open punt als de
beeldinhoud niet verifieerbaar is. Behoud XML-escaping en dynamische variabelen.
Wijzig componentinhoud alleen veilig op mailniveau, nooit het gedeelde component.

## Herbruikbare patronen

OI-HEADER-01: als een illustratieve header past, gebruik een goedgekeurde
transparante PNG uit `assets/onderwijsin/header/` binnen dit pluginpakket.
Volledige contentbreedte (`width=580`), intacte beeldverhouding, geen witte
kaart of toegevoegde radius. Header is algemeen optioneel; bij deep dives verplicht.
De bestanden [1.png](../assets/onderwijsin/header/1.png) tot en met
[6.png](../assets/onderwijsin/header/6.png) vormen de poppetjes/blokken-serie.
Een andere gehoste bestandsnaam vraagt beeldvergelijking of betrouwbare mapping.

OI-ICOON-01: gebruik voor het illustratieve icoonpatroon waar passend een PNG uit
`assets/onderwijsin/icons/`, met zachte lichtpaarse achtergrond `#ebe9ee` en radius 8. Voorbeelden: [Boeken.png](../assets/onderwijsin/icons/Boeken.png) en
[Code laptop.png](../assets/onderwijsin/icons/Code%20laptop.png).
Het veelgebruikte compacte patroon is links icoon, rechts titel/beschrijving:
`Columns gap=12 widths=22,78 stackOnMobile=false paddingTop=12 paddingBottom=12`,
`Image width=87.08 borderRadius=8`, beschrijving 12 px grijs.
Centreer de rechterkolom verticaal met `paddingRight=8`, tenzij de
templategids een specifieke uitlijning en padding voorschrijft. Gebruik het patroon alleen
als het inhoudelijk past; het is geen verplichte lijst of kolomindeling voor elke mail.

OI-AUTEUR-01: schrijf waar relevant namens één specifiek teamlid. Dit is geen
vereiste voor bijvoorbeeld systeemnotificaties of transactionele bevestigingen;
voeg geen verzonnen persoon toe. Bij persoonlijke aanhef: H1 met
`Hoi {contact.firstName},`, de variabele vet oranje en fallback
`contactPropertiesFallbacks.firstName="daar"` buiten de LMX-string.
Bij een ondertekening: groet, lege paragraaf, auteursblok. `Columns gap=20
widths=16,84`: links bestaand Loops-avatarcomponent (wrapperpadding boven/onder 4,
Image breedte 68, ronde radius 68); rechts naam vet en functie 12 px cursief.
Plaats boven de naam één lege paragraaf. Ontdek het juiste component
in dit team; controleer persoon, alttekst en profielbestemming. Raad geen functie.
Auteurswisseling per editie is alleen verplicht waar de templategids dat bepaalt.

OI-GESPREK-01: voeg als laatste inhoudssectie vóór de footer “Ga met ons in gesprek”
toe wanneer contact of samenwerking inhoudelijk bij de mail past en toevoeging
mogelijk is. Behoud een bestaande passende sectie. Het ontbreken is geen harde
fout bij een puur functionele notificatie of transactionele mail; motiveer een
voorstel en pas toevoeging alleen toe binnen de gegeven wijzigingstoestemming.
H1 “💬 Ga met ons in gesprek”, Strong, alleen “gesprek” oranje; standaard witte
container, één lege paragraaf na de kop en vóór de primaire button “Plan je meeting”
naar `https://meetings.onderwijsin.nl/`, met mailinggebonden UTM's.
Gebruik een vastgelegde tekstvariant, niet een nieuwe herschrijving tijdens review.
Gebruik buiten de deep dive deze vaste algemene tekst:

> Heb je een vraag, een idee, of zie je mogelijkheden om samen te werken? We gaan graag met je in gesprek. Je kunt dat eenvoudig plannen met een van onze collega's via onderstaande link.

Een deep dive gebruikt verplicht zijn eigen statische sectie en tekst volgens
de deep dive-gids. Kopieer deze algemene variant daar niet overheen.

## Verplichte footer op elke mail

OI-FOOTER-01: plaats altijd dezelfde footer als laatste zichtbare blok: links
logo-component `cmuqw59u009b80j358rxuc7i2`, rechts website-, LinkedIn- en
GitHub-iconen in die volgorde.
`Columns gap=20 stackOnMobile=false`; beide kolommen `verticalAlignment=middle`.
Logowrapperpadding boven/onder 4; logo breedte 126, alttekst en bestemming behouden.
Icons rechts uitgelijnd, gap 24, size 24, kleur `#808080`.
Na deze kolommen staan nul lege paragrafen of andere visuele spacers. Loops voegt
de afmeldtekst toe; maak die niet handmatig na. Dit functionele footerblok is
uitgezonderd van de witte contentcontainerregel.

Gebruik het onderstaande vaste footerblok. Vervang `mailing-identificatie` door
de identificatie van de huidige mailing volgens de [linkregels](linkregels.md). Wijzig geen gedeelde componenten om dit
te corrigeren; meld onoplosbare gedeelde linkafwijkingen als handmatige actie.
Vergelijk inhoud en effectieve stijl semantisch; XML-inspringing is geen regel.

```xml
<Columns gap="20" stackOnMobile="false">
  <ColumnItem verticalAlignment="middle">
    <Component componentId="cmuqw59u009b80j358rxuc7i2" paddingTop="4" paddingBottom="4">
  <Image src="https://images.vialoops.com/cm4qwmvrg002s22b4zkdokrrw/cmuqw43s709fb0j2v1cgtu955.png" alt="Het logo van Stichting Onderwijs in" href="https://onderwijsin.nl?utm_source=newsletter&amp;utm_medium=loops&amp;utm_campaign=mailing-identificatie" width="126" />
</Component>
  </ColumnItem>
  <ColumnItem verticalAlignment="middle">
    <Icons align="right" gap="24" size="24" color="#808080">
  <Icon name="link" href="https://onderwijsin.nl?utm_source=newsletter&amp;utm_medium=loops&amp;utm_campaign=mailing-identificatie" />
  <Icon name="linkedin" href="https://www.linkedin.com/company/onderwijs-in?utm_source=newsletter&amp;utm_medium=loops&amp;utm_campaign=mailing-identificatie" />
  <Icon name="github" href="https://github.com/onderwijsin?utm_source=newsletter&amp;utm_medium=loops&amp;utm_campaign=mailing-identificatie" />
</Icons>
  </ColumnItem>
</Columns>
```

## Theme-tokens

De onderstaande `styles`-map legt de geldende theme-tokens vast.
`buttonBorderRadius=4` is de geldende buttonnorm; lokale secties, vlakken en
gewone afbeeldingen hebben radius 8. Wijzig het gedeelde theme niet.
`borderRadius=0` is de ongeronde buitenste mail, geen witte sectie.
Lege kleuren zijn niet ingesteld, niet wit. Afmetingen/letterspatiëring zijn px;
regelhoogten percentages: body 14 × 150% = 21 px; H1 24 × 140% = 33,6 px.
`buttonTextFormat=1` is de ruwe Loops-formatwaarde.

| Theme-attribuut         | Waarde                       |
| ----------------------- | ---------------------------- |
| `backgroundColor`       | `#f6f1ea`                    |
| `backgroundXPadding`    | `10`                         |
| `backgroundYPadding`    | `24`                         |
| `bodyColor`             | lege waarde (niet ingesteld) |
| `bodyFontCategory`      | `sans-serif`                 |
| `bodyFontFamily`        | `Poppins`                    |
| `bodyXPadding`          | `0`                          |
| `bodyYPadding`          | `0`                          |
| `borderColor`           | lege waarde (niet ingesteld) |
| `borderRadius`          | `0`                          |
| `borderWidth`           | `0`                          |
| `buttonBodyColor`       | `#ff9255`                    |
| `buttonBodyXPadding`    | `16`                         |
| `buttonBodyYPadding`    | `12`                         |
| `buttonBorderColor`     | lege waarde (niet ingesteld) |
| `buttonBorderRadius`    | `4`                          |
| `buttonBorderWidth`     | `0`                          |
| `buttonTextColor`       | `#ffffff`                    |
| `buttonTextFontSize`    | `16`                         |
| `buttonTextFormat`      | `1`                          |
| `dividerBorderWidth`    | `1`                          |
| `dividerColor`          | `#e4e7ee`                    |
| `heading1Color`         | `#3d285b`                    |
| `heading1FontSize`      | `24`                         |
| `heading1LetterSpacing` | `0`                          |
| `heading1LineHeight`    | `140`                        |
| `heading2Color`         | `#3d285b`                    |
| `heading2FontSize`      | `20`                         |
| `heading2LetterSpacing` | `0`                          |
| `heading2LineHeight`    | `100`                        |
| `heading3Color`         | `#3d285b`                    |
| `heading3FontSize`      | `16`                         |
| `heading3LetterSpacing` | `0`                          |
| `heading3LineHeight`    | `100`                        |
| `textBaseColor`         | `#111826`                    |
| `textBaseFontSize`      | `14`                         |
| `textBaseLetterSpacing` | `0`                          |
| `textBaseLineHeight`    | `150`                        |
| `textLinkColor`         | `#111826`                    |
