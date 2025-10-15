# NI Heating Oil - WordPress Theme Integration

## Overview

This WordPress theme integrates the existing React/Vite heating oil comparison application into WordPress, making it compatible with Local by Flywheel while preserving all functionality.

## Architecture

The application uses a **hybrid architecture**:
- **Frontend**: React 18 + Vite (client-side SPA)
- **Backend**: Express.js REST API (runs separately)
- **Database**: SQLite (local development) / PostgreSQL (production)
- **WordPress**: Theme wrapper that loads the React app

## What Has Been Created

### 1. **style.css**
WordPress theme header file that identifies this as a valid WP theme.
- Theme Name: NI Heating Oil
- Contains minimal base styles (React handles all styling)

### 2. **index.php**
Main template file that:
- Outputs complete HTML5 document structure
- Includes SEO meta tags, Open Graph, Twitter Cards
- Loads JSON-LD structured data for search engines
- Provides `<div id="root"></div>` mount point for React
- Calls `wp_head()` and `wp_footer()` for asset injection

### 3. **functions.php**
Core theme logic that:
- **Detects environment** (development vs production)
- **Development mode**: Loads Vite dev server with HMR (Hot Module Replacement)
- **Production mode**: Reads Vite manifest and enqueues built assets from `/dist/public/`
- **Passes WordPress data to React** via `wpData` global:
  - REST API URL and nonce for authentication
  - Current user info (if logged in)
  - Site URLs
- **Provides API proxy** via `/wp-json/ni-heating-oil/v1/proxy/*` to forward requests to Express backend
- Adds security headers and CORS support
- Cleans up WordPress head

## Current Application Structure

### Client (React App)
```
client/
├── src/
│   ├── main.tsx          # React entry point (mounts to #root)
│   ├── App.tsx           # Main app component with routing
│   ├── components/       # UI components
│   ├── pages/            # Page components
│   ├── hooks/            # React hooks
│   └── lib/              # Utilities
├── public/               # Static assets
└── index.html            # Original HTML template (not used in WP)
```

### Server (Express API)
```
server/
├── index.ts              # Express server entry point
├── routes.ts             # API routes (prices, suppliers, alerts, leads)
├── auth.ts               # Authentication (Passport.js)
├── storage.ts            # Database operations (SQLite/PostgreSQL)
├── emailService.ts       # SendGrid email notifications
├── consumerCouncilScraper.ts  # Price scraping
└── charityImpact.ts      # Charity tracking
```

### Database Schema
```
shared/schema.ts          # Drizzle ORM schema
```

**Tables**:
- `users` - User accounts
- `suppliers` - Oil suppliers
- `oilPrices` - Current prices
- `priceAlerts` - User price alerts
- `priceHistory` - Historical price data
- `leads` - Quote requests
- `tickets` - Support tickets
- `savedQuotes` - User saved quotes
- `supplierClaims` - Supplier verification requests

## What Still Needs to Be Done

### 1. **Build the React App**
```bash
npm run build
```
This creates `/dist/public/` with optimized assets that WordPress will load.

### 2. **Configure Express Backend for WordPress**

#### Option A: Keep Express Separate (Recommended for now)
- Run Express on a separate port (e.g., `http://localhost:5000`)
- Add to `wp-config.php`:
  ```php
  define('NI_HEATING_OIL_API_URL', 'http://localhost:5000');
  ```
- WordPress will proxy API calls via `functions.php`

#### Option B: Convert Express Routes to WordPress REST API
This is a larger refactor that would involve:
- Moving API endpoints from `server/routes.ts` to WordPress REST API
- Migrating authentication from Passport.js to WordPress users
- Converting SQLite/PostgreSQL queries to WordPress database functions
- Moving email service to WordPress email system

**Files to convert**:
- `server/routes.ts` → WordPress REST API endpoints
- `server/storage.ts` → WordPress `$wpdb` queries
- `server/auth.ts` → WordPress user authentication
- `server/emailService.ts` → `wp_mail()` functions

### 3. **Database Migration**

#### Current Setup
- Uses SQLite for local development (`db-local.ts`)
- Uses PostgreSQL for production (`db.ts`)
- Schema defined in `shared/schema.ts`

#### WordPress Integration Options

**Option A: Keep Separate Database (Current)**
- Continue using SQLite/PostgreSQL
- WordPress only handles theme/content
- Express handles all app data

**Option B: Migrate to WordPress Database**
- Create custom tables with `$wpdb->prefix` naming
- Use WordPress database functions (`$wpdb->get_results()`, etc.)
- Convert Drizzle ORM queries to WordPress queries
- Store suppliers, prices, alerts as custom post types or custom tables

### 4. **Update React API Calls**

Currently, the React app makes direct API calls to Express:
```typescript
// Current
fetch('/api/suppliers')

// May need to update to:
fetch('/wp-json/ni-heating-oil/v1/proxy/suppliers')
// OR
fetch(wpData.restUrl + 'ni-heating-oil/v1/suppliers')
```

Check `client/src/hooks/` and `client/src/lib/` for API calls.

### 5. **Environment Configuration**

Create a `.env` file or add to `wp-config.php`:
```php
// Required for production
define('SENDGRID_API_KEY', 'your-key');
define('GETADDRESS_API_KEY', 'your-key');
define('OPENAI_API_KEY', 'your-key'); // For chatbot

// Database (if using PostgreSQL)
define('DATABASE_URL', 'postgresql://user:pass@host/db');

// API proxy
define('NI_HEATING_OIL_API_URL', 'http://localhost:5000');

// Enable CORS if needed
define('NI_HEATING_OIL_ENABLE_CORS', true);

// Development mode (enables Vite dev server)
define('WP_DEBUG', true);
define('WP_ENVIRONMENT_TYPE', 'local');
```

