import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For development without a real database
const isDevelopment = process.env.NODE_ENV !== 'production';
const isValidDatabaseUrl = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('dummy');

if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️  DATABASE_URL not set - running without database functionality",
  );
}

// Create a mock database for development without real DB
let pool: Pool | null = null;
let db: any = null;

if (isValidDatabaseUrl) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else {
  console.warn("⚠️  Running with mock database - data will not persist");
  // Create a more complete mock db object that mimics Drizzle ORM
  const createChainableMock = (finalResult: any = []) => {
    const chainable: any = {
      select: (...args: any[]) => createChainableMock(finalResult),
      from: (...args: any[]) => createChainableMock(finalResult),
      where: (...args: any[]) => createChainableMock(finalResult),
      orderBy: (...args: any[]) => createChainableMock(finalResult),
      limit: (...args: any[]) => createChainableMock(finalResult),
      groupBy: (...args: any[]) => createChainableMock(finalResult),
      innerJoin: (...args: any[]) => createChainableMock(finalResult),
      leftJoin: (...args: any[]) => createChainableMock(finalResult),
      values: (...args: any[]) => createChainableMock(finalResult),
      set: (...args: any[]) => createChainableMock(finalResult),
      returning: (...args: any[]) => Promise.resolve(finalResult),
      then: (resolve: any) => Promise.resolve(finalResult).then(resolve)
    };
    return chainable;
  };

  db = {
    select: (...args: any[]) => createChainableMock([]),
    insert: (table: any) => createChainableMock([{ id: 1 }]),
    update: (table: any) => createChainableMock([]),
    delete: (table: any) => createChainableMock([])
  };
}

export { pool, db };