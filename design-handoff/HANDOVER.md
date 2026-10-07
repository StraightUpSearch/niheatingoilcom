# NI Heating Oil redesign: whole site build and launch handover

Updated 7 Oct 2026 for Jamie Irwin. Repo: `StraightUpSearch/niheatingoilcom`, branch `main`.

**Answer first:** the redesign now covers every page. Roll it out in this order: theme remap (restyles all 22 page files at once), shared components, nav and footer, homepage, results and town templates, then the remaining pages with a codemod and the shared components. No database change and no new API. Section 6A has the page by page plan.

Status of the seven decisions (section 4): D1 is decided by Jamie. D2 to D7 are set to the recommendation. Change one by replying with its ID.

Build order: tokens, theme remap, fonts, nav and footer, homepage, results and town templates, other pages, data check, QA, deploy to Fly.io.

---

## 1. What is in this folder

| Path | What it is | Runnable? |
|---|---|---|
| `HANDOVER.md` | This document | n/a |
| `source/Main.dc.html` | Homepage desktop design source. Every inline style value is the spec. | No. Open it from the design canvas. |
| `source/Mobile.dc.html` | Homepage mobile view. It imports `Main`. | No. Canvas only. |
| `source/Results.dc.html` | Template for `/results`, and the pattern for every list page | No. Canvas only. |
| `source/Town.dc.html` | Template for `/heating-oil-prices/:location`, and the pattern for every content page | No. Canvas only. |
| `reference/landing.redesign.tsx` | Homepage as a React page, wired to your real endpoints. Passes `tsc` on its own. | Not imported anywhere, so it cannot break the build. |
| `reference/shared/brand-ui.tsx` | Shared components: `SupportStrip`, `PageShell`, `PageHero`, `OverlapSection`, `SurfaceCard`, `SectionHeading`, `VolumeTabs`, `PostcodeSearchBar`, `PriceRow`, `CtaBand` | Not imported anywhere until you copy it in (step R2) |
| `scripts/restyle-codemod.mjs` | Maps hardcoded gray, blue, orange and green classes to brand tokens. Dry run by default. | Yes, from the repo root |
| `tokens/tailwind.extend.snippet.ts` | Colours and fonts to merge into `tailwind.config.ts` | Yes |
| `tokens/index.css.remap.snippet.css` | New HSL values for the shadcn variables in `client/src/index.css` | Yes |
| `tokens/button.variants.snippet.ts` | New `buttonVariants`, with a gold `cta` variant | Yes |
| `tokens/brand-tokens.css` | Same tokens as CSS variables, plus font loading options | Yes |
| `tokens/logo-mark.svg` | New drop logo mark | Yes |

Visual source of truth: the design canvas "NI Heating Oil Redesign" (private to your Claude account): https://claude.ai/artifact/K6RNirKkyp32zB42mFxZSA

I changed nothing outside `design-handoff/`. The folder is untracked in git.

Heads up: `git status` also shows `client/src/App.tsx` as modified. That is not from this work. Ignoring line endings, the one real change is `/compare` now rendering the `Compare` page instead of redirecting to `/results`. Ask Jamie whether it is intended before branching, and commit or stash it first so it does not land inside the redesign branch by accident.

---

## 2. Facts about the current setup (checked 7 Oct 2026)

| Item | Finding | Evidence |
|---|---|---|
| Hosting | Fly.io app `niheatingoilcom`, region `lhr`, port 5000 | Live response headers: `server: Fly`, `via: 2 fly.io`. `fly.toml`. |
| Deploy method | Docker multi-stage build, `fly deploy` by hand. No CI workflow in the repo. | `Dockerfile`, no `.github` folder |
| Stale docs | `LIVE-STATUS.md`, `PRODUCTION-DEPLOY.md`, `ReadMe.md` describe WordPress via Local by Flywheel. `DEPLOY-NOW.md` describes Railway. Ignore all four until rewritten. | Live site is on Fly |
| Front end | React 18, Vite, wouter, TanStack Query, Tailwind 3.4.17 via PostCSS, shadcn and Radix, lucide-react | `package.json` |
| Back end | Express, drizzle. Production uses Postgres via `DATABASE_URL`. Without it, the app falls back to a local SQLite file. | `server/db.ts` |
| Local data | `heating-oil.db` is gitignored. Local prices will differ from production. | `.gitignore` |
| Health check | `GET /api/health` | `fly.toml`, `server/routes.ts` |
| Cold starts | `min_machines_running = 0` with auto stop. A visit after idle waits for a machine to start. | `fly.toml` |
| Rendering | Client-rendered SPA. A plain HTTP fetch of `/` returns meta tags only. | Fetch test |
| Git | Branch `main`, clean tree when checked, last commit `4f3251c` | `git log` |

