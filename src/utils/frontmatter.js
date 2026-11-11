// The one frontmatter parser, shared by the app (blogLoader) and the build
// scripts (scripts/lib/seo.mjs), so prerendered metadata and the hydrated page
// always read a post identically.
//
// Supported format: a leading `---` block of `key: value` lines. A line splits
// on its first colon, values are trimmed strings, and one pair of matching
// surrounding quotes is removed. Nested YAML, lists and multi-line values are
// not supported; tags are a comma-separated string (see parseTags).

/**
 * @param {string} markdown Raw post file
 * @returns {{ data: Record<string, string>, content: string }}
 */
export const parseFrontmatter = (markdown) => {
  const normalized = String(markdown).replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/);
  if (!match) return { data: {}, content: normalized.trim() };

  const data = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon <= 0) continue;
    const key = line.slice(0, colon).trim();
    if (!key) continue;
    const value = line.slice(colon + 1).trim();
    const quoted = value.match(/^(["'])(.*)\1$/);
    data[key] = quoted ? quoted[2] : value;
  }
  return { data, content: match[2].trim() };
};
