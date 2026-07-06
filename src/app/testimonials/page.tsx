'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import TestimonialsGrid from '@/components/TestimonialsGrid';
import { testimonialsData, testimonialsBackground } from '@/data/testimonials';

export default function TestimonialsPage() {
  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24 font-sans text-premium-black">
      {/* Page header */}
      <div className="relative bg-premium-black py-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={testimonialsBackground} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-premium-black" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h1 className="inner-page-title text-white">Testimonials</h1>
          <div className="flex items-center justify-center gap-2 breadcrumb text-white/50 mt-4">
            <Link href="/" className="hover:text-crimson flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-crimson font-normal">Testimonials</span>
          </div>
        </div>
      </div>

      {/* Testimonials grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="section-eyebrow text-crimson block">
            Client Testimonials
          </span>
          <p className="section-desc">
            Hear from industry leaders who trust Hindustan Portable Cabins for portable offices,
            accommodation units, and site infrastructure across India.
          </p>
        </div>

        <TestimonialsGrid testimonials={testimonialsData} />
      </div>
    </div>
  );
}
