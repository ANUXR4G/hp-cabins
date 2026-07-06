'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Phone, Mail, MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

import { getCms } from '@/lib/cms';

const cms = getCms();

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const contact = cms.contact;

  const phone = contact?.phone || '+91 90000 88459';
  const email = contact?.email || 'sales@hpcabins.in';
  const address = contact?.address || 'Sy.No.43/1, Srisailam Hwy Exit Gate No.14, Tukkuguda, Maheshwaram, Hyderabad, Telangana – 501359';
  const hours = contact?.officeHours || 'Mon - Sat | 9:00 AM - 6:00 PM';
  const logo = cms.branding?.logos?.header || cms.branding?.logoUrl || '/wp-content/uploads/2025/06/HPC-LOGO-1.png';

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24 font-sans text-premium-black">
      
      {/* Page Header */}
      <div className="page-hero">
        <div className="page-hero-media">
          <img src="/wp-content/uploads/2025/07/call-center.jpg" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1 className="inner-page-title text-white drop-shadow">Contact Us</h1>
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 breadcrumb text-white/50 mt-4">
            <Link href="/" className="hover:text-crimson flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-crimson font-bold">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Top CTA Banner Strip */}
      <div className="bg-premium-black border-b border-white/10 py-5 sm:py-6 text-white shrink-0">
        <div className="page-container flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1 max-w-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Need a Custom Cabin Specification?</h3>
            <p className="text-base text-white/60 leading-relaxed">We engineer modular layout designs, custom insulation, and plumbing arrays matching your footprint goals.</p>
          </div>
          <Link 
            href="#contact-form-section"
            className="bg-crimson hover:bg-crimson-dark btn-label text-white py-3 px-6 rounded-none transition-all border border-crimson/20 shrink-0 w-full sm:w-auto text-center"
          >
            Get Estimation
          </Link>
        </div>
      </div>

      {/* Main Content Layout */}
      <div id="contact-form-section" className="page-container pt-10 sm:pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT COLUMN: Coordinates Details */}
          <div className="lg:col-span-3 order-1 md:order-1 lg:order-1 flex flex-col">
            <div className="space-y-6 flex-grow">
              <div>
                <h3 className="text-lg font-bold uppercase font-display border-l-2 border-crimson pl-3 mb-2 text-premium-black">Get In Touch</h3>
                <p className="section-desc">Reach out to our Hyderabad head office for consultations, quotes, and nationwide portable cabin delivery.</p>
              </div>

              <div className="space-y-3 sm:space-y-4 text-sm">
                
                <div className="flex gap-3 items-start p-3 bg-white rounded-none border border-gray-200/60">
                  <Phone className="w-4 h-4 text-crimson shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-400 font-bold uppercase text-xs">Phone</span>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="font-semibold text-premium-black hover:text-crimson transition-colors">{phone}</a>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 bg-white rounded-none border border-gray-200/60">
                  <Mail className="w-4 h-4 text-crimson shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-400 font-bold uppercase text-xs">Email</span>
                    <a href={`mailto:${email}`} className="font-semibold text-premium-black hover:text-crimson transition-colors">{email}</a>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 bg-white rounded-none border border-gray-200/60">
                  <MapPin className="w-4 h-4 text-crimson shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-400 font-bold uppercase text-xs">Head Office</span>
                    <p className="font-semibold text-premium-black">{address}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 bg-white rounded-none border border-gray-200/60">
                  <Calendar className="w-4 h-4 text-crimson shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-400 font-bold uppercase text-xs">Working Hours</span>
                    <p className="font-semibold text-premium-black">{hours}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick response banner */}
            <div className="text-xs text-gray-400 leading-relaxed italic border-t border-gray-200 pt-4 mt-6 hidden lg:block">
              * Estimator desk calls are handled directly by layout engineers. Factory visits are by appointment.
            </div>
          </div>

          {/* MIDDLE COLUMN: Company logo */}
          <div className="md:col-span-2 lg:col-span-5 order-3 md:order-3 lg:order-2 card-surface flex items-center justify-center p-8 sm:p-10 lg:p-12 min-h-[240px] lg:min-h-0">
            <img
              src={logo}
              alt={cms.branding?.name || 'Hindustan Portable Cabins'}
              className="w-44 sm:w-56 lg:w-64 max-w-full h-auto object-contain"
            />
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="md:col-span-1 lg:col-span-4 order-2 md:order-2 lg:order-3 card-surface p-6 sm:p-8 flex flex-col">
            {formSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="p-4 bg-crimson/5 rounded-full text-crimson">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold font-display text-premium-black">Message Sent</h3>
                <p className="text-base text-gray-500 max-w-xs leading-relaxed">
                  Your enquiry is in queue. A project estimation lead is reviewing your specifications and will follow up shortly.
                </p>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
                className="space-y-4 text-base"
              >
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-400 uppercase">Contact Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-crimson text-sm text-premium-black font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-400 uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="Enter phone number" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-crimson text-sm text-premium-black font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-400 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter email address" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-crimson text-sm text-premium-black font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-400 uppercase">Inquiry Type</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-crimson text-sm text-premium-black font-semibold cursor-pointer">
                    <option value="Estimates">Request Drawing & Price Estimate</option>
                    <option value="Custom">Custom Cabin Engineering Options</option>
                    <option value="Factory">Schedule Factory Visit</option>
                    <option value="Bulk">Bulk Construction Site compound Camp Orders</option>
                    <option value="Other">General Inquiries</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-400 uppercase">Message & Configurations</label>
                  <textarea 
                    rows={4} 
                    placeholder="Provide details on cabin dimensions, quantities, HVAC needs, or shipping coordinates..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-crimson text-sm text-premium-black leading-relaxed"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-premium-black hover:bg-gray-800 btn-label text-white py-3.5 px-4 rounded-none transition-all duration-300 border border-white/10 cursor-pointer"
                >
                  Send Inquiry Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
