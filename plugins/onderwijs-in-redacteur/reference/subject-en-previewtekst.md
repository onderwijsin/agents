# Subject line en previewtekst

## Toepassing

Deze inhoudelijke redactiecriteria gelden voor Onderwijs in en elk mailtype: campagnes, workflowmails
en transactionele drafts. Subject en previewtekst vormen samen de uitnodiging
om de mail te openen. Maak de relevantie voor de ontvanger concreet en laat de
inhoud de gewekte verwachting waarmaken. De verplichte velden en onderstaande
redactiecriteria zijn redacteurbeleid; de lengterichtlijnen zijn schrijfadviezen.

## Verplichte controles

SUBJECT-01: iedere mail heeft een expliciet ingevulde `subject` én `previewText`.
Ontbrekend, alleen witruimte, tijdelijke vultekst of een onopgeloste placeholder
zoals “onderwerp hier” is een fout. Een interne campagnenaam, H1 in de body of
automatisch door een inbox opgepikte bodytekst vervangt deze velden niet.

SUBJECT-02: de subject line noemt een herkenbaar onderwerp, voordeel, vraag of
handeling die de ontvanger een reden geeft om te openen. Controleer dit tegen de
werkelijke inhoud. Alleen “Nieuwsbrief november” is onvoldoende onderscheidend;
zet de inhoudelijke aanleiding voorop. Bij een transactionele mail staat de
functie centraal, bijvoorbeeld een bevestiging of noodzakelijke vervolgstap.
Maak daarvan geen marketingteaser.

SUBJECT-03: wek nieuwsgierigheid met een concrete inhoudelijke belofte, zonder
clickbait, verzonnen urgentie, ongefundeerde claims of een misleidende `Re:`/`Fwd:`.
Een deadline, aantal, resultaat of persoonlijke verwijzing moet door de mail
of beschikbare gegevens worden onderbouwd. Bedenk geen cijfers of nieuwe feiten
om een onderwerp aantrekkelijker te maken.

PREVIEW-01: de previewtekst voegt informatie toe aan de subject line: een
concreet inzicht, voorbeeld, voordeel of volgende stap. Letterlijke herhaling
of dezelfde boodschap in andere woorden levert geen extra reden op om te openen.
Zet de belangrijkste aanvullende informatie vooraan. Laat noodzakelijke actie,
deadline of betekenis niet uitsluitend afhangen van zichtbare previewtekst.

