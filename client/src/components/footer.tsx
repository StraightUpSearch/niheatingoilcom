import { Link } from "wouter";
import { Truck } from "lucide-react";
import HeatingOilLogo from "@/components/heating-oil-logo";
import simonLogo from "@assets/simon-community-ni-2024.png";

export default function Footer() {
  const serviceLinks = [
    { name: "Price Comparison", href: "/compare" },
    { name: "Price Alerts", href: "/alerts" },
    { name: "Supplier Directory", href: "/suppliers" },
    { name: "Price Trends", href: "/compare" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/contact" },
    { name: "Contact Us", href: "/contact" },
    { name: "Report an Issue", href: "/contact" },
    { name: "Supplier Listing", href: "/suppliers" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Data Protection", href: "#" },
    { name: "Disclaimers", href: "#" },
  ];



  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-3">
              <HeatingOilLogo size="sm" className="text-primary" />
              <span className="text-lg font-bold">NI Heating Oil</span>
            </Link>
            <p className="text-gray-400 mb-3 text-xs leading-relaxed">
              Created by a Northern Ireland team exclusively for NI residents. Compare heating oil prices across all six counties with official Consumer Council data.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61576732843247" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/niheatingoil/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@NiHeatingOil" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/ni-heating-oil/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3">Services</h3>
            <ul className="space-y-1 text-gray-400 text-sm">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3">Support</h3>
            <ul className="space-y-1 text-gray-400 text-sm">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3">Our Office</h3>
            <div className="text-gray-400 space-y-1">
              <div className="flex items-start space-x-2">
                <svg className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-gray-300">NI Heating Oil</p>
                  <p className="text-xs">14a Victoria Street</p>
                  <p className="text-xs">Ballymoney, BT53 6DW</p>
                  <p className="text-xs">Northern Ireland</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-gray-800 rounded border border-gray-700">
                <a href="tel:02896005259" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-bold text-lg">028 96005259</span>
                </a>
                <p className="text-xs text-gray-400 mt-1">Call for heating oil quotes & advice</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-3">Legal</h4>
            <ul className="space-y-1 text-gray-400">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-white transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/pages/html-sitemap" className="hover:text-white transition-colors text-sm">
                  HTML Sitemap
                </Link>
              </li>
            </ul>

            {/* Simon Community NI Support */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-xs font-medium text-gray-300">Proudly supporting</span>
              </div>
              <Link 
                to="/giving-back"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src={simonLogo}
                  alt="Simon Community NI"
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-xs text-gray-400 mt-1">
                5% of our profits fund emergency heating grants
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-gray-400">
          <p>
            &copy; 2025 OilPrice NI. All rights reserved. Independent price comparison service for Northern Ireland heating oil consumers.
          </p>
        </div>
      </div>
    </footer>
  );
}