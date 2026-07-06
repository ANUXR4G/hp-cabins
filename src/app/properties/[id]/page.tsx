'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronRight, Phone, CheckCircle2, MessageSquare
} from 'lucide-react';
import { propertiesData, Property } from '@/data/properties';
import PropertyCard from '@/components/PropertyCard';
import ProductMediaGallery from '@/components/ProductMediaGallery';
import ProductVideosSection from '@/components/ProductVideosSection';
import { getCms } from '@/lib/cms';

const cms = getCms();

interface PageProps {
  params?: Promise<{ id: string }>;
}

export default function PropertyDetailsPage(_props: PageProps) {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewingFormSubmitted, setViewingFormSubmitted] = useState(false);

  useEffect(() => {
    const list = (cms.products as Property[]) || propertiesData;
    const found = list.find((p) => p.id === id);
    if (found) {
      setProperty(found);
      setSimilarProperties(list.filter((p) => p.id !== found.id && p.category === found.category).slice(0, 2));
    }
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto space-y-4">
        <h2 className="text-xl font-bold font-display text-premium-black">Loading product...</h2>
        <p className="text-base text-gray-500">Please wait...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto space-y-4">
        <h2 className="text-xl font-bold font-display text-premium-black">Model Not Found</h2>
        <p className="text-base text-gray-500">The product you are trying to view does not exist or has been removed.</p>
        <Link href="/properties" className="bg-crimson text-white text-sm font-bold uppercase py-3.5 px-6 rounded-none inline-block">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24 font-sans text-premium-black">
      
      {/* Breadcrumb banner */}
      <div className="bg-white border-b border-gray-200/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 font-bold">
            <Link href="/" className="hover:text-crimson transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <Link href="/properties" className="hover:text-crimson transition-colors">Cabin Catalog</Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-crimson font-extrabold">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

          {/* Product content — HP Cabins structure */}
          <div className="lg:col-span-8 space-y-8">

            <h1 className="section-title text-premium-black leading-tight">
              {property.title}
            </h1>

            <ProductMediaGallery
              title={property.title}
              category={property.category}
              badge={property.badge}
              images={property.images}
              productId={property.id}
            />

            {/* Tagline & Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-none border border-gray-200/60 space-y-4">
              {property.tagline && (
                <h2 className="text-xl sm:text-2xl font-extrabold font-display text-crimson leading-snug">
                  {property.tagline}
                </h2>
              )}
              <p className="text-base leading-relaxed text-gray-600">
                {property.overview || property.description}
              </p>
            </div>

            {/* Product Features */}
            {(property.featureCards?.length ?? 0) > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-none border border-gray-200/60 space-y-6">
                <h2 className="text-lg font-bold uppercase border-l-2 border-crimson pl-3 text-premium-black font-display">
                  Product Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.featureCards!.map((card) => (
                    <div key={card.title} className="bg-gray-50 p-5 rounded-none border border-gray-100 space-y-3">
                      <h3 className="text-sm font-bold text-crimson">{card.title}</h3>
                      <ul className="space-y-2">
                        {card.points.map((point) => (
                          <li key={point} className="flex gap-2 text-base text-gray-600 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-crimson shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Benefits */}
            {(property.keyBenefits?.length ?? 0) > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-none border border-gray-200/60 space-y-4">
                <h2 className="text-lg font-bold uppercase border-l-2 border-crimson pl-3 text-premium-black font-display">
                  Key Benefits
                </h2>
                <ul className="space-y-3">
                  {property.keyBenefits!.map((benefit) => (
                    <li key={benefit.title} className="flex gap-3 text-base text-gray-600 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-crimson shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-premium-black font-semibold">{benefit.title}</strong>
                        {benefit.description ? ` — ${benefit.description}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Applications */}
            {(property.applications?.length ?? 0) > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-none border border-gray-200/60 space-y-4">
                <h2 className="text-lg font-bold uppercase border-l-2 border-crimson pl-3 text-premium-black font-display">
                  Applications
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.applications!.map((app) => (
                    <li key={app} className="flex gap-2 text-base text-gray-600">
                      <span className="text-crimson font-bold">•</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ProductVideosSection title={property.title} videos={property.videos || []} />

          </div>

          {/* Enquiry form — matches HP product page sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 sm:p-8 rounded-none border border-gray-200/60 sticky top-24 space-y-6">
              
              <div className="border-b border-gray-100 pb-4 text-center">
                <span className="text-crimson section-eyebrow block mb-1">Get In Touch</span>
                <h3 className="text-base font-extrabold font-display text-premium-black">Request a Quote</h3>
              </div>

              {viewingFormSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-crimson/5 text-crimson flex items-center justify-center rounded-full mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm">Enquiry Submitted</h4>
                  <p className="section-desc">
                    Thank you. Our team will contact you shortly with product details and availability.
                  </p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setViewingFormSubmitted(true);
                  }}
                  className="space-y-4 text-base"
                >
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-500 uppercase">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Your name" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-crimson text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-500 uppercase">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+91 90000 88459" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-crimson text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-500 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="you@example.com" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-crimson text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-500 uppercase">Message</label>
                    <textarea 
                      required 
                      rows={3}
                      placeholder={`I'm interested in ${property.title}...`}
                      className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-crimson text-sm resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-crimson hover:bg-crimson-dark btn-label text-white py-4 px-4 rounded-none transition-all duration-300 cursor-pointer"
                  >
                    Submit Enquiry
                  </button>
                </form>
              )}

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 text-sm">
                <a 
                  href={`tel:${(cms.contact?.phone || '+919000088459').replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:border-crimson py-3 rounded-none font-bold transition-colors"
                >
                  <Phone className="w-4 h-4 text-crimson" />
                  <span>Call {cms.contact?.phone || '+91 90000 88459'}</span>
                </a>
                <a 
                  href={`https://wa.me/${(cms.contact?.whatsapp || cms.contact?.phone || '+919000088459').replace(/\D/g, '')}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-none font-bold hover:bg-[#20ba59] transition-colors"
                >
                  <MessageSquare className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>Inquire via WhatsApp</span>
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Similar Properties Showcase */}
        {similarProperties.length > 0 && (
          <div className="border-t border-gray-200/60 pt-16 mt-16 space-y-8">
            <h2 className="text-xl font-bold font-display text-premium-black">Similar Products in {property.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
