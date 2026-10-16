# Subject en previewtekst — aanwezigheid en lengte

Deze technische controles gelden voor beide teams en alle mailtypen. Beoordeel
hier alleen of de velden zijn ingevuld en hun lengte; inhoudelijke aantrekkelijkheid,
toon, belofte en onderlinge aanvulling horen bij `nieuwsbrief-redactie` in de
geïnstalleerde plugin `onderwijs-in-redacteur`.

LENGTE-01: `subject` en `previewText` zijn beide expliciet ingevuld. Een ontbrekend
veld of alleen witruimte is een fout; de campagnenaam of automatisch opgepikte
bodytekst vervangt deze velden niet. Meld het ontbrekende veld zonder zelf een
inhoudelijk vervangend tekstpaar te bedenken.

LENGTE-02: streef naar een subject van minder dan 50 tekens en een preview van
minder dan 90 tekens. Dit zijn adviezen voor leesbaarheid, geen harde technische
limieten. Rapporteer bij overschrijding de gemeten lengte en adviseer de gebruiker
of nieuwsbriefredacteur een kortere versie te maken; herschrijf de inhoud hier niet.
Tel NFC-genormaliseerde Unicode-codepunten, inclusief spaties en leestekens.
Bij dynamische velden controleer je beschikbare voorbeeld- en fallbackwaarden;
onbekende uiteindelijke lengte blijft niet verifieerbaar.

De lengteadviezen komen uit [Loops sending settings](https://loops.so/docs/creating-emails/sending-settings)
en de [Litmus-previewtekstgids](https://www.litmus.com/blog/the-ultimate-guide-to-preview-text-support).
Werkelijke zichtbaarheid verschilt per e-mailclient en apparaat. Deze controle
vereist geen installatie van Redacteur; verwijs alleen door voor inhoudelijk werk.
