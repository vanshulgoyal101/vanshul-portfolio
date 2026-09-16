import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { AUTHOR_NAME, HOME_DESCRIPTION, SOCIAL_LINKS } from '../../src/constants/siteConfig.js';
import { BOOKS, ESSAYS } from '../../src/constants/books.js';
import { escapeXml, escapeText } from './seo.mjs';

const link = (href, label) => `<a href="${escapeXml(href.startsWith('/') && !href.endsWith('/') ? `${href}/` : href)}">${escapeText(label)}</a>`;
const postLinks = posts => `<ul>${posts.map(post => `<li>${link(`/blog/${post.slug}`, post.title)}<p>${escapeText(post.summary || '')}</p></li>`).join('')}</ul>`;

export const prerenderContent = ({ post, posts = [], page = 'home' } = {}) => {
  const navigation = `<nav aria-label="Main navigation">${link('/', 'Home')} ${link('/blog', 'Writings')} ${link('/reading-list', 'Reading List')}</nav>`;
  let content;
  if (post) {
    const markdown = renderToStaticMarkup(createElement(ReactMarkdown, null, post.body));
    content = `<article><h1>${escapeText(post.title)}</h1><p>By ${escapeText(AUTHOR_NAME)}</p>${markdown}</article><nav aria-label="More writing"><h2>More Writing</h2>${postLinks(posts.filter(item => item.slug !== post.slug))}</nav>`;
  } else if (page === 'blog') {
    content = `<h1>Writings</h1><p>Essays on AI, robotics, the future of work, and technology by ${escapeText(AUTHOR_NAME)}.</p>${postLinks(posts)}`;
  } else if (page === 'reading-list') {
    const list = items => `<ul>${items.map(item => `<li><h3>${item.url ? link(item.url, item.title) : escapeText(item.title)}</h3><p>${escapeText(item.author)}</p><p>${escapeText(item.note)}</p></li>`).join('')}</ul>`;
    content = `<h1>From My Shelf</h1><section id="books"><h2>Books</h2>${list(BOOKS)}</section><section id="essays"><h2>Essays</h2>${list(ESSAYS)}</section>`;
  } else {
    content = `<h1>${escapeText(AUTHOR_NAME)}</h1><p>Engineer &amp; independent builder</p><p>${escapeText(HOME_DESCRIPTION)}</p><p>${link(SOCIAL_LINKS.github, 'GitHub')} ${link(SOCIAL_LINKS.linkedin, 'LinkedIn')}</p><section><h2>Writings</h2>${postLinks(posts)}</section><p>${link('/reading-list', 'From My Shelf')}</p>`;
  }
  return `<div data-prerender><style>[data-prerender]{max-width:70ch;margin:2rem auto;padding:0 1.25rem;font-family:'Inter',sans-serif;line-height:1.7;color:#1e293b}[data-prerender] nav a{display:inline-block;margin-right:1rem;min-height:44px}[data-prerender] h1{font-family:'Space Grotesk',sans-serif;line-height:1.2}[data-prerender] img{max-width:100%;height:auto}[data-prerender] pre{overflow:auto}[data-prerender] a{color:#1d4ed8;overflow-wrap:anywhere}</style>${navigation}<main>${content}</main></div>`;
};