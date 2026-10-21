# Onderwijsloket: analyse van alle FAQ's

## Leesverantwoording

Op 21 oktober 2026 zijn alle via Onderwijsloket MCP beschikbare FAQ's gelezen:
zes pagina's van `list_faqs`, met `page_size: 25`, `sort: question` en zonder
filters. De laatste pagina bevatte één record en `has_more: false`.
De lijst bevatte 126 unieke ID's; voor ieder ID is het volledige antwoord met
`get_faq` opgehaald en gelezen. De antwoorden beslaan samen 34.455 tekens.

Alle 126 antwoorden waren niet-leeg, met `truncated: false`, lege
`content_warnings` en lege `relations_truncated`. De collectie bevatte vijf
Engelstalige antwoorden. Alle FAQ's hadden `source_url: null`; 33 hadden geen
gekoppeld artikel. Deze aantallen beschrijven de opgehaalde collectie op deze
datum, geen blijvende productgarantie.

De volledige collectie omvat bevoegdheden, opleidingen en toelating, functies,
onderwijsconcepten, nieuwkomers, taal, salaris en arbeidsvoorwaarden, subsidies,
pensioen, uitkeringen, herintreden en begeleiding. Er is geen thematische
steekproef toegepast. De eerdere
[analyse van tien artikelen](onderwijsloket-artikelanalyse.md) blijft aanvullend
bronmateriaal. Artikelrelaties en externe verwijzingen uit de FAQ's zijn in
deze ronde niet afzonderlijk gelezen. De analyse stelt redactionele patronen en
controlepunten vast, geen actuele wettelijke, financiële of toelatingsvoorwaarden.

## Bevindingen en verwerking

De nummers hieronder verwijzen naar het volledige leesregister. De richtlijnen
zijn redactionele aanbevelingen; aangetroffen schrijfwijzen en claims zijn niet
automatisch normen.

| FAQ's             | Waarneming                                                                                                                                   | Verwerking                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 12, 28, 38–40     | Veel antwoorden openen direct en noemen een voorwaarde of afhankelijkheid.                                                                   | Kort antwoord → bepalende voorwaarde → gerichte toelichting of vervolgstap.                                                        |
| 23–24, 65         | Bij ziekte, baanverlies en omscholing wordt naar UWV verwezen; twee vragen hebben hetzelfde antwoord.                                        | Stem uitleg en toon op de concrete vraag af; een gedeelde uitvoerder maakt de situaties niet identiek.                             |
| 51–55             | De cao-antwoorden steunen op een artikel en soms op de knop Lees meer.                                                                       | Maak antwoorden zelfstandig bruikbaar met een inhoudelijk gecontroleerde bestemmingslink.                                          |
| 63, 118           | Het Nederlandse fte-antwoord mengt punt en komma; het Engelse voorbeeld gebruikt een punt. Beide koppelen uren aan dagen.                    | Gebruik taalafhankelijke notatie en benoem de voltijdsnorm; contracturen bepalen niet vanzelf de werkdagen.                        |
| 79, 108           | De masterdefinitie bevat typfouten en een afgebroken zinsvariant; de diplomavraag bevat een verkeerde persoonsvorm.                          | Controleer hele zinnen en vraag/antwoord samen; neem zichtbare fouten niet als conventie over.                                     |
| 100, 103, 119–121 | Salarissen worden huidige genoemd zonder cao-periode in het antwoord. De Nederlandse en Engelse vo-antwoorden noemen verschillende bereiken. | Controleer cao-versie, ingangsdatum en aanstellingsomvang; kies geen bedrag op basis van taal of recentheid alleen.                |
| 75, 80–81         | Het bereik van een beperkte tweedegraads bevoegdheid wordt als vmbo respectievelijk vmbo-tl omschreven.                                      | Behandel afwijkende reikwijdte als controlepunt bij de primaire bron, niet als vrij te kiezen formulering.                         |
| 84, 91            | Herintreden wordt sectoraal en met een termijn omschreven; slapend wordt gekoppeld aan bekwaamheid.                                          | Onderscheid algemene en regelinggebonden definities en scheid geldigheid van actuele bekwaamheid.                                  |
| 73                | De VOG-definitie suggereert een algemene uitspraak over strafbare feiten.                                                                    | Formuleer taak- of functiegericht en verifieer de uitleg van het bewijsstuk.                                                       |
| 104, 107          | De vraag naar speciaal onderwijs krijgt vooral een parapluterm als antwoord.                                                                 | Definieer eerst het gevraagde type en leg daarna verwante termen uit.                                                              |
| 5, 26, 59–61, 96  | Verblijf, subsidies en leningen bevatten korte samenvattingen van voorwaarden en termijnen.                                                  | Controleer actuele regeling en individuele toepasselijkheid; voeg deze voorwaarden niet als vaste feiten toe aan stijlreferenties. |
| 126               | Een vraag naar een pabo in de omgeving verwijst naar de regiolokettennavigator.                                                              | Controleer dat bestemming en collectie passen bij de vraag naar opleidingen.                                                       |

