'use client';

import React from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ChevronRight, Home, Calendar, ArrowLeft } from 'lucide-react';
import { newsArticles, formatNewsDate } from '@/data/news';

export default function NewsArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const article = newsArticles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24 font-sans text-premium-black">
      <div className="relative bg-premium-black py-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={article.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-premium-black" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-wide leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/50 text-[10px] uppercase tracking-wider mt-4 flex-wrap">
            <Link href="/" className="hover:text-crimson flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/news" className="hover:text-crimson transition-colors">
              News
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-crimson font-bold line-clamp-1">{article.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-crimson transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to News
        </Link>

        <article className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
          <div className="relative h-56 sm:h-72 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-crimson">
                <Calendar className="w-3.5 h-3.5" />
                {formatNewsDate(article.date)}
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-gray-600 font-light leading-relaxed text-center">
              <p>{article.content}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
