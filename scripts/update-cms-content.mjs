#!/usr/bin/env node
/**
 * Maps hpcabins.in content into the existing CMS schema (cms_db.json).
 * Does NOT change UI — only updates data files.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const CMS_PATH = path.join(ROOT, 'src', 'data', 'cms_db.json');
const BASE = 'https://hpcabins.in';

async function fetchAll(endpoint) {
  const items = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const res = await fetch(`${BASE}/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}`, {
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) break;
    totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
    const batch = await res.json();
    if (!batch.length) break;
    items.push(...batch);
    page++;
  }
  return items;
}

function decode(s = '') {
  return s
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripHtml(html = '') {
  return decode(html);
}

function localImg(url) {
  if (!url) return '/wp-content/uploads/2025/06/HPC-LOGO-1.png';
  const m = url.match(/\/wp-content\/uploads\/(.+)$/);
  return m ? `/wp-content/uploads/${m[1].split('?')[0]}` : url;
}

async function download(url) {
  const local = localImg(url);
  const disk = path.join(PUBLIC, local);
  try {
    await fs.access(disk);
    return local;
  } catch {
    // continue
  }
  await fs.mkdir(path.dirname(disk), { recursive: true });
  try {
    const res = await fetch(url.split('?')[0], { signal: AbortSignal.timeout(120000) });
    if (!res.ok) return local;
    await fs.writeFile(disk, Buffer.from(await res.arrayBuffer()));
  } catch {
    /* skip failed */
  }
  return local;
}

function productCategory(title) {
  const t = title.toLowerCase();
  if (t.includes('security') || t.includes('guard')) return 'Security Cabins';
  if (t.includes('toilet')) return 'Toilet Cabins';
  if (t.includes('accommodation') || t.includes('bunkhouse') || t.includes('labour')) return 'Accommodation Cabins';
  if (t.includes('container') || t.includes('cargo')) return 'Container Cabins';
  if (t.includes('office') || t.includes('conference') || t.includes('site office')) return 'Office Cabins';
  if (t.includes('shop') || t.includes('restaurant') || t.includes('farmhouse')) return 'Portable Cabins';
  return 'Custom Modular Cabins';
}

function parseProductFeatures(html) {
  const amenities = [];
  const specs = [];
  const liMatches = html.matchAll(/<li>([^<]+)<\/li>/gi);
  for (const m of liMatches) {
    const item = decode(m[1]);
    if (item.length > 2 && item.length < 80) amenities.push(item);
  }
  const h4Matches = html.matchAll(/<h4>([^<]+)<\/h4>/gi);
  for (const m of h4Matches) {
    specs.push({ name: decode(m[1]), distance: 'Custom specification' });
  }
  return {
    amenities: amenities.slice(0, 8),
    specs: specs.slice(0, 4),
  };
}

function slugFromLink(link) {
  const p = new URL(link).pathname.replace(/^\/|\/$/g, '');
  return p.startsWith('products/') ? p.replace('products/', '') : p;
}

