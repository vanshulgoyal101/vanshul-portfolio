import { describe, it, expect } from 'vitest';
import { classifyLink } from './links';

describe('classifyLink', () => {
  it('keeps in-page anchors on the page', () => {
    expect(classifyLink('#why-judgment')).toEqual({ kind: 'anchor', href: '#why-judgment' });
  });

  it('routes root-relative links inside the app', () => {
    expect(classifyLink('/blog/the-two-worlds/')).toEqual({ kind: 'internal', href: '/blog/the-two-worlds/' });
    expect(classifyLink('/#about')).toEqual({ kind: 'internal', href: '/#about' });
  });

  it('treats absolute links to this site, with or without www, as internal paths', () => {
    expect(classifyLink('https://vanshul.com/blog/x/?ref=post#part')).toEqual({ kind: 'internal', href: '/blog/x/?ref=post#part' });
    expect(classifyLink('https://www.vanshul.com/reading-list/')).toEqual({ kind: 'internal', href: '/reading-list/' });
  });

  it('opens other websites, including subdomains, as external links', () => {
    expect(classifyLink('https://nav.al/')).toEqual({ kind: 'external', href: 'https://nav.al/' });
    expect(classifyLink('https://games.vanshul.com/')).toEqual({ kind: 'external', href: 'https://games.vanshul.com/' });
    expect(classifyLink('//cdn.example.com/x')).toEqual({ kind: 'external', href: '//cdn.example.com/x' });
    expect(classifyLink('//vanshul.com/blog/')).toEqual({ kind: 'internal', href: '/blog/' });
  });

  it('leaves non-web and relative links to the browser', () => {
    for (const href of ['mailto:hello@example.com', 'tel:+911234567890', 'notes/', '']) {
      expect(classifyLink(href)).toEqual({ kind: 'other', href });
    }
    expect(classifyLink(undefined)).toEqual({ kind: 'other', href: '' });
  });
});
