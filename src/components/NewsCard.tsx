'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatNewsDate, type NewsArticle } from '@/data/news';

type Props = {
  article: NewsArticle;
};

export default function NewsCard({ article }: Props) {
  return (
    <article className="group bg-white rounded-none border border-gray-200/60 overflow-hidden flex flex-col h-full hover:border-crimson/30 transition-all duration-300">
      <Link href={`/news/${article.slug}`} className="block relative h-48 sm:h-52 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-premium-black text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-crimson/20">
            <Calendar className="w-3 h-3 text-crimson" />
            {formatNewsDate(article.date)}
          </span>
        </div>
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-base text-premium-black leading-snug text-center">
          <Link href={`/news/${article.slug}`} className="hover:text-crimson transition-colors">
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 section-desc line-clamp-3 text-center flex-grow">
          {article.excerpt}
        </p>
        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
          <Link
            href={`/news/${article.slug}`}
            className="inline-flex items-center gap-1.5 text-base font-bold uppercase tracking-wider text-crimson hover:gap-2.5 transition-all"
          >
            Read more
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
