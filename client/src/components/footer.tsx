import { Link } from "wouter";
import HeatingOilLogo from "@/components/heating-oil-logo";
import simonLogo from "@assets/simon-community-ni-2024.png";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61576732843247",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/niheatingoil/",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@NiHeatingOil",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/ni-heating-oil/",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-forest text-brand-cream">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 hover:opacity-80 transition-opacity">
              <HeatingOilLogo size="sm" />
              <span className="font-display font-extrabold text-[18px] tracking-[-0.025em]">NI Heating Oil</span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: "#CFE3D3" }}>
              Northern Ireland's independent heating oil price comparison service. Compare suppliers across all six counties — free to use.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-brand-forest-line"
                  style={{ backgroundColor: "#1A4A2E", color: "#A9C7B1" }}
                  aria-label={name}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Prices column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#A9C7B1" }}>Prices</h3>
            <ul className="space-y-2.5">
              {[
                { name: "Compare Prices",     href: "/" },
                { name: "NI Price Index",     href: "/ni-heating-oil-price-index" },
                { name: "Heating Oil Prices", href: "/heating-oil-prices" },
                { name: "Price Alerts",       href: "/alerts" },
                { name: "Supplier Directory", href: "/suppliers" },
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link href={href} className="text-sm transition-colors hover:text-brand-cream" style={{ color: "#CFE3D3" }}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#A9C7B1" }}>Locations</h3>
            <ul className="space-y-2.5">
              {[
                { name: "Belfast",   slug: "belfast" },
                { name: "Derry",     slug: "derry" },
                { name: "Bangor",    slug: "bangor" },
                { name: "Newry",     slug: "newry" },
                { name: "Ballymena", slug: "ballymena" },
                { name: "Coleraine", slug: "coleraine" },
              ].map(({ name, slug }) => (
                <li key={slug}>
                  <Link
                    href={`/heating-oil-prices/${slug}/`}
                    className="text-sm transition-colors hover:text-brand-cream"
                    style={{ color: "#CFE3D3" }}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#A9C7B1" }}>Company</h3>
            <ul className="space-y-2.5">
              {[
                { name: "About Us",    href: "/about" },
                { name: "Blog",        href: "/blog" },
                { name: "Contact",     href: "/contact" },
                { name: "Giving Back", href: "/giving-back" },
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link href={href} className="text-sm transition-colors hover:text-brand-cream" style={{ color: "#CFE3D3" }}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + charity column */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#A9C7B1" }}>Contact</h3>
            <address className="not-italic text-sm space-y-0.5 mb-4" style={{ color: "#CFE3D3" }}>
              <p className="font-medium text-brand-cream">NI Heating Oil</p>
              <p>14a Victoria Street</p>
              <p>Ballymoney, BT53 6DW</p>
            </address>
            <a
              href="tel:02896005259"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-cream hover:opacity-75 transition-opacity mb-5"
            >
              <svg className="h-4 w-4" style={{ color: "#FFC83D" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              028 96005259
            </a>

            {/* Charity badge */}
            <div className="p-3 rounded-xl border" style={{ backgroundColor: "#1A4A2E", borderColor: "#2F6A45" }}>
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="h-3.5 w-3.5" fill="#FFC83D" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="text-[11px] font-medium" style={{ color: "#CFE3D3" }}>Proudly supporting</span>
              </div>
              <Link href="/giving-back" className="inline-block hover:opacity-80 transition-opacity">
                <img src={simonLogo} alt="Simon Community NI" className="h-8 w-auto" />
              </Link>
              <p className="text-[11px] mt-1.5" style={{ color: "#A9C7B1" }}>5% of profits fund emergency heating grants</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: "#2F6A45" }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-center sm:text-left" style={{ color: "#A9C7B1" }}>
            &copy; {year} NI Heating Oil. Independent price comparison for Northern Ireland.
          </p>
          <div className="flex items-center gap-4">
            {[
              { name: "Privacy Policy", href: "/contact" },
              { name: "Terms of Use",   href: "/contact" },
              { name: "Disclaimer",     href: "/contact" },
              { name: "Site Map",       href: "/sitemap" },
            ].map(({ name, href }) => (
              <Link key={name} href={href} className="text-xs transition-colors hover:text-brand-cream" style={{ color: "#A9C7B1" }}>
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