Optional speed win: set `min_machines_running = 1` in `fly.toml`. Check Fly pricing for one always-on shared machine first.

---

## 3. Scope

Everything on the site gets the new look. It ships in one branch, in four stages so each can be reviewed alone:

| Stage | What | Why this order |
|---|---|---|
| A. Foundation | Tokens, theme remap in `index.css`, button variants, fonts, logo, nav, footer, shared components | The remap alone turns every shadcn button, card, input and dialog on all 22 pages forest, cream and butter before any page is edited. |
| B. Homepage | `landing.tsx` from the reference file | Highest visibility. |
| C. Templates | `results.tsx` and `heating-oil-location.tsx` | Highest traffic and SEO value. They set the pattern for the rest. |
| D. Remaining pages | The other 19 page files, in the order in section 6A | Mostly codemod plus `PageShell` and `PageHero`. |

Left for later (needs back end work, not design): public double opt in alert endpoint and inline alert form, a visible all sizes price table on the homepage (see D2), supplier count from the API on every page.

Pages not yet reached in stage D look acceptable but off brand after stage A, because only the colours change. Do not launch between stages C and D unless Jamie agrees. The default is to launch after D.

---

## 4. Decisions

| ID | Decision | Status | Setting |
|---|---|---|---|
| D1 | H1 wording | **Decided by Jamie** | "Home Heating Oil Prices Comparison in NI". Already applied in the design and in the reference file. |
| D2 | Price board shows one tank size. Current page shows three in a table. | Default | Add a screen reader only table of all three sizes now. Revisit a visible one later. |
| D3 | Alerts. `POST /api/alerts` needs sign in. | Default | One button to `/alerts` everywhere (already in the reference file and templates). Inline form only after a public double opt in endpoint exists. |
| D4 | Logo | Default | Swap to the drop mark. Also replace `client/public/favicon.svg` and the OG image. |
| D5 | Nav label "Guides" vs route `/blog` | Default | Nav and footer say "Blog". "Guides" stays as the homepage section heading only. |
| D6 | Font hosting | Default | Fontsource, self hosted. |
| D7 | Trust claims (10+, 50+, "every 2 hours", "daily") | Default | Show `summary[500].count` from the API. Pick one freshness claim you can prove. |

Change a default by replying with the ID and the new choice.

H1 note for the SEO check: the new H1 keeps "Heating Oil", "Prices", "Comparison" and "NI" on one line, matching the page's target phrase. The eyebrow above it reads "Northern Ireland's independent price comparison", so "Northern Ireland" is still on the page in the first screen.

---

## 5. Design tokens

### Colour

| Token (Tailwind) | Hex | Used for |
|---|---|---|
| `brand-forest` | `#11381F` | Hero, footer, alerts panel, headings, primary buttons |
| `brand-forest-soft` | `#1A4A2E` | Inputs on forest |
| `brand-forest-line` | `#2F6A45` | Hairlines on forest |
| `brand-lime` | `#C8F169` | Accent word, badges, avatar initials |
| `brand-butter` | `#FFF0A6` | Price board, cheapest row, first tile |
| `brand-gold` | `#FFC83D` | Primary CTA |
| `brand-mint` | `#ECF2C4` | Support strip |
| `brand-cream` | `#FBF3E6` | Page background |
| `brand-card` | `#FFF9EE` | Search card |
| `brand-paper` | `#FFFDF9` | List rows, tiles |
| `brand-ink` | `#12201C` | Body text |
| `brand-muted` | `#55605A` | Secondary text on cream |
| `brand-line` | `#CFC6B3` | Borders on cream |

### Type

