# Mapping Notion task databases

## Discovery and required fields

Accept `destination` or the Notion-specific `database_id` alias from the invocation. Normalize
Notion UUIDs with or without hyphens and accept database URLs with view/query parameters;
extract the database identity, then verify it live. Never use the view parameter as destination.
Conflicting aliases require clarification before dependent operations.

Use the connector's actual capabilities and write syntax. Database IDs, data source IDs and
view IDs are distinct. Fetch the database, select its actual data source, and inspect its live
property names/types, options and writable requirements. Connector-specific collection URIs are
usable only when returned or documented by that connector. Never manufacture them from database IDs.

The sole title property is normally unambiguous. Map owner, status, deadline, planned date,
recipient, context and source fields by explicit configuration or clear schema semantics.
Names alone are insufficient where several properties could fit. Resolve people using service
metadata, not copied cross-service IDs. Do not assume a task's creator is its owner.

Map lifecycle options to open/completed/cancelled. Completion groups can help, but distinguish
cancelled from completed using actual options and context. Unknown states block decisions that
rely on lifecycle. Select an unambiguous open initial state or require `initial_status`.
If lifecycle exists only in body text, require an explicit convention and adequate body retrieval.
If the destination requires a value that cannot be resolved, block creation.

## Override example

These are optional semantic hints for a particular schema, not required property names:

```yaml
field_mappings:
  title: Actie
  status: Status
  owner: Eigenaar
  deadline: Uiterste datum
  planned_for: Gepland voor
  recipient: Toegezegd aan
  context: Onderdeel van
  source_id: Bron-ID
  source_url: Bronlink
status_mappings:
  open: [Backlog, Not started, Next up, In progress, In review, Hold for input]
  completed: [Done]
  cancelled: [Cancelled]
initial_status: Not started
property_defaults:
  Soort: Taak
```

Validate every supplied mapping and default against the live schema. Defaults must not replace
source-grounded ownership or dates, or set generated/read-only fields. Optional next-action owner,
parent tasks and task types require explicit mapping and evidence when used. Keep accountability
separate from whoever holds the next action. Never copy deadline into planned date automatically.

For fields without dedicated properties, use concise native body blocks with labels for commitment,
owner, recipient, agreement timestamp, deadline, planned date, context, source references and stable
commitment identity; omit absent values. Preserve enough machine-readable literal identity text for
future retrieval, and verify it after saving. The processor supplies the identity and aliases.

## Provider evidence

Checked 2026-10-23 against Notion's official
[database guide](https://developers.notion.com/guides/data-apis/working-with-databases):
databases contain data sources, and data source schemas define page properties. Actual connector
operations and formatting differ from the public API; inspect live tools rather than hardcoding
API payloads. Installation, connector support, mapping inference and writes remain runtime-unverified.
