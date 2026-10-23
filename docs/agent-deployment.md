# Deploying workspace agents and skills

Workspace agents live in `agents/<agent-name>/`. Git holds the maintained source;
the deployed agent runs in ChatGPT. Our supported deployment workflow is manual
configuration and copying in the ChatGPT web UI. There is no repository agent
marketplace integration, importer, or synchronization command. This is a repository
limitation, not a claim that all ChatGPT deployment tooling is unavailable.

Use [Commitment Manager](../agents/commitment-manager/INSTRUCTION.md) as the layout
baseline and [agent best practices](agent-best-practices.md) for authoring decisions.
The YAML files record intended configuration; they are not an official ChatGPT
import schema. Do not upload them expecting ChatGPT to configure itself.

## Dependency boundary

Workspace agents can use apps (MCPs) and standalone workspace skills. They cannot use plugins
or plugin-bundled skills. Installing a marketplace plugin does not expose its skills to an agent.
Keep shared manually uploadable sources under root `skills/<skill-name>/`, outside plugin
manifests, marketplace catalogs and plugin versioning. Upload each source once to the workspace.
A skill can be used standalone, attached to one or more agents, or both; attaching it reuses that
workspace skill instead of packaging or copying its source into an agent. Subsequent Git edits
require a manual workspace update. Marketplace synchronization does not update skills in root
`skills/` or agent definitions.

Each skill's upload includes `SKILL.md`, its `references/` directory and any required assets,
scripts or presentation metadata. Upload every named dependency independently, including skills called by other skills.
A local path or a skill name in instructions does not itself upload, link or grant access.
See the [Commitment Manager checklist](../agents/commitment-manager/README.md) for a concrete set.

## Source layout and dependency declarations

```text
agents/<agent-name>/
  README.md
  INSTRUCTION.md
  apps/<app-id>.yaml
  files/<reference-name>.md
skills/<skill-name>/
  SKILL.md
  references/<topic>.md
  assets/<asset-name>
  scripts/<helper>
```

References, assets and scripts are optional; keep required resources inside the skill's upload
boundary. App policies and connected files remain local to their agent, even when the agents
share a skill. Agent-local `skills/` directories are rejected.

Agent instruction frontmatter records the intended settings and dependencies, including empty
lists when no dependency of that type is needed:

```yaml
---
channel: chatgpt
apps: [notion]
skills: [task-storage, notion-task-storage, notion-formatting]
files: [agent-reference.md]
memory: true
---
```

This is a syntax example, not a complete deployable agent. App IDs resolve to the agent's
`apps/<id>.yaml`, skill names to root `skills/<name>/SKILL.md`, and connected filenames to its
`files/` directory. Current connected-file names use lowercase kebab-case with `.md`; app IDs
may also contain underscores, such as `microsoft_outlook_email`.

Each root skill requires `metadata.agents`, listing exactly the agent directory names that declare
it. Keep both sides and the root README inventories current when adding/removing dependencies.
Standalone-only skills use `agents: []`; standalone use itself requires no agent entry. See
[skill authoring](creating-skills.md) for the full skill format and shared-change review.
The array is a repository extension outside the standard string-only metadata contract; its
upload acceptance is unverified. Verify acceptance in the target host before updating live skills.

## Standalone workspace skill setup

Upload the root skill directory and its resources in the workspace skills editor, or reconcile
an existing uploaded skill with that source. Make any separately required apps and named skill
dependencies available through the host. Test a representative direct invocation and resource
loading in a fresh chat. Updating an uploaded skill may also affect attached agents; review the
consumer list and test those workflows before applying a shared change. Use the agent steps below
only when an agent also consumes the skill.

## Source-to-workspace mapping

| Source                                                      | Manual destination                                                             |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `agents/<name>/INSTRUCTION.md` YAML frontmatter             | Agent settings and dependency checklist                                        |
| `agents/<name>/INSTRUCTION.md` body after the closing `---` | Agent builder prompt below, then verify the saved instructions                 |
| `agents/<name>/apps/<app-id>.yaml`                          | Connected app account, actions, approval policy, and constraints               |
| `agents/<name>/files/<filename>`                            | Agent's connected files, preserving the referenced filename                    |
| Root `skills/<skill-name>/` standalone source               | Workspace skill managed in the ChatGPT skills editor, then linked to the agent |

The baseline lists `channel`, `apps`, `skills`, `files`, and `memory`. App IDs match
the YAML filename stems; skill names match skill directory/frontmatter names;
file entries match files directly under `files/`. A skill's own references and assets
belong with that workspace skill, rather than in the agent's connected files.

## Prepare the change

1. Read the full definition, app policies, connected files, and required skills.
   Check that each listed dependency resolves and that runtime references use names
   available in ChatGPT rather than repository paths.
2. Run `pnpm validate` and review the workspace skill consumer index before changing a shared
   skill. Keep agent `skills` lists and each shared skill's `metadata.agents` array consistent;
   fix invalid declarations before relying on the index. Review every consumer for input/output
   and authority compatibility. Compare the intended source with the existing workspace agent and skills.
   Reconcile UI-only changes into Git before overwriting them. Identify other agents
   using any shared skill whose behavior will change.
