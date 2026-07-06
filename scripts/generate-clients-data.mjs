#!/usr/bin/env node
/**
 * Regenerate src/data/clients.ts from HP clients page scrape (150 logos, 25×6 grid).
 */
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PAGES_INDEX = path.join(ROOT, 'src', 'data', 'hpcabins', 'pages-index.json');
const OUT_PATH = path.join(ROOT, 'src', 'data', 'clients.ts');
const PUBLIC_DIR = path.join(ROOT, 'public');

const BACKGROUND = '/wp-content/uploads/2025/08/Mining-scaled.jpg';
const EXCLUDE = new Set([
  '/wp-content/uploads/2025/06/HPC-LOGO-1.png',
  BACKGROUND,
  '/wp-content/uploads/2025/07/whatsapp.png',
  '/wp-content/uploads/2022/07/logo-1.png',
]);

async function main() {
  const pagesIndex = JSON.parse(await fs.readFile(PAGES_INDEX, 'utf8'));
  const all = pagesIndex.clients?.images || [];
  const logos = all.filter((src) => !EXCLUDE.has(src));

  const missing = logos.filter((src) => !existsSync(path.join(PUBLIC_DIR, src)));
  if (missing.length) {
    console.warn(`Warning: ${missing.length} logo files missing from public/`);
    missing.slice(0, 5).forEach((m) => console.warn(`  ${m}`));
  }

  const content = `export const clientsBackground = '${BACKGROUND}';\n\nexport const clientLogos: string[] = ${JSON.stringify(logos, null, 2)};\n`;
  await fs.writeFile(OUT_PATH, content);
  console.log(`Wrote ${logos.length} client logos to src/data/clients.ts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
