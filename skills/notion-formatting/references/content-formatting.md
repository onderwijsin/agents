# Notion content formatting rules

Use this reference while preparing page-body text for the Notion connector. The live `notion://docs/enhanced-markdown-spec` is authoritative if syntax differs.

## Native blocks first

- Choose **paragraphs** for ordinary prose, **headings** for longer sections, and **lists** for short field-oriented task information or action items.
- Start each separate block on its own line with an actual line-feed character. For a task description, each field should be a separate native list item.
- Prefer meaningful block structure to a single paragraph with labels concatenated together.
- Notion supplies spacing between blocks. Do not add blank placeholder blocks merely for cosmetic spacing. Blank text lines may be discarded by Notion.
- Indent nested list items, quote children, or toggle content with tabs when required by the current Notion specification.
- Do not repeat a database page's title as the first heading in the body unless explicitly requested.

## Supported basic syntax

- Heading: `# Heading`, `## Heading`, `### Heading`.
- Bold: `**important text**`; italic: `*emphasis*`; inline code: `` `identifier` ``.
- Bulleted item: `- Action or field`; numbered item: `1. Step`.
- Checklist: `- [ ] Follow-up` or `- [x] Completed`.
- Divider: `---` on its own line when a section boundary is genuinely needed.
- External link: `[descriptive label](https://example.com/path)`; see [links-and-mentions.md](links-and-mentions.md) for restrictions.
- For tables, quotes, callouts, toggles, native mentions, or other complex blocks, follow the live enhanced Markdown specification rather than extrapolating from ordinary Markdown.
- Escape special characters _only when they are meant literally_, according to the live specification. Do not escape intended Markdown formatting.

## Newlines and serialization

The content received by Notion must contain **actual newline characters** between separate blocks.

- Do not join block labels with the characters `nn`, literal backslash-`n`, double-escaped newlines, or `<br>` between blocks.
- In code or JSON, a correctly serialized `\n` sequence is fine **only if it decodes to an actual newline in the content value passed to Notion**. Do not manually double-escape a complete content string.
- `<br>` is reserved for inline line breaks inside a single block when the current Notion specification calls for it; it does not replace paragraph or list block boundaries.
- For multiline text produced programmatically, form a sequence of lines and join them using a real newline before passing it to the connector.

## Short task description pattern

Represent the following as **separate list blocks**; omit fields without meaningful values:

```markdown
- **Commitment:** Prepare the updated account migration plan.
- **Promised to:** A colleague.
- **Context:** Confirm the remaining transfer steps before migration.
- **Agreed on:** 2026-10-15.
- **Source:** [Original conversation](https://example.com/original-message)
```

The URL is illustrative. In actual writes, use a verified source permalink or omit the link.

**Malformed output to reject:**

```text
**Commitment:** Prepare the plan.nn**Promised to:** A colleague.nn**Context:** Confirm the transfer.
```

That is one fused text block, not the intended three native blocks. A document with similar literal newline escape characters or stray formatting markers is also malformed.

## Preservation while editing

- Follow the existing page's heading levels and block organization instead of reformatting all surrounding content.
- Retain unrelated wording, linked resources, child pages, child databases, native mentions, and nested block structure.
- Prefer small, exact replacements or targeted inserts. Do not use full-page replacement just to add one paragraph or fix one malformed section.
- Do not adjust factual content, task status, title, deadlines, assignments, or the author's meaning under the guise of formatting.
