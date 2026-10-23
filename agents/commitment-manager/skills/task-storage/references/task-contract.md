# Task storage contract

This is an instruction-level interface, not an executable API or strict prompt syntax.

## Inputs and records

| Concept       | Required handling                                                                                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Destination   | Verified provider, account/workspace and canonical writable collection identity.                                                                                                         |
| Subject       | Human whose commitments are processed; verified provider identity when assignment is required.                                                                                           |
| Task          | Actionable title, concise context, subject/owner, recipient when known.                                                                                                                  |
| Task language | Resolved language for generated title, description and body labels; preserve it during provider mapping. Evidence quotes, IDs and exact schema/status values retain their original form. |
| Dates         | Agreement timestamp, explicit deadline and separately explicit planned work date; preserve timezone semantics.                                                                           |
| Evidence      | Source-qualified account and actual originating IDs, verified links when available, stable action discriminator and cross-source aliases.                                                |
| Lifecycle     | Normalize existing states to open, completed, cancelled or unknown; retain exact provider values.                                                                                        |
| Stored result | Actual task ID, returned URL when available, normalized fields and verification outcome.                                                                                                 |

Optional concepts may be absent. Title, ownership meaning, evidence and commitment identity must
survive storage; body text can carry concepts without dedicated properties. Never fabricate
provider IDs or source URLs. A commitment identity combines source provider/account, original
record ID and stable action discriminator. Cross-source aliases support repeated discovery;
semantic lookup remains necessary for manually created tasks.

## Operations

- **Discover:** resolve destination, schema, field/status mappings, required values, account
  identity and relevant provider capabilities. Return ambiguities and unsupported requirements.
- **Search:** find identity, link and semantic matches across every lifecycle state. Paginate
  until relevant coverage is complete. Return matched records, lifecycle and completeness;
  unknown lifecycle or inaccessible relevant records prevents a definitive absence claim.
- **Create:** accept a normalized task and explicit caller authority, recheck duplicates, write
  in the verified destination and return its real reference. Preserve required evidence in
  dedicated fields or body. Do not silently drop required values or fill unknown required fields.
- **Verify:** read back destination, title, lifecycle, ownership, dates, evidence, identity and
  body. Return verified, failed or pending with discrepancies. Creation counts only when verified.

A lookup before creation reduces duplicates but is not atomic. Providers must disclose absent
uniqueness/transaction guarantees. Keep one writer per destination within a run; overlapping
runs can still race. An uncertain response requires lookup before retry, and an inconclusive
lookup keeps the operation pending rather than authorizing another creation.
