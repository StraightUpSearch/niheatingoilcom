import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { insertPriceAlertSchema, insertSearchQuerySchema } from "@shared/schema";
import { scrapeAllSuppliers, initializeScraping } from "./scraper";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Initialize scraping after server starts (non-blocking)
  setTimeout(() => {
    initializeScraping().catch(error => {
      console.error("Scraping initialization failed:", error);
    });
  }, 1000);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public routes
  app.get('/api/suppliers', async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.get('/api/suppliers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await storage.getSupplierById(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  app.get('/api/prices', async (req, res) => {
    try {
      const { volume, postcode, sort = 'price' } = req.query;
      
      const prices = await storage.getLatestPrices(
        volume ? parseInt(volume as string) : undefined,
        postcode as string
      );

      // Sort results
      if (sort === 'price') {
        prices.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sort === 'supplier') {
        prices.sort((a, b) => a.supplier.name.localeCompare(b.supplier.name));
      } else if (sort === 'rating') {
        prices.sort((a, b) => parseFloat(b.supplier.rating || '0') - parseFloat(a.supplier.rating || '0'));
      }

      res.json(prices);
    } catch (error) {
      console.error("Error fetching prices:", error);
      res.status(500).json({ message: "Failed to fetch prices" });
    }
  });

  app.get('/api/prices/lowest/:volume', async (req, res) => {
    try {
      const volume = parseInt(req.params.volume);
      const { limit = 10 } = req.query;
      
      const prices = await storage.getLowestPrices(volume, parseInt(limit as string));
      res.json(prices);
    } catch (error) {
      console.error("Error fetching lowest prices:", error);
      res.status(500).json({ message: "Failed to fetch lowest prices" });
    }
  });

  app.get('/api/prices/history', async (req, res) => {
    try {
      const { days = 30, volume } = req.query;
      
      const history = await storage.getPriceHistory(
        parseInt(days as string),
        volume ? parseInt(volume as string) : undefined
      );
      
      res.json(history);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ message: "Failed to fetch price history" });
    }
  });

  app.get('/api/prices/stats/:volume', async (req, res) => {
    try {
      const volume = parseInt(req.params.volume);
      const stats = await storage.getAveragePrices(volume);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching price stats:", error);
      res.status(500).json({ message: "Failed to fetch price stats" });
    }
  });

  app.post('/api/search', async (req, res) => {
    try {
      const validatedData = insertSearchQuerySchema.parse(req.body);
      
      // Log the search query
      await storage.logSearchQuery({
        ...validatedData,
        ipAddress: req.ip || '',
      });

      // Get matching suppliers and prices
      const { postcode, volume } = validatedData;
      
      let suppliers: any[] = [];
      if (postcode) {
        suppliers = await storage.getSuppliersInArea(postcode);
      }

      const prices = await storage.getLatestPrices(
        volume || undefined, 
        postcode || undefined
      );
      
      res.json({
        suppliers,
        prices,
        resultsCount: prices.length,
      });
    } catch (error) {
      console.error("Error processing search:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process search" });
    }
  });

  // Protected routes
  app.get('/api/alerts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alerts = await storage.getUserPriceAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post('/api/alerts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertPriceAlertSchema.parse({
        ...req.body,
        userId,
      });
      
      const alert = await storage.createPriceAlert(validatedData);
      res.json(alert);
    } catch (error) {
      console.error("Error creating alert:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  app.put('/api/alerts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Verify the alert belongs to the user
      const alerts = await storage.getUserPriceAlerts(userId);
      const alert = alerts.find(a => a.id === id);
      
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }

      const updatedAlert = await storage.updatePriceAlert(id, req.body);
      res.json(updatedAlert);
    } catch (error) {
      console.error("Error updating alert:", error);
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  app.delete('/api/alerts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Verify the alert belongs to the user
      const alerts = await storage.getUserPriceAlerts(userId);
      const alert = alerts.find(a => a.id === id);
      
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }

      await storage.deletePriceAlert(id);
      res.json({ message: "Alert deleted successfully" });
    } catch (error) {
      console.error("Error deleting alert:", error);
      res.status(500).json({ message: "Failed to delete alert" });
    }
  });

  // SEO routes
  app.get('/sitemap.xml', (req, res) => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://oilprice-ni.replit.app/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://oilprice-ni.replit.app/compare</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://oilprice-ni.replit.app/suppliers</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://oilprice-ni.replit.app/alerts</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
    
    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  app.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /
Allow: /compare
Allow: /suppliers
Allow: /alerts
Disallow: /api/
Disallow: /admin/

Sitemap: https://oilprice-ni.replit.app/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
    
    res.set('Content-Type', 'text/plain');
    res.send(robots);
  });

  // Admin routes (scraping trigger)
  app.post('/api/admin/scrape', async (req, res) => {
    try {
      console.log('Manual scraping triggered');
      await scrapeAllSuppliers();
      res.json({ message: "Scraping completed successfully" });
    } catch (error) {
      console.error("Error during manual scraping:", error);
      res.status(500).json({ message: "Failed to complete scraping" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
