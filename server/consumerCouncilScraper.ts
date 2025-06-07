import axios from 'axios';
import * as cheerio from 'cheerio';
import { storage } from './storage';
import { InsertOilPrice, InsertSupplier } from '@shared/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_PATH = path.join(__dirname, '../data/oil_prices_cache.json');

interface ConsumerCouncilData {
  location: string;
  council: string;
  prices: {
    volume300: number;
    volume500: number;
    volume900: number;
  };
  latitude: number;
  longitude: number;
}

async function scrapeConsumerCouncilData(url: string): Promise<string> {
  try {
    if (!process.env.SCRAPINGBEE_API_KEY) {
      throw new Error('ScrapingBee API key is required for Consumer Council scraping');
    }

    console.log('[ScrapingBee] Making API request for Consumer Council data...');
    const response = await axios.get('https://app.scrapingbee.com/api/v1/', {
      params: {
        api_key: process.env.SCRAPINGBEE_API_KEY,
        url: url,
        render_js: false,
        premium_proxy: true,
        country_code: 'gb'
      }
    });

    if (response.status !== 200) {
      throw new Error(`Failed to scrape: ${response.status}`);
    }

    console.log('[ScrapingBee] Successfully fetched Consumer Council data');
    return response.data;
  } catch (error) {
    console.error('[ScrapingBee] Error:', error);
    throw error;
  }
}

function parseConsumerCouncilHTML(html: string): ConsumerCouncilData[] {
  const $ = cheerio.load(html);
  const locations: ConsumerCouncilData[] = [];

  // Find all location data containers
  $('.geolocation-location').each((index, element) => {
    const $element = $(element);
    
    // Extract location coordinates
    const latitude = parseFloat($element.attr('data-lat') || '0');
    const longitude = parseFloat($element.attr('data-lng') || '0');
    
    // Extract location name
    const locationName = $element.find('.location-title').text().trim();
    
    // Extract council area
    const councilName = $element.find('a[href*="/home-heating/price-checker/"]').text().trim();
    
    // Extract pricing data from the table
    const $table = $element.find('table.views-table');
    if ($table.length > 0) {
      const priceRows = $table.find('tbody tr');
      if (priceRows.length > 0) {
        const $firstRow = $(priceRows[0]);
        const cells = $firstRow.find('td');
        
        if (cells.length >= 3) {
          // Parse prices - they're in format "£160.27"
          const price300Text = $(cells[0]).text().trim();
          const price500Text = $(cells[1]).text().trim();
          const price900Text = $(cells[2]).text().trim();
          
          const volume300 = parseFloat(price300Text.replace('£', '').replace(',', '') || '0');
          const volume500 = parseFloat(price500Text.replace('£', '').replace(',', '') || '0');
          const volume900 = parseFloat(price900Text.replace('£', '').replace(',', '') || '0');
          
          if (locationName && volume300 > 0 && volume500 > 0 && volume900 > 0) {
            locations.push({
              location: locationName,
              council: councilName || 'Unknown Council',
              prices: {
                volume300,
                volume500,
                volume900
              },
              latitude,
              longitude
            });
          }
        }
      }
    }
  });

  return locations;
}