FAQ's zonder eigen publieke URL vragen om transparante bronvermelding. Het
leesregister gebruikt daarom de echte record-ID's, zonder verzonnen URL's.
Een gekoppeld artikel is een kandidaat voor verdieping, geen automatisch
geverifieerde onderbouwing. Dat geldt ook voor vaker herhaalde antwoorden.

## Gewijzigde referenties en grenzen

In Adviesassistent zijn
[spelling](../plugins/adviesassistent/reference/spelling-en-schrijfwijze.md),
[toon](../plugins/adviesassistent/reference/toon-en-stijl.md),
[bronnencontrole](../plugins/adviesassistent/reference/bronnen-en-feitencontrole.md),
[onderwijsbegrippen](../plugins/adviesassistent/reference/onderwijsbegrippen-en-kwalificaties.md),
[Engelse content](../plugins/adviesassistent/reference/engelstalige-content.md),
[reviewcriteria](../plugins/adviesassistent/reference/redactionele-reviewcriteria.md)
en het skill-private
[contenttypen-document](../plugins/adviesassistent/reference/contenttypen-en-templates.md)
aangevuld. In Onderwijsloket zijn
[bronnengebruik](../plugins/onderwijsloket/reference/bronnen-gebruiken.md) en
[gespreksvoering](../plugins/onderwijsloket/reference/toon-en-gespreksvoering.md)
aangescherpt.

De aanbevelingen veranderen geen providercontract. De pakketten zijn nog
ontwikkelscaffolds; hun huidige startskills laden de gedeelde referenties niet.
Installatie, activatie en toepassing van de aanvullingen zijn niet op hosts
getest. De analyse is ontwikkeldocumentatie en wordt niet als runtimebron geladen.

## Volledig leesregister

De volgorde volgt de opgehaalde lijst. Artikelen telt de relaties in het
detailantwoord; het aantal zegt niets over gelezen of geverifieerde onderbouwing.

