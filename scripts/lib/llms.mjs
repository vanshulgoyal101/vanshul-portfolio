/**
 * Pure builder for /llms.txt (https://llmstxt.org/): a curated Markdown map of
 * the site for AI assistants and answer engines. No fs/env, so it is
 * unit-tested with fixtures; scripts/generate-llms.mjs passes in the same data
 * modules the site renders.
 */
import { byDateDesc } from './seo.mjs';
import { BLOG_INDEX_DESCRIPTION } from '../../src/constants/blogConstants.js';
import { READING_LIST_DESCRIPTION } from '../../src/constants/readingListSeo.js';
import {
  HOME_PATH,
  BLOG_PATH,
  READING_LIST_PATH,
  postPath,
  homeSectionPath,
  absoluteUrl,
} from '../../src/constants/routes.js';

// Headings, quotes and list items are single-line constructs: a line break in
// authored text would end them early or start a new item.
const inline = (text) => String(text ?? '').replace(/\s+/g, ' ').trim();

// Brackets and backslashes would otherwise close or escape the link text.
const linkText = (text) => inline(text).replace(/[[\]\\]/g, '\\$&');

const entry = (name, url, notes) => {
  const text = inline(notes);
  return `- [${linkText(name)}](${url})${text ? `: ${text}` : ''}`;
};

const section = (title, entries) => entries.length > 0 && [`## ${title}`, '', ...entries].join('\n');

/**
 * @param {Array<Record<string, unknown>>} posts  Parsed posts, in any order
 * @param {{
 *   site: string,
 *   authorName: string,
 *   description: string,
 *   profile: typeof import('../../src/constants/profile.js').PROFILE,
 *   featuredProjects: typeof import('../../src/constants/projects.js').FEATURED_PROJECTS,
 *   projectDirectory: typeof import('../../src/constants/projects.js').PROJECT_DIRECTORY,
 *   socialProfiles: typeof import('../../src/constants/siteConfig.js').SOCIAL_PROFILES,
 * }} options
 * @returns {string} llms.txt Markdown
 */
export const buildLlmsTxt = (
  posts,
  { site, authorName, description, profile, featuredProjects, projectDirectory, socialProfiles },
) => {
  const { degree, field, minor, school, graduated } = profile.education;
  const facts = [
    `Role: ${profile.role} at ${profile.employer.name}.`,
    `Location: ${profile.location}.`,
    `Education: ${degree} in ${field} (minor in ${minor}), ${school}, graduated ${graduated}.`,
    `Topics: ${profile.knowsAbout.join(', ')}.`,
  ].join(' ');

  const writing = [...posts]
    .sort(byDateDesc)
    .map((post) => entry(post.title, absoluteUrl(postPath(post.slug), site), post.summary));

  // The homepage lists every project, so it stands in for a missing public URL.
  const projectsUrl = absoluteUrl(homeSectionPath('projects'), site);
  const featured = featuredProjects.map((project) =>
    entry(project.title, project.link || projectsUrl, `${project.description} Role: ${project.role}.`),
  );
  const directory = projectDirectory
    .flatMap((group) => group.items)
    .map((item) => {
      const notes = item.live && item.repo ? `${item.desc} Source: ${item.repo}` : item.desc;
      return entry(item.title, item.live || item.repo || projectsUrl, notes);
    });

  return [
    `# ${inline(authorName)}`,
    `> ${inline(description)}`,
    inline(facts),
    section('Writing', writing),
    section('Projects', [...featured, ...directory]),
    section('Pages', [
      entry('Home', absoluteUrl(HOME_PATH, site), 'Profile, projects, work experience, latest writing and contact.'),
      entry('Writing archive', absoluteUrl(BLOG_PATH, site), BLOG_INDEX_DESCRIPTION),
      entry('Reading list', absoluteUrl(READING_LIST_PATH, site), READING_LIST_DESCRIPTION),
      entry('RSS feed', absoluteUrl('/feed.xml', site), 'Every post in full.'),
      entry('Sitemap', absoluteUrl('/sitemap.xml', site), 'Every public page.'),
    ]),
    section('Elsewhere', socialProfiles.map((link) => entry(link.label, link.url))),
  ]
    .filter(Boolean)
    .join('\n\n') + '\n';
};
