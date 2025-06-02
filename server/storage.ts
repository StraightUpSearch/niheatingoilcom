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
import { eq, desc, and, or, gte, lte, sql, like, inArray, not } from "drizzle-orm";

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
    // Extract Northern Ireland postcode area (BT + 1-2 digits)
    const normalizedPostcode = postcode.replace(/\s+/g, '').toUpperCase();
    const btAreaMatch = normalizedPostcode.match(/^BT(\d{1,2})/);
    
    if (!btAreaMatch) {
      // If not a valid BT postcode, return all suppliers
      return await db
        .select()
        .from(suppliers)
        .where(eq(suppliers.isActive, true))
        .orderBy(suppliers.name);
    }
    
    const btNumber = parseInt(btAreaMatch[1]);
    const btArea = `BT${btNumber}`;
    
    // Get all suppliers and filter based on coverage logic
    const allSuppliers = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.isActive, true))
      .orderBy(suppliers.name);
    
    // Filter suppliers based on coverage areas
    return allSuppliers.filter(supplier => {
      const coverage = supplier.coverageAreas;
      
      if (!coverage || coverage.trim() === '') {
        return true; // Include suppliers with no specific coverage restriction
      }
      
      // Handle JSON array format: ["BT19","BT20","BT1"]
      if (coverage.startsWith('[') && coverage.endsWith(']')) {
        try {
          const areas = JSON.parse(coverage);
          return areas.some((area: string) => {
            const areaNum = parseInt(area.replace('BT', ''));
            return areaNum === btNumber;
          });
        } catch (e) {
          return false;
        }
      }
      
      // Handle range format: "BT53 to BT57" or "BT51 to BT57"
      const rangeMatch = coverage.match(/BT(\d{1,2})\s+to\s+BT(\d{1,2})/i);
      if (rangeMatch) {
        const startNum = parseInt(rangeMatch[1]);
        const endNum = parseInt(rangeMatch[2]);
        return btNumber >= startNum && btNumber <= endNum;
      }
      
      // Handle comma-separated format: "BT32, BT60 to BT63"
      if (coverage.includes(',')) {
        const parts = coverage.split(',');
        for (const part of parts) {
          const trimmedPart = part.trim();
          // Check individual areas
          if (trimmedPart === btArea) return true;
          // Check ranges within comma-separated list
          const subRangeMatch = trimmedPart.match(/BT(\d{1,2})\s+to\s+BT(\d{1,2})/i);
          if (subRangeMatch) {
            const startNum = parseInt(subRangeMatch[1]);
            const endNum = parseInt(subRangeMatch[2]);
            if (btNumber >= startNum && btNumber <= endNum) return true;
          }
        }
      }
      
      // Simple contains check as fallback
      return coverage.includes(btArea) || coverage.includes('ALL') || coverage.includes('Northern Ireland');
    });
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

    // Separate individual suppliers from regional averages
    const individualSuppliers = allResults.filter(result => {
      const supplierName = result.supplier.name.toLowerCase();
      return !supplierName.includes('average prices') &&
             !supplierName.includes('regional') &&
             !supplierName.includes('council') &&
             !supplierName.includes('&') && // Regional names often contain '&' like "Mid & East Antrim"
             supplierName.length < 50; // Regional names are usually longer
    });

    const regionalAverages = allResults.filter(result => {
      const supplierName = result.supplier.name.toLowerCase();
      return supplierName.includes('average prices') ||
             supplierName.includes('regional') ||
             supplierName.includes('council') ||
             (supplierName.includes('&') && supplierName.length > 30);
    });

    // If postcode is provided, filter suppliers by coverage area
    let relevantIndividualSuppliers = individualSuppliers;
    let relevantRegionalAverages = regionalAverages;
    
    if (postcode) {
      // Get suppliers that cover this postcode area
      const suppliersInArea = await this.getSuppliersInArea(postcode);
      const supplierIdsInArea = new Set(suppliersInArea.map(s => s.id));
      
      relevantIndividualSuppliers = individualSuppliers.filter(result => 
        supplierIdsInArea.has(result.supplierId)
      );
      
      // For regional averages, check if postcode falls in the region
      const normalizedPostcode = postcode.replace(/\s+/g, '').toUpperCase();
      const btAreaMatch = normalizedPostcode.match(/^BT(\d{1,2})/);
      
      if (btAreaMatch) {
        const btNumber = parseInt(btAreaMatch[1]);
        relevantRegionalAverages = regionalAverages.filter(result => {
          const supplierName = result.supplier.name.toLowerCase();
          // Map BT areas to regions based on Northern Ireland council areas
          if (btNumber >= 51 && btNumber <= 57) return supplierName.includes('causeway coast');
          if (btNumber >= 1 && btNumber <= 10) return supplierName.includes('belfast');
          if (btNumber >= 11 && btNumber <= 18) return supplierName.includes('lisburn') || supplierName.includes('castlereagh');
          if (btNumber >= 19 && btNumber <= 23) return supplierName.includes('ards') || supplierName.includes('north down');
          if (btNumber >= 24 && btNumber <= 35) return supplierName.includes('newry') || supplierName.includes('mourne') || supplierName.includes('down');
          if (btNumber >= 36 && btNumber <= 45) return supplierName.includes('antrim') || supplierName.includes('newtownabbey');
          if (btNumber >= 46 && btNumber <= 49) return supplierName.includes('mid') && supplierName.includes('east antrim');
          if (btNumber >= 60 && btNumber <= 71) return supplierName.includes('armagh') || supplierName.includes('banbridge') || supplierName.includes('craigavon');
          if (btNumber >= 74 && btNumber <= 82) return supplierName.includes('mid ulster');
          if (btNumber >= 92 && btNumber <= 94) return supplierName.includes('fermanagh') || supplierName.includes('omagh');
          return false;
        });
      }
    }

    // Prioritize individual suppliers, but include regional averages if no individual suppliers found
    const resultsToProcess = relevantIndividualSuppliers.length > 0 
      ? relevantIndividualSuppliers 
      : relevantRegionalAverages;

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
    return await db
      .select()
      .from(oilPrices)
      .where(
        and(
          eq(oilPrices.supplierId, supplierId),
          volume ? eq(oilPrices.volume, volume) : sql`1=1`
        )
      )
      .orderBy(desc(oilPrices.createdAt))
      .limit(10);
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