3. Resolve contradictions across instructions, connected references, skills and settings. Keep
   caller-specific authority intact, including Commitment Manager's same-run formatting-repair
   exception. The host owns any actual schedule; save invocation configuration with that schedule
   for agents that resolve settings per run. Preserve intentional fixed configuration elsewhere.
4. Confirm workspace access, required app connections, and the target data permissions.
   Keep credentials, private communications, and runtime history out of Git.

## Apply in the web UI

1. Open or create the intended workspace agent. Review its name, description,
   channel, model settings, Memory setting, and sharing. `memory: true` records a
   setting to apply; it does not create the named runtime history file. Settings
   absent from the source need an explicit deployment choice, recorded in the review.
2. Add the apps listed in frontmatter. For each app, translate its policy YAML into
   available UI controls: account type, read/write actions, action-safety setting,
   and any supported constraints. Confirm the connected account is the intended one.
   Where a control cannot express the requested restriction, document the gap and
   resolve it before enabling affected writes. Instruction text does not enforce
   service permissions. Broad app access may exceed the agent's narrower task scope.
3. Open the separate **ChatGPT skills editor**. Upload each standalone skill with its resources.
   Create missing workspace skills or update the existing shared skill from its root source,
   including references, assets, scripts and applicable presentation metadata. Review shared-skill changes with their
   other consumers. Agent builder skill linking alone does not edit skill content.
4. Return to the agent builder and link each required workspace skill. Verify the
   selected skill's identity and content; matching display names alone are insufficient.
5. Create or edit every connected file from `files/`, preserving names used in
   instructions. Remove obsolete attachments only when part of the intended change;
   avoid retaining two conflicting versions under similar names.
6. Give the agent builder the prompt under **Transfer instructions** below.
   Include only the Markdown body of `INSTRUCTION.md`, excluding YAML frontmatter
   and its delimiter lines. Have the builder resolve named files and skills into
   actual agent references, then inspect the saved instructions for formatting.
7. Configure the intended schedule separately if needed, including its timezone.
   A schedule written in instructions does not create an automation. Save and test
   the draft before updating the live agent through the UI's available controls.

UI labels and available settings may vary. The source describes intent; inspect
the actual controls rather than assuming a one-to-one mapping for each YAML key.

### Transfer instructions

Directly pasting Markdown into the agent instructions editor can insert it as a
string literal rather than formatted instructions. Use this builder prompt instead:

```text
Add these instructions unchanged except for converting the named app, file and skills
into their actual agent references. When you are done, check the formatting of the
instructions. Make sure there are no formatting errors like unintended line breaks.

---

[INSTRUCTION.md contents]
```

Replace the placeholder with the Markdown body after the closing frontmatter
delimiter. The `---` in the prompt separates the request from the instruction body;
it is not part of the saved instructions. Make the connected files and workspace
skills available before resolving their references.

Compare the saved instructions with the source, allowing only the intended reference
conversions. Check headings, lists, code blocks, unintended line breaks, literal
quotes or escaped newlines, and that references resolve to the correct resources.
The builder's confirmation does not replace this inspection.

## Verify and record deployment

Reopen the saved configuration and compare settings, app access, linked skills,
instructions, connected filenames, and file contents with the source. Confirm the
agent can load required references and invoke the intended skills in a preview.

Exercise a clear qualifying task, a nonqualifying request, a duplicate, an ambiguous
case, a missing source, and missing or stale Memory. For a write-capable agent, use
an authorized test destination to verify read-back and safe retry behavior. A preview
may perform real actions; choose test inputs and access accordingly. For Commitment
Manager, verify existing tasks remain unchanged and that a second scan creates no duplicate.

Record the source revision or reviewed diff, deployed agent identity, date, changed
shared skills, settings not represented in source, checks performed, and remaining
gaps in the deployment review. Do not claim deployment or host verification from
local formatting and lint checks alone. Repository validation checks frontmatter types, dependency
existence and resource boundaries; it does not validate live configuration or behavioral compatibility.

For later edits, repeat this comparison and manual-update process. To roll back, restore the
previous source contents in each affected UI surface and verify again; reverting
Git alone leaves the live agent and shared skills unchanged.

## Provider evidence and compatibility

Checked on 2026-10-23: OpenAI's [Skill controls](https://learn.chatgpt.com/docs/enterprise/skills)
distinguishes workspace skill lifecycle controls, filesystem distribution, and plugin
installation. Moving files does not transfer workspace ownership or connector authorization.
The workspace-agent restriction above is a maintainer-reported platform constraint confirmed
for this repository on 2026-10-23, not inferred from plugin packaging or independently runtime-tested.
The linked official controls describe skill governance; they do not establish plugin availability
inside workspace agents. Our manual procedure and local YAML conventions are based on the supplied agent
baseline and maintainer workflow, not a verified provider round-trip format.
The Markdown string-literal paste issue and builder-prompt workaround were reported
by the maintainer on 2026-10-23; they have not been independently reproduced here.
No live ChatGPT installation, permissions, schedule, or task execution is established
by this guide. Recheck current official documentation and the target workspace when
changing deployment assumptions; marketplace support is not presumed.
