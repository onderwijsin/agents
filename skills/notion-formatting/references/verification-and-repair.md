# Saved-content verification and repair

Use this checklist after every Notion page-body create, insert, update, or authorized formatting correction.

## Read-back checklist

1. **Fetch** the saved page after the write operation has completed. Inspect the current content, not only a success or page-ID response.
2. **Structure:** Confirm intended headings, paragraphs, list items, and nested blocks appear independently and in the correct order. A field-oriented task body should not collapse into one paragraph.
3. **Escaping:** Check for unintended literal `\n`, `\\n`, `nn` between labels, stray Markdown control characters, or broken inline emphasis. Match against the intended text to avoid treating legitimate substrings as errors.
4. **Links:** Check external link destinations use actual provider permalinks where available; reject connector-only schemes in Markdown links. Verify link labels and destinations have not been lost or malformed.
5. **Preservation:** When editing, confirm unrelated content, child pages/databases, native mentions, and existing links remain present and in place.
6. **Meaning:** Confirm no text, property, deadline, assignment, or task state changed beyond the calling agent's authorized scope.

## Repair decision

- A repair must change only presentation or malformed formatting, without changing substantive meaning or adding unsupported claims.
- For pages created in the same run, repair only when the calling agent authorizes follow-up content edits to its creations. For existing pages, use the calling agent's edit permissions and preserve unrelated content.
- Prefer a targeted content update. Avoid whole-page replacement when a small section can be repaired.
- Never duplicate the page as a workaround for a formatting error or ambiguous create result.
- Fetch again after repair and repeat the checks. If repair fails, do not claim the body is verified.
- If the connector cannot provide read-back or the page is out of scope, report the unresolved formatting issue and optionally supply a corrected draft. Do not broaden permissions to make the fix.

## Diagnostic example

Broken fetched body:

```text
**Commitment:** Prepare the proposal.nn**Promised to:** Sanne.nn**Source:** [slackMessage://...](slackMessage://...)
```

Expected representation: three separate Notion list blocks, with the real source HTTPS permalink in the Source item. Do not claim the fix succeeded until another fetch shows the separate blocks and correct link.
