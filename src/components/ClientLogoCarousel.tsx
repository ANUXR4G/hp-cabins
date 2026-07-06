'use client';

import React from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

type Props = {
  logos: string[];
  accentColor?: string;
};

function logoAlt(path: string): string {
  const base = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'Client';
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\d+px-/gi, '')
    .trim();
}

export default function ClientLogoCarousel({ logos, accentColor = '#017501' }: Props) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
      watchDrag: false,
    },
    [
      AutoScroll({
        speed: 1,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      }),
    ],
  );

  if (!logos.length) return null;

  return (
    <section
      id="clients-section"
      className="relative overflow-hidden py-16 sm:py-20 bg-white border-b border-gray-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <span
            className="uppercase tracking-widest text-[10px] font-extrabold block"
            style={{ color: accentColor }}
          >
            Trusted Partners
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-premium-black">
            Our Clients
          </h2>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Leading organizations across infrastructure, energy, technology, and government trust Hindustan Portable Cabins.
          </p>
          <Link
            href="/clients"
            className="inline-block text-[10px] font-bold uppercase tracking-wider text-crimson hover:underline pt-1"
          >
            View All Clients
          </Link>
        </div>
      </div>

      <div className="overflow-hidden px-4 sm:px-8" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-3 sm:-ml-4">
          {logos.map((src) => (
            <div
              key={src}
              className="min-w-0 shrink-0 grow-0 basis-[42%] sm:basis-[28%] md:basis-[18%] lg:basis-[14%] xl:basis-[11%] pl-3 sm:pl-4"
            >
              <div className="flex items-center justify-center bg-white rounded-sm shadow-lg border border-gray-100 p-3 sm:p-4 min-h-[72px] sm:min-h-[84px] h-full">
                <img
                  src={src}
                  alt={logoAlt(src)}
                  className="max-h-10 sm:max-h-12 w-full object-contain"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      />
    </section>
  );
}
