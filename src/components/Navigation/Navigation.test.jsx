import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';

const renderNav = (scrollToSection = vi.fn(), initialEntries = ['/']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Navigation scrollToSection={scrollToSection} />
    </MemoryRouter>
  );

describe('Navigation', () => {
  it('renders all navigation links', () => {
    renderNav();
    ['Home', 'About', 'Work', 'Projects', 'Blog', 'Contact'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('exposes each section as a focusable in-page anchor', () => {
    renderNav();
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '#about');
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '#contact');
  });

  it('marks the active section with aria-current', () => {
    renderNav();
    // Home is the default active section on first render.
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('aria-current', 'true');
    expect(screen.getByText('About').closest('a')).not.toHaveAttribute('aria-current');
  });

  it('renders a mobile menu toggle button', () => {
    const { container } = renderNav();
    expect(
      container.querySelector('button[aria-label="Toggle mobile menu"]')
    ).toBeInTheDocument();
  });

  it('toggles the mobile menu and locks body scroll', () => {
    const { container } = renderNav();
    const toggle = container.querySelector(
      'button[aria-label="Toggle mobile menu"]'
    );
    act(() => {
      fireEvent.click(toggle);
    });
    expect(document.body.style.overflow).toBe('hidden');
    act(() => {
      fireEvent.click(toggle);
    });
    expect(document.body.style.overflow).toBe('');
  });

  describe('link click behaviour on the home page', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    });

    it('scrolls to the section when already on the home page', () => {
      const scrollToSection = vi.fn();
      renderNav(scrollToSection, ['/']);
      act(() => {
        fireEvent.click(screen.getByText('About'));
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(scrollToSection).toHaveBeenCalledWith('about');
    });
  });
});
