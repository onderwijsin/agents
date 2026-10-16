# Onderwijs in — deep dive-template

## Toepassing

Deze gids bepaalt de vaste structuur, patronen, statische sectie en specifieke
stijlregels voor deep dive-nieuwsbrieven, aanvullend op de
[algemene Onderwijs in-stijl](onderwijs-in.md). Lees beide bij een deep dive.
Andere mailtypen hoeven de vaste structuur, aantallen, rubriektitels en
auteurswisseling niet te volgen.

## Loops-templates

- [Deep dive-template](https://app.loops.so/campaigns/cmuyeyrtc00iw0j0e6dwxv5j1/compose).
- [Deep dive-back-uptemplate](https://app.loops.so/campaigns/cmuyeyzue00oo0kx8ggs1zjl3/compose).

Gebruik deze templates als uitvoeringsreferentie. De regels in deze gids zijn
leidend bij verschillen tussen templates of tussen een template en deze gids.
Neem extra secties of afwijkende opmaak niet automatisch als template-eis over.

## Meetwijze

Tel zichtbare tekst inclusief spaties en leestekens, na het oplossen van
XML-entiteiten en verwijderen van opmaaktags en broninspringing. Normaliseer
Unicode naar NFC en tel codepunten. Grenzen zijn inclusief. Onbekende dynamische
tekstlengte blijft niet verifieerbaar. Voor visuele witregels geldt OI-RUIMTE-01.

## Vaste structuur

STRUCT-01: headerafbeelding → persoonlijk bericht → Verhalen uit de praktijk →
Kennis en expertise → Op de agenda → Ga met ons in gesprek → footer.
De vijf inhoudssecties gebruiken de algemene sectiestijl (OI-SECTIE-01).
Tussen opeenvolgende onderdelen staat EXACT één lege paragraaf, ook tussen
header en sectie 1 en tussen sectie 5 en footer. Na de footer staan er nul.
Voeg geen scheidingslijnen of extra spacers toe.

### Header

HEADER-01: in iedere deep dive is de header verplicht. Gebruik het goedgekeurde
transparante headerpatroon OI-HEADER-01 uit de algemene gids, op volledige breedte.

### Sectie 1 — Persoonlijk bericht

INTRO-01: één teamlid schrijft een persoonlijk bericht; de auteur wisselt per
editie. Vergelijk met de vorige deep dive indien beschikbaar. Zonder historie
is de wisseling niet verifieerbaar; kies niet zelf een vervangende auteur.

INTRO-02: de persoonlijke H1-aanhef uit OI-AUTEUR-01 is hier verplicht,
inclusief de voornaamvariabele, oranje nadruk en fallback “daar”.

INTRO-03: na de aanhef en tussen tekstparagrafen één lege paragraaf.
Sluit af met een groet, één lege paragraaf en het auteursblok.
De voorbeeldgroet is “Tot de volgende editie!” (Strong), een `Br` en
“Hartelijke groet,”; de groet mag bij de persoonlijke tekst passen.

INTRO-04: pas het algemene auteursblok OI-AUTEUR-01 toe; in een deep dive is
het teamlid verplicht. De afwisseling tussen edities blijft een deep dive-regel.

### Sectie 2 — Verhalen uit de praktijk

VERHAAL-01: vaste H1 “Verhalen uit de praktijk”, achtergrond `#ffe9dd`.
Daarna één lege paragraaf en 1–4 verhaalitems.

VERHAAL-02: twee kolommen: foto links; naam, beschrijving en button rechts.
Naam vet paars; beschrijving grijs, 100–120 tekens.
Buttontekst exact “Het verhaal van {voornaam} →”, met de echte voornaam.
De pijl is expliciete huisstijl en gaat vóór algemeen Loops-advies tegen pijlen.

VERHAAL-03: foto en button linken naar hetzelfde verhaal met consistente UTM's.
Alttekst identificeert de persoon. Binnen de rechterkolom staat één lege
paragraaf vóór de button. Tussen opeenvolgende items staan GEEN lege paragrafen;
itempadding verzorgt de afstand.

### Sectie 3 — Kennis en expertise

EXPERTISE-01: vaste H1 “Kennis en expertise”, achtergrond `#ebe9ee`.
Daarna één lege paragraaf en 1–4 expertise-items.

EXPERTISE-02: elk item gebruikt het goedgekeurde icoonpatroon OI-ICOON-01:
icoonafbeelding links, artikeltitel en beschrijving rechts. De deep dive-variant
heeft de specifieke uitlijning en padding uit STIJL-05 hieronder.

EXPERTISE-03: titel maximaal 60 tekens, Strong en Underline in `#3d285b`.
Beschrijving 120–180 tekens, 12 px, `#676767`. Icoon en volledige titel
linken naar hetzelfde expertise-item met passende UTM's.
GEEN lege paragrafen tussen titel en beschrijving of tussen items.

### Sectie 4 — Op de agenda

AGENDA-01: vaste H1 “Op de agenda”, achtergrond `#feebe7`.
Daarna één lege paragraaf en 1–5 agenda-items.

AGENDA-02: datumvlak links met twee cijfers `01`–`31`, passend bij de
eventdatum. Rechts eventtitel en daaronder cursieve datum en locatie,
bijvoorbeeld “25 november 2026 - Utrecht” of een digitale locatie.
De volledige eventtitel linkt naar de event- of aanmeldpagina; alleen een gelinkt
achtervoegsel is onvoldoende. Pas de gedeelde UTM-regels toe.

AGENDA-03: GEEN lege paragraaf tussen titel en ondertitel of tussen items.
Kolommen verticaal gecentreerd; stijlen volgens STIJL-06.

### Sectie 5 — Ga met ons in gesprek

GESPREK-01: deze sectie is in iedere deep dive verplicht. Gebruik exact de
hieronder vastgelegde deep dive-tekst, volgorde en bestemming, met de algemene
radiusregel en noodzakelijke UTM-normalisatie. De generieke variant uit de
algemene gids vervangt deze deep dive-tekst niet.

### Footer

Gebruik de verplichte algemene footer volgens OI-FOOTER-01 in de
[algemene gids](onderwijs-in.md). Voeg na de footer geen visuele spacer toe.

## Deep dive-stijlen en patronen

Algemene containers, lettertypen, basisbuttons, headinggewicht, auteursblokken en
footer staan uitsluitend in de algemene gids. De volgende rubriekstijlen komen
daar bovenop. Niet genoemde attributen volgen de algemene stijl en het theme;
verzin geen verborgen rendererdefaults. `widths` zijn percentages; padding,
`gap`, breedte en radius zijn px.

STIJL-02 — Rubriekheaders: H1 en Strong, `align=center`,
`blockBorderRadius=8`, `paddingBottom=12`. Achtergrond: verhalen `#ffe9dd`,
expertise `#ebe9ee`, agenda `#feebe7`. Deze vaste rubriekkoppen hebben géén
oranje tekstaccent. Meerdere H1's zijn hier een expliciete templatekeuze.

STIJL-04 — Verhalen:

| Onderdeel         | Stijl                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Columns           | `gap=12`, `widths=25,75`, `stackOnMobile=false`, `paddingTop=12`, `paddingBottom=12`.                                                                |
| Foto              | `width=100`, `borderRadius=8`, `paddingTop=0`, `paddingBottom=0`.                                                                                    |
| Rechterkolom      | `paddingTop=8`, `paddingRight=8`.                                                                                                                    |
| Naam/beschrijving | Strong `textColor=#3d285b`; beschrijving Text `textColor=#676767`, 14 px uit theme.                                                                  |
| Button            | `bgColor=#ffffff`, `textColor=#ff9255`, `innerXPadding=0`, `innerYPadding=4`, `fontSize=14`; radius 4 volgens OI-RADIUS-01, randbreedte 0 uit theme. |

STIJL-05 — Expertise:

| Onderdeel    | Stijl                                                                                 |
| ------------ | ------------------------------------------------------------------------------------- |
| Columns      | `gap=12`, `widths=22,78`, `stackOnMobile=false`, `paddingTop=12`, `paddingBottom=12`. |
| Icoon Image  | `width=87.08`, radius 8 volgens OI-ICOON-01; geen extra padding.                      |
| Rechterkolom | `paddingTop=8`, `paddingRight=8`.                                                     |
| Titel        | Paragraph met Link, Underline `textColor=#3d285b`, Strong; 14 px uit theme.           |
| Beschrijving | Paragraph `fontSize=12`, Text `textColor=#676767`.                                    |

STIJL-06 — Agenda:

| Onderdeel      | Stijl                                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Columns        | `gap=25`, `widths=13,87`, `paddingTop=12`, `paddingBottom=12`; `stackOnMobile` volgt de Loops-standaard.                                 |
| Beide kolommen | `verticalAlignment=middle`.                                                                                                              |
| Datumvlak      | Paragraph `fontSize=27`, `blockColor=#fff5f3`, `blockBorderRadius=8`, padding alle zijden 8, `align=center`; Strong `textColor=#f79b86`. |
| Rechterkolom   | `paddingTop=8`, `paddingBottom=8`.                                                                                                       |
| Titel          | Paragraph, Strong, Underline `textColor=#3d285b`; volledige titel binnen Link.                                                           |
| Ondertitel     | Paragraph `fontSize=12`, Em; kleur uit theme.                                                                                            |

## Vaste deep dive-gesprekssectie

Bewaar de formulering “om samen te verwerken”; herschrijf de statische
tekst niet op eigen initiatief. Vergelijk semantisch: XML-inspringing en
attribuutvolgorde veranderen de inhoud niet. De button erft radius 4 uit het theme; UTM's worden per mailing
volgens de [gedeelde regels](linkregels.md) ingevuld. Vervang
`mailing-identificatie` door de identificatie van de huidige mailing. Gedeelde componenten
blijven ongewijzigd.

```xml
<Section blockColor="#ffffff" blockBorderRadius="8" paddingTop="32" paddingRight="24" paddingBottom="32" paddingLeft="24">
  <H1><Strong>💬 Ga met ons in </Strong><Strong textColor="#ff9255">gesprek</Strong></H1>
  <Paragraph></Paragraph>
  <Paragraph>Wil jij samen met ons werk maken van méér goede mensen in het onderwijs? Plan een meeting met één van onze collega's om samen te verwerken hoe we het onderwijs kunnen versterken.</Paragraph>
  <Paragraph></Paragraph>
  <Button href="https://meetings.onderwijsin.nl/?utm_source=newsletter&amp;utm_medium=loops&amp;utm_campaign=mailing-identificatie">Plan je meeting</Button>
</Section>
```
