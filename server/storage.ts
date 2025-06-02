import {
  users,
  suppliers,
  oilPrices,
  priceAlerts,
  priceHistory,
  searchQueries,
  leads,
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
  type Lead,
  type InsertLead,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, like, inArray, not } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Supplier operations
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplierById(id: number): Promise<Supplier | undefined>;
  getSupplierByName(name: string): Promise<Supplier | undefined>;
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

  // Lead capture operations
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(status?: string): Promise<Lead[]>;
  updateLeadStatus(id: number, status: string): Promise<Lead>;
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

  async getSupplierByName(name: string): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.name, name));
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
    const allResults = await db
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
      .where(
        and(
          eq(suppliers.isActive, true),
          volume ? eq(oilPrices.volume, volume) : sql`1=1`
        )
      )
      .orderBy(desc(oilPrices.createdAt), oilPrices.price)
      .limit(50);

    // Prioritize individual suppliers over regional averages
    const individualSuppliers = allResults.filter(result => 
      !result.supplier.name.includes('Average Prices') &&
      !result.supplier.name.includes('Regional') &&
      result.supplier.name.length < 50
    );

    // If we have individual suppliers, use them; otherwise fall back to regional data
    const resultsToProcess = individualSuppliers.length > 0 ? individualSuppliers : allResults;

    // Get latest price per supplier for the requested volume (or multiple volumes)
    const latestPrices = new Map();
    resultsToProcess.forEach(result => {
      const key = `${result.supplierId}-${result.volume}`;
      if (!latestPrices.has(key) || latestPrices.get(key).createdAt! < result.createdAt!) {
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
    const results = await db
      .select({
        postcode: searchQueries.postcode,
        count: sql<number>`COUNT(*)`,
      })
      .from(searchQueries)
      .where(sql`${searchQueries.postcode} IS NOT NULL`)
      .groupBy(searchQueries.postcode)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(limit);

    return results.filter(r => r.postcode !== null).map(r => ({
      postcode: r.postcode!,
      count: r.count
    }));
  }

  // Lead capture operations
  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db
      .insert(leads)
      .values(lead)
      .returning();
    return newLead;
  }

  async getLeads(status?: string): Promise<Lead[]> {
    if (status) {
      return await db
        .select()
        .from(leads)
        .where(eq(leads.status, status))
        .orderBy(desc(leads.createdAt));
    }
    return await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt));
  }

  async updateLeadStatus(id: number, status: string): Promise<Lead> {
    const [updatedLead] = await db
      .update(leads)
      .set({ status, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return updatedLead;
  }
}

export const storage = new DatabaseStorage();
