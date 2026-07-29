#!/usr/bin/env node
/**
 * Tiny Postgres runner for the project's Supabase database.
 *
 * Reads credentials from the gitignored .env (never printed, never committed).
 * Provide EITHER:
 *   SUPABASE_DB_URL="postgresql://postgres:PASSWORD@host:5432/postgres"
 * OR the standard libpq vars (better if the password has special characters):
 *   PGHOST=... PGPORT=5432 PGUSER=postgres PGPASSWORD=... PGDATABASE=postgres
 *
 * Usage:
 *   node --env-file=.env scripts/db.mjs path/to/file.sql
 *   node --env-file=.env scripts/db.mjs -e "select * from blog_views;"
 *   echo "select 1;" | node --env-file=.env scripts/db.mjs
 */
import { readFileSync } from 'node:fs';
import pg from 'pg';

const connectionString = process.env.SUPABASE_DB_URL;
const hasPgEnv = Boolean(process.env.PGPASSWORD && process.env.PGHOST);
if (!connectionString && !hasPgEnv) {
  console.error(
    'No database credentials found.\n' +
      'Add SUPABASE_DB_URL (or PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE) to .env, then run:\n' +
      '  node --env-file=.env scripts/db.mjs <file.sql | -e "SQL">'
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const eIndex = args.indexOf('-e');
let sql;
if (eIndex !== -1) {
  sql = args[eIndex + 1];
} else if (args[0]) {
  sql = readFileSync(args[0], 'utf8');
} else {
  sql = readFileSync(0, 'utf8'); // stdin
}

if (!sql || !sql.trim()) {
  console.error('No SQL provided.');
  process.exit(1);
}

const client = new pg.Client({
  ...(connectionString ? { connectionString } : {}), // else pg reads PG* env vars
  ssl: { rejectUnauthorized: false }, // Supabase requires SSL
});

try {
  await client.connect();
  const result = await client.query(sql);
  const results = Array.isArray(result) ? result : [result];
  for (const r of results) {
    if (r?.command) {
      console.error(`✓ ${r.command}${r.rowCount != null ? ` (${r.rowCount})` : ''}`);
    }
    if (r?.rows?.length) {
      console.log(JSON.stringify(r.rows, null, 2));
    }
  }
} catch (err) {
  console.error('DB error:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
