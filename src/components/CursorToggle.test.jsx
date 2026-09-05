import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CursorToggle from './CursorToggle';

const originalMatchMedia = window.matchMedia;

const mockPointerFine = (fine) => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: fine && /hover: hover/.test(query),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
};

beforeEach(() => localStorage.clear());
afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
});

describe('CursorToggle', () => {
  it('renders nothing on touch (coarse pointer) devices', () => {
    mockPointerFine(false);
    const { container } = render(<CursorToggle />);
    expect(container.firstChild).toBeNull();
  });

  it('reflects and flips the preference on a fine-pointer device', () => {
    mockPointerFine(true);
    localStorage.setItem('vg.cursor', 'on');

    render(<CursorToggle />);
    const toggle = screen.getByRole('switch', { name: 'Custom cursor' });
    expect(toggle).toBeChecked();

    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();
    expect(localStorage.getItem('vg.cursor')).toBe('off');
  });
});
