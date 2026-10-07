import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Menu, ChevronDown, MapPin, BarChart2, X, ArrowRight } from "lucide-react";
import HeatingOilLogo from "@/components/heating-oil-logo";

const DROPDOWN_CITIES = [
  { name: "Belfast",  slug: "belfast" },
  { name: "Derry",    slug: "derry" },
  { name: "Bangor",   slug: "bangor" },
  { name: "Newry",    slug: "newry" },
  { name: "Lisburn",  slug: "lisburn" },
  { name: "Armagh",   slug: "armagh" },
  { name: "Coleraine",slug: "coleraine" },
  { name: "Omagh",    slug: "omagh" },
];

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePricesOpen, setMobilePricesOpen] = useState(false);

  const isAuthenticated = !!user;

  const isActive = (prefix: string) =>
    prefix === "/" ? location === "/" : location.startsWith(prefix);

  const linkCls = (prefix: string) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive(prefix)
        ? "text-orange-600 bg-orange-50"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }`;

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity flex-shrink-0">
              <HeatingOilLogo size="md" />
              <span className="text-base font-bold text-gray-900 tracking-tight">NI Heating Oil</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">

              {/* Prices dropdown */}
              <div className="group relative">
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive("/heating-oil-prices") || isActive("/ni-heating-oil-price-index")
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Prices
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Flyout panel */}
                <div className="absolute top-full left-0 mt-1.5 w-72 invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-150 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                    <div className="px-4 pt-3 pb-2">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Prices by area</p>
                    </div>
                    <div className="grid grid-cols-2 gap-px px-2 pb-2">
                      {DROPDOWN_CITIES.map(({ name, slug }) => (
                        <Link
                          key={slug}
                          href={`/heating-oil-prices/${slug}/`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-gray-300 flex-shrink-0" />
                          {name}
                        </Link>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        href="/ni-heating-oil-price-index"
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-orange-600 transition-colors"
                      >
                        <BarChart2 className="w-3 h-3" />
                        NI Price Index
                      </Link>
                      <Link
                        href="/heating-oil-prices"
                        className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        All locations
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/suppliers" className={linkCls("/suppliers")}>Suppliers</Link>
              <Link href="/blog" className={linkCls("/blog")}>Blog</Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {user?.firstName && (
                    <span className="text-sm text-gray-500 hidden sm:block">Hi, {user.firstName}</span>
                  )}
                  <button
                    onClick={() => fetch("/api/logout", { method: "POST" }).then(() => { window.location.href = "/"; })}
                    className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-orange-200"
              >
                Compare prices
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-[300px] bg-white flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 flex-shrink-0">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <HeatingOilLogo size="sm" />
                <span className="font-bold text-gray-900 text-sm">NI Heating Oil</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-0.5">
              <Link href="/" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setMobileOpen(false)}>
                Compare Prices
              </Link>

              {/* Prices accordion */}
              <div>
                <button
                  onClick={() => setMobilePricesOpen(!mobilePricesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Prices by area
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobilePricesOpen ? "rotate-180" : ""}`} />
                </button>
                {mobilePricesOpen && (
                  <div className="mt-1 ml-3 grid grid-cols-2 gap-0.5">
                    {DROPDOWN_CITIES.map(({ name, slug }) => (
                      <Link
                        key={slug}
                        href={`/heating-oil-prices/${slug}/`}
                        className="px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-orange-50 hover:text-orange-700 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {name}
                      </Link>
                    ))}
                    <Link
                      href="/ni-heating-oil-price-index"
                      className="col-span-2 flex items-center gap-1 px-3 py-2 text-sm font-medium text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      NI Price Index
                    </Link>
                    <Link
                      href="/heating-oil-prices"
                      className="col-span-2 flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      All locations →
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/suppliers" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setMobileOpen(false)}>
                Suppliers
              </Link>
              <Link href="/blog" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setMobileOpen(false)}>
                Blog
              </Link>
              <Link href="/about" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setMobileOpen(false)}>
                About
              </Link>
            </nav>

            {/* Bottom actions */}
            <div className="p-4 border-t border-gray-100 space-y-2 flex-shrink-0">
              {isAuthenticated ? (
                <button
                  onClick={() => { setMobileOpen(false); fetch("/api/logout", { method: "POST" }).then(() => { window.location.href = "/"; }); }}
                  className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="block text-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/"
                className="block text-center px-4 py-2.5 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
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
