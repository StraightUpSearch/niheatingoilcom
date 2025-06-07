# NI Heating Oil - Northern Ireland Heating Oil Price Comparison Platform

## Purpose
NI Heating Oil is a free, real-time price comparison platform designed to help Northern Ireland residents find the best deals on home heating oil. By aggregating live pricing from 50+ verified local suppliers and refreshing data every two hours, the platform ensures users see the most up-to-date, postcode-specific rates.

## Mission Statement
To keep Northern Ireland's homes warm, budgets intact, and communities connected by delivering a simple, reliable, and transparent tool for comparing heating oil prices—while using our platform to support those most vulnerable to fuel poverty.

## Goals
- **Transparency:** Provide a completely free service that surfaces current heating oil prices from multiple trusted suppliers
- **Savings:** Enable homeowners and businesses to compare 300L, 500L, and 900L quotes by BT postcode, eliminating guesswork and manual price-checking calls
- **Convenience:** Offer instant postcode-based quotes, price-drop alerts, and historical trend charts so users can make informed purchasing decisions
- **Community Impact:** Pledge 5% of profits to Simon Community NI's emergency heating-grant program, reinforcing our commitment to helping families in fuel hardship

## Monetization Strategy

### 1. Affiliate Partnerships & Referral Fees
- Earn a small commission on each completed order forwarded to partner suppliers
- Maintain full transparency: users always see the same "list price," with any referral fee built into supplier arrangements (no hidden markups)

### 2. Premium "Pro" Features (Freemium Upgrade)
- **Advanced Analytics & Forecasting:** AI-powered price forecasts and personalised "best-time-to-buy" notifications
- **Ad-Free Experience:** Remove all on-page ads or sponsored listings for power users
- **Group-Buy Coordination:** Facilitate collective buying ("Oil Club" style) with volume discounts for neighbourhood clusters
- Subscriptions priced at a modest monthly or annual rate to justify ongoing data-science enhancements

### 3. Sponsored Placement (Limited & Clearly Labeled)
- Allow suppliers to appear as "Recommended Partners" (marked clearly) for users who prefer direct ordering through our system
- Maintain a strict "no pay-for-position" policy in the core comparison table to protect user trust

### 4. Display & Content Ads (Optional & Non-Intrusive)
- Run Google-AdSense banners or relevant sponsored content in dedicated sections (e.g., blog posts, resource pages), rather than within the main price grid

## Key Features

### Real-Time Price Aggregation
- Scrape and ingest pricing data from all suppliers that publish BT-postcode quotes online
- Refresh data every two hours to ensure accuracy

### Postcode-Based Search & Quotes
- Simple input field prefilled with "BT" to restrict queries to Northern Ireland
- Display standard 300L, 500L, and 900L prices, with pence-per-litre breakdown

### Sortable Comparison Table
- Sort by price, supplier name, delivery area, or "last updated" timestamp
- Click-through links to supplier websites or "Get Quote" buttons for direct ordering

### Price Alerts & Notifications
- Email (and optional SMS/WhatsApp) alerts whenever a chosen postcode's price drops below a user-specified threshold
- One-click "Subscribe" call-to-action from the comparison results page

### Historical Trend Charts
- Interactive graphs displaying weekly, monthly, and yearly average price data
- Simple "Is now a good time to buy?" indicators based on AI-powered trend analysis

### User Accounts & Dashboard
- Users can register (name, email, password or magic link) to save preferences
- Dashboard shows:
  - Pending enquiries (Ticket IDs) and their status
  - Past quotes and orders (with estimated savings)
  - Active price alerts and tracking history
  - "Your Impact" widget showing how many heating grants they've funded

### "Your Impact" & Charity Integration
- Public "Giving Back" page explaining the 5% pledge to Simon Community NI
- Rolling "Grants Funded" counter (e.g., "Q2 2025: 20 grants funded, £1,000 donated")
- Seasonal "Winter Wish List" call-outs (October–February) linking directly to Simon Community NI's campaign page

### Social Sharing & Referral Tools
- One-click "Share on WhatsApp" for users to broadcast their quote details
- Track share events in Google Analytics (GA4) for ongoing optimization

## Technical Stack
- **Frontend**: React with TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite with Drizzle ORM
- **Authentication**: Passport.js with session management
- **Deployment**: Replit hosting platform
- **APIs**: Consumer Council NI data integration
- **Analytics**: Google Analytics 4 with Google Tag Manager

## Target Market
Northern Ireland households using heating oil (approximately 68% of NI homes use oil heating)

## Competitive Advantage
- Local expertise and focus on NI market
- Charitable giving component (5% pledge to Simon Community NI)
- Real-time pricing with guaranteed accuracy
- User-friendly mobile-first design
- Integration with local suppliers
- Complete transparency in pricing and referral arrangements

## Roadmap & Future Enhancements

### MVP Launch (Q3 2025)
- Core price comparison, user accounts, price alerts, and charity integration
- Basic social sharing and GA4 event tracking

### Enhanced AI Features (Q1 2026)
- Deploy predictive "Price Forecast" widget on the comparison page
- Offer personalised "Best Time to Buy" advice

### Group-Buy Coordination Module (Q2 2026)
- Allow users in proximate BT postcode clusters to opt into weekly group-buy
- Automated negotiation engine to match aggregated demand with supplier quotes

### Mobile App (Q4 2026)
- Native iOS/Android applications for on-the-go price comparisons
- Push notifications and voice-activated quote requests

### Expanded Charity Partnerships (Beyond 2026)
- Introduce additional local charities with separate pledge tracks
- User choice in directing their 5% pledge to preferred charity

## Changelog

- **Version 3.1** (latest):
  - Mock data fallback for summary cards and supplier cards in dev mode (no more £0.00 or 0 suppliers in dev)
  - Version badge in hero section now increments by 0.1 with each visual/UX change

## Oil Price Data Caching

- The system uses a local cache file (`data/oil_prices_cache.json`) to store the latest scraped oil price data for development and mock mode.
- If the cache is missing or older than 7 days, the system falls back to Consumer Council price averages to ensure realistic data is always shown.
- The cache is automatically read and written by the backend; no manual intervention is required unless you want to force a refresh (delete the cache file).
- This prevents excessive API calls and ensures the UI never displays zeroes or absurd numbers.
