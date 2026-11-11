import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, renderHook } from '@testing-library/react';
import { useKonamiCode, KONAMI_SEQUENCE } from './useKonamiCode';

const KEYS = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const type = (keys, target = window, options = {}) => {
  for (const key of keys) fireEvent.keyDown(target, { key, ...options });
};

describe('useKonamiCode', () => {
  it('exposes the classic sequence', () => {
    expect(KONAMI_SEQUENCE).toEqual(KEYS.map(key => key.toLowerCase()));
  });

  it('fires once per completed sequence, ignoring letter case', () => {
    const onUnlock = vi.fn();
    renderHook(() => useKonamiCode(onUnlock));

    type(KEYS.slice(0, -2));
    expect(onUnlock).not.toHaveBeenCalled();
    type(['B', 'A']);
    expect(onUnlock).toHaveBeenCalledTimes(1);

    type(KEYS);
    expect(onUnlock).toHaveBeenCalledTimes(2);
  });

  it('matches the sequence after extra or mistyped keys', () => {
    const onUnlock = vi.fn();
    renderHook(() => useKonamiCode(onUnlock));

    type(['ArrowUp', 'x', 'ArrowUp', ...KEYS]);
    expect(onUnlock).toHaveBeenCalledTimes(1);
  });

  it('does not fire when a key in the middle is wrong', () => {
    const onUnlock = vi.fn();
    renderHook(() => useKonamiCode(onUnlock));

    type([...KEYS.slice(0, 5), 'ArrowUp', ...KEYS.slice(6)]);
    expect(onUnlock).not.toHaveBeenCalled();
  });

  it('ignores typing in form fields and modified keys', () => {
    const onUnlock = vi.fn();
    renderHook(() => useKonamiCode(onUnlock));
    const { container } = render(<form><input aria-label="name" /><div contentEditable /></form>);

    type(KEYS, container.querySelector('input'));
    type(KEYS, container.querySelector('[contenteditable]'));
    type(KEYS, window, { ctrlKey: true });
    expect(onUnlock).not.toHaveBeenCalled();
  });

  it('uses the latest callback and stops listening on unmount', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender, unmount } = renderHook(({ cb }) => useKonamiCode(cb), { initialProps: { cb: first } });

    rerender({ cb: second });
    type(KEYS);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);

    unmount();
    type(KEYS);
    expect(second).toHaveBeenCalledTimes(1);
  });
});
