import { storage } from "./storage";
import { sendLeadNotifications } from "./emailService";
import type { InsertLead } from "@shared/schema";

export class TicketService {
  private static ticketCounter = 0;

  static generateTicketId(): string {
    this.ticketCounter += 1;
    return `NIHO-${this.ticketCounter.toString().padStart(4, '0')}`;
  }

  static validatePostcode(postcode: string): boolean {
    // Northern Ireland BT postcode validation
    const btPattern = /^BT\d{1,2}\s?\d[A-Z]{2}$/i;
    return btPattern.test(postcode.trim());
  }

  static async createEnquiry(data: {
    name: string;
    email: string;
    postcode: string;
    litres: number;
  }) {
    // Validate postcode
    if (!this.validatePostcode(data.postcode)) {
      throw new Error("Invalid Northern Ireland postcode. Please use BT format (e.g., BT1 1AA)");
    }

    // Generate unique ticket ID
    const ticketId = this.generateTicketId();

    // Create lead with ticket ID in notes field
    const leadData: InsertLead = {
      name: data.name,
      email: data.email,
      phone: "", // Will be collected later if needed
      postcode: data.postcode.toUpperCase(),
      volume: data.litres,
      notes: `Ticket ID: ${ticketId}`,
      status: "new",
      urgency: "normal"
    };

    const lead = await storage.createLead(leadData);

    // Send notifications
    await sendLeadNotifications(lead);
    
    // Send specialist notification
    await this.notifySpecialist(ticketId, data);

    return {
      ticketId,
      lead,
      message: "Enquiry received successfully"
    };
  }

  static async notifySpecialist(ticketId: string, data: {
    name: string;
    email: string;
    postcode: string;
    litres: number;
  }) {
    // Send notification to jamie@straightupsearch.com
    const specialistEmail = {
      to: "jamie@straightupsearch.com",
      from: "noreply@niheatingoil.com",
      subject: `New Heating Oil Enquiry - ${ticketId}`,
      html: `
        <h2>New Heating Oil Enquiry</h2>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Customer:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Postcode:</strong> ${data.postcode}</p>
        <p><strong>Litres Required:</strong> ${data.litres}L</p>
        <p><strong>Created:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
        
        <h3>Next Steps:</h3>
        <ol>
          <li>Review local suppliers for ${data.postcode}</li>
          <li>Prepare quote with best available rates</li>
          <li>Respond within 2 hours</li>
        </ol>
        
        <p><em>This enquiry was generated from niheatingoil.com</em></p>
      `
    };

    // Here you would send the email using SendGrid
    console.log("Specialist notification:", specialistEmail);
  }

  static async getBestQuote(postcode: string, litres: number) {
    // Get best available prices for the postcode and volume
    const prices = await storage.getLatestPrices(litres, postcode);
    
    if (prices.length === 0) {
      return null;
    }

    // Find the best price
    const bestPrice = prices.reduce((best, current) => 
      current.price < best.price ? current : best
    );

    const totalCost = parseFloat(bestPrice.price.toString()) * litres;
    
    // Calculate potential savings vs average
    const allPrices = await storage.getLatestPrices(litres);
    const averagePrice = allPrices.reduce((sum, p) => sum + parseFloat(p.price.toString()), 0) / allPrices.length;
    const savings = (averagePrice * litres) - totalCost;

    return {
      supplier: bestPrice.supplier,
      pricePerLitre: parseFloat(bestPrice.price.toString()),
      totalCost: totalCost,
      savings: Math.max(0, savings),
      volume: litres
    };
  }

  static async updateLeadWithQuote(leadId: number, quote: any) {
    const lead = await storage.updateLeadStatus(leadId, "quoted");
    
    // Send quote ready notification to customer
    await this.sendQuoteReadyEmail(lead, quote);
    
    return lead;
  }

  static async sendQuoteReadyEmail(lead: any, quote: any) {
    const ticketId = lead.notes?.match(/Ticket ID: (NIHO-\d+)/)?.[1] || "Unknown";
    
    const customerEmail = {
      to: lead.email,
      from: "noreply@niheatingoil.com",
      subject: `Your heating oil quote is ready - ${ticketId}`,
      html: `
        <h2>Your Heating Oil Quote is Ready!</h2>
        
        <p>Hi ${lead.name},</p>
        
        <p>Great news! We've found the best rates for your heating oil delivery in ${lead.postcode}.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Quote Details - ${ticketId}</h3>
          <p><strong>Supplier:</strong> ${quote.supplier.name}</p>
          <p><strong>Volume:</strong> ${quote.volume} litres</p>
          <p><strong>Price per litre:</strong> £${quote.pricePerLitre.toFixed(3)}</p>
          <p><strong>Total cost:</strong> £${quote.totalCost.toFixed(2)}</p>
          ${quote.savings > 0 ? `<p style="color: green;"><strong>Your savings:</strong> £${quote.savings.toFixed(2)}</strong></p>` : ''}
        </div>
        
        <p>To proceed with this order, simply reply to this email or call us directly.</p>
        
        <p><strong>Why choose us:</strong></p>
        <ul>
          <li>✓ Best rates guaranteed</li>
          <li>✓ Local Northern Ireland suppliers</li>
          <li>✓ Fast delivery service</li>
          <li>✓ No hidden fees</li>
        </ul>
        
        <p>Create a free account to track your orders and set price alerts: <a href="https://niheatingoil.com/auth">Sign up here</a></p>
        
        <p>Best regards,<br>
        NI Heating Oil Team<br>
        <em>By locals, for locals</em></p>
      `
    };

    console.log("Quote ready email:", customerEmail);
  }
}