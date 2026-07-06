'use client';

import React from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import type { Testimonial } from '@/data/testimonials';
import TestimonialCard from '@/components/TestimonialCard';

type Props = {
  testimonials: Testimonial[];
  accentColor?: string;
};

export default function TestimonialCarousel({ testimonials, accentColor = '#017501' }: Props) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
      watchDrag: false,
    },
    [
      AutoScroll({
        speed: 0.8,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      }),
    ],
  );

  if (!testimonials.length) return null;

  return (
    <section
      id="testimonials-section"
      className="relative overflow-hidden py-16 sm:py-20 section-bg-white border-b border-hairline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-header mb-10 sm:mb-12">
          <span className="section-eyebrow" style={{ color: accentColor }}>
            Client Testimonials
          </span>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-desc">
            Trusted by infrastructure, energy, technology, and government leaders across India.
          </p>
          <Link href="/testimonials" className="inline-block btn-label text-crimson hover:underline pt-1">
            View All Testimonials
          </Link>
        </div>
      </div>

      <div className="carousel-viewport" ref={emblaRef}>
        <div className="carousel-track">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="carousel-slide basis-[88%] sm:basis-[55%] md:basis-[38%] lg:basis-[30%] xl:basis-[24%]"
            >
              <TestimonialCard testimonial={testimonial} compact />
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