| Role | Font | Size, line height, tracking, weight |
|---|---|---|
| H1 | Bricolage Grotesque | `clamp(44px,6.4vw,80px)`, 0.98, -0.04em, 800 |
| H2 | Bricolage Grotesque | `clamp(32px,4.2vw,52px)`, 1.0, -0.035em, 800 |
| H3 and tile titles | Bricolage Grotesque | 25px, -0.02em, 800 |
| Body | Instrument Sans | 17px, 1.5, 400 to 600 |
| Small | Instrument Sans | 13 to 15px |
| Prices and tank buttons | IBM Plex Mono | 600. Board price `clamp(52px,7vw,80px)`. List price 30px. |

### Shape, layout, motion

| Item | Value |
|---|---|
| Radius | Input 14px. Chip and pill 999px. List row 24px. Card and tile 28px. Board 32px. Alerts panel 36px. |
| Container | 1200px max, gutter `clamp(16px,4vw,32px)` |
| Section spacing | `clamp(48px,8vw,96px)` |
| Touch targets | 44px minimum. Inputs 56 to 60px. Main CTA 62px. |
| Motion | Live dot pulse 2s. Tile hover lift 3px over 180ms. Both stop under `prefers-reduced-motion`. |
| Banned patterns | No coloured left rail on cards. Child rows must visibly nest under parents. |

### Contrast (calculated 7 Oct 2026, WCAG ratio, 4.5 needed for body text)

| Pair | Ratio | Result |
|---|---|---|
| Ink on cream | 15.3 | Pass |
| Muted on cream | 5.9 | Pass |
| Muted on paper | 6.4 | Pass |
| Cream on forest | 11.8 | Pass |
| Soft text `#CFE3D3` on forest | 9.7 | Pass |
| Muted text `#A9C7B1` on forest | 7.1 | Pass |
| Lime on forest | 10.1 | Pass |
| Ink on gold | 10.9 | Pass |
| Ink on butter | 14.6 | Pass |
| Butter on forest (selected tab) | 11.4 | Pass |
| `#44502A` on butter | 7.5 | Pass |
| Saving green `#0B6A30` on butter | 5.9 | Pass |
| Saving green `#0B6A30` on paper | 6.6 | Pass |
| Forest on mint | 11.2 | Pass |

---

## 6. Section by section build map

Reference file: `reference/landing.redesign.tsx`. Section names below match its component names.

| # | Section | Where | Data | Notes |
|---|---|---|---|---|
| 1 | Support strip | `landing.tsx` | Link to `https://www.nidirect.gov.uk/articles/affordable-warmth-scheme` | Keep the dismiss button and the `hideGovBanner` sessionStorage key. Render above the nav. |
| 2 | Nav | `components/navigation.tsx` | `useAuth` | Restyle only. Keep the Prices dropdown, auth state and mobile sheet. Keep the `lg` breakpoint (the design collapses at 820px, the app uses 1024px). |
| 3 | Hero and search | `Hero` | Submits to `/results?postcode=&volume=` | Calls `trackPriceSearch`. Empty postcode focuses the field. |
| 4 | Price board | `PriceBoard` | `GET /api/prices/ni-summary` | Tabs share state with the form. 1000L has no data and shows the local-price message. |
| 5 | Quick tiles | `QuickTiles` | Links to `#search`, `/alerts`, `/compare-heating`, nidirect | Tile 3 copy is a placeholder. Check it against what `/compare-heating` does. |
| 6 | Trust row | `TrustRow` | Static now. See D7. | Keeps the "As featured in BBC News NI" link from the current page. |
| 7 | Cheapest list | `CheapestList` | `GET /api/prices?volume=500&sort=price` | De-duplicates per supplier. Call and Website buttons use `phone` and `website` from the API. |
| 8 | How it works | `HowItWorks` | Static | Copy slightly tightened from current. |
| 9 | Alerts | `AlertsCta` | Link to `/alerts` | See D3. |
| 10 | Areas | `AreaLinks` | `TOWNS` array | Keep the trailing slash: `/heating-oil-prices/{slug}/` |
| 11 | Guides | `Guides` | Three slugs, unchanged | Keep slugs exactly. |
| 12 | Footer | `components/footer.tsx` | Static | See below. |

### Nav class recipe

- Header: `bg-brand-cream`, no bottom border, `h-20`.
- Links: `text-brand-forest font-semibold text-base`, 44px minimum height.
- CTA: `bg-brand-forest text-brand-cream font-bold rounded-xl h-[46px] px-5`.
- Wordmark: `font-display font-extrabold text-[23px] tracking-[-0.025em] text-brand-forest`.

