'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Shield, Compass, Target, HelpCircle, Check, Hammer, Layers, Award } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { value: "15+", label: "Years in Industry" },
    { value: "2,500+", label: "Cabins Delivered" },
    { value: "1,500+", label: "Happy Clients" },
    { value: "100%", label: "Quality Assured" },
    { value: "8+", label: "Branch Locations" }
  ];

  const recentProjectImages = [
    "/wp-content/uploads/2025/05/bgimg.jpg",
    "/wp-content/uploads/2025/08/Steel-Prefabricated-Portable-Cabin_21890091633_steel-prefabricated-portable-cabin.jpg",
    "/wp-content/uploads/2025/08/IMG_20210331_103428-scaled.jpg",
    "/wp-content/uploads/2025/08/IMG_20201107_121854-scaled.jpg",
    "/wp-content/uploads/2025/08/IMG-20240420-WA0019.jpg"
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24 font-sans text-premium-black">
      
      {/* Page Header */}
      <div className="relative bg-premium-black py-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/wp-content/uploads/2025/08/WhatsApp-Image-2025-07-29-at-8.29.46-PM7.jpeg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-premium-black" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold text-white font-serif tracking-wide">About Hindustan Portable Cabins</h1>
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-white/50 text-[10px] uppercase tracking-wider mt-4">
            <Link href="/" className="hover:text-crimson flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-crimson font-bold">About Us</span>
          </div>
        </div>
      </div>

      {/* Recent Cabin Projects Showcase Strip */}
      <div className="bg-premium-black border-y border-white/10 py-6 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-[10px] text-crimson uppercase tracking-widest font-extrabold">Delivered Modular Arrays</span>
            <Link href="/projects" className="text-[10px] text-white/50 hover:text-crimson transition-colors font-bold uppercase tracking-wider">View Project Timeline</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {recentProjectImages.map((imgUrl, idx) => (
              <div key={idx} className="h-28 w-44 rounded-xl overflow-hidden shrink-0 border border-white/10 relative shadow-md">
                <img src={imgUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Core Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Detail */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-crimson uppercase tracking-widest text-[10px] font-extrabold block mb-1">Since 2010</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-premium-black">Leading Portable Cabin Manufacturer in India</h2>
            
            <p className="text-sm sm:text-sm leading-relaxed text-gray-600 font-light">
              Hindustan Portable Cabins is a leading and fast-growing manufacturer of high-quality portable cabins in India. We specialize in portable office containers, site cabins, security cabins, and customized modular solutions. With branches and manufacturing units across India, we serve clients nationwide and internationally with excellence, innovation, and reliability.
            </p>

            {/* Three Pillars */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              
              <div className="flex gap-4">
                <div className="p-1.5 bg-crimson/5 text-crimson border border-crimson/25 rounded-full w-fit h-fit shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-premium-black uppercase tracking-wider">Superior Quality & Craftsmanship</h4>
                  <p className="text-[11px] text-gray-500 font-light mt-0.5 leading-relaxed">
                    We use premium materials and advanced technology to ensure every cabin is durable, weather-resistant, and built to last.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-1.5 bg-crimson/5 text-crimson border border-crimson/25 rounded-full w-fit h-fit shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-premium-black uppercase tracking-wider">Customized Solutions</h4>
                  <p className="text-[11px] text-gray-500 font-light mt-0.5 leading-relaxed">
                    From portable office containers to specialized modular cabins, we offer fully tailored solutions to fit your specific space, purpose, and budget.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-1.5 bg-crimson/5 text-crimson border border-crimson/25 rounded-full w-fit h-fit shrink-0">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-premium-black uppercase tracking-wider">Safety & Compliance</h4>
                  <p className="text-[11px] text-gray-500 font-light mt-0.5 leading-relaxed">
                    Each cabin is engineered for structural strength, fire resistance, and electrical safety, following stringent national and international safety standards.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-2">
              <Link 
                href="/contact"
                className="bg-crimson hover:bg-crimson-dark text-white text-sm font-bold uppercase tracking-wider py-4 px-8 rounded-xl inline-block transition-all shadow-md shadow-crimson/15 hover:scale-105 active:scale-95"
              >
                Request Factory Visit
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 h-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative">
            <img 
              src="/wp-content/uploads/2025/08/WhatsApp-Image-2025-07-29-at-8.29.46-PM7.jpeg" 
              alt="Hindustan Portable Cabins Manufacturing" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

        </div>
      </div>

      {/* Stats Banner below */}
      <section className="mt-20 bg-premium-black text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="block text-2xl sm:text-3xl font-extrabold text-crimson font-mono">{stat.value}</span>
                <span className="block text-[9px] uppercase tracking-wider text-white/50 font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
