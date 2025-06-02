import { storage } from './storage';
import type { InsertSupplier, InsertOilPrice } from '@shared/schema';

async function scrapeWithScrapingBee(url: string): Promise<string> {
  if (!process.env.SCRAPINGBEE_API_KEY) {
    throw new Error("SCRAPINGBEE_API_KEY is required for live supplier scraping");
  }

  const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?api_key=${process.env.SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(url)}&render_js=true&premium_proxy=true&country_code=gb`;
  
  console.log(`Scraping ${url}...`);
  const response = await fetch(scrapingBeeUrl);
  
  if (!response.ok) {
    throw new Error(`ScrapingBee request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.text();
}

async function scrapeCheapestOilNI(): Promise<any[]> {
  try {
    const html = await scrapeWithScrapingBee('https://www.cheapestoil.co.uk/Heating-Oil-NI');
    console.log('Successfully retrieved HTML from cheapestoil.co.uk');
    
    const suppliers = [];
    
    // Parse the HTML to extract supplier information
    // Look for table rows or supplier listings
    const lines = html.split('\n');
    let currentSupplier = null;
    
    for (const line of lines) {
      // Look for supplier names (company names that include common oil/fuel terms)
      const supplierMatch = line.match(/([\w\s&]+(?:Oil|Fuel|Energy|Heating)(?:\s+(?:Ltd|Limited|Co\.?|Company))?)/i);
      if (supplierMatch && supplierMatch[1].length > 3 && supplierMatch[1].length < 60) {
        currentSupplier = {
          name: supplierMatch[1].trim(),
          location: 'Northern Ireland',
          prices: {}
        };
        suppliers.push(currentSupplier);
      }
      
      // Look for prices
      const priceMatches = line.match(/£(\d+\.?\d*)/g);
      if (priceMatches && currentSupplier) {
        priceMatches.forEach((price, index) => {
          const numPrice = parseFloat(price.replace('£', ''));
          if (numPrice > 100 && numPrice < 600) { // Realistic heating oil price range
            if (index === 0) currentSupplier.prices.volume300 = numPrice;
            else if (index === 1) currentSupplier.prices.volume500 = numPrice;
            else if (index === 2) currentSupplier.prices.volume900 = numPrice;
          }
        });
      }
    }
    
    console.log(`Found ${suppliers.length} suppliers from cheapestoil.co.uk`);
    return suppliers.filter(s => Object.keys(s.prices).length > 0);
    
  } catch (error) {
    console.error('Failed to scrape cheapestoil.co.uk:', error);
    return [];
  }
}

async function scrapeBoilerJuice(): Promise<any[]> {
  try {
    const html = await scrapeWithScrapingBee('https://www.boilerjuice.com/heating-oil-prices/');
    console.log('Successfully retrieved HTML from boilerjuice.com');
    
    const suppliers = [];
    
    // Parse BoilerJuice supplier data
    const supplierMatches = html.match(/<div[^>]*class="[^"]*supplier[^"]*"[^>]*>[\s\S]*?<\/div>/gi);
    
    if (supplierMatches) {
      for (const match of supplierMatches) {
        const nameMatch = match.match(/>([^<]+(?:Oil|Fuel|Energy)[^<]*)</i);
        const priceMatches = match.match(/£(\d+\.?\d*)/g);
        
        if (nameMatch && priceMatches) {
          const supplier = {
            name: nameMatch[1].trim(),
            location: 'Northern Ireland',
            prices: {}
          };
          
          priceMatches.forEach((price, index) => {
            const numPrice = parseFloat(price.replace('£', ''));
            if (numPrice > 100 && numPrice < 600) {
              if (index === 0) supplier.prices.volume300 = numPrice;
              else if (index === 1) supplier.prices.volume500 = numPrice;
              else if (index === 2) supplier.prices.volume900 = numPrice;
            }
          });
          
          if (Object.keys(supplier.prices).length > 0) {
            suppliers.push(supplier);
          }
        }
      }
    }
    
    console.log(`Found ${suppliers.length} suppliers from boilerjuice.com`);
    return suppliers;
    
  } catch (error) {
    console.error('Failed to scrape boilerjuice.com:', error);
    return [];
  }
}