### Footer must keep (the design footer is simplified)

The four social links, the Simon Community logo and charity line, the BBC link, the address and phone, and the Privacy, Terms and Disclaimer links. Restyle on `bg-brand-forest` with `text-brand-cream`, soft text `#CFE3D3`, muted `#A9C7B1`.

---

## 6A. Rolling the template out to every inner page

Two templates are designed and live on the canvas: `source/Results.dc.html` (list pages) and `source/Town.dc.html` (content pages). Every other page is a variation of one of them.

### Page anatomy (all inner pages)

1. `SupportStrip`, then `Navigation` (Prices link gets `bg-brand-mint` and `aria-current="page"` when active).
2. `PageHero`: forest band, breadcrumb, H1 with one lime accent phrase, optional intro, optional search bar or CTA.
3. Content on cream. Cards use `SurfaceCard` (paper for content, butter for the one highlighted thing, mint for help and support).
4. Optional `CtaBand` (forest panel, one gold button).
5. `Footer`.

Wrap all of it in `PageShell`. Remove the old `min-h-screen bg-gray-50`, the `<Navigation />` and `<Footer />` lines and the `max-w-4xl pt-24` main wrapper.

### Page by page

Effort is counted from hardcoded colour classes (gray, blue, orange, green and so on) found on 7 Oct 2026. Gradient bands need a manual swap to `bg-brand-forest`. Open `client/src/App.tsx` for the exact routes.

| File | Route | Template | Colour classes / gradients | What to do |
|---|---|---|---|---|
| `results.tsx` | `/results` | Results | 49 / 0 | Rebuild to `source/Results.dc.html`. `PostcodeSearchBar` always visible, replacing the toggled "Change search" form. Rows become `PriceRow`. Aside has alert card, support card, tank size guide link. Keep `noindex` and the canonical header. |
| `heating-oil-location.tsx` | `/heating-oil-prices/:location` | Town | 87 / 0 | Rebuild to `source/Town.dc.html`. Keep the H1 text including "Updated {date}", the 4 size table, the 30 day chart, supplier list, area guide copy and postcode cluster links. Highest SEO value: diff the rendered text before and after. |
| `heating-oil-prices-index.tsx` | `/heating-oil-prices` | Town | 36 / 0 | `PageHero` plus the homepage areas grid (`AreaLinks`). |
| `ni-price-index.tsx` | `/ni-heating-oil-price-index` and aliases | Town | 68 / 0 | `PageHero`, the butter price table card from the Town template, chart in a `SurfaceCard`. |
| `compare-heating.tsx` | `/compare-heating` | Town | 115 / 0 | Largest file. Codemod first, then `PageHero`, then wrap each wizard step in `SurfaceCard`. Check the TCO chart colours (see section 6B). |
| `suppliers.tsx` | `/suppliers` | Results | 25 / 1 | `PageHero` with search field. Directory as a 2 or 3 column grid of `SurfaceCard` (name, areas, Profile button). |
| `supplier-profile.tsx` | `/suppliers/:id`, `/supplier/:id` | Town | 54 / 2 | Hero carries the supplier name and Call and Website buttons. Sections in `SurfaceCard`. Drop the gradient. |
| `blog.tsx` | `/blog` | Town | 17 / 0 | `PageHero` plus the homepage guide cards (`lift` hover, 28px radius, 220px minimum height). |
| `blog-article.tsx` | `/blog/:slug` | Town | 22 / 0 | Hero with title and date. Article column 760px wide, 17px body at 1.6 line height, H2 and H3 in `font-display`. Keep breadcrumbs. |
| `about-us.tsx` | `/about` | Town | 38 / 1 | `PageHero` plus `SurfaceCard` sections. |
| `giving-back.tsx` | `/giving-back` | Town | 68 / 2 | `PageHero`, butter card for the 5% pledge, Simon Community logo kept. |
| `contact.tsx` | `/contact` | Town | 48 / 2 | **Has no site nav or footer today.** Add `PageShell`. Form fields use the 56px input style. Note the file imports `Navigation` from lucide-react (an icon), so rename that import to avoid clashing with the site nav. |
| `thank-you-page.tsx` | `/thank-you` | Town | 49 / 2 | **Has no site nav today.** Add `PageShell` and a butter confirmation card. |
| `alerts.tsx` | `/alerts` | Town | 22 / 1 | Forest `CtaBand` style panel, 56px inputs, gold submit. Keep the sign in redirect. |
| `auth-page.tsx` | `/auth` | Town | 28 / 1 | Centred `SurfaceCard` on a forest band. |
| `forgot-password.tsx` | `/forgot-password` | Town | 21 / 2 | Same as auth. |
| `reset-password.tsx` | `/reset-password` | Town | 26 / 2 | Same as auth. |
| `dashboard.tsx` | `/dashboard` | Results | 32 / 0 | `PageShell`, cards in `SurfaceCard`, saved items as `PriceRow`. |
| `saved-quotes.tsx` | `/saved-quotes` | Results | 3 / 0 | `PageShell` already present. Swap the wrapper only. |
| `not-found.tsx` | any unknown route | Town | 4 / 0 | `PageShell`, hero "That page is not here", postcode search bar and area links. |
| `compare.tsx` | `/compare` | none | 13 / 1 | Not in the nav. In the committed code `/compare` redirects to `/results`, so this file is dead. The working tree currently re-enables it (see section 1). Ask Jamie. Default: leave the redirect and delete the file. |
| `landing.tsx` | `/` | Homepage | n/a | Stage B, from `reference/landing.redesign.tsx`. |

