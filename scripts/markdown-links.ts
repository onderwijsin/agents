/**
 * Extract local Markdown destinations using the same focused scanner as validation.
 * Fenced examples, external URLs and anchor-only links are excluded. Return encoded
 * file paths without query strings/fragments; this does not parse arbitrary prose.
 */
export function localMarkdownLinks(source: string): string[] {
  const content = source.replace(/^(`{3,}|~{3,}).*\n[\s\S]*?^\1[^\n]*$/gm, "");
  const matches = [
    ...content.matchAll(/!?\[[^\]\n]*\]\(<?([^\s)>]+)>?(?:\s+["'][^\n]*["'])?\)/g),
    ...content.matchAll(/^\s*\[[^\]]+\]:\s*<?([^\s>]+)>?/gm),
  ];
  return [
    ...new Set(
      matches.flatMap((match) => {
        const destination = match[1];
        if (!destination || /^(?:[a-z][a-z\d+.-]*:|#)/i.test(destination)) return [];
        const path = destination.split(/[?#]/)[0] ?? "";
        return path ? [path] : [];
      }),
    ),
  ];
}
