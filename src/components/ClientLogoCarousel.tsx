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
            className="section-eyebrow block"
            style={{ color: accentColor }}
          >
            Trusted Partners
          </span>
          <h2 className="section-title text-premium-black">
            Our Clients
          </h2>
          <p className="section-desc">
            Leading organizations across infrastructure, energy, technology, and government trust Hindustan Portable Cabins.
          </p>
          <Link
            href="/clients"
            className="inline-block btn-label text-crimson hover:underline pt-1"
          >
            View All Clients
          </Link>
        </div>
      </div>

      <div className="carousel-viewport" ref={emblaRef}>
        <div className="carousel-track">
          {logos.map((src) => (
            <div
              key={src}
              className="carousel-slide basis-[42%] sm:basis-[28%] md:basis-[18%] lg:basis-[14%] xl:basis-[11%]"
            >
              <div className="flex items-center justify-center bg-white rounded-sm border border-gray-100 p-3 sm:p-4 min-h-[72px] sm:min-h-[84px] h-full">
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