### Layout and class rules

| Old pattern | New pattern |
|---|---|
| `min-h-screen bg-gray-50` page wrapper | `<PageShell>` |
| `<Navigation />` and `<Footer />` inside the page | Remove. `PageShell` renders both. |
| `max-w-4xl mx-auto pt-24 px-4` main | `PageHero` then `max-w-[1200px] px-4 sm:px-8` sections. Article text only: `max-w-[760px]`. |
| `bg-gradient-to-*` hero band | `<PageHero>` (forest, no gradient) |
| `bg-white rounded-lg shadow` card | `<SurfaceCard>` (paper, 1.5px line border, 28px radius, no shadow) |
| `text-3xl font-bold` page title | H1 inside `PageHero` |
| `text-2xl font-bold` section title | `<SectionHeading>` |
| Blue primary button | `<Button>` (default is forest after step R1) |
| Orange button | `<Button variant="cta">` (gold, ink text) |
| Green savings text | `text-[#0B6A30]` on cream, butter or paper (5.9 to 6.6:1) |
| Price figure | `font-price font-semibold text-brand-forest` |
| Coloured left border on a card | Remove. Not allowed in this design. |
| Any text smaller than 14px | Raise to 14px minimum. Footnotes may be 13px. |

Class mapping used by the codemod: `gray-50` becomes `brand-cream`, gray text 600 and below becomes `brand-muted`, gray 700 and above becomes `brand-ink`, gray borders become `brand-line`, blue and indigo solids become `brand-forest`, blue and indigo tints become `brand-mint`, orange solids become `brand-gold`, orange text becomes `#8A3B12`, green text becomes `#0B6A30`. The full table is the `MAP` object at the top of the script.

### 6B. Things the codemod cannot fix

1. **Charts.** Recharts or similar colours are set in JS, not classes. Search for `stroke=`, `fill=` and hex values in `price-trends.tsx`, `animated-price-trend.tsx`, `mobile-price-trends.tsx` and the TCO chart. Line colour `#11381F`, fill under the line `#C8F169` at 25% opacity, grid `#CFC6B3`, dashed.
2. **Components shared by several pages.** The codemod also scans `client/src/components` (except `ui/`). Many of those components appear unused (`hero-section.tsx`, `gamified-search.tsx`, `social-proof-popup.tsx` and others). Delete dead components rather than restyling them. Check with `grep -rn "components/<name>" client/src` first.
3. **Cookie banner, chatbot bubble, lead capture modal, sticky signup.** Restyle by hand: forest background, cream text, gold button, 14px radius, 44px buttons.
4. **Hardcoded hex in inline styles.** Search for `style={{` with `#` colours.
5. **White on gold.** The codemod flags any line where `bg-brand-gold` sits beside `text-white`. Use `text-brand-ink`.
6. **Dark gradients with white text** become forest with cream text (`text-brand-cream`, soft `#CFE3D3`).

