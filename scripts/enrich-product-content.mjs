#!/usr/bin/env node
/**
 * Parse HP product page HTML into structured fields for cms_db.json + properties.ts
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PAGES_INDEX = path.join(ROOT, 'src', 'data', 'hpcabins', 'pages-index.json');
const CMS_PATH = path.join(ROOT, 'src', 'data', 'cms_db.json');
const PROPERTIES_PATH = path.join(ROOT, 'src', 'data', 'properties.ts');

const LOGO_PATTERNS = [/HPC-LOGO/i, /logo-1\.png/i, /whatsapp\.png/i, /\/jpg\.png$/i];

const CATEGORY_STOCK = {
  'Office Cabins': [
    '/wp-content/uploads/2025/08/IMG_20201107_121854-scaled.jpg',
    '/wp-content/uploads/2025/08/portable-cabin-2.jpg',
    '/wp-content/uploads/2025/08/steelportableofficecontainer500x500-jpg-4-1.jpg',
    '/images/office_cabin_premium.jpg',
  ],
  'Container Cabins': [
    '/wp-content/uploads/2025/08/steelportableofficecontainer500x500-jpg-4-1.jpg',
    '/wp-content/uploads/2025/08/Steel-Prefabricated-Portable-Cabin_21890091633_steel-prefabricated-portable-cabin.jpg',
    '/wp-content/uploads/2025/08/portable-cabin-2.jpg',
  ],
  'Security Cabins': [
    '/images/security_cabin_guard.jpg',
    '/wp-content/uploads/2025/08/portable-cabin-2.jpg',
  ],
  'Portable Cabins': [
    '/images/cabin_dubai_skyline.jpg',
    '/wp-content/uploads/2025/08/portable-cabin-2.jpg',
  ],
  'Accommodation Cabins': [
    '/wp-content/uploads/2025/08/portable-cabin-2.jpg',
    '/images/office_cabin_premium.jpg',
  ],
  'Custom Modular Cabins': [
    '/wp-content/uploads/2025/08/Steel-Prefabricated-Portable-Cabin_21890091633_steel-prefabricated-portable-cabin.jpg',
    '/images/office_cabin_premium.jpg',
  ],
  'Toilet Cabins': [
    '/wp-content/uploads/2025/08/portable-cabin-2.jpg',
    '/images/security_cabin_guard.jpg',
  ],
};

function isRealImage(p) {
  return p && !LOGO_PATTERNS.some((re) => re.test(p));
}

function extractImagesFromHtml(html = '') {
  const urls = new Set();
  const patterns = [
    /(?:src|data-src)=["'](\/wp-content\/uploads\/[^"']+)["']/gi,
    /https?:\/\/hpcabins\.in(\/wp-content\/uploads\/[^"'\s>)]+)/gi,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const path = (match[1] || match[0]).split('?')[0];
      const local = path.startsWith('/') ? path : `/wp-content/uploads/${path.replace(/^\/wp-content\/uploads\//, '')}`;
      if (isRealImage(local)) urls.add(local);
    }
  }
  return [...urls];
}

function hashId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function assignProductImages(products) {
  const categoryPools = {};

  for (const product of products) {
    const real = [...new Set((product.images || []).filter(isRealImage))];
    if (!real.length) continue;
    if (!categoryPools[product.category]) categoryPools[product.category] = [];
    categoryPools[product.category].push(...real);
  }

  for (const product of products) {
    const real = [...new Set((product.images || []).filter(isRealImage))];
    if (real.length) {
      product.images = real;
      continue;
    }

    const pool = [...new Set(categoryPools[product.category] || [])];
    const stock = CATEGORY_STOCK[product.category] || CATEGORY_STOCK['Office Cabins'];
    const source = pool.length ? pool : stock;
    const offset = hashId(product.id) % source.length;
    product.images = [...source.slice(offset), ...source.slice(0, offset)].slice(0, 8);
  }
}

function stripTags(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseProductHtml(html = '') {
  const taglineMatch = html.match(/<h2[^>]*>\s*(?:<strong>)?([^<]+?)(?:<\/strong>)?\s*<\/h2>/i);
  const tagline = taglineMatch ? stripTags(taglineMatch[1]) : '';

  const overviewMatch = html.match(/<h2[^>]*>[\s\S]*?<\/h2>\s*<p>([\s\S]*?)<\/p>/i);
  const overview = overviewMatch ? stripTags(overviewMatch[1]) : '';

  const featureCards = [];
  const cardRegex = /<h4>([^<]+)<\/h4>\s*<ul>([\s\S]*?)<\/ul>/gi;
  let cardMatch;
  while ((cardMatch = cardRegex.exec(html)) !== null) {
    const points = [];
    const liRegex = /<li>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(cardMatch[2])) !== null) {
      const point = stripTags(liMatch[1]);
      if (point) points.push(point);
    }
    if (points.length) {
      featureCards.push({ title: stripTags(cardMatch[1]), points });
    }
  }

  const keyBenefits = [];
  const kbMatch = html.match(/<h3[^>]*>\s*(?:<strong>)?Key Benefits(?:<\/strong>)?\s*<\/h3>\s*<ul>([\s\S]*?)<\/ul>/i);
  if (kbMatch) {
    const liRegex = /<li>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(kbMatch[1])) !== null) {
      const text = stripTags(liMatch[1]);
      const split = text.match(/^([^:–—-]+)[:\-–—]\s*(.+)$/);
      if (split) {
        keyBenefits.push({ title: split[1].trim(), description: split[2].trim() });
      } else {
        keyBenefits.push({ title: text, description: '' });
      }
    }
  }

  const applications = [];
  const appMatch = html.match(/<h3[^>]*>\s*(?:<strong>)?Applications(?:<\/strong>)?\s*<\/h3>\s*<ul>([\s\S]*?)<\/ul>/i);
  if (appMatch) {
    const liRegex = /<li>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(appMatch[1])) !== null) {
      const item = stripTags(liMatch[1]);
      if (item) applications.push(item);
    }
  }

  return { tagline, overview, featureCards, keyBenefits, applications };
}

function splitMedia(paths = [], html = '') {
  const images = [];
  const videos = [];
  const allPaths = [...paths, ...extractImagesFromHtml(html)];
  for (const p of allPaths) {
    if (/\.(mp4|webm|mov)(\?|$)/i.test(p)) videos.push(p);
    else if (isRealImage(p)) images.push(p);
  }
  return {
    images: [...new Set(images)],
    videos: [...new Set(videos)],
  };
}

function slugToId(slug) {
  return `hp-${slug.replace(/^products\//, '')}`;
}

async function main() {
  const pagesIndex = JSON.parse(await fs.readFile(PAGES_INDEX, 'utf8'));
  const cms = JSON.parse(await fs.readFile(CMS_PATH, 'utf8'));

  const byId = Object.fromEntries(cms.products.map((p) => [p.id, p]));

  for (const [key, page] of Object.entries(pagesIndex)) {
    if (!key.startsWith('products/') || key === 'products') continue;
    const id = slugToId(key);
    if (!byId[id]) continue;

    const parsed = parseProductHtml(page.content || '');
    const { images, videos } = splitMedia(page.images || [], page.content || '');

    const product = byId[id];

    product.tagline = parsed.tagline || product.title;
    product.overview = parsed.overview || product.description?.slice(0, 400) || '';
    product.featureCards = parsed.featureCards;
    product.keyBenefits = parsed.keyBenefits;
    product.applications = parsed.applications;
    product.images = images;
    product.videos = videos;
    product.videoUrl = videos[0] || product.videoUrl || '';
    product.description = [parsed.tagline, parsed.overview].filter(Boolean).join(' ').slice(0, 500);
    product.community = product.community || 'HP Series';
    product.city = product.city || 'Hyderabad';
    product.virtualTourUrl = product.virtualTourUrl || '#';
    product.floorPlanUrl = product.floorPlanUrl || '#';
  }

  cms.products = cms.products.map((p) => {
    const merged = byId[p.id] || p;
    return {
      community: 'HP Series',
      city: 'Hyderabad',
      virtualTourUrl: '#',
      floorPlanUrl: '#',
      ...merged,
    };
  });

  assignProductImages(cms.products);
  await fs.writeFile(CMS_PATH, JSON.stringify(cms, null, 2));

  const productsJson = JSON.stringify(cms.products, null, 2);
  const propertiesTs = `export interface Property {
  id: string;
  title: string;
  category: string;
  badge: string;
  community: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  developer: string;
  completionDate: string;
  paymentPlan: string;
  description: string;
  tagline?: string;
  overview?: string;
  featureCards?: { title: string; points: string[] }[];
  keyBenefits?: { title: string; description: string }[];
  applications?: string[];
  images: string[];
  videoUrl?: string;
  videos?: string[];
  amenities: string[];
  nearbyAttractions: { name: string; distance: string }[];
  virtualTourUrl: string;
  floorPlanUrl: string;
}

export const propertiesData: Property[] = ${productsJson};
`;

  await fs.writeFile(PROPERTIES_PATH, propertiesTs);
  console.log(`Enriched ${cms.products.length} products with structured HP content.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
