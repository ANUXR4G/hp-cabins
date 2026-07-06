'use client';

import React from 'react';
import { Star } from 'lucide-react';
import type { Testimonial } from '@/data/testimonials';

type Props = {
  testimonial: Testimonial;
  compact?: boolean;
};

export default function TestimonialCard({ testimonial, compact = false }: Props) {
  return (
    <article className="bg-white rounded-none border border-hairline p-5 sm:p-6 flex flex-col h-full hover:border-crimson/30 transition-all duration-300">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-50 border border-gray-100 rounded-none px-4 py-3 min-h-[56px] w-full max-w-[220px] flex items-center justify-center">
          <img
            src={testimonial.logo}
            alt={testimonial.company}
            className="max-h-10 w-full object-contain"
            loading="lazy"
          />
        </div>
      </div>

      <blockquote className="flex-grow text-center content text-gray-600 leading-relaxed">
        <span className="italic">&ldquo;{testimonial.quote}&rdquo;</span>
      </blockquote>

      <div className="mt-5 pt-4 border-t border-gray-100 text-center space-y-2">
        <h3 className="card-title">{testimonial.company}</h3>
        <div className="flex justify-center gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
    </article>
  );
}