async function main() {
  console.log('Fetching hpcabins.in content...');
  const [pages, posts, media] = await Promise.all([
    fetchAll('pages'),
    fetchAll('posts'),
    fetchAll('media'),
  ]);

  const logoUrl = '/wp-content/uploads/2025/06/HPC-LOGO-1.png';
  await download(`${BASE}${logoUrl}`);

  const productPages = pages.filter((p) => p.link.includes('/products/') && !p.link.endsWith('/products/'));
  const projectPages = pages.filter((p) => {
    const slug = slugFromLink(p.link);
    return !slug.startsWith('products') && !['about-us', 'contact-us', 'clients', 'testimonials', 'photos', 'videos', 'career', 'news', 'our-branches', 'our-team', 'certificates', 'completed-projects', 'features', 'home', ''].includes(slug) && !slug.includes('-branch') && slug !== 'uae-office' && slug !== 'hyderabad-head-office' && !slug.includes('portable-office-cabin') && !slug.includes('portable-site-office') && !slug.includes('scrap-') && !slug.includes('salisbury') && !slug.includes('virginia') && !slug.includes('port-adelaide') && !slug.includes('regency-park') && !slug.includes('wingfield');
  });

  const aboutPage = pages.find((p) => p.link.endsWith('/about-us/'));
  const contactPage = pages.find((p) => p.link.endsWith('/contact-us/'));

  // Download images for products (from media library - match by title keywords)
  const mediaByName = Object.fromEntries(media.map((m) => [m.title?.rendered?.toLowerCase() || '', m.source_url]));

  const products = [];
  for (let i = 0; i < productPages.length; i++) {
    const p = productPages[i];
    const title = decode(p.title?.rendered);
    const html = p.content?.rendered || '';
    const desc = stripHtml(html).slice(0, 500);
    const { amenities, specs } = parseProductFeatures(html);
    const id = `hp-${slugFromLink(p.link)}`;
    const imgMatch = html.match(/\/wp-content\/uploads\/[^"'\s>]+\.(jpe?g|png|webp)/i);
    let img = imgMatch ? localImg(`https://hpcabins.in${imgMatch[0]}`) : logoUrl;
    // Try to find a relevant image from media
    const keyword = title.split(' ').slice(-2)[0]?.toLowerCase();
    const mediaImg = Object.entries(mediaByName).find(([k]) => keyword && k.includes(keyword));
    if (mediaImg) img = localImg(mediaImg[1]);
    if (i < 10) await download(img.startsWith('http') ? img : `${BASE}${img}`);

    products.push({
      id,
      title,
      category: productCategory(title),
      badge: i % 3 === 0 ? 'Heavy Duty' : i % 3 === 1 ? 'Eco Friendly' : 'Fast Installation',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      developer: 'Hindustan Portable Cabins',
      completionDate: 'On-Time Delivery',
      paymentPlan: 'Quality Assured Manufacturing',
      description: desc || `${title} manufactured by Hindustan Portable Cabins, India.`,
      images: [img],
      amenities: amenities.length ? amenities : ['Customizable Design', 'Premium Materials', 'Weather Resistant', 'Portable & Relocatable'],
      nearbyAttractions: specs.length ? specs : [{ name: 'Structure', distance: 'MS / GI Steel Frame' }, { name: 'Insulation', distance: 'Sandwich Panel Core' }],
      city: 'Hyderabad',
    });
  }

  const projects = [];
  for (let i = 0; i < Math.min(projectPages.length, 20); i++) {
    const p = projectPages[i];
    const title = decode(p.title?.rendered);
    const desc = stripHtml(p.content?.rendered || '').slice(0, 300);
    const img = localImg('/wp-content/uploads/2025/05/bgimg.jpg');
    if (i < 5) await download(`${BASE}${img}`);
    projects.push({
      id: `project-${i + 1}`,
      name: title,
      location: 'India',
      status: 'Completed',
      client: title.split('–')[0]?.trim() || title.split('-')[0]?.trim() || 'Leading Client',
      date: new Date(p.modified).getFullYear().toString(),
      description: desc || `Portable cabin solutions delivered for ${title}.`,
      img,
    });
  }

  const heroImages = [
    localImg('/wp-content/uploads/2025/08/Steel-Prefabricated-Portable-Cabin_21890091633_steel-prefabricated-portable-cabin.jpg'),
    localImg('/wp-content/uploads/2025/08/IMG_20210331_103428-scaled.jpg'),
    localImg('/wp-content/uploads/2025/08/IMG_20201107_121854-scaled.jpg'),
  ];
  for (const img of heroImages) await download(`${BASE}${img}`);

  const existing = JSON.parse(await fs.readFile(CMS_PATH, 'utf8'));

  const updated = {
    ...existing,
    branding: {
      ...existing.branding,
      name: 'HINDUSTAN PORTABLE CABINS',
      tagline: 'LEADING MANUFACTURER OF PORTABLE CABINS IN INDIA',
      logoUrl: logoUrl,
      logos: { header: logoUrl, footer: logoUrl, mobile: logoUrl, favicon: logoUrl },
      faviconUrl: logoUrl,
    },
    menus: existing.menus.map((m) => {
      if (m.name === 'About') return { ...m, name: 'About Us' };
      if (m.name === 'Industries') return { ...m, name: 'Our Process', href: '/#timeline-section' };
      return m;
    }),
    hero: {
      title: 'High-Quality Portable Cabins',
      subtitle: 'HINDUSTAN PORTABLE CABINS',
      desc: 'Leading manufacturer of portable office containers, site cabins, security cabins, and customized modular solutions across India since 2010.',
      bgImage: heroImages[0],
      slides: products.slice(0, 3).map((p, i) => ({
        id: `slide-${i + 1}`,
        title: p.title,
        subtitle: 'HINDUSTAN PORTABLE CABINS',
        desc: p.description.slice(0, 180),
        img: heroImages[i] || p.images[0],
        link: `/properties/${p.id}`,
      })),
    },
    products,
    projects,
    about: {
      history: 'Hindustan Portable Cabins is a leading and fast-growing manufacturer of high-quality portable cabins in India. Since our inception in 2010, we have proudly completed 15 successful years in the industry, earning a strong reputation for excellence, innovation, and reliability.',
      mission: 'To deliver high-quality portable solutions that meet diverse industry needs with excellence in design, durability, and timely delivery.',
      vision: 'To become a global leader in portable space solutions, setting new benchmarks in quality, innovation, and customer satisfaction.',
      ceoMessage: 'We specialize in designing and manufacturing portable office containers, site cabins, security cabins, and customized modular solutions. Our cabins are trusted across India and internationally.',
      team: existing.about?.team || [],
      certifications: ['ISO Quality Standards', 'Fire Safety Compliant', 'Industry Certified Manufacturing'],
    },
    industries: [
      { id: 'ind-1', title: 'Infrastructure & Construction', desc: 'Office containers, workforce accommodation, and site cabins for highways, metros, and industrial projects.', icon: 'Building' },
      { id: 'ind-2', title: 'Renewable Energy', desc: 'Portable solutions for solar plants, wind farms, and remote energy project sites.', icon: 'Flame' },
      { id: 'ind-3', title: 'Mining & Heavy Industry', desc: 'Durable modular units for mining operations, steel plants, and remote industrial zones.', icon: 'ShieldCheck' },
    ],
    testimonials: [
      { id: 'test-1', name: 'Infrastructure Client', company: 'L&T Construction', quote: 'Hindustan Portable Cabins supplied high-quality portable container solutions across multiple critical infrastructure projects with timely delivery and professional support.', rating: 5, photo: logoUrl },
      { id: 'test-2', name: 'Data Center Client', company: 'Microsoft Project', quote: 'Reliable modular office and accommodation units delivered to specification. Excellent craftsmanship and on-schedule deployment.', rating: 5, photo: logoUrl },
    ],
    clients: [
      { id: 'client-1', name: 'Microsoft', logo: logoUrl },
      { id: 'client-2', name: 'L&T Construction', logo: logoUrl },
      { id: 'client-3', name: 'Jindal Steel & Power', logo: logoUrl },
      { id: 'client-4', name: 'Indian Railways', logo: logoUrl },
      { id: 'client-5', name: 'Adani Enterprises', logo: logoUrl },
    ],
    contact: {
      address: 'Sy.No.43/1, Srisailam Hwy Exit Gate No.14, Tukkuguda, Maheshwaram, Hyderabad, Telangana – 501359',
      googleMaps: heroImages[0],
      phone: '+91 90000 88459',
      whatsapp: '+919000088459',
      email: 'sales@hpcabins.in',
      officeHours: 'Mon - Sat | 9:00 AM - 6:00 PM',
    },
    seo: {
      title: 'Hindustan Portable Cabins | HP Cabins - Portable Cabin Manufacturer India',
      description: 'Leading manufacturer of portable office cabins, security cabins, accommodation units, toilet cabins and modular containers in India since 2010.',
      keywords: 'portable cabins india, portable office containers, site office cabins, security cabins, hpcabins, hindustan portable cabins',
      ogImage: heroImages[0],
      robotsText: existing.seo?.robotsText,
      sitemapText: existing.seo?.sitemapText,
    },
    settings: {
      ...existing.settings,
      whatsappNumber: '+919000088459',
    },
  };

  await fs.writeFile(CMS_PATH, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`Updated cms_db.json: ${products.length} products, ${projects.length} projects`);

  // Generate properties.ts
  const propsTs = `export interface Property {
  id: string;
  title: string;
  category: 'Security Cabins' | 'Portable Cabins' | 'Office Cabins' | 'Accommodation Cabins' | 'Toilet Cabins' | 'Guard Houses' | 'Site Office Cabins' | 'Container Cabins' | 'Custom Modular Cabins';
  badge: 'Premium Living' | 'Waterfront' | 'Golden Visa Eligible' | 'Smart Homes' | 'Exclusive Launch' | 'Eco Friendly' | 'Heavy Duty' | 'Fast Installation';
  community: string;
  city: 'Dubai' | 'Abu Dhabi' | 'Sharjah' | 'Ras Al Khaimah' | 'Hyderabad' | 'Bangalore' | 'Visakhapatnam';
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  developer: 'THE CABINS' | 'Signature Series' | 'Eco Series' | 'Industrial Series' | 'Hindustan Portable Cabins';
  completionDate: string;
  paymentPlan: string;
  description: string;
  images: string[];
  amenities: string[];
  nearbyAttractions: { name: string; distance: string }[];
  virtualTourUrl: string;
  floorPlanUrl: string;
}

export const propertiesData: Property[] = ${JSON.stringify(
    products.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      badge: p.badge,
      community: 'HP Series',
      city: 'Hyderabad',
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area: p.area,
      developer: 'Hindustan Portable Cabins',
      completionDate: p.completionDate,
      paymentPlan: p.paymentPlan,
      description: p.description,
      images: p.images,
      amenities: p.amenities,
      nearbyAttractions: p.nearbyAttractions,
      virtualTourUrl: '#',
      floorPlanUrl: '#',
    })),
    null,
    2
  )};
`;
  await fs.writeFile(path.join(ROOT, 'src', 'data', 'properties.ts'), propsTs, 'utf8');

  // Generate projects.ts
  const projectsTs = `export interface DevelopmentProject {
  id: string;
  name: string;
  category: 'Industrial' | 'Commercial' | 'Construction' | 'Residential';
  location: string;
  city: 'Dubai' | 'Abu Dhabi' | 'Sharjah' | 'Ajman' | 'Al Ain' | 'Fujairah' | 'Ras Al Khaimah' | 'Hyderabad' | 'Bangalore' | 'Visakhapatnam';
  image: string;
  description: string;
  startingPrice: number;
  deliveryDate: string;
}

export const projectsData: DevelopmentProject[] = ${JSON.stringify(
    projects.map((p, i) => ({
      id: p.id,
      name: p.name,
      category: 'Construction',
      location: p.location,
      city: 'Hyderabad',
      image: p.img,
      description: p.description,
      startingPrice: 0,
      deliveryDate: `Completed ${p.date}`,
    })),
    null,
    2
  )};
`;
  await fs.writeFile(path.join(ROOT, 'src', 'data', 'projects.ts'), projectsTs, 'utf8');
  console.log('Updated properties.ts and projects.ts');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
