# Vision and development direction

Onderwijs in wants colleagues to use AI with the organization's knowledge and working methods
close at hand. Someone preparing an article, researching an education topic, or coordinating a
campaign should be able to find a relevant capability in their AI workspace and use it without
managing prompts, repositories, or developer tools.

This repository should become the maintained, open-source collection behind that experience.
It brings reusable skills, installable plugins, and clear contribution practices together.
Plugins containing one or more skills are the distribution and versioning units; repository
development skills stay separate in `.agents/skills/`. The direction described here guides future
work; it does not claim that these capabilities
are implemented. [ARCHITECTURE.md](../ARCHITECTURE.md) defines the architectural boundaries.

## The experience we want to enable

A colleague discovers a plugin through the workspace marketplace, understands what it can help
with, and installs it under the organization's workspace policies. The plugin provides reusable
capabilities that adapt to the task: editorial support should help with different articles and
audiences, rather than enforce one fixed sequence for every assignment.

Instructions should make expectations clear, request missing context when needed, and help the
colleague assess the result. Relevant references should be available when the task needs them.
The colleague should be able to understand which sources informed the work and where human
judgment remains necessary.

People who understand the work should also be able to improve the capabilities. Nontechnical
colleagues contribute examples, instructions, references, and feedback. Maintainers turn those
contributions into reviewed, distributable content. Over time, authoring organizational knowledge
should become as approachable as using it.

## Principles for growth

- **GUI-first distribution:** prioritize discovery and use through the ChatGPT Business workspace
  marketplace. Local tooling supports authors and maintainers; it should not become a requirement
  for ordinary users.
- **Portable content:** author skills in an open, Markdown-based format and keep provider-specific
  configuration small. Verify behavior on each supported host rather than promising equivalence.
- **Reusable capabilities:** organize around recurring needs in communications, editorial work,
  research, operations, and education. Bundle related skills when that makes installation clearer.
- **Open-source reuse:** share generic capabilities that other organizations can adapt. Keep private
  organizational information outside public packages.
- **Quality through ownership:** give capabilities maintainers, useful examples, review, and evidence
  of behavior. Improve them in response to actual use.
- **Proportional tooling:** add packaging, checks, or integrations when a concrete capability requires
  them. Growth in content should not automatically lead to a larger software framework.

## Development priorities

Development should proceed through useful capabilities and demonstrated needs. The stages below
express an order of learning, rather than a release schedule. They can overlap where dependencies
and available evidence allow it.

| Priority                          | Work to pursue                                                                              | Evidence needed before broadening                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Establish a useful capability     | Choose a recurring colleague task; author a focused skill with examples and an owner        | Representative users can apply it and identify useful results and limitations              |
| Prove the installation experience | Package related content and test marketplace import, installation, and updates              | A colleague can discover and use it through the intended workspace GUI                     |
| Establish practical portability   | Test the same canonical content on additional hosts and document differences                | Each claimed host supports the capability without a second authored copy                   |
| Make content easier to maintain   | Maintain plugin ownership, resource boundaries, versioning, and contributor workflows       | Shared content has clear ownership and produces self-contained packages                    |
| Introduce dynamic references      | Pilot access to published organizational references through an explicit service boundary    | Colleagues receive relevant, attributable material without exposing drafts or private data |
| Enable assisted authoring         | Add discovery, editing, validation, and publication capabilities for organizational content | Authors and reviewers can control changes reliably through their AI workspace              |

The first capabilities should be selected with colleagues, based on frequent tasks and clear
opportunities to improve consistency or reduce repeated explanation. Candidate areas include
editorial guidance, research synthesis, campaign preparation, and operational documentation.
These are discovery areas, not commitments to particular plugins.

Validation should grow alongside supported content and integrations. Extend checks for actual
manifest fields, packaged resources, and service contracts as they are introduced. Maintain
representative task examples for manual verification. Introduce broader automated evaluation
only when repeated behavior or regression risks justify the maintenance cost.

