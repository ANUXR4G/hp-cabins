'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Users, Flame, Maximize2 } from 'lucide-react';
import { Property } from '@/data/properties';
import { getProductCoverImage } from '@/lib/productImages';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = getProductCoverImage(property);

  return (
    <div className="group flex flex-col bg-white rounded-none overflow-hidden border border-gray-200/80 luxury-card hover:border-crimson/50 transition-all duration-300">
      
      {/* Cabin Image & Badges */}
      <div className="relative h-60 overflow-hidden bg-gray-100">
        <img 
          src={coverImage} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className="bg-black/75 backdrop-blur-md text-white border border-white/10 text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-none">
            {property.category}
          </span>
          <span className="bg-crimson text-white text-xs font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
            {property.badge}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 z-10">
          <span className="bg-black/85 text-white font-display font-bold text-base py-1 px-3 rounded-none border border-white/15">
            {property.developer}
          </span>
        </div>
      </div>

      {/* Cabin Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-gray-500 text-base mb-2">
            <MapPin className="w-3.5 h-3.5 text-crimson" />
            <span>Delivery across {property.city}, India</span>
          </div>
          
          <h3 className="text-base font-extrabold text-premium-black group-hover:text-crimson transition-colors duration-200 line-clamp-1 mb-2">
            <Link href={`/properties/${property.id}`}>{property.title}</Link>
          </h3>
          
          <p className="text-base text-gray-600 leading-relaxed line-clamp-2 mb-4">
            {property.description}
          </p>
        </div>

        <div>
          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 pb-4 mb-4 text-gray-600 text-base">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-1.5 text-center sm:text-left">
              <Users className="w-3.5 h-3.5 text-crimson shrink-0" />
              <span className="leading-tight">{property.bedrooms > 0 ? `Cap: ${property.bedrooms}` : 'Storage'}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-1.5 text-center sm:text-left">
              <Flame className="w-3.5 h-3.5 text-crimson shrink-0" />
              <span className="leading-tight">{property.bathrooms > 0 ? `${property.bathrooms} WC` : 'Dry Unit'}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-1.5 text-center sm:text-left">
              <Maximize2 className="w-3.5 h-3.5 text-crimson shrink-0" />
              <span className="leading-tight">{property.area} sqft</span>
            </div>
          </div>

          <div className="pt-1 border-t border-gray-100">
            <Link
              href={`/properties/${property.id}`}
              className="text-base font-extrabold text-crimson hover:underline"
            >
              View Details
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
