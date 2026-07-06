#!/usr/bin/env node
/**
 * Scrape news posts from hpcabins.in into src/data/news.ts
 */
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_PATH = path.join(ROOT, 'src', 'data', 'news.ts');
const CMS_PATH = path.join(ROOT, 'src', 'data', 'cms_db.json');
const PAGES_INDEX = path.join(ROOT, 'src', 'data', 'hpcabins', 'pages-index.json');
const PUBLIC_DIR = path.join(ROOT, 'public');

const HERO_IMAGE = '/wp-content/uploads/2025/08/WhatsApp-Image-2025-07-29-at-2.16.51-PM-scaled.jpeg';

function decodeHtml(text = '') {
  return text
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripContent(html = '') {
  return decodeHtml(
    html
      .replace(/<div[^>]*envira-gallery[\s\S]*?<\/div>\s*<\/div>/gi, '')
      .replace(/<p>/gi, '\n')
      .replace(/<\/p>/gi, '\n'),
  );
}

function normalizePublicPath(imagePath = '') {
  return imagePath.replace(/^\//, '');
}

function isExcludedImage(imagePath = '') {
  const lower = imagePath.toLowerCase();
  return (
    /hpc-logo|logo-1\.png|-\d+x\d+/i.test(imagePath) ||
    lower.endsWith('/whatsapp.png') ||
    lower.endsWith('whatsapp.png')
  );
}

function pickImage(paths = [], fallback = '') {
  const img = paths.find((p) => {
    if (!p || !/\.(jpe?g|png|webp)$/i.test(p)) return false;
    if (isExcludedImage(p)) return false;
    return existsSync(path.join(PUBLIC_DIR, normalizePublicPath(p)));
  });
  return img || fallback;
}

async function main() {
  const pagesIndex = JSON.parse(await fs.readFile(PAGES_INDEX, 'utf8'));

  const res = await fetch('https://hpcabins.in/wp-json/wp/v2/posts?per_page=20&_embed', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HPCabinsClone/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const posts = await res.json();

  const items = posts.map((post, index) => {
    const slug = post.slug;
    const page = pagesIndex[slug] || {};
    const featured =
      post._embedded?.['wp:featuredmedia']?.[0]?.source_url?.replace('https://hpcabins.in', '').split('?')[0] ||
      '';
    const image = pickImage([featured, ...(page.images || [])], HERO_IMAGE);
    let excerpt =
      decodeHtml(post.excerpt?.rendered) ||
      decodeHtml(page.excerpt) ||
      stripContent(page.content);
    if (!excerpt || excerpt.startsWith('<div')) {
      excerpt = `Hindustan Portable Cabins delivered portable infrastructure for ${decodeHtml(post.title?.rendered)}.`;
    }
    const content = stripContent(page.content) || excerpt;

    return {
      id: `news-${index + 1}`,
      slug,
      title: decodeHtml(post.title?.rendered),
      date: post.date?.slice(0, 10) || '2025-08-01',
      excerpt,
      content,
      image,
    };
  });

  const missing = items.filter(
    (item) => !existsSync(path.join(PUBLIC_DIR, normalizePublicPath(item.image))),
  );
  if (missing.length) {
    console.warn(`Warning: ${missing.length} news images missing from public/`);
  }

  const content = `export const newsHeroImage = '${HERO_IMAGE}';\n\nexport interface NewsArticle {\n  id: string;\n  slug: string;\n  title: string;\n  date: string;\n  excerpt: string;\n  content: string;\n  image: string;\n}\n\nexport const newsArticles: NewsArticle[] = ${JSON.stringify(items, null, 2)};\n\nexport function formatNewsDate(isoDate: string) {\n  return new Date(isoDate).toLocaleDateString('en-GB', {\n    day: '2-digit',\n    month: 'short',\n    year: 'numeric',\n  });\n}\n`;
  await fs.writeFile(OUT_PATH, content);

  const cms = JSON.parse(await fs.readFile(CMS_PATH, 'utf8'));
  cms.blogs = items.map((item) => ({
    id: item.id,
    title: item.title,
    category: 'News',
    tags: [],
    img: item.image,
    date: formatNewsDate(item.date),
    summary: item.excerpt,
    slug: item.slug,
  }));
  await fs.writeFile(CMS_PATH, JSON.stringify(cms, null, 2));

  console.log(`Wrote ${items.length} news articles to src/data/news.ts`);
}

function formatNewsDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
