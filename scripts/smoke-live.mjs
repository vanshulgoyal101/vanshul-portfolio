#!/usr/bin/env node
/**
 * Read-only smoke of the live site, run by .github/workflows/live-smoke.yml
 * after every deploy and daily. Needs no installed dependencies.
 *
 *   node scripts/smoke-live.mjs [--expect <commit>] [--site <url>] [--wait-minutes <n>]
 *
 * With --expect it first waits for production to serve that commit, and skips
 * (exit 0) when main has already moved past it. Exits 1 on any failure.
 */
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { SITE_URL } from '../src/constants/siteConfig.js';
import { runLiveSmoke } from './lib/liveSmoke.mjs';

const { values } = parseArgs({
  options: {
    expect: { type: 'string' },
    site: { type: 'string', default: SITE_URL },
    'wait-minutes': { type: 'string', default: '15' },
  },
});

const mainCommit = async () => {
  try {
    const line = execFileSync('git', ['ls-remote', 'origin', 'refs/heads/main'], { encoding: 'utf8', timeout: 30_000, stdio: ['ignore', 'pipe', 'ignore'] });
    return line.split(/\s/)[0] || undefined;
  } catch {
    return undefined;
  }
};

const annotate = (level, message) => console.log(process.env.GITHUB_ACTIONS === 'true' ? `::${level}::${message}` : message);

const waitMinutes = Number(values['wait-minutes']);
if (!Number.isFinite(waitMinutes) || waitMinutes < 0) throw new Error(`--wait-minutes must be a non-negative number, got "${values['wait-minutes']}"`);

const result = await runLiveSmoke({
  site: values.site.replace(/\/+$/, ''),
  expected: values.expect || undefined,
  fetch: globalThis.fetch,
  mainCommit,
  timeoutMs: waitMinutes * 60_000,
  log: message => console.log(message),
});

for (const failure of result.failures) annotate('error', failure);
annotate(result.status === 'failed' ? 'error' : 'notice', `Live smoke ${result.status}: ${result.message}`);
process.exitCode = result.status === 'failed' ? 1 : 0;
