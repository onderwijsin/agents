# Adviesassistent Onderwijsloket

Ontwikkelscaffold voor adviseurs van Onderwijsloket en andere begeleidende professionals.
De pakketnaam is `adviesassistent`; de weergavenaam is Adviesassistent Onderwijsloket.

## Startpunt

Het pakket bevat één eerste skill: `adviesvraag-onderbouwen`. Dit is een tijdelijke basis voor
brononderzoek en geen onderdeel van de gekozen definitieve skillset. De werkwijze
wordt bij uitwerking opgenomen in de vijf geplande professionele skills.
Voorbeeld: “Onderbouw mijn antwoord op een vraag over zij-instroom.”
Installeer het hele pakket en verbind de host met Onderwijsloket Assistent.

De gekozen skillset staat in `SPEC.md` in de repositoryroot. Skills worden één voor
één uitgewerkt met referenties die de gebruiker op dat moment aanlevert.

## Dezelfde bronverbinding

Beide Onderwijsloket-plugins gebruiken dezelfde
[Onderwijsloket Assistent](https://github.com/onderwijsin/onderwijsloket-assistent).
Beide pakketten koppelen via `.app.json` dezelfde geregistreerde ChatGPT-app:
`asdk_app_6ad7ee6307588191b1302257d85671cc` (door de gebruiker aangeleverd).
Het manifest verwijst ernaar via `extensions.com.openai.apps`, volgens de
[OpenAI-pluginhandleiding](https://developers.openai.com/plugins/build/plugins).
Appbeschikbaarheid en rechten worden afzonderlijk door de workspace beheerd.
De mapping en toegang zijn nog niet in ChatGPT getest. Een deployment-URL voor
rechtstreekse MCP-configuratie op andere hosts is nog nodig; er is geen `mcp.json`
of provider-overlay opgenomen.
De API-documentatie-app is een andere verbinding en vervangt deze inhoudsbron niet.

De kenniscollecties zijn alleen-lezen. De server biedt daarnaast boeken en feedback
indienen; die acties hebben eigen bevestigings- en toestemmingsvereisten.
Dit pakket biedt daarvoor nog geen workflow. Het biedt ook geen inbox, CRM,
CMS-publicatie of vacaturebank. Eventuele concepten blijven in de chat.
Verschillende doelgroepen leveren geen verschillende servicerechten op.

## Packaging en verificatie

De structuur volgt [Agent Plugins 1.0.0](https://agent-plugins.org/specification)
en de [Agent Skills-specificatie](https://agentskills.io/specification),
geraadpleegd op 21 oktober 2026. Beide repositorycatalogi bevatten dit pakket.
Dat bewijst geen runtimecompatibiliteit. Beoogd zijn ChatGPT/Codex en, na
verificatie van de verbinding, Claude Code; geen van deze hosts is getest.

Voor uitrol: appmapping controleren, installatie en skillactivatie testen,
brontoegang controleren en de voorbeeldvraag met bronlinks beantwoorden.
Test ook ontbrekende toegang, lege resultaten en onvolledige broninhoud.
Repositorychecks: `pnpm format` en `pnpm check`.

## Onderbouwing van de referenties

De artikelanalyse in `docs/onderwijsloket-artikelanalyse.md` in de repositoryroot
verantwoordt de
redactionele aanscherpingen op basis van tien volledig via Onderwijsloket MCP
gelezen artikelen. De gedeelde referenties zijn voorbereid voor verdere
skilluitwerking; de huidige startskill laadt ze nog niet. De analyse is
ontwikkeldocumentatie en geen runtimevereiste van het pakket.

De aanvullende analyse in `docs/onderwijsloket-faq-analyse.md` verantwoordt de
lezing van alle 126 beschikbare FAQ's en de daaruit afgeleide aanscherpingen.
Het leesregister gebruikt record-ID's omdat de FAQ's geen eigen publieke URL
teruggeven. Ook deze analyse is ontwikkeldocumentatie.

De analyse in `docs/onderwijsloket-ervaringsverhalen-analyse.md` onderbouwt de
aanvullingen over persoonlijke stemmen, citaten, verhaalopbouw en mediaselectie
met tien volledig gelezen ervaringsverhalen. Ook deze analyse is ontwikkeldocumentatie.
