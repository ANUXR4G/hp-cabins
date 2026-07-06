'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Linkedin, Send, BadgeCheck, MapPin, Mail, PhoneCall } from 'lucide-react';

import { getCms } from '@/lib/cms';

const cms = getCms();

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const db = cms;

  const footerLogo = db?.branding?.logos?.footer || db?.branding?.logoUrl || cms.branding.logoUrl;
  return (
    <footer className="bg-premium-black text-white/70 border-t border-white/10 pt-16 pb-8 font-sans w-full overflow-x-hidden">
      <div className="page-container">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info & Newsletter */}
          <div className="space-y-6">
            <Link href="/" className="inline-block py-1">
              {footerLogo ? (
                <img src={footerLogo} alt={db?.branding?.name || "THE CABINS"} className="h-11 w-auto object-contain" />
              ) : (
                <svg viewBox="0 0 240 60" className="h-11 w-auto" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
                  <rect x="12" y="10" width="3.5" height="39" rx="1.5" fill="#017501" />
                  <text x="26" y="36" fontFamily="Poppins, system-ui, sans-serif" fontWeight="800" fontSize="18" fill="#FFFFFF" letterSpacing="0.5">THE C</text>
                  <path d="M 123 11 L 148 48 L 136 48 L 137 41 L 109 41 L 104 48 L 95 48 L 95 43 L 101 43 Z M 123 18 L 135 36 L 111 36 Z" fill="#017501" fillRule="evenodd" />
                  <text x="151" y="36" fontFamily="Poppins, system-ui, sans-serif" fontWeight="800" fontSize="18" fill="#FFFFFF" letterSpacing="0.5">BINS</text>
                  <text x="26" y="49" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="6.8" fill="#888888" letterSpacing="0.6">
                    TRANSFORMING THE <tspan fill="#017501">MODULAR INDUSTRY</tspan>
                  </text>
                </svg>
              )}
            </Link>
            <p className="text-base leading-relaxed text-white/50">
              Leading manufacturer of high-quality portable office containers, site cabins, security cabins, and customized modular solutions across India since 2010.
            </p>
            {/* Newsletter */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Subscribe to Catalog Updates</h4>
              <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="bg-navy-light text-xs text-white placeholder-white/30 w-full pl-4 pr-12 py-3 rounded-none border border-white/10 focus:outline-none focus:border-crimson transition-colors duration-200"
                />
                <button type="submit" className="absolute right-2 p-1.5 bg-crimson hover:bg-crimson-dark text-white rounded-none transition-colors duration-200 cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white uppercase text-xs font-bold tracking-wider mb-6 border-l-2 border-crimson pl-3">
              Quick Links
            </h3>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/" className="hover:text-crimson transition-colors duration-200">Home Page</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-crimson transition-colors duration-200">About Company</Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-crimson transition-colors duration-200">Cabin Catalog</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-crimson transition-colors duration-200">Delivered Compounds</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-crimson transition-colors duration-200">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Cabin Categories */}
          <div>
            <h3 className="text-white uppercase text-xs font-bold tracking-wider mb-6 border-l-2 border-crimson pl-3">
              Cabin Range
            </h3>
            <ul className="space-y-3 text-xs text-white/50">
              <li>MS & GI Portable Office Cabins</li>
              <li>Security & Guard Cabins</li>
              <li>Accommodation & Bunkhouse Units</li>
              <li>Portable Toilet Cabins</li>
              <li>Office & Storage Containers</li>
              <li>Custom Modular Solutions</li>
            </ul>
          </div>

          {/* Contact Details & Certification */}
          <div className="space-y-6">
            <h3 className="text-white uppercase text-xs font-bold tracking-wider border-l-2 border-crimson pl-3">
              Hyderabad Head Office
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-crimson shrink-0 mt-0.5" />
                <span>{db?.contact?.address || 'Sy.No.43/1, Srisailam Hwy Exit Gate No.14, Tukkuguda, Maheshwaram, Hyderabad, Telangana – 501359'}</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-crimson shrink-0" />
                <a href={`tel:${(db?.contact?.phone || '+919000088459').replace(/\s/g, '')}`} className="hover:text-crimson transition-colors duration-200">{db?.contact?.phone || '+91 90000 88459'}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-crimson shrink-0" />
                <a href={`mailto:${db?.contact?.email || 'sales@hpcabins.in'}`} className="hover:text-crimson transition-colors duration-200">{db?.contact?.email || 'sales@hpcabins.in'}</a>
              </li>
            </ul>
            
            {/* Accreditation section */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-white/40">
              <BadgeCheck className="w-8 h-8 text-crimson shrink-0" />
              <div>
                <p className="font-semibold uppercase text-white/50">Quality Certified Manufacturer</p>
                <p>15+ Years Experience | Nationwide Delivery</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Socials & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {currentYear} {db?.branding?.name || 'Hindustan Portable Cabins'}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-navy-light hover:bg-crimson hover:text-white rounded-full transition-all duration-300 text-white/70" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-navy-light hover:bg-crimson hover:text-white rounded-full transition-all duration-300 text-white/70" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-navy-light hover:bg-crimson hover:text-white rounded-full transition-all duration-300 text-white/70" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-navy-light hover:bg-crimson hover:text-white rounded-full transition-all duration-300 text-white/70" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
