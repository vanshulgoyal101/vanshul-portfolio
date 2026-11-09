// Stable ids for article section headings and the table of contents built from
// them. The same rehype plugin runs inside react-markdown in the app and in the
// build-time renderer, so ids (and deep links such as /blog/x/#section) match
// between the prerendered HTML and the React page.
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';

const SECTION_TAGS = new Set(['h2', 'h3']);

// A post needs at least this many sections before a table of contents helps.
export const MIN_TOC_HEADINGS = 3;

export const headingSlug = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

// Assigns unique ids to h2/h3 elements of a hast tree and returns them in order.
const assignHeadingIds = (tree) => {
  const seen = new Map();
  const headings = [];
  const visit = (node) => {
    if (node.type === 'element' && SECTION_TAGS.has(node.tagName)) {
      const text = textOf(node).trim();
      const base = headingSlug(text) || 'section';
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = count ? `${base}-${count}` : base;
      node.properties = { ...node.properties, id };
      headings.push({ id, text, level: Number(node.tagName.slice(1)) });
    }
    node.children?.forEach(visit);
  };
  visit(tree);
  return headings;
};

/** rehype plugin for react-markdown: give every h2/h3 a stable, unique id. */
export const rehypeHeadingIds = () => (tree) => {
  assignHeadingIds(tree);
};

const toHast = unified().use(remarkParse).use(remarkRehype);

/**
 * The h2/h3 sections of a Markdown article, with the ids rehypeHeadingIds gives
 * them when rendered.
 * @param {string} markdown
 * @returns {{ id: string, text: string, level: number }[]}
 */
export const articleHeadings = (markdown) => assignHeadingIds(toHast.runSync(toHast.parse(markdown ?? '')));
