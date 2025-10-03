import Database from 'better-sqlite3';
import fs from 'fs';

// Create SQLite database and tables
const db = new Database('heating-oil.db');

console.log('Creating tables for NI Heating Oil platform...');

// Create suppliers table
db.exec(`
  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    location TEXT,
    website TEXT,
    phone TEXT,
    coverage_areas TEXT,
    rating TEXT DEFAULT '4.5',
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    last_scraped DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create oil_prices table
db.exec(`
  CREATE TABLE IF NOT EXISTS oil_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL,
    volume INTEGER NOT NULL,
    price TEXT NOT NULL,
    price_per_litre TEXT,
    includes_vat BOOLEAN DEFAULT 1,
    postcode TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
  );
`);

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create leads table
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create price_alerts table
db.exec(`
  CREATE TABLE IF NOT EXISTS price_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    postcode TEXT NOT NULL,
    volume INTEGER NOT NULL,
    threshold_type TEXT NOT NULL DEFAULT 'any',
    email_alerts BOOLEAN DEFAULT 1,
    sms_alerts BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Create other necessary tables
db.exec(`
  CREATE TABLE IF NOT EXISTS saved_quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    supplier_name TEXT NOT NULL,
    price TEXT NOT NULL,
    volume INTEGER NOT NULL,
    postcode TEXT NOT NULL,
    location TEXT NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS search_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postcode TEXT,
    volume INTEGER,
    results_count INTEGER DEFAULT 0,
    user_id TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

console.log('✅ Database tables created successfully!');
console.log('📊 NI Heating Oil platform database is ready');

db.close(); 