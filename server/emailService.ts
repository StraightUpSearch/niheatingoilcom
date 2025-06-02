import sgMail from '@sendgrid/mail';
import type { Lead } from '@shared/schema';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailTemplates {
  adminNotification: (lead: Lead) => {
    to: string;
    from: string;
    subject: string;
    html: string;
  };
  customerConfirmation: (lead: Lead) => {
    to: string;
    from: string;
    subject: string;
    html: string;
  };
}

const ADMIN_EMAIL = 'jamie@straightupsearch.com';
const FROM_EMAIL = 'jamie@straightupsearch.com';

const emailTemplates: EmailTemplates = {
  adminNotification: (lead: Lead) => ({
    to: ADMIN_EMAIL,
    from: FROM_EMAIL,
    subject: `🔥 New Heating Oil Lead - ${lead.name} (${lead.volume}L)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">🔥 New Heating Oil Lead</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">From NI Heating Oil Platform</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
          <h3 style="color: #1e40af; margin-top: 0;">Customer Details</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
            <p><strong>Postcode:</strong> ${lead.postcode}</p>
          </div>

          <h3 style="color: #1e40af;">Order Requirements</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <p><strong>Volume:</strong> ${lead.volume}L</p>
            <p><strong>Urgency:</strong> ${lead.urgency || 'Not specified'}</p>
            ${lead.supplierName ? `<p><strong>Preferred Supplier:</strong> ${lead.supplierName}</p>` : ''}
            ${lead.supplierPrice ? `<p><strong>Price Quoted:</strong> £${lead.supplierPrice}</p>` : ''}
          </div>

          ${lead.notes ? `
            <h3 style="color: #1e40af;">Additional Notes</h3>
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
              <p style="white-space: pre-wrap;">${lead.notes}</p>
            </div>
          ` : ''}

          <div style="background: #dbeafe; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; color: #1e40af;"><strong>⏰ Lead received:</strong> ${new Date(lead.createdAt!).toLocaleString('en-GB')}</p>
          </div>
        </div>
        
        <div style="background: #1e40af; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; font-size: 14px;">Contact this customer within 2 hours for best conversion rates</p>
        </div>
      </div>
    `
  }),

  customerConfirmation: (lead: Lead) => ({
    to: lead.email,
    from: FROM_EMAIL,
    subject: 'Your Heating Oil Quote Request - NI Heating Oil',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">Thank You, ${lead.name}!</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Your heating oil quote request has been received</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
          <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
            <p style="margin: 0; color: #15803d;"><strong>✅ Request Confirmed</strong></p>
            <p style="margin: 5px 0 0 0; color: #15803d;">We'll contact you within 2 hours with personalized quotes</p>
          </div>

          <h3 style="color: #1e40af; margin-top: 0;">Your Request Details</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <p><strong>Volume:</strong> ${lead.volume} litres</p>
            <p><strong>Delivery Area:</strong> ${lead.postcode}</p>
            <p><strong>Contact:</strong> ${lead.phone}</p>
            ${lead.urgency ? `<p><strong>Urgency:</strong> ${lead.urgency}</p>` : ''}
          </div>

          <h3 style="color: #1e40af;">What Happens Next?</h3>
          <div style="background: white; padding: 15px; border-radius: 6px;">
            <ol style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Our heating oil specialist will contact you within 2 hours</li>
              <li style="margin-bottom: 8px;">We'll provide competitive quotes from verified Northern Ireland suppliers</li>
              <li style="margin-bottom: 8px;">You'll receive delivery options and pricing tailored to your postcode</li>
              <li>Book your delivery directly with your chosen supplier</li>
            </ol>
          </div>

          <div style="background: #dbeafe; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; margin-top: 20px;">
            <p style="margin: 0; color: #1e40af;"><strong>💡 Tip:</strong> Keep your phone nearby - our specialists typically contact customers within 1 hour during business hours.</p>
          </div>
        </div>
        
        <div style="background: #1e40af; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; font-size: 14px;">NI Heating Oil - Northern Ireland's trusted price comparison platform</p>
        </div>
      </div>
    `
  })
};

export async function sendLeadNotifications(lead: Lead): Promise<void> {
  try {
    const adminEmail = emailTemplates.adminNotification(lead);
    const customerEmail = emailTemplates.customerConfirmation(lead);

    // Send both emails
    await Promise.all([
      sgMail.send(adminEmail),
      sgMail.send(customerEmail)
    ]);

    console.log(`Lead notifications sent successfully for ${lead.name} (${lead.email})`);
  } catch (error) {
    console.error('Failed to send lead notifications:', error);
    throw error;
  }
}

export async function sendAdminAlert(lead: Lead): Promise<void> {
  try {
    const adminEmail = emailTemplates.adminNotification(lead);
    await sgMail.send(adminEmail);
    console.log(`Admin alert sent for lead: ${lead.name}`);
  } catch (error) {
    console.error('Failed to send admin alert:', error);
    throw error;
  }
}