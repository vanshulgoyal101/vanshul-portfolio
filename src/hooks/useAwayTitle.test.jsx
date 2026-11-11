import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAwayTitle } from './useAwayTitle';
import { AWAY_TITLES } from '../constants/wit';

let visibility = 'visible';
Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => visibility });

const setVisibility = state => {
  visibility = state;
  document.dispatchEvent(new Event('visibilitychange'));
};

afterEach(() => {
  visibility = 'visible';
});

describe('useAwayTitle', () => {
  it('shows a playful title while hidden and restores the real one on return', () => {
    document.title = 'Vanshul Goyal';
    renderHook(() => useAwayTitle());

    setVisibility('hidden');
    expect(AWAY_TITLES).toContain(document.title);

    setVisibility('visible');
    expect(document.title).toBe('Vanshul Goyal');
  });

  it('keeps the first saved title if hidden fires twice', () => {
    document.title = 'Writings';
    renderHook(() => useAwayTitle(['Away']));

    setVisibility('hidden');
    setVisibility('hidden');
    setVisibility('visible');
    expect(document.title).toBe('Writings');
  });

  it('keeps a title that changed while the tab was hidden', () => {
    document.title = 'Old page';
    renderHook(() => useAwayTitle(['Away']));

    setVisibility('hidden');
    document.title = 'New page';
    setVisibility('visible');
    expect(document.title).toBe('New page');
  });

  it('restores the title and stops listening on unmount', () => {
    document.title = 'Home';
    const { unmount } = renderHook(() => useAwayTitle(['Away']));

    setVisibility('hidden');
    expect(document.title).toBe('Away');
    unmount();
    expect(document.title).toBe('Home');

    setVisibility('visible');
    setVisibility('hidden');
    expect(document.title).toBe('Home');
  });
});
