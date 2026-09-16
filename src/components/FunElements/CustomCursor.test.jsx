import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CustomCursor from './CustomCursor';
import { setCursorPreference } from '../../utils/cursorPreference';

const frames = new Map();
let nextFrame;

beforeEach(() => {
  nextFrame = 0;
  frames.clear();
  localStorage.removeItem('vg.cursor');
  window.matchMedia = vi.fn(query => ({
    matches: query.includes('pointer: fine'),
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
  }));
  vi.stubGlobal('requestAnimationFrame', callback => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal('cancelAnimationFrame', handle => frames.delete(handle));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.removeItem('vg.cursor');
});

const flushFrames = () => act(() => {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach(callback => callback(performance.now()));
});

describe('CustomCursor', () => {
  it('keeps the native cursor until a position has been rendered', () => {
    const { container } = render(<CustomCursor />);
    expect(container).toBeEmptyDOMElement();
    expect(document.body).not.toHaveClass('has-custom-cursor');
    fireEvent.mouseMove(window, { clientX: 120, clientY: 80 });
    expect(document.body).not.toHaveClass('has-custom-cursor');
    flushFrames();
    expect(container.children).toHaveLength(2);
    expect(document.body).toHaveClass('has-custom-cursor');
  });

  it.each(['mouseleave', 'blur'])('cancels pending movement on %s', event => {
    const { container } = render(<CustomCursor />);
    fireEvent.mouseMove(window, { clientX: 120, clientY: 80 });
    flushFrames();
    fireEvent.mouseMove(window, { clientX: 200, clientY: 100 });
    fireEvent(event === 'blur' ? window : document, new Event(event));
    flushFrames();
    expect(container).toBeEmptyDOMElement();
    expect(document.body).not.toHaveClass('has-custom-cursor');
    fireEvent.mouseEnter(document);
    expect(container).toBeEmptyDOMElement();
    fireEvent.mouseMove(window, { clientX: 220, clientY: 130 });
    flushFrames();
    expect(document.body).toHaveClass('has-custom-cursor');
  });

  it('restores the native cursor on preference change and unmount', () => {
    const { unmount } = render(<CustomCursor />);
    fireEvent.mouseMove(window, { clientX: 120, clientY: 80 });
    flushFrames();
    act(() => setCursorPreference('off'));
    expect(document.body).not.toHaveClass('has-custom-cursor');
    act(() => setCursorPreference('on'));
    expect(document.body).not.toHaveClass('has-custom-cursor');
    fireEvent.mouseMove(window, { clientX: 240, clientY: 160 });
    flushFrames();
    expect(document.body).toHaveClass('has-custom-cursor');
    unmount();
    flushFrames();
    expect(document.body).not.toHaveClass('has-custom-cursor');
  });
});