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
});
