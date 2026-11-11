import { describe, it, expect } from 'vitest';
import { FOOTER_QUIPS, NOT_FOUND_QUIPS, AWAY_TITLES, KONAMI_TOAST, CONSOLE_GREETING } from './wit';

describe('playful copy', () => {
  it.each([
    ['FOOTER_QUIPS', FOOTER_QUIPS],
    ['NOT_FOUND_QUIPS', NOT_FOUND_QUIPS],
    ['AWAY_TITLES', AWAY_TITLES],
  ])('%s offers several distinct, non-empty lines', (_name, lines) => {
    expect(lines.length).toBeGreaterThan(1);
    expect(new Set(lines).size).toBe(lines.length);
    for (const line of lines) expect(line.trim()).not.toBe('');
  });

  it('keeps away titles short enough to read on a tab', () => {
    for (const title of AWAY_TITLES) expect(title.length).toBeLessThanOrEqual(40);
  });

  it('gives the toast and console greeting a title and text', () => {
    expect(KONAMI_TOAST.title).toBeTruthy();
    expect(KONAMI_TOAST.message).toBeTruthy();
    expect(CONSOLE_GREETING.title).toBeTruthy();
    expect(CONSOLE_GREETING.lines.length).toBeGreaterThan(0);
  });
});
