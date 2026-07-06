'use client';

import React from 'react';
import { Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';

const socialLinks = [
  {
    href: 'https://www.facebook.com/hpcabins/',
    label: 'Facebook',
    icon: Facebook,
    className: 'bg-[#3b5998] hover:bg-[#2d4373]',
  },
  {
    href: 'https://www.linkedin.com/feed/',
    label: 'LinkedIn',
    icon: Linkedin,
    className: 'bg-[#0077b5] hover:bg-[#005885]',
  },
  {
    href: 'https://www.youtube.com/channel/UCQzDz8shUyAf0Z_iUZWmEUA',
    label: 'YouTube',
    icon: Youtube,
    className: 'bg-[#ff0000] hover:bg-[#cc0000]',
  },
  {
    href: 'https://www.instagram.com/hindustanportablecabins/?hl=en',
    label: 'Instagram',
    icon: Instagram,
    className: 'bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90',
  },
];

export default function SocialSidebar() {
  return (
    <aside
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col shadow-lg"
      aria-label="Social media links"
    >
      {socialLinks.map(({ href, label, icon: Icon, className }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          aria-label={label}
          className={`flex items-center justify-center w-12 h-12 text-white transition-colors duration-200 ${className}`}
        >
          <Icon className="w-5 h-5" strokeWidth={2} />
        </a>
      ))}
    </aside>
  );
}
