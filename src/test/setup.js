// Global test setup: extends Vitest's expect with jest-dom matchers
// and provides browser API stubs that jsdom does not implement.
import '@testing-library/jest-dom';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount React trees and clear the DOM after every test.
afterEach(() => {
  cleanup();
});

// jsdom does not implement matchMedia — many components query it. Re-install a
// fresh stub before every test so a prior test's vi.restoreAllMocks() can never
// leave it returning undefined (which crashes matchMedia-dependent components).
const installMatchMedia = () => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};
installMatchMedia();
beforeEach(() => {
  installMatchMedia();
});

// Mock framer-motion across all tests: render `motion.*` elements as plain DOM
// nodes and make AnimatePresence render children immediately (its real exit
// animations keep nodes mounted, which breaks removal assertions). Real hooks
// such as useScroll/useSpring are preserved via importOriginal.
vi.mock('framer-motion', async (importOriginal) => {
  const React = await import('react');
  const original = await importOriginal();
  const motion = new Proxy(
    {},
    {
      get: (_target, tag) =>
        React.forwardRef(function MotionMock(props, ref) {
          const {
            children,
            initial,
            animate,
            exit,
            transition,
            variants,
            whileHover,
            whileInView,
            whileTap,
            whileFocus,
            whileDrag,
            viewport,
            layout,
            layoutId,
            drag,
            dragConstraints,
            ...rest
          } = props;
          const type = typeof tag === 'string' ? tag : 'div';
          return React.createElement(type, { ...rest, ref }, children);
        }),
    }
  );
  return {
    ...original,
    motion,
    AnimatePresence: ({ children }) => children,
  };
});

// jsdom does not implement IntersectionObserver — framer-motion whileInView uses it.
if (!window.IntersectionObserver) {
  class IntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  window.IntersectionObserver = IntersectionObserver;
  globalThis.IntersectionObserver = IntersectionObserver;
}

// jsdom does not implement ResizeObserver.
if (!window.ResizeObserver) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
  globalThis.ResizeObserver = ResizeObserver;
}

// scrollIntoView / scrollTo are used by navigation and smooth-scroll helpers.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}
window.scrollTo = window.scrollTo || vi.fn();
