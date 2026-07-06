import { getCms } from '@/lib/cms';

export function generateStaticParams() {
  return getCms().products.map((product) => ({ id: product.id }));
}

export default function PropertyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
