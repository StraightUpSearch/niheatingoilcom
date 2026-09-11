import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from "@shared/schema";

// Create local SQLite database for testing (libsql/WASM — no native build required)
const client = createClient({ url: 'file:heating-oil.db' });
export const db = drizzle({ client, schema });

console.log("Using local SQLite database: heating-oil.db");
