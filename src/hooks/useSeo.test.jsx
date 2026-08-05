import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSeo } from './useSeo';
import { SITE_URL, DEFAULT_OG_IMAGE } from '../constants/siteConfig';

const metaContent = (attr, key) =>
  document.head.querySelector(`meta[${attr}="${key}"]`)?.getAttribute('content');
const linkHref = (rel) =>
  document.head.querySelector(`link[rel="${rel}"]`)?.getAttribute('href');

afterEach(() => {
  // Any stray tags a test appended manually are cleaned here.
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((n) => n.remove());
});

describe('useSeo', () => {
  it('sets the document title and restores it on unmount', () => {
    document.title = 'Original Title';
    const { unmount } = renderHook(() => useSeo({ title: 'Post Title', path: '/blog/x' }));
    expect(document.title).toBe('Post Title');
    unmount();
    expect(document.title).toBe('Original Title');
  });

  it('creates canonical, Open Graph and Twitter tags from options', () => {
    const { unmount } = renderHook(() =>
      useSeo({ title: 'T', description: 'D', path: '/blog/y', image: 'https://vanshul.com/og/y.png' })
    );
    expect(metaContent('name', 'description')).toBe('D');
    expect(metaContent('property', 'og:title')).toBe('T');
    expect(metaContent('property', 'og:description')).toBe('D');
    expect(metaContent('property', 'og:url')).toBe(`${SITE_URL}/blog/y`);
    expect(metaContent('property', 'og:image')).toBe('https://vanshul.com/og/y.png');
    expect(metaContent('property', 'og:image:alt')).toBe('T');
    expect(metaContent('name', 'twitter:title')).toBe('T');
    expect(metaContent('name', 'twitter:description')).toBe('D');
    expect(linkHref('canonical')).toBe(`${SITE_URL}/blog/y`);

    unmount();
    // Tags this hook created should be removed again on cleanup.
    expect(metaContent('property', 'og:title')).toBeUndefined();
    expect(linkHref('canonical')).toBeUndefined();
  });

  it('falls back to the default OG image when none is provided', () => {
    const { unmount } = renderHook(() => useSeo({ title: 'T' }));
    expect(metaContent('property', 'og:image')).toBe(DEFAULT_OG_IMAGE);
    unmount();
  });

  it('adds article metadata for the article type', () => {
    const { unmount } = renderHook(() =>
      useSeo({
        title: 'A',
        type: 'article',
        path: '/blog/a',
        article: {
          publishedTime: '2025-01-01',
          modifiedTime: '2025-02-01',
          author: 'Vanshul Goyal',
          section: 'AI',
        },
      })
    );
    expect(metaContent('property', 'og:type')).toBe('article');
    expect(metaContent('property', 'article:published_time')).toBe('2025-01-01');
    expect(metaContent('property', 'article:modified_time')).toBe('2025-02-01');
    expect(metaContent('property', 'article:author')).toBe('Vanshul Goyal');
    expect(metaContent('property', 'article:section')).toBe('AI');
    unmount();
  });

  it('injects a JSON-LD script and removes it on unmount', () => {
    const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BlogPosting' });
    const { unmount } = renderHook(() => useSeo({ title: 'J', jsonLd }));
    const script = document.head.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(script.textContent).toBe(jsonLd);
    unmount();
    expect(document.head.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('restores a pre-existing description meta instead of deleting it', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'default description');
    document.head.appendChild(meta);

    const { unmount } = renderHook(() => useSeo({ title: 'T', description: 'new description' }));
    expect(metaContent('name', 'description')).toBe('new description');
    unmount();
    expect(metaContent('name', 'description')).toBe('default description');
    meta.remove();
  });
});
