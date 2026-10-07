# Site redesign — task queue for Q1

Branch: `redesign/homepage-v2`
Handover: `design-handoff/HANDOVER.md` (read this first every session)
Last updated: 7 Oct 2026

---

## Decisions locked (do not ask again)

| ID | Decision | Value |
|---|---|---|
| D1 | H1 wording | "Home Heating Oil Prices Comparison in NI" — already in reference file |
| D2–D3 | Defaults | As per handover section 4 |
| D4 | Logo swap | **YES** — swap to `tokens/logo-mark.svg`. Replace `client/public/favicon.svg` too. |
| D5 | Nav label | "Blog" — as per handover |
| D6 | Font hosting | Fontsource, self-hosted — as per handover |
| D7 | Trust claims | Show `summary[500].count` live from the API. Do not hardcode a supplier count or a freshness date. |
| /compare | Route | **Redirect to /results** — compare.tsx is dead code; delete the file and its import in App.tsx. Already done on this branch. |

---

## Phase 1 — Foundation + Homepage (Stage A + B)

**Start here. Do not deploy. Commit at each rollout step.**

Read `design-handoff/HANDOVER.md` in full, then `design-handoff/reference/landing.redesign.tsx` and `design-handoff/reference/shared/brand-ui.tsx`.

Decisions: D1 is "Home Heating Oil Prices Comparison in NI". D2 to D7 are the defaults in section 4 with these overrides: D4=YES (swap logo), D7=show live supplier count from the API (not hardcoded).

Do build steps 1 to 8 in section 11 plus rollout steps R1 to R3 in section 6A:

1. Create no new branch — you are already on `redesign/homepage-v2`.
2. Paste `tokens/tailwind.extend.snippet.ts` into `theme.extend` in `tailwind.config.ts`.
3. Install fonts: `npm i @fontsource-variable/bricolage-grotesque @fontsource/instrument-sans @fontsource/ibm-plex-mono`. Import weights in `client/src/main.tsx`. Update fontFamily entries.
4. Swap logo: replace `HeatingOilLogo` output with the SVG from `tokens/logo-mark.svg`. Overwrite `client/public/favicon.svg`.
5. Homepage: copy `structuredData` block out of current `landing.tsx`, copy `reference/landing.redesign.tsx` over `landing.tsx`, paste `structuredData` back in. Apply D1 (already in reference), D7 (live count).
6. Restyle `navigation.tsx` and `footer.tsx` per section 6 of the handover (forest background, cream text, etc.). Keep all existing functionality.
7. Apply R1 (theme remap in index.css and button.tsx) and R2 (copy brand-ui.tsx to components/).
8. Apply the server patch for issue 1 (fake updatedAt) from section 10.
9. Run: `npm run check && npm run test:run && npm run build`. Report results.
10. List anything in the design you could not match, with file and line.

**Commit message:** `feat(redesign): foundation + homepage — tokens, fonts, logo, nav, footer, theme remap, brand-ui`

Mark Phase 1 done in this file when complete.

---

## Phase 2 — Inner pages (Stage C + D)

**Start after Phase 1 is committed and checked. Do not deploy.**

Read `design-handoff/HANDOVER.md` section 6A, then `design-handoff/source/Results.dc.html` and `design-handoff/source/Town.dc.html`.

Do rollout steps R4 to R8:

- R4: Codemod dry run first (`node design-handoff/scripts/restyle-codemod.mjs`). Then apply one file first (`--write --only suppliers.tsx`), review diff, then apply to all (`--write`). Commit.
- R5: Rebuild `results.tsx` from `source/Results.dc.html` and `heating-oil-location.tsx` from `source/Town.dc.html`. Commit each separately.
- R6: Work down the page table in section 6A. One commit per file or pair. After each, load at 390 and 1440 wide. Rules: change layout and classes only — do not change copy, headings, routes, SEOHead props, data fetching or form logic. Use PageShell, PageHero, SurfaceCard, PriceRow and Button variants from brand-ui.tsx.
- R7: Run the sweep grep from section 6A. It should return nothing outside components/ui and chart files.
- R8: Delete dead components (check with grep first). Delete `client/src/pages/compare.tsx`. Re-run `npm run check` and `npm run build`.

Special cases:
- `contact.tsx` and `thank-you-page.tsx`: add PageShell (they have no nav/footer today).
- `contact.tsx`: rename the lucide `Navigation` import to avoid collision with the site nav component.
- Chart colours (section 6B): update stroke/fill in recharts components to use brand tokens (line `#11381F`, fill `#C8F169` at 25% opacity, grid `#CFC6B3`).

At the end report: pages done, codemod "Needs a person" items resolved, R7 sweep output, anything left.

**Commit message:** `feat(redesign): all inner pages — codemod, templates, page-by-page restyle, dead code removed`

Mark Phase 2 done in this file when complete.

---

## Deploy (after both phases pass QA)

Run the QA checklist in section 12 of the handover at 360, 390, 768, 1024 and 1440px wide. Then:

```bash
fly deploy -a niheatingoilcom
curl -sI https://niheatingoil.com/
```

Post-deploy checks: section 13 of the handover.

---

## Status

- [x] Branch `redesign/homepage-v2` created
- [x] /compare → redirect restored, compare.tsx marked for deletion in Phase 2
- [ ] Phase 1: Foundation + Homepage
- [ ] Phase 2: Inner pages
- [ ] QA + deploy
