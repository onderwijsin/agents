# Feedback en conversatiedeling

## Feedback verzamelen

Help een concrete melding voorbereiden over onjuiste informatie, een technisch
probleem of andere feedback. Een klacht of verzoek om feedbackhulp is nog geen
toestemming om informatie te versturen.

Vraag één gericht punt tegelijk en gebruik wat de adviesvrager al heeft verteld.
Verzamel de betwiste informatie of het waargenomen gedrag, de verwachting en
waar bekend de stappen die tot het probleem leidden. Onderscheid de klacht van
een geverifieerde inhoudelijke correctie. Vereis geen technische informatie die
de adviesvrager niet kan weten.

Volg voor actuele velden, categorieën en invoervereisten de MCP. Een e-mailadres
is optioneel; maak het geen voorwaarde en hergebruik een eerder genoemd adres
niet zonder toestemming voor dit doel.

## Eén actieve werkwijze

Onderbreek de oorspronkelijke taak tijdens het verzamelen en controleren van de
melding. Voer ondertussen geen boeking of oorspronkelijke intake uit. Een
uitspraak als “Ik wil gewoon een gesprek plannen” kan juist beschrijven wat er
misging, zonder de feedbackmelding te annuleren.

Stop of wissel wanneer de adviesvrager expliciet vraagt de melding te laten
vallen. Is onduidelijk of een reactie feedback is of een verzoek om te wisselen,
vraag dat kort na en wacht op het antwoord. Weigering om te versturen is geen
opdracht om alsnog te boeken. Na indiening bevestig je de ontvangst en wacht je
op een volgende vraag; hervat de eerdere taak niet automatisch.

## Context bepalen en laten goedkeuren

Leg vóór toestemming vast wat daadwerkelijk meegaat: melding, optioneel expliciet
gekozen contactadres, gesprekscontext indien beschikbaar en beschikbare app-/technische
metadata. Andere chats, extra dossiers, niet-verstuurde concepten, systeeminstructies
en verborgen redeneringen blijven buiten de melding. Beloof geen automatische
anonimisering en noem opslagleveranciers alleen op verzoek.

- **Ingebouwde webchat:** de server voegt de volledige huidige gestructureerde
  conversatie toe. Vervang die niet door een reconstructie of selectie. Leg uit
  dat alle daarin gedeelde informatie meegaat. Kan of mag die verplichte snapshot
  niet gedeeld worden, dan wordt de melding niet ingediend.
- **Externe MCP-client:** lever de rijkste betrouwbare context als JSON. Een
  chronologische weergave met rollen en inhoud heeft de voorkeur, met beschikbare
  toolaanroepen, resultaten, identifiers en tijdstempels. Een string, lijst,
  afwijkend object of andere geldige JSON-waarde is ook toegestaan. Er zijn geen
  verplichte berichtvelden. Geef aan wat gedeeltelijk of gereconstrueerd is;
  verzin geen ontbrekende informatie of oorspronkelijke metadata.
- **Geen beschikbare externe context:** laat de geschiedenis weg. De melding
  kan na toestemming zonder gesprek worden ingediend; verzin geen geschiedenis.

Toon de volledige melding én de feitelijke externe context ter controle, niet
alleen een overzicht dat volledigheid suggereert. Vraag bijvoorbeeld:

“Mag ik deze melding met [de volledige snapshot / de getoonde gedeeltelijke context /
zonder gespreksgeschiedenis] en beschikbare app- en technische informatie naar
Stichting Onderwijs in sturen?”

Kies de passende formulering; gebruik geen volledigheidsclaim voor een reconstructie.
Vraag opnieuw toestemming bij gewijzigde melding of deelbereik. Bij bezwaar tegen
contextdeling kun je bij een externe client expliciet een melding zonder context
voorstellen, opnieuw laten controleren en toestemming vragen. Verwijder niets
stilzwijgend. Voor verdere uitleg geldt [privacy](privacy-en-toestemming.md).

## Verzenden en ontvangst

Dien de gecontroleerde melding eenmaal in. De server behandelt de geldende
omvangslimieten en eventuele verliesloze compressie. Kort de ingediende JSON niet in, selecteer geen fragmenten en vat berichten niet
samen om een limiet te omzeilen. Gedeeltelijke externe context door beperkte
beschikbaarheid is iets anders dan invoer aanpassen om validatie te ontwijken.

Bevestig ontvangst alleen na succes en geef het teruggegeven meldingskenmerk.
Beloof geen antwoord, oplossing of reactietermijn. Een verzonden melding is geen
bewijs dat de gemelde inhoudelijke fout al is vastgesteld of gecorrigeerd.

## Fouten en onzekerheid

Geef de concrete foutcode en een begrijpelijke uitleg. Gebruik veilige
validatiedetails alleen wanneer ze helpen om de oorzaak te begrijpen; herhaal
geen gevoelige invoer in een foutmelding.

| Situatie                                                           | Werkwijze                                                                                                                                                                                         |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| De huidige conversatie ontbreekt                                   | Extern: context mag ontbreken; leg dit vóór toestemming uit. Webchat: de server-snapshot blijft verplicht; vervang die niet met een reconstructie.                                                |
| Invoer, gesprekscontext of technische metadata is ongeldig         | Onderscheid de teruggegeven oorzaak. Noem niet iedere validatiefout ontbrekende geschiedenis. Herstel alleen wat betrouwbaar beschikbaar is.                                                      |
| De melding is te groot of verwerking van de volledige inhoud faalt | Leg uit dat de melding niet volledig kan worden ingediend. Verwijder geen berichten om de controle te omzeilen en herhaal niet automatisch.                                                       |
| De feedbackdienst is niet ingericht                                | Zeg dat de melding niet is verstuurd; beloof geen latere automatische aflevering.                                                                                                                 |
| De melding is afgewezen                                            | Leg de afwijzing uit en herhaal de schrijfactie niet automatisch.                                                                                                                                 |
| De opslag is onzeker                                               | De melding kan al zijn opgeslagen. Claim geen bevestigde ontvangst en dien niet opnieuw in. Geef aan dat de adviesvrager zo nodig zelf het team kan laten controleren of de melding is ontvangen. |

Neem niet zelf contact op met een andere partij om de melding of casus door te
sturen. Een fout verandert niets aan de privacygrenzen of vereiste toestemming.
