import * as schema from "@shared/schema";

let db: any;
let pool: any;

if (process.env.DATABASE_URL) {
  // Production: PostgreSQL
  const pg = (await import("pg")).default;
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL !== 'false' ? { rejectUnauthorized: false } : false
  });
  const { drizzle } = await import("drizzle-orm/node-postgres");
  db = drizzle({ client: pool, schema });
  console.log("Database: PostgreSQL");
} else {
  // Local development: SQLite via libsql
  const libsqlMod = await import("@libsql/client");
  const client = libsqlMod.createClient({ url: 'file:heating-oil.db' });
  const drizzleMod = await import("drizzle-orm/libsql");
  db = drizzleMod.drizzle({ client, schema });
  console.log("Database: SQLite (heating-oil.db)");
}

export { db, pool };