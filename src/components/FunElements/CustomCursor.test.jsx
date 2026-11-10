import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CustomCursor from './CustomCursor';
import { setCursorPreference } from '../../utils/cursorPreference';

// Like the global stand-in, but exposes the scale each cursor part animates to,
// so the hover state can be asserted without running animations.
vi.mock('framer-motion', async (importOriginal) => {
  const React = await import('react');
  return {
    ...(await importOriginal()),
    motion: {
      div: React.forwardRef(function MotionDiv({ animate, transition, ...props }, ref) {
        return <div ref={ref} data-scale={animate?.scale} {...props} />;
      }),
    },
  };
});

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

  it('grows over links, buttons and custom interactive targets, and settles over plain content', () => {
    const { container } = render(<CustomCursor />);
    render(
      <div>
        <a href="#top"><span>Inside a link</span></a>
        <button type="button">A button</button>
        <div className="interactive"><span>Custom control</span></div>
        <div role="button">Role button</div>
        <div style={{ cursor: 'pointer' }}>Pointer target</div>
        <p>Plain text</p>
      </div>
    );
    fireEvent.mouseMove(window, { clientX: 120, clientY: 80 });
    flushFrames();
    const [dot, ring] = container.children;
    const hover = (element) => {
      fireEvent.mouseOver(element);
      return Number(ring.dataset.scale) > 1 && Number(dot.dataset.scale) < 1;
    };

    expect(hover(screen.getByText('Plain text'))).toBe(false);
    for (const label of ['Inside a link', 'A button', 'Custom control', 'Role button', 'Pointer target']) {
      expect(hover(screen.getByText(label))).toBe(true);
      expect(hover(screen.getByText('Plain text'))).toBe(false);
    }

    // Disclosures, selects and switch labels are pointer targets too; a text
    // field's label is not.
    render(
      <div>
        <details><summary>Disclosure</summary></details>
        <select aria-label="Range"><option>One</option></select>
        <label><input type="checkbox" role="switch" /> <span>Switch label</span></label>
        <label htmlFor="name-field">Field label</label>
        <input id="name-field" />
      </div>
    );
    for (const element of [screen.getByText('Disclosure'), screen.getByLabelText('Range'), screen.getByText('Switch label')]) {
      expect(hover(element)).toBe(true);
      expect(hover(screen.getByText('Plain text'))).toBe(false);
    }
    expect(hover(screen.getByText('Field label'))).toBe(false);

    // Events that do not come from an element leave the current state alone.
    hover(screen.getByText('A button'));
    expect(hover(document)).toBe(true);
  });
});