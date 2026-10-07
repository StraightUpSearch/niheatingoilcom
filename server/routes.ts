import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { z } from "zod";
import { insertPriceAlertSchema, insertSearchQuerySchema, insertLeadSchema, insertSupplierClaimSchema, insertSavedQuoteSchema, insertEmailSubscriberSchema } from "@shared/schema";
import { initializeConsumerCouncilScraping } from "./consumerCouncilScraper";
import { initializeWeeklyUrlDetection, consumerCouncilUrlDetector } from "./consumerCouncilUrlDetector";
import { sendAdminAlert } from "./emailService";
import { strictRateLimit, moderateRateLimit, lenientRateLimit, botDetection, validateFormSubmission } from "./rateLimit";
import { getCurrentImpact, getAllImpactData, isWinterSeason, calculateUserImpact } from "./charityImpact";


export async function registerRoutes(app: Express): Promise<Server> {
  // Trust proxy for accurate IP detection
  app.set('trust proxy', 1);

  // Auth middleware
  await setupAuth(app);

  // Initialize Consumer Council scraping and URL detection
  // Temporarily disabled for WordPress setup - uncomment when needed
  /*
  setTimeout(() => {
    initializeConsumerCouncilScraping().catch(error => {
      console.error("Consumer Council scraping initialization failed:", error);
    });
  }, 1000);

  // Initialize weekly URL detection for latest Consumer Council data
  setTimeout(() => {
    initializeWeeklyUrlDetection().catch(error => {
      console.error("Consumer Council URL detection initialization failed:", error);
    });
  }, 2000);



  // Initialize curated supplier data (no external API calls needed)
  setTimeout(async () => {
    try {
      console.log("Initializing curated Northern Ireland supplier database...");
      const { initializeCuratedData } = await import('./curatedSupplierData');
      await initializeCuratedData();
    } catch (error) {
      console.error("Curated supplier data initialization failed:", error);
    }
  }, 3000);
  */

  console.log("ℹ️  Routes registered");

  // Health check endpoint
  app.get('/api/health', async (_req, res) => {
    try {
      // Test DB connection
      const suppliers = await storage.getAllSuppliers();
      res.json({
        status: 'ok',
        db: 'connected',
        suppliers: suppliers.length,
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(503).json({
        status: 'error',
        db: 'disconnected',
        error: 'Database connection failed',
      });
    }
  });

  // Auth routes
  app.get('/api/user', async (req: any, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      res.json(req.user);
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

  // Slug-based supplier lookup — must come before /:id to avoid parseInt("alfa-oils")
  app.get('/api/suppliers/by-slug/:slug', async (req, res) => {
    try {
      const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const slug = req.params.slug;
      const all = await storage.getAllSuppliers();
      const supplier = all.find(s => toSlug(s.name) === slug);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      const prices = await storage.getPricesBySupplier(supplier.id);
      res.json({
        ...supplier,
        prices,
        averageRating: parseFloat(supplier.rating || "0"),
        totalReviews: supplier.reviewCount || 0,
        lastUpdated: supplier.lastScraped ? new Date(supplier.lastScraped).toLocaleDateString() : "Recently"
      });
    } catch (error) {
      console.error("Error fetching supplier by slug:", error);
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  app.get('/api/suppliers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      const supplier = await storage.getSupplierById(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // Get recent prices for this supplier
      const prices = await storage.getPricesBySupplier(id);
      
      res.json({
        ...supplier,
        prices: prices,
        averageRating: parseFloat(supplier.rating || "0"),
        totalReviews: supplier.reviewCount || 0,
        lastUpdated: supplier.lastScraped ? new Date(supplier.lastScraped).toLocaleDateString() : "Recently"
      });
    } catch (error) {
      console.error("Error fetching supplier:", error);
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  app.get('/api/prices', async (req, res) => {
    try {
      const { volume, postcode, sort = 'price' } = req.query;

      let prices = await storage.getLatestPrices(
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
      if (isNaN(volume) || volume <= 0) {
        return res.status(400).json({ message: "Volume must be a positive number" });
      }
      const { limit = 10 } = req.query;

      const prices = await storage.getLowestPrices(volume, parseInt(limit as string));
      res.json(prices);
    } catch (error) {
      console.error("Error fetching lowest prices:", error);
      res.status(500).json({ message: "Failed to fetch lowest prices" });
    }
  });

  // NI-wide price summary (cheapest + average per volume)
  app.get('/api/prices/ni-summary', async (req, res) => {
    try {
      const volumes = [300, 500, 900];
      const summary: Record<number, { cheapest: number; average: number; count: number; updatedAt: string }> = {};

      for (const volume of volumes) {
        const prices = await storage.getLatestPrices(volume, undefined);
        if (prices.length === 0) {
          summary[volume] = { cheapest: 0, average: 0, count: 0, updatedAt: new Date().toISOString() };
          continue;
        }
        const vals = prices.map(p => parseFloat(p.price)).filter(v => v > 0);
        const cheapest = Math.min(...vals);
        const average = vals.reduce((a, b) => a + b, 0) / vals.length;
        const newest = Math.max(...prices.map((p) => new Date(p.createdAt as any).getTime()));
        summary[volume] = {
          cheapest: parseFloat(cheapest.toFixed(2)),
          average: parseFloat(average.toFixed(2)),
          count: vals.length,
          updatedAt: new Date(newest).toISOString(),
        };
      }

      res.json(summary);
    } catch (error) {
      console.error("Error fetching NI summary:", error);
      res.status(500).json({ message: "Failed to fetch NI price summary" });
    }
  });

  // 410 Gone for all /list/* URLs — removes spam product URLs from Google index
  app.use('/list', (_req, res) => {
    res.status(410).send('Gone');
  });

  // Noindex + canonical on /results — prevents query-param URLs polluting the index
  app.use('/results', (req, res, next) => {
    res.setHeader('X-Robots-Tag', 'noindex, follow');
    const postcode = (req.query.postcode as string || '').toLowerCase().replace(/\s/g, '');
    if (postcode) {
      res.setHeader('Link', `<https://niheatingoil.com/heating-oil-prices/${postcode}/>; rel="canonical"`);
    }
    next();
  });

  // Address search API endpoint
  app.get('/api/address/search', async (req, res) => {
    try {
      const { q: query } = req.query;
      
      if (!query || typeof query !== 'string' || query.length < 3) {
        return res.status(400).json({ error: 'Query must be at least 3 characters' });
      }

      // GetAddress.io API call
      const apiKey = process.env.GETADDRESS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Address API not configured' });
      }

      const response = await fetch(
        `https://api.getaddress.io/autocomplete/${encodeURIComponent(query)}?api-key=${apiKey}&all=true`
      );
      
      if (!response.ok) {
        console.error('GetAddress API error:', response.statusText);
        return res.status(500).json({ error: 'Address lookup failed' });
      }

      const data = await response.json();
      
      // Transform GetAddress.io response to our format
      const addresses = (data.suggestions || [])
        .filter((suggestion: any) => {
          const addr = suggestion.address || '';
          // Only include Northern Ireland addresses (contains County Antrim, County Down, etc. or BT postcode)
          return addr.includes('County Antrim') || addr.includes('County Down') || 
                 addr.includes('County Armagh') || addr.includes('County Fermanagh') ||
                 addr.includes('County Londonderry') || addr.includes('County Tyrone') ||
                 addr.includes('Belfast') || addr.includes('BT');
        })
        .map((suggestion: any) => {
          const fullAddress = suggestion.address || '';
          const parts = fullAddress.split(', ');
          
          // Extract components more intelligently
          let premise = '';
          let thoroughfare = '';
          let locality = '';
          let postcode = '';
          let administrative_area = 'Northern Ireland';
          
          // Find postcode (BT format)
          const postcodeMatch = fullAddress.match(/BT\d{1,2}\s?\d[A-Z]{2}/i);
          if (postcodeMatch) {
            postcode = postcodeMatch[0];
          }
          
          // Extract locality and administrative area
          if (fullAddress.includes('County Antrim')) {
            administrative_area = 'County Antrim';
            locality = parts.find((p: string) => p.includes('Belfast')) || parts[parts.length - 2] || '';
          } else if (fullAddress.includes('County Down')) {
            administrative_area = 'County Down';
            locality = parts[parts.length - 2] || '';
          } else if (fullAddress.includes('Belfast')) {
            administrative_area = 'Belfast';
            locality = 'Belfast';
          } else {
            // Extract county from address
            const countyMatch = fullAddress.match(/County \w+/);
            if (countyMatch) {
              administrative_area = countyMatch[0];
            }
            locality = parts[parts.length - 2] || '';
          }
          
          // Extract premise and thoroughfare
          if (parts.length >= 3) {
            premise = parts[0];
            thoroughfare = parts[1];
          } else if (parts.length === 2) {
            thoroughfare = parts[0];
          }

          return {
            formatted_address: fullAddress,
            postcode: postcode,
            thoroughfare: thoroughfare.replace(/^\d+\s*/, ''), // Remove house number from street name
            premise: premise.match(/^\d+/) ? premise : '', // Only keep if starts with number
            locality: locality.replace(/County \w+/, '').trim(),
            administrative_area: administrative_area
          };
        })
        .slice(0, 8); // Limit to 8 results for better UX

      res.json({ addresses });
    } catch (error) {
      console.error('Address search error:', error);
      res.status(500).json({ error: 'Internal server error' });
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
      if (isNaN(volume) || volume <= 0) {
        return res.status(400).json({ message: "Volume must be a positive number" });
      }
      const stats = await storage.getAveragePrices(volume);
      res.json({
        ...stats,
        weeklyAverage: stats?.weeklyAverage
          ? parseFloat(stats.weeklyAverage).toFixed(2)
          : stats?.weeklyAverage,
      });
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
      const userId = req.user.id;
      const alerts = await storage.getUserPriceAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post('/api/alerts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
      const userId = req.user.id;
      
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
      const userId = req.user.id;
      
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

  // Enhanced enquiry endpoint with ticket system
  app.post('/api/enquiry', async (req, res) => {
    try {
      const { name, email, postcode, litres } = req.body;
      
      // Validate required fields
      if (!name || !email || !postcode || !litres) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Validate Northern Ireland postcode format
      const btPattern = /^BT\d{1,2}\s?\d[A-Z]{2}$/i;
      if (!btPattern.test(postcode.trim())) {
        return res.status(400).json({ 
          error: "Invalid Northern Ireland postcode. Please use BT format (e.g., BT1 1AA)" 
        });
      }

      // Validate litres
      const volume = parseInt(litres);
      if (isNaN(volume) || volume < 100 || volume > 2000) {
        return res.status(400).json({ 
          error: "Volume must be between 100 and 2000 litres" 
        });
      }

      // Generate unique ticket ID
      const timestamp = Date.now();
      const ticketId = `NIHO-${timestamp.toString().slice(-4)}`;

      // Create lead with ticket information
      const leadData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: "", 
        postcode: postcode.toUpperCase().trim(),
        volume: volume,
        notes: `Ticket ID: ${ticketId} | Generated: ${new Date().toISOString()}`,
        status: "new",
        urgency: "normal"
      };

      const lead = await storage.createLead(leadData);

      // Send confirmation email to customer
      try {
        const { sendLeadNotifications } = await import('./emailService');
        await sendLeadNotifications(lead);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      // Log enquiry for specialist follow-up
      console.log(`New heating oil enquiry - ${ticketId}:`, {
        customer: name,
        email: email,
        postcode: postcode,
        litres: volume,
        leadId: lead.id,
        timestamp: new Date().toISOString()
      });

      res.json({
        ticketId,
        message: `Thanks, ${name.split(' ')[0]}! We're checking the best rates for ${postcode}. You'll get an email shortly.`,
        leadId: lead.id
      });

    } catch (error) {
      console.error("Error creating enquiry:", error);
      res.status(500).json({ error: "Failed to process enquiry" });
    }
  });

  // Lead capture endpoint (no authentication required)
  app.post('/api/leads', strictRateLimit, botDetection, validateFormSubmission, async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      
      // Send email notifications via SendGrid
      try {
        const { sendLeadNotifications } = await import('./emailService');
        await sendLeadNotifications(lead);
        console.log(`Email notifications sent for lead ${lead.id}`);
      } catch (emailError) {
        console.error("Failed to send email notifications:", emailError);
        // Don't fail the lead capture if email fails
      }
      
      res.status(201).json({ 
        message: "Lead captured successfully", 
        id: lead.id 
      });
    } catch (error) {
      console.error("Error creating lead:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid lead data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to capture lead" });
    }
  });

  // Supplier claim submission endpoint
  app.post('/api/supplier-claims', async (req, res) => {
    try {
      const validatedData = insertSupplierClaimSchema.parse(req.body);
      const claim = await storage.createSupplierClaim(validatedData);
      
      // Send email notification to admin about new supplier claim
      try {
        const { sendAdminAlert } = await import('./emailService');
        await sendAdminAlert({
          id: claim.id,
          name: claim.contactName,
          email: claim.email,
          phone: claim.phone,
          postcode: 'N/A',
          volume: 0,
          urgency: 'medium',
          notes: `Supplier Claim: ${claim.supplierName} - ${claim.message}`,
          supplierName: claim.supplierName,
          supplierPrice: claim.currentPricing || 'N/A',
          status: 'new',
          createdAt: claim.createdAt,
          updatedAt: claim.updatedAt
        });
        console.log(`Admin notification sent for supplier claim ${claim.id}`);
      } catch (emailError) {
        console.error("Failed to send admin notification:", emailError);
      }
      
      res.status(201).json({ 
        message: "Supplier claim submitted successfully", 
        id: claim.id 
      });
    } catch (error) {
      console.error("Error creating supplier claim:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid claim data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit supplier claim" });
    }
  });

  // Lightweight email subscriber capture (no account required)
  app.post('/api/subscribe', lenientRateLimit, async (req, res) => {
    try {
      const { email, postcode, volume, source } = req.body;

      if (!email || !postcode) {
        return res.status(400).json({ message: "Email and postcode are required" });
      }

      const btPattern = /^BT\d{1,2}\s?\d[A-Z]{2}$/i;
      if (!btPattern.test(postcode.trim())) {
        return res.status(400).json({ message: "Please enter a valid NI postcode (BT format)" });
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.trim())) {
        return res.status(400).json({ message: "Please enter a valid email address" });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = await storage.getEmailSubscriberByEmail(normalizedEmail);
      if (existing) {
        return res.json({ message: "Already subscribed", id: existing.id });
      }

      const subscriber = await storage.createEmailSubscriber({
        email: normalizedEmail,
        postcode: postcode.trim().toUpperCase(),
        volume: volume ? parseInt(volume) : null,
        source: source || 'website',
      });

      try {
        const { sendSubscriberConfirmation } = await import('./emailService');
        await sendSubscriberConfirmation(normalizedEmail, subscriber.postcode);
      } catch (emailError) {
        console.error("Failed to send subscriber confirmation:", emailError);
      }

      res.status(201).json({ message: "Subscribed successfully", id: subscriber.id });
    } catch (error) {
      console.error("Error creating subscriber:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Admin endpoint to view leads (requires admin role)
  app.get('/api/admin/leads', isAuthenticated, async (req: any, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    try {
      const status = req.query.status as string;
      const leads = await storage.getLeads(status);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // Sitemap index — points to four sub-sitemaps
  app.get('/sitemap.xml', (_req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://niheatingoil.com/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://niheatingoil.com/sitemap-postcodes.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://niheatingoil.com/sitemap-cities.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://niheatingoil.com/sitemap-suppliers.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Static pages sitemap
  app.get('/sitemap-pages.xml', (_req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const urls = [
      { loc: 'https://niheatingoil.com/', priority: '1.0', changefreq: 'daily' },
      { loc: 'https://niheatingoil.com/heating-oil-prices/', priority: '0.9', changefreq: 'daily' },
      { loc: 'https://niheatingoil.com/compare', priority: '0.9', changefreq: 'hourly' },
      { loc: 'https://niheatingoil.com/suppliers', priority: '0.8', changefreq: 'daily' },
      { loc: 'https://niheatingoil.com/blog', priority: '0.7', changefreq: 'weekly' },
      { loc: 'https://niheatingoil.com/blog/best-time-buy-heating-oil-northern-ireland', priority: '0.6', changefreq: 'monthly' },
      { loc: 'https://niheatingoil.com/blog/heating-oil-tank-sizes', priority: '0.6', changefreq: 'monthly' },
      { loc: 'https://niheatingoil.com/blog/how-to-save-money-heating-oil', priority: '0.6', changefreq: 'monthly' },
      { loc: 'https://niheatingoil.com/about', priority: '0.5', changefreq: 'monthly' },
      { loc: 'https://niheatingoil.com/contact', priority: '0.5', changefreq: 'monthly' },
      { loc: 'https://niheatingoil.com/giving-back', priority: '0.5', changefreq: 'monthly' },
      { loc: 'https://niheatingoil.com/ni-heating-oil-price-index', priority: '0.8', changefreq: 'daily' },
      { loc: 'https://niheatingoil.com/blog/cheapest-time-buy-heating-oil-northern-ireland', priority: '0.6', changefreq: 'monthly' },
      { loc: 'https://niheatingoil.com/blog/find-best-heating-oil-prices-northern-ireland', priority: '0.6', changefreq: 'monthly' },
      { loc: 'https://niheatingoil.com/blog/how-to-dispose-heating-oil-northern-ireland', priority: '0.6', changefreq: 'monthly' },
      { loc: 'https://niheatingoil.com/blog/heating-oil-tank-maintenance-guide', priority: '0.6', changefreq: 'monthly' },
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Postcode pages sitemap
  app.get('/sitemap-postcodes.xml', (_req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const postcodes = [
      'bt1','bt2','bt3','bt4','bt5','bt6','bt7','bt8','bt9','bt10',
      'bt11','bt12','bt13','bt14','bt15','bt16','bt17','bt18','bt19','bt20',
      'bt21','bt22','bt23','bt24','bt25','bt26','bt27','bt28','bt29','bt30',
      'bt31','bt32','bt33','bt34','bt35','bt36','bt37','bt38','bt39','bt40',
      'bt41','bt42','bt43','bt44','bt45','bt46','bt47','bt48','bt49',
      'bt51','bt52','bt53','bt54','bt55','bt56','bt57',
      'bt60','bt61','bt62','bt63','bt64','bt65','bt66','bt67','bt68','bt69',
      'bt70','bt71','bt74','bt75','bt76','bt77','bt78','bt79','bt80','bt81','bt82',
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${postcodes.map(pc => `  <url>
    <loc>https://niheatingoil.com/heating-oil-prices/${pc}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  });

  // City pages sitemap
  app.get('/sitemap-cities.xml', (_req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const cities = [
      'belfast','londonderry','derry','lisburn','newtownabbey','bangor',
      'ballymena','ballymoney','coleraine','armagh','omagh','antrim',
      'magherafelt','strabane','dungannon','enniskillen','larne',
      'carrickfergus','limavady','newry','downpatrick','portadown','lurgan',
      'ballynahinch','cookstown',
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cities.map(c => `  <url>
    <loc>https://niheatingoil.com/heating-oil-prices/${c}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.75</priority>
  </url>`).join('\n')}
</urlset>`;
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Supplier pages sitemap — dynamically from DB
  app.get('/sitemap-suppliers.xml', async (_req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      const today = new Date().toISOString().split('T')[0];
      const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${suppliers.map(s => `  <url>
    <loc>https://niheatingoil.com/supplier/${toSlug(s.name)}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;
      res.set('Content-Type', 'application/xml');
      res.send(xml);
    } catch {
      res.set('Content-Type', 'application/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`);
    }
  });

  app.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /list/
Disallow: /results

Sitemap: https://niheatingoil.com/sitemap.xml
Sitemap: https://niheatingoil.com/sitemap-postcodes.xml
Sitemap: https://niheatingoil.com/sitemap-cities.xml
Sitemap: https://niheatingoil.com/sitemap-suppliers.xml`;

    res.set('Content-Type', 'text/plain');
    res.send(robots);
  });

  


  // Chatbot conversation logging endpoint
  app.post('/api/chat/log', lenientRateLimit, async (req, res) => {
    try {
      const { userMessage, conversationHistory, timestamp } = req.body;
      
      // Log conversation to console for immediate visibility
      console.log('=== CHATBOT CONVERSATION LOG ===');
      console.log('Timestamp:', timestamp);
      console.log('User Message:', userMessage);
      console.log('Conversation History:', JSON.stringify(conversationHistory, null, 2));
      console.log('===============================');
      
      // Send email notification to webmaster
      try {
        await sendAdminAlert({
          id: Date.now(),
          name: 'Chatbot User',
          email: 'chatbot-conversation@unknown.com',
          phone: '',
          postcode: 'CHATBOT',
          volume: 500,
          notes: `Chatbot Conversation:\n\nUser: ${userMessage}\n\nFull conversation:\n${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}`,
          status: 'new',
          createdAt: new Date(),
          updatedAt: new Date(),
          urgency: null,
          supplierName: null,
          supplierPrice: null
        });
      } catch (emailError) {
        console.error('Failed to send chatbot conversation email:', emailError);
      }
      
      res.json({ success: true, message: 'Conversation logged' });
    } catch (error) {
      console.error("Error logging conversation:", error);
      res.status(500).json({ message: "Failed to log conversation" });
    }
  });

  // Contact form endpoint
  app.post('/api/contact', strictRateLimit, botDetection, validateFormSubmission, async (req, res) => {
    try {
      const { name, email, phone, subject, message, enquiryType } = req.body;
      
      // Validate required fields
      if (!name || !email || !subject || !message || !enquiryType) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Create contact lead in database
      const contactLead = await storage.createLead({
        name,
        email,
        phone: phone || '',
        postcode: 'CONTACT',
        volume: 0,
        notes: `Subject: ${subject}\n\nEnquiry Type: ${enquiryType}\n\nMessage:\n${message}`,
        status: 'new'
      });
      
      // Send email notification
      try {
        await sendAdminAlert({
          ...contactLead,
          notes: `NEW CONTACT FORM SUBMISSION\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nSubject: ${subject}\nEnquiry Type: ${enquiryType}\n\nMessage:\n${message}`
        });
      } catch (emailError) {
        console.error('Failed to send contact email notification:', emailError);
      }
      
      res.json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        leadId: contactLead.id
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ message: "Failed to process contact form submission" });
    }
  });

  // Chatbot endpoint
  app.post('/api/chat', moderateRateLimit, botDetection, async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages must be an array" });
      }

      const { generateChatResponse, validateChatMessage } = await import('./chatbot');
      
      // Validate all messages
      const validMessages = messages.filter(validateChatMessage);
      if (validMessages.length === 0) {
        return res.status(400).json({ message: "No valid messages provided" });
      }

      const response = await generateChatResponse(validMessages);
      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        message: "Sorry, I'm having trouble right now. Please try again in a moment." 
      });
    }
  });

  // Charity impact data endpoint
  app.get('/api/impact', async (req, res) => {
    try {
      const impact = getCurrentImpact();
      const isWinter = isWinterSeason();
      
      res.json({
        totalGrants: impact.totalGrants,
        totalAmount: impact.totalAmount,
        currentYear: impact.currentYear,
        isWinterSeason: isWinter,
        message: `${impact.totalGrants} heating grants funded since January ${impact.currentYear}`
      });
    } catch (error) {
      console.error("Error fetching charity impact:", error);
      res.status(500).json({ message: "Failed to fetch impact data" });
    }
  });

  // User impact calculation (for logged-in users)
  app.get('/api/user-impact', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Calculate user's total contribution based on saved quotes
      const savedQuotes = await storage.getUserSavedQuotes(userId);
      const totalOrderValue = savedQuotes.reduce((sum, quote) => {
        const price = parseFloat(quote.price.replace(/[£,]/g, '')) || 0;
        return sum + price;
      }, 0);
      
      const userGrants = calculateUserImpact(totalOrderValue);
      
      res.json({
        grantsContributed: userGrants,
        totalContribution: totalOrderValue * 0.05,
        message: userGrants > 0 
          ? `You've contributed to ${userGrants} heating grants since joining`
          : "Start ordering to contribute to heating grants"
      });
    } catch (error) {
      console.error("Error calculating user impact:", error);
      res.status(500).json({ message: "Failed to calculate user impact" });
    }
  });

  // Saved quotes endpoints
  app.get('/api/saved-quotes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const quotes = await storage.getUserSavedQuotes(userId);
      res.json(quotes);
    } catch (error) {
      console.error('Error fetching saved quotes:', error);
      res.status(500).json({ message: 'Failed to fetch saved quotes' });
    }
  });

  app.post('/api/saved-quotes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const quoteData = insertSavedQuoteSchema.parse({ ...req.body, userId });
      const quote = await storage.createSavedQuote({ ...quoteData, createdAt: new Date() });
      res.status(201).json(quote);
    } catch (error) {
      console.error('Error saving quote:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid quote data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to save quote' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
