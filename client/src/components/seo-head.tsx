import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object | object[];
  noindex?: boolean;
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "https://niheatingoil.com/og-image.jpg",
  structuredData,
  noindex = false,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noindex ? 'noindex,follow' : 'index,follow');

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:site_name', 'NI Heating Oil', 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', ogImage, 'name');

    // Canonical URL
    if (canonicalUrl) {
      updateLinkTag('canonical', canonicalUrl);
    }

    // Structured data
    if (structuredData) {
      updateStructuredData(structuredData);
    }

    // Viewport and mobile optimization
    updateMetaTag('viewport', 'width=device-width, initial-scale=1');
    updateMetaTag('format-detection', 'telephone=no');

  }, [title, description, keywords, canonicalUrl, ogImage, structuredData]);

  return null;
}

function updateMetaTag(name: string, content: string, attribute: string = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function updateStructuredData(data: object | object[]) {
  // Remove existing structured data
  document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());

  // Add new structured data — support arrays of schemas
  const items = Array.isArray(data) ? data : [data];
  for (const item of items) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  }
}