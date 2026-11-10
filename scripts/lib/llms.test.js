// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { buildLlmsTxt } from './llms.mjs';
import { AUTHOR_NAME, HOME_DESCRIPTION, SOCIAL_PROFILES } from '../../src/constants/siteConfig.js';
import { PROFILE } from '../../src/constants/profile.js';
import { FEATURED_PROJECTS, PROJECT_DIRECTORY } from '../../src/constants/projects.js';

const site = 'https://example.com';
const posts = [
  { slug: 'older', title: 'Older', summary: 'Old.', date: '2025-01-01' },
  // Unescaped, the unbalanced brackets and the trailing backslash break the link.
  { slug: 'brackets', title: 'Brackets ] [ and a trailing backslash \\', summary: 'First line.\n\n- not an item\r\n## nor a heading', date: '29 Jul, 2026' },
  { slug: 'no-summary', title: 'No summary', date: '8 Feb, 2026' },
];
const options = {
  site,
  authorName: 'Jane Doe',
  description: 'Engineer. I write about robots.',
  profile: {
    role: 'Analyst',
    employer: { name: 'Acme' },
    location: 'Earth',
    education: { degree: 'B.Tech', field: 'Physics', minor: 'Maths', school: 'Example College', graduated: '2025' },
    knowsAbout: ['AI', 'Robotics'],
  },
  featuredProjects: [{ title: 'Rover', role: 'Team Lead', description: 'A rover.', link: 'https://rover.example' }],
  projectDirectory: [
    {
      category: 'Tools',
      items: [
        { title: 'Both', desc: 'Live and open.', live: 'https://both.example', repo: 'https://github.com/jane/both' },
        { title: 'Code', desc: 'Open source.', repo: 'https://github.com/jane/code' },
        { title: 'Unlisted', desc: 'No public URL.' },
      ],
    },
  ],
  socialProfiles: [{ id: 'github', label: 'GitHub', url: 'https://github.com/jane' }],
};

const toText = (node) => node.value ?? (node.children ?? []).map(toText).join('');

// Read the output with a CommonMark parser, as an agent would: every H2 section
// maps to its list entries.
const parse = (markdown) => {
  const tree = unified().use(remarkParse).parse(markdown);
  const sections = {};
  let current;
  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth === 2) current = sections[toText(node)] = [];
    if (node.type === 'list') {
      current.push(...node.children.map((item) => {
        const [link, ...notes] = item.children[0].children;
        return { title: toText(link), url: link.url, notes: notes.map(toText).join('').replace(/^: /, '') };
      }));
    }
  }
  return { tree, sections };
};

