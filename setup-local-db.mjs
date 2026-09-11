// One-shot script to create local SQLite tables via libsql
import { createClient } from '@libsql/client';

const client = createClient({ url: 'file:heating-oil.db' });

const statements = [
  `CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess TEXT NOT NULL,
    expire TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire)`,
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    phone TEXT,
    website TEXT,
    coverage_areas TEXT,
    rating TEXT,
    review_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    last_scraped TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS oil_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    volume INTEGER NOT NULL,
    price TEXT NOT NULL,
    price_per_litre TEXT NOT NULL,
    includes_vat INTEGER DEFAULT 1,
    postcode TEXT,
    is_default INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS price_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id),
    email TEXT NOT NULL,
    postcode TEXT NOT NULL,
    volume INTEGER NOT NULL,
    threshold_type TEXT NOT NULL,
    email_alerts INTEGER DEFAULT 1,
    sms_alerts INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    volume INTEGER NOT NULL,
    average_price TEXT NOT NULL,
    lowest_price TEXT NOT NULL,
    highest_price TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS search_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postcode TEXT,
    volume INTEGER,
    results_count INTEGER,
    user_id TEXT REFERENCES users(id),
    ip_address TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    postcode TEXT NOT NULL,
    volume INTEGER NOT NULL,
    urgency TEXT,
    notes TEXT,
    supplier_name TEXT,
    supplier_price TEXT,
    status TEXT DEFAULT 'new',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS supplier_claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    business_address TEXT NOT NULL,
    coverage_areas TEXT NOT NULL,
    current_pricing TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    postcode TEXT NOT NULL,
    litres INTEGER NOT NULL,
    registered INTEGER DEFAULT 0,
    status TEXT DEFAULT 'New',
    supplier_name TEXT,
    quoted_price TEXT,
    total_cost TEXT,
    savings TEXT,
    user_id TEXT REFERENCES users(id),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS saved_quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT REFERENCES users(id),
    supplier_name TEXT NOT NULL,
    price TEXT NOT NULL,
    volume INTEGER NOT NULL,
    location TEXT NOT NULL,
    postcode TEXT NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
];

for (const sql of statements) {
  await client.execute(sql);
}

console.log('Local SQLite tables created successfully.');
await client.close();
