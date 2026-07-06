'use client';

import React from 'react';
import type { NewsArticle } from '@/data/news';
import NewsCard from '@/components/NewsCard';

type Props = {
  articles: NewsArticle[];
};

export default function NewsGrid({ articles }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
