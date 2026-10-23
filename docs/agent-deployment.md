# Deploying workspace agents

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
Keep manually uploadable sources under `agents/<agent-name>/skills/<skill-name>/`, outside plugin
manifests, marketplace catalogs and plugin versioning. A skill reused by another agent retains
one canonical source; each agent must link the separately uploaded workspace skill.

Each skill's upload includes `SKILL.md`, its `references/` directory and any assets or presentation
metadata. Upload every named dependency independently, including skills called by other skills.
A local path or a skill name in instructions does not itself upload, link or grant access.
See the [Commitment Manager checklist](../agents/commitment-manager/README.md) for a concrete set.

## Source-to-workspace mapping

| Source                                                 | Manual destination                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `INSTRUCTION.md` YAML frontmatter                      | Agent settings and dependency checklist                                        |
| `INSTRUCTION.md` Markdown body after the closing `---` | Agent instructions editor                                                      |
| `apps/<app-id>.yaml`                                   | Connected app account, actions, approval policy, and constraints               |
| `files/<filename>`                                     | Agent's connected files, preserving the referenced filename                    |
| `skills/<skill-name>/` standalone source               | Workspace skill managed in the ChatGPT skills editor, then linked to the agent |

The baseline lists `channel`, `apps`, `skills`, `files`, and `memory`. App IDs match
the YAML filename stems; skill names match skill directory/frontmatter names;
file entries match files directly under `files/`. A skill's own references and assets
belong with that workspace skill, rather than in the agent's connected files.

## Prepare the change

1. Read the full definition, app policies, connected files, and required skills.
   Check that each listed dependency resolves and that runtime references use names
   available in ChatGPT rather than repository paths.
2. Compare the intended source with the existing workspace agent and skills.
   Reconcile UI-only changes into Git before overwriting them. Identify other agents
   using any shared skill whose behavior will change.
3. Resolve contradictions across instructions, references, and settings. Commitment Manager's
   actual schedule belongs to the host automation; put destination and account configuration in
   its saved invocation prompt. Preserve its explicit same-run formatting-repair exception.
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
   Create missing workspace skills or
   edit existing ones from their canonical source, including referenced resources
   and applicable presentation metadata. Review shared-skill changes with their
   other consumers. Agent builder skill linking alone does not edit skill content.
4. Return to the agent builder and link each required workspace skill. Verify the
   selected skill's identity and content; matching display names alone are insufficient.
5. Copy only the Markdown body of `INSTRUCTION.md` into the instructions editor.
   Exclude the YAML frontmatter and its delimiter lines.
6. Create or edit every connected file from `files/`, preserving names used in
   instructions. Remove obsolete attachments only when part of the intended change;
   avoid retaining two conflicting versions under similar names.
7. Configure the intended schedule separately if needed, including its timezone.
   A schedule written in instructions does not create an automation. Save and test
   the draft before updating the live agent through the UI's available controls.

UI labels and available settings may vary. The source describes intent; inspect
the actual controls rather than assuming a one-to-one mapping for each YAML key.

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
local formatting and lint checks alone. Existing repository validation does not
validate the agent YAML contract or its live configuration.

For later edits, repeat this comparison and sync process. To roll back, restore the
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
No live ChatGPT installation, permissions, schedule, or task execution is established
by this guide. Recheck current official documentation and the target workspace when
changing deployment assumptions; marketplace support is not presumed.
