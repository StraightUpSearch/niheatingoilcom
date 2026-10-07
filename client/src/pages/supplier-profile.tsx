import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Phone, Globe, Clock, TrendingUp, Award, Shield, CheckCircle } from "lucide-react";
import { Supplier, OilPrice } from "@shared/schema";
import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
// import { ClaimListingDialog } from "@/components/claim-listing-dialog";

interface SupplierWithPrices extends Supplier {
  prices: OilPrice[];
  averageRating?: number;
  totalReviews?: number;
  lastUpdated?: string;
}

const isNumeric = (s: string) => /^\d+$/.test(s);

function QuoteForm({ supplierName, supplierPhone, supplierWebsite }: { supplierName: string; supplierPhone?: string | null; supplierWebsite?: string | null }) {
  const [form, setForm] = useState({ name: "", email: "", postcode: "", volume: "500" });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: object) =>
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(r => { if (!r.ok) throw new Error("failed"); return r.json(); }),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-2">
          <CheckCircle className="h-8 w-8 text-[#0B6A30] mx-auto" />
          <p className="font-medium text-brand-ink">Request sent!</p>
          <p className="text-sm text-brand-muted">We've passed your details to {supplierName}. They'll be in touch shortly.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-brand-line bg-brand-butter">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Get a quote from {supplierName}</CardTitle>
        <CardDescription>Free, no obligation. Takes 30 seconds.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          className="w-full border border-brand-line rounded-md px-3 py-2 text-sm bg-white"
          placeholder="Your name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full border border-brand-line rounded-md px-3 py-2 text-sm bg-white"
          placeholder="Email address"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <div className="flex gap-2">
          <input
            className="flex-1 border border-brand-line rounded-md px-3 py-2 text-sm bg-white"
            placeholder="BT postcode"
            value={form.postcode}
            onChange={e => setForm({ ...form, postcode: e.target.value })}
          />
          <select
            className="border border-brand-line rounded-md px-3 py-2 text-sm bg-white"
            value={form.volume}
            onChange={e => setForm({ ...form, volume: e.target.value })}
          >
            <option value="300">300L</option>
            <option value="500">500L</option>
            <option value="900">900L</option>
            <option value="1000">1000L</option>
          </select>
        </div>
        <Button
          className="w-full bg-brand-gold hover:brightness-95 text-white"
          disabled={mutation.isPending || !form.name || !form.email || !form.postcode}
          onClick={() => mutation.mutate({
            name: form.name,
            email: form.email,
            phone: "",
            postcode: form.postcode.toUpperCase(),
            volume: parseInt(form.volume),
            supplierName,
            status: "new",
          })}
        >
          {mutation.isPending ? "Sending..." : "Request a quote"}
        </Button>
        {mutation.isError && <p className="text-xs text-red-500 text-center">Something went wrong. Please try again.</p>}
      </CardContent>
    </Card>
  );
}