| Nr. | Vraag                                                                                          | Record-ID                              | Taal       | Artikelen |
| --- | ---------------------------------------------------------------------------------------------- | -------------------------------------- | ---------- | --------- |
| 1   | Bestaat er een bevoegdheid om les te geven op een hogeschool of universiteit?                  | `549b8c4c-f6de-41be-9879-9292436b55dd` | Nederlands | 1         |
| 2   | Bieden alle basisscholen dezelfde schoolvakken aan?                                            | `2277e0a8-423a-4ed9-99e8-503ce4a5327e` | Nederlands | 1         |
| 3   | Geef je als leerkracht op een basisschool alle schoolvakken?                                   | `fefaee61-cd04-47a4-aa22-245aad26b5d0` | Nederlands | 2         |
| 4   | Heb ik een Nederlandse bevoegdheid nodig voor het onderwijs?                                   | `dc775ce8-9b68-4050-b453-c3894c622bed` | Nederlands | 1         |
| 5   | Heb ik een verblijfsvergunning nodig om te werken in het onderwijs?                            | `34a5417c-b0a6-4ddb-9e80-020ca59c6339` | Nederlands | 2         |
| 6   | Heb je als onderwijsondersteunend personeel een bevoegdheid nodig?                             | `3a8202a1-3b7f-4905-89ee-8b2f6c8e519a` | Nederlands | 3         |
| 7   | Hoe goed moet mijn Nederlands zijn om les te geven?                                            | `77ba9175-7b47-44ba-a118-4b072540fd62` | Nederlands | 4         |
| 8   | Hoe haal ik een eerstegraads bevoegdheid?                                                      | `e8a6522b-f214-4f55-8c6a-799d28354260` | Nederlands | 2         |
| 9   | Hoe kan ik solliciteren als gastdocent?                                                        | `faedd0f1-7c88-480b-8538-1a0a98af0fd2` | Nederlands | 2         |
| 10  | Hoe solliciteer ik als zij-instromer bij een school?                                           | `e6fda004-faf5-4b28-9b03-a712334d82c6` | Nederlands | 1         |
| 11  | Hoe vind ik een baan in het onderwijs?                                                         | `17cef5ce-dac4-478a-90ee-c87183958372` | Nederlands | 8         |
| 12  | Hoelang duurt de pabo?                                                                         | `b836d81e-a0aa-404b-8170-66f3c72611f6` | Nederlands | 1         |
| 13  | Hoelang duurt een deeltijdopleiding?                                                           | `957fe4bc-3b08-4fc1-91f0-88e3003e530f` | Nederlands | 2         |
| 14  | Hoelang duurt een voltijdlerarenopleiding aan een hogeschool?                                  | `1b8c6d7b-001d-4cbb-9296-8bc20175dc52` | Nederlands | 3         |
| 15  | Hoelang duurt een zij-instroomtraject?                                                         | `bb12c5b2-da4e-4477-9daa-cbc60461c514` | Nederlands | 0         |
| 16  | Hoeveel lesuren mag ik verzorgen als gastdocent?                                               | `2bce9f07-f442-4980-a340-24916a390b2d` | Nederlands | 2         |
| 17  | I obtained my teaching qualification abroad. Can I work as a teacher in the Netherlands?       | `cbf86d57-bcca-44df-bd57-8632defbd0ad` | Engels     | 3         |
| 18  | Ik ben met de FPU gegaan, maar wil weer aan de slag voor de klas. Kan dat?                     | `96cadf84-5e8a-493f-9988-f2bdd4e60fec` | Nederlands | 0         |
| 19  | Ik heb al meer dan tien jaar geen les gegeven. Kan ik toch weer het onderwijs in?              | `ba050f7d-eeca-43da-bbe3-c213c737df5d` | Nederlands | 0         |
| 20  | Ik heb een mbo-diploma op niveau 1, 2 of 3. Kan ik naar de pabo?                               | `58982a7d-7b04-42da-aaa0-d9a0957e09fa` | Nederlands | 1         |
| 21  | Ik heb een mbo4-diploma. Kan ik naar de pabo?                                                  | `fc10cf49-3486-4359-8ce1-d87c709d927b` | Nederlands | 2         |
| 22  | Ik heb in het buitenland mijn bevoegdheid gehaald. Kan ik in Nederland aan de slag als leraar? | `9862615c-46e4-4aee-bf55-a71677e26747` | Nederlands | 7         |
| 23  | Ik werk in het onderwijs en ben arbeidsongeschikt geraakt. Wat nu?                             | `acecdf0a-49f6-48ae-8a55-55372549ace3` | Nederlands | 0         |
| 24  | Ik werk in het onderwijs, en raak mijn baan kwijt. Wat nu?                                     | `297aec8b-5369-4d5f-98e2-8251b6c9f168` | Nederlands | 1         |
| 25  | Kan ik al werken op een school terwijl mijn bevoegdheid wordt beoordeeld?                      | `4db474cc-8686-4a8b-ac40-01b0574bae04` | Nederlands | 3         |
| 26  | Kan ik als vluchteling, Oekraïens ontheemde of expat werken in het onderwijs?                  | `e776de19-9896-4d26-99ae-6addbf47ea5e` | Nederlands | 6         |
| 27  | Kan ik lesgeven in het Engels?                                                                 | `e34b3f28-494f-461b-b020-6aaf3ebd276b` | Nederlands | 0         |
| 28  | Kan ik met een PDG lesgeven in het mbo?                                                        | `e662eb2a-2a77-457a-9a0c-3fb91f350721` | Nederlands | 2         |
| 29  | Kan ik met een associate degree werken in het onderwijs?                                       | `c326b2d2-a110-4fe3-8d13-7242ddc3680c` | Nederlands | 1         |
| 30  | Kan ik met een pabodiploma lesgeven in het vmbo?                                               | `19cdf5f2-38ed-492c-b03d-f22d951508ca` | Nederlands | 3         |
| 31  | Kan ik met een tweede- of eerstegraads bevoegdheid lesgeven in het basisonderwijs?             | `3ab3af5f-47d3-468e-81c1-b450d4a0dfb3` | Nederlands | 3         |
| 32  | Kan ik zonder een bevoegdheid lesgeven?                                                        | `f8db8a1f-3473-4bca-8f4d-a51059b8968e` | Nederlands | 3         |
| 33  | Krijg ik reiskostenvergoeding bij een baan in het onderwijs?                                   | `c4f72973-d680-46d9-9568-6548710bc910` | Nederlands | 0         |
| 34  | Krijg ik vakantiegeld als onderwijspersoneel?                                                  | `a7759dce-c146-44fe-a9c2-c56cd97deeed` | Nederlands | 0         |
| 35  | Mag ik als eerste- of tweedegraads docent alle vakken geven in het basisonderwijs?             | `b24f147c-b711-484b-913b-f5e7dcbf3f33` | Nederlands | 1         |
| 36  | Mag ik na afronding van een zij-instroomtraject in alle sectoren lesgeven?                     | `2ceb49f4-0e4e-4edc-a149-a5bfdf54531f` | Nederlands | 0         |
| 37  | Moet ik een opleiding volgen om les te mogen geven?                                            | `074eeb39-ee85-4e8e-9bd6-2e1dcc373670` | Nederlands | 4         |
| 38  | Moet je in dienst zijn bij een school om een zij-instroomtraject te volgen?                    | `397873cb-991e-42be-9d1d-27b4507542dc` | Nederlands | 4         |
| 39  | Ontvang ik salaris tijdens een zij-instroomtraject?                                            | `b57ac86b-6eac-4b21-a8d0-4ad0ed1dd56c` | Nederlands | 1         |
| 40  | Sta ik bij een zij-instroomtraject direct zelfstandig voor de klas?                            | `3a496734-e61e-4b00-8c33-4dcb391a7ac9` | Nederlands | 5         |
| 41  | Uit welke onderdelen bestaat een geschiktheidsonderzoek?                                       | `31c78375-58b3-41d0-a072-5b21399b16a3` | Nederlands | 1         |
| 42  | Voor welke vragen kan ik bij het UWV terecht?                                                  | `cfead28e-4601-43c2-9ff0-90bc67997e67` | Nederlands | 0         |
| 43  | Voor wie is het PDG-traject?                                                                   | `205e1fb7-1b34-4727-9cf2-78a6e1b2ec9d` | Nederlands | 3         |
| 44  | Waar kan ik een lerarenopleiding volgen?                                                       | `e9adde0f-c159-4c5a-8b21-41038e308075` | Nederlands | 3         |
| 45  | Waar kan ik lesgeven met een diploma van de universitaire pabo?                                | `31f01851-3ce7-4b7b-ac27-d0236fbef891` | Nederlands | 0         |
| 46  | Waar kan ik lesgeven met een eerstegraads bevoegdheid?                                         | `8d178cc5-929a-4123-98eb-457a934cf4e0` | Nederlands | 3         |
| 47  | Waar kan ik lesgeven met een tweedegraads bevoegdheid?                                         | `3044c244-37cc-4cb5-91b0-2d9c2c5b1072` | Nederlands | 2         |
| 48  | Waar kan ik lesgeven met mijn bevoegdheid voor primair onderwijs?                              | `7ab14990-5a93-4792-99c9-34cffc1b00de` | Nederlands | 0         |
| 49  | Waar staat de afkorting mbo voor?                                                              | `dc87fa83-f31c-4c8d-a8f9-7a1e943c1107` | Nederlands | 2         |
| 50  | Waar staat de afkorting pabo voor?                                                             | `2b40e752-c400-4e63-ac91-6d310c722600` | Nederlands | 5         |
| 51  | Waar vind ik de cao voor het hbo?                                                              | `3e975346-8d13-4142-95a2-d1dfb557f4c4` | Nederlands | 1         |
| 52  | Waar vind ik de cao voor het mbo?                                                              | `8e0bf2af-83a5-4b73-b799-54baace8506e` | Nederlands | 3         |
| 53  | Waar vind ik de cao voor het primair onderwijs?                                                | `14fab795-4bbf-4dde-b22c-2af7d9048e8e` | Nederlands | 2         |
| 54  | Waar vind ik de cao voor het voortgezet onderwijs?                                             | `6198391d-67ba-42c7-95ad-ad36352d6b26` | Nederlands | 2         |
| 55  | Waar vind ik de cao voor het wetenschappelijk onderwijs?                                       | `b0c9a8f7-74a6-4ace-9df9-e93f205b21e7` | Nederlands | 1         |
| 56  | Waarom hoef je als docent in het mbo niet bevoegd te zijn?                                     | `381e7ad8-1f0e-4273-b49d-bca0fdb85986` | Nederlands | 2         |
| 57  | Waarom moet je een VOG aanvragen als je op een school wilt werken?                             | `c5b115d4-928f-4665-8e3a-7abca02dfe65` | Nederlands | 1         |
| 58  | Waaruit bestaat het traditioneel vernieuwingsonderwijs?                                        | `499c4e7b-70c5-43ce-9d45-fd5e7aaf90dd` | Nederlands | 0         |
| 59  | Wanneer kom ik in aanmerking voor de Lerarenbeurs?                                             | `0b1f0628-df28-4c2c-a569-a9bebea97288` | Nederlands | 1         |
| 60  | Wanneer kom ik in aanmerking voor de subsidie 'Tegemoetkoming leraren'?                        | `1bea05d4-227f-4aa7-b3ba-a225826a5cf3` | Nederlands | 1         |
| 61  | Wanneer kom ik in aanmerking voor de subsidie 'Tweede lerarenopleiding'?                       | `bdf34ef4-a135-48e4-8847-3e2d73ae2d51` | Nederlands | 1         |
| 62  | Wanneer moet ik een 21+-toets maken?                                                           | `0218b2d4-e807-4a72-b183-8a8a2e6b4a9f` | Nederlands | 1         |
| 63  | Wat betekent 'fte'?                                                                            | `dcc94f03-75d4-45ba-bcb2-d2b578c333f9` | Nederlands | 1         |
| 64  | Wat doet een instructeur in het mbo?                                                           | `213be6ba-a76c-452b-8cb9-a95158de6ae2` | Nederlands | 1         |
| 65  | Wat gebeurt er met mijn uitkering als ik me laat omscholen?                                    | `c7be78b6-c528-4b3d-b3d4-6c3e44c7f1d4` | Nederlands | 1         |
| 66  | Wat is 'bijzonder onderwijs'?                                                                  | `898489aa-cd4b-4dbb-9d81-b0df2835b780` | Nederlands | 0         |
| 67  | Wat is 10-14-onderwijs?                                                                        | `28d2db8b-3294-4b12-a2f9-0a71b24227f5` | Nederlands | 2         |
| 68  | Wat is de studiebelasting van een zij-instroomtraject?                                         | `2cc6cdf0-2317-47b4-ae73-3974d62798fb` | Nederlands | 0         |
| 69  | Wat is een BKO/BDB?                                                                            | `a30ea9e0-f100-4976-8636-17e60cd99a23` | Nederlands | 1         |
| 70  | Wat is een EVC?                                                                                | `cf3d6907-9d80-4e5d-9d4a-d87fdc8bb45b` | Nederlands | 0         |
| 71  | Wat is een PDG-traject?                                                                        | `a1f6d5da-8ff9-492b-8946-d5e427396a53` | Nederlands | 3         |
| 72  | Wat is een PhD?                                                                                | `082a0cb8-8caf-4dd2-9319-076c11c7ab3b` | Nederlands | 2         |
| 73  | Wat is een VOG?                                                                                | `f49b7049-c819-49b8-9bd1-fc57e5562bb1` | Nederlands | 1         |
| 74  | Wat is een bekwaamheidsverklaring?                                                             | `3ca7dc72-016b-4c45-a79d-0fa16755c638` | Nederlands | 0         |
| 75  | Wat is een beperkte tweedegraads bevoegdheid?                                                  | `8e1c4d8a-bb5d-4828-b81b-94047648e075` | Nederlands | 2         |
| 76  | Wat is een deeltijdopleiding?                                                                  | `de0c8a7c-18e6-4115-827d-7e4f037d45ca` | Nederlands | 4         |
| 77  | Wat is een derdegraads bevoegdheid?                                                            | `b4cbf1c3-8289-4ada-877e-3329a4430333` | Nederlands | 0         |
| 78  | Wat is een dubbele bevoegdheid?                                                                | `3ad213b9-2e27-4f8c-824a-38ec28b84079` | Nederlands | 2         |
| 79  | Wat is een educatieve master?                                                                  | `194a3442-b291-426a-afef-d162c5dea0aa` | Nederlands | 4         |
| 80  | Wat is een educatieve minor?                                                                   | `62294d56-a8f2-4909-a390-ba25894dde19` | Nederlands | 1         |
| 81  | Wat is een educatieve module?                                                                  | `43aab57f-e4d9-4f21-af3b-3d92e9fac527` | Nederlands | 2         |
| 82  | Wat is een eerstegraads bevoegdheid?                                                           | `150bcafc-4052-4925-9671-d977cb354d42` | Nederlands | 8         |
| 83  | Wat is een geschiktheidsonderzoek?                                                             | `1c9d7978-cac5-48c5-b270-388e6de75953` | Nederlands | 6         |
| 84  | Wat is een herintreder?                                                                        | `ea677735-7947-46f3-b9ad-e478ba9976c9` | Nederlands | 2         |
| 85  | Wat is een intern begeleider (IB'er)?                                                          | `0de5db16-ad30-4bc9-865d-057a0f79aa12` | Nederlands | 1         |
| 86  | Wat is een kopopleiding?                                                                       | `e0c5ff0a-eeeb-4c16-a8b4-296ae225c0c5` | Nederlands | 2         |
| 87  | Wat is een onderwijsassistent?                                                                 | `77f4d847-2a87-447c-98bb-1b91e9bd45d2` | Nederlands | 4         |
| 88  | Wat is een post-hbo-opleiding?                                                                 | `1e1315af-5827-42ef-97c0-d722aafae8a6` | Nederlands | 1         |
| 89  | Wat is een praktijkopleider?                                                                   | `eaad578a-1aa8-4cf1-ac7a-e68b3a89203b` | Nederlands | 0         |
| 90  | Wat is een remedial teacher?                                                                   | `fe5a1210-c6c9-4619-b934-cffd1cb6f342` | Nederlands | 0         |
| 91  | Wat is een slapende bevoegdheid?                                                               | `a75c6ac8-f2a5-4420-b639-efee618b6eff` | Nederlands | 0         |
| 92  | Wat is een tweedegraads bevoegdheid?                                                           | `9f90823a-903d-4135-9172-756bbac00b7a` | Nederlands | 6         |
| 93  | Wat is een ulo?                                                                                | `3b4b7c1d-ca0d-4454-bbc4-6c68027648af` | Nederlands | 4         |
| 94  | Wat is een zij-instroomtraject?                                                                | `13c9e5af-9398-4f0c-8b88-417898b77f27` | Nederlands | 6         |
| 95  | Wat is het ABP?                                                                                | `353e2d08-778c-454e-bf1f-eb5e962b7fbc` | Nederlands | 0         |
| 96  | Wat is het Levenlanglerenkrediet?                                                              | `f9e50292-4a1f-4b86-b041-d8edd6df76fb` | Nederlands | 0         |
| 97  | Wat is het hoger onderwijs?                                                                    | `a7169a1a-2216-4b51-b2c4-f16940fa6e03` | Nederlands | 2         |
| 98  | Wat is het lwoo?                                                                               | `9cbda9e5-c3c4-4f83-98c8-f19773caad2d` | Nederlands | 1         |
| 99  | Wat is het praktijkonderwijs?                                                                  | `23de3a9d-99f9-4c4c-b69c-21ae7a1304ab` | Nederlands | 2         |
| 100 | Wat is het salaris van een docent in het mbo?                                                  | `cbf76cdf-9def-45b1-be03-072154e73c99` | Nederlands | 3         |
| 101 | Wat is het salaris van een leraar in het basisonderwijs?                                       | `5c9eaf14-3960-41ac-ad9f-1b6eea453328` | Nederlands | 2         |
| 102 | Wat is het salaris van een leraar in het speciaal onderwijs?                                   | `d31f7b05-be9e-4f22-be81-676ed6fef3da` | Nederlands | 2         |
| 103 | Wat is het salaris van een leraar in het voortgezet onderwijs?                                 | `da3f6a95-dccc-43b8-ab10-e840ea81faf6` | Nederlands | 2         |
| 104 | Wat is het speciaal onderwijs?                                                                 | `446653bb-587c-4168-be3a-a1430c763e8f` | Nederlands | 2         |
| 105 | Wat is het vavo?                                                                               | `3e2ba2bd-cbf7-4131-84aa-171bd41f34b4` | Nederlands | 2         |
| 106 | Wat is het verschil tussen een bol- en een bbl-opleiding?                                      | `59dcddb3-ba6d-4b30-9193-d6a6a35537d1` | Nederlands | 0         |
| 107 | Wat is primair onderwijs?                                                                      | `cbd20e88-d20a-48fb-9e36-b7582f3ab4fd` | Nederlands | 2         |
| 108 | Wat voor diploma krijg ik nadat ik een zij-instroomtraject hebt afgerond?                      | `a16e0518-9adc-48f2-9f80-acbed118895c` | Nederlands | 0         |
| 109 | Wat zijn ECTS?                                                                                 | `454ca2d8-f812-4e98-a0ae-72fb5da975db` | Nederlands | 0         |
| 110 | Wat zijn de minimale toelatingseisen voor de pabo?                                             | `e9ec5c72-a0b1-4859-b91d-deab34294651` | Nederlands | 3         |
| 111 | Wat zijn de vooropleidingseisen voor het PDG-traject?                                          | `41c7ea45-d56d-4e3a-b1a6-3ebd49f40be2` | Nederlands | 3         |
| 112 | Wat zijn primaire arbeidsvoorwaarden?                                                          | `11d26ef1-35dd-499a-b8ad-71ee0666b16e` | Nederlands | 1         |
| 113 | Wat zijn secundaire arbeidsvoorwaarden?                                                        | `c211e677-7cb5-4803-ac49-c0607c6705f3` | Nederlands | 0         |
| 114 | Welke diploma’s krijg je na het afronden van de universitaire pabo?                            | `551f63c5-4581-4f47-ac6f-24c1d54379d3` | Nederlands | 0         |
| 115 | Welke gastlessen kan ik geven?                                                                 | `e3587e92-3097-4b2b-9935-cef5114585e6` | Nederlands | 1         |
| 116 | Welke opleidingen tot instructeur zijn er?                                                     | `f9322b6e-1302-42f6-a281-b637bcb91f6f` | Nederlands | 1         |
| 117 | Welke routes naar het leraarschap zijn er?                                                     | `30c34277-61cf-4ce6-a28b-cac2354396cb` | Nederlands | 1         |
| 118 | What does ‘FTE’ mean?                                                                          | `d87ac2e0-3e1a-4f11-8618-a87d06aae1a6` | Engels     | 0         |
| 119 | What is the salary of a primary school teacher in the Netherlands?                             | `4b8330c2-db09-4736-a221-396ffd33ac42` | Engels     | 0         |
| 120 | What is the salary of a secondary school teacher in the Netherlands?                           | `2e31c653-0e36-434c-9636-f020137a49c6` | Engels     | 0         |
| 121 | What is the salary of a teacher in secondary vocational education (MBO)?                       | `a065f9f8-578c-4c50-9672-0e416c53ac3b` | Engels     | 0         |
| 122 | Wie voert het geschiktheidsonderzoek van een zij-instroomtraject uit?                          | `23513037-6a80-4516-830a-66c5eb135bc1` | Nederlands | 3         |
| 123 | Word je als startende leraar begeleid?                                                         | `13219145-22f5-4ee3-84d3-e1876d754cf5` | Nederlands | 3         |
| 124 | Word je als zij-instromer begeleid?                                                            | `690c4e10-b7d0-48f9-93d9-4bca4c552e82` | Nederlands | 0         |
| 125 | Worden vakanties in het onderwijs doorbetaald?                                                 | `a4a5c77d-688d-4701-99a4-3e1c79887f7f` | Nederlands | 0         |
| 126 | Zit er een pabo-opleiding in mijn omgeving?                                                    | `98480fe5-a27b-4c00-b93e-6c9108a9dc62` | Nederlands | 2         |
