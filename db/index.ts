import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

declare global {
    // eslint-disable-next-line no-var
    var _reloopSql: ReturnType<typeof postgres> | undefined;
}

// Cached across hot-reloads in dev so we don't spawn a new connection
// pool on every file save.
const client = global._reloopSql ?? postgres(process.env.DATABASE_URL as string, { max: 10 });

if (process.env.NODE_ENV !== 'production') {
    global._reloopSql = client;
}

export const db = drizzle(client, { schema });
