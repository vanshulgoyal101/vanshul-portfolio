import { afterEach, describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BlogPost from './BlogPost';
import { ToastProvider } from '../components/Toast';
import { loadBlogPosts } from '../utils/blogLoader';
import * as blogViews from '../utils/blogViews';
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

  it('opens outbound links from the article in a new tab without exposing the page', () => {
    const linked = posts.find((post) => /\]\(https?:\/\//.test(post.content));
    renderAt(`/blog/${linked.slug}/`);
    const outbound = within(screen.getByRole('article')).getAllByRole('link')
      .filter((link) => /^https?:\/\//.test(link.getAttribute('href')));
    expect(outbound.length).toBeGreaterThan(0);
    for (const link of outbound) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('shows a not-found state for an unknown slug', () => {
    renderAt('/blog/this-post-does-not-exist-xyz');
    expect(screen.getByText('Blog Post Not Found')).toBeInTheDocument();
    expect(document.title).toContain('Post not found');
    expect(screen.getByRole('heading', { level: 1, name: 'Blog Post Not Found' })).toBeInTheDocument();
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  });
});

describe('BlogPost view count', () => {
  afterEach(() => vi.restoreAllMocks());

  it('adds the view count to the byline once it has loaded', async () => {
    const record = vi.spyOn(blogViews, 'recordBlogView').mockResolvedValue(1234);
    renderAt(`/blog/${sample.slug}/`);
    const byline = await screen.findByText(/· 1\.2k views/);
    expect(screen.getByRole('article')).toContainElement(byline);
    expect(record).toHaveBeenCalledWith(sample.slug);
  });

  it('does not count a view of a missing post', () => {
    const record = vi.spyOn(blogViews, 'recordBlogView');
    renderAt('/blog/this-post-does-not-exist-xyz');
    expect(record).not.toHaveBeenCalled();
  });
});

describe('BlogPost sharing', () => {
  const provide = (name, value) => Object.defineProperty(navigator, name, { configurable: true, value });
  const share = () => fireEvent.click(screen.getByRole('button', { name: 'Share' }));

  afterEach(() => {
    vi.restoreAllMocks();
    delete navigator.share;
    delete navigator.clipboard;
  });

  it('opens the system share sheet with the post details when available', async () => {
    const shareSheet = vi.fn().mockResolvedValue(undefined);
    provide('share', shareSheet);
    renderAt(`/blog/${sample.slug}/`);
    share();
    await waitFor(() => expect(shareSheet).toHaveBeenCalledWith({
      title: sample.title,
      text: sample.summary,
      url: window.location.href,
    }));
    expect(screen.queryByText('Link copied')).toBeNull();
  });

  it('stays quiet when the visitor dismisses the share sheet, but logs real failures', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const shareSheet = vi.fn()
      .mockRejectedValueOnce(Object.assign(new Error('Share canceled'), { name: 'AbortError' }))
      .mockRejectedValueOnce(new Error('Permission denied'));
    provide('share', shareSheet);
    renderAt(`/blog/${sample.slug}/`);

    await act(async () => share());
    expect(error).not.toHaveBeenCalled();

    await act(async () => share());
    expect(error).toHaveBeenCalledWith('Error sharing:', expect.objectContaining({ message: 'Permission denied' }));
  });

  it('copies the link and confirms it when there is no share sheet', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    provide('clipboard', { writeText });
    renderAt(`/blog/${sample.slug}/`);
    share();
    expect(await screen.findByText('Link copied')).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });

  it('explains how to copy the link by hand when the clipboard is blocked', async () => {
    provide('clipboard', { writeText: vi.fn().mockRejectedValue(new Error('denied')) });
    renderAt(`/blog/${sample.slug}/`);
    share();
    expect(await screen.findByText('Could not copy link')).toBeInTheDocument();
    expect(screen.getByText(/copy the url from your browser address bar/i)).toBeInTheDocument();
  });
});
