---
name: notion-task-storage
description: Discover a configured Notion task database, map its live schema, search all task states, and create and verify authorized tasks. Use as the Notion provider for task-storage; accepts destination and mapping overrides without personal database defaults.
license: MIT
---

# Notion task storage

Receive normalized records from `task-storage` and the caller's authority. Consult
[Notion mapping](references/notion-mapping.md) before discovery, querying or writing.

1. Fetch the configured database or URL through the current connector. Resolve its underlying
   data source and canonical identity; view parameters are not writable collection identifiers.
   If multiple data sources could fit, require an explicit selection. Verify access and fetch
   the live schema once per run and again if a write reports schema drift.
2. Resolve property/status overrides against actual types, options and IDs. Infer only
   unambiguous mappings. Resolve the intended human's Notion identity independently of other
   services; use the authenticated account only when metadata establishes it is that human.
   Report ambiguous required mappings before writing; never modify the schema to make it fit.
3. Query the resolved data source with pagination, including completed and cancelled tasks.
   Search dedicated source fields and body evidence as well as titles, descriptions, recipients
   and context. Saved views and title search alone do not establish absence. If the connector
   cannot cover relevant records or body evidence, return incomplete rather than permitting creation.
4. Return normalized lifecycle states and actual records for the processor's duplicate decision.
   Preserve source identity even when stored only in body text. Fetch potential matches when
   property-only results omit evidence or enough context for comparison.
5. Before an authorized creation, repeat duplicate checks and confirm the exact parent data
   source. Map only supported values; apply `notion-formatting` for body creation. Store concise
   context, owner meaning, dates without dedicated fields, evidence and stable identity there.
   Leave unsupported optional properties unset and report any material mapping limitation.
6. Fetch the created page to verify parent, title, intended initial lifecycle, ownership,
   dates, evidence, stable identity and body structure. Return its actual ID and returned URL;
   include a numeric display ID only if the schema provides one. For uncertain responses, search
   before retrying. Keep one writer within the run; Notion offers no uniqueness guarantee here.

Existing tasks remain unchanged under Commitment Manager. A formatting-only repair of a page
created during this run is permitted only when the caller allows it; fetch again afterwards.
