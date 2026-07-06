/** HP Cabins navbar content — links resolved at runtime from product/project data */

export const aboutMenuItems = [
  { label: 'About Hindustan Portable Cabins', href: '/about' },
  { label: 'Our Team', href: '/about#team' },
  { label: 'Certificates', href: '/#certificates-section' },
];

export const productMenuItems = [
  'MS Portable Office Cabins',
  'MS Portable Site Office Cabins',
  'MS Portable Office Containers',
  'MS Portable Conference Cabins',
  'GI Portable Office Cabins',
  'GI Portable Office Containers',
  'MS Portable Security Cabins',
  'GI Portable Security Cabins',
  'ACP Security Cabins',
  'MS Portable Toilet Cabins',
  'GI Portable Toilet Cabins',
  'Portable Accommodation Cabins',
  'Portable Bunkhouse Cabins',
  'Portable Double Decker Cabins',
  'Portable Farmhouse Cabins',
  'Portable First-Aid Cabins',
  'Portable Hospital Containers',
  'Portable Labour Camp In Containers',
  'Portable Panel Containers',
  'Portable Restaurant Containers',
  'Portable Roof Solar Cabins',
  'Portable Shop Cabins',
  'Portable Storage Cabins',
  'Cargo Office Containers',
  'Cargo Storage Containers',
];

export const branchesNational = [
  { label: 'Hyderabad Head Office', href: '/#branches-section' },
  { label: 'Visakhapatnam Branch', href: '/#branches-section' },
  { label: 'Bangalore Branch', href: '/#branches-section' },
  { label: 'Bhubaneswar Branch', href: '/#branches-section' },
  { label: 'Ranchi Branch', href: '/#branches-section' },
  { label: 'Vijayawada Branch', href: '/#branches-section' },
  { label: 'Ahmedabad Branch', href: '/#branches-section' },
  { label: 'Delhi Branch', href: '/#branches-section' },
];

export const branchesInternational = [
  { label: 'UAE Office', href: '/#branches-section' },
];

export const mediaMenuItems = [
  { label: 'Photos', href: '/#gallery-section' },
  { label: 'Videos', href: '/#videos-section' },
];

export function slugifyTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function productHref(title: string, products: { id: string; title: string }[]): string {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  const exact = products.find((p) => normalize(p.title) === normalize(title));
  if (exact) return `/properties/${exact.id}`;

  const target = normalize(title);
  const partial = products.find((p) => {
    const pt = normalize(p.title);
    return pt.includes(target) || target.includes(pt);
  });
  if (partial) return `/properties/${partial.id}`;

  return '/properties';
}

export function projectHref(name: string, projects: { id: string; name: string }[]): string {
  const match = projects.find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (match) return `/projects#${match.id}`;
  return '/projects';
}
