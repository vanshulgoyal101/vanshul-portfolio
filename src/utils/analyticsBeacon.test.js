import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const source = readFileSync('public/a.js', 'utf8');

const boot = (url = 'https://vanshul.com/', privacy = {}) => {
  const listeners = {};
  const fetch = vi.fn(() => Promise.resolve());
  const storage = { getItem: vi.fn(() => 'visitor-id'), setItem: vi.fn() };
  const context = {
    URL,
    location: new URL(url),
    navigator: privacy,
    localStorage: storage,
    fetch,
    history: { pushState() {}, replaceState() {} },
    setTimeout: callback => callback(),
    document: {
      referrer: 'https://search.example/results?private=value',
      querySelector: () => null,
      addEventListener: (name, handler) => { listeners[`document:${name}`] = handler; },
    },
    addEventListener: (name, handler) => { listeners[name] = handler; },
  };
  context.window = context;
  runInNewContext(source, context);
  return { context, fetch, storage, listeners, payloads: () => fetch.mock.calls.map(([, options]) => JSON.parse(options.body)) };
};

describe('analytics beacon privacy', () => {
  it('never records query strings or OAuth token fragments', () => {
    const beacon = boot('https://vanshul.com/?code=secret#access_token=secret&refresh_token=private');
    expect(beacon.payloads()[0].path).toBe('/');
    expect(JSON.stringify(beacon.payloads())).not.toMatch(/secret|private/);
    expect(beacon.payloads()[0].referrer).toBe('search.example');
  });
  it.each(['/dashboard', '/dashboard/', '/dashboard/settings'])('does not collect events on %s', path => {
    const beacon = boot(`https://vanshul.com${path}#access_token=secret`);
    beacon.context.vtrack('private-action');
    expect(beacon.fetch).not.toHaveBeenCalled();
    expect(beacon.storage.getItem).not.toHaveBeenCalled();
  });
  it('retains known section navigation and de-duplicates repeated paths', () => {
    const beacon = boot('https://vanshul.com/#projects');
    beacon.listeners.hashchange();
    expect(beacon.fetch).toHaveBeenCalledTimes(1);
    beacon.context.location.hash = '#about';
    beacon.listeners.hashchange();
    expect(beacon.payloads().map(payload => payload.path)).toEqual(['/#projects', '/#about']);
  });
  it('strips credentials, queries, and fragments from outbound URLs', () => {
    const beacon = boot();
    beacon.context.vtrack('https://user:password@example.test/page?token=secret#private', 'link');
    expect(beacon.payloads().at(-1).name).toBe('https://example.test/page');
  });
  it('sanitizes outbound click tracking through the same boundary', () => {
    const beacon = boot();
    beacon.listeners['document:click']({ target: { closest: () => ({ getAttribute: name => name === 'href' ? 'https://example.test/?token=secret#private' : null }) } });
    expect(beacon.payloads().at(-1).name).toBe('https://example.test/');
  });
  it('rejects non-web URL instrumentation', () => {
    const beacon = boot();
    beacon.context.vtrack('javascript:alert(1)', 'link');
    expect(beacon.fetch).toHaveBeenCalledTimes(1);
  });
  it.each([{ doNotTrack: '1' }, { globalPrivacyControl: true }])('honors browser privacy preferences %j', privacy => {
    const beacon = boot('https://vanshul.com/', privacy);
    expect(beacon.fetch).not.toHaveBeenCalled();
    expect(beacon.storage.getItem).not.toHaveBeenCalled();
    expect(beacon.context.vtrack).toBeUndefined();
  });
  it('does not let blocked fetch or storage break navigation', () => {
    const beacon = boot();
    beacon.fetch.mockImplementation(() => { throw new Error('blocked'); });
    beacon.storage.getItem.mockImplementation(() => { throw new Error('blocked'); });
    expect(() => beacon.context.vtrack('test')).not.toThrow();
    expect(() => beacon.context.history.pushState()).not.toThrow();
  });
});