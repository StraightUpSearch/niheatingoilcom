import {
  users,
  suppliers,
  oilPrices,
  priceAlerts,
  priceHistory,
  searchQueries,
  leads,
  supplierClaims,
  savedQuotes,
  passwordResetTokensTable,
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
  type SupplierClaim,
  type InsertSupplierClaim,
  type SavedQuote,
  type InsertSavedQuote,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, gte, lte, lt, sql, like, inArray, not } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: {
    id: string;
    username: string;
    email?: string | null;
    password: string;
    fullName?: string | null;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  }): Promise<User>;

  // Saved quotes operations
  createSavedQuote(quote: InsertSavedQuote): Promise<SavedQuote>;
  getUserSavedQuotes(userId: string): Promise<SavedQuote[]>;

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

  // Supplier claim operations
  createSupplierClaim(claim: InsertSupplierClaim): Promise<SupplierClaim>;
  getSupplierClaims(status?: string): Promise<SupplierClaim[]>;
  updateSupplierClaimStatus(id: number, status: string): Promise<SupplierClaim>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: {
    id: string;
    username: string;
    email?: string | null;
    password: string;
    fullName?: string | null;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
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

  async updateUserPassword(userId: string, hashedPassword: string) {
    const result = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async createPasswordResetToken(userId: string, token: string, expiresAt: Date) {
    await db
      .delete(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.userId, userId));

    const [result] = await db
      .insert(passwordResetTokensTable)
      .values({
        id: `reset_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        userId,
        token,
        expiresAt,
        createdAt: new Date(),
      })
      .returning();

    return result;
  }

  async getPasswordResetToken(token: string) {
    const [result] = await db
      .select()
      .from(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.token, token))
      .limit(1);
    return result || null;
  }

  async deletePasswordResetToken(token: string) {
    await db
      .delete(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.token, token));
  }

  async cleanupExpiredResetTokens() {
    await db
      .delete(passwordResetTokensTable)
      .where(lt(passwordResetTokensTable.expiresAt, new Date()));
  }

  // Saved quotes operations
  async createSavedQuote(quoteData: InsertSavedQuote): Promise<SavedQuote> {
    const [quote] = await db
      .insert(savedQuotes)
      .values(quoteData)
      .returning();
    return quote;
  }

  async getUserSavedQuotes(userId: string): Promise<SavedQuote[]> {
    return await db
      .select()
      .from(savedQuotes)
      .where(eq(savedQuotes.userId, userId))
      .orderBy(desc(savedQuotes.createdAt));
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
    const filteredSuppliers = allSuppliers.filter(supplier => {
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

    console.log(`Postcode ${postcode} (BT${btNumber}) - Found ${filteredSuppliers.length} suppliers out of ${allSuppliers.length} total`);
    return filteredSuppliers;
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
          // Map BT postcodes to counties using Wikipedia research (because we do our homework!)
          // Source: https://en.wikipedia.org/wiki/BT_postcode_area - BT53 8PX = County Antrim (Ballymoney)
          if (btNumber >= 1 && btNumber <= 17 || btNumber === 29) return supplierName.includes('belfast'); // Belfast, County Antrim
          if (btNumber >= 18 && btNumber <= 23) return supplierName.includes('ards') || supplierName.includes('north down'); // County Down
          if (btNumber >= 24 && btNumber <= 35) return supplierName.includes('newry') || supplierName.includes('mourne') || supplierName.includes('down'); // County Down
          if (btNumber >= 36 && btNumber <= 49 || btNumber === 58) return supplierName.includes('antrim') || supplierName.includes('newtownabbey'); // County Antrim
          if (btNumber >= 51 && btNumber <= 57) return supplierName.includes('causeway coast'); // County Antrim (includes BT53)
          if (btNumber >= 60 && btNumber <= 71) return supplierName.includes('armagh') || supplierName.includes('banbridge') || supplierName.includes('craigavon'); // County Armagh
          if (btNumber >= 74 && btNumber <= 82) return supplierName.includes('mid ulster') || supplierName.includes('tyrone'); // Counties Tyrone/Londonderry
          if (btNumber >= 92 && btNumber <= 94) return supplierName.includes('fermanagh') || supplierName.includes('omagh'); // County Fermanagh
          return false;
        });
      }
    }

    // Always prioritize individual suppliers - NEVER show multiple regional averages
    const hasIndividualSuppliers = individualSuppliers.length > 0;

    let resultsToReturn;
    if (hasIndividualSuppliers) {
      // Show all individual suppliers
      resultsToReturn = individualSuppliers;
    } else {
      // If no individual suppliers, show only ONE regional average (not multiple duplicates)
      const uniqueRegionalAverages = new Map();
      relevantRegionalAverages.forEach(result => {
        const supplierKey = result.supplierId;
        if (!uniqueRegionalAverages.has(supplierKey)) {
          uniqueRegionalAverages.set(supplierKey, result);
        }
      });
      resultsToReturn = Array.from(uniqueRegionalAverages.values()).slice(0, 1); // Only one regional average
    }

    // Get latest price per supplier and volume combination
    const latestPrices = new Map();
    resultsToReturn.forEach(result => {
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

  // Supplier claim operations
  async createSupplierClaim(claim: InsertSupplierClaim): Promise<SupplierClaim> {
    const [newClaim] = await db
      .insert(supplierClaims)
      .values(claim)
      .returning();
    return newClaim;
  }

  async getSupplierClaims(status?: string): Promise<SupplierClaim[]> {
    if (status) {
      return await db
        .select()
        .from(supplierClaims)
        .where(eq(supplierClaims.status, status))
        .orderBy(desc(supplierClaims.createdAt));
    }
    return await db
      .select()
      .from(supplierClaims)
      .orderBy(desc(supplierClaims.createdAt));
  }

  async updateSupplierClaimStatus(id: number, status: string): Promise<SupplierClaim> {
    const [updatedClaim] = await db
      .update(supplierClaims)
      .set({ status, updatedAt: new Date() })
      .where(eq(supplierClaims.id, id))
      .returning();
    return updatedClaim;
  }
}

export const storage = new DatabaseStorage();