import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ToastProvider } from '../Toast';
import KonamiCode from './KonamiCode';
import { KONAMI_TOAST } from '../../constants/wit';

const KEYS = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const typeCode = () => KEYS.forEach(key => fireEvent.keyDown(window, { key }));

const setReducedMotion = reduce => {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: reduce && query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
};

const renderWithMain = (props = {}) => {
  const view = render(
    <ToastProvider>
      <KonamiCode {...props} />
      <main>content</main>
    </ToastProvider>,
  );
  const main = view.container.querySelector('main');
  const animation = { playState: 'running', cancel: vi.fn() };
  main.animate = vi.fn(() => animation);
  return { ...view, main, animation };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('KonamiCode', () => {
  it('renders nothing visible until the code is typed', () => {
    renderWithMain();
    expect(screen.queryByText(KONAMI_TOAST.title)).toBeNull();
  });

  it('announces the cheat code and barrel-rolls the main content', () => {
    setReducedMotion(false);
    const { main } = renderWithMain();

    typeCode();

    expect(screen.getByText(KONAMI_TOAST.title)).toBeInTheDocument();
    expect(screen.getByText(KONAMI_TOAST.message)).toBeInTheDocument();
    expect(main.animate).toHaveBeenCalledTimes(1);
    const [keyframes, timing] = main.animate.mock.calls[0];
    expect(keyframes.map(frame => frame.transform)).toEqual(['rotate(0turn)', 'rotate(1turn)']);
    expect(keyframes[0].transformOrigin).toMatch(/^50% -?\d+(\.\d+)?px$/);
    expect(timing.duration).toBe(1000);
  });

  it('does not start a second roll while one is still spinning', () => {
    setReducedMotion(false);
    const { main, animation } = renderWithMain();

    typeCode();
    typeCode();
    expect(main.animate).toHaveBeenCalledTimes(1);

    animation.playState = 'finished';
    typeCode();
    expect(main.animate).toHaveBeenCalledTimes(2);
  });

  it('keeps the toast but skips the roll under reduced motion', () => {
    setReducedMotion(true);
    const { main } = renderWithMain();

    typeCode();

    expect(screen.getByText(KONAMI_TOAST.title)).toBeInTheDocument();
    expect(main.animate).not.toHaveBeenCalled();
  });

  it('keeps the toast but skips the roll while ambient motion is switched off', () => {
    setReducedMotion(false);
    const { main } = renderWithMain({ motionEnabled: false });

    typeCode();

    expect(screen.getByText(KONAMI_TOAST.title)).toBeInTheDocument();
    expect(main.animate).not.toHaveBeenCalled();
  });

  it('cancels a running roll on unmount', () => {
    setReducedMotion(false);
    const { animation, unmount } = renderWithMain();

    typeCode();
    unmount();
    expect(animation.cancel).toHaveBeenCalled();
  });

  it('still shows the toast where the Web Animations API is missing', () => {
    render(<ToastProvider><KonamiCode /></ToastProvider>);
    typeCode();
    expect(screen.getByText(KONAMI_TOAST.title)).toBeInTheDocument();
  });
});
