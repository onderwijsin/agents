# Onderwijs in Redacteur

Nederlandstalige redactie voor Onderwijs in: vijf skills voor websitecontent en
één skill voor nieuwsbrieven en mailings. De websiteskills leveren volledig in
chat. De nieuwsbriefredacteur levert in chat of maakt na toestemming een Loops-draft;
alle redactieskills controleren spelling, grammatica en interpunctie.

## Kies de taak

| Skill                      | Gebruik                                                                  | Voorbeeld                                                                     |
| -------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `redigeren-toon`           | Bestaande tekst laten klinken als Onderwijs in                           | “Herschrijf deze webtekst in onze tone of voice.”                             |
| `redigeren-structuur`      | Volgorde, koppen en samenhang verbeteren                                 | “Maak deze blog logisch en scanbaar.”                                         |
| `redigeren-contenttype`    | Tekst passend maken voor type en subtype                                 | “Maak hiervan een handreiking voor werkgevers.”                               |
| `contentidee-toetsen`      | Idee kritisch toetsen aan regels en bestaande content                    | “Gril dit idee: een nieuw artikel over matching.”                             |
| `contentconcept-schrijven` | Nieuw concept uit brief en bronnen schrijven                             | “Schrijf een domeinpagina op basis van deze notities.”                        |
| `nieuwsbrief-redactie`     | Nieuwsbrieven schrijven en redigeren op inhoud, toon, subject en preview | “Werk deze notities uit tot een nieuwsbrief en zet een draft in Loops klaar.” |

Geef je tekst of idee, doelgroep en beoogd contenttype mee. Relevante bronlinks, feiten,
auteur, doel en gewenste lengte helpen. Ontbrekende feiten blijven herkenbare invulpunten;
de skills verzinnen geen resultaten, citaten of arbeidsvoorwaarden.

De website-typegidsen behandelen webpagina's (inclusief doelgroeppagina's), expertise-items,
blogs, vacatures, teamleden, domeinen en initiatieven. Expertise heeft zeven subtypen:
toolkit, rapportage, opiniestuk, inzicht, handreiking, developer resource en case study.

## Referenties en eigenaarschap

Voor websitewerk begin je bij [de websitewerkwijze](skills/contentconcept-schrijven/reference/werkwijze-websiteredactie.md).
Voor mailings begin je bij `nieuwsbrief-redactie` en zijn eigen referenties.
Beide kanalen delen [spelling](skills/contentconcept-schrijven/reference/spelling.md) en de
[merkstem](skills/contentconcept-schrijven/reference/toon-en-stijl.md); de merkstem legt geen universele
websitezoekronde of websiteopbouw op. De website-typegidsen beschrijven uitsluitend
websitecontent. [Bronnen ophalen](skills/contentconcept-schrijven/reference/bronnen-ophalen.md) blijft de publieke
websiteleesroute; de nieuwsbriefskill gebruikt die wanneer inhoudsverificatie nodig is.

De plugin bezit alle eigen skills en referenties binnen zijn pakket. Gedeelde
bronnen staan in root `reference/`; de skills lezen uitsluitend hun eigen
`reference/`-map. De links in dit README verwachten die geïnstalleerde kopieën, die
nog ontbreken zolang migratie niet is uitgevoerd. Installeer het hele pakket. De inhoudelijke
[subject- en previewgids](skills/nieuwsbrief-redactie/reference/subject-en-previewtekst.md) is hier canonical.
Opmaak en exacte deep dive-structuur blijven canonical bij `nieuwsbrief-style-review`.
Externe dependencies worden via de host ontdekt, niet via repositorypaden gekoppeld.

### Nieuwsbriefworkflows

Bij schrijven: geef concept, ideeën of notities. De skill vraagt of de mail direct
in Loops mag worden klaargezet. Bij ja wordt de deep dive-template alleen gelezen,
een nieuwe draft gemaakt en relevante mailinhoud gekopieerd en geredigeerd. Bij nee
krijg je de volledige mail in chat. Ontbrekende verhalen, expertise, agenda en
andere gegevens worden benoemd; oude templatevoorbeelden zijn geen nieuwe feiten.

Bij redigeren: geef tekst, mailingnaam of link en kies chat of direct bewerken in
Loops. De skill controleert inhoud, logica, toon, taal en subject/preview. Voor live
werk gelden statuschecks, revisieveilige updates en controle na iedere mutatie.
Na live oplevering krijg je de geverifieerde link en het aanbod voor een testpreview.
Na beide routes vraagt de skill apart of een volledige stijlreview gewenst is.

