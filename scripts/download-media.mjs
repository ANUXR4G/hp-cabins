#!/usr/bin/env node
/**
 * Download all media referenced in site data into public/.
 * Run before build so deployed site is independent of hpcabins.in.
 *
 * Usage:
 *   yarn download:media
 *   MEDIA_SOURCE_URL=https://your-cdn.example yarn download:media
 */
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'media-manifest.json');

const SOURCE_BASE = (process.env.MEDIA_SOURCE_URL || 'https://hpcabins.in').replace(/\/$/, '');
const CONCURRENCY = Number(process.env.MEDIA_DOWNLOAD_CONCURRENCY || 10);
const SKIP_EXISTING = process.env.FORCE_MEDIA_DOWNLOAD !== '1';

const SCAN_FILES = [
  'src/data/cms_db.json',
  'src/data/clients.ts',
  'src/data/testimonials.ts',
  'src/data/news.ts',
  'src/data/properties.ts',
  'src/data/projects.ts',
  'src/data/homeSections.ts',
  'src/lib/productImages.ts',
  'src/app/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/about/page.tsx',
  'src/app/properties/page.tsx',
  'src/app/projects/page.tsx',
];

const EXTRA_PATHS = [
  '/bannervdo.mp4',
  '/wp-content/uploads/2025/08/bannervdo.mp4',
  '/wp-content/uploads/2025/06/HPC-LOGO-1.png',
  '/wp-content/uploads/2025/07/call-center.jpg',
  '/wp-content/uploads/2025/08/Mining-scaled.jpg',
  '/wp-content/uploads/2025/08/shutterstock_2100269239-scaled-1.webp',
  '/wp-content/uploads/2025/08/IMG_20210331_103428-scaled.jpg',
  '/wp-content/uploads/2025/08/WhatsApp-Image-2025-07-28-at-16.56.46-scaled.jpeg',
  '/wp-content/uploads/2025/08/Steel-Prefabricated-Portable-Cabin_21890091633_steel-prefabricated-portable-cabin.jpg',
];

const MEDIA_PATTERNS = [
  /https?:\/\/(?:www\.)?hpcabins\.in(\/wp-content\/[^"'\\\s<>)]+)/gi,
  /(\/wp-content\/[^"'\\\s<>)]+)/gi,
  /(\/bannervdo\.mp4)/gi,
];

function normalizePath(raw) {
  if (!raw) return null;
  let p = raw.replace(/&amp;/g, '&').split('?')[0].split('#')[0];
  if (p.startsWith('http')) {
    try {
      const url = new URL(p);
      p = url.pathname;
    } catch {
      return null;
    }
  }
  if (!p.startsWith('/')) return null;
  if (!/^\/(wp-content\/|bannervdo\.mp4)/.test(p)) return null;
  if (!/\.(jpe?g|png|gif|webp|svg|mp4|webm|mov|pdf|ico)$/i.test(p)) return null;
  return p;
}

async function collectPaths() {
  const paths = new Set(EXTRA_PATHS.map(normalizePath).filter(Boolean));

  for (const rel of SCAN_FILES) {
    const filePath = path.join(ROOT, rel);
    try {
      const text = await fs.readFile(filePath, 'utf8');
      for (const pattern of MEDIA_PATTERNS) {
        pattern.lastIndex = 0;
        for (const match of text.matchAll(pattern)) {
          const candidate = normalizePath(match[1] || match[0]);
          if (candidate) paths.add(candidate);
        }
      }
    } catch {
      console.warn(`  skip missing scan file: ${rel}`);
    }
  }

  return [...paths].sort();
}

function toRemoteUrl(localPath) {
  return `${SOURCE_BASE}${localPath}`;
}

function toDiskPath(localPath) {
  return path.join(PUBLIC_DIR, localPath.replace(/^\//, ''));
}

async function downloadOne(localPath) {
  const diskPath = toDiskPath(localPath);
  if (SKIP_EXISTING && existsSync(diskPath)) {
    return { localPath, status: 'skipped' };
  }

  await fs.mkdir(path.dirname(diskPath), { recursive: true });
  const remoteUrl = toRemoteUrl(localPath);

  const res = await fetch(remoteUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HPCabinsMedia/1.0)' },
    signal: AbortSignal.timeout(120000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(diskPath, buf);

  if (localPath === '/wp-content/uploads/2025/08/bannervdo.mp4') {
    const rootCopy = path.join(PUBLIC_DIR, 'bannervdo.mp4');
    await fs.writeFile(rootCopy, buf);
  }

  return { localPath, status: 'downloaded', bytes: buf.length };
}

async function runPool(items, worker) {
  const results = [];
  let index = 0;

  async function next() {
    while (index < items.length) {
      const i = index++;
      results[i] = await worker(items[i]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, () => next()));
  return results;
}

async function main() {
  console.log(`Media source: ${SOURCE_BASE}`);
  const paths = await collectPaths();
  console.log(`Found ${paths.length} media paths to sync`);

  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  let downloaded = 0;
  let skipped = 0;
  const failed = [];

  const results = await runPool(paths, async (localPath) => {
    try {
      const result = await downloadOne(localPath);
      if (result.status === 'downloaded') downloaded++;
      else skipped++;
      process.stdout.write(
        `\r  ${downloaded + skipped}/${paths.length} (${downloaded} new, ${skipped} cached)`,
      );
      return result;
    } catch (err) {
      failed.push({ localPath, error: err.message });
      return null;
    }
  });

  console.log('\n');

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: SOURCE_BASE,
    total: paths.length,
    downloaded,
    skipped,
    failed: failed.length,
    paths,
  };
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  if (failed.length) {
    console.warn(`Failed to download ${failed.length} files:`);
    failed.slice(0, 10).forEach((f) => console.warn(`  - ${f.localPath}: ${f.error}`));
    if (failed.length > 10) console.warn(`  ... and ${failed.length - 10} more`);
    if (process.env.ALLOW_MEDIA_DOWNLOAD_FAILURES !== '1') {
      process.exit(1);
    }
  }

  console.log(`Done. Manifest: src/data/media-manifest.json`);
  void results;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
