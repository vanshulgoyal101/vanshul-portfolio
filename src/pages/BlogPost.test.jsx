import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BlogPost from './BlogPost';
import { ToastProvider } from '../components/Toast';
import { loadBlogPosts } from '../utils/blogLoader';
import { postJsonLd } from '../../scripts/lib/structuredData.mjs';
import { SITE_URL, AUTHOR_NAME, AUTHOR_SAME_AS } from '../constants/siteConfig';
import { articleHeadings, MIN_TOC_HEADINGS } from '../utils/articleHeadings';
import { formatPostDate } from '../utils/blogUtils';
import { postDate } from '../utils/seoValues';
import { PROFILE } from '../constants/profile';

const renderAt = (path) =>
  render(
    <ToastProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );

const posts = loadBlogPosts();
const sample = posts[0];

describe('BlogPost', () => {
  it('has at least one real post to test against', () => {
    expect(posts.length).toBeGreaterThan(0);
    expect(sample.slug).toBeTruthy();
  });

  it('renders the post title and sets the document title', () => {
    renderAt(`/blog/${sample.slug}`);
    expect(screen.getByText(sample.title)).toBeInTheDocument();
    expect(document.title).toContain(sample.title);
  });

  it('renders the read time and (when present) the category', () => {
    renderAt(`/blog/${sample.slug}`);
    expect(screen.getAllByText(sample.readTime, { exact: false }).length).toBeGreaterThan(0);
    if (sample.category) {
      expect(screen.getAllByText(sample.category, { exact: false }).length).toBeGreaterThan(0);
    }
  });

  it('renders Back and Share controls', () => {
    renderAt(`/blog/${sample.slug}`);
    expect(screen.getByText(/Back to Blog/i)).toBeInTheDocument();
    expect(screen.getByText(/Share/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Blog' })).toHaveAttribute('href', '/blog/');
    expect(screen.getByRole('button', { name: 'Share' })).toHaveAttribute('type', 'button');
  });

  it('bylines the post with the author, a machine-readable date and the read time', () => {
    renderAt(`/blog/${sample.slug}`);
    const article = screen.getByRole('article');
    expect(within(article).getByText(formatPostDate(sample.date))).toHaveAttribute('datetime', postDate(sample.date));
    expect(within(article).getAllByText(AUTHOR_NAME).length).toBeGreaterThan(0);
  });

  it('ends the article with an author card that links to the About section', () => {
    renderAt(`/blog/${sample.slug}`);
    const article = screen.getByRole('article');
    expect(within(article).getByText('Written by')).toBeInTheDocument();
    expect(within(article).getByText(new RegExp(PROFILE.summary.slice(0, 40)))).toBeInTheDocument();
    expect(within(article).getByRole('link', { name: 'More about me' })).toHaveAttribute('href', '/#about');
  });

  it('keeps the article and related writing in one main landmark', () => {
    renderAt(`/blog/${sample.slug}`);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    const related = screen.getByRole('region', { name: 'More writing' });
    expect(screen.getByRole('main')).toContainElement(related);
    expect(within(related).getByRole('link', { name: 'All posts' })).toHaveAttribute('href', '/blog/');
  });

  it('injects BlogPosting and BreadcrumbList structured data', () => {
    renderAt(`/blog/${sample.slug}`);
    const combined = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => s.textContent)
      .join('');
    expect(combined).toContain('BlogPosting');
    expect(combined).toContain('BreadcrumbList');
    const schema = document.head.querySelector('script[data-route-seo]');
    expect(JSON.parse(schema.textContent)).toEqual(postJsonLd({ ...sample, wordCount: sample.content.trim().split(/\s+/).length }, {
      site: SITE_URL, authorName: AUTHOR_NAME, authorSameAs: AUTHOR_SAME_AS,
    }));
  });

  it('renders a "More writing" section linking to other posts', () => {
    renderAt(`/blog/${sample.slug}`);
    expect(screen.getByText('More writing')).toBeInTheDocument();
    const otherLinks = [...document.querySelectorAll('a[href^="/blog/"]')].filter(
      (a) => a.getAttribute('href') !== `/blog/${sample.slug}`
    );
    expect(otherLinks.length).toBeGreaterThan(0);
  });

  it('lists the sections of a long post and links each to its heading', () => {
    const long = posts.find((post) => articleHeadings(post.content).length >= MIN_TOC_HEADINGS);
    renderAt(`/blog/${long.slug}/`);
    const contents = screen.getByRole('navigation', { name: 'Table of contents' });
    const links = [...contents.querySelectorAll('a')];
    expect(links.map((a) => a.textContent)).toEqual(articleHeadings(long.content).map((h) => h.text));
    for (const a of links) {
      expect(document.getElementById(a.getAttribute('href').slice(1))?.tagName).toMatch(/^H[23]$/);
    }
  });

  it('omits the table of contents for a short post', () => {
    const short = posts.find((post) => articleHeadings(post.content).length < MIN_TOC_HEADINGS);
    renderAt(`/blog/${short.slug}/`);
    expect(screen.queryByRole('navigation', { name: 'Table of contents' })).toBeNull();
  });

  it('shows a not-found state for an unknown slug', () => {
    renderAt('/blog/this-post-does-not-exist-xyz');
    expect(screen.getByText('Blog Post Not Found')).toBeInTheDocument();
    expect(document.title).toContain('Post not found');
    expect(screen.getByRole('heading', { level: 1, name: 'Blog Post Not Found' })).toBeInTheDocument();
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  });
});
