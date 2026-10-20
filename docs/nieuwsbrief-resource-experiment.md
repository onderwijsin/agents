# Nieuwsbrief: skill-local resource experiment

## Scope and evidence

[Issue #19](https://github.com/onderwijsin/agents/issues/19) reports that ChatGPT
loads `nieuwsbrief-style-review/SKILL.md` but returns `Resource not found` for
the seven plugin-root Markdown references. Whether those files are omitted during
import or unavailable through the installed skill reader remains unknown.

The phase 1 candidate is plugin version **0.1.3** (previously 0.1.2). It moves the
seven references into `skills/nieuwsbrief-style-review/reference/` and updates
relative links. Reference rules are unchanged; only relative image links change
to keep pointing to the existing plugin-root assets. Those assets are outside
this experiment's Markdown relocation and remain unverified in the skill reader.
Catalog identities and paths remain unchanged; there is no provider overlay for
this plugin and no separate skill version.

The [Agent Skills specification](https://agentskills.io/specification) describes
skill-local `references/` and relative links from the skill root. This experiment
uses `reference/` at the maintainer’s request; the directory name is not a
claimed requirement of that specification. The
[OpenAI packaging guide](https://developers.openai.com/plugins/build/plugins)
describes bundled plugin skills. Consulted on 20 October 2026, these sources do
not establish that ChatGPT exposes arbitrary plugin-root resources to the skill
reader. Runtime testing is the gate, not structural validation.

## Workspace test record

Candidate prepared on 20 October 2026. **Runtime result: pending.** Local files
cannot establish the imported workspace revision or installed resource URIs.

| Evidence                                    | Result        |
| ------------------------------------------- | ------------- |
| Candidate plugin version                    | 0.1.3         |
| Merged Git revision consumed by marketplace | Pending       |
| Workspace sync time and result/errors       | Not performed |
| Imported plugin version                     | Not verified  |
| New chat installation and activation        | Not tested    |
| Representative style review                 | Not tested    |
| Codex / Claude runtime                      | Not tested    |

Record the exact URI used by the installed resource reader and the actual result
for each file; these relative paths are inputs to the test, not claimed URIs.

| Skill-relative path                            | Exact installed URI | Read result |
| ---------------------------------------------- | ------------------- | ----------- |
| `reference/trainees-in-onderwijs.md`           | Pending             | Not tested  |
| `reference/trainees-in-onderwijs-patronen.md`  | Pending             | Not tested  |
| `reference/linkregels.md`                      | Pending             | Not tested  |
| `reference/reviewrapport.md`                   | Pending             | Not tested  |
| `reference/onderwijs-in.md`                    | Pending             | Not tested  |
| `reference/onderwijs-in-deep-dive-template.md` | Pending             | Not tested  |
| `reference/subject-en-previewtekst.md`         | Pending             | Not tested  |

## Complete phase 1 in ChatGPT Business

1. After the candidate reaches the Git revision configured for the marketplace,
   use **Sync now** following the [distribution guide](marketplace-distribution.md).
   Record the revision, sync time, errors and imported plugin version. Confirm
   0.1.3 before testing; an old installation cannot evaluate this candidate.
2. Start a new chat with the installed plugin and Loops prerequisites available.
   Activate the reviewskill and read all seven files through the installed skill
   resource reader. Record exact URIs, successes and verbatim reader errors.
   Read contents rather than relying on installation, file listings or link resolution.
3. Check the returned contents against the corresponding repository files.
   In particular, retrieve the Trainees theme/header/footer rules, conditional
   pattern rules, required UTM parameters and review report structure from the
   four named references. Confirm transitive Markdown references also load.
4. Review an existing testdraft containing Trainees agenda or icon blocks and
   links covered by the UTM rules. Confirm findings apply the loaded team and
   pattern rules, identify incorrect UTM parameters and use the required report
   format. Record the prompt, relevant findings and any unreadable resources,
   excluding private mailing content. A read-only review is sufficient; no
   draft mutation or preview send is needed.
5. Update this record with observed evidence. If skill-local reads still fail,
   retain the exact reproducible errors and investigate the importer/reader.

Phase 2 remains gated on successful installed reads and rule application.
Release automation in [issue #4](https://github.com/onderwijsin/agents/issues/4)
must be completed before phase 2 begins, as requested. This experiment introduces
no reference-copy generator, drift check or release workflow; the moved files are
the only authored copies for this single-skill plugin.
