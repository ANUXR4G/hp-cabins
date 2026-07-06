#!/usr/bin/env node
/**
 * Clone hpcabins.in content via WordPress REST API + HTML crawl.
 * Downloads images/videos to public/ and writes src/data/hpcabins/site.json
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, 'src', 'data', 'hpcabins');
const BASE_URL = 'https://hpcabins.in';

const downloaded = new Map(); // remoteUrl -> localPath
const urlQueue = new Set();

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HPCabinsClone/1.0)' },
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HPCabinsClone/1.0)' },
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchAllWpItems(endpoint) {
  const items = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const url = `${BASE_URL}/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HPCabinsClone/1.0)' },
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) break;
    totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    items.push(...batch);
    page++;
    process.stdout.write(`\r  ${endpoint}: page ${page - 1}/${totalPages} (${items.length} items)`);
  }
  console.log();
  return items;
}

function extractAssetUrls(html) {
  const urls = new Set();
  const patterns = [
    /https?:\/\/hpcabins\.in\/wp-content\/uploads\/[^"'\s<>)]+/gi,
    /\/wp-content\/uploads\/[^"'\s<>)]+/gi,
  ];
  for (const pattern of patterns) {
    const matches = html.matchAll(pattern);
    for (const m of matches) {
      let u = m[0].replace(/&amp;/g, '&').split('?')[0];
      if (u.startsWith('/')) u = BASE_URL + u;
      if (/\.(jpe?g|png|gif|webp|svg|mp4|webm|mov|pdf)(\?|$)/i.test(u)) {
        urls.add(u);
      }
    }
  }
  return urls;
}

function remoteToLocalPath(remoteUrl) {
  const u = remoteUrl.replace(/&amp;/g, '&');
  const match = u.match(/\/wp-content\/uploads\/(.+)$/i);
  if (!match) return null;
  const rel = match[1].split('?')[0];
  return `/wp-content/uploads/${rel}`;
}

async function downloadAsset(remoteUrl) {
  const clean = remoteUrl.replace(/&amp;/g, '&').split('?')[0];
  if (downloaded.has(clean)) return downloaded.get(clean);

  const localPath = remoteToLocalPath(clean);
  if (!localPath) return clean;

  const diskPath = path.join(PUBLIC_DIR, localPath);
  await fs.mkdir(path.dirname(diskPath), { recursive: true });

  try {
    await fs.access(diskPath);
    downloaded.set(clean, localPath);
    return localPath;
  } catch {
    // file doesn't exist yet
  }

  try {
    const res = await fetch(clean, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HPCabinsClone/1.0)' },
      signal: AbortSignal.timeout(120000),
    });
    if (!res.ok) {
      console.warn(`  skip (${res.status}): ${clean}`);
      downloaded.set(clean, clean);
      return clean;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(diskPath, buf);
    downloaded.set(clean, localPath);
    return localPath;
  } catch (e) {
    console.warn(`  failed: ${clean} - ${e.message}`);
    downloaded.set(clean, clean);
    return clean;
  }
}

function rewriteContent(html) {
  if (!html) return '';
  let out = html;
  // Rewrite absolute upload URLs
  out = out.replace(
    /https?:\/\/hpcabins\.in(\/wp-content\/uploads\/[^"'\s>)]+)/gi,
    (_, p) => {
      const local = `/wp-content/uploads/${p.replace(/^\/wp-content\/uploads\//, '')}`.split('?')[0];
      return local;
    }
  );
  out = out.replace(
    /\/wp-content\/uploads\/([^"'\s>)]+)/gi,
    (m) => m.split('?')[0]
  );
  return out;
}

function linkToSlug(link) {
  const u = new URL(link);
  let p = u.pathname.replace(/^\/|\/$/g, '');
  return p || 'home';
}

function classifyPage(slug, link, parent) {
  if (slug === 'home') return 'home';
  if (slug === 'products' || link.includes('/products/')) return 'product';
  if (slug === 'about-us' || slug === 'our-team' || slug === 'certificates') return 'about';
  if (slug === 'contact-us') return 'contact';
  if (slug === 'testimonials') return 'testimonials';
  if (slug === 'clients') return 'clients';
  if (slug === 'photos') return 'photos';
  if (slug === 'videos') return 'videos';
  if (slug === 'career') return 'career';
  if (slug === 'news') return 'news';
  if (slug === 'completed-projects' || slug === 'our-branches') return 'listing';
  if (slug.includes('-branch') || slug === 'hyderabad-head-office' || slug === 'uae-office') return 'branch';
  if (slug.startsWith('products/')) return 'product';
  // Project pages - long list of known patterns
  const projectSlugs = [
    'microsoft', 'aws', 'jindal', 'casagrand', 'aparna', 'lt-construction', 'jsw', 'ctrls',
    'afcons', 'bhushan', 'visakhapatnam-economic', 'vedanta', 'techno-electric', 'ncc-limited',
    'indian-oil', 'singareni', 'mahanadi', 'itd-cementation', 'bekem', 'nkc-projects', 'mythri',
    'dilip-buildcon', 'srr-projects', 'jk-cement', 'gps-renewables', 'nlc-india', 'bhabha',
    'adani', 'wipro', 'indian-railways', 'indian-army', 'andhra-pradesh-medtech', 'swosti',
    'shalimar', 'luminous', 'sumadhura', 'mg-contractors', 'nuvoco', 'tata-power', 'arcelormittal',
    'torrent-gas', 'h-g-infra', 'jindal-renewable',
  ];
  if (projectSlugs.some((p) => slug.includes(p))) return 'project';
  if (parent && String(parent).includes('project')) return 'project';
  return 'page';
}

async function scrapePageHtml(link) {
  try {
    const html = await fetchText(link);
    return extractAssetUrls(html);
  } catch {
    return new Set();
  }
}

async function main() {
  console.log('Fetching WordPress pages...');
  const pages = await fetchAllWpItems('pages');
  console.log('Fetching WordPress posts...');
  const posts = await fetchAllWpItems('posts');
  console.log('Fetching WordPress media...');
  const media = await fetchAllWpItems('media');

  // Queue all media from API (originals only, skip WP size variants)
  for (const m of media) {
    if (m.source_url) urlQueue.add(m.source_url.split('?')[0]);
  }

  // Build page records
  const pageRecords = [];
  const allItems = [
    ...pages.map((p) => ({ ...p, itemType: 'page' })),
    ...posts.map((p) => ({ ...p, itemType: 'post' })),
  ];

  console.log(`Processing ${allItems.length} pages/posts for assets...`);
  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    const slug = linkToSlug(item.link);
    const assets = extractAssetUrls(item.content?.rendered || '');
    const htmlAssets = await scrapePageHtml(item.link);
    htmlAssets.forEach((u) => assets.add(u));
    assets.forEach((u) => urlQueue.add(u));
    process.stdout.write(`\r  content scan: ${i + 1}/${allItems.length}`);

    pageRecords.push({
      id: item.id,
      slug,
      path: '/' + (slug === 'home' ? '' : slug),
      title: item.title?.rendered?.replace(/&#038;/g, '&').replace(/&amp;/g, '&') || '',
      content: rewriteContent(item.content?.rendered || ''),
      excerpt: rewriteContent(item.excerpt?.rendered || ''),
      type: classifyPage(slug, item.link, item.parent),
      itemType: item.itemType,
      link: item.link,
      modified: item.modified,
      parent: item.parent || 0,
      images: [...assets].map((u) => remoteToLocalPath(u) || u),
    });
  }
  console.log();

  // Navigation structure from site
  const navigation = {
    main: [
      { name: 'Home', href: '/' },
      {
        name: 'About Us',
        href: '/about-us',
        children: [
          { name: 'About Hindustan Portable Cabins', href: '/about-us' },
          { name: 'Our Team', href: '/our-team' },
          { name: 'Certificates', href: '/certificates' },
        ],
      },
      {
        name: 'Products',
        href: '/products',
        children: pageRecords
          .filter((p) => p.type === 'product' && p.slug.startsWith('products/'))
          .map((p) => ({
            name: p.title,
            href: '/' + p.slug,
          })),
      },
      { name: 'Clients', href: '/clients' },
      { name: 'Testimonials', href: '/testimonials' },
      {
        name: 'Our Branches',
        href: '/our-branches',
        children: [
          {
            name: 'National',
            children: pageRecords
              .filter((p) => p.type === 'branch' && !p.slug.includes('uae'))
              .map((p) => ({ name: p.title, href: '/' + p.slug })),
          },
          {
            name: 'International',
            children: [{ name: 'UAE Office', href: '/uae-office' }],
          },
        ],
      },
      {
        name: 'Media',
        href: '/photos',
        children: [
          { name: 'Photos', href: '/photos' },
          { name: 'Videos', href: '/videos' },
        ],
      },
      { name: 'News', href: '/news' },
      {
        name: 'Projects',
        href: '/completed-projects',
        children: pageRecords
          .filter((p) => p.type === 'project')
          .map((p) => ({ name: p.title, href: '/' + p.slug })),
      },
      { name: 'Career', href: '/career' },
      { name: 'Contact Us', href: '/contact-us' },
    ],
  };

  const products = pageRecords.filter((p) => p.type === 'product' && p.slug !== 'products');
  const projects = pageRecords.filter((p) => p.type === 'project');
  const branches = pageRecords.filter((p) => p.type === 'branch' || p.slug === 'uae-office');

  const siteData = {
    scrapedAt: new Date().toISOString(),
    source: BASE_URL,
    branding: {
      name: 'Hindustan Portable Cabins',
      shortName: 'HP Cabins',
      tagline: 'Leading manufacturer of portable cabins in India',
      logo: '/wp-content/uploads/2025/06/HPC-LOGO-1.png',
      favicon: '/wp-content/uploads/2025/06/HPC-LOGO-1.png',
      phone: '9000088459',
      whatsapp: '919000088459',
      email: 'sales@hpcabins.in',
      social: {
        facebook: 'https://www.facebook.com/hpcabins/',
        instagram: 'https://www.instagram.com/hindustanportablecabins/?hl=en',
        linkedin: 'https://www.linkedin.com/feed/',
        youtube: 'https://www.youtube.com/channel/UCQzDz8shUyAf0Z_iUZWmEUA',
      },
    },
    navigation,
    pages: pageRecords,
    products,
    projects,
    branches,
    mediaCount: 0,
    assetList: [],
  };

  await fs.mkdir(DATA_DIR, { recursive: true });

  // Write data before downloads so the app can build while assets continue
  await fs.writeFile(
    path.join(DATA_DIR, 'site.json'),
    JSON.stringify(siteData, null, 2),
    'utf8'
  );
  const bySlug = {};
  for (const p of pageRecords) bySlug[p.slug] = p;
  await fs.writeFile(
    path.join(DATA_DIR, 'pages-index.json'),
    JSON.stringify(bySlug, null, 2),
    'utf8'
  );
  console.log(`\nSite data written (${pageRecords.length} pages). Downloading assets...`);

  // Download assets (skip WP auto-generated thumbnails)
  const assetList = [...urlQueue]
    .filter((u) => u.includes('/wp-content/uploads/'))
    .filter((u) => !/-\d+x\d+(-\d+x\d+)?(_c)?\.(jpe?g|png|webp|gif)$/i.test(u));
  console.log(`Downloading ${assetList.length} assets...`);
  let done = 0;
  const concurrency = 12;
  for (let i = 0; i < assetList.length; i += concurrency) {
    const batch = assetList.slice(i, i + concurrency);
    await Promise.all(batch.map(async (url) => {
      await downloadAsset(url);
      done++;
      process.stdout.write(`\r  downloaded: ${done}/${assetList.length}`);
    }));
  }
  console.log();

  siteData.mediaCount = downloaded.size;
  siteData.assetList = [...downloaded.values()];
  await fs.writeFile(
    path.join(DATA_DIR, 'site.json'),
    JSON.stringify(siteData, null, 2),
    'utf8'
  );

  console.log(`\nDone!`);
  console.log(`  Pages/posts: ${pageRecords.length}`);
  console.log(`  Products: ${products.length}`);
  console.log(`  Projects: ${projects.length}`);
  console.log(`  Assets downloaded: ${downloaded.size}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
