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
    lastScraped DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create oil_prices table
db.exec(`
  CREATE TABLE IF NOT EXISTS oil_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplierId INTEGER NOT NULL,
    volume INTEGER NOT NULL,
    price TEXT NOT NULL,
    pricePerLitre TEXT,
    includesVat BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplierId) REFERENCES suppliers(id)
  );
`);

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    fullName TEXT,
    phone TEXT,
    firstName TEXT,
    lastName TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
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
    supplierName TEXT,
    supplierPrice TEXT,
    status TEXT DEFAULT 'new',
    submissionTime INTEGER,
    ticketId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create price_alerts table
db.exec(`
  CREATE TABLE IF NOT EXISTS price_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    postcode TEXT NOT NULL,
    volume INTEGER NOT NULL,
    targetPrice TEXT NOT NULL,
    isActive BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

// Create other necessary tables
db.exec(`
  CREATE TABLE IF NOT EXISTS saved_quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    supplierName TEXT NOT NULL,
    price TEXT NOT NULL,
    volume INTEGER NOT NULL,
    postcode TEXT NOT NULL,
    location TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS search_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postcode TEXT NOT NULL,
    volume INTEGER,
    results INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ Database tables created successfully!');
console.log('📊 NI Heating Oil platform database is ready');

db.close(); 