Voor Loops-werk installeer je ook de
[Loops-plugin](https://chatgpt.com/plugins/plugin_asdk_app_6a76060a3cbc81919eaaca7e37e830fe)
en `nieuwsbrief-style-review` uit de repositorymarketplace. Lees
[nieuwsbrief-stijlregels](skills/nieuwsbrief-redactie/reference/nieuwsbrief-stijlregels.md) voor de
resource-overdracht en grenzen. Appmapping installeert externe skills/plugins niet.
Zonder dependencies blijft chatredactie mogelijk; live schrijven wacht op herstel.
De volledige stijlreview is optioneel, maar de stijlregels toepassen bij een
Loops-mutatie is verplicht. Echt verzenden, publiceren of activeren blijft bij de gebruiker.

## ChatGPT-app en bronverbinding

De plugin verwijst via `.app.json` naar de bestaande geregistreerde Onderwijs in-app
met technische ID `asdk_app_6acfac4f5ef08191855806720d766a68`. Het rootmanifest
verwijst naar dit bestand via `extensions.com.openai.apps`. Er zit geen `mcp.json`
in de ChatGPT-import, zodat de app-verbinding apart door de workspace wordt beheerd.
Daarnaast koppelt `.app.json` Loops met ID
`asdk_app_6a76060a3cbc81919eaaca7e37e830fe`. Loops is als appmapping niet verplicht
voor websiteskills (`required: false`); de nieuwsbriefskill vereist de verbinding
wel zodra Loops-werk nodig is. De Onderwijs in-app gebruikt `https://onderwijsin.nl/mcp`; de beschikbare tools en leesrechten
worden bepaald door de bestaande appconfiguratie en workspacebeleid.

Een beheerder moet de bestaande app voor de bedoelde rollen beschikbaar maken en
de plugin-installatie op **Available** of **Installed** zetten. De cataloguspolicy
regelt dit niet en verleent geen app-toegang. Bij ontbrekende toegang controleert
de beheerder zowel pluginbeleid als app-beschikbaarheid.

### Pluginicoon

`assets/plugin-icon.png` wordt gebruikt door `extensions.com.openai.interface.logo` en
`composerIcon` in `plugin.json`. Beide verwijzen naar `./assets/plugin-icon.png` volgens de
[OpenAI-presentatiemetadata](https://developers.openai.com/plugins/build/plugins#add-openai-specific-metadata).
Sync de marketplace na het bijwerken van het bestand en controleer beide weergaven.

[Bronnen ophalen](skills/contentconcept-schrijven/reference/bronnen-ophalen.md) beschrijft de Onderwijs in-app in ChatGPT,
de MCP-verbinding op andere hosts, tools, resources, paginering,
statusfilters en een herstelroute wanneer subtype-metadata en toolschema verschillen.
Bij websitewerk pauzeert de inhoudelijke taak bij onbereikbaar verplicht brononderzoek.
Nieuwsbriefwerk volgt de eigen verificatie- en afleverafspraken. Een actualiteits- of overlapclaim vereist gelezen bronnen.

## Packaging en beoogde hosts

Het rootmanifest volgt [Agent Plugins 1.0.0](https://agent-plugins.org/specification).
OpenAI-presentatie staat in `extensions.com.openai` volgens de
[OpenAI-pluginhandleiding](https://developers.openai.com/plugins/build/plugins); de
`apps`-mapping bevat de geregistreerde technische app-ID's uit `.app.json`.
De Claude-overlay behoudt een afzonderlijke HTTP MCP-configuratie naar dezelfde
read-only websiteservice. Deze overlay levert geen Loops-verbinding of externe
reviewskill op Claude; de nieuwe Loops-workflow is daar niet geconfigureerd of getest.
De websiteskills en eigen referenties blijven gedeeld. Zie de
[Claude-manifestreferentie](https://code.claude.com/docs/en/plugins-reference) en
[MCP-configuratie](https://code.claude.com/docs/en/mcp).

De repository bevat geen publieke-directorypublicatie: GitHub is de publieke,
controleerbare bron en het doel is de intern geïmporteerde Business-marketplace.
De bestaande app-ID komt uit de door de gebruiker verstrekte ChatGPT-app-URL; de
app-pagina kon hier niet worden geopend. Werkruimte- en roltoegang, verbinding zonder
extra aanmelding, zichtbaarheid van de Desktop only-markering en toolgedrag op web
en mobiel zijn daarom nog niet geverifieerd. Claude-installatie en runtimegedrag
blijven eveneens ongetest.
Volg [de acceptatieproeven](tests/acceptatie.md) vóór uitrol.

## Validatie

Repositorychecks: `pnpm format` en `pnpm check`.
Het README en [de acceptatieproeven](tests/acceptatie.md) blijven bij het installabele pakket.
Offline checks gebruiken geen credentials of live services.

## Compatibiliteit en acceptatie van nieuwsbriefredactie

De nieuwsbriefflow is bedoeld voor ChatGPT/Codex met beide externe plugins beschikbaar.
Installatie, activatie, toegang tot externe pakketresources, templatekopie en
representatieve nieuwsbrieftaken zijn nog niet als nieuwe skill in een host getest.
De bestaande websiteskills behouden hun read-only websiteproces. `Read`/`Write`
presentatiemetadata verleent geen servicebevoegdheden; deze instructies zijn geen
toolfilter of vervanging van service- en workspacebeleid.

Het create-schema van Loops biedt geen dupliceeractie. De skill maakt een nieuwe
lege draft en kopieert vervolgens de mailvelden uit de bron; audience en planning
worden niet gekopieerd. Bij gedeeltelijk mislukken blijft de aangemaakte draft
herkenbaar voor hervatten. Zie de [nieuwsbriefacceptatie](tests/acceptatie.md) voor
status-, revisie-, storings- en dependencychecks.

Officiële contracten: [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins),
[Loops OpenAPI](https://app.loops.so/openapi.json) via MCP-discovery en
[Loops sending settings](https://loops.so/docs/creating-emails/sending-settings).
