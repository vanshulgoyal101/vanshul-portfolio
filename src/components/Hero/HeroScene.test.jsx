import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HeroScene from './HeroScene';

// jsdom has no WebGL: stand in for the react-three-fiber canvas (exposing the
// frame loop it was asked for) and skip the three.js scene graph entirely.
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ frameloop }) => <canvas data-frameloop={frameloop} />,
}));
vi.mock('./FloatingShape', () => ({ default: () => null }));

let observers;
let hidden;

beforeEach(() => {
  observers = [];
  hidden = false;
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback) {
      this.callback = callback;
      this.observe = vi.fn();
      this.disconnect = vi.fn();
      observers.push(this);
    }
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const renderScene = () => {
  const { container, unmount } = render(<HeroScene />);
  return { scene: container.firstChild, canvas: container.querySelector('canvas'), unmount };
};

const intersect = (isIntersecting) => act(() => observers[0].callback([{ isIntersecting }]));

const visibility = (value) => act(() => {
  hidden = value;
  document.dispatchEvent(new Event('visibilitychange'));
});

describe('HeroScene', () => {
  it('renders frames only while it is on screen in a visible tab', () => {
    const { scene, canvas } = renderScene();
    expect(observers[0].observe).toHaveBeenCalledWith(scene);
    expect(scene).toHaveAttribute('data-scene-active', 'false');
    expect(canvas).toHaveAttribute('data-frameloop', 'never');

    intersect(true);
    expect(scene).toHaveAttribute('data-scene-active', 'true');
    expect(canvas).toHaveAttribute('data-frameloop', 'always');

    visibility(true);
    expect(canvas).toHaveAttribute('data-frameloop', 'never');
    visibility(false);
    expect(canvas).toHaveAttribute('data-frameloop', 'always');

    intersect(false);
    expect(scene).toHaveAttribute('data-scene-active', 'false');
    expect(canvas).toHaveAttribute('data-frameloop', 'never');
  });

  it('stays paused when scrolled into view while the tab is hidden', () => {
    const { canvas } = renderScene();
    visibility(true);
    intersect(true);
    expect(canvas).toHaveAttribute('data-frameloop', 'never');
  });

  it('stops observing the viewport and the tab on unmount', () => {
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderScene();
    const [, update] = add.mock.calls.find(([type]) => type === 'visibilitychange');
    unmount();
    expect(observers[0].disconnect).toHaveBeenCalled();
    expect(remove).toHaveBeenCalledWith('visibilitychange', update);
  });
});
