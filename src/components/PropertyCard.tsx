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
    <div className="group flex flex-col surface-card overflow-hidden luxury-card">
      <div className="relative h-64 overflow-hidden bg-surface-soft">
        <img
          src={coverImage}
          alt={property.title}
          className="w-full h-full object-cover rounded-none"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className="font-mono text-caption-mono uppercase tracking-caption text-white/90">
            {property.category}
          </span>
          <span className="font-mono text-caption-mono uppercase tracking-caption text-crimson">
            {property.badge}
          </span>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-muted text-body-sm mb-3 font-serif normal-case">
            <MapPin className="w-3.5 h-3.5 text-crimson shrink-0" />
            <span>Delivery across {property.city}, India</span>
          </div>

          <h3 className="card-title group-hover:text-crimson transition-colors duration-200 line-clamp-2 mb-3">
            <Link href={`/properties/${property.id}`}>{property.title}</Link>
          </h3>

          <p className="card-text line-clamp-3 mb-4">{property.description}</p>
        </div>

        <div>
          <div className="grid grid-cols-3 gap-2 hairline-divider pt-4 pb-4 mb-4">
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 text-center sm:text-left font-mono text-caption-mono uppercase tracking-caption text-muted">
              <Users className="w-3.5 h-3.5 text-crimson shrink-0" />
              <span>{property.bedrooms > 0 ? `Cap: ${property.bedrooms}` : 'Storage'}</span>
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 text-center sm:text-left font-mono text-caption-mono uppercase tracking-caption text-muted">
              <Flame className="w-3.5 h-3.5 text-crimson shrink-0" />
              <span>{property.bathrooms > 0 ? `${property.bathrooms} WC` : 'Dry Unit'}</span>
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 text-center sm:text-left font-mono text-caption-mono uppercase tracking-caption text-muted">
              <Maximize2 className="w-3.5 h-3.5 text-crimson shrink-0" />
              <span>{property.area} sqft</span>
            </div>
          </div>

          <div className="pt-1 hairline-divider">
            <Link href={`/properties/${property.id}`} className="text-link font-mono text-button-mono uppercase tracking-button no-underline hover:underline">
              Discover
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
