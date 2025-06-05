import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function runMigrations() {
  try {
    console.log("Running database migrations...");

    // Create price_locks table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS price_locks (
        id SERIAL PRIMARY KEY,
        supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
        price VARCHAR(20) NOT NULL,
        volume INTEGER NOT NULL,
        postcode VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create enquiries table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS enquiries (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id),
        postcode VARCHAR(20) NOT NULL,
        volume INTEGER NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        referrer_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_price_locks_supplier_postcode 
      ON price_locks(supplier_id, postcode, volume)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_price_locks_expires_at 
      ON price_locks(expires_at)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_enquiries_created_at 
      ON enquiries(created_at)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_enquiries_postcode 
      ON enquiries(postcode)
    `);

    console.log("Database migrations completed successfully!");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
}

// Run migrations on startup
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}