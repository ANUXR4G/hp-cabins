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
      className="relative overflow-hidden py-16 sm:py-20 bg-[#F5F5F5] border-b border-gray-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <span
            className="uppercase tracking-widest text-[10px] font-extrabold block"
            style={{ color: accentColor }}
          >
            Client Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-premium-black">
            What Our Clients Say
          </h2>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Trusted by infrastructure, energy, technology, and government leaders across India.
          </p>
          <Link
            href="/testimonials"
            className="inline-block text-[10px] font-bold uppercase tracking-wider text-crimson hover:underline pt-1"
          >
            View All Testimonials
          </Link>
        </div>
      </div>

      <div className="overflow-hidden px-4 sm:px-8" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4 sm:-ml-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="min-w-0 shrink-0 grow-0 basis-[88%] sm:basis-[55%] md:basis-[38%] lg:basis-[30%] xl:basis-[24%] pl-4 sm:pl-6"
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
