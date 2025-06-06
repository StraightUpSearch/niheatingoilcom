import { Router } from "express";
import { db } from "../db";
import { enquiries, priceLocks } from "@shared/schema";
import { sql } from "drizzle-orm";

export function statsRoutes(io: any) {
  const router = Router();

  // Get recent savings statistics
  router.get("/api/stats/recent-savings", async (req, res) => {
    try {
      // Calculate average savings (mock data for now)
      const averageSavings = 156; // This would be calculated from actual order data
      
      // Get recent order count
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      
      let recentOrders = 0;
      try {
        const recentOrdersResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(enquiries)
          .where(sql`${enquiries.createdAt} > ${twentyFourHoursAgo.toISOString()}`);
        
        recentOrders = recentOrdersResult[0]?.count || 0;
      } catch (error) {
        // If using mock database, return sample data
        console.log("Using mock stats data");
        recentOrders = Math.floor(Math.random() * 20) + 10; // Random 10-30 orders
      }
      
      // Calculate last update time
      const lastUpdate = "2 hours"; // This would be calculated from actual price update times
      
      res.json({
        averageSavings,
        recentOrders,
        lastUpdate,
        weeklyTotal: recentOrders * 7, // Rough estimate
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Get community savings data for a specific postcode
  router.get("/api/community-savings/:postcode/:volume", async (req, res) => {
    try {
      const { postcode, volume } = req.params;
      
      // Get active orders in the area (simplified - in production, this would check actual orders)
      const postcodePrefix = postcode.substring(0, 3); // Get BT1, BT2, etc.
      
      // Mock data - in production, query actual orders
      const activeOrders = Math.floor(Math.random() * 8) + 1; // Random 1-8
      const ordersNeeded = 5; // Standard group size
      const baseDiscount = 10;
      const potentialDiscount = `£${baseDiscount + Math.floor(activeOrders * 2)}`;
      
      // Check if it's weekend
      const now = new Date();
      const dayOfWeek = now.getDay();
      const hour = now.getHours();
      const isWeekend = (dayOfWeek === 5 && hour >= 18) || dayOfWeek === 6 || dayOfWeek === 0;
      
      res.json({
        activeOrders,
        ordersNeeded,
        potentialDiscount,
        isWeekend,
        postcodeArea: postcodePrefix,
        groupProgress: (activeOrders / ordersNeeded) * 100,
      });
    } catch (error) {
      console.error("Error fetching community savings:", error);
      res.status(500).json({ error: "Failed to fetch community data" });
    }
  });

  // Get price lock status
  router.get("/api/price-locks/check", async (req, res) => {
    try {
      const { supplierId, volume, postcode } = req.query;
      
      const activeLock = await db
        .select()
        .from(priceLocks)
        .where(
          sql`${priceLocks.supplierId} = ${supplierId} 
          AND ${priceLocks.volume} = ${volume} 
          AND ${priceLocks.postcode} = ${postcode}
          AND ${priceLocks.expiresAt} > ${new Date().toISOString()}`
        )
        .limit(1);
      
      if (activeLock.length > 0) {
        res.json({ 
          locked: true, 
          lock: activeLock[0],
          expiresIn: new Date(activeLock[0].expiresAt).getTime() - Date.now()
        });
      } else {
        res.json({ locked: false });
      }
    } catch (error) {
      console.error("Error checking price lock:", error);
      res.status(500).json({ error: "Failed to check price lock" });
    }
  });

  // Create a new price lock
  router.post("/api/price-locks", async (req, res) => {
    try {
      const { supplierId, price, volume, postcode, email, expiryHours = 24 } = req.body;
      
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiryHours);
      
      const newLock = await db
        .insert(priceLocks)
        .values({
          supplierId,
          price,
          volume,
          postcode,
          email,
          expiresAt: expiresAt.toISOString(),
        })
        .returning();
      
      // Emit event for real-time updates
      io.emit("price-locked", {
        postcode,
        volume,
        supplierId,
      });
      
      res.json(newLock[0]);
    } catch (error) {
      console.error("Error creating price lock:", error);
      res.status(500).json({ error: "Failed to create price lock" });
    }
  });

  return router;
}