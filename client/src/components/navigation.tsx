import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Menu, ChevronDown, MapPin, BarChart2, X, ArrowRight } from "lucide-react";
import HeatingOilLogo from "@/components/heating-oil-logo";

const DROPDOWN_CITIES = [
  { name: "Belfast",   slug: "belfast" },
  { name: "Derry",     slug: "derry" },
  { name: "Bangor",    slug: "bangor" },
  { name: "Newry",     slug: "newry" },
  { name: "Lisburn",   slug: "lisburn" },
  { name: "Armagh",    slug: "armagh" },
  { name: "Coleraine", slug: "coleraine" },
  { name: "Omagh",     slug: "omagh" },
];

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePricesOpen, setMobilePricesOpen] = useState(false);

  const isAuthenticated = !!user;

  const isActive = (prefix: string) =>
    prefix === "/" ? location === "/" : location.startsWith(prefix);

  const isPricesActive =
    isActive("/heating-oil-prices") || isActive("/ni-heating-oil-price-index");

  const linkCls = (prefix: string) =>
    `flex items-center h-11 px-3 text-base font-semibold rounded-lg transition-colors ${
      isActive(prefix)
        ? "text-brand-forest bg-brand-mint"
        : "text-brand-forest hover:bg-brand-mint"
    }`;

  return (
    <>
      <header className="bg-brand-cream sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">

            {/* Logo + wordmark */}
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity flex-shrink-0">
              <HeatingOilLogo size="md" />
              <span className="font-display font-extrabold text-[23px] tracking-[-0.025em] text-brand-forest">
                NI Heating Oil
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">

              {/* Prices dropdown */}
              <div className="group relative">
                <button
                  className={`flex items-center gap-1 h-11 px-3 text-base font-semibold rounded-lg transition-colors ${
                    isPricesActive
                      ? "text-brand-forest bg-brand-mint"
                      : "text-brand-forest hover:bg-brand-mint"
                  }`}
                  aria-current={isPricesActive ? "page" : undefined}
                >
                  Prices
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Flyout */}
                <div className="absolute top-full left-0 mt-1.5 w-72 invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-150 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-brand-paper rounded-2xl border border-brand-line shadow-xl shadow-brand-ink/5 overflow-hidden">
                    <div className="px-4 pt-3 pb-2">
                      <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest">Prices by area</p>
                    </div>
                    <div className="grid grid-cols-2 gap-px px-2 pb-2">
                      {DROPDOWN_CITIES.map(({ name, slug }) => (
                        <Link
                          key={slug}
                          href={`/heating-oil-prices/${slug}/`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-ink hover:bg-brand-mint transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-brand-muted flex-shrink-0" />
                          {name}
                        </Link>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 bg-brand-cream border-t border-brand-line flex items-center justify-between">
                      <Link
                        href="/ni-heating-oil-price-index"
                        className="flex items-center gap-1.5 text-xs font-medium text-brand-muted hover:text-brand-forest transition-colors"
                      >
                        <BarChart2 className="w-3 h-3" />
                        NI Price Index
                      </Link>
                      <Link
                        href="/heating-oil-prices"
                        className="flex items-center gap-1 text-xs font-semibold text-brand-forest hover:opacity-75 transition-opacity"
                      >
                        All locations
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/suppliers" className={linkCls("/suppliers")}>Suppliers</Link>
              <Link href="/compare-heating" className={linkCls("/compare-heating")}>Compare Fuels</Link>
              <Link href="/blog" className={linkCls("/blog")}>Blog</Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {user?.firstName && (
                    <span className="text-sm text-brand-muted hidden sm:block">Hi, {user.firstName}</span>
                  )}
                  <button
                    onClick={() => fetch("/api/logout", { method: "POST" }).then(() => { window.location.href = "/"; })}
                    className="hidden sm:inline-flex items-center h-11 px-3 text-base font-semibold text-brand-forest rounded-lg hover:bg-brand-mint transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="hidden sm:inline-flex items-center h-11 px-3 text-base font-semibold text-brand-forest rounded-lg hover:bg-brand-mint transition-colors"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 h-[46px] px-5 bg-brand-forest text-brand-cream font-bold rounded-xl hover:brightness-95 active:translate-y-px transition-[filter,transform]"
              >
                Compare prices
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg text-brand-forest hover:bg-brand-mint transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-[300px] bg-brand-cream flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-20 border-b border-brand-line flex-shrink-0">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <HeatingOilLogo size="sm" />
                <span className="font-display font-extrabold text-[18px] tracking-[-0.025em] text-brand-forest">NI Heating Oil</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-brand-forest hover:bg-brand-mint transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-0.5">
              <Link
                href="/"
                className="flex items-center h-11 px-3 text-base font-semibold text-brand-forest rounded-lg hover:bg-brand-mint transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Compare Prices
              </Link>

              {/* Prices accordion */}
              <div>
                <button
                  onClick={() => setMobilePricesOpen(!mobilePricesOpen)}
                  className="w-full flex items-center justify-between h-11 px-3 text-base font-semibold text-brand-forest rounded-lg hover:bg-brand-mint transition-colors"
                >
                  Prices by area
                  <ChevronDown className={`w-4 h-4 text-brand-muted transition-transform duration-200 ${mobilePricesOpen ? "rotate-180" : ""}`} />
                </button>
                {mobilePricesOpen && (
                  <div className="mt-1 ml-3 grid grid-cols-2 gap-0.5">
                    {DROPDOWN_CITIES.map(({ name, slug }) => (
                      <Link
                        key={slug}
                        href={`/heating-oil-prices/${slug}/`}
                        className="px-3 py-2 text-sm font-medium text-brand-forest rounded-lg hover:bg-brand-mint transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {name}
                      </Link>
                    ))}
                    <Link
                      href="/ni-heating-oil-price-index"
                      className="col-span-2 flex items-center gap-1 px-3 py-2 text-sm font-semibold text-brand-forest rounded-lg hover:bg-brand-mint transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      NI Price Index
                    </Link>
                    <Link
                      href="/heating-oil-prices"
                      className="col-span-2 flex items-center gap-1 px-3 py-2 text-sm font-medium text-brand-muted rounded-lg hover:bg-brand-mint transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      All locations →
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/suppliers" className="flex items-center h-11 px-3 text-base font-semibold text-brand-forest rounded-lg hover:bg-brand-mint transition-colors" onClick={() => setMobileOpen(false)}>
                Suppliers
              </Link>
              <Link href="/compare-heating" className="flex items-center h-11 px-3 text-base font-semibold text-brand-forest rounded-lg hover:bg-brand-mint transition-colors" onClick={() => setMobileOpen(false)}>
                Compare Fuels
              </Link>
              <Link href="/blog" className="flex items-center h-11 px-3 text-base font-semibold text-brand-forest rounded-lg hover:bg-brand-mint transition-colors" onClick={() => setMobileOpen(false)}>
                Blog
              </Link>
              <Link href="/about" className="flex items-center h-11 px-3 text-base font-semibold text-brand-forest rounded-lg hover:bg-brand-mint transition-colors" onClick={() => setMobileOpen(false)}>
                About
              </Link>
            </nav>

            {/* Bottom actions */}
            <div className="p-4 border-t border-brand-line space-y-2 flex-shrink-0">
              {isAuthenticated ? (
                <button
                  onClick={() => { setMobileOpen(false); fetch("/api/logout", { method: "POST" }).then(() => { window.location.href = "/"; }); }}
                  className="w-full flex items-center justify-center h-11 px-4 text-base font-semibold text-brand-forest border-2 border-brand-forest rounded-xl hover:bg-brand-mint transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="block text-center h-11 leading-[44px] text-base font-semibold text-brand-forest border-2 border-brand-forest rounded-xl hover:bg-brand-mint transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/"
                className="block text-center h-[46px] leading-[46px] text-base font-bold bg-brand-forest text-brand-cream rounded-xl hover:brightness-95 transition-[filter]"
                onClick={() => setMobileOpen(false)}
              >
                Compare prices now
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
