# Agent-instructie

Een plugin met één skill voor het schrijven en verbeteren van Nederlandstalige prompts,
skills en andere AI-instructies voor niet-technische taken. De plugin helpt de gebruiker
naar een direct bruikbare instructie met duidelijke eisen en controleerbare resultaten.

## Gebruik

Installeer de plugin via de workspace-marketplace en beschrijf de taak of geef een bestaande
instructie mee. De skill gebruikt Nederlands en vraagt om ontbrekende informatie wanneer die
het resultaat wezenlijk verandert. Programmeertaken en technische agentconfiguratie vallen
buiten het toepassingsgebied.

Voorbeelden:

- “Verbeter deze prompt voor het redigeren van een nieuwsbrief.”
- “Maak een skill voor het voorbereiden van een werkplanning.”
- “Beoordeel of deze onderzoeksinstructie duidelijk genoeg is.”

Er zijn geen MCP-verbindingen, gekoppelde apps, accounts of aanvullende bestanden nodig.
De canonieke skill staat in [skills/agent-instructie/SKILL.md](skills/agent-instructie/SKILL.md).
De versie in `plugin.json` geldt voor de hele plugin, inclusief de skill.

## Packaging en verificatie

Het pakket volgt de [OpenAI packaging guide](https://developers.openai.com/plugins/build/plugins)
en de [Agent Skills specification](https://agentskills.io/specification).
ChatGPT en Codex ontdekken de skill binnen het portable pakket. Beide repositorycatalogi
verwijzen naar deze plugin. Volgens de
[Claude manifest reference](https://code.claude.com/docs/en/plugins/manifest-reference)
is een Claude-manifest optioneel voor skills in de standaardmap `skills/`; daarom is geen
compatibiliteitsoverlay toegevoegd. Claude gebruikt dan de naam uit de marketplace-entry.

Structurele validatie controleert het manifest, beide catalogi, skillmetadata en lokale links.
Installatie, activatie, resource loading en taakuitvoering in ChatGPT, Codex en Claude zijn
voor deze nieuwe plugin nog niet geverifieerd. Marketplace-compatibiliteit is geen bewijs
van identiek runtimegedrag.

Controleer bij hosttests dat de plugin installeert, de gebundelde skill laadt en bij de
voorbeelden hierboven activeert. Probeer ook een programmeertaak om de activatiegrens te
controleren en beoordeel of het resultaat een bruikbare Nederlandstalige instructie is.