### Rollout steps (stage A and D)

R1. Theme. Replace the `:root` block in `client/src/index.css` with `tokens/index.css.remap.snippet.css`. Replace `buttonVariants` in `components/ui/button.tsx` with `tokens/button.variants.snippet.ts`. Set body font to `font-body` and headings to `font-display`. Run the app and look at `/results`, `/blog` and `/auth`: they should already be cream and forest. Commit.

R2. Copy `reference/shared/brand-ui.tsx` to `client/src/components/brand-ui.tsx`. Run `npm run check`. Commit.

R3. Restyle `navigation.tsx` and `footer.tsx` (section 6). Add the active state on Prices. Commit.

R4. Codemod dry run: `node design-handoff/scripts/restyle-codemod.mjs`. On 7 Oct 2026 it reported 1,179 class tokens it can convert across 60 of 77 files, and 291 items for a person (mostly gradients and red error colours). Read the "Needs a person" list. Then apply one file first: `node design-handoff/scripts/restyle-codemod.mjs --write --only suppliers.tsx`, review `git diff`, then apply to all with `--write`. Commit.

R5. Rebuild `results.tsx` and `heating-oil-location.tsx` from the templates. Commit each separately.

R6. Work down the table above, one commit per file or pair. After each, load the page at 390 and 1440 wide.

R7. Sweep. This should return nothing outside `components/ui` and the chart files:

```bash
grep -rEn "(bg|text|border|ring|from|to|via)-(gray|slate|zinc|blue|indigo|orange|amber|purple)-[0-9]{2,3}" client/src --include=*.tsx | grep -v "components/ui/"
```

R8. Delete dead code agreed with Jamie (`compare.tsx`, unused components). Re-run `npm run check` and `npm run build`.

---

## 7. Data wiring

| Endpoint | Used for | Shape | Gotcha |
|---|---|---|---|
| `GET /api/prices/ni-summary` | Price board | `{ "300": { cheapest, average, count, updatedAt }, "500": {...}, "900": {...} }` | No 1000L. `updatedAt` is set to the request time (see section 10). |
| `GET /api/prices?volume=500&sort=price` | Cheapest list | Rows with `price`, `pricePerLitre`, `createdAt`, `supplier { name, coverageAreas, phone, website }` | `pricePerLitre` is in pounds (`"0.677"`). Multiply by 100 for pence. Returns up to 50 latest rows, so one supplier can appear more than once. The reference file keeps the newest row per supplier. |
| `GET /api/prices/lowest/:volume?limit=n` | Do not use on the homepage | Same row shape | Returned Jennings Fuels twice when tested. |
| `POST /api/alerts` | Alert creation | n/a | Requires sign in. |
| `GET /results?postcode=&volume=` | Search destination | Existing page | Server adds `noindex` and a canonical header. Leave it. |

Cache: `staleTime` of 30 minutes, same as the current page.

---

## 8. SEO safeguards (all must survive the swap)

1. Keep the `SEOHead` title, description, keywords and canonical on every page. The title in the reference file is built from an escape so the em dash stays identical to production. Do not edit `SEOHead` calls during the restyle.
2. Copy the `structuredData` array from the current `landing.tsx` into the new file. The reference file leaves it empty on purpose.
3. One H1 only: "Home Heating Oil Prices Comparison in NI" (D1, already in the reference file). Every inner page keeps its current H1 text. The templates only restyle it.
4. Keep all 10 town links with trailing slashes.
5. Keep the BBC News NI link.
6. Reserve space for the price board and list while data loads (a skeleton or `min-h`). Layout shift hurts Core Web Vitals.
7. Fonts: `font-display: swap` plus a fallback of similar width. Check CLS after loading.
8. After launch, request indexing for `/` in Search Console.

---

## 9. Accessibility checklist

1. Tank buttons are real `<button>` elements with `aria-pressed`, inside a labelled group.
2. Every input has a visible `<label>`.
3. Focus ring: 2px ink with 3px offset on light surfaces, lime on forest.
4. Icon-only buttons carry `aria-label` (dismiss, menu).
5. Decorative icons are `aria-hidden`.
6. Nothing relies on colour alone: the cheapest row also carries a "Cheapest" label.
7. `prefers-reduced-motion` disables the pulse and the hover lift.
8. Inputs stay at 16px or larger on mobile. `index.css` already forces this.

