/**
 * Merge into tailwind.config.ts under theme.extend.
 * Phase 1 adds NEW names only (brand-*, font-display, font-body, font-price).
 * It does not touch the existing shadcn HSL variables, so pages not yet redesigned keep their current look.
 */
export const brandExtend = {
  colors: {
    brand: {
      forest: "#11381F", // hero, footer, alerts panel, primary text accent
      "forest-soft": "#1A4A2E", // inputs and tiles on forest
      "forest-line": "#2F6A45", // hairlines on forest
      lime: "#C8F169", // accent word, badges, avatar initials
      butter: "#FFF0A6", // cheapest card, price board, first tile
      gold: "#FFC83D", // primary CTA (the "accent" tweak in the design)
      mint: "#ECF2C4", // support strip
      cream: "#FBF3E6", // page background
      card: "#FFF9EE", // search card
      paper: "#FFFDF9", // list rows and tiles
      ink: "#12201C", // body text
      muted: "#55605A", // secondary text on cream
      line: "#CFC6B3", // borders on cream
    },
  },
  fontFamily: {
    display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
    body: ["'Instrument Sans'", "system-ui", "sans-serif"],
    price: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
  },
};

/* Usage inside tailwind.config.ts:

   import { brandExtend } from "./design-handoff/tokens/tailwind.extend.snippet";
   ...
   theme: { extend: { colors: { ...existingColors, ...brandExtend.colors }, fontFamily: brandExtend.fontFamily, ... } }

   Better: paste the object contents straight into the config and delete the import.
   The design-handoff folder should not be a build dependency.
*/
