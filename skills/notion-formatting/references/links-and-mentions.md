# Links, sources, and native Notion mentions

Read this reference when adding or changing a source link, URL, mention, or date in Notion page content.

## External source links

- Prefer canonical, user-openable `https://` permalinks from the source provider.
- When the same task already has a verified source URL in a `Link` property, reuse that URL in the page body rather than substituting a different scheme.
- Express an external link as `[useful link text](https://real-provider.example/...)` using Notion-flavored Markdown.
- Do not use connector-only URI schemes as Markdown link destinations, such as `slackMessage://`, `thread://`, or opaque application pointers. Those identifiers may be useful for searching, but are not user-openable permalinks.
- If only a connector identifier is available, include it as plain text if useful and leave out the hyperlink. Never invent a web URL by guessing its provider-specific structure.
- Preserve actual source citations and URL query parameters needed to open the relevant thread or message.
- A syntactically valid HTTPS URL is not proof that a destination is accessible; distinguish known permalinks from links you have actually opened or verified.

## Native Notion references

- Use the Notion connector's supported native mention syntax for existing Notion users, pages, databases, data sources, and dates when the destination identity is known.
- Resolve mention URLs or IDs from actual connector results. Never invent IDs, use a display name in place of a user ID, or replace verified native mentions with plain text needlessly.
- Mention tags, such as `<mention-page ...>` or `<mention-user ...>`, are inline references. A `<page ...>` or `<database ...>` tag represents structural content and may move a page or database. Do not swap them.
- Preserve existing child-page and database blocks when editing page bodies. Do not delete or relocate them as an accidental consequence of replacement.
- For dates, follow the live enhanced Markdown spec when using `<mention-date .../>`. Do not substitute a quoted date string for a requested native mention.

## Privacy and clarity

- Include only the minimum context necessary to understand the task or decision.
- Prefer a short description and permalink over copying entire private Slack threads, email chains, or meeting transcripts into a task.
- Use descriptive link labels (for example, `Original Slack message`) rather than unexplained URI strings.