---

## 10. Claims to verify and known issues (not caused by the redesign)

| # | Issue | Evidence | Action |
|---|---|---|---|
| 1 | **"Updated" date is not real.** `ni-summary` sets `updatedAt` to the request time, and the current page prints today's date as "last updated". The two price rows sampled from `/api/prices/lowest/500` were created 13 and 20 Sep 2026. | `server/routes.ts`, live API | Return the newest `createdAt` instead (patch below). Show the real date. |
| 2 | **BT1 search shows suppliers that do not serve Belfast.** `/results?postcode=BT1&volume=500` ranks Jennings Fuels first. Its coverage is Mid Ulster and Tyrone. "Cheapest near you" is wrong for that search. | Live site, 7 Oct 2026 | Check `getSuppliersInArea` in `server/storage.ts`. Fix before pushing more traffic to the hero. |
| 3 | Alerts need sign in. | `server/routes.ts` line 418 | See D3. |
| 4 | Duplicate rows per supplier in price endpoints. `ni-summary` averages up to 50 latest rows, so duplicates may skew the average. | `getLatestPrices` | Verify. Dedupe to one row per supplier and volume. |
| 5 | Supplier count claims disagree (10+, 50+). | `landing.tsx`, `client/index.html` | See D7. |
| 6 | No 1000L data in the summary. | `ni-summary` volumes are 300, 500, 900 | Add 1000L or keep the local-price message. |
| 7 | Deployment docs are wrong. | Section 2 | Rewrite after launch. |

Patch for issue 1, inside the `ni-summary` loop in `server/routes.ts`:

```ts
// Use the newest price row as the real "updated" time instead of the request time.
const newest = Math.max(...prices.map((p) => new Date(p.createdAt as any).getTime()));
summary[volume] = {
  cheapest: parseFloat(cheapest.toFixed(2)),
  average: parseFloat(average.toFixed(2)),
  count: vals.length,
  updatedAt: new Date(newest).toISOString(),
};
```

If the real date looks old once it shows, that is a scraper cadence problem to fix, not a reason to fake the stamp.

---

## 11. Build steps

Steps 1 to 8 are stages A and B. Stages C and D follow section 6A (R1 to R8), run after step 7 below. Do the theme remap (R1) between steps 2 and 3 so the first local run already shows the new palette.

1. Create a branch.
   ```bash
   git switch -c redesign/homepage-v2
   ```
2. Tokens. Paste the object from `tokens/tailwind.extend.snippet.ts` into `theme.extend` in `tailwind.config.ts`. Do not import from `design-handoff/`.
3. Fonts (D6). Fontsource:
   ```bash
   npm i @fontsource-variable/bricolage-grotesque @fontsource/instrument-sans @fontsource/ibm-plex-mono
   ```
   Import the weights used in `client/src/main.tsx`. Update the three `fontFamily` entries to match the installed family names.
4. Logo (D4). Replace `HeatingOilLogo` output with `tokens/logo-mark.svg`. Overwrite `client/public/favicon.svg` with the same file.
5. Homepage.
   1. Copy the `structuredData` block out of `client/src/pages/landing.tsx`.
   2. Copy `reference/landing.redesign.tsx` over `client/src/pages/landing.tsx`.
   3. Paste `structuredData` into the new file.
   4. Apply D1, D2, D5 and D7.
6. Restyle `navigation.tsx` and `footer.tsx` using section 6.
7. Server patch for issue 1 (recommended).
8. Local checks.
   ```bash
   npm ci
   npm run check
   npm run test:run
   npm run build
   npm run dev
   ```
   The existing tests are `price-search-form.test.tsx` and `tank-selector.test.tsx`. Neither covers the new page.
9. QA (section 12) on the local build at the five widths.
10. Staging. Production reads its data from Postgres, so staging needs the same secrets and a database copy.
    ```bash
    fly apps create {{STAGING_APP_NAME}}
    fly secrets list -a niheatingoilcom
    fly deploy -a {{STAGING_APP_NAME}}
    ```
    `{{STAGING_APP_NAME}}`: any unused Fly app name. `fly secrets list` shows names only, so set each value on the staging app yourself.
