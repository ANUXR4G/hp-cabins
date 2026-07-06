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
    active ? 'nav-link nav-link-active' : 'nav-link';

  const navChevronClass = (active: boolean) =>
    `w-3 h-3 shrink-0 transition-colors duration-200 ${active ? 'text-white' : 'text-white/60'}`;

  const navActiveBar = (_active: boolean) => null;

  const dropdownLinkClass = (itemActive: boolean) =>
    itemActive ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link';

  const logoSrc = db?.branding?.logos?.header || db?.branding?.logoUrl || '/wp-content/uploads/2025/06/HPC-LOGO-1.png';
  const mobileLogoSrc = db?.branding?.logos?.mobile || logoSrc;

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
            <div className="bg-white rounded-none border border-gray-150 p-4 animate-fade-in">
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
      <div className="w-[min(92vw,860px)] bg-white rounded-none border border-gray-150 p-5 animate-fade-in">
        <div className="text-xs uppercase tracking-widest font-bold text-gray-500 border-b border-gray-150 pb-2 mb-3 flex items-center gap-1.5">
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
          className={`w-full flex items-center justify-between px-2 py-2 text-xs font-semibold rounded-none transition-colors ${
            branchView === 'national' ? 'text-crimson bg-gray-50' : 'text-gray-600 hover:text-crimson hover:bg-gray-50'
          }`}
        >
          National <ChevronRight className="w-3 h-3" />
        </button>
        <button
          type="button"
          onMouseEnter={() => setBranchView('international')}
          className={`w-full flex items-center justify-between px-2 py-2 text-xs font-bold rounded-none transition-colors ${
            branchView === 'international' ? 'text-crimson bg-gray-50' : 'text-gray-600 hover:text-crimson hover:bg-gray-50'
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
    <nav className="fixed top-0 left-0 w-full z-50 site-header">
      <div className="site-header-stripe" />
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DESKTOP: logo | nav | phone */}
        <div className="hidden md:block relative">
        <div className="grid grid-cols-[110px_minmax(0,1fr)_auto] items-center gap-3 xl:gap-4 min-h-[72px] py-2">
          
          <Link href="/" className="flex items-center shrink-0">
            <img
              src={logoSrc}
              alt={db?.branding?.name || 'Hindustan Portable Cabins'}
              className="w-[110px] h-auto object-contain"
            />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 min-w-0 px-1">
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
              className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-semibold text-white rounded-none whitespace-nowrap transition-colors hover:bg-crimson-dark"
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
        <div className="flex md:hidden items-center justify-between min-h-[64px] py-2">
          <Link href="/" className="flex items-center shrink-0">
            <img
              src={mobileLogoSrc}
              alt={db?.branding?.name || 'Hindustan Portable Cabins'}
              className="w-[90px] sm:w-[110px] h-auto object-contain"
            />
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white hover:text-crimson-light transition-colors focus:outline-none"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE NAV DRAWER */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#111111] border-b border-white/10 z-50 max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-3 pb-6 space-y-0.5">
            {mobileLinks.map((m) => {
              const linkActive = isLinkActive(m.href);
              return (
              <Link
                key={`${m.label}-${m.href}`}
                href={m.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-normal normal-case transition-colors ${
                  linkActive
                    ? 'text-white bg-[#333333]'
                    : 'text-white/90 hover:text-white hover:bg-[#333333]'
                }`}
              >
                {React.createElement(m.icon, {
                  className: `w-4 h-4 shrink-0 ${linkActive ? 'text-crimson-light' : 'text-white/50'}`,
                })}
                <span>{m.label}</span>
              </Link>
            );})}
            <div className="pt-2.5 border-t border-white/10">
              <a
                href={`tel:${(db?.contact?.phone || '+919000088459').replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 px-4 rounded-none w-full"
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
