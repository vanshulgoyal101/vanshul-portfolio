// Readable fallback HTML placed inside #root of every prerendered page. It is
// built from the same data modules the React components render, so crawlers
// and visitors without JavaScript read the page's real content. React's
// createRoot replaces it when the application starts.
import { AUTHOR_NAME, SOCIAL_PROFILES } from '../../src/constants/siteConfig.js';
import { PROFILE, HIGHLIGHTS, SKILL_GROUPS } from '../../src/constants/profile.js';
import { FEATURED_PROJECTS, PROJECT_DIRECTORY, CASE_STUDY_FIELDS } from '../../src/constants/projects.js';
import { EXPERIENCE } from '../../src/constants/experience.js';
import { BOOKS, ESSAYS } from '../../src/constants/books.js';
import { BLOG_CONTENT, BLOG_INDEX_DESCRIPTION } from '../../src/constants/blogConstants.js';
import { HOME_PATH, BLOG_PATH, READING_LIST_PATH, postPath } from '../../src/constants/routes.js';
import { escapeXml, escapeText } from './seo.mjs';
import { renderMarkdown } from './markdown.mjs';
import { articleHeadings, MIN_TOC_HEADINGS } from '../../src/utils/articleHeadings.js';

const link = (href, label) => `<a href="${escapeXml(href)}">${escapeText(label)}</a>`;
const paragraph = text => `<p>${escapeText(text)}</p>`;
const list = items => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;

const postLinks = posts => list(posts.map(post => `${link(postPath(post.slug), post.title)}${paragraph(post.summary || '')}`));

const tableOfContents = markdown => {
  const headings = articleHeadings(markdown);
  if (headings.length < MIN_TOC_HEADINGS) return '';
  const items = headings.map(heading => `<li>${link(`#${heading.id}`, heading.text)}</li>`).join('');
  return `<nav aria-label="Table of contents"><p>Contents</p><ol>${items}</ol></nav>`;
};

const socialLinks = () => list(SOCIAL_PROFILES.map(profile => link(profile.url, profile.label)));

const featuredProject = project => {
  const caseStudy = CASE_STUDY_FIELDS
    .map(([field, label]) => `<dt>${escapeText(label)}</dt><dd>${escapeText(project.caseStudy[field])}</dd>`)
    .join('');
  return `<article><h3>${escapeText(project.title)}</h3>${paragraph(project.role)}${paragraph(project.description)}`
    + `<dl>${caseStudy}</dl>${list(project.stats.map(stat => escapeText(stat.text)))}`
    + `<p>${link(project.link, `Visit ${project.title}`)}</p></article>`;
};

const directoryItem = item => {
  const links = [
    item.live && link(item.live, `Visit ${item.title}`),
    item.repo && link(item.repo, `${item.title} source code`),
  ].filter(Boolean).join(' ');
  return `<strong>${escapeText(item.title)}</strong>${paragraph(item.desc)}<p>${links}</p>`;
};

const projectsSection = () => `<section id="projects"><h2>Featured Projects</h2>`
  + FEATURED_PROJECTS.map(featuredProject).join('')
  + `<h3>More things I&#39;ve built</h3>`
  + PROJECT_DIRECTORY.map(group => `<h4>${escapeText(group.category)}</h4>${list(group.items.map(directoryItem))}`).join('')
  + `</section>`;

const aboutSection = () => {
  const { education, employer } = PROFILE;
  const [currentRole] = EXPERIENCE;
  return `<section id="about"><h2>About Me</h2>`
    + paragraph(`I'm ${AUTHOR_NAME}, a recent graduate from ${education.school} with a ${education.degree} in ${education.field} and a minor in ${education.minor}.`)
    + paragraph(`Currently, I work as an ${PROFILE.role} at ${employer.name} in the ${currentRole.department} department.`)
    + list(HIGHLIGHTS.map(item => `${escapeText(item.value)} — ${escapeText(item.label)}`))
    + `<h3>Technical Skills</h3>`
    + list(SKILL_GROUPS.map(group => `${escapeText(group.category)}: ${escapeText(group.skills.join(', '))}`))
    + `</section>`;
};

const workSection = () => `<section id="work"><h2>Work Experience</h2>`
  + EXPERIENCE.map(job => `<article><h3>${escapeText(job.title)}</h3>`
    + paragraph(`${job.company} • ${job.department}`)
    + paragraph(`${job.duration} · ${job.location}`)
    + paragraph(job.description)
    + paragraph(job.tech.join(', '))
    + `<p>${link(job.link, `${job.company} website`)}</p></article>`).join('')
  + `</section>`;

const homeContent = posts => `<h1>${escapeText(AUTHOR_NAME)}</h1>`
  + paragraph(PROFILE.headline)
  + paragraph(`${PROFILE.role} at ${PROFILE.employer.name}`)
  + paragraph(PROFILE.summary)
  + socialLinks()
  + projectsSection()
  + aboutSection()
  + workSection()
  + `<section id="blog"><h2>${escapeText(BLOG_CONTENT.sectionTitle)}</h2>${postLinks(posts)}`
  + `<p>${link(BLOG_PATH, 'All posts')} · ${link(READING_LIST_PATH, 'From My Shelf')}</p></section>`
  + `<section id="contact"><h2>Get In Touch</h2>${socialLinks()}</section>`;

export const prerenderContent = ({ post, posts = [], page = 'home' } = {}) => {
  const navigation = `<nav aria-label="Main navigation">${link(HOME_PATH, 'Home')} ${link(BLOG_PATH, 'Writings')} ${link(READING_LIST_PATH, 'Reading List')}</nav>`;
  let content;
  if (post) {
    const markdown = renderMarkdown(post.body);
    content = `<article><h1>${escapeText(post.title)}</h1><p>By ${escapeText(AUTHOR_NAME)}</p>${tableOfContents(post.body)}${markdown}</article><nav aria-label="More writings"><h2>More writings</h2>${postLinks(posts.filter(item => item.slug !== post.slug))}</nav>`;
  } else if (page === 'blog') {
    content = `<h1>Writings</h1>${paragraph(BLOG_INDEX_DESCRIPTION)}${postLinks(posts)}`;
  } else if (page === 'reading-list') {
    const shelf = items => `<ul>${items.map(item => `<li><h3>${item.url ? link(item.url, item.title) : escapeText(item.title)}</h3>${paragraph(item.author)}${paragraph(item.note)}</li>`).join('')}</ul>`;
    content = `<h1>From My Shelf</h1><section id="books"><h2>Books</h2>${shelf(BOOKS)}</section><section id="essays"><h2>Essays</h2>${shelf(ESSAYS)}</section>`;
  } else {
    content = homeContent(posts);
  }
  return `<div data-prerender><style>[data-prerender]{max-width:70ch;margin:2rem auto;padding:0 1.25rem;font-family:'Inter',sans-serif;line-height:1.7;color:#1e293b}[data-prerender] nav a{display:inline-block;margin-right:1rem;min-height:44px}[data-prerender] h1{font-family:'Space Grotesk',sans-serif;line-height:1.2}[data-prerender] img{max-width:100%;height:auto}[data-prerender] pre{overflow:auto}[data-prerender] a{color:#1d4ed8;overflow-wrap:anywhere}</style>${navigation}<main>${content}</main></div>`;
};
