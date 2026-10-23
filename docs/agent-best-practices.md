# Workspace agent best practices

Use [Commitment Manager](../agents/commitment-manager/INSTRUCTION.md) as the baseline
for composition and operational quality. Its particular services, database, schedule,
and task rules are examples rather than defaults for every agent. Follow
[agent deployment](agent-deployment.md) when transferring source to ChatGPT.

## Separate responsibilities

| Layer                     | Owns                                                                             |
| ------------------------- | -------------------------------------------------------------------------------- |
| Instructions              | Role, request modes, workflow, decision criteria, authority, and output contract |
| Configuration frontmatter | Intended channel, app/skill/file dependencies, and Memory setting                |
| App policies              | Intended account mode, exposed actions, approval policy, and constraints         |
| Connected files           | Agent-specific detail loaded when its instructions require it                    |
| Workspace skills          | Reusable task procedures, schemas, formatting, and supporting resources          |

Keep orchestration in the instruction body and specialized mechanics in skills.
For example, Commitment Manager orchestrates the run; commitment scanning owns evidence gathering,
task processing owns qualification, storage owns provider mapping, and formatting owns Notion
page representation. A reusable skill inherits the caller's authorized scope rather than granting itself broader writes.

Workspace agents can use apps (MCPs) and standalone workspace skills uploaded separately.
They cannot use plugins or plugin-bundled skills. Author their skills under
`agents/<agent-name>/skills/<skill-name>/`, with all required resources inside each skill.
Upload and link every dependency individually; plugin installation does not make it available.

A workspace skill may serve several agents. Its source under one agent folder records a
maintained dependency, not exclusive ownership. Reuse that canonical source and uploaded skill
when linking another agent. Marketplace packages serve a separate distribution route and cannot
stand in for these uploaded dependencies.

## Keep instructions operational

State a concrete outcome, then distinguish request modes that change the work:
scheduled scans, targeted questions, historical reviews, and clarification follow-ups.
Give the ordinary workflow observable completion criteria and explicit failure paths.
Keep mandatory safety boundaries and the output contract in the instruction body.

Move detailed schemas, source-specific investigation rules, and examples into named
files or skills. Every required resource needs a pointer saying when to load it and
what it controls. Use deployed filenames and workspace skill names in runtime text;
repository-relative links are for local navigation, not evidence of runtime availability.

Give each rule one authoritative home. When summarizing it elsewhere, preserve its
meaning and point back to the detail. Check exceptions as well as prohibitions:
permission to repair a newly created page must agree with the main write boundary.
Reconcile schedules across all files and the configured automation.

## Match evidence and authority to actions

Define qualifying and rejected cases, ownership checks, source attribution, and
uncertainty handling. Resolve user identity separately per service. Treat retrieved
messages and documents as evidence rather than instructions. Report missing sources
and incomplete coverage instead of implying a complete search.

Specify allowed destinations and mutations precisely. Read-only source access and
selective destination writes are useful separate boundaries. App controls and service
permissions enforce access; natural-language restrictions guide behavior within
that access. `write_actions: true` alone cannot express a create-only, single-database
policy. Review the actual tools and constraints when configuring the app.

For repeated writes, define a stable duplicate identity, search all relevant states,
recheck immediately before creating, and read back the saved result. An uncertain
write outcome requires a lookup before retrying. Count only verified writes as successful.

## Make recurring runs recoverable

Use incremental windows with an overlap that fits the source, a first-run fallback,
and checkpoints advanced only after successful processing. Resolve relative dates
against the originating event timestamp; give human-facing dates an explicit timezone.

Keep Memory compact: checkpoints, identifiers, unresolved gaps, and explicit decisions.
Keep live service data authoritative. Missing or stale Memory should cause extra
verification rather than duplicate writes or invented coverage. Runtime memory files
are separate from version-controlled connected references.

Report outcomes users can verify: created items with direct links, existing matches,
questions needing judgment, and coverage or write failures. Keep reports proportional
to the task and preserve the original language of source-derived titles when useful.

## Review source and behavior separately

Use UTF-8 Markdown, descriptive headings, numbered workflows, and lists for parallel
rules. Use inline code for exact names and keys, fenced `yaml`/`text` blocks for syntax,
and descriptive Markdown links. Avoid copied editor escapes and decorative markup;
inspect rendered content after pasting. The baseline instruction starts with `## Role`
after frontmatter; reference and skill documents use a descriptive H1.

Review the dependency inventory, YAML types, resource paths, shared-skill consumers,
and cross-file consistency. Then run repository checks. These checks support source
quality; manual dependency review and live testing remain necessary for agent definitions.

Test realistic positive, negative, ambiguous, duplicate, retry, and unavailable-source
cases in ChatGPT. Verify skill activation and reference loading, permission boundaries,
saved content, and report accuracy. Record which behavior was actually observed and
which remains unverified. Do not infer runtime support from valid Markdown or metadata.