Catalog generation, packaging utilities, and release automation should follow proven maintenance
needs. The objective is reliable distribution of reviewed capabilities, not automation for its
own sake. Installation policies and connected-app access remain workspace administrator decisions.

## Dynamic references through Directus

### Why organizational knowledge needs a separate path

Some information changes more frequently than plugin instructions: terminology, editorial rules,
audience descriptions, campaign context, or internal procedures. Asking colleagues to change a
GitHub package whenever a reference changes creates friction and couples knowledge maintenance
to plugin development.

Our vision is a complementary system in which colleagues manage organizational references,
skill instructions, and capability descriptions through a remote editing and publishing interface
backed by Directus. A stable plugin from this repository would discover and retrieve appropriate
published material when needed. Updating that material would not require duplicating instructions
across plugins or distributing a new static package for every editorial change.

For example, an editorial plugin could load the published terminology and audience guidance for
an assignment. A colleague could propose a terminology update through the authoring interface,
a reviewer could publish it, and subsequent work could use the new revision. The plugin would
retain responsibility for its general workflow and explain which reference revision informed
its output.

### Ownership and execution boundaries

| GitHub-owned content                                  | Directus-managed content                                     |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| Static plugin packages, manifests, and bundled skills | Organizational references and remotely managed instructions  |
| General capability behavior and integration contracts | Content ownership, revisions, review status, and publication |
| Repository validation and provider configuration      | Access rules for organizational material                     |

GitHub remains authoritative for static content. Directus would own the organizational material
managed through that system. The integration should reference that material by stable identifiers
and retrieve it through a documented interface, rather than maintain a second editable copy in
the repository.

Reference documents and executable instructions need distinct treatment. A retrieved document
can supply facts or guidance without acquiring authority to issue new commands. Remotely managed
skill instructions would require an explicit publication and trust contract before a plugin could
use them as instructions. Fetching content alone does not install a native skill in every host;
activation and use must be designed and tested for each supported environment.

### Begin with published reference discovery

The initial integration should focus on finding and reading published references. It should let
a capability identify relevant material, retrieve the permitted revision, and attribute it in
its output. Colleagues should understand which source was used and whether it is current enough
for their task.

Before implementation, define the content model, stable identifiers, publication states,
revision selection, and service permissions. Decide how retrieval behaves when content is missing,
conflicting, outdated, or unavailable. The plugin should make such gaps visible and request the
context needed to continue; any cached fallback needs an explicit freshness and access policy.

Use a small pilot to learn whether retrieval improves real work and whether nontechnical authors
can maintain the references. That evidence should guide the schema and interface before expanding
into remotely managed skills or more complex workflows.

### Move authoring into the AI workspace

The longer-term ambition is a stable plugin that exposes organizational content management through
MCP. A colleague could ask it to find a reference, propose a revision, validate instructions, or
prepare material for review. Authorized authors and reviewers could eventually edit and publish
through their AI workspace, reducing the need to use Directus directly for routine changes.

Reading, editing, and publishing are separate capabilities. The service must enforce the user's
permissions for each operation. Changes should preserve revision history, show reviewers what
will change, and support recovery of a prior published revision. Concurrent edits and publication
must have defined behavior so one author's work cannot silently replace another's.

Directus can remain the underlying content and administration system even when the AI workspace
becomes the primary authoring interface. This is a future capability to design and validate, not
an integration or server to introduce as repository scaffolding.

## Decisions to resolve through development

The direction is clear, but several implementation choices should follow experience:

- How related skills are grouped within plugins while retaining one authored source per capability.
- Which hosts and runtime features each capability can support and who verifies them.
- How capability ownership, versions, updates, and retirement are communicated to users.
- Which organizational content belongs in public packages versus the remote content system.
- How dynamic instructions are reviewed, trusted, versioned, and activated on different hosts.
- Which Directus content model, MCP interface, authentication approach, and fallback behavior
  the pilot actually needs.

Success should be assessed through colleague experience: capabilities are easy to discover,
useful across representative tasks, understandable in their limitations, and straightforward
for their owners to maintain. Development proposals should explain which of those outcomes they
advance and what evidence will demonstrate the improvement.
