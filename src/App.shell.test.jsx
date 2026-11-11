import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as framerMotion from 'framer-motion';
import App from './App';

// A controllable stand-in for the boot greeting: the shell must keep the page
// hidden until the intro reports completion.
vi.mock('./components/FunElements/BootLoader', () => ({
  default: ({ onComplete }) => <button type="button" onClick={onComplete}>Finish intro</button>,
}));

// Decorative layers wait for browser idle time; make the browser idle at once.
vi.mock('./hooks/useIdle', () => ({ useIdle: () => true }));

// The ambient layer's chunks are lazy; their first import can be slow when the
// whole suite runs in parallel.
const LAZY = { timeout: 5000 };

const renderAt = (path) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

const finishIntro = () => fireEvent.click(screen.getByRole('button', { name: 'Finish intro' }));
const findRocket = () => screen.findByRole('button', { name: /launch rocket/i }, LAZY);
const queryRocket = () => screen.queryByRole('button', { name: /launch rocket/i });

const ambientSwitch = () => {
  document.querySelector('footer details').open = true;
  return screen.getByRole('switch', { name: 'Ambient motion' });
};

beforeEach(() => {
  localStorage.clear();
  window.scrollTo.mockClear();
  // Keep jsdom from logging "not implemented" for the decorative canvases.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
  delete document.fonts;
  document.body.style.overflow = '';
  window.history.pushState({}, '', '/');
});

describe('App intro', () => {
  it('keeps the page hidden, inert and unscrollable until the intro finishes', () => {
    document.body.style.overflow = 'auto';
    renderAt('/no-such-page');
    const page = screen.getByRole('link', { name: 'Skip to content' }).parentElement;
    expect(page).toHaveAttribute('inert');
    expect(page).toHaveStyle({ opacity: '0' });
    expect(document.body.style.overflow).toBe('hidden');

    finishIntro();
    expect(screen.queryByRole('button', { name: 'Finish intro' })).toBeNull();
    expect(page).not.toHaveAttribute('inert');
    expect(page).toHaveStyle({ opacity: '1' });
    expect(document.body.style.overflow).toBe('auto');
  });
});

describe('App deep links', () => {
  it('moves to the linked section only after the intro has finished', async () => {
    renderAt('/no-such-page#main-content');
    const main = document.getElementById('main-content');
    await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    expect(main).not.toHaveFocus();

    finishIntro();
    await waitFor(() => expect(main).toHaveFocus());
    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'instant' }));
  });

  it('waits for web fonts so the section lands where the final layout puts it', async () => {
    let fontsReady;
    document.fonts = { ready: new Promise((resolve) => { fontsReady = resolve; }) };
    renderAt('/no-such-page#main-content');
    const main = document.getElementById('main-content');
    finishIntro();
    await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    expect(main).not.toHaveFocus();

    await act(async () => fontsReady());
    await waitFor(() => expect(main).toHaveFocus());
  });

  it('drops a pending deep-link scroll when the app unmounts', async () => {
    // Keep the ambient layer out so the only frame requested is the scroll's.
    localStorage.setItem('vg.ambient', 'off');
    const pending = new Map();
    let handle = 0;
    vi.stubGlobal('requestAnimationFrame', (callback) => {
      pending.set(++handle, callback);
      return handle;
    });
    vi.stubGlobal('cancelAnimationFrame', (id) => pending.delete(id));
    let fontsReady;
    document.fonts = { ready: new Promise((resolve) => { fontsReady = resolve; }) };

    const first = renderAt('/no-such-page#main-content');
    finishIntro();
    first.unmount();
    await act(async () => fontsReady());
    expect(pending.size).toBe(0);

    document.fonts = { ready: Promise.resolve() };
    const second = renderAt('/no-such-page#main-content');
    finishIntro();
    await act(async () => {});
    expect(pending.size).toBe(1);
    second.unmount();
    expect(pending.size).toBe(0);
  });
});

describe('App ambient motion', () => {
  it('starts the ambient layer after the intro and remembers switching it off and on', async () => {
    renderAt('/no-such-page');
    expect(queryRocket()).toBeNull();
    finishIntro();
    expect(await findRocket()).toBeInTheDocument();

    const toggle = ambientSwitch();
    expect(toggle).toBeChecked();
    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();
    expect(localStorage.getItem('vg.ambient')).toBe('off');
    expect(queryRocket()).toBeNull();

    fireEvent.click(toggle);
    expect(localStorage.getItem('vg.ambient')).toBe('on');
    expect(await findRocket()).toBeInTheDocument();
  });

  it('keeps the ambient layer off for a visitor who switched it off before', async () => {
    localStorage.setItem('vg.ambient', 'off');
    renderAt('/no-such-page');
    finishIntro();
    const toggle = ambientSwitch();
    expect(toggle).not.toBeChecked();
    expect(queryRocket()).toBeNull();

    fireEvent.click(toggle);
    expect(await findRocket()).toBeInTheDocument();
  });

  it('defaults to ambient motion and still toggles it when storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied'); });
    renderAt('/no-such-page');
    finishIntro();
    expect(await findRocket()).toBeInTheDocument();

    const toggle = ambientSwitch();
    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();
    expect(queryRocket()).toBeNull();
  });

  it('never starts the ambient layer for reduced-motion visitors', async () => {
    vi.spyOn(framerMotion, 'useReducedMotion').mockReturnValue(true);
    renderAt('/no-such-page');
    finishIntro();
    await act(async () => {});
    expect(queryRocket()).toBeNull();
    const toggle = ambientSwitch();
    expect(toggle).toBeDisabled();
    expect(toggle).not.toBeChecked();
  });

  it('lets the Konami code roll the page only while ambient motion is on', () => {
    const animate = vi.fn(() => ({ playState: 'finished', cancel: vi.fn() }));
    renderAt('/no-such-page');
    finishIntro();
    document.querySelector('main').animate = animate;
    const typeCode = () => ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
      .forEach(key => fireEvent.keyDown(window, { key }));

    typeCode();
    expect(animate).toHaveBeenCalledTimes(1);

    fireEvent.click(ambientSwitch());
    typeCode();
    expect(animate).toHaveBeenCalledTimes(1);
    expect(screen.getAllByText('Cheat code accepted 🎮')).toHaveLength(2);
  });
});
