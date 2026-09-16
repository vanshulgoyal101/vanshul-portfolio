import { describe, expect, it, vi } from 'vitest';
import { databaseConfig } from './databaseConfig.mjs';

describe('database TLS configuration', () => {
  it('verifies server certificates for PG environment connections', () => {
    expect(databaseConfig({})).toEqual({ ssl: { rejectUnauthorized: true }, connectionTimeoutMillis: 10000 });
  });
  it('preserves URL credentials while removing options that override explicit TLS', () => {
    const config = databaseConfig({ SUPABASE_DB_URL: 'postgresql://user:p%40ss@example.test/db?sslmode=verify-full' });
    expect(config.connectionString).toBe('postgresql://user:p%40ss@example.test/db');
    expect(config.ssl.rejectUnauthorized).toBe(true);
  });
  it.each(['disable', 'allow', 'prefer', 'require', 'no-verify', 'verify-ca'])('rejects weaker SSL mode %s', mode => {
    expect(() => databaseConfig({ PGSSLMODE: mode })).toThrow('verify-full');
    expect(() => databaseConfig({ SUPABASE_DB_URL: `postgres://example.test/db?sslmode=${mode}` })).toThrow('verify-full');
  });
  it.each(['ssl=false', 'sslcert=cert', 'sslkey=key', 'sslmode=verify-full&sslmode=disable'])('rejects URL override %s', query => {
    expect(() => databaseConfig({ SUPABASE_DB_URL: `postgres://example.test/db?${query}` })).toThrow();
  });
  it('loads the trusted CA without disabling certificate verification', () => {
    const readFile = vi.fn(() => 'certificate');
    expect(databaseConfig({ PGSSLROOTCERT: '/trusted/ca.pem' }, readFile).ssl).toEqual({ rejectUnauthorized: true, ca: 'certificate' });
    expect(readFile).toHaveBeenCalledWith('/trusted/ca.pem', 'utf8');
  });
  it('handles URL CA configuration without allowing pg to replace TLS settings', () => {
    const config = databaseConfig({ SUPABASE_DB_URL: 'postgres://example.test/db?sslrootcert=/ca.pem' }, () => 'certificate');
    expect(config.connectionString).toBe('postgres://example.test/db');
    expect(config.ssl).toEqual({ rejectUnauthorized: true, ca: 'certificate' });
  });
  it('does not echo credentials from malformed URLs', () => {
    expect(() => databaseConfig({ SUPABASE_DB_URL: 'secret-value' })).toThrow('must be a valid PostgreSQL URL');
    expect(() => databaseConfig({ SUPABASE_DB_URL: 'https://user:secret@example.test' })).toThrow('must use the postgres');
  });
});