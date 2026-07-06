import { newsArticles } from '@/data/news';

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export default function NewsArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