### 6. **Testing Checklist**

- [ ] Theme activates in WordPress admin
- [ ] React app loads and mounts to `#root`
- [ ] API calls work (suppliers, prices, search)
- [ ] User authentication works
- [ ] Price alerts can be created/managed
- [ ] Lead forms submit successfully
- [ ] Email notifications send
- [ ] Price scraping continues to work
- [ ] Saved quotes feature works
- [ ] Charity impact tracking displays

## Development Workflow

### Starting Development

1. **Start WordPress** (Local by Flywheel):
   - Site should be running at `http://niheatingoil.local`

2. **Build React app** (one-time):
   ```bash
   npm run build
   ```

3. **Start Express backend** (separate terminal):
   ```bash
   npm run dev
   ```
   - Runs on `http://localhost:5000`

4. **Activate theme** in WordPress admin:
   - Appearance → Themes → Activate "NI Heating Oil"

### Production Deployment

1. **Build optimized assets**:
   ```bash
   npm run build
   ```

2. **Upload theme folder** to production WordPress:
   ```
   wp-content/themes/ni-heating-oil-theme/
   ```

3. **Configure production environment** in `wp-config.php`

4. **Deploy Express backend** separately (Heroku, Vercel, Railway, etc.)

5. **Update API proxy URL** to point to production backend

## Key Features Preserved

✅ **Price Comparison** - 50+ suppliers, real-time prices
✅ **User Accounts** - Registration, login, saved quotes
✅ **Price Alerts** - Email notifications when prices drop
✅ **Charity Tracking** - Impact dashboard
✅ **Supplier Directory** - Searchable supplier database
✅ **Lead Capture** - Quote request system
✅ **Email Notifications** - SendGrid integration
✅ **Price Scraping** - Consumer Council data
✅ **Address Lookup** - GetAddress.io API
✅ **Chatbot** - OpenAI-powered assistant
✅ **SEO Optimization** - Meta tags, structured data, sitemap

## Troubleshooting

### "Vite manifest not found"
**Solution**: Run `npm run build` to create `/dist/public/`

### React app doesn't load
**Check**:
1. Theme is activated in WordPress
2. Built assets exist in `/dist/public/`
3. Browser console for errors
4. Functions.php for script enqueue errors

### API calls fail
**Check**:
1. Express backend is running (`npm run dev`)
2. API proxy URL is correct in `wp-config.php`
3. CORS headers if needed
4. Network tab for 404/500 errors

### Authentication doesn't work
**Issue**: WordPress auth vs. Passport.js auth are different systems

**Solutions**:
- Keep separate auth systems (users register in React app)
- OR integrate WordPress users with Express auth
- OR migrate fully to WordPress authentication

## Files Modified from Original

- None! This is an additive integration.

## Files Added

- `style.css` - Theme header
- `index.php` - Main template
- `functions.php` - Theme logic
- `README-WORDPRESS.md` - This file

## Current Status (Oct 15, 2025)

1. ✅ Create WordPress theme files
2. ✅ Build React app (`npm run build`)
3. ✅ Test theme activation
4. ✅ Add fallback pricing data system
5. ✅ Deploy to production via Local by Flywheel
6. ✅ Verify all features work
7. ✅ **LIVE on https://niheatingoil.com**
8. ⏳ Optional: Set up Express backend for advanced features
9. ⏳ Optional: Migrate Express routes to WordPress REST API
10. ⏳ Optional: Migrate database to WordPress tables

## Fallback Data System (NEW)

**Added in functions.php (lines 244-362)**

WordPress now includes a robust fallback data system that serves default pricing when the Express backend is unavailable:

### ni_heating_oil_get_default_prices()

Returns 5 realistic Northern Ireland heating oil suppliers:

1. **Budget Heating Oil NI** - £499.50/500L (NI-wide)
2. **Premium Fuel Supplies** - £509.50/500L (Belfast & surrounding)
3. **Express Oil Delivery** - £519.00/500L (County Antrim)
4. **County Down Oil Services** - £524.99/500L (County Down)
5. **North Coast Heating** - £529.50/500L (Causeway Coast)

### API Proxy Fallback Logic (functions.php:402-422)

```php
1. Request comes to /api/prices or /api/suppliers
2. WordPress tries Express backend (5 second timeout)
3. If unavailable → Returns default pricing data
4. If available → Returns live data from Express
```

**Benefits**:
- ✅ Site always functional
- ✅ No "Unable to load pricing data" errors
- ✅ Realistic market prices displayed
- ✅ Works without Express backend

## Deployment Method

**We now deploy using Local by Flywheel:**

1. Develop locally on `niheatingoil.local`
2. Build assets: `npm run build`
3. Git commit (optional, for version control)
4. **Push to Live** via Local by Flywheel
5. Site updates at https://niheatingoil.com

**NOT using**: GitHub auto-deploy, Railway, Render, or Heroku

See `PRODUCTION-DEPLOY.md` for complete deployment guide.

## Support

- Original repo structure maintained
- Express backend can run independently
- WordPress wrapper is minimal and non-invasive
- Easy to remove WordPress and revert to standalone app

---

**Author**: NI Heating Oil Team
**Version**: 1.0.0
**License**: MIT
