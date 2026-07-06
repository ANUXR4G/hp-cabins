'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Mail, MessageCircle, Phone, ArrowUp, FileText, X, 
  MessageSquare, Send, CheckCircle2
} from 'lucide-react';

import { getCms } from '@/lib/cms';

const cms = getCms();

export default function FloatingElements() {
  const pathname = usePathname();
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const db = cms;
  
  // Widget Open State
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleNavClick = (href: string, sectionId?: string) => {
    setIsWidgetOpen(false);
    if (sectionId && pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    router.push(href);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) {
      alert('Please fill in your Name and Phone number.');
      return;
    }
    setIsSubmitting(true);
    const subject = encodeURIComponent(`Website enquiry from ${enquiryForm.name}`);
    const body = encodeURIComponent(
      `Name: ${enquiryForm.name}\nPhone: ${enquiryForm.phone}\n\n${enquiryForm.message || 'Requested callback from floating contact widget.'}`,
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setFormSubmitted(true);
    setEnquiryForm({ name: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const contactPhone = db.contact?.phone || '+91 90000 88459';
  const contactPhoneRaw = contactPhone.replace(/\s+/g, '');
  const contactWhatsapp = db.contact?.whatsapp || db.contact?.phone || '+919000088459';
  const contactWhatsappRaw = contactWhatsapp.replace(/\D/g, '');
  const contactEmail = db.contact?.email || 'sales@hpcabins.in';
  const accentColor = db?.branding?.colors?.accent || '#017501';

  return (
    <>
      {/* 1. FLOATING MODERN CONTACT POPUP PANEL */}
      {isWidgetOpen && (
        <div className="fixed right-5 sm:right-6 bottom-24 z-50 w-[min(calc(100%-2.5rem),20rem)] sm:w-80 bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-2xl rounded-2xl p-5 text-premium-black animate-fade-in flex flex-col space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-premium-black">Contact HP Cabins</h4>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">Quick estimates & engineering desk</p>
            </div>
            <button 
              onClick={() => {
                setIsWidgetOpen(false);
                setFormSubmitted(false);
              }}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-crimson transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Channels Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {/* Phone */}
            <a 
              href={`tel:${contactPhoneRaw}`}
              className="flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-crimson/5 border border-gray-150 hover:border-crimson/20 rounded-xl transition-all group"
            >
              <Phone className="w-4 h-4 text-crimson group-hover:scale-110 transition-transform" style={{ color: accentColor }} />
              <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Call</span>
            </a>
            
            {/* WhatsApp */}
            <a 
              href={`https://wa.me/${contactWhatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-emerald-50 border border-gray-150 hover:border-emerald-250 rounded-xl transition-all group"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform fill-current" />
              <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Chat</span>
            </a>

            {/* Email */}
            <a 
              href={`mailto:${contactEmail}`}
              className="flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-indigo-50 border border-gray-150 hover:border-indigo-250 rounded-xl transition-all group"
            >
              <Mail className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Email</span>
            </a>

            {/* Get Quote Link */}
            <button 
              onClick={() => handleNavClick('/contact', 'contact-form-section')}
              className="flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-crimson/5 border border-gray-150 hover:border-crimson/20 rounded-xl transition-all group cursor-pointer"
            >
              <FileText className="w-4 h-4 text-crimson group-hover:scale-110 transition-transform" style={{ color: accentColor }} />
              <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Quote</span>
            </button>
          </div>

          {/* Quick Enquiry Form / Success state */}
          <div className="border-t border-gray-100 pt-3">
            {formSubmitted ? (
              <div className="py-4 text-center space-y-2 flex flex-col items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce" />
                <span className="block font-bold text-sm">Request Sent Successfully</span>
                <p className="text-[10px] text-gray-400 font-light max-w-[200px] leading-relaxed">
                  An estimation lead will contact you shortly on your phone number.
                </p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="text-[9px] font-bold uppercase text-crimson hover:underline"
                  style={{ color: accentColor }}
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-2 text-[10px]">
                <span className="block font-extrabold uppercase text-gray-400 tracking-wider mb-2">Or Request Callback</span>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    required
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-crimson text-sm font-semibold"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    required
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-crimson text-sm font-semibold"
                  />
                </div>
                <textarea 
                  rows={2} 
                  placeholder="Inquiry / Dimensions details..."
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-crimson text-sm font-light"
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full text-white text-[9px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-crimson"
                  style={{ backgroundColor: accentColor }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Send Request'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      )}

      {/* 2. BOTTOM-RIGHT CIRCULAR ACTIONS WRAPPER */}
      <div className="fixed right-5 sm:right-6 bottom-6 flex flex-col gap-3.5 z-40 items-end">
        
        {/* Toggle Widget Circle Button */}
        <button
          onClick={() => {
            setIsWidgetOpen(!isWidgetOpen);
            setFormSubmitted(false);
          }}
          className="flex items-center justify-center w-14 h-14 bg-crimson text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group cursor-pointer"
          style={{ backgroundColor: accentColor }}
          title="Contact HP Cabins"
        >
          {isWidgetOpen ? (
            <X className="w-6 h-6 animate-spin-once" />
          ) : (
            <MessageSquare className="w-6 h-6 animate-pulse" />
          )}
          
          {/* Subtle Pulse Rings */}
          <span className="absolute inset-0 rounded-full border-2 border-crimson opacity-20 animate-ping" style={{ borderColor: accentColor }} />
        </button>

        {/* Scroll to Top Circle Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-50 border border-gray-150 text-premium-black rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer animate-fade-in"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

      </div>
    </>
  );
}