describe('llms/buildLlmsTxt', () => {
  const text = buildLlmsTxt(posts, options);
  const { tree, sections } = parse(text);

  it('opens with the owner as the H1, a one-line summary and the profile facts', () => {
    expect(text.split('\n').slice(0, 4)).toEqual(['# Jane Doe', '', '> Engineer. I write about robots.', '']);
    expect(tree.children.slice(0, 3).map((node) => node.type)).toEqual(['heading', 'blockquote', 'paragraph']);
    expect(toText(tree.children[2])).toBe(
      'Role: Analyst at Acme. Location: Earth. Education: B.Tech in Physics (minor in Maths), Example College, graduated 2025. Topics: AI, Robotics.',
    );
  });

  it('follows the llms.txt layout: one H1, then H2 sections of link lists', () => {
    const headings = tree.children.filter((node) => node.type === 'heading');
    expect(headings.map((node) => [node.depth, toText(node)])).toEqual([
      [1, 'Jane Doe'],
      [2, 'Writings'],
      [2, 'Projects'],
      [2, 'Pages'],
      [2, 'Elsewhere'],
    ]);
    const afterFacts = tree.children.slice(3).map((node) => node.type);
    expect(afterFacts).toEqual(['heading', 'list', 'heading', 'list', 'heading', 'list', 'heading', 'list']);
  });

  it('lists every post newest first with its absolute trailing-slash URL and summary', () => {
    expect(sections.Writings).toEqual([
      { title: 'Brackets ] [ and a trailing backslash \\', url: 'https://example.com/blog/brackets/', notes: 'First line. - not an item ## nor a heading' },
      { title: 'No summary', url: 'https://example.com/blog/no-summary/', notes: '' },
      { title: 'Older', url: 'https://example.com/blog/older/', notes: 'Old.' },
    ]);
  });

  it('escapes link text and keeps authored text on one line', () => {
    expect(text).toContain(
      '\n- [Brackets \\] \\[ and a trailing backslash \\\\](https://example.com/blog/brackets/): First line. - not an item ## nor a heading\n',
    );
    expect(text).toContain('\n- [No summary](https://example.com/blog/no-summary/)\n');
  });

  it('links projects only to URLs from the data, falling back to the homepage projects section', () => {
    expect(sections.Projects).toEqual([
      { title: 'Rover', url: 'https://rover.example', notes: 'A rover. Role: Team Lead.' },
      { title: 'Both', url: 'https://both.example', notes: 'Live and open. Source: https://github.com/jane/both' },
      { title: 'Code', url: 'https://github.com/jane/code', notes: 'Open source.' },
      { title: 'Unlisted', url: 'https://example.com/#projects', notes: 'No public URL.' },
    ]);
  });

  it('points a featured project without a public link at the homepage projects section', () => {
    const unlinked = buildLlmsTxt(posts, { ...options, featuredProjects: [{ title: 'Rover', role: 'Team Lead', description: 'A rover.' }] });
    expect(parse(unlinked).sections.Projects[0]).toEqual({ title: 'Rover', url: 'https://example.com/#projects', notes: 'A rover. Role: Team Lead.' });
  });

  it('links the key pages by canonical URL, plus the feed and sitemap', () => {
    expect(sections.Pages.map((page) => [page.title, page.url])).toEqual([
      ['Home', 'https://example.com/'],
      ['Writings', 'https://example.com/blog/'],
      ['Reading list', 'https://example.com/reading-list/'],
      ['RSS feed', 'https://example.com/feed.xml'],
      ['Sitemap', 'https://example.com/sitemap.xml'],
    ]);
  });

  it('lists the social profiles under Elsewhere', () => {
    expect(sections.Elsewhere).toEqual([{ title: 'GitHub', url: 'https://github.com/jane', notes: '' }]);
  });

  it('omits sections with nothing to list', () => {
    const empty = buildLlmsTxt([], { ...options, socialProfiles: [] });
    expect(Object.keys(parse(empty).sections)).toEqual(['Projects', 'Pages']);
  });

  it('is deterministic: independent of input order and build time, without mutating the input', () => {
    vi.setSystemTime(new Date('2031-01-01T00:00:00Z'));
    try {
      expect(buildLlmsTxt([...posts].reverse(), options)).toBe(text);
    } finally {
      vi.useRealTimers();
    }
    expect(posts.map((post) => post.slug)).toEqual(['older', 'brackets', 'no-summary']);
    expect(text.endsWith('\n')).toBe(true);
  });

  it('reads the real profile, project and social data modules', () => {
    const real = buildLlmsTxt([], {
      site,
      authorName: AUTHOR_NAME,
      description: HOME_DESCRIPTION,
      profile: PROFILE,
      featuredProjects: FEATURED_PROJECTS,
      projectDirectory: PROJECT_DIRECTORY,
      socialProfiles: SOCIAL_PROFILES,
    });
    const found = parse(real).sections;
    const projects = [...FEATURED_PROJECTS, ...PROJECT_DIRECTORY.flatMap((group) => group.items)];
    expect(found.Projects.map((project) => project.title)).toEqual(projects.map((project) => project.title));
    expect(found.Projects.every((project) => project.url.startsWith('https://') && project.notes)).toBe(true);
    expect(found.Elsewhere.map((link) => link.url)).toEqual(SOCIAL_PROFILES.map((link) => link.url));
    expect(real).toContain(`${PROFILE.role} at ${PROFILE.employer.name}`);
    expect(real).not.toContain('undefined');
  });
});
