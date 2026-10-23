---
name: task-review
description: Review a configured personal task list for completion evidence, planning, aging backlog, quality and next-up priorities. Use for recurring reviews, focused maintenance and task-specific approval follow-ups through task-storage.
license: MIT
metadata:
  agents: [task-manager]
---

# Review and maintain tasks

Receive the resolved subject, database mode, task selection, evidence and planning bounds, timezone, limits,
source restrictions and read-only flag from the calling agent. Use `task-storage` for discovery,
list/read, updates and verification. Read [review policy](references/review-policy.md) each run
for decision rules and the authority required by each patch. Provider fields belong in the adapter.

1. Discover live mappings and list relevant active tasks, including subtasks. Keep contextual
   relatives outside the subject's selection read-only. Paginate all relevant records, report
   incompleteness, and retain unknown lifecycle values as unresolved rather than excluding them.
2. Retrieve task-related evidence from the configured sources and window. Expand older task
   context only when useful for verification. Keep source links, originating timestamps and gaps.
3. Apply the requested review responsibilities in the policy. Consider current commitments,
   deadlines, planned work, dependencies, blockers and known capacity. Recommend a small set
   rather than treating every old task as a problem. Do not infer free time from an empty date.
4. Separate proposals from allowed edits. For every patch identify exact target, observed values,
   intended values, reason/evidence and authority. In read-only mode return proposals only.
   Approval follow-ups apply only the identified approved changes, after live conflict checks.
5. Route authorized patches through storage one task at a time. Re-fetch before each write,
   preserve unrelated content and source identities, and verify saved changes. Inspect uncertain
   outcomes before retrying; retain partial failures and never claim an unverified change succeeded.
6. Return actual titles, task IDs/links, evidence, proposed dates, confidence and verified edit
   results for the caller's report. Separate pending approvals, questions and coverage gaps.
