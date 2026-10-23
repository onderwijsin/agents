---
name: notion-formatting
description: Apply a reliable workflow when creating, editing, or repairing Notion page bodies through Notion connectors. Use for task descriptions, meeting notes, reports, documentation, or other Notion content, especially when preventing or fixing broken paragraphs, malformed newlines, list rendering, or source links. Loads detailed formatting references only as needed, verifies saved content, and respects the calling agent's write permissions.
metadata:
  agents: [commitment-manager, task-manager]
---

# Notion content workflow

Execute this workflow for each authorized Notion page-content write. This skill governs **how content is formatted and verified**, not **what may be changed**.

## 1. Determine scope

Identify the target page, intended change, and the calling agent's write permissions. Do not expand the approved content scope, change page properties, or repair unrelated pages on the authority of this skill.

## 2. Inspect the destination

Before the first content write in an execution, read the connector's current `notion://docs/enhanced-markdown-spec` (via the Notion resource interface, or Notion `fetch`). Reuse that specification across writes in the same execution.

For an existing page, fetch its body and inspect its block structure, links, mentions, and embedded child pages/databases. Preserve existing content unless the calling agent explicitly authorizes its change.

## 3. Prepare the content

Read [content-formatting.md](references/content-formatting.md) and choose native blocks appropriate to the content. Read [links-and-mentions.md](references/links-and-mentions.md) whenever inserting or changing references, source links, mentions, or dates.

Construct the requested content using Notion-flavored Markdown and the current connector specification. Keep the page title in its title property rather than duplicating it in the body.

## 4. Write the smallest safe change

For an existing page, prefer targeted content updates or inserts over replacing the full body. Preserve unrelated sections, nested blocks, child pages/databases, and native references. For a new page, pass the body in the connector's supported content field.

Never create a second page merely to fix a malformed first write.

## 5. Verify the saved result

Read [verification-and-repair.md](references/verification-and-repair.md). After **every** page-content write, fetch the saved page again. Compare the actual rendered block structure and links with the intended content; a successful write response alone is not sufficient.

## 6. Repair or report

If the content is malformed, make only an authorized, formatting-preserving repair and fetch again to verify it. Repairs to a newly created page are allowed only if the calling agent permits editing its own creations. Otherwise, report the issue and supply a corrected draft for approval.

Do not claim successful formatting verification when read-back or safe repair was not possible.
