'use client';

import React from 'react';

type Props = {
  logos: string[];
};

function logoAlt(path: string): string {
  const base = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'Client';
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\d+px-/gi, '')
    .replace(/\.(svg|webp|jpeg|jpg|png)$/i, '')
    .trim();
}

export default function ClientLogoGrid({ logos }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      {logos.map((src) => (
        <div
          key={src}
          className="flex items-center justify-center bg-white border border-gray-300/80 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.12)] p-3 sm:p-4 min-h-[72px] sm:min-h-[84px] transition-transform duration-300 hover:scale-[1.02]"
        >
          <img
            src={src}
            alt={logoAlt(src)}
            className="max-h-10 sm:max-h-12 w-full object-contain"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
