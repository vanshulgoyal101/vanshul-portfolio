// @vitest-environment node
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';

const blogSchema = readFileSync('scripts/schema.sql', 'utf8');
const analyticsSchema = readFileSync('supabase/web-analytics.sql', 'utf8');
let database;

beforeAll(async () => {
  database = new PGlite();
  await database.exec(`
    create role anon;
    create role authenticated;
    create schema auth;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public, auth to anon, authenticated;
    create table public.arcade_events (kind text, ts timestamptz default now(), game text);
  `);
  await database.exec(blogSchema);
  await database.exec(analyticsSchema);
}, 30000);

afterAll(async () => { await database?.close(); });

const asRole = async (role, sql, uid = '') => {
  try {
    await database.exec(`set role ${role}`);
    await database.query("select set_config('request.jwt.claim.sub', $1, false)", [uid]);
    return await database.query(sql);
  } finally {
    await database.exec('reset role');
  }
};

describe('database authorization and schema behavior', () => {
  it('allows anonymous bounded event inserts but not raw reads', async () => {
    await asRole('anon', "insert into web_events(site,kind,path) values ('portfolio','pageview','/')");
    await expect(asRole('anon', 'select * from web_events')).rejects.toThrow(/permission denied/);
    await expect(asRole('authenticated', 'select * from web_events')).rejects.toThrow(/permission denied/);
  });
  it('rejects unknown event kinds and oversized rows', async () => {
    await expect(asRole('anon', "insert into web_events(site,kind) values ('portfolio','unknown')")).rejects.toThrow(/row-level security/);
    await expect(asRole('anon', "insert into web_events(site,kind,name) values ('portfolio','tool',repeat('x',201))")).rejects.toThrow(/web_events_bounds/);
  });
  it('prevents caller-supplied timestamps, identities, and row mutations', async () => {
    await expect(asRole('anon', "insert into web_events(site,kind,ts) values ('portfolio','pageview',now()+interval '1 year')")).rejects.toThrow(/permission denied/);
    await expect(asRole('authenticated', "insert into web_events(site,kind,user_id) values ('portfolio','pageview','a0c64b9b-7d84-45d4-8ef7-522a6b294b42')")).rejects.toThrow(/permission denied/);
    await expect(asRole('anon', 'delete from web_events')).rejects.toThrow(/permission denied/);
  });
  it('denies stats to anonymous and non-owner identities including NULL', async () => {
    await expect(asRole('anon', 'select web_stats(24)')).rejects.toThrow(/permission denied/);
    await expect(asRole('authenticated', 'select web_stats(24)')).rejects.toThrow(/not authorized/);
    await expect(asRole('authenticated', 'select web_stats(24)', '00000000-0000-0000-0000-000000000001')).rejects.toThrow(/not authorized/);
  });
  it('returns owner aggregates and clamps the reporting window', async () => {
    const result = await asRole('authenticated', 'select web_stats(999999) as stats', 'a0c64b9b-7d84-45d4-8ef7-522a6b294b42');
    expect(result.rows[0].stats.window_hours).toBe(8760);
    expect(result.rows[0].stats.total_pageviews).toBeGreaterThan(0);
    expect(result.rows[0].stats.arcade.total_plays).toBe(0);
  });
  it('increments public blog counts only through the bounded RPC', async () => {
    const first = await asRole('anon', "select increment_blog_view('test-post') as views");
    const second = await asRole('authenticated', "select increment_blog_view('test-post') as views");
    expect(first.rows[0].views).toBe(1);
    expect(second.rows[0].views).toBe(2);
    expect((await asRole('anon', "select views from blog_views where slug='test-post'")).rows[0].views).toBe(2);
    await expect(asRole('anon', "insert into blog_views values ('forged',999)")).rejects.toThrow(/permission denied/);
    await expect(asRole('anon', "select increment_blog_view('../bad')")).rejects.toThrow(/invalid post slug/);
    await expect(asRole('anon', "select increment_blog_view(repeat('a',121))")).rejects.toThrow(/invalid post slug/);
  });
  it('reapplies both schemas without deleting existing rows', async () => {
    await database.exec("insert into web_events(site,kind) values ('__diag__','action')");
    const before = (await database.query('select count(*) from web_events')).rows[0].count;
    await database.exec(blogSchema);
    await database.exec(analyticsSchema);
    expect((await database.query('select count(*) from web_events')).rows[0].count).toBe(before);
  });
});