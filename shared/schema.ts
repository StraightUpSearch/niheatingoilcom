import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for traditional authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique(),
  password: varchar("password").notNull(),
  fullName: varchar("full_name"),
  phone: varchar("phone", { length: 50 }),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const passwordResetTokensTable = pgTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Oil suppliers table
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 255 }),
  coverageAreas: text("coverage_areas"), // JSON array of areas they serve
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true),
  lastScraped: timestamp("last_scraped"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Oil prices table
export const oilPrices = pgTable("oil_prices", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  volume: integer("volume").notNull(), // 300, 500, 900 litres
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  pricePerLitre: decimal("price_per_litre", { precision: 8, scale: 3 }).notNull(),
  includesVat: boolean("includes_vat").default(true),
  postcode: varchar("postcode", { length: 255 }), // specific postcode or location name if applicable
  isDefault: boolean("is_default").default(false), // true if this is fallback test data
  createdAt: timestamp("created_at").defaultNow(),
});

// Price alerts table
export const priceAlerts = pgTable("price_alerts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  email: varchar("email").notNull(),
  postcode: varchar("postcode", { length: 20 }).notNull(),
  volume: integer("volume").notNull(),
  thresholdType: varchar("threshold_type", { length: 50 }).notNull(), // 'any', '2percent', '5percent'
  emailAlerts: boolean("email_alerts").default(true),
  smsAlerts: boolean("sms_alerts").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Price history for trends
export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  volume: integer("volume").notNull(),
  averagePrice: decimal("average_price", { precision: 10, scale: 2 }).notNull(),
  lowestPrice: decimal("lowest_price", { precision: 10, scale: 2 }).notNull(),
  highestPrice: decimal("highest_price", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Search queries for analytics
export const searchQueries = pgTable("search_queries", {
  id: serial("id").primaryKey(),
  postcode: varchar("postcode", { length: 20 }),
  volume: integer("volume"),
  resultsCount: integer("results_count"),
  userId: varchar("user_id").references(() => users.id),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Lead capture for quote requests
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  postcode: varchar("postcode", { length: 20 }).notNull(),
  volume: integer("volume").notNull(),
  urgency: varchar("urgency", { length: 20 }),
  notes: text("notes"),
  supplierName: varchar("supplier_name", { length: 100 }),
  supplierPrice: varchar("supplier_price", { length: 20 }),
  status: varchar("status", { length: 20 }).default("new"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supplierClaims = pgTable("supplier_claims", {
  id: serial("id").primaryKey(),
  supplierName: varchar("supplier_name", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  businessAddress: text("business_address").notNull(),
  coverageAreas: text("coverage_areas").notNull(),
  currentPricing: text("current_pricing"),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = typeof suppliers.$inferInsert;

export type OilPrice = typeof oilPrices.$inferSelect;
export type InsertOilPrice = typeof oilPrices.$inferInsert;

export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = typeof priceAlerts.$inferInsert;

export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = typeof priceHistory.$inferInsert;

export type SearchQuery = typeof searchQueries.$inferSelect;
export type InsertSearchQuery = typeof searchQueries.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

export type SupplierClaim = typeof supplierClaims.$inferSelect;
export type InsertSupplierClaim = typeof supplierClaims.$inferInsert;

// Zod schemas for validation
export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOilPriceSchema = createInsertSchema(oilPrices).omit({
  id: true,
  createdAt: true,
});

export const insertPriceAlertSchema = createInsertSchema(priceAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertSearchQuerySchema = createInsertSchema(searchQueries).omit({
  id: true,
  createdAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupplierClaimSchema = createInsertSchema(supplierClaims).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Tickets table for lead capture system
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  ticketId: varchar("ticket_id", { length: 20 }).unique().notNull(), // e.g., NIHO-0001
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  postcode: varchar("postcode", { length: 20 }).notNull(),
  litres: integer("litres").notNull(),
  registered: boolean("registered").default(false),
  status: varchar("status", { length: 20 }).default("New"), // New, In Progress, Quoted, Closed, Escalated
  supplierName: varchar("supplier_name", { length: 255 }),
  quotedPrice: decimal("quoted_price", { precision: 10, scale: 4 }),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  savings: decimal("savings", { precision: 10, scale: 2 }),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Saved quotes table for user quote history
export const savedQuotes = pgTable("saved_quotes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  supplierName: varchar("supplier_name", { length: 255 }).notNull(),
  price: varchar("price", { length: 20 }).notNull(),
  volume: integer("volume").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  postcode: varchar("postcode", { length: 20 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }),
  customerEmail: varchar("customer_email", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SavedQuote = typeof savedQuotes.$inferSelect;
export type InsertSavedQuote = typeof savedQuotes.$inferInsert;

export const insertSavedQuoteSchema = createInsertSchema(savedQuotes).omit({
  id: true,
  createdAt: true,
});