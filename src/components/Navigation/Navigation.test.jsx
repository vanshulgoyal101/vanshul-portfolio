import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
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

  it.each([
    ['/blog/', 'Blog'],
    ['/blog/the-new-leverage/', 'Blog'],
    ['/reading-list/', 'Blog'],
  ])('highlights Blog on %s', (route, label) => {
    renderNav([route]);
    expect(screen.getByText(label).closest('a')).toHaveAttribute('aria-current', 'true');
    expect(screen.getByText('Home').closest('a')).not.toHaveAttribute('aria-current');
  });

  it('highlights nothing on pages outside the homepage and writing', () => {
    renderNav(['/no-such-page']);
    expect(document.querySelector('[aria-current]')).toBeNull();
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

  it('returns to the top of the homepage from the logo', () => {
    renderNav(['/blog/']);
    fireEvent.click(screen.getByRole('link', { name: 'Vanshul Goyal, home' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/#home');
  });

  it('keeps the shared header offset in step with the height of the bar', () => {
    renderNav();
    const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
    const offset = () => document.documentElement.style.getPropertyValue('--header-offset');
    expect(offset()).toBe('20px');
    vi.spyOn(nav, 'getBoundingClientRect').mockReturnValue({ bottom: 72 });
    act(() => window.dispatchEvent(new Event('resize')));
    expect(offset()).toBe('92px');
  });

  it('highlights the section crossing the upper third of the viewport as the page scrolls', () => {
    const sections = ['home', 'projects', 'about'].map((id) => {
      const section = document.createElement('section');
      section.id = id;
      document.body.append(section);
      return section;
    });
    renderNav();
    const place = (id, top, bottom) => vi.spyOn(document.getElementById(id), 'getBoundingClientRect').mockReturnValue({ top, bottom });
    place('home', -900, -300);
    place('projects', -300, 200);
    place('about', 200, 900);
    act(() => window.dispatchEvent(new Event('scroll')));
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
    sections.forEach((section) => section.remove());
  });
});

describe('Navigation mobile menu', () => {
  let media;

  beforeEach(() => {
    media = { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    window.matchMedia.mockImplementation(() => media);
  });

  const openMenu = () => {
    const toggle = document.querySelector('button[aria-controls="primary-menu"]');
    fireEvent.click(toggle);
    return { toggle, links: within(document.getElementById('primary-menu')).getAllByRole('link') };
  };

  it('keeps Tab and Shift+Tab inside the open menu', () => {
    renderNav();
    const { toggle, links } = openMenu();
    const tab = (shiftKey = false) => fireEvent.keyDown(document, { key: 'Tab', shiftKey });

    // Wraps from the last control back to the first.
    toggle.focus();
    expect(tab()).toBe(false);
    expect(links[0]).toHaveFocus();

    // Moves between items are left to the browser.
    links[2].focus();
    expect(tab()).toBe(true);
    expect(tab(true)).toBe(true);

    // Focus that escaped the menu is pulled back in at either end.
    links[2].blur();
    tab();
    expect(links[0]).toHaveFocus();
    links[0].blur();
    tab(true);
    expect(toggle).toHaveFocus();
  });

  it('closes from its backdrop and returns focus to the toggle', () => {
    const { container } = renderNav();
    const { toggle } = openMenu();
    fireEvent.click(container.querySelector('nav + div'));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes when the viewport widens to the desktop layout', () => {
    renderNav();
    const { toggle } = openMenu();
    const [, update] = media.addEventListener.mock.calls.find(([type]) => type === 'change');
    act(() => {
      media.matches = false;
      update();
    });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('primary-menu')).not.toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('');
  });
});