export default function SupplierProfile() {
  const { supplierId } = useParams<{ supplierId: string }>();
  const [showClaimDialog, setShowClaimDialog] = useState(false);

  const apiPath = supplierId
    ? isNumeric(supplierId)
      ? `/api/suppliers/${supplierId}`
      : `/api/suppliers/by-slug/${supplierId}`
    : null;

  const { data: supplier, isLoading, error } = useQuery<SupplierWithPrices>({
    queryKey: [apiPath],
    enabled: !!apiPath,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-forest mx-auto mb-4"></div>
          <p className="text-brand-muted">Loading supplier information...</p>
        </div>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-ink mb-2">Supplier Not Found</h1>
          <p className="text-brand-muted mb-4">The supplier you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const currentPrices = supplier.prices?.filter(price => {
    const priceDate = new Date(price.createdAt || new Date());
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return priceDate > weekAgo;
  }) || [];

  const volumes = [300, 500, 900];
  const pricesByVolume = volumes.reduce((acc, volume) => {
    const price = currentPrices.find(p => p.volume === volume);
    acc[volume] = price ? parseFloat(price.price).toFixed(2) : 'N/A';
    return acc;
  }, {} as Record<number, string>);

  const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const supplierSlug = toSlug(supplier.name);
  const canonicalUrl = `https://niheatingoil.com/supplier/${supplierSlug}/`;
  const seoTitle = `${supplier.name} — Heating Oil Prices & Coverage | NI Heating Oil`;
  const seoDescription = `Current heating oil prices from ${supplier.name}. Compare 300L, 500L and 900L quotes. Serving ${supplier.location}, Northern Ireland.`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niheatingoil.com" },
        { "@type": "ListItem", "position": 2, "name": "Suppliers", "item": "https://niheatingoil.com/suppliers" },
        { "@type": "ListItem", "position": 3, "name": supplier.name, "item": canonicalUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": supplier.name,
      "url": canonicalUrl,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": supplier.location,
        "addressRegion": "Northern Ireland",
        "addressCountry": "GB"
      },
      ...(supplier.phone ? { "telephone": supplier.phone } : {}),
      ...(supplier.website ? { "sameAs": supplier.website } : {}),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />
      <Navigation />
      
      {/* Supplier Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold">{supplier.name}</h1>
                <Badge className="bg-brand-forest-soft hover:bg-brand-forest text-white">
                  <Shield className="h-3 w-3 mr-1" />
                  Listed
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-[#CFE3D3]">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{supplier.location}</span>
                </div>
                {supplier.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                {supplier.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a href={supplier.website} target="_blank" rel="noopener noreferrer" 
                       className="hover:text-white underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {supplier.averageRating && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(supplier.averageRating!) ? 'text-yellow-400 fill-yellow-400' : 'text-brand-line'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm">
                    {supplier.averageRating.toFixed(1)} ({supplier.totalReviews} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowClaimDialog(true)}
                className="bg-brand-gold hover:bg-yellow-600 text-black font-medium"
              >
                <Award className="h-4 w-4 mr-2" />
                Claim This Listing
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-brand-forest">
                Contact Supplier
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Current Prices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#0B6A30]" />
                  Current Heating Oil Prices
                </CardTitle>
                <CardDescription>
                  Latest prices from {supplier.name} • Updated {supplier.lastUpdated || 'recently'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {volumes.map((volume) => (
                    <div key={volume} className="text-center p-4 bg-brand-cream rounded-lg">
                      <div className="text-2xl font-bold text-brand-forest">
                        {pricesByVolume[volume] === 'N/A' ? 'N/A' : `£${pricesByVolume[volume]}`}
                      </div>
                      <div className="text-sm text-brand-muted mt-1">
                        {volume}L delivery
                      </div>
                      {pricesByVolume[volume] !== 'N/A' && (
                        <div className="text-xs text-brand-muted mt-1">
                          {(parseFloat(pricesByVolume[volume]) / volume * 100).toFixed(1)}p per litre
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {currentPrices.length === 0 && (
                  <div className="text-center py-8 text-brand-muted">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-brand-line" />
                    <p className="text-lg font-medium mb-1">No Recent Prices Available</p>
                    <p className="text-sm">We haven't received updated pricing from this supplier recently.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supplier Information */}
            <Card>
              <CardHeader>
                <CardTitle>About {supplier.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-brand-ink mb-2">Service Areas</h4>
                    <p className="text-brand-muted">{supplier.location} and surrounding areas</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-brand-ink mb-2">Delivery Volumes</h4>
                    <div className="flex flex-wrap gap-1">
                      {volumes.map((volume) => (
                        <Badge key={volume} variant="secondary">
                          {volume}L
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-brand-ink mb-2">Business Information</h4>
                  <div className="space-y-2 text-sm text-brand-muted">
                    {supplier.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <a href={supplier.website} target="_blank" rel="noopener noreferrer" 
                           className="text-brand-forest hover:underline">
                          {supplier.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Serving {supplier.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BT postcode coverage links */}
            {supplier.coverageAreas && (() => {
              let postcodes: string[] = [];
              try {
                const parsed = JSON.parse(supplier.coverageAreas);
                if (Array.isArray(parsed)) postcodes = parsed;
              } catch {
                postcodes = supplier.coverageAreas.split(/[\s,]+/).filter(Boolean);
              }
              const btPostcodes = postcodes.filter(p => /^bt\d+$/i.test(p.trim()));
              if (btPostcodes.length === 0) return null;
              return (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Heating oil prices by postcode</CardTitle>
                    <CardDescription>See current prices for each area {supplier.name} covers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {btPostcodes.map(pc => {
                        const slug = pc.toLowerCase().replace(/\s+/g, "");
                        return (
                          <Link
                            key={slug}
                            href={`/heating-oil-prices/${slug}/`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-muted bg-muted hover:bg-brand-line rounded-full transition-colors"
                          >
                            <MapPin className="w-3 h-3" />
                            {pc.toUpperCase()}
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Quote Request Form */}
            <QuoteForm supplierName={supplier.name} supplierPhone={supplier.phone} supplierWebsite={supplier.website} />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {supplier.phone && (
                  <Button className="w-full" variant="outline" asChild>
                    <a href={`tel:${supplier.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call {supplier.phone}
                    </a>
                  </Button>
                )}
                {supplier.website && (
                  <Button className="w-full" variant="outline" asChild>
                    <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
                <Button
                  className="w-full bg-brand-gold hover:bg-yellow-600 text-black"
                  onClick={() => setShowClaimDialog(true)}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Claim Listing
                </Button>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trust & Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-[#0B6A30]" />
                  <span className="text-brand-muted">Consumer Council Listed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-brand-forest" />
                  <span className="text-brand-muted">NI Heating Oil Network</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-brand-forest" />
                  <span className="text-brand-muted">Listed Supplier</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Claim Listing Dialog - Temporarily disabled */}
      {/* <ClaimListingDialog 
        supplier={supplier}
        open={showClaimDialog}
        onOpenChange={setShowClaimDialog}
      /> */}
      
      <Footer />
    </div>
  );
}