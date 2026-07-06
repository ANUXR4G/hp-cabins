import { Property } from '@/data/properties';

const LOGO_PATTERNS = [/HPC-LOGO/i, /logo-1\.png/i, /whatsapp\.png/i, /\/jpg\.png$/i];

const CATEGORY_STOCK: Record<string, string[]> = {
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

export function isProductPhoto(path: string): boolean {
  return Boolean(path) && !LOGO_PATTERNS.some((re) => re.test(path));
}

export function getProductGallery(property: Pick<Property, 'images' | 'category' | 'id'>): string[] {
  const real = (property.images || []).filter(isProductPhoto);
  if (real.length) return real;

  const stock = CATEGORY_STOCK[property.category] || CATEGORY_STOCK['Office Cabins'];
  const offset = Math.abs(hashId(property.id)) % stock.length;
  return [...stock.slice(offset), ...stock.slice(0, offset)];
}

export function getProductCoverImage(property: Pick<Property, 'images' | 'category' | 'id'>): string {
  return getProductGallery(property)[0];
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}
