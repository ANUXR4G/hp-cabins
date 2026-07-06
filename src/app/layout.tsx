import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingElements from '@/components/FloatingElements';
import SocialSidebar from '@/components/SocialSidebar';
import { getCms } from '@/lib/cms';

export function generateMetadata(): Metadata {
  const db = getCms();
  if (!db?.seo) {
    return {
      title: 'Hindustan Portable Cabins | HP Cabins - Portable Cabin Manufacturer India',
      description: 'Leading manufacturer of portable office cabins, security cabins, accommodation units and modular containers in India since 2010.',
      keywords: ['Portable Cabins India', 'HP Cabins', 'Hindustan Portable Cabins'],
    };
  }
  return {
    title: db.seo.title,
    description: db.seo.description,
    keywords: db.seo.keywords ? db.seo.keywords.split(',').map((k: string) => k.trim()) : [],
    authors: [{ name: db.branding?.name || 'Hindustan Portable Cabins' }],
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = getCms();
  const colors = db?.branding?.colors || { primary: '#111111', accent: '#017501', background: '#F5F5F5' };

  const colorVariables = `
    :root {
      --primary-color: ${colors.primary};
      --accent-color: ${colors.accent};
      --background-color: ${colors.background};
    }
  `;

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: colorVariables }} />
        <link rel="icon" href={db?.branding?.logos?.favicon || db?.branding?.faviconUrl || '/favicon.ico'} />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#F5F5F5]">
        <Navbar />
        <SocialSidebar />
        <FloatingElements />

        <main className="flex-grow pt-[64px] lg:pt-[72px] relative z-10 sm:pr-12 xl:pr-14">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
