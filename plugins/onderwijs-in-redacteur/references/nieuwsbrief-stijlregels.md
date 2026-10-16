# Nieuwsbrief — stijlregels en externe afhankelijkheden

Inhoud en tone of voice horen bij `nieuwsbrief-redactie`. Opmaak, stijltokens,
UTM-regels en exacte deep dive-structuur hebben één canonical bron in de afzonderlijk
geïnstalleerde plugin `nieuwsbrief-style-review`. Kopieer die bestanden niet naar
Redacteur en leg geen relatieve bestandslinks naar een sibling checkout aan.

## Beschikbaar maken en laden

Voor Loops-werk zijn nodig:

- De [Loops-plugin](https://chatgpt.com/plugins/plugin_asdk_app_6a76060a3cbc81919eaaca7e37e830fe),
  de geauthenticeerde Loops-app en toegang tot team Onderwijs in.
- De plugin `nieuwsbrief-style-review` uit dezelfde repositorymarketplace, met
  zijn skill en referenties beschikbaar in de actieve host.

Ontdek de geïnstalleerde `nieuwsbrief-style-review`-skill via de host en lokaliseer
zijn pakketresources via die skill. Lees `references/onderwijs-in.md` en
`references/linkregels.md` uit dat pakket; bij een deep dive ook
`references/onderwijs-in-deep-dive-template.md` en de daarin genoemde assets.
Deze paden zijn logische pakketresources, geen absolute installatiepaden. Een
geïnstalleerde maar niet leesbare dependency telt als onbeschikbaar: meld welke
toegang nodig is en stel live mutaties uit. Chatredactie met Redacteur-referenties
kan doorgaan, met de beperking dat de mailopmaak nog niet is gecontroleerd.

De `.app.json`-koppeling geeft toegang tot een geregistreerde app; zij installeert
noch activeert Loops-skills of de stijlreview-plugin automatisch. Laad bij LMX
`loops-lmx` en diens specificatie/ontwerprichtlijnen. Gebruik
`loops-email-sending-best-practices` voor inhoudelijke onderwerp/previewvragen.
De nieuwsbriefworkflow gebruikt uitsluitend Loops MCP; API-, CLI- en browserroutes
uit gekoppelde skills zijn hier niet toegestaan. Ontbrekende MCP-functionaliteit
is een blokkade voor de afhankelijke handeling, geen reden om de webinterface te openen.

## Toepassen versus reviewen

Bij iedere Loops-mutatie past de redacteur de gelezen stijldefinities al toe en
controleert hij zijn eigen opgeslagen werk. Alleen definities laden activeert
niet de volledige reviewworkflow. Zo kan de redacteur een nieuwe draft uit het
template maken zonder de beperktere create-bevoegdheid van stijlreview te veranderen.

Vraag na oplevering apart of een volledige stijlreview gewenst is. Bij ja: voer
`nieuwsbrief-style-review` uit op dezelfde mail, met zijn eigen statuschecks en
bevoegdheden. Het reviewverzoek op zichzelf geeft geen extra wijzigings- of
previewtoestemming. Bestaande concrete wijzigingstoestemming blijft bruikbaar
binnen haar scope. De reviewer beoordeelt subject/preview alleen op aanwezigheid
en lengte; inhoudelijke herschrijving blijft bij de redacteur.

## Loops-template en servicecontract

Primaire deep dive-template: campagne `cmuyeyrtc00iw0j0e6dwxv5j1`.
Het bronobject wordt alleen gelezen. De MCP-specificatie biedt `createCampaign`
voor een nieuwe draft en `updateEmailMessage` voor inhoud met `expectedRevisionId`;
zij biedt geen dupliceerendpoint. De redacteur maakt daarom een nieuwe draft en
kopieert de relevante emailvelden. Dit is geen server-side kloon van alle metadata.
Gebruik het actuele schema; ga bij een fout niet onbeperkt nieuwe drafts aanmaken.

Protocolbron: de [Loops OpenAPI-specificatie](https://app.loops.so/openapi.json),
ontsloten via de MCP-tools `search` en `describe`. Zie ook
[Loops sending settings](https://loops.so/docs/creating-emails/sending-settings)
voor subject/preview en sender/reply. De
[OpenAI-packaginggids](https://developers.openai.com/plugins/build/plugins)
beschrijft appmapping als geregistreerde MCP-serverkoppeling. Externe skill- en
plugininstallatie en runtimecompatibiliteit vereisen aparte hostvalidatie.
