import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { act, render, screen, fireEvent } from '@testing-library/react';
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

    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
    expect(localStorage.getItem('vg.cursor')).toBe('on');
  });

  it('is off and disabled, with the reason, for reduced-motion visitors', () => {
    window.matchMedia = vi.fn((query) => ({
      matches: /hover: hover|prefers-reduced-motion/.test(query),
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    render(<CursorToggle />);
    const toggle = screen.getByRole('switch', { name: 'Custom cursor' });
    expect(toggle).toBeDisabled();
    expect(toggle).not.toBeChecked();
    expect(toggle.closest('label')).toHaveAttribute('title', 'Disabled by your reduced-motion preference');
  });

  it('appears when a mouse is connected and stops listening on unmount', () => {
    const pointer = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const motion = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    window.matchMedia = vi.fn((query) => (query.includes('pointer: fine') ? pointer : motion));
    const { container, unmount } = render(<CursorToggle />);
    expect(container).toBeEmptyDOMElement();

    const [, sync] = pointer.addEventListener.mock.calls[0];
    act(() => {
      pointer.matches = true;
      sync();
    });
    expect(screen.getByRole('switch', { name: 'Custom cursor' })).toBeChecked();

    unmount();
    expect(pointer.removeEventListener).toHaveBeenCalledWith('change', sync);
    expect(motion.removeEventListener).toHaveBeenCalledWith('change', sync);
  });
});
