import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

// Create local SQLite database for testing
const sqlite = new Database('heating-oil.db');
export const db = drizzle({ client: sqlite, schema });

console.log("Using local SQLite database: heating-oil.db"); 