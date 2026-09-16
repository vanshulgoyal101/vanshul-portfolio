import { readFileSync } from 'node:fs';

export const databaseConfig = (env = process.env, readFile = readFileSync) => {
  if (env.PGSSLMODE && env.PGSSLMODE !== 'verify-full') {
    throw new Error('PGSSLMODE must be verify-full. Use PGSSLROOTCERT for a trusted CA file.');
  }
  const config = { ssl: { rejectUnauthorized: true }, connectionTimeoutMillis: 10000 };
  let rootCertificate = env.PGSSLROOTCERT;
  if (env.SUPABASE_DB_URL) {
    let url;
    try { url = new URL(env.SUPABASE_DB_URL); }
    catch { throw new Error('SUPABASE_DB_URL must be a valid PostgreSQL URL.'); }
    if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
      throw new Error('SUPABASE_DB_URL must use the postgres or postgresql scheme.');
    }
    for (const mode of url.searchParams.getAll('sslmode')) {
      if (mode !== 'verify-full') throw new Error('Database URL sslmode must be verify-full.');
    }
    if (['ssl', 'sslcert', 'sslkey'].some(key => url.searchParams.has(key))) {
      throw new Error('Unsupported database URL SSL override. Use PGSSLROOTCERT for a trusted CA file.');
    }
    rootCertificate = url.searchParams.get('sslrootcert') || rootCertificate;
    url.searchParams.delete('sslmode');
    url.searchParams.delete('sslrootcert');
    config.connectionString = url.toString();
  }
  if (rootCertificate) config.ssl.ca = readFile(rootCertificate, 'utf8');
  return config;
};