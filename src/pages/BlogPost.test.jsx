import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BlogPost from './BlogPost';
import { ToastProvider } from '../components/Toast';
import { loadBlogPosts } from '../utils/blogLoader';

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
  });

  it('injects BlogPosting and BreadcrumbList structured data', () => {
    renderAt(`/blog/${sample.slug}`);
    const combined = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => s.textContent)
      .join('');
    expect(combined).toContain('BlogPosting');
    expect(combined).toContain('BreadcrumbList');
  });

  it('renders a "More writing" section linking to other posts', () => {
    renderAt(`/blog/${sample.slug}`);
    expect(screen.getByText('More writing')).toBeInTheDocument();
    const otherLinks = [...document.querySelectorAll('a[href^="/blog/"]')].filter(
      (a) => a.getAttribute('href') !== `/blog/${sample.slug}`
    );
    expect(otherLinks.length).toBeGreaterThan(0);
  });

  it('shows a not-found state for an unknown slug', () => {
    renderAt('/blog/this-post-does-not-exist-xyz');
    expect(screen.getByText('Blog Post Not Found')).toBeInTheDocument();
    expect(document.title).toContain('Post not found');
  });
});
