import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Profiler } from 'react';
import Magnetic from './Magnetic';
import { magneticOffset } from '../../utils/magnetic';

// Like the global stand-in, but exposes the offset the magnet asks framer-motion
// to animate to, so the pull can be asserted without running springs.
vi.mock('framer-motion', async (importOriginal) => {
  const React = await import('react');
  const original = await importOriginal();
  return {
    ...original,
    useSpring: original.useMotionValue,
    motion: {
      div: React.forwardRef(function MotionDiv({ style: { x, y, ...style }, ...props }, ref) {
        const element = React.useRef(null);
        React.useImperativeHandle(ref, () => element.current);
        React.useEffect(() => {
          const update = () => {
            element.current.dataset.x = x.get();
            element.current.dataset.y = y.get();
          };
          update();
          const stopX = x.on('change', update);
          const stopY = y.on('change', update);
          return () => { stopX(); stopY(); };
        }, [x, y]);
        return <div ref={element} style={style} {...props} />;
      }),
    },
  };
});

const setMatchMedia = ({ hover = true, reducedMotion = false }) => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query.includes('prefers-reduced-motion') ? reducedMotion : hover,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe('Magnetic', () => {
  it('renders its children', () => {
    render(
      <Magnetic>
        <button>Click me</button>
      </Magnetic>
    );
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders children as a plain fragment when hover pointer is unsupported', () => {
    // matchMedia mock returns matches:false, so the magnetic wrapper is skipped
    render(
      <Magnetic>
        <span>plain</span>
      </Magnetic>
    );
    expect(screen.getByText('plain')).toBeInTheDocument();
  });

  it('renders text children', () => {
    render(<Magnetic>hello world</Magnetic>);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('skips the magnetic wrapper for reduced-motion visitors', () => {
    setMatchMedia({ hover: true, reducedMotion: true });
    const { container } = render(
      <Magnetic>
        <span>calm</span>
      </Magnetic>
    );
    expect(screen.getByText('calm')).toBeInTheDocument();
    expect(container.querySelector('div')).toBeNull();
  });

  it('wraps children once the pointer supports hover and motion is allowed', () => {
    setMatchMedia({ hover: true, reducedMotion: false });
    const { container } = render(
      <Magnetic>
        <span>pulled</span>
      </Magnetic>
    );
    expect(container.querySelector('div')).not.toBeNull();
  });

  it('leans toward the pointer from its centre and settles back when the pointer leaves', () => {
    setMatchMedia({ hover: true, reducedMotion: false });
    const { container } = render(<Magnetic range={40}><button>Pull</button></Magnetic>);
    const magnet = container.firstChild;
    magnet.getBoundingClientRect = () => ({ left: 100, top: 100, width: 80, height: 40 });
    const offset = () => [Number(magnet.dataset.x), Number(magnet.dataset.y)];

    fireEvent.mouseMove(magnet, { clientX: 150, clientY: 110 });
    expect(offset()).toEqual(Object.values(magneticOffset(10, -10, 40)));
    fireEvent.mouseMove(magnet, { clientX: 900, clientY: 120 });
    expect(offset()).toEqual(Object.values(magneticOffset(760, 0, 40)));

    fireEvent.mouseLeave(magnet);
    expect(offset()).toEqual([0, 0]);
  });

  it('updates pointer offsets without re-rendering the React subtree', () => {
    setMatchMedia({ hover: true, reducedMotion: false });
    const commits = vi.fn();
    const { container } = render(
      <Profiler id="magnet" onRender={commits}>
        <Magnetic><button>Pull</button></Magnetic>
      </Profiler>
    );
    const magnet = container.firstChild;
    magnet.getBoundingClientRect = () => ({ left: 100, top: 100, width: 80, height: 40 });
    commits.mockClear();
    for (let clientX = 140; clientX < 160; clientX++) {
      fireEvent.mouseMove(magnet, { clientX, clientY: 130 });
    }
    expect(Number(magnet.dataset.x)).toBeGreaterThan(0);
    fireEvent.mouseLeave(magnet);
    expect(commits).not.toHaveBeenCalled();
  });

  it('follows preference changes and stops listening on unmount', () => {
    const pointer = { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const motion = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    window.matchMedia = vi.fn((query) => (query.includes('prefers-reduced-motion') ? motion : pointer));
    const { container, unmount } = render(<Magnetic><span>icon</span></Magnetic>);
    expect(container.querySelector('div')).not.toBeNull();

    const [, evaluate] = motion.addEventListener.mock.calls[0];
    act(() => {
      motion.matches = true;
      evaluate();
    });
    expect(container.querySelector('div')).toBeNull();
    expect(screen.getByText('icon')).toBeInTheDocument();

    act(() => {
      motion.matches = false;
      evaluate();
    });
    expect(container.firstChild).toHaveAttribute('data-x', '0');
    expect(container.firstChild).toHaveAttribute('data-y', '0');

    unmount();
    expect(pointer.removeEventListener).toHaveBeenCalledWith('change', evaluate);
    expect(motion.removeEventListener).toHaveBeenCalledWith('change', evaluate);
  });
});
