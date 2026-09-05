import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scrollToSection } from './scrollToSection';

describe('scrollToSection', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 900,
    });
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it('scrolls just below the fixed navigation instead of hiding the section under it', () => {
    const section = document.createElement('section');
    section.id = 'work';
    Object.defineProperty(section, 'offsetTop', {
      value: 320,
      configurable: true,
    });
    section.getBoundingClientRect = () => ({ top: 0, height: 500 });
    document.body.appendChild(section);

    const nav = document.createElement('nav');
    nav.setAttribute('data-site-header', '');
    nav.getBoundingClientRect = () => ({ bottom: 96 });
    Object.defineProperty(nav, 'offsetHeight', {
      value: 96,
      configurable: true,
    });
    document.body.appendChild(nav);

    scrollToSection('work');

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 320 - 96 - 20,
      behavior: 'smooth',
    });

    document.body.removeChild(section);
    document.body.removeChild(nav);
  });

  it('includes positioned ancestors and ignores animation transforms', () => {
    const parent = document.createElement('section');
    const heading = document.createElement('h2');
    parent.id = 'projects';
    parent.appendChild(heading);
    document.body.appendChild(parent);
    Object.defineProperty(parent, 'offsetTop', { value: 600 });
    Object.defineProperty(heading, 'offsetTop', { value: 80 });
    Object.defineProperty(heading, 'offsetParent', { value: parent });
    scrollToSection('projects', { focus: true });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 660, behavior: 'smooth' });
    expect(document.activeElement).toBe(heading);
    expect(heading).toHaveAttribute('data-section-focus');
    parent.remove();
  });

  it('does not animate scrolling when reduced motion is requested', () => {
    window.matchMedia.mockReturnValue({ matches: true });
    const section = document.createElement('section');
    document.body.appendChild(section);
    scrollToSection(section);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
    section.remove();
  });

  it('returns false for missing targets', () => {
    expect(scrollToSection('missing')).toBe(false);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('focuses the home h1 instead of outlining the entire home wrapper', () => {
    const section = document.createElement('div');
    section.id = 'home';
    const heading = document.createElement('h1');
    heading.textContent = 'Vanshul Goyal';
    section.appendChild(heading);
    document.body.appendChild(section);
    scrollToSection('home', { focus: true });
    expect(document.activeElement).toBe(heading);
    expect(heading).toHaveAttribute('data-section-focus');
    expect(section).not.toHaveAttribute('tabindex');
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    section.remove();
  });

  it('marks a headingless section fallback without marking interactive targets', () => {
    const section = document.createElement('section');
    const button = document.createElement('button');
    document.body.append(section, button);
    scrollToSection(section, { focus: true });
    expect(document.activeElement).toBe(section);
    expect(section).toHaveAttribute('data-section-focus');
    scrollToSection(button, { focus: true });
    expect(document.activeElement).toBe(button);
    expect(button).not.toHaveAttribute('data-section-focus');
    section.remove();
    button.remove();
  });

  it('keeps skip navigation focused on main content instead of a nested heading', () => {
    const main = document.createElement('div');
    main.id = 'main-content';
    main.appendChild(document.createElement('h1'));
    document.body.appendChild(main);
    scrollToSection('main-content', { focus: true });
    expect(document.activeElement).toBe(main);
    main.remove();
  });
});