De kern moet uit de subject line zelf blijken: een e-mailclient kan de preview
inkorten, verbergen of anders weergeven. Dit uitgangspunt sluit aan bij
[Loops sending settings](https://loops.so/docs/creating-emails/sending-settings)
en [Mailchimp over previewtekst](https://mailchimp.com/help/about-preview-text/).

## Schrijfadviezen

LENGTE-01: streef naar een subject van **minder dan 50 tekens** en maximaal
ongeveer **9 woorden**. Dit combineert de aanbevelingen van
[Loops](https://loops.so/docs/creating-emails/sending-settings) en
[Mailchimp](https://mailchimp.com/help/best-practices-for-email-subject-lines/).
Plaats betekenisvolle woorden vóór een editiecode of organisatienaam.
Een langere regel is geen automatische afkeuring: beoordeel of inkorten de
boodschap verbetert en of de essentie bij afkappen overeind blijft.

LENGTE-02: streef naar een preview van **minder dan 90 tekens**, met de kern
vooraan. Dit is een praktische richtlijn van
[Litmus](https://www.litmus.com/blog/the-ultimate-guide-to-preview-text-support),
geen universele inboxlimiet. Zichtbare lengte hangt af van client, apparaat,
instellingen en de ruimte die de subject line inneemt. Kort een passende preview
niet mechanisch in tot een onduidelijke zin.

STIJL-01: gebruik natuurlijke taal, actieve formuleringen en één duidelijke
invalshoek. Vermijd hoofdlettergeschreeuw en stapels leestekens. Een emoji mag
ondersteunen als die bij team en mail past; gebruik bij voorkeur maximaal één
en laat de betekenis ook zonder emoji intact. Mailchimp adviseert beperkt
gebruik van leestekens en emoji's in zijn
[subjectrichtlijnen](https://mailchimp.com/help/best-practices-for-email-subject-lines/).
Dit zijn redactionele adviezen, geen garantie op inboxplaatsing of hogere opens.

PERSONALISATIE-01: gebruik alleen personalisatie die inhoudelijk relevant en
betrouwbaar is. Controleer variabelen en fallbackwaarden volgens het mailtype en
de Loops-specificatie. Beoordeel ook het resultaat zonder naam of andere optionele
gegevens. Een geldige variabele is geen placeholderfout, maar onbekende
runtimewaarden kunnen de uiteindelijke tekst niet verifieerbaar maken.
Zie [Loops over dynamische verzendvelden](https://loops.so/docs/creating-emails/sending-settings).

## Review en correcties

1. Lees de actuele subject, previewtekst en mailinhoud; bepaal doelgroep en doel
   uit de beschikbare context. Vraag alleen wat nodig is om een inhoudelijke
   keuze te maken; verzin geen doelgroep of campagnebelofte.
2. Controleer alle verplichte regels. Geef bij een fout de huidige tekst, regel-ID,
   reden en een concreet vervangend **paar** subject + preview. Als beide al
   voldoen, behoud ze; zoek niet verplicht naar een nieuwe formulering.
3. Beoordeel lengte, toon en personalisatie als adviezen met een onderbouwing.
   Vermeld tekentellingen inclusief spaties bij lengteadvies. Tel zichtbare,
   naar NFC genormaliseerde Unicode-codepunten; onbekende dynamische waarden
   hebben geen vastgestelde eindlengte.
4. Geef bij een inhoudelijke keuze hoogstens twee duidelijk verschillende paren
   met een korte voorkeursreden. Maak voorstellen uitsluitend uit feiten en
   thema's die daadwerkelijk in de mail staan. Pas de velden in Loops toe binnen
   de gegeven wijzigingstoestemming. Toestemming om een nieuw concept in Loops
   klaar te zetten omvat ook het schrijven van subject en preview. Vraag alleen
   bij een nieuwe inhoudelijke keuze buiten de opdracht om een beslissing.
5. Lees na een mutatie de opgeslagen velden opnieuw en herhaal deze controle samen
   met de volledige inhoudelijke redactiecontrole. Een passende tekst is geen bewijs van rendement.
   Controleer waar mogelijk de combinatie in een echte inboxpreview; meld wanneer
   alleen de opgeslagen tekst is gecontroleerd.

Een eventuele A/B-test is een advies voor de gebruiker, geen toegestane
campagneverzending door deze plugin. Formuleer een te toetsen hypothese en wijzig
bij vergelijking één element tegelijk, zoals Litmus adviseert in zijn
[previewtekstgids](https://www.litmus.com/blog/the-ultimate-guide-to-preview-text-support).

## Voorbeelden

Gebruik deze paren alleen wanneer de genoemde inhoud werkelijk in de mail staat;
ze zijn geen vaste teamtekst.

| Maildoel                   | Subject                                     | Previewtekst                                                    |
| -------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| Inhoudelijke nieuwsbrief   | Hoe herkennen we onderwijstalent?           | Drie inzichten om nieuw talent te herkennen en ruimte te geven. |
| Bijeenkomst                | Ontdek het onderwijs tijdens een meeloopdag | Kijk mee in de klas en stel je vragen aan een docent.           |
| Transactionele bevestiging | Je aanmelding is bevestigd                  | Bekijk de praktische informatie voor je bezoek.                 |

## Bronnen

- [Loops — Sending settings](https://loops.so/docs/creating-emails/sending-settings):
  subject/preview als aparte velden, beknoptheid en dynamische inhoud.
- [Mailchimp — Best Practices for Email Subject Lines](https://mailchimp.com/help/best-practices-for-email-subject-lines/):
  relevantie, lengte, leestekens en emoji's.
- [Mailchimp — About Preview Text](https://mailchimp.com/help/about-preview-text/):
  aanvullende context en belangrijke informatie vooraan.
- [Litmus — The Ultimate Guide to Email Preview Text](https://www.litmus.com/blog/the-ultimate-guide-to-preview-text-support):
  samenwerking met de subject line, variabele zichtbaarheid en testen.
