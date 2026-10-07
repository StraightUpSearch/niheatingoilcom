/**
 * REFERENCE: shared building blocks for the inner page rollout.
 *
 * Status: not wired in. Nothing imports this file until you copy it to
 * client/src/components/brand-ui.tsx (HANDOVER.md section 8, step R2).
 * Requires the brand-* Tailwind tokens from tokens/tailwind.extend.snippet.ts.
 *
 * Exports: SupportStrip, PageShell, PageHero, SurfaceCard, SectionHeading,
 *          PostcodeSearchBar, PriceRow, VolumeTabs.
 * Visual source of truth: source/Results.dc.html and source/Town.dc.html.
 */
import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight, MapPin, Phone, X } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export const display = "font-display font-extrabold";
export const gbp = (n: number) => `£${n.toFixed(2)}`;
const SUPPORT_URL = "https://www.nidirect.gov.uk/articles/affordable-warmth-scheme";

/* ------------------------------------------------------------------ */
/* Support strip (renders above the nav on every page)                */
/* ------------------------------------------------------------------ */

export function SupportStrip() {
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem("hideGovBanner") !== "1";
    } catch {
      return true;
    }
  });
  if (!show) return null;
  const dismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem("hideGovBanner", "1");
    } catch {
      /* private mode: the strip simply returns next visit */
    }
  };
  return (
    <div className="border-b-[1.5px] border-brand-forest bg-brand-mint text-brand-forest">
      <div className="mx-auto flex max-w-[1200px] items-center justify-end gap-3 px-4 py-2.5 text-sm font-medium sm:px-8">
        <p>
          You may be eligible for heating oil support.{" "}
          <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4">
            Check if you qualify
          </a>
        </p>
        <button onClick={dismiss} aria-label="Dismiss" className="flex h-11 w-11 flex-none items-center justify-center rounded-md hover:bg-brand-forest/10">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PageShell: strip, nav, content, footer on a cream page             */
/* ------------------------------------------------------------------ */

export function PageShell({ children, strip = true }: { children: ReactNode; strip?: boolean }) {
  return (
    <div className="min-h-screen bg-brand-cream font-body text-brand-ink">
      {strip && <SupportStrip />}
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PageHero: compact forest band with breadcrumb, H1 and optional     */
/* children (search bar, CTA). `overlap` lets the next section pull   */
/* up over the band, as on the results and town pages.                */
/* ------------------------------------------------------------------ */

export interface Crumb {
  label: string;
  href?: string;
}

export function PageHero({
  crumbs,
  title,
  accent,
  intro,
  children,
  overlap = true,
}: {
  crumbs?: Crumb[];
  title: ReactNode; // plain text before the accent
  accent?: string; // the word or phrase set in lime
  intro?: ReactNode;
  children?: ReactNode;
  overlap?: boolean;
}) {
  return (
    <section className="bg-brand-forest text-brand-cream">
      <div className={`mx-auto max-w-[1200px] px-4 pt-6 sm:px-8 sm:pt-10 ${overlap ? "pb-[88px] sm:pb-[104px]" : "pb-10 sm:pb-14"}`}>
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 text-sm text-[#A9C7B1]">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <span key={c.label} className="flex items-center gap-2">
                  {c.href && !last ? (
                    <Link href={c.href} className="py-2.5 underline underline-offset-[3px]">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current={last ? "page" : undefined} className="font-semibold text-brand-cream">
                      {c.label}
                    </span>
                  )}
                  {!last && <span aria-hidden="true">/</span>}
                </span>
              );
            })}
          </nav>
        )}
        <h1 className={`${display} mt-3 text-[clamp(38px,5.4vw,64px)] leading-none tracking-[-0.04em] [text-wrap:balance]`}>
          {title}
          {accent && <span className="text-brand-lime">{accent}</span>}
        </h1>
        {intro && <p className="mt-4 max-w-[560px] text-[clamp(16px,1.5vw,19px)] leading-normal text-[#CFE3D3]">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section wrapper that pulls up over the hero                        */
/* ------------------------------------------------------------------ */

export function OverlapSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`relative mx-auto -mt-14 max-w-[1200px] px-4 sm:-mt-16 sm:px-8 ${className}`}>{children}</section>;
}

