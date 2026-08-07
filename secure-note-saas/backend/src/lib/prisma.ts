import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/index.js';

const rawConnectionString = process.env.DATABASE_URL || 'mysql://root@127.0.0.1:3306/secureflow_db';
const normalizedConnectionString = rawConnectionString.replace(/^mysql:/, 'mariadb:');

const parseConnectionString = (uri: string) => {
  try {
    const u = new URL(uri);
    const port = u.port ? parseInt(u.port, 10) : 3306;
    const db = u.pathname.startsWith('/') ? u.pathname.slice(1) : u.pathname;
    const params: Record<string, string> = {};
    u.searchParams.forEach((v, k) => { params[k] = v; });
    return {
      host: u.hostname || '127.0.0.1',
      port,
      user: decodeURIComponent(u.username || ''),
      password: decodeURIComponent(u.password || ''),
      database: db || undefined,
      ssl: params.ssl ? (params.ssl === 'true' ? true : params.ssl) : undefined,
    };
  } catch {
    return {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'secureflow_db',
      ssl: undefined as any,
    };
  }
};

const parsed = parseConnectionString(normalizedConnectionString);

const sanitizeUrlForLog = (url: string): string => {
  try {
    const u = new URL(url);
    if (u.password) u.password = '***';
    return u.toString();
  } catch {
    return url.replace(/(:)([^:@]*)(@)/, '$1***$3');
  }
};

console.log(`🔌 Database: ${sanitizeUrlForLog(normalizedConnectionString)}`);
console.log(`   Pool config: connectionLimit=${Number(process.env.DB_POOL_LIMIT) || 20}, connectTimeout=8s, acquireTimeout=15s`);

const adapterOptions: any = {
  url: normalizedConnectionString,
  host: parsed.host,
  port: parsed.port,
  user: parsed.user,
  password: parsed.password,
  database: parsed.database,
  acquireTimeout: 15000,
  connectTimeout: 8000,
  socketTimeout: 30000,
  idleTimeout: 300,
  connectionLimit: Number(process.env.DB_POOL_LIMIT) || 20,
  minimumIdle: Number(process.env.DB_POOL_MIN_IDLE) || 2,
  resetAfterUse: true,
  trace: process.env.NODE_ENV === 'development',
  ...(parsed.ssl ? { ssl: parsed.ssl } : {}),
  ...(process.env.DB_SSL_CA ? { ssl: { ca: process.env.DB_SSL_CA } } : {}),
};

const adapter = new PrismaMariaDb(adapterOptions);

const logLevels: Array<'query' | 'info' | 'warn' | 'error'> =
  process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'];

const prisma = new PrismaClient({
  adapter,
  log: logLevels,
});

setTimeout(async () => {
  try {
    const start = Date.now();
    const result = await prisma.$queryRawUnsafe<Array<{ ping: number }>>('SELECT 1 AS ping');
    const duration = Date.now() - start;
    const row = result?.[0];
    console.log(`✅ Database connection verified (ping=${row?.ping ?? 'N/A'}) — took ${duration}ms`);
  } catch (err: any) {
    console.error('❌ Database connection FAILED on startup verification');
    console.error('   Error:', err.message);
    console.error('   Troubleshooting checklist:');
    console.error('   1. Is MySQL/MariaDB server running on localhost:3306?');
    console.error('   2. Does the user exist with correct password?');
    console.error('   3. Does the database `secureflow_db` exist? (CREATE DATABASE secureflow_db;)');
    console.error('   4. Is your DATABASE_URL set correctly in .env?');
    console.error('   5. Check Windows Firewall / port 3306 is accessible');
    console.error('   6. For MySQL 8.0+: ensure auth plugin is mysql_native_password for the user');
    process.exitCode = 0;
  }
}, 200);

export default prisma;

