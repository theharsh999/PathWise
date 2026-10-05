import Link from 'next/link';
import { Category } from '@/lib/types';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="card p-5 hover:shadow-sm block">
      <div className="text-2xl mb-2">{category.icon}</div>
      <div className="font-medium mb-1">{category.name}</div>
      <div className="muted text-sm">{category.description}</div>
    </Link>
  );
}
