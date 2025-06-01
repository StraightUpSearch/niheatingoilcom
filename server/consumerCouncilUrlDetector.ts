import { storage } from './storage';

interface ConsumerCouncilUrlEntry {
  url: string;
  weekDate: string;
  isActive: boolean;
  lastChecked: Date;
}

class ConsumerCouncilUrlDetector {
  private baseUrl = 'https://www.consumercouncil.org.uk/home-heating/price-checker';
  private currentActiveUrl = 'https://www.consumercouncil.org.uk/home-heating/price-checker/29-may-2025';
  
  async findLatestWeeklyUrl(): Promise<string | null> {
    if (!process.env.SCRAPINGBEE_API_KEY) {
      console.error("SCRAPINGBEE_API_KEY is required for Consumer Council URL detection");
      return null;
    }

    try {
      // Get the main price checker page to find latest weekly links
      const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?api_key=${process.env.SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(this.baseUrl)}&render_js=false&premium_proxy=false&country_code=GB`;
      
      const response = await fetch(scrapingBeeUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch Consumer Council page: ${response.status}`);
      }
      
      const html = await response.text();
      
      // Look for weekly price checker links with date patterns
      const weeklyUrlPatterns = [
        /\/home-heating\/price-checker\/(\d{1,2}-[a-z]+-\d{4})/gi,
        /href="([^"]*home-heating\/price-checker\/[^"]*\d{4}[^"]*)"/gi
      ];
      
      const foundUrls: string[] = [];
      
      for (const pattern of weeklyUrlPatterns) {
        const matches = [...html.matchAll(pattern)];
        matches.forEach(match => {
          const url = match[1].startsWith('http') ? match[1] : `https://www.consumercouncil.org.uk${match[1]}`;
          if (!foundUrls.includes(url)) {
            foundUrls.push(url);
          }
        });
      }
      
      // Sort URLs by date (most recent first)
      const sortedUrls = foundUrls.sort((a, b) => {
        const dateA = this.extractDateFromUrl(a);
        const dateB = this.extractDateFromUrl(b);
        return dateB.getTime() - dateA.getTime();
      });
      
      return sortedUrls[0] || null;
      
    } catch (error) {
      console.error('Failed to detect latest Consumer Council URL:', error);
      return null;
    }
  }
  
  private extractDateFromUrl(url: string): Date {
    // Extract date from URLs like "29-may-2025"
    const dateMatch = url.match(/(\d{1,2})-([a-z]+)-(\d{4})/i);
    if (dateMatch) {
      const [, day, monthName, year] = dateMatch;
      const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                         'july', 'august', 'september', 'october', 'november', 'december'];
      const month = monthNames.findIndex(m => m.startsWith(monthName.toLowerCase()));
      return new Date(parseInt(year), month, parseInt(day));
    }
    return new Date(0); // Default to epoch if parsing fails
  }
  
  async checkForNewWeeklyData(): Promise<boolean> {
    console.log('Checking for new Consumer Council weekly data...');
    
    try {
      const latestUrl = await this.findLatestWeeklyUrl();
      
      if (!latestUrl) {
        console.log('No new weekly URL found, using current URL');
        return false;
      }
      
      if (latestUrl !== this.currentActiveUrl) {
        console.log(`New weekly data found: ${latestUrl}`);
        this.currentActiveUrl = latestUrl;
        
        // Test if the new URL contains valid data
        const hasValidData = await this.validateWeeklyUrl(latestUrl);
        
        if (hasValidData) {
          console.log(`Validated new weekly data URL: ${latestUrl}`);
          return true;
        } else {
          console.log(`New URL contains no valid data yet: ${latestUrl}`);
          return false;
        }
      }
      
      return false;
      
    } catch (error) {
      console.error('Error checking for new weekly data:', error);
      return false;
    }
  }
  
  private async validateWeeklyUrl(url: string): Promise<boolean> {
    if (!process.env.SCRAPINGBEE_API_KEY) {
      return false;
    }

    try {
      const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?api_key=${process.env.SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(url)}&render_js=false&premium_proxy=false&country_code=GB`;
      
      const response = await fetch(scrapingBeeUrl);
      if (!response.ok) {
        return false;
      }
      
      const html = await response.text();
      
      // Check if the page contains heating oil price data
      const hasOilPrices = html.includes('300 litres') || 
                          html.includes('500 litres') || 
                          html.includes('900 litres') ||
                          /£\d+\.\d{2}/.test(html);
      
      return hasOilPrices;
      
    } catch (error) {
      console.error(`Failed to validate URL ${url}:`, error);
      return false;
    }
  }
  
  getCurrentActiveUrl(): string {
    return this.currentActiveUrl;
  }
  
  getSourceAttribution(): string {
    const urlDate = this.extractDateFromUrl(this.currentActiveUrl);
    const formattedDate = urlDate.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    return `Source: Consumer Council for Northern Ireland official weekly data (${formattedDate})`;
  }
}

export const consumerCouncilUrlDetector = new ConsumerCouncilUrlDetector();

export async function initializeWeeklyUrlDetection(): Promise<void> {
  try {
    console.log('Initializing Consumer Council weekly URL detection...');
    
    // Check immediately on startup
    await consumerCouncilUrlDetector.checkForNewWeeklyData();
    
    // Schedule weekly checks every Thursday at 2 PM (when Consumer Council typically updates)
    const scheduleWeeklyCheck = () => {
      const now = new Date();
      const nextThursday = new Date();
      nextThursday.setDate(now.getDate() + (4 - now.getDay() + 7) % 7); // Next Thursday
      nextThursday.setHours(14, 0, 0, 0); // 2 PM
      
      if (nextThursday <= now) {
        nextThursday.setDate(nextThursday.getDate() + 7); // Next week if Thursday passed
      }
      
      const timeUntilNextCheck = nextThursday.getTime() - now.getTime();
      
      setTimeout(async () => {
        await consumerCouncilUrlDetector.checkForNewWeeklyData();
        
        // Schedule the next weekly check
        setInterval(async () => {
          await consumerCouncilUrlDetector.checkForNewWeeklyData();
        }, 7 * 24 * 60 * 60 * 1000); // Every 7 days
        
      }, timeUntilNextCheck);
      
      console.log(`Next Consumer Council URL check scheduled for: ${nextThursday.toLocaleString()}`);
    };
    
    scheduleWeeklyCheck();
    
    console.log('Consumer Council weekly URL detection initialized successfully');
    
  } catch (error) {
    console.error('Failed to initialize weekly URL detection:', error);
    throw error;
  }
}