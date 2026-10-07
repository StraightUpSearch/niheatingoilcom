# NI Heating Oil — SEO Build Tasks
_Delegated by the Brain from the SEO Manager audit (2026-10-06). Start here._

Read `brief-for-ranking-seo.txt` for full strategy context.
Full SEO Manager study files: `C:\Users\user\.codus\analyst-campaigns\3\study\`

---

## P0 — DONE ✅ (completed 2026-10-06)

All P0 items implemented in server/routes.ts and client/src/pages/landing.tsx.

---

## P0 — Original tasks (all quick fixes, ~2–3 hours total)

### 1. robots.txt — block spam + query params
Add to robots.txt:
```
User-agent: *
Disallow: /list/
Disallow: /results
```
`/list/` has hundreds of indexed spam URLs (German products, auto parts) — all 404 now but still eating crawl budget and diluting topical authority.
`/results` prevents Google indexing `/results?postcode=BT1&volume=500` parameter combinations.

### 2. Server — return 410 Gone for /list/* URLs
Configure Express to return HTTP 410 (not 404) for any `/list/*` path.
A 410 signals permanent removal to Google and clears the cache faster than a 404.
```js
app.use('/list', (req, res) => res.status(410).send('Gone'));
```

### 3. Sitemap — remove dead /supplier/* entries
The sitemap currently includes 10 `/supplier/[name]` URLs — ALL of them 404.
Remove them all from sitemap.xml immediately.
Do not re-add until the supplier pages are actually built.

### 4. Canonicals on /results pages
On every page served at `/results?postcode=X&volume=Y`, add:
```html
<link rel="canonical" href="https://niheatingoil.com/heating-oil-prices/[postcode-lowercase]/" />
<meta name="robots" content="noindex" />
```
This primes Google before the clean pages exist.

### 5. Homepage title + meta description
**Title:** `Heating Oil Prices NI — Compare Suppliers by BT Postcode | NI Heating Oil`
**Meta description:** `Compare live heating oil prices from NI suppliers by BT postcode. 300L, 500L and 900L quotes updated daily.`

The current "oil comparison ni" query sits at pos 7.6 with 391 impressions and only 0.51% CTR — fixing the title alone could 5–10x clicks from existing rankings immediately.

### 6. Organisation + WebSite schema (homepage)
Add to homepage `<head>`:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "NI Heating Oil",
  "url": "https://niheatingoil.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "14a Victoria Street",
    "addressLocality": "Ballymoney",
    "postalCode": "BT53 6DW",
    "addressCountry": "GB"
  },
  "telephone": "028 96005259"
}
```
Also add WebSite schema with sitelinks SearchAction.

---

## P1 — WEEK 1–2 — IN PROGRESS (started 2026-10-06)

### Completed P1 items:
- ✅ `/heating-oil-prices/:location` route already exists (HeatingOilLocation component)
- ✅ `/supplier/:supplierId` route added (alias for `/suppliers/:supplierId`)
- ✅ Sitemap now includes all key postcode pages, city pages, and dynamic supplier pages
- ✅ HeatingOilLocation: H1 now includes "Updated [DATE]"
- ✅ HeatingOilLocation: price summary table now shows all 4 volumes (300/500/900/1000L) with NI avg + potential saving
- ✅ HeatingOilLocation: nearby postcode links added
- ✅ HeatingOilLocation: supplier page links added at bottom
- ✅ SupplierProfile: added SEOHead with canonical URL, meta description, LocalBusiness schema, BreadcrumbList schema

### Completed P1 items (continued):
- ✅ /heating-oil-prices/ index page — HeatingOilPricesIndex created, lists all NI cities + all BT postcodes grouped by county
- ✅ Blog article pages: SEOHead + visible breadcrumb nav + BreadcrumbList + Article schema added to all blog articles
- ✅ 30-day price history chart on postcode/city pages (recharts LineChart using /api/prices/history?days=30&volume=500)
- ✅ Price alert CTA on postcode/city pages ("Set a price alert for BTxx")

### Remaining P1 items:
- [ ] Supplier pages need more detail (BT postcodes covered, 30-day price chart per supplier)
- [ ] Homepage live price table (P2 spec) — show cheapest today vs NI average for 300/500/900L

---

## P1 — Original spec (new routes, the commercial inventory)

### URL architecture to build

```
GET /heating-oil-prices/                     → index listing all areas
GET /heating-oil-prices/:postcode/           → postcode page (bt7, bt44, etc. — lowercase)
GET /heating-oil-prices/:city/               → city page (belfast, derry, etc.)
GET /supplier/:slug/                         → individual supplier page
```

### Postcode pages — build in this order (highest GSC signal first)

| # | URL | Target query | GSC impressions | Why first |
|---|-----|-------------|-----------------|-----------|
| 1 | /heating-oil-prices/bt44/ | "heating oil ballymoney" | 182 impr, 15 clicks, pos 2.55 | Already ranking — build to consolidate |
| 2 | /heating-oil-prices/bt51/ | "heating oil coleraine" | 31 impr, 3 clicks, pos 15 | Existing rank — strengthen it |
| 3 | /heating-oil-prices/bt53/ | "oil ballymoney" | 20 impr, 3 clicks | Existing rank |
| 4 | /heating-oil-prices/bt41/ | "heating oil antrim" | 37 impr, 0 clicks, pos 36 | Good signal |
| 5 | /heating-oil-prices/bt42/ | "heating oil prices ballymena" | 24 impr, 0 clicks | Companion to city |
| 6 | /heating-oil-prices/bt45/ | "heating oil prices magherafelt" | 68 impr, 0 clicks | High impressions |
| 7 | /heating-oil-prices/bt82/ | "heating oil prices strabane" | 28 impr, 0 clicks | Near-zero competition |
| 8 | /heating-oil-prices/bt27/ | "cheapest oil prices lisburn" | 22 impr | Lisburn cluster |
| 9 | /heating-oil-prices/bt48/ | "cheapest oil in derry" | 32 impr | Major city |
| 10 | /heating-oil-prices/bt7/ | — | competitor built this | CheapOilNI already has it |

### City pages — build in this order

| # | URL | GSC impressions | Notes |
|---|-----|-----------------|-------|
| 1 | /heating-oil-prices/belfast/ | 223 impr, 0 clicks, pos 49 | Highest population |
| 2 | /heating-oil-prices/coleraine/ | 57 impr, 0 clicks, pos 52 | |
| 3 | /heating-oil-prices/magherafelt/ | 68 impr, 0 clicks, pos 50 | |
| 4 | /heating-oil-prices/derry/ | 40+ impr | Also: londonderry redirect |
| 5 | /heating-oil-prices/strabane/ | 28 impr, 0 clicks | |

### Supplier pages — build first 5

| # | URL | Notes |
|---|-----|-------|
| 1 | /supplier/finney-bros/ | Brand query signal in GSC (~15 impr) |
| 2 | /supplier/alfa-oils/ | Brand awareness signal |
| 3 | /supplier/value-oils/ | "value oils" 31 impr, 0 clicks |
| 4 | /supplier/derry-oil-company/ | — |
| 5 | /supplier/jennings-fuels/ | Cheapest in BT7 per live data |

### What every programmatic page MUST contain (no thin pages)

**Postcode pages (`/heating-oil-prices/bt7/`):**
- H1: "Heating Oil Prices in BT7 — Updated [DATE]"
- Dynamic price table: 300L / 500L / 900L / 1000L — cheapest price, cheapest supplier, NI average, potential saving, price per litre
- Last updated timestamp (to the minute)
- Number of suppliers covering this postcode
- Full supplier comparison table with Get Quote CTAs
- 30-day price chart (if data exists)
- Towns/areas covered by this postcode
- BreadcrumbList schema
- Internal links → parent city page + nearby postcodes + each supplier page
- CTA: "Set a price alert for BT7"

**City pages (`/heating-oil-prices/belfast/`):**
- Aggregated price data across all Belfast postcodes
- List of postcode pages with current cheapest price each
- Supplier coverage map/list

**Supplier pages (`/supplier/alfa-oils/`):**
- Current prices (300/500/900/1000L)
- BT postcodes covered
- Price vs NI average
- Last updated timestamp
- "Compare this supplier" CTA
- Internal links to every postcode page they cover

---

## P2 — WEEK 3–4

- Homepage live price table below CTA:
  | Size | Cheapest today | NI Average | Potential saving |
  |------|---------------|------------|-----------------|
  | 300L | £[LIVE] | £334.39 | £[DELTA] |
  | 500L | £[LIVE] | £542.56 | £[DELTA] |
  | 900L | £[LIVE] | £964.41 | £[DELTA] |
  Add "Prices last updated: [timestamp]" below.

- Rebuild sitemap by URL type (sitemap-postcodes.xml, sitemap-cities.xml, sitemap-suppliers.xml, sitemap-pages.xml, sitemap-index.xml)

- Breadcrumbs on all inner pages

---

## After each task

1. `log_action` with a concrete past-tense note
2. `message_brain` with a summary — the Brain is coordinating with the SEO Manager and needs to know what's done

If you hit any blockers (missing DB schema, deployment constraints, unclear routes), `message_brain` immediately — don't guess.
