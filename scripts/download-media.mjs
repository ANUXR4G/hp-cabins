#!/usr/bin/env node
/**
 * Sync video assets into public/ before production builds.
 * Images are committed in git under public/wp-content/ — only videos are downloaded here.
 */
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MANIFEST_PATH = path.join(ROOT, 'src/data/media-manifest.json');

const SOURCE_BASE = (process.env.MEDIA_SOURCE_URL || 'https://hpcabins.in').replace(/\/$/, '');
const CONCURRENCY = Number(process.env.MEDIA_DOWNLOAD_CONCURRENCY || 6);
const REGENERATE_MANIFEST = process.env.REGENERATE_MEDIA_MANIFEST === '1';

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

const EXTRA_VIDEO_PATHS = [
  '/wp-content/uploads/2025/08/bannervdo.mp4',
];

const MEDIA_PATTERNS = [
  /https?:\/\/(?:www\.)?hpcabins\.in(\/wp-content\/[^"'\\\s<>)]+)/gi,
  /(\/wp-content\/[^"'\\\s<>)]+)/gi,
];

function normalizePath(raw) {
  if (!raw) return null;
  let p = raw.replace(/&amp;/g, '&').split('?')[0].split('#')[0];
  if (p.startsWith('http')) {
    try {
      p = new URL(p).pathname;
    } catch {
      return null;
    }
  }
  if (!p.startsWith('/wp-content/')) return null;
  if (!/\.(mp4|webm|mov)$/i.test(p)) return null;
  return p;
}

async function collectVideoPaths() {
  const paths = new Set(EXTRA_VIDEO_PATHS);

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

async function loadManifestPaths() {
  if (REGENERATE_MANIFEST || !existsSync(MANIFEST_PATH)) {
    return collectVideoPaths();
  }
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
  const fromManifest = (manifest.paths || []).filter((p) => /\.(mp4|webm|mov)$/i.test(p));
  return fromManifest.length ? fromManifest : collectVideoPaths();
}

function toRemoteUrl(localPath) {
  return `${SOURCE_BASE}${localPath}`;
}

function toDiskPath(localPath) {
  return path.join(PUBLIC_DIR, localPath.replace(/^\//, ''));
}

async function downloadOne(localPath, attempt = 1) {
  const diskPath = toDiskPath(localPath);
  if (existsSync(diskPath)) {
    return { localPath, status: 'skipped' };
  }

  await fs.mkdir(path.dirname(diskPath), { recursive: true });
  const remoteUrl = toRemoteUrl(localPath);

  try {
    const res = await fetch(remoteUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HPCabinsMedia/1.0)' },
      signal: AbortSignal.timeout(180000),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(diskPath, buf);

    if (localPath.endsWith('/bannervdo.mp4')) {
      await fs.writeFile(path.join(PUBLIC_DIR, 'bannervdo.mp4'), buf);
    }

    return { localPath, status: 'downloaded', bytes: buf.length };
  } catch (err) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 1500 * attempt));
      return downloadOne(localPath, attempt + 1);
    }
    throw err;
  }
}

async function runPool(items, worker) {
  const results = new Array(items.length);
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

async function verifyCommittedImages() {
  const imagePaths = [];
  if (!existsSync(MANIFEST_PATH)) return { ok: true, missing: [] };

  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
  for (const p of manifest.paths || []) {
    if (/\.(mp4|webm|mov)$/i.test(p)) continue;
    if (!p.startsWith('/wp-content/')) continue;
    const diskPath = toDiskPath(p);
    if (!existsSync(diskPath)) imagePaths.push(p);
  }

  return { ok: imagePaths.length === 0, missing: imagePaths };
}

async function main() {
  console.log('HP Cabins media sync');
  console.log(`  Video source: ${SOURCE_BASE}`);

  const imageCheck = await verifyCommittedImages();
  if (!imageCheck.ok) {
    console.error(`Missing ${imageCheck.missing.length} committed image(s) in public/wp-content/`);
    imageCheck.missing.slice(0, 8).forEach((p) => console.error(`  - ${p}`));
    if (imageCheck.missing.length > 8) {
      console.error(`  ... and ${imageCheck.missing.length - 8} more`);
    }
    process.exit(1);
  }
  console.log('  Images: OK (committed in repo)');

  const paths = await loadManifestPaths();
  console.log(`  Videos to sync: ${paths.length}`);

  if (!paths.length) {
    console.log('Done — no videos to download.');
    return;
  }

  let downloaded = 0;
  let skipped = 0;
  const failed = [];

  await runPool(paths, async (localPath) => {
    try {
      const result = await downloadOne(localPath);
      if (result.status === 'downloaded') downloaded++;
      else skipped++;
      process.stdout.write(
        `\r  Progress: ${downloaded + skipped}/${paths.length} (${downloaded} new, ${skipped} cached)`,
      );
      return result;
    } catch (err) {
      failed.push({ localPath, error: err.message });
      return null;
    }
  });

  console.log('\n');

  const allVideoPaths = await collectVideoPaths();
  const manifest = {
    generatedAt: new Date().toISOString(),
    source: SOURCE_BASE,
    note: 'Images are committed in git. Videos are downloaded at build time.',
    videoCount: allVideoPaths.length,
    downloaded,
    skipped,
    failed: failed.length,
    paths: [
      ...JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8')).paths.filter(
        (p) => !/\.(mp4|webm|mov)$/i.test(p),
      ),
      ...allVideoPaths,
    ],
  };

  if (REGENERATE_MANIFEST) {
    const imagePaths = new Set();
    for (const rel of SCAN_FILES) {
      const filePath = path.join(ROOT, rel);
      try {
        const text = await fs.readFile(filePath, 'utf8');
        for (const pattern of MEDIA_PATTERNS) {
          pattern.lastIndex = 0;
          for (const match of text.matchAll(pattern)) {
            const raw = match[1] || match[0];
            let p = raw.replace(/&amp;/g, '&').split('?')[0];
            if (p.startsWith('http')) p = new URL(p).pathname;
            if (p.startsWith('/wp-content/') && /\.(jpe?g|png|gif|webp|svg|ico|pdf)$/i.test(p)) {
              imagePaths.add(p);
            }
          }
        }
      } catch {
        // ignore
      }
    }
    manifest.paths = [...imagePaths, ...allVideoPaths].sort();
    manifest.imageCount = imagePaths.size;
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  if (failed.length) {
    console.error(`Failed to download ${failed.length} video(s):`);
    failed.forEach((f) => console.error(`  - ${f.localPath}: ${f.error}`));
    process.exit(1);
  }

  console.log(`Done. ${downloaded} downloaded, ${skipped} already present.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
