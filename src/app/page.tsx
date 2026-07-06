'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building, ShieldCheck, MapPin, Award, CheckCircle2, ArrowRight, 
  Waves, Dumbbell, Shield, Compass, Landmark, Flame, Video, FileText,
  Briefcase, Utensils, Zap, Car, Film, Compass as SpaIcon, Users, Calendar, Sparkles,
  Hammer, HelpCircle, Phone, ArrowRightLeft, ArrowUpRight, ChevronDown, Mail, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import Cabin3DViewer from '@/components/Cabin3DViewer';
import YouTubeCard from '@/components/YouTubeCard';
import CertificateCarousel from '@/components/CertificateCarousel';
import ClientLogoCarousel from '@/components/ClientLogoCarousel';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import { propertiesData, Property } from '@/data/properties';
import { clientLogos as allClientLogos } from '@/data/clients';
import { testimonialsData } from '@/data/testimonials';
import { projectsData } from '@/data/projects';
import { getCms } from '@/lib/cms';
import { 
  workingProcess, welcomeParagraphs, whyChooseUs, safetyCards,
  qualityOffers, principles, branchesNational, branchesInternational,
  certificateSlides, maintainingSafetyText,
} from '@/data/homeSections';

const cms = getCms();

export default function HomePage() {
  const db = cms;
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTimelineStage, setActiveTimelineStage] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [branchTab, setBranchTab] = useState<'national' | 'international'>('national');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Hero slides from CMS
  const heroSlides = db?.hero?.slides?.length ? db.hero.slides : cms.hero.slides;

  // Auto slide hero
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [heroSlides.length]);

  const featuredCabins = (db?.products?.length ? db.products : cms.products).slice(0, 3);
  const activeProjects = (db?.projects?.length ? db.projects : cms.projects).slice(0, 2);

  const activeIndustries = db?.industries?.length ? db.industries : cms.industries;

  const galleryItems = (db?.products?.length ? db.products : cms.products).slice(0, 3);

  const timelineStages = workingProcess.map((step, i) => ({
    number: step.step,
    name: step.title,
    desc: step.desc,
  }));

  const faqsList = [
    { q: "What types of portable cabins does Hindustan Portable Cabins manufacture?", a: "We manufacture MS and GI portable office cabins, security cabins, toilet cabins, accommodation cabins, bunkhouses, containers, storage units, and fully customized modular solutions for industrial and commercial use." },
    { q: "Do you deliver across India?", a: "Yes. With manufacturing units and branches across Hyderabad, Bangalore, Visakhapatnam, Ranchi, Bhubaneswar, Vijayawada, Ahmedabad, Delhi, and more, we provide nationwide delivery and on-ground support." },
    { q: "Can cabins be customized for specific project needs?", a: "Absolutely. From layout and insulation to electrical, plumbing, and interior finishes, every cabin can be tailored to your site requirements, budget, and deployment timeline." }
  ];

  // Helper to resolve industry icons
  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building': return Building;
      case 'Flame': return Flame;
      case 'ShieldCheck': return ShieldCheck;
      default: return Landmark;
    }
  };

  const accentColor = db?.branding?.colors?.accent || '#017501';
  const branches = branchTab === 'national' ? branchesNational : branchesInternational;

  return (
    <div className="relative font-sans text-premium-black bg-[#F5F5F5]">
      
      {/* 1. HERO SLIDER SECTION */}
      <section id="hero-section" className="relative min-h-[520px] h-[78vh] sm:h-[82vh] lg:h-[min(88vh,760px)] flex items-center overflow-hidden bg-[#F5F5F5] border-b border-gray-200">
        {/* Cinema Background Slide Carousel */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              {heroSlides[activeSlide]?.img && (
                <img 
                  src={heroSlides[activeSlide].img}
                  alt={heroSlides[activeSlide].title}
                  className="w-full h-full object-cover object-center sm:object-right-bottom lg:object-right"
                />
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F5F5] via-[#F5F5F5]/92 to-[#F5F5F5]/40 sm:to-[#F5F5F5]/15 lg:to-transparent z-10" />
        </div>

        {/* Hero Content Panel */}
        <div className="relative z-20 page-container w-full flex flex-col justify-center h-full py-10 sm:py-12">
          <div className="max-w-2xl text-left space-y-4 sm:space-y-6">
            <span className="section-eyebrow text-[#111111]" style={{ color: accentColor }}>
              {db?.branding?.tagline || 'LEADING MANUFACTURER OF PORTABLE CABINS IN INDIA'}
            </span>
            
            <h1 className="page-hero-title text-[#111111]">
              {heroSlides[activeSlide]?.title || 'Portable Cabin Solutions'}
            </h1>
            
            <p className="body-text max-w-lg">
              {heroSlides[activeSlide]?.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link 
                href={heroSlides[activeSlide]?.link || '/properties'}
                className="btn-primary w-full sm:w-auto"
                style={{ backgroundColor: accentColor, borderColor: accentColor }}
              >
                Explore Products
              </Link>
              <Link 
                href="#contact-section" 
                className="btn-primary-outline w-full sm:w-auto"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex justify-center gap-2 z-20 px-4">
          {heroSlides.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                activeSlide === idx ? 'w-7' : 'w-2.5 bg-[#111111]/30 hover:bg-[#111111]/60'
              }`}
              style={{ backgroundColor: activeSlide === idx ? accentColor : undefined }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 1.5 RESPONSIVE STATISTICS CARD GRID SECTION */}
      <section className="relative z-20 -mt-8 sm:-mt-12 pb-2">
        <div className="page-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            
            <div className="card-surface p-4 sm:p-5 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[120px]">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-crimson/5 flex items-center justify-center rounded-full text-crimson mb-2 sm:mb-3" style={{ color: accentColor, backgroundColor: accentColor + '0d' }}>
                <Building className="w-5 h-5" />
              </div>
              <span className="block text-lg sm:text-2xl font-extrabold tabular-nums text-[#111111] leading-none">15+</span>
              <span className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mt-1.5 sm:mt-2">Years Experience</span>
            </div>

            <div className="card-surface p-4 sm:p-5 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[120px]">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-crimson/5 flex items-center justify-center rounded-full text-crimson mb-2 sm:mb-3" style={{ color: accentColor, backgroundColor: accentColor + '0d' }}>
                <Home className="w-5 h-5" />
              </div>
              <span className="block text-lg sm:text-2xl font-extrabold tabular-nums text-[#111111] leading-none">5,000+</span>
              <span className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mt-1.5 sm:mt-2">Projects Completed</span>
            </div>

            <div className="card-surface p-4 sm:p-5 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[120px]">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-crimson/5 flex items-center justify-center rounded-full text-crimson mb-2 sm:mb-3" style={{ color: accentColor, backgroundColor: accentColor + '0d' }}>
                <Users className="w-5 h-5" />
              </div>
              <span className="block text-lg sm:text-2xl font-extrabold tabular-nums text-[#111111] leading-none">3,000+</span>
              <span className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mt-1.5 sm:mt-2">Clients Served</span>
            </div>

            <div className="card-surface p-4 sm:p-5 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[120px]">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-crimson/5 flex items-center justify-center rounded-full text-crimson mb-2 sm:mb-3" style={{ color: accentColor, backgroundColor: accentColor + '0d' }}>
                <MapPin className="w-5 h-5" />
              </div>
              <span className="block text-lg sm:text-2xl font-extrabold tabular-nums text-[#111111] leading-none">Nationwide</span>
              <span className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mt-1.5 sm:mt-2">India Coverage</span>
            </div>

            <div className="card-surface p-4 sm:p-5 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[120px] col-span-2 sm:col-span-1">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-crimson/5 flex items-center justify-center rounded-full text-crimson mb-2 sm:mb-3" style={{ color: accentColor, backgroundColor: accentColor + '0d' }}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="block text-lg sm:text-2xl font-extrabold tabular-nums text-[#111111] leading-none">100%</span>
              <span className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mt-1.5 sm:mt-2">Quality Guarantee</span>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORPORATE SUMMARY & COUNT-UP */}
      <section id="about-section" className="section-spacing page-container pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="section-eyebrow" style={{ color: accentColor }}>INDIA MODULAR MANUFACTURING</span>
            <h2 className="section-title">
              Welcome To Hindustan Portable Cabins
            </h2>
            {welcomeParagraphs.map((p, i) => (
              <p key={i} className="body-text">{p}</p>
            ))}
            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/about" className="inline-flex items-center gap-1 btn-label transition-colors hover:text-crimson" style={{ color: accentColor }}>
                <span>Discover factory capacities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-1 btn-label text-gray-500 hover:text-crimson transition-colors">
                <FileText className="w-4 h-4" />
                <span>Download Brochure</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-none overflow-hidden border border-gray-200/60 bg-black">
              <video
                src="/bannervdo.mp4"
                className="w-full aspect-video object-cover"
                controls
                playsInline
                preload="metadata"
                poster="/wp-content/uploads/2025/08/IMG_20210331_103428-scaled.jpg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow" style={{ color: accentColor }}>Why Us</span>
            <h2 className="section-title">Why Choose Hindustan Portable Cabins?</h2>
            <p className="section-desc">
              We don&apos;t just build cabins — we build trust, quality, and long-term partnerships. Here&apos;s why clients across India and abroad choose us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-gray-50 p-6 rounded-none border border-gray-100/80 space-y-4 transition-shadow">
                  <div className="w-10 h-10 bg-crimson/5 flex items-center justify-center rounded-none text-crimson" style={{ color: accentColor, backgroundColor: accentColor + '0d' }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="card-title">{item.title}</h4>
                  <p className="section-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 3D CABIN CONFIGURATOR PRESENTATION */}
      <section className="py-20 bg-premium-black text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left spec controls */}
            <div className="lg:col-span-4 space-y-6">
              <span className="section-eyebrow" style={{ color: accentColor }}>Virtual Demonstration</span>
              <h2 className="section-title leading-tight text-white">Interactive 3D Cabin Configurator</h2>
              <p className="text-base text-white/60 leading-relaxed">
                Configure double-glazing parameters, swap exterior claddings interactively, and toggle internal layout profiles dynamically.
              </p>
              
              <div className="space-y-3.5 text-base">
                <div className="flex gap-3 items-start"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} /> <span>360° swipe rotation controls</span></div>
                <div className="flex gap-3 items-start"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} /> <span>Real-time cladding material swaps</span></div>
                <div className="flex gap-3 items-start"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} /> <span>Interior structural cutaway view</span></div>
              </div>
            </div>

            {/* Configurator view box */}
            <div className="lg:col-span-8 bg-white/5 rounded-none p-6 border border-white/10 relative">
              <div className="w-full h-96 sm:h-[450px] relative overflow-hidden bg-black/40 rounded-none">
                <Cabin3DViewer />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PRODUCTS CATALOG GRID */}
      <section id="featured-section" className="section-spacing page-container">
        <div className="section-header">
          <span className="section-eyebrow" style={{ color: accentColor }}>Fabrication Portfolio</span>
          <h2 className="section-title">Featured Modular Cabins</h2>
          <p className="section-desc">
            Discover our high-precision structures engineered for durability, comfort, and rapid deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredCabins.map((cabin: Property) => (
            <PropertyCard key={cabin.id} property={cabin} />
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-crimson hover:gap-3 transition-all"
            style={{ color: accentColor }}
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* QUALITY WE OFFERS */}
      <section className="py-24 bg-[#F5F5F5] border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-10 rounded-none border border-gray-200/60 mb-12 space-y-3">
            <span className="section-eyebrow" style={{ color: accentColor }}>Our Promise</span>
            <h2 className="section-title text-premium-black">Quality We Offers</h2>
            <p className="section-desc max-w-3xl">
              At Hindustan Portable Cabins, quality isn&apos;t just a promise — it&apos;s the foundation of our brand. Every cabin we manufacture reflects our unwavering commitment to durability, functionality, and excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {qualityOffers.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-none border border-gray-200/60 space-y-4 transition-shadow">
                  <div className="w-10 h-10 bg-crimson/5 flex items-center justify-center rounded-none" style={{ color: accentColor, backgroundColor: accentColor + '0d' }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="card-title">{item.title}</h4>
                  <p className="section-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. DYNAMIC INDUSTRIES VERTICAL */}
      <section className="py-24 bg-white border-t border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow" style={{ color: accentColor }}>Industrial Applications</span>
            <h2 className="section-title">Industries We Serve Across India</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeIndustries.map((ind: any, idx: number) => {
              const Icon = getIndustryIcon(ind.icon);
              return (
                <div key={idx} className="bg-gray-50 p-6 rounded-none border border-gray-100/80 space-y-4 transition-shadow">
                  <div className="w-10 h-10 bg-crimson/5 flex items-center justify-center rounded-none text-crimson" style={{ color: accentColor, backgroundColor: accentColor + '0d' }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="card-title">{ind.title}</h4>
                  <p className="section-desc">{ind.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OUR COMMITMENT TO SAFETY */}
      <section className="py-24 bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow" style={{ color: accentColor }}>Safety First</span>
            <h2 className="section-title">Our Commitment to Safety</h2>
            <p className="section-desc">
              Safety is not just a requirement — it&apos;s a core value that drives everything we do. From design to delivery, we follow stringent safety standards.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyCards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-gray-50 p-6 rounded-none border border-gray-100/80 space-y-4 transition-shadow">
                  <div className="w-10 h-10 bg-crimson/5 flex items-center justify-center rounded-none" style={{ color: accentColor, backgroundColor: accentColor + '0d' }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="card-title">{item.title}</h4>
                  <p className="section-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRINCIPLES & TRAINED STAFF */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-none border border-gray-200/50 space-y-4">
            <span className="section-eyebrow" style={{ color: accentColor }}>Our Values</span>
            <h2 className="section-title">Our Principles</h2>
            <ul className="space-y-3">
              {principles.map((p) => (
                <li key={p.title} className="flex gap-3 text-base text-gray-600 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span><strong className="text-premium-black font-semibold">{p.title}</strong> — {p.desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8 rounded-none border border-gray-200/50 space-y-4">
            <span className="section-eyebrow" style={{ color: accentColor }}>Our Team</span>
            <h2 className="section-title">Trained Staff & Workers</h2>
            <p className="section-desc">
              At Hindustan Portable Cabins, our strength lies in our skilled and experienced workforce. Every staff member undergoes regular training to stay updated with the latest industry standards. From design to delivery, our team ensures precision, safety, and quality at every stage. We promote a culture of continuous learning and professional growth. With us, you get expert craftsmanship backed by dedication and discipline.
            </p>
          </div>
        </div>
      </section>

      {/* 6. MANUFACTURING PROCESS TIMELINE */}
      <section id="timeline-section" className="py-24 bg-premium-black text-white relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#017501_1px,transparent_1px)] [background-size:24px_24px] z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow" style={{ color: accentColor }}>Factory Operations</span>
            <h2 className="section-title">Our Working Process</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {timelineStages.map((stage, idx) => {
              const isActive = activeTimelineStage === idx;
              return (
                <button 
                  key={idx}
                  onClick={() => setActiveTimelineStage(idx)}
                  className={`p-5 sm:p-6 rounded-none flex flex-col items-center justify-center text-center gap-3 sm:gap-4 transition-all duration-300 border cursor-pointer min-h-[110px] ${
                    isActive 
                      ? 'bg-white/10 border-white/25 text-white scale-[1.02]' 
                      : 'bg-white/5 border-white/5 text-white/70 hover:border-white/15 hover:bg-white/[0.07]'
                  }`}
                  style={{ borderColor: isActive ? accentColor : undefined }}
                >
                  <span className="text-xs font-bold tracking-widest tabular-nums" style={{ color: accentColor }}>STAGE {stage.number}</span>
                  <span className="text-base font-bold uppercase tracking-wider leading-snug">
                    {stage.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-8 bg-white/5 rounded-none border border-white/10 max-w-3xl mx-auto text-center space-y-3 animate-fade-in">
            <span className="btn-label" style={{ color: accentColor }}>Stage {timelineStages[activeTimelineStage].number} Details</span>
            <h4 className="text-lg font-bold">{timelineStages[activeTimelineStage].name}</h4>
            <p className="text-base text-white/60 max-w-lg mx-auto leading-relaxed">
              {timelineStages[activeTimelineStage].desc}
            </p>
          </div>

        </div>
      </section>

      {/* 5. FEATURED PROJECTS COMPOUNDS */}
      <section id="projects-section" className="py-24 bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow" style={{ color: accentColor }}>Field Applications</span>
            <h2 className="section-title text-premium-black">Delivered Site Compounds</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {activeProjects.map((project: any) => (
              <div 
                key={project.id}
                className="group flex flex-col sm:flex-row bg-gray-50 rounded-none overflow-hidden border border-gray-100 transition-all duration-300 h-full"
              >
                <div className="relative sm:w-2/5 lg:w-1/2 h-52 sm:h-auto sm:min-h-[220px] overflow-hidden shrink-0">
                  <img 
                    src={project.img || project.image} 
                    alt={project.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 sm:p-6 sm:w-3/5 lg:w-1/2 flex flex-col justify-between gap-4 flex-grow">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>Modular Compound</span>
                    <h4 className="text-base font-extrabold text-premium-black">{project.name}</h4>
                    <p className="text-base text-gray-500 leading-normal">{project.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
                    <div className="flex items-center gap-1.5 text-base text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-crimson" style={{ color: accentColor }} />
                      <span>{project.location}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium tabular-nums">{project.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MEDIA — team photo & award video */}
      <section id="videos-section" className="py-24 bg-[#F5F5F5] border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow block" style={{ color: accentColor }}>Recognition</span>
            <h2 className="section-title text-premium-black">Maintaining Safety</h2>
            <p className="section-desc">
              {maintainingSafetyText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-none overflow-hidden border border-gray-200/60 bg-white">
              <img
                src="/wp-content/uploads/2025/08/WhatsApp-Image-2025-07-28-at-16.56.46-scaled.jpeg"
                alt="Hindustan Portable Cabins team"
                className="w-full h-full min-h-[280px] object-cover"
              />
            </div>
            <YouTubeCard />
          </div>
        </div>
      </section>

      {/* BRANCHES & MANUFACTURING UNITS */}
      <section id="branches-section" className="py-24 bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="section-eyebrow" style={{ color: accentColor }}>Locations</span>
            <h2 className="section-title text-premium-black">Our Branches & Manufacturing Units</h2>
          </div>
          <div className="flex justify-center gap-3 mb-12">
            {(['national', 'international'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setBranchTab(tab)}
                className={`px-6 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all ${
                  branchTab === tab ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                style={branchTab === tab ? { backgroundColor: accentColor } : undefined}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {branches.map((branch, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-none border border-gray-100/80 space-y-3 transition-shadow">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                  <h4 className="card-title">{branch.name}</h4>
                </div>
                <p className="section-desc">{branch.address}</p>
                <div className="flex items-start gap-2 text-base text-gray-500">
                  <Phone className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span>{branch.phones}</span>
                </div>
                <div className="flex items-start gap-2 text-base text-gray-500">
                  <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span>{branch.emails}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7.5. PHOTOREALISTIC GALLERY SHOWCASE */}
      <section id="gallery-section" className="py-24 bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow block" style={{ color: accentColor }}>Visual Showcase</span>
            <h2 className="section-title text-premium-black">Our Portable Cabin Gallery</h2>
            <p className="section-desc">
              Explore our portable office cabins, security cabins, accommodation units and container solutions manufactured across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {galleryItems.map((item: any) => (
            <div key={item.id} className="group relative aspect-[4/3] sm:h-72 lg:h-80 rounded-none overflow-hidden border border-gray-150 bg-gray-50 transition-all duration-500 hover:hover:-translate-y-1">
              <img 
                src={item.images?.[0] || '/wp-content/uploads/2025/08/Steel-Prefabricated-Portable-Cabin_21890091633_steel-prefabricated-portable-cabin.jpg'} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase tracking-widest font-extrabold" style={{ color: accentColor }}>{item.category}</span>
                <h4 className="card-title mt-1">{item.title}</h4>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATES */}
      <CertificateCarousel slides={certificateSlides} accentColor={accentColor} />

      {/* TESTIMONIALS */}
      <TestimonialCarousel testimonials={testimonialsData} accentColor={accentColor} />

      {/* OUR CLIENTS — logo carousel */}
      <ClientLogoCarousel logos={allClientLogos} accentColor={accentColor} />

      {/* 9. FAQ ACCORDION SECTION */}
      <section id="faq-section" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="section-eyebrow" style={{ color: accentColor }}>Regulatory & Specs</span>
          <h2 className="section-title text-premium-black">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqsList.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="bg-white rounded-none border border-gray-200/60 overflow-hidden transition-all">
                <button 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left card-title hover:text-crimson transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : undefined, color: accentColor }} />
                </button>
                {isOpen && (
                  <div className="p-5 border-t border-gray-200/60 text-base text-gray-600 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. CONTACT FORM MAP */}
      <section id="contact-section" className="section-spacing bg-premium-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#017501_1.2px,transparent_1.2px)] [background-size:32px_32px] z-0" />
        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center">
            
            {/* Left Column Coordinates */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6 text-center lg:text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: accentColor }}>Get Estimation</span>
              <h2 className="text-3xl font-extrabold font-display leading-tight">Connect with Our Factory desk</h2>
              <p className="text-base text-white/60 leading-relaxed">
                {db?.contact?.address || cms.contact.address}
              </p>
              
              <div className="space-y-4 text-base font-semibold inline-flex flex-col items-center lg:items-start">
                <div className="flex gap-3"><Phone className="w-4 h-4 text-crimson shrink-0" style={{ color: accentColor }} /> <span>{db?.contact?.phone || cms.contact.phone}</span></div>
                <div className="flex gap-3"><Mail className="w-4 h-4 text-crimson shrink-0" style={{ color: accentColor }} /> <span>{db?.contact?.email || cms.contact.email}</span></div>
                <div className="flex gap-3"><Calendar className="w-4 h-4 text-crimson shrink-0" style={{ color: accentColor }} /> <span>{db?.contact?.officeHours || 'Mon - Sat | 8:30 AM - 6:00 PM'}</span></div>
              </div>
            </div>

            {/* Right Column Form */}
            <div className="lg:col-span-7 bg-white text-premium-black p-6 sm:p-8 rounded-none border border-gray-200/50 w-full">
              {formSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="p-4 bg-crimson/5 rounded-full text-crimson w-16 h-16 flex items-center justify-center mx-auto" style={{ color: accentColor, backgroundColor: accentColor + '0d' }}>
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-premium-black">Enquiry Dispatched</h3>
                  <p className="text-base text-gray-500 max-w-sm mx-auto">
                    Your site compound layout specs have been routed to the estimator team queue.
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="label-text">Contact Name</label>
                      <input type="text" required placeholder="Enter name" className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-[#017501] font-semibold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="label-text">Phone Number</label>
                      <input type="tel" required placeholder="Enter phone" className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-[#017501] font-semibold" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="label-text">Email Address</label>
                      <input type="email" required placeholder="Enter email" className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-[#017501] font-semibold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="label-text">Inquiry Category</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none cursor-pointer font-semibold">
                        <option>Request Price Estimation drawing</option>
                        <option>Schedule Factory Visit</option>
                        <option>Bespoke Cabin Layout engineering</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="label-text">Configurations Message</label>
                    <textarea rows={4} required placeholder="Detail size footprints, structural warranty options, AC capacity..." className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 focus:outline-none focus:border-[#017501]" />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full text-white btn-label uppercase tracking-wider py-4 rounded-none transition-all duration-300 cursor-pointer hover:shadow-lg"
                    style={{ backgroundColor: accentColor }}
                  >
                    Dispatch Enquiry Request
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
