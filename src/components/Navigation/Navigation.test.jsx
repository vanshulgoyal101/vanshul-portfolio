import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const Location = () => {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.hash}</output>;
};

const renderNav = (initialEntries = ['/']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Navigation />
      <Location />
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
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/#about');
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/#contact');
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

  it.each(['/', '/reading-list', '/blog/example'])('navigates from %s without timers', route => {
    renderNav([route]);
    fireEvent.click(screen.getByRole('link', { name: 'Projects' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/#projects');
  });

  it('preserves modified-click browser behavior', () => {
    renderNav();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
    screen.getByRole('link', { name: 'Projects' }).dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
  });

  it('excludes the closed mobile menu and restores focus and scrolling on Escape', () => {
    window.matchMedia.mockImplementation(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    renderNav();
    const toggle = document.querySelector('button[aria-controls="primary-menu"]');
    const menu = document.getElementById(toggle.getAttribute('aria-controls'));
    expect(menu).toHaveAttribute('inert');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(menu).not.toHaveAttribute('inert');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Home' }));
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(toggle);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.body.style.overflow).toBe('');
  });
});