/* ------------------------------------------------------------------ */
/* SurfaceCard: tone decides the fill. No coloured left rails.        */
/* ------------------------------------------------------------------ */

const TONES = {
  paper: "border-[1.5px] border-brand-line bg-brand-paper",
  butter: "border-2 border-brand-forest bg-brand-butter text-[#2C3A1F]",
  mint: "border-2 border-brand-forest bg-brand-mint text-brand-forest",
  forest: "bg-brand-forest text-brand-cream",
} as const;

export function SurfaceCard({
  tone = "paper",
  radius = "card",
  className = "",
  children,
}: {
  tone?: keyof typeof TONES;
  radius?: "row" | "card" | "board" | "panel";
  className?: string;
  children: ReactNode;
}) {
  const r = { row: "rounded-3xl", card: "rounded-[28px]", board: "rounded-[32px]", panel: "rounded-[36px]" }[radius];
  return <div className={`${TONES[tone]} ${r} p-6 ${className}`}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* SectionHeading                                                     */
/* ------------------------------------------------------------------ */

export function SectionHeading({ children, intro, id }: { children: ReactNode; intro?: ReactNode; id?: string }) {
  return (
    <div>
      <h2 id={id} className={`${display} text-[clamp(30px,3.8vw,44px)] leading-none tracking-[-0.035em] text-brand-forest [text-wrap:balance]`}>
        {children}
      </h2>
      {intro && <p className="mt-3.5 max-w-[560px] text-[17px] leading-normal text-brand-muted">{intro}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VolumeTabs: tank size buttons, used by the search bar and the board */
/* ------------------------------------------------------------------ */

export const VOLUMES = [300, 500, 900, 1000] as const;

export function VolumeTabs({ volume, onChange, labelId }: { volume: number; onChange: (v: number) => void; labelId: string }) {
  return (
    <div role="group" aria-labelledby={labelId} className="grid grid-cols-4 gap-2">
      {VOLUMES.map((v) => {
        const on = v === volume;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(v)}
            className={`h-14 rounded-[14px] border-[1.5px] font-price text-[15px] font-semibold hover:brightness-95 ${
              on ? "border-brand-forest bg-brand-forest text-brand-cream" : "border-brand-line bg-white text-brand-ink"
            }`}
          >
            {v}L
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PostcodeSearchBar: the one search control for results and town     */
/* pages. The homepage keeps its larger Hero form.                    */
/* Keep trackPriceSearch in the parent's onSubmit.                    */
/* ------------------------------------------------------------------ */

export function PostcodeSearchBar({
  postcode,
  setPostcode,
  volume,
  setVolume,
  onSubmit,
  submitLabel = "Update prices",
}: {
  postcode: string;
  setPostcode: (v: string) => void;
  volume: number;
  setVolume: (v: number) => void;
  onSubmit: (e: FormEvent) => void;
  submitLabel?: string;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-7 flex max-w-[960px] flex-wrap items-end gap-4 rounded-3xl bg-brand-card p-4 text-brand-ink sm:p-[22px]">
      <div className="flex min-w-[200px] flex-[1_1_200px] flex-col gap-1.5">
        <label htmlFor="bar-postcode" className="text-sm font-semibold">
          Your BT postcode
        </label>
        <input
          id="bar-postcode"
          type="text"
          autoComplete="postal-code"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          className="h-14 w-full rounded-[14px] border-[1.5px] border-brand-line bg-white px-[18px] text-lg font-medium outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2"
        />
      </div>
      <div className="flex min-w-[260px] flex-[1_1_300px] flex-col gap-1.5">
        <span id="bar-tank" className="text-sm font-semibold">
          Tank size
        </span>
        <VolumeTabs volume={volume} onChange={setVolume} labelId="bar-tank" />
      </div>
      <button type="submit" className="h-14 flex-none rounded-[14px] bg-brand-gold px-7 text-[17px] font-bold text-brand-ink hover:brightness-95">
        {submitLabel}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* PriceRow: one supplier. Same markup as the homepage list so the    */
/* three places (home, results, town) never drift apart.              */
/* ------------------------------------------------------------------ */

export interface PriceRowData {
  id: number;
  name: string;
  serves?: string; // supplier.coverageAreas
  price: number; // pounds for the chosen volume
  pricePerLitre: number; // pounds, as the API returns it
  phone?: string;
  website?: string;
  profileHref?: string; // /supplier/:id
}

export function PriceRow({
  row,
  isCheapest,
  average,
  showServes = true,
}: {
  row: PriceRowData;
  isCheapest?: boolean;
  average?: number; // NI average for the same volume
  showServes?: boolean;
}) {
  const diff = average ? average - row.price : 0;
  return (
    <li
      className={`flex flex-wrap items-center gap-x-6 gap-y-4 rounded-3xl border-2 px-6 py-5 ${
        isCheapest ? "border-brand-forest bg-brand-butter" : "border-brand-line bg-brand-paper"
      }`}
    >
      <div className="flex min-w-[220px] flex-1 items-center gap-4">
        <div aria-hidden="true" className={`${display} flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-forest text-xl text-brand-lime`}>
          {row.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className={`${display} text-[21px] tracking-[-0.015em]`}>{row.name}</span>
            {isCheapest && <span className="rounded-full bg-brand-forest px-2.5 py-1 text-xs font-bold uppercase tracking-[0.05em] text-brand-lime">Cheapest</span>}
          </div>
          {showServes && row.serves && (
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[#44502A]">
              <MapPin className="h-[15px] w-[15px] flex-none" aria-hidden="true" />
              <span>Serves {row.serves}</span>
            </div>
          )}
        </div>
      </div>

      <div className="text-right sm:w-[190px]">
        <div className="font-price text-[30px] font-semibold tracking-[-0.02em] text-brand-forest">{gbp(row.price)}</div>
        <div className="mt-1 text-[13px] text-[#44502A]">{(row.pricePerLitre * 100).toFixed(1)}p per litre</div>
        {average ? (
          <div className={`mt-0.5 text-[13px] font-semibold ${diff > 0.005 ? "text-[#0B6A30]" : diff < -0.005 ? "text-[#8A3B12]" : "text-brand-muted"}`}>
            {diff > 0.005 ? `${gbp(diff)} under average` : diff < -0.005 ? `${gbp(-diff)} above NI average` : "At the NI average"}
          </div>
        ) : null}
      </div>

      <div className="flex flex-none gap-2">
        {row.phone && (
          <a href={`tel:${row.phone.replace(/\s/g, "")}`} className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-forest px-5 text-[15px] font-semibold text-brand-cream hover:brightness-95">
            <Phone className="h-4 w-4" aria-hidden="true" /> Call
          </a>
        )}
        {row.website && (
          <a href={row.website} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center rounded-xl border-2 border-brand-forest px-5 text-[15px] font-semibold text-brand-forest hover:bg-white">
            Website
          </a>
        )}
        {row.profileHref && (
          <Link href={row.profileHref} className="inline-flex h-12 items-center rounded-xl border-2 border-brand-forest px-5 text-[15px] font-semibold text-brand-forest hover:bg-white">
            Profile
          </Link>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* CtaBand: forest panel with one gold button (alerts, compare)       */
/* ------------------------------------------------------------------ */

export function CtaBand({ title, accent, text, href, label }: { title: string; accent: string; text: string; href: string; label: string }) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6 rounded-[36px] bg-brand-forest p-7 text-brand-cream sm:p-14">
        <div className="min-w-[280px] flex-1">
          <h2 className={`${display} text-[clamp(28px,3.6vw,44px)] leading-none tracking-[-0.035em] [text-wrap:balance]`}>
            {title} <span className="text-brand-lime">{accent}</span>
          </h2>
          <p className="mt-3.5 max-w-[460px] text-[17px] leading-normal text-[#CFE3D3]">{text}</p>
        </div>
        <Link href={href} className="inline-flex h-[60px] flex-none items-center justify-center gap-2.5 rounded-[14px] bg-brand-gold px-8 text-lg font-bold text-brand-ink hover:brightness-95">
          {label} <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
