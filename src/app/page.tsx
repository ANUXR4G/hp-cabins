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
import {
  factoryShowcase, teamAndSite, whyChooseImages, qualityImages,
  safetyImages, industryImages, branchImages, processImages,
} from '@/data/sectionImages';

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

  const featuredCabins = (db?.products?.length ? db.products : cms.products).slice(0, 6);
  const activeProjects = (db?.projects?.length ? db.projects : cms.projects).slice(0, 4);

  const activeIndustries = db?.industries?.length ? db.industries : cms.industries;

  const galleryItems = (db?.products?.length ? db.products : cms.products).slice(0, 9);

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
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20 sm:to-transparent z-10" />
        </div>

        {/* Hero Content Panel */}
        <div className="relative z-20 page-container w-full flex flex-col justify-center h-full py-10 sm:py-12">
          <div className="max-w-2xl text-left space-y-4 sm:space-y-6">
            <span className="section-eyebrow text-white" style={{ color: accentColor }}>
              {db?.branding?.tagline || 'LEADING MANUFACTURER OF PORTABLE CABINS IN INDIA'}
            </span>
            
            <h1 className="page-hero-title text-white drop-shadow-lg">
              {heroSlides[activeSlide]?.title || 'Portable Cabin Solutions'}
            </h1>
            
            <p className="body-text max-w-lg text-white/85">
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
                className="btn-on-dark w-full sm:w-auto"
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

      {/* 1.5 STATISTICS */}
      <section className="relative z-20 -mt-10 sm:-mt-14 section-band py-8 sm:py-10">
        <div className="page-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { icon: Building, value: '15+', label: 'Years Experience' },
              { icon: Home, value: '5,000+', label: 'Projects Completed' },
              { icon: Users, value: '3,000+', label: 'Clients Served' },
              { icon: MapPin, value: 'Nationwide', label: 'India Coverage' },
              { icon: CheckCircle2, value: '100%', label: 'Quality Guarantee' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`stat-panel ${stat.label === 'Quality Guarantee' ? 'col-span-2 sm:col-span-1' : ''}`}>
                  <div className="w-10 h-10 mx-auto bg-crimson/10 flex items-center justify-center mb-3" style={{ color: accentColor, backgroundColor: accentColor + '14' }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="block text-xl sm:text-2xl font-bold tabular-nums text-premium-black leading-none">{stat.value}</span>
                  <span className="block text-xs font-bold text-muted uppercase tracking-widest mt-2">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJECT PHOTO STRIP */}
      <section className="py-8 bg-[#222222] border-b border-white/10 overflow-hidden">
        <div className="page-container mb-4 flex items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">Manufacturing & Deployments</span>
          <span className="hidden sm:block h-px flex-1 bg-white/10 ml-4" />
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-1">
          {factoryShowcase.concat(teamAndSite).map((src, idx) => (
            <div key={`${src}-${idx}`} className="photo-mosaic-item shrink-0 w-56 sm:w-72 h-40 sm:h-48">
              <img src={src} alt="HP Cabins project" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* 2. CORPORATE SUMMARY & COUNT-UP */}
      <section id="about-section" className="section-spacing section-bg-white page-container border-b border-hairline">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="section-eyebrow" style={{ color: accentColor }}>About the Company</span>
            <h2 className="section-title">
              Welcome to Hindustan Portable Cabins
            </h2>
            {welcomeParagraphs.map((p, i) => (
              <p key={i} className="body-text">{p}</p>
            ))}
            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/about" className="inline-flex items-center gap-1 btn-label transition-colors hover:text-crimson" style={{ color: accentColor }}>
                <span>Learn more about us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-1 btn-label text-gray-500 hover:text-crimson transition-colors">
                <FileText className="w-4 h-4" />
                <span>Download Brochure</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-3 gap-2 border border-hairline-strong">
              {factoryShowcase.slice(0, 3).map((src) => (
                <div key={src} className="overflow-hidden bg-[#eaeaea]">
                  <img src={src} alt="Factory" className="w-full h-28 sm:h-36 object-cover" />
                </div>
              ))}
            </div>
            <div className="overflow-hidden border border-hairline-strong bg-black">
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
      <section className="py-24 section-bg-alt border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow" style={{ color: accentColor }}>Why Us</span>
            <h2 className="section-title">Why Choose Hindustan Portable Cabins?</h2>
            <p className="section-desc">
              We don&apos;t just build cabins — we build trust, quality, and long-term partnerships. Here&apos;s why clients across India and abroad choose us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="image-card group">
                  <div className="image-card-photo">
                    <img src={whyChooseImages[idx % whyChooseImages.length]} alt={item.title} loading="lazy" />
                  </div>
                  <div className="heavy-card-body space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-crimson/10 flex items-center justify-center shrink-0" style={{ color: accentColor, backgroundColor: accentColor + '14' }}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="card-title">{item.title}</h4>
                    </div>
                    <p className="section-desc text-sm">{item.desc}</p>
                  </div>
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
      <section id="featured-section" className="section-spacing section-bg-alt page-container border-b border-hairline">
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
      <section className="py-24 section-bg-white border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-band -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <span className="section-eyebrow" style={{ color: accentColor }}>Our Promise</span>
                <h2 className="section-title text-white">Quality We Offer</h2>
                <p className="text-base text-white/75 leading-relaxed max-w-xl">
                  Quality is the foundation of our brand. Every cabin is built for durability, functionality, and long-term site performance.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 border border-white/10">
                {qualityImages.slice(0, 4).map((src) => (
                  <div key={src} className="overflow-hidden h-32 sm:h-36 bg-[#333]">
                    <img src={src} alt="Quality cabin" className="w-full h-full object-cover opacity-90" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualityOffers.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="heavy-card p-6 space-y-4">
                  <div className="w-10 h-10 bg-crimson/10 flex items-center justify-center" style={{ color: accentColor, backgroundColor: accentColor + '14' }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="card-title">{item.title}</h4>
                  <p className="section-desc text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. DYNAMIC INDUSTRIES VERTICAL */}
      <section className="py-24 section-bg-white border-t border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow" style={{ color: accentColor }}>Industrial Applications</span>
            <h2 className="section-title">Industries We Serve Across India</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {activeIndustries.map((ind: any, idx: number) => {
              const Icon = getIndustryIcon(ind.icon);
              return (
                <div key={idx} className="image-card group">
                  <div className="image-card-photo h-52">
                    <img src={industryImages[idx % industryImages.length]} alt={ind.title} loading="lazy" />
                  </div>
                  <div className="heavy-card-body">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-crimson" style={{ color: accentColor }} />
                      <h4 className="card-title">{ind.title}</h4>
                    </div>
                    <p className="section-desc text-sm">{ind.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OUR COMMITMENT TO SAFETY */}
      <section className="py-24 section-bg-alt border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
            <div className="space-y-3">
              <span className="section-eyebrow" style={{ color: accentColor }}>Safety First</span>
              <h2 className="section-title">Our Commitment to Safety</h2>
              <p className="section-desc">
                Safety is not just a requirement — it&apos;s a core value that drives everything we do. From design to delivery, we follow stringent safety standards.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 border border-hairline-strong">
              {safetyImages.slice(0, 2).map((src) => (
                <div key={src} className="overflow-hidden h-40 sm:h-48 bg-[#eaeaea]">
                  <img src={src} alt="Safety on site" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyCards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="image-card group">
                  <div className="image-card-photo h-36">
                    <img src={safetyImages[idx % safetyImages.length]} alt={item.title} loading="lazy" />
                  </div>
                  <div className="heavy-card-body space-y-2">
                    <div className="w-9 h-9 bg-crimson/10 flex items-center justify-center" style={{ color: accentColor, backgroundColor: accentColor + '14' }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="card-title">{item.title}</h4>
                    <p className="section-desc text-sm">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRINCIPLES & TRAINED STAFF */}
      <section className="py-24 section-bg-white border-b border-hairline max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 heavy-card p-8 space-y-4">
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
          <div className="lg:col-span-3 relative overflow-hidden border border-hairline-strong min-h-[280px] bg-[#eaeaea]">
            <img src={teamAndSite[0]} alt="HP Cabins team" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-bold uppercase tracking-widest">Our Workforce</span>
            </div>
          </div>
          <div className="lg:col-span-4 heavy-card p-8 space-y-4">
            <span className="section-eyebrow" style={{ color: accentColor }}>Our Team</span>
            <h2 className="section-title">Trained Staff & Workers</h2>
            <p className="section-desc">
              At Hindustan Portable Cabins, our strength lies in our skilled and experienced workforce. Every staff member undergoes regular training to stay updated with the latest industry standards.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {teamAndSite.slice(1, 3).map((src) => (
                <div key={src} className="overflow-hidden h-24 border border-hairline bg-[#eaeaea]">
                  <img src={src} alt="Team at work" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. MANUFACTURING PROCESS TIMELINE */}
      <section id="timeline-section" className="py-24 bg-premium-black text-white relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#017501_1px,transparent_1px)] [background-size:24px_24px] z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow" style={{ color: accentColor }}>Factory Operations</span>
            <h2 className="section-title text-white">Our Working Process</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {timelineStages.map((stage, idx) => {
              const isActive = activeTimelineStage === idx;
              return (
                <button 
                  key={idx}
                  onClick={() => setActiveTimelineStage(idx)}
                  className={`relative p-0 rounded-sm flex flex-col overflow-hidden transition-all duration-300 border cursor-pointer min-h-[160px] ${
                    isActive 
                      ? 'border-crimson scale-[1.02] shadow-xl' 
                      : 'border-white/10 hover:border-white/25'
                  }`}
                  style={{ borderColor: isActive ? accentColor : undefined }}
                >
                  <div className="relative h-24 w-full">
                    <img src={processImages[idx]} alt={stage.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                    <span className="absolute top-2 left-2 text-xs font-bold tracking-widest" style={{ color: accentColor }}>STAGE {stage.number}</span>
                  </div>
                  <div className={`p-4 text-center flex-grow flex items-center justify-center ${isActive ? 'bg-white/15' : 'bg-white/5'}`}>
                    <span className="text-sm font-bold uppercase tracking-wider leading-snug text-white">
                      {stage.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-8 bg-white/5 rounded-none border border-white/10 max-w-3xl mx-auto text-center space-y-3 animate-fade-in">
            <span className="btn-label" style={{ color: accentColor }}>Stage {timelineStages[activeTimelineStage].number} Details</span>
            <h4 className="text-lg font-bold text-white uppercase tracking-wide">{timelineStages[activeTimelineStage].name}</h4>
            <p className="text-base text-white/60 max-w-lg mx-auto leading-relaxed">
              {timelineStages[activeTimelineStage].desc}
            </p>
          </div>

        </div>
      </section>

      {/* 5. FEATURED PROJECTS COMPOUNDS */}
      <section id="projects-section" className="py-24 section-bg-alt border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow" style={{ color: accentColor }}>Field Applications</span>
            <h2 className="section-title text-premium-black">Delivered Site Compounds</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {activeProjects.map((project: any) => (
              <div 
                key={project.id}
                className="group flex flex-col sm:flex-row heavy-card overflow-hidden h-full"
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
      <section id="videos-section" className="py-24 section-bg-white border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow block" style={{ color: accentColor }}>Recognition</span>
            <h2 className="section-title text-premium-black">Maintaining Safety</h2>
            <p className="section-desc">
              {maintainingSafetyText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {teamAndSite.slice(0, 2).map((src) => (
              <div key={src} className="overflow-hidden border border-hairline-strong bg-[#eaeaea]">
                <img src={src} alt="HP Cabins team and site" className="w-full h-full min-h-[220px] object-cover" loading="lazy" />
              </div>
            ))}
            <div className="overflow-hidden border border-hairline-strong bg-white">
              <YouTubeCard />
            </div>
          </div>
        </div>
      </section>

      {/* BRANCHES & MANUFACTURING UNITS */}
      <section id="branches-section" className="py-24 section-bg-alt border-b border-hairline">
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
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border ${
                  branchTab === tab ? 'text-white border-crimson bg-crimson' : 'bg-white text-body border-hairline-strong hover:border-crimson'
                }`}
                style={branchTab === tab ? { backgroundColor: accentColor, borderColor: accentColor } : undefined}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map((branch, idx) => (
              <div key={idx} className="image-card group">
                <div className="image-card-photo h-40">
                  <img src={branchImages[idx % branchImages.length]} alt={branch.name} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <h4 className="font-bold text-base">{branch.name}</h4>
                  </div>
                </div>
                <div className="heavy-card-body space-y-2">
                  <p className="section-desc text-sm">{branch.address}</p>
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <Phone className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                    <span>{branch.phones}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                    <span>{branch.emails}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7.5. PHOTOREALISTIC GALLERY SHOWCASE */}
      <section id="gallery-section" className="py-24 section-bg-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="section-eyebrow block" style={{ color: accentColor }}>Visual Showcase</span>
            <h2 className="section-title text-white">Our Portable Cabin Gallery</h2>
            <p className="text-base text-white/70 leading-relaxed">
              Explore our portable office cabins, security cabins, accommodation units and container solutions manufactured across India.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {galleryItems.map((item: any, idx: number) => (
            <div key={item.id} className={`group relative overflow-hidden border border-white/15 bg-[#222] ${idx === 0 ? 'sm:col-span-2 sm:row-span-2 sm:min-h-[320px]' : 'aspect-[4/3] sm:min-h-[180px]'}`}>
              <img 
                src={item.images?.[0] || '/wp-content/uploads/2025/08/Steel-Prefabricated-Portable-Cabin_21890091633_steel-prefabricated-portable-cabin.jpg'} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] min-h-[160px]" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-4 sm:p-5">
                <span className="text-xs uppercase tracking-widest font-bold" style={{ color: accentColor }}>{item.category}</span>
                <h4 className="text-sm sm:text-base font-bold text-white mt-1 line-clamp-2">{item.title}</h4>
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
      <section id="faq-section" className="py-24 section-bg-alt border-b border-hairline">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="section-eyebrow" style={{ color: accentColor }}>Regulatory & Specs</span>
          <h2 className="section-title text-premium-black">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqsList.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="heavy-card overflow-hidden">
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
