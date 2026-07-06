#!/usr/bin/env node
/**
 * Scrape testimonials from hpcabins.in/testimonials/ into src/data/testimonials.ts
 */
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_PATH = path.join(ROOT, 'src', 'data', 'testimonials.ts');
const CMS_PATH = path.join(ROOT, 'src', 'data', 'cms_db.json');
const BASE_URL = 'https://hpcabins.in/testimonials/';

const BACKGROUND = '/wp-content/uploads/2025/08/shutterstock_2100269239-scaled-1.webp';

function shouldSkipLogo(logoPath) {
  return /HPC-LOGO-1|\/whatsapp\.png$|\/2022\/07\/logo-1\.png$/i.test(logoPath);
}

function parseTestimonials(html) {
  const items = [];
  const parts = html.split('testimonial-cnt').slice(1);

  for (const part of parts) {
    const img = part.match(/<img[^>]+src="([^"]+)"/);
    const quote = part.match(/<p>"([^"]+)"/);
    const company = part.match(/<h3>([^<]+)<\/h3>/);
    if (!img || !quote || !company) continue;

    const logo = img[1].split('?')[0].replace('https://hpcabins.in', '');
    if (shouldSkipLogo(logo)) continue;

    items.push({
      id: `test-${items.length + 1}`,
      name: company[1].trim(),
      company: company[1].trim(),
      quote: quote[1].trim(),
      rating: 5,
      logo,
      photo: logo,
    });
  }

  return items;
}

async function main() {
  const res = await fetch(BASE_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HPCabinsClone/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const items = parseTestimonials(html);

  const missing = items.filter((t) => !existsSync(path.join(ROOT, 'public', t.logo)));
  if (missing.length) {
    console.warn(`Warning: ${missing.length} logo files missing from public/`);
  }

  const content = `export const testimonialsBackground = '${BACKGROUND}';\n\nexport interface Testimonial {\n  id: string;\n  name: string;\n  company: string;\n  quote: string;\n  rating: number;\n  logo: string;\n  photo?: string;\n}\n\nexport const testimonialsData: Testimonial[] = ${JSON.stringify(items, null, 2)};\n`;
  await fs.writeFile(OUT_PATH, content);

  const cms = JSON.parse(await fs.readFile(CMS_PATH, 'utf8'));
  cms.testimonials = items;
  await fs.writeFile(CMS_PATH, JSON.stringify(cms, null, 2));

  console.log(`Wrote ${items.length} testimonials to src/data/testimonials.ts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