11. Production.
    ```bash
    fly deploy -a niheatingoilcom
    curl -s https://niheatingoil.com/api/health
    ```
12. Post-deploy: section 13.

---

## 12. QA checklist

| Area | Check |
|---|---|
| Widths | 360, 390, 768, 1024, 1440. No horizontal scroll. Tiles overlap the hero edge without covering the form. |
| Hero | Empty submit focuses the postcode. A valid submit lands on `/results` with the right postcode and size. |
| Board | Tabs switch 300, 500, 900. 1000L shows the local-price message. Hero buttons and board tabs stay in sync. |
| API states | Slow response shows reserved space. Failed response hides the board and list without a broken layout. |
| List | Five suppliers, no repeats. Sort toggle works. Call opens the dialler. Website opens in a new tab. |
| Keyboard | Tab order follows the visual order. Focus ring visible on every control. |
| Browsers | iOS Safari (no input zoom), Android Chrome, desktop Chrome and Safari. |
| Storage | Works with sessionStorage blocked (banner just returns). |
| Analytics | `trackPriceSearch` fires once per submit. Confirm in GTM preview. |
| Vitals | Mobile Lighthouse. Targets: LCP under 2.5s, CLS under 0.1, INP under 200ms. |
| Inner pages | Every row of the section 6A table at 390 and 1440 wide: nav and footer present, one H1, no gradient band, no gray or blue left over, no horizontal scroll. |
| Text parity | For `heating-oil-location` and `blog-article`, compare visible text before and after with a diff. Wording and headings must not change. |
| Forms | Sign in, register, forgot password, contact and alert forms submit and show errors in a readable colour. |
| Chrome | Cookie banner, chatbot bubble and modals use brand colours and 44px buttons. |

---

## 13. Post-deploy checks and rollback

Within 30 minutes of launch:

1. `curl -sI https://niheatingoil.com/` returns 200 with `server: Fly`.
2. Homepage on a real phone over mobile data.
3. Run a BT postcode search end to end.
4. Search Console: inspect `/`, request indexing.
5. GTM or GA4 realtime shows the search event.

Rollback:

```bash
fly releases -a niheatingoilcom --image
fly deploy -a niheatingoilcom --image {{PREVIOUS_IMAGE_REF}}
```

`{{PREVIOUS_IMAGE_REF}}`: the image reference from the release before this launch, shown in the first command's output.

---

## 14. Copy-paste prompts for the builder

Use these in Claude Code, opened in the repo root. Run them one after the other, reviewing the branch between each.

**Prompt 1: foundation and homepage (stages A and B)**

```text
Read design-handoff/HANDOVER.md in full, then design-handoff/reference/landing.redesign.tsx and design-handoff/reference/shared/brand-ui.tsx.

Decisions: D1 is "Home Heating Oil Prices Comparison in NI". D2 to D7 are the defaults in section 4, except D4={{YES_OR_NO}} and D7={{CHOICE}}.

Do build steps 1 to 8 in section 11 plus rollout steps R1 to R3 in section 6A. Work on a new branch. Do not deploy. Do not read or print .env.
Keep the existing structuredData and SEOHead values exactly.
After the build, run npm run check, npm run test:run and npm run build, and report the results.
List anything in the design you could not match, with the file and line.
```

**Prompt 2: inner pages (stages C and D)**

```text
Read design-handoff/HANDOVER.md section 6A, then design-handoff/source/Results.dc.html and design-handoff/source/Town.dc.html (inline styles are the spec).

On the same branch, do rollout steps R4 to R8. Start with results.tsx and heating-oil-location.tsx, then follow the page table in section 6A.
Rules: change layout and classes only. Do not change copy, headings, routes, SEOHead props, data fetching or form logic. Use PageShell, PageHero, SurfaceCard, PriceRow and the Button variants from brand-ui.tsx.
Commit after each page. After each commit run npm run check.
At the end report: pages done, the codemod "Needs a person" items you resolved and how, the R7 sweep output, and anything left.
Do not deploy.
```

Fill each `{{...}}` from section 4 before pasting. `{{YES_OR_NO}}`: yes to swap the logo. `{{CHOICE}}`: the freshness claim you can prove, for example "updated daily".