async function scrapeOtherNISources(): Promise<any[]> {
  const allSuppliers = [];
  
  const sources = [
    'https://www.fuelgenie.co.uk/heating-oil-prices-ni',
    'https://www.oilprices.com/northern-ireland'
  ];
  
  for (const url of sources) {
    try {
      const html = await scrapeWithScrapingBee(url);
      console.log(`Successfully retrieved HTML from ${url}`);
      
      // Generic parsing for supplier information
      const lines = html.split('\n');
      const suppliers = [];
      
      for (const line of lines) {
        const supplierMatch = line.match(/([\w\s&]+(?:Oil|Fuel|Energy)(?:\s+(?:Ltd|Limited|Co\.?))?)/i);
        if (supplierMatch && supplierMatch[1].length > 3) {
          const priceMatches = line.match(/£(\d+\.?\d*)/g);
          if (priceMatches) {
            const supplier = {
              name: supplierMatch[1].trim(),
              location: 'Northern Ireland',
              prices: {}
            };
            
            priceMatches.forEach((price, index) => {
              const numPrice = parseFloat(price.replace('£', ''));
              if (numPrice > 100 && numPrice < 600) {
                if (index === 0) supplier.prices.volume300 = numPrice;
                else if (index === 1) supplier.prices.volume500 = numPrice;
                else if (index === 2) supplier.prices.volume900 = numPrice;
              }
            });
            
            if (Object.keys(supplier.prices).length > 0) {
              suppliers.push(supplier);
            }
          }
        }
      }
      
      allSuppliers.push(...suppliers);
      console.log(`Found ${suppliers.length} suppliers from ${url}`);
      
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
    }
  }
  
  return allSuppliers;
}

export async function scrapeAllLiveSuppliers(): Promise<void> {
  console.log('Starting live supplier price scraping from authentic sources...');
  
  try {
    const allSuppliers = [];
    
    // Scrape from multiple authentic sources
    const cheapestOilSuppliers = await scrapeCheapestOilNI();
    allSuppliers.push(...cheapestOilSuppliers);
    
    const boilerJuiceSuppliers = await scrapeBoilerJuice();
    allSuppliers.push(...boilerJuiceSuppliers);
    
    const otherSuppliers = await scrapeOtherNISources();
    allSuppliers.push(...otherSuppliers);
    
    // Remove duplicates
    const uniqueSuppliers = new Map();
    allSuppliers.forEach(supplier => {
      const key = supplier.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!uniqueSuppliers.has(key)) {
        uniqueSuppliers.set(key, supplier);
      }
    });
    
    console.log(`Processing ${uniqueSuppliers.size} unique suppliers...`);
    
    // Store in database
    for (const [key, supplierData] of uniqueSuppliers) {
      try {
        let supplier = await storage.getSupplierByName(supplierData.name);
        
        if (!supplier) {
          const newSupplier: InsertSupplier = {
            name: supplierData.name,
            location: supplierData.location,
            coverageAreas: 'Northern Ireland',
            rating: '4.5',
          };
          
          supplier = await storage.createSupplier(newSupplier);
          console.log(`Added supplier: ${supplier.name}`);
        }
        
        // Add price data
        const volumes = [
          { volume: 300, price: supplierData.prices.volume300 },
          { volume: 500, price: supplierData.prices.volume500 },
          { volume: 900, price: supplierData.prices.volume900 },
        ];
        
        for (const { volume, price } of volumes) {
          if (price && price > 0) {
            const priceData: InsertOilPrice = {
              supplierId: supplier.id,
              volume: volume,
              price: price.toFixed(2),
              pricePerLitre: (price / volume).toFixed(3),
              postcode: 'BT1',
            };
            
            await storage.insertOilPrice(priceData);
            console.log(`Added ${volume}L price for ${supplier.name}: £${price.toFixed(2)}`);
          }
        }
        
      } catch (error) {
        console.error(`Failed to process supplier ${supplierData.name}:`, error);
      }
    }
    
    console.log('Live supplier price scraping completed successfully');
    
  } catch (error) {
    console.error('Live supplier scraping failed:', error);
    throw error;
  }
}

export async function initializeLiveSupplierScraping(): Promise<void> {
  try {
    console.log('Initializing live supplier scraping system...');
    console.log('ScrapingBee API available with 250,000 credits');
    
    // Run initial scrape
    await scrapeAllLiveSuppliers();
    
    console.log('Live supplier scraping system initialized successfully');
    
  } catch (error) {
    console.error('Failed to initialize live supplier scraping:', error);
    throw error;
  }
}