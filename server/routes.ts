import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { z } from "zod";
import { insertPriceAlertSchema, insertSearchQuerySchema, insertLeadSchema, insertSupplierClaimSchema } from "@shared/schema";
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

  app.get('/api/suppliers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid supplier ID" });
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

      const response = await fetch(`https://api.getaddress.io/autocomplete/${encodeURIComponent(query)}?api-key=qi9aovP-DEeb1rt4NqF1uw46379&all=true`);
      
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

  // Admin endpoint to view leads (requires authentication)
  app.get('/api/admin/leads', isAuthenticated, async (req: any, res) => {
    try {
      const status = req.query.status as string;
      const leads = await storage.getLeads(status);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // Enhanced SEO sitemap with dynamic supplier data
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      const today = new Date().toISOString().split('T')[0];
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Homepage -->
  <url>
    <loc>https://niheatingoil.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Main Features -->
  <url>
    <loc>https://niheatingoil.com/compare</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/suppliers</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Important Pages -->
  <url>
    <loc>https://niheatingoil.com/pages/html-sitemap</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- County Pages -->
  <url>
    <loc>https://niheatingoil.com/county/antrim</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/county/down</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/county/armagh</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/county/tyrone</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/county/fermanagh</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/county/derry</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Major City Pages -->
  <url>
    <loc>https://niheatingoil.com/city/belfast</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/city/derry</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/city/lisburn</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/city/bangor</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog Articles -->
  <url>
    <loc>https://niheatingoil.com/blog/heating-oil-tank-sizes</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/blog/how-to-save-money-heating-oil</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/blog/best-time-buy-heating-oil-northern-ireland</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://niheatingoil.com/blog/heating-oil-tank-maintenance-guide</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;

      // Add dynamic supplier pages based on actual data
      suppliers.forEach(supplier => {
        const supplierSlug = supplier.name.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-');
        
        sitemap += `
  <url>
    <loc>https://niheatingoil.com/supplier/${supplierSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });

      sitemap += `
</urlset>`;
    
      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      // Fallback to basic sitemap
      const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://niheatingoil.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
      res.set('Content-Type', 'application/xml');
      res.send(basicSitemap);
    }
  });

  app.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /
Allow: /compare
Allow: /suppliers
Allow: /alerts
Disallow: /api/
Disallow: /admin/

Sitemap: https://niheatingoil.com/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
    
    res.set('Content-Type', 'text/plain');
    res.send(robots);
  });

  

  // Supplier claim submissions
  app.post('/api/supplier-claims', async (req, res) => {
    try {
      const validatedData = insertSupplierClaimSchema.parse(req.body);
      const claim = await storage.createSupplierClaim(validatedData);
      
      res.json({
        message: "Claim submitted successfully",
        claimId: claim.id,
        status: "pending"
      });
    } catch (error) {
      console.error("Error creating supplier claim:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid claim data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit claim" });
    }
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
      const userId = req.user.claims.sub;
      
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

  const httpServer = createServer(app);
  return httpServer;
}
