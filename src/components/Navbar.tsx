'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Info, Package, Landmark, Mail,
  Menu, X, ChevronDown, ChevronRight, LayoutGrid, Phone, Image as ImageIcon,
  Users, MessageSquare, MapPin, Newspaper, Briefcase, Video
} from 'lucide-react';

import { getCms } from '@/lib/cms';
import {
  aboutMenuItems, productMenuItems, branchesNational, branchesInternational,
  mediaMenuItems, productHref, projectHref,
} from '@/data/navContent';

const cms = getCms();

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [branchView, setBranchView] = useState<'national' | 'international'>('national');
  const pathname = usePathname();
  const [hash, setHash] = useState('');
  
  const [db] = useState<any>(cms);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = (key: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenMenu(key);
  };

  const scheduleCloseDropdown = (resetBranches = false) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
      if (resetBranches) setBranchView('national');
    }, 180);
  };

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);

    syncHash();
    window.addEventListener('hashchange', syncHash);

    return () => {
      window.removeEventListener('hashchange', syncHash);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setHash(window.location.hash);
  }, [pathname]);

  const accentColor = db?.branding?.colors?.accent || '#017501';
  const products = db?.products || cms.products || [];
  const projects = db?.projects || cms.projects || [];

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/' && hash === href.slice(1);
    if (href.includes('#')) {
      const [path, frag] = href.split('#');
      return pathname === path && hash === `#${frag}`;
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  const navTriggerClass = (active: boolean) =>
    active
      ? 'flex items-center gap-1 px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wide transition-colors duration-300 rounded-lg text-crimson whitespace-nowrap'
      : 'flex items-center gap-1 px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wide transition-colors duration-300 rounded-lg text-premium-black/80 hover:text-crimson group whitespace-nowrap';

  const navChevronClass = (active: boolean) =>
    `w-3 h-3 shrink-0 transition-colors duration-300 ${active ? 'text-crimson' : 'text-gray-400 group-hover:text-crimson'}`;

  const navActiveBar = (active: boolean) =>
    active ? (
      <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-crimson transition-all duration-300" />
    ) : null;

  const dropdownLinkClass = (itemActive: boolean) =>
    `block px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors leading-snug ${
      itemActive
        ? 'text-crimson'
        : 'text-premium-black hover:text-crimson hover:bg-gray-50'
    }`;

  const renderDropdownWrap = (
    key: string,
    label: string,
    Icon: React.ComponentType<any>,
    href: string,
    panel: React.ReactNode,
    wide = false,
  ) => {
    const active = isLinkActive(href) || openMenu === key;
    return (
      <div
        className="relative py-1"
        onMouseEnter={() => openDropdown(key)}
        onMouseLeave={() => scheduleCloseDropdown(key === 'branches')}
      >
        <Link href={href} className={navTriggerClass(active)}>
          <span>{label}</span>
          <ChevronDown className={navChevronClass(active)} />
        </Link>
        {openMenu === key && (
          <div className={`absolute left-0 top-full pt-2 z-50 ${wide ? 'w-[min(90vw,720px)]' : 'w-56'}`}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-150 p-4 animate-fade-in">
              {panel}
            </div>
          </div>
        )}
        {navActiveBar(active)}
      </div>
    );
  };

  const renderMegaPanel = (label: string, items: { label: string; href: string }[]) => {
    const cols = 4;
    const perCol = Math.ceil(items.length / cols);
    const columns = Array.from({ length: cols }, (_, i) => items.slice(i * perCol, (i + 1) * perCol));

    return (
      <div className="w-[min(92vw,860px)] bg-white rounded-2xl shadow-xl border border-gray-150 p-5 animate-fade-in">
        <div className="text-xs uppercase tracking-widest font-extrabold text-gray-400 border-b border-gray-150 pb-2 mb-3 flex items-center gap-1.5">
          <LayoutGrid className="w-3.5 h-3.5" style={{ color: accentColor }} />
          <span>{label}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 max-h-[70vh] overflow-y-auto">
          {columns.map((col, ci) => (
            <div key={ci} className="space-y-0.5">
              {col.map((item) => {
                const itemActive = isLinkActive(item.href);
                return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpenMenu(null)}
                  className={dropdownLinkClass(itemActive)}
                >
                  {item.label}
                </Link>
              );})}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMegaTrigger = (
    key: string,
    label: string,
    href: string,
  ) => {
    const active = isLinkActive(href) || openMenu === key;
    return (
      <div
        className="relative py-1"
        onMouseEnter={() => openDropdown(key)}
        onMouseLeave={() => scheduleCloseDropdown()}
      >
        <Link href={href} className={navTriggerClass(active)}>
          <span>{label}</span>
          <ChevronDown className={navChevronClass(active)} />
        </Link>
        {navActiveBar(active)}
      </div>
    );
  };

  const renderPlainLink = (label: string, href: string, Icon: React.ComponentType<any>) => {
    const active = isLinkActive(href);
    return (
      <div className="relative py-1">
        <Link href={href} className={navTriggerClass(active)}>
          <span>{label}</span>
        </Link>
        {navActiveBar(active)}
      </div>
    );
  };

  const productLinks = productMenuItems.map((title) => ({
    label: title,
    href: productHref(title, products),
  }));

  const projectLinks = projects.map((p: { id: string; name: string }) => ({
    label: p.name,
    href: projectHref(p.name, projects),
  }));

  const megaMenus: Record<string, { label: string; items: { label: string; href: string }[] }> = {
    products: { label: 'Products', items: productLinks },
    projects: { label: 'Projects', items: projectLinks },
  };

  const branchesPanel = (
    <div className="flex gap-4">
      <div className="w-36 shrink-0 space-y-1 border-r border-gray-100 pr-3">
        <button
          type="button"
          onMouseEnter={() => setBranchView('national')}
          className={`w-full flex items-center justify-between px-2 py-2 text-xs font-bold rounded-lg transition-colors ${
            branchView === 'national' ? 'text-crimson' : 'text-gray-600 hover:text-crimson hover:bg-gray-50'
          }`}
        >
          National <ChevronRight className="w-3 h-3" />
        </button>
        <button
          type="button"
          onMouseEnter={() => setBranchView('international')}
          className={`w-full flex items-center justify-between px-2 py-2 text-xs font-bold rounded-lg transition-colors ${
            branchView === 'international' ? 'text-crimson' : 'text-gray-600 hover:text-crimson hover:bg-gray-50'
          }`}
        >
          International <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="flex-1 space-y-0.5 max-h-64 overflow-y-auto">
        {(branchView === 'national' ? branchesNational : branchesInternational).map((b) => {
          const branchActive = isLinkActive(b.href);
          return (
          <Link
            key={b.label}
            href={b.href}
            onClick={() => setOpenMenu(null)}
            className={dropdownLinkClass(branchActive)}
          >
            {b.label}
          </Link>
        );})}
      </div>
    </div>
  );

  const mobileLinks = [
    { label: 'Home', href: '/', icon: Home },
    ...aboutMenuItems.map((i) => ({ label: i.label, href: i.href, icon: Info })),
    ...productLinks.slice(0, 8).map((i) => ({ label: i.label, href: i.href, icon: Package })),
    { label: 'All Products', href: '/properties', icon: Package },
    { label: 'Clients', href: '/clients', icon: Users },
    { label: 'Testimonials', href: '/testimonials', icon: MessageSquare },
    ...branchesNational.map((i) => ({ label: i.label, href: i.href, icon: MapPin })),
    { label: 'UAE Office', href: '/#branches-section', icon: MapPin },
    ...mediaMenuItems.map((i) => ({ label: i.label, href: i.href, icon: i.label === 'Videos' ? Video : ImageIcon })),
    { label: 'News', href: '/news', icon: Newspaper },
    { label: 'All Projects', href: '/projects', icon: Landmark },
    { label: 'Career', href: '/contact', icon: Briefcase },
    { label: 'Contact Us', href: '/contact', icon: Mail },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-150">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DESKTOP: logo | nav | phone */}
        <div className="hidden lg:block relative">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-3 min-h-[72px]">
          
          <Link href="/" className="flex items-center shrink-0 py-1">
            {db?.branding?.logos?.header || db?.branding?.logoUrl ? (
              <img src={db.branding.logos?.header || db.branding.logoUrl} alt={db?.branding?.name || "Hindustan Portable Cabins"} className="h-10 w-auto object-contain" />
            ) : (
              <svg viewBox="0 0 240 60" className="h-10 w-auto" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
                <rect x="10" y="8" width="3.5" height="44" rx="1.5" fill={accentColor} />
                <text x="24" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="18" fill="#111111" letterSpacing="0.5">THE C</text>
                <g fill={accentColor}>
                  {/* Left Hook Leg */}
                  <path d="M 98 12 L 91 12 L 79 38 L 72 38 L 72 42 L 85 42 L 86 38 L 95 18 Z" />
                  {/* Right Leg */}
                  <path d="M 98 12 L 106 12 L 118 42 L 108 42 L 100 20 L 99 18 Z" />
                  {/* Crossbar */}
                  <polygon points="84,32 108,32 110,36 82,36" />
                </g>
                <text x="124" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="18" fill="#111111" letterSpacing="0.5">BINS</text>
                <text x="24" y="49" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="7" letterSpacing="0.4">
                  <tspan fill="#111111">TRANSFORMING THE </tspan>
                  <tspan fill={accentColor}>MODULAR </tspan>
                  <tspan fill="#111111">INDUSTRY</tspan>
                </text>
              </svg>
            )}
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 min-w-0 px-2">
            {renderPlainLink('Home', '/', Home)}
            {renderDropdownWrap('about', 'About Us', Info, '/about', (
              <div className="space-y-0.5">
                {aboutMenuItems.map((item) => {
                  const itemActive = isLinkActive(item.href);
                  return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpenMenu(null)}
                    className={dropdownLinkClass(itemActive)}
                  >
                    {item.label}
                  </Link>
                );})}
              </div>
            ))}
            {renderMegaTrigger('products', 'Products', '/properties')}
            {renderPlainLink('Clients', '/clients', Users)}
            {renderPlainLink('Testimonials', '/testimonials', MessageSquare)}
            {renderDropdownWrap('branches', 'Our Branches', MapPin, '/#branches-section', branchesPanel, true)}
            {renderDropdownWrap('media', 'Media', ImageIcon, '/#gallery-section', (
              <div className="space-y-0.5">
                {mediaMenuItems.map((item) => {
                  const itemActive = isLinkActive(item.href);
                  return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpenMenu(null)}
                    className={dropdownLinkClass(itemActive)}
                  >
                    {item.label}
                  </Link>
                );})}
              </div>
            ))}
            {renderPlainLink('News', '/news', Newspaper)}
            {renderMegaTrigger('projects', 'Projects', '/projects')}
            {renderPlainLink('Career', '/contact', Briefcase)}
          </div>

          <div className="flex items-center justify-end shrink-0">
            <a 
              href={`tel:${(db?.contact?.phone || '+919000088459').replace(/\s/g, '')}`}
              className="flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-white bg-crimson hover:bg-crimson-dark rounded-full transition-all duration-300 shadow-md shadow-crimson/15 active:scale-95 whitespace-nowrap"
              style={{ backgroundColor: accentColor }}
            >
              <Phone className="w-3.5 h-3.5 fill-white text-white shrink-0" />
              <span>{db?.contact?.phone || '+91 90000 88459'}</span>
            </a>
          </div>

        </div>

        {openMenu && megaMenus[openMenu] && (
          <div
            className="absolute left-0 right-0 top-full z-50 pt-1 animate-fade-in"
            onMouseEnter={() => openDropdown(openMenu)}
            onMouseLeave={() => scheduleCloseDropdown()}
          >
            <div className="flex justify-center">
              {renderMegaPanel(megaMenus[openMenu].label, megaMenus[openMenu].items)}
            </div>
          </div>
        )}

        </div>

        {/* TABLET / MOBILE HEADER STRIP */}
        <div className="flex lg:hidden items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-1.5 py-1">
            {db?.branding?.logos?.mobile || db?.branding?.logoUrl ? (
              <img src={db.branding.logos?.mobile || db.branding.logos?.header || db.branding.logoUrl} alt={db?.branding?.name || "Hindustan Portable Cabins"} className="h-9 w-auto object-contain" />
            ) : (
              <svg viewBox="0 0 240 60" className="h-9 w-auto" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
                <rect x="10" y="8" width="3.5" height="44" rx="1.5" fill={accentColor} />
                <text x="24" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="18" fill="#111111" letterSpacing="0.5">THE C</text>
                <g fill={accentColor}>
                  {/* Left Hook Leg */}
                  <path d="M 98 12 L 91 12 L 79 38 L 72 38 L 72 42 L 85 42 L 86 38 L 95 18 Z" />
                  {/* Right Leg */}
                  <path d="M 98 12 L 106 12 L 118 42 L 108 42 L 100 20 L 99 18 Z" />
                  {/* Crossbar */}
                  <polygon points="84,32 108,32 110,36 82,36" />
                </g>
                <text x="124" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="18" fill="#111111" letterSpacing="0.5">BINS</text>
                <text x="24" y="49" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="7" letterSpacing="0.4">
                  <tspan fill="#111111">TRANSFORMING THE </tspan>
                  <tspan fill={accentColor}>MODULAR </tspan>
                  <tspan fill="#111111">INDUSTRY</tspan>
                </text>
              </svg>
            )}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-premium-black/90 hover:text-crimson transition-colors focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE NAV DRAWER */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200/80 shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-3 pb-6 space-y-1 text-xs">
            {mobileLinks.map((m) => {
              const linkActive = isLinkActive(m.href);
              return (
              <Link
                key={`${m.label}-${m.href}`}
                href={m.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 font-bold uppercase tracking-wider transition-colors text-xs ${
                  linkActive
                    ? 'text-crimson'
                    : 'text-premium-black hover:text-crimson'
                }`}
              >
                {React.createElement(m.icon, {
                  className: `w-4 h-4 shrink-0 ${linkActive ? 'text-crimson' : 'text-gray-400'}`,
                })}
                <span>{m.label}</span>
              </Link>
            );})}
            <div className="pt-2.5 border-t border-gray-100">
              <a
                href={`tel:${(db?.contact?.phone || '+919000088459').replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl w-full"
                style={{ backgroundColor: accentColor }}
              >
                <Phone className="w-4 h-4" />
                <span>{db?.contact?.phone || '+91 90000 88459'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
