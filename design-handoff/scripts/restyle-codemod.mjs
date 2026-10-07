#!/usr/bin/env node
/**
 * Rollout step R4. Maps hardcoded Tailwind colour classes on inner pages to the brand tokens.
 *
 * Dry run (default, changes nothing):
 *   node design-handoff/scripts/restyle-codemod.mjs
 *
 * Apply to one file first, then review the diff:
 *   node design-handoff/scripts/restyle-codemod.mjs --write --only results.tsx
 *
 * Apply everywhere:
 *   node design-handoff/scripts/restyle-codemod.mjs --write
 *
 * Run from the repo root. Needs Node 18 or later. No dependencies.
 *
 * What it does: rewrites class tokens such as bg-gray-50, text-blue-600, hover:bg-blue-700,
 * border-gray-200. Variant prefixes (hover:, md:, focus:) and opacity suffixes (/90) are kept.
 *
 * What it does NOT do (it lists these in the report so a person decides):
 *   - gradients (from-*, via-*, to-*, bg-gradient-*): replace the band with bg-brand-forest by hand
 *   - orange or amber backgrounds that sit next to text-white (white on gold fails contrast)
 *   - red classes (kept for errors), purple and other colours with no mapping
 *   - layout: max-w-4xl, pt-24, rounded sizes. Use PageShell and PageHero instead.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "client", "src");
const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

// Files and folders that are never touched.
const SKIP = [
  `${sep}components${sep}ui${sep}`, // shadcn primitives follow the CSS variables
  `${sep}pages${sep}landing.tsx`, // homepage is rebuilt from the reference file
  `${sep}pages${sep}compare.tsx`, // dead code, delete it
  `${sep}components${sep}navigation.tsx`,
  `${sep}components${sep}footer.tsx`,
  `${sep}components${sep}brand-ui.tsx`,
  ".test.",
];

// Neutral greys. The shade decides the role.
const GREY = "(?:gray|slate|zinc|neutral|stone)";
// key: `${property}-${colour}-${shade}`, colours already normalised to "gray", "blue" and so on.
const MAP = {
  // page and surface backgrounds
  "bg-gray-50": "bg-brand-cream",
  "bg-gray-100": "bg-muted",
  "bg-gray-200": "bg-brand-line",
  // text
  "text-gray-900": "text-brand-ink",
  "text-gray-800": "text-brand-ink",
  "text-gray-700": "text-brand-ink",
  "text-gray-600": "text-brand-muted",
  "text-gray-500": "text-brand-muted", // 4.6:1 on white, passes. On cream use brand-muted too.
  "text-gray-400": "text-brand-muted", // gray-400 fails contrast, so it is promoted
  "text-gray-300": "text-brand-line",
  // borders and dividers
  "border-gray-100": "border-brand-line",
  "border-gray-200": "border-brand-line",
  "border-gray-300": "border-brand-line",
  "divide-gray-200": "divide-brand-line",
  // blue and indigo become forest
  "bg-blue-600": "bg-brand-forest",
  "bg-blue-700": "bg-brand-forest",
  "bg-blue-800": "bg-brand-forest",
  "bg-blue-900": "bg-brand-forest",
  "bg-indigo-600": "bg-brand-forest",
  "bg-indigo-700": "bg-brand-forest",
  "bg-blue-500": "bg-brand-forest-soft",
  "bg-blue-50": "bg-brand-mint",
  "bg-blue-100": "bg-brand-mint",
  "bg-indigo-50": "bg-brand-mint",
  "bg-indigo-100": "bg-brand-mint",
  "text-blue-500": "text-brand-forest",
  "text-blue-600": "text-brand-forest",
  "text-blue-700": "text-brand-forest",
  "text-blue-800": "text-brand-forest",
  "text-blue-900": "text-brand-forest",
  "text-indigo-600": "text-brand-forest",
  "text-indigo-700": "text-brand-forest",
  "text-blue-100": "text-[#CFE3D3]",
  "text-blue-200": "text-[#CFE3D3]",
  "border-blue-200": "border-brand-line",
  "border-blue-300": "border-brand-line",
  "border-blue-500": "border-brand-forest",
  "border-blue-600": "border-brand-forest",
  "border-indigo-200": "border-brand-line",
  "ring-blue-500": "ring-brand-forest",
  "ring-blue-600": "ring-brand-forest",
  // orange and amber become gold, or a readable brown for text
  "bg-orange-50": "bg-brand-butter",
  "bg-orange-100": "bg-brand-butter",
  "bg-amber-50": "bg-brand-butter",
  "bg-amber-100": "bg-brand-butter",
  "bg-yellow-50": "bg-brand-butter",
  "bg-yellow-100": "bg-brand-butter",
  "bg-orange-500": "bg-brand-gold",
  "bg-orange-600": "bg-brand-gold",
  "bg-amber-500": "bg-brand-gold",
  "bg-yellow-400": "bg-brand-gold",
  "bg-yellow-500": "bg-brand-gold",
  "text-orange-500": "text-[#8A3B12]",
  "text-orange-600": "text-[#8A3B12]",
  "text-orange-700": "text-[#8A3B12]",
  "text-amber-600": "text-[#8A3B12]",
  "text-amber-700": "text-[#8A3B12]",
  "border-orange-200": "border-brand-line",
  "border-orange-500": "border-brand-gold",
  // green: positive prices and savings
  "bg-green-50": "bg-brand-mint",
  "bg-green-100": "bg-brand-mint",
  "bg-emerald-50": "bg-brand-mint",
  "bg-green-500": "bg-brand-forest",
  "bg-green-600": "bg-brand-forest",
  "bg-green-700": "bg-brand-forest",
  "text-green-500": "text-[#0B6A30]",
  "text-green-600": "text-[#0B6A30]",
  "text-green-700": "text-[#0B6A30]",
  "text-green-800": "text-[#0B6A30]",
  "text-emerald-600": "text-[#0B6A30]",
  "text-emerald-700": "text-[#0B6A30]",
  "border-green-200": "border-brand-line",
  "border-green-500": "border-brand-forest",
  // hover states on the converted backgrounds
  "hover:bg-blue-700": "hover:bg-brand-forest-soft",
  "hover:bg-blue-800": "hover:bg-brand-forest-soft",
  "hover:bg-indigo-700": "hover:bg-brand-forest-soft",
  "hover:bg-orange-600": "hover:brightness-95",
  "hover:bg-orange-700": "hover:brightness-95",
  "hover:bg-green-700": "hover:bg-brand-forest-soft",
  "hover:bg-gray-50": "hover:bg-white",
  "hover:bg-gray-100": "hover:bg-white",
  "hover:text-blue-700": "hover:text-brand-forest",
  "hover:text-blue-800": "hover:text-brand-forest",
};

const TOKEN =
  /(?<![\w:/-])((?:[a-z0-9-]+:)*)((?:bg|text|border|ring|divide|from|via|to)-(?:gray|slate|zinc|neutral|stone|blue|indigo|sky|orange|amber|yellow|green|emerald|teal|red|rose|purple|violet|pink|cyan)-\d{2,3})(\/\d{1,3})?(?![\w-])/g;

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx|ts)$/.test(name) ? [p] : [];
  });

const files = walk(SRC).filter((f) => !SKIP.some((s) => f.includes(s)) && (!ONLY || f.endsWith(ONLY)));

let changedFiles = 0;
let changedTokens = 0;
const manual = []; // { file, line, text, why }

for (const file of files) {
  const rel = relative(ROOT, file);
  const original = readFileSync(file, "utf8");
  const lines = original.split("\n");
  let fileChanged = 0;

  const out = lines.map((line, i) => {
    const next = line.replace(TOKEN, (whole, variants, core, opacity = "") => {
      const norm = core.replace(new RegExp(`-${GREY}-`), "-gray-");
      const parts = variants.split(":").filter(Boolean);
      const isHover = parts.includes("hover");
      const others = parts.filter((v) => v !== "hover").map((v) => `${v}:`).join("");
      // Hover entries in MAP already carry their own "hover:" prefix.
      const hoverHit = isHover ? MAP[`hover:${norm}`] : undefined;
      const plainHit = MAP[norm];
      if (hoverHit || plainHit) {
        fileChanged++;
        return hoverHit ? `${others}${hoverHit}${opacity}` : `${variants}${plainHit}${opacity}`;
      }
      const why = /^(from|via|to)-/.test(norm)
        ? "gradient: replace the band with bg-brand-forest"
        : /-red-|-rose-/.test(norm)
          ? "error colour: keep or use text-destructive"
          : "no mapping: pick a brand token";
      manual.push({ file: rel, line: i + 1, text: whole, why });
      return whole;
    });
    return next;
  });

  // Flag white-on-gold: a line that now has bg-brand-gold and text-white.
  out.forEach((l, i) => {
    if (l.includes("bg-brand-gold") && /text-white/.test(l)) {
      manual.push({ file: rel, line: i + 1, text: "bg-brand-gold + text-white", why: "white on gold fails contrast: use text-brand-ink" });
    }
    if (/bg-gradient-to-/.test(l)) {
      manual.push({ file: rel, line: i + 1, text: "bg-gradient-to-*", why: "gradient band: use bg-brand-forest with text-brand-cream" });
    }
  });

  if (fileChanged > 0) {
    changedFiles++;
    changedTokens += fileChanged;
    if (WRITE) writeFileSync(file, out.join("\n"));
  }
}

console.log(`${WRITE ? "WROTE" : "DRY RUN"}: ${changedTokens} class tokens in ${changedFiles} of ${files.length} files.`);
if (manual.length) {
  console.log(`\nNeeds a person (${manual.length}):`);
  const byFile = {};
  manual.forEach((m) => (byFile[m.file] ??= []).push(m));
  for (const [f, items] of Object.entries(byFile)) {
    console.log(`\n${f}`);
    items.slice(0, 25).forEach((m) => console.log(`  L${m.line}  ${m.text}  (${m.why})`));
    if (items.length > 25) console.log(`  ... and ${items.length - 25} more`);
  }
}
if (!WRITE) console.log("\nNothing was changed. Re-run with --write to apply.");
