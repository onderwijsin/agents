---
name: task-storage
description: Resolve a configured task destination and route schema discovery, scoped task reads, duplicate searches, authorized creation or updates and read-back verification to its storage provider. Use for task persistence without embedding provider-specific fields in the calling workflow.
license: MIT
metadata:
  agents: [commitment-manager, task-manager]
---

# Store tasks

Read [task contract](references/task-contract.md) for every storage operation. Receive the resolved
provider, destination, subject identity, optional field/status mappings and caller's authority.
These instructions grant no additional write permission.

1. Select the provider from explicit configuration or an unambiguous destination URL. Currently
   only `notion` is implemented: invoke `notion-task-storage`. For any other provider, report
   unsupported storage and perform no writes or fallback to another service.
2. Ask the provider to resolve and validate the exact destination, account access, live schema,
   ownership mapping and lifecycle mapping. Missing essential configuration blocks dependent work.
3. Pass normalized requests: discover, list, read, search, create, update or verify. Require list and search results to carry
   pagination/completeness and lifecycle information. Require the provider to preserve title,
   ownership semantics and evidence; preserve any existing commitment identity during maintenance
   and require stable identity on creation. Optional fields may use the body.
4. Create only when the caller authorizes it and duplicate lookup is adequate. Immediately recheck
   the destination for matches, then write once and read back. If the response is uncertain,
   search by identity and semantic match before retrying. Report unresolved outcomes as pending.
5. For maintenance, list and read the exact caller scope using the contract. Update only the
   caller-authorized patch to an existing task, after a fresh read and conflict check. Verify
   both changed fields and preservation; uncertain writes require lookup before retry.
6. Return normalized task records and operation results; expose real provider IDs and returned
   URLs without requiring numeric IDs. Never change schemas or choose a different destination.

Additional providers must implement this same contract and document their schema, lifecycle,
identity, evidence preservation, full-search limitations and retry semantics in their own skill.
