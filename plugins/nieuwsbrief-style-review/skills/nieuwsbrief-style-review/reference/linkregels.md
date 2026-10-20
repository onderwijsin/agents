# Gedeelde linkregels

Deze regels gelden voor beide teams en voor campagnes, workflowmails en
transactionele drafts.

## UTM-01 — Domeinen en parameters

Controleer alle uitgaande HTTP(S)-linkbestemmingen, inclusief knoppen, gekoppelde
afbeeldingen en links in gebruikte componenten. Parse de URL en vergelijk de
hostname zonder hoofdlettergevoeligheid: exact een van onderstaande domeinen,
of een hostname die eindigt op een punt gevolgd door dat domein:

- `traineesinonderwijs.nl`
- `onderwijsin.nl`
- `onderwijsloket.com`

Zo valt `www.onderwijsin.nl` binnen de regel en `neponderwijsin.nl` of
`onderwijsin.nl.example.org` erbuiten. Gebruik geen losse substringmatch op de URL.

Elke link binnen deze domeinen heeft precies één van elk van deze parameters:

| Parameter      | Verplichte waarde                                             |
| -------------- | ------------------------------------------------------------- |
| `utm_source`   | `newsletter`                                                  |
| `utm_medium`   | `loops`                                                       |
| `utm_campaign` | Een niet-lege waarde die de huidige mailing identificeert.    |
| `utm_content`  | Optioneel; identificeert het specifieke blok of de linktekst. |

Behoud een bestaande passende `utm_campaign`. Ontbreekt die, stel een stabiele
waarde voor op basis van de mailingnaam en het unieke mail-ID; gebruik voor een
workflowmail het email-message-ID zodat mails binnen dezelfde workflow te
onderscheiden zijn. Gebruik dezelfde campagnewaarde voor alle toepasselijke
links in deze mail. Behoud een passend `utm_content`; voeg het alleen toe als een
blok- of tekstidentificatie nuttig is. Rapporteer tegenstrijdige waarden als actie.

## UTM-02 — Correcties en verificatie

Toon per afwijkende link de locatie en concrete voorgestelde URL. Na toestemming:
vervang onjuiste UTM-waarden, verwijder dubbele UTM-sleutels en voeg ontbrekende
verplichte parameters toe. Behoud overige queryparameters, fragmenten, pad,
URL-encoding en personalisatie. Gebruik `?` of `&` volgens de bestaande query;
escape `&` als `&amp;` bij serialisatie naar LMX.

Controleer bij dynamische bestemmingen de beschikbare expressie en veilige
voorbeeldwaarden zonder persoonsgegevens. Kan het domein of de uiteindelijke
query niet worden vastgesteld, meld de link als niet verifieerbaar en vraag om
de ontbrekende informatie; verzin geen bestemming en beschadig geen variabelen.
Wijzig gedeelde componenten nooit om een link lokaal te corrigeren: rapporteer
zulke punten voor handmatige oplossing als een veilige mailgebonden wijziging
niet beschikbaar is. Verifieer na opslaan opnieuw alle toepasselijke links.
