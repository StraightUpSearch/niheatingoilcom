import {
  users,
  suppliers,
  oilPrices,
  priceAlerts,
  priceHistory,
  searchQueries,
  type User,
  type UpsertUser,
  type Supplier,
  type InsertSupplier,
  type OilPrice,
  type InsertOilPrice,
  type PriceAlert,
  type InsertPriceAlert,
  type PriceHistory,
  type InsertPriceHistory,
  type SearchQuery,
  type InsertSearchQuery,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, like, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Supplier operations
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplierById(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier>;
  getSuppliersInArea(postcode: string): Promise<Supplier[]>;

  // Oil price operations
  getLatestPrices(volume?: number, postcode?: string): Promise<(OilPrice & { supplier: Supplier })[]>;
  insertOilPrice(price: InsertOilPrice): Promise<OilPrice>;
  getPricesBySupplier(supplierId: number, volume?: number): Promise<OilPrice[]>;
  getLowestPrices(volume: number, limit?: number): Promise<(OilPrice & { supplier: Supplier })[]>;

  // Price alert operations
  getUserPriceAlerts(userId: string): Promise<PriceAlert[]>;
  createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert>;
  updatePriceAlert(id: number, alert: Partial<InsertPriceAlert>): Promise<PriceAlert>;
  deletePriceAlert(id: number): Promise<void>;
  getActivePriceAlerts(): Promise<PriceAlert[]>;

  // Price history operations
  getPriceHistory(days: number, volume?: number): Promise<PriceHistory[]>;
  insertPriceHistory(history: InsertPriceHistory): Promise<PriceHistory>;
  getAveragePrices(volume: number): Promise<{ weeklyAverage: number; lowestPrice: number; highestPrice: number }>;

  // Search operations
  logSearchQuery(query: InsertSearchQuery): Promise<SearchQuery>;
  getPopularSearches(limit?: number): Promise<{ postcode: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Supplier operations
  async getAllSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).where(eq(suppliers.isActive, true)).orderBy(suppliers.name);
  }

  async getSupplierById(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier;
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [newSupplier] = await db.insert(suppliers).values(supplier).returning();
    return newSupplier;
  }

  async updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier> {
    const [updatedSupplier] = await db
      .update(suppliers)
      .set({ ...supplier, updatedAt: new Date() })
      .where(eq(suppliers.id, id))
      .returning();
    return updatedSupplier;
  }

  async getSuppliersInArea(postcode: string): Promise<Supplier[]> {
    // Simple implementation - in production would use proper postcode validation
    const postcodePrefix = postcode.substring(0, 3).toUpperCase();
    return await db
      .select()
      .from(suppliers)
      .where(
        and(
          eq(suppliers.isActive, true),
          like(suppliers.coverageAreas, `%${postcodePrefix}%`)
        )
      )
      .orderBy(suppliers.name);
  }

  // Oil price operations
  async getLatestPrices(volume?: number, postcode?: string): Promise<(OilPrice & { supplier: Supplier })[]> {
    let query = db
      .select({
        id: oilPrices.id,
        supplierId: oilPrices.supplierId,
        volume: oilPrices.volume,
        price: oilPrices.price,
        pricePerLitre: oilPrices.pricePerLitre,
        includesVat: oilPrices.includesVat,
        postcode: oilPrices.postcode,
        createdAt: oilPrices.createdAt,
        supplier: suppliers,
      })
      .from(oilPrices)
      .innerJoin(suppliers, eq(oilPrices.supplierId, suppliers.id))
      .where(eq(suppliers.isActive, true));

    if (volume) {
      query = query.where(eq(oilPrices.volume, volume));
    }

    const results = await query
      .orderBy(desc(oilPrices.createdAt), oilPrices.price)
      .limit(50);

    // Filter to latest price per supplier for each volume
    const latestPrices = new Map();
    results.forEach(result => {
      const key = `${result.supplierId}-${result.volume}`;
      if (!latestPrices.has(key) || latestPrices.get(key).createdAt < result.createdAt) {
        latestPrices.set(key, result);
      }
    });

    return Array.from(latestPrices.values()).sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  }

  async insertOilPrice(price: InsertOilPrice): Promise<OilPrice> {
    const [newPrice] = await db.insert(oilPrices).values(price).returning();
    return newPrice;
  }

  async getPricesBySupplier(supplierId: number, volume?: number): Promise<OilPrice[]> {
    let query = db.select().from(oilPrices).where(eq(oilPrices.supplierId, supplierId));
    
    if (volume) {
      query = query.where(eq(oilPrices.volume, volume));
    }

    return await query.orderBy(desc(oilPrices.createdAt)).limit(10);
  }

  async getLowestPrices(volume: number, limit = 10): Promise<(OilPrice & { supplier: Supplier })[]> {
    return await db
      .select({
        id: oilPrices.id,
        supplierId: oilPrices.supplierId,
        volume: oilPrices.volume,
        price: oilPrices.price,
        pricePerLitre: oilPrices.pricePerLitre,
        includesVat: oilPrices.includesVat,
        postcode: oilPrices.postcode,
        createdAt: oilPrices.createdAt,
        supplier: suppliers,
      })
      .from(oilPrices)
      .innerJoin(suppliers, eq(oilPrices.supplierId, suppliers.id))
      .where(and(eq(oilPrices.volume, volume), eq(suppliers.isActive, true)))
      .orderBy(oilPrices.price)
      .limit(limit);
  }

  // Price alert operations
  async getUserPriceAlerts(userId: string): Promise<PriceAlert[]> {
    return await db
      .select()
      .from(priceAlerts)
      .where(and(eq(priceAlerts.userId, userId), eq(priceAlerts.isActive, true)))
      .orderBy(desc(priceAlerts.createdAt));
  }

  async createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert> {
    const [newAlert] = await db.insert(priceAlerts).values(alert).returning();
    return newAlert;
  }

  async updatePriceAlert(id: number, alert: Partial<InsertPriceAlert>): Promise<PriceAlert> {
    const [updatedAlert] = await db
      .update(priceAlerts)
      .set(alert)
      .where(eq(priceAlerts.id, id))
      .returning();
    return updatedAlert;
  }

  async deletePriceAlert(id: number): Promise<void> {
    await db.update(priceAlerts).set({ isActive: false }).where(eq(priceAlerts.id, id));
  }

  async getActivePriceAlerts(): Promise<PriceAlert[]> {
    return await db.select().from(priceAlerts).where(eq(priceAlerts.isActive, true));
  }

  // Price history operations
  async getPriceHistory(days: number, volume?: number): Promise<PriceHistory[]> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    let query = db
      .select()
      .from(priceHistory)
      .where(gte(priceHistory.date, dateThreshold));

    if (volume) {
      query = query.where(eq(priceHistory.volume, volume));
    }

    return await query.orderBy(priceHistory.date);
  }

  async insertPriceHistory(history: InsertPriceHistory): Promise<PriceHistory> {
    const [newHistory] = await db.insert(priceHistory).values(history).returning();
    return newHistory;
  }

  async getAveragePrices(volume: number): Promise<{ weeklyAverage: number; lowestPrice: number; highestPrice: number }> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const result = await db
      .select({
        weeklyAverage: sql<number>`AVG(${oilPrices.price})`,
        lowestPrice: sql<number>`MIN(${oilPrices.price})`,
        highestPrice: sql<number>`MAX(${oilPrices.price})`,
      })
      .from(oilPrices)
      .where(and(eq(oilPrices.volume, volume), gte(oilPrices.createdAt, weekAgo)));

    return result[0] || { weeklyAverage: 0, lowestPrice: 0, highestPrice: 0 };
  }

  // Search operations
  async logSearchQuery(query: InsertSearchQuery): Promise<SearchQuery> {
    const [newQuery] = await db.insert(searchQueries).values(query).returning();
    return newQuery;
  }

  async getPopularSearches(limit = 10): Promise<{ postcode: string; count: number }[]> {
    return await db
      .select({
        postcode: searchQueries.postcode,
        count: sql<number>`COUNT(*)`,
      })
      .from(searchQueries)
      .where(sql`${searchQueries.postcode} IS NOT NULL`)
      .groupBy(searchQueries.postcode)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