export async function scrapeLatestConsumerCouncilData(): Promise<void> {
  console.log('[Consumer Council] Starting weekly price scraping...');
  
  try {
    // Get the latest price checker page - they update weekly
    const currentUrl = 'https://www.consumercouncil.org.uk/home-heating/price-checker';
    
    const html = await scrapeConsumerCouncilData(currentUrl);
    const locationData = parseConsumerCouncilHTML(html);
    
    console.log(`[Consumer Council] Found ${locationData.length} locations with pricing data`);
    
    // Create or update suppliers based on council areas
    const supplierMap = new Map<string, number>();
    
    for (const data of locationData) {
      const supplierName = `${data.council} - Average Prices`;
      const supplierLocation = `${data.location}, ${data.council}`;
      
      let supplierId = supplierMap.get(data.council);
      
      if (!supplierId) {
        // Check if supplier already exists
        const suppliers = await storage.getAllSuppliers();
        const existingSupplier = suppliers.find(s => s.name === supplierName);
        
        if (existingSupplier) {
          supplierId = existingSupplier.id;
        } else {
          // Create new supplier for this council area
          const newSupplier: InsertSupplier = {
            name: supplierName,
            location: supplierLocation,
            contactInfo: 'Consumer Council for Northern Ireland',
            website: 'https://www.consumercouncil.org.uk',
            rating: 5.0, // Official government data
            deliveryAreas: data.council,
            specialOffers: 'Official weekly average prices'
          };
          
          const supplier = await storage.createSupplier(newSupplier);
          supplierId = supplier.id;
        }
        
        supplierMap.set(data.council, supplierId);
      }
      
      // Insert price data for all volumes
      const priceData: InsertOilPrice[] = [
        {
          supplierId: supplierId!,
          volume: 300,
          price: data.prices.volume300.toString(),
          pricePerLitre: (data.prices.volume300 / 300).toString(),
          postcode: data.location.substring(0, 100) // Truncate to fit database field
        },
        {
          supplierId: supplierId!,
          volume: 500,
          price: data.prices.volume500.toString(),
          pricePerLitre: (data.prices.volume500 / 500).toString(),
          postcode: data.location.substring(0, 100)
        },
        {
          supplierId: supplierId!,
          volume: 900,
          price: data.prices.volume900.toString(),
          pricePerLitre: (data.prices.volume900 / 900).toString(),
          postcode: data.location.substring(0, 100)
        }
      ];
      
      for (const priceEntry of priceData) {
        try {
          await storage.insertOilPrice(priceEntry);
          console.log(`[Consumer Council] Added ${priceEntry.volume}L price for ${data.location}: £${priceEntry.price}`);
        } catch (error) {
          console.error(`[Consumer Council] Failed to insert price for ${data.location}:`, error);
        }
      }
    }
    
<<<<<<< HEAD
    console.log('[Consumer Council] Data scraping completed successfully');
=======
    // --- CACHE POPULATION LOGIC ---
    if (locationData.length > 0) {
      // Flatten all price entries for all locations into a single array
      const cacheEntries = locationData.flatMap((data, idx) => {
        return [
          {
            id: idx * 3 + 1,
            supplierId: idx + 1,
            volume: 300,
            price: data.prices.volume300.toFixed(2),
            pricePerLitre: (data.prices.volume300 / 300).toFixed(3),
            includesVat: true,
            postcode: data.location,
            createdAt: new Date(),
            supplier: {
              id: idx + 1,
              name: `${data.council} - Average Prices`,
              location: `${data.location}, ${data.council}`,
              phone: '',
              website: 'https://www.consumercouncil.org.uk',
              coverageAreas: data.council,
              rating: '5.0',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            id: idx * 3 + 2,
            supplierId: idx + 1,
            volume: 500,
            price: data.prices.volume500.toFixed(2),
            pricePerLitre: (data.prices.volume500 / 500).toFixed(3),
            includesVat: true,
            postcode: data.location,
            createdAt: new Date(),
            supplier: {
              id: idx + 1,
              name: `${data.council} - Average Prices`,
              location: `${data.location}, ${data.council}`,
              phone: '',
              website: 'https://www.consumercouncil.org.uk',
              coverageAreas: data.council,
              rating: '5.0',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            id: idx * 3 + 3,
            supplierId: idx + 1,
            volume: 900,
            price: data.prices.volume900.toFixed(2),
            pricePerLitre: (data.prices.volume900 / 900).toFixed(3),
            includesVat: true,
            postcode: data.location,
            createdAt: new Date(),
            supplier: {
              id: idx + 1,
              name: `${data.council} - Average Prices`,
              location: `${data.location}, ${data.council}`,
              phone: '',
              website: 'https://www.consumercouncil.org.uk',
              coverageAreas: data.council,
              rating: '5.0',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        ];
      });
      fs.writeFileSync(CACHE_PATH, JSON.stringify(cacheEntries, null, 2));
      console.log(`Wrote ${cacheEntries.length} price entries to local cache.`);
    }
    
    console.log('Consumer Council data scraping completed successfully');
>>>>>>> cursor/analyze-competitor-ux-for-improvements-6c0f
    
  } catch (error) {
    console.error('[Consumer Council] Failed to scrape data:', error);
    throw error;
  }
}

export async function initializeConsumerCouncilScraping(): Promise<void> {
  try {
    console.log('[Consumer Council] Initializing weekly scraping system...');
    
    // Run initial scrape
    await scrapeLatestConsumerCouncilData();
    
    // Set up weekly scraping (every Monday at 3 AM)
    const scheduleWeeklyConsumerCouncilScrape = () => {
      const now = new Date();
      const nextMonday = new Date(now);
      
      // Calculate days until next Monday
      const daysUntilMonday = (8 - now.getDay()) % 7 || 7; // If it's Monday, wait 7 days
      nextMonday.setDate(now.getDate() + daysUntilMonday);
      nextMonday.setHours(3, 0, 0, 0); // 3 AM
      
      // If the calculated time is in the past, add 7 days
      if (nextMonday.getTime() <= now.getTime()) {
        nextMonday.setDate(nextMonday.getDate() + 7);
      }
      
      const timeUntilScrape = Math.min(nextMonday.getTime() - now.getTime(), 2147483647); // Cap at max 32-bit integer
      
      console.log(`[Consumer Council] Next scrape scheduled for: ${nextMonday.toLocaleString()}`);
      
      setTimeout(async () => {
        try {
          console.log('[Consumer Council] Running weekly data update...');
          await scrapeLatestConsumerCouncilData();
          scheduleWeeklyConsumerCouncilScrape(); // Schedule next week
        } catch (error) {
          console.error('[Consumer Council] Weekly scraping failed:', error);
          scheduleWeeklyConsumerCouncilScrape(); // Try again next week
        }
      }, timeUntilScrape);
    };
    
    scheduleWeeklyConsumerCouncilScrape();
    console.log('[Consumer Council] Weekly scraping system initialized successfully');
    console.log('[Consumer Council] NOTE: ScrapingBee API usage is conservative - only 1 request per week');
    
  } catch (error) {
    console.error('[Consumer Council] Failed to initialize scraping:', error);
  }
}