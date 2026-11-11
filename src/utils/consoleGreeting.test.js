import { describe, it, expect, vi } from 'vitest';
import { greetConsole } from './consoleGreeting';
import { CONSOLE_GREETING } from '../constants/wit';
import { SOURCE_REPO_URL } from '../constants/siteConfig';

describe('greetConsole', () => {
  it('logs a styled title, then the source link and the Konami hint', () => {
    const target = { log: vi.fn() };
    greetConsole(target);

    expect(target.log).toHaveBeenCalledTimes(2);
    const [title, style] = target.log.mock.calls[0];
    expect(title).toBe(`%c${CONSOLE_GREETING.title}`);
    expect(style).toMatch(/color:/);
    const [body] = target.log.mock.calls[1];
    expect(body).toContain(SOURCE_REPO_URL);
    expect(body).toContain('↑ ↑ ↓ ↓ ← → ← → B A');
  });

  it('does nothing without a usable console', () => {
    expect(() => greetConsole(undefined)).not.toThrow();
    expect(() => greetConsole({})).not.toThrow();
  });
});
