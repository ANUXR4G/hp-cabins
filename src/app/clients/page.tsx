'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import ClientLogoGrid from '@/components/ClientLogoGrid';
import { clientLogos, clientsBackground } from '@/data/clients';

export default function ClientsPage() {
  return (
    <div className="bg-[#F5F5F5] min-h-screen font-sans text-premium-black">
      {/* Page header */}
      <div className="relative bg-premium-black py-14 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src={clientsBackground} alt="" className="w-full h-full object-cover blur-sm scale-105" />
          <div className="absolute inset-0 bg-premium-black/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold text-white font-serif tracking-wide">Our Clients</h1>
          <p className="text-sm text-white/60 font-light mt-3 max-w-2xl mx-auto">
            Trusted by leading organizations across infrastructure, energy, technology, healthcare, and government sectors.
          </p>
          <div className="flex items-center justify-center gap-2 text-white/50 text-[10px] uppercase tracking-wider mt-5">
            <Link href="/" className="hover:text-crimson flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-crimson font-bold">Clients</span>
          </div>
        </div>
      </div>

      {/* Logo grid on blurred global background */}
      <section className="relative py-12 sm:py-16">
        <div className="absolute inset-0">
          <img
            src={clientsBackground}
            alt=""
            className="w-full h-full object-cover blur-[3px] scale-105"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <ClientLogoGrid logos={clientLogos} />
        </div>
      </section>
    </div>
  );
}
