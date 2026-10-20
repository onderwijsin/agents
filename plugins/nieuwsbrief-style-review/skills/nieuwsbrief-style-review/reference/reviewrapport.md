# Standaard reviewrapport

Gebruik onderstaande volgorde en precies drie tabellen bij iedere afgeronde
review, voor beide teams en alle ondersteunde mailtypes. Vul ze uitsluitend met
bevindingen uit de actuele mail en toepasselijke regels. Dit rapport definieert
geen aanvullende huisstijlregels.

## Responsstijl

Schrijf voor een gebruiker die de referentiedocumenten en stijlregels niet kent.
Leg in gewone taal uit wat je hebt gevonden en wat er moet veranderen. Licht de
bedoeling van een regel kort toe wanneer dat helpt; vermijd uitleg over de
interne documentatie, bestandsnamen, markup of toolvelden als die niet nodig is
om de actie te begrijpen. Houd concrete waarden, zoals kleuren, afmetingen en
tekentellingen, waar ze helpen. Bestaande regelcodes blijven in de kolom “Regel”
voor debugging; de gebruiker hoeft ze niet te begrijpen om de actie uit te voeren.

Voer geen visuele verificatie uit en geef de gebruiker geen opdracht om desktop,
mobiel, beeldverhoudingen of andere visuele weergave te controleren. Een ontbrekende
render of screenshot hoort niet in de verificatietabel of bij overige beperkingen.
De gebruikelijke link naar de gewijzigde mail blijft een opleverlink, geen
verzoek om visuele verificatie.

## Inhoud en onderscheid

- Open met “Ik heb **[naam van de email]** gecontroleerd.” Benoem daarna kort
  algemene bevindingen, het team, mailtype en de scope of beperkingen van de controle.
- Tabel 1 bevat vastgestelde afwijkingen met concrete verbeteracties. Vermeld
  de waargenomen én gewenste waarde; geef bij tekstlengtes de telling, grens en
  waar passend een voorstel binnen de toegestane redactionele scope.
- Tabel 2 bevat onzekerheden en punten die de gebruiker zelf moet verifiëren.
  Benoem wat onbekend is, waarom MCP dit niet kan vaststellen en welke concrete
  controle of input nodig is. Maak een vermoeden niet tot vastgestelde fout.
  Een gebruikerscontrole in Loops betekent nooit dat de agent een browser opent.
- Gebruik in de kolom “Regel” bestaande regelcodes uit de toepasselijke referentie.
  Verzin geen code. Ontbreekt een code, vermeld “—”;
  bij uitsluitend een technische beperking: “Niet verifieerbaar”.
- Tabel 3 bevat concrete voorgestelde UTM-URL’s volgens
  [de gedeelde linkregels](linkregels.md). Licht vooraf de gekozen `utm_campaign`
  en eventuele `utm_content` toe. Groepeer locaties alleen als hun volledige
  voorgestelde URL identiek is. Toon de volledige URL als klikbare link; open hem
  niet. Rapporteer de afwijking en regelcode in tabel 1 en zet de URL in tabel 3.
  Verzin geen onbekende bestemming: zet die onzekerheid in tabel 2.
- Behoud ook een tabel zonder bevindingen: gebruik één rij met “—” bij locatie
  en regel en “Geen bevindingen”, “Geen aanvullende verificatie nodig” of
  “Geen UTM-aanpassingen nodig” in de inhoudskolom. Een lege tabel betekent
  nooit dat niet-uitgevoerde controles geslaagd zijn.
- Zet contextafhankelijke aanbevelingen onder **Aanvullend advies** als bullets;
  houd ze gescheiden van verplichte correcties. Vermeld “Geen aanvullend advies”
  als er geen is. Gebruik hiervoor geen vierde tabel.
- Vermeld onder [**Loops Guardian**](https://loops.so/docs/creating-emails/guardian)
  de werkelijk uitgevoerde controle en uitkomst,
  inclusief relevante meldingen en resterende punten. Is Guardian niet beschikbaar
  of niet uitgevoerd, zeg dat expliciet; verzin geen goedkeuring. Plaats een
  melding die actie vereist ook in de passende bevindingentabel.
- Benoem overige relevante beperkingen en de wijzigingsstatus. Na een review
  zonder mutaties: “Er is nog niets gewijzigd in Loops.” Vraag bij verbeteracties:
  “**Zal ik deze wijzigingen voor je doorvoeren?**” Benoem daarna benodigde keuzes
  en input; onzekere punten worden pas aangepast na verduidelijking. Vraag bij
  een rapport zonder verbeteracties niet om niet-bestaande wijzigingen.
- Na correcties: vervang de openingszin door “Ik heb **[naam]** aangepast en opnieuw
  gecontroleerd.” Vat toegepaste acties apart samen, vul de drie tabellen met
  resterende punten en gebruik een feitelijke wijzigingsstatus in plaats van
  “Er is nog niets gewijzigd”. Deel de link naar de laatste versie in de
  Loops-webinterface en bied een testpreview aan volgens de skill.

## Rapportsjabloon

Vervang de placeholders door bevindingen of de lege-resultaattekst hierboven.
De slotvraag geldt alleen voor nog niet uitgevoerde verbeteracties.

```markdown
Ik heb **[NAAM VAN EMAIL]** gecontroleerd.

[ALGEMENE BEVINDINGEN EN CONTROLESCOPE]

Ik heb deze concrete verbeteracties gevonden:

| Locatie   | Bevinding en concrete actie                   | Regel                 |
| --------- | --------------------------------------------- | --------------------- |
| [Locatie] | [Waargenomen afwijking en concrete correctie] | [Bestaande regelcode] |

Daarnaast zijn er punten die ik niet kan verifiëren. Kun je deze zelf nalopen
in Loops of de ontbrekende informatie delen? Je kunt ze daarna zelf aanpassen
of mij opdracht geven ze door te voeren:

| Locatie   | Bevinding en concrete actie                      | Regel                    |
| --------- | ------------------------------------------------ | ------------------------ |
| [Locatie] | [Onzekerheid, reden en benodigde controle/input] | [Regelcode of beperking] |

[TOELICHTING OP VOORGESTELDE UTM-LINKS]

| Locatie      | Voorgestelde URL                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| [Locatie(s)] | [Volledige voorgestelde URL](https://example.org/?utm_source=newsletter&utm_medium=loops&utm_campaign=mail-id) |

**Aanvullend advies:**

- [Aanvullend advies, of: Geen aanvullend advies.]

[**Loops Guardian**](https://loops.so/docs/creating-emails/guardian)**:** [Uitgevoerde controle en resultaten, of expliciet niet uitgevoerd.]

[OVERIGE RELEVANTE ZAKEN]

Er is nog niets gewijzigd in Loops. **Zal ik deze wijzigingen voor je doorvoeren?**

[BENODIGDE KEUZES EN INPUT VÓÓR UITVOERING, INDIEN VAN TOEPASSING]
```
