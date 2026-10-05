'use client';
import { useState } from 'react';
import { categories } from '@/data/categories';
import { CategoryCard } from '@/components/common/CategoryCard';
import { Input } from '@/components/ui/Input';

export default function CategoriesPage() {
  const [query, setQuery] = useState('');
  const filtered = categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="font-serif text-3xl mb-2">Explore categories</h1>
      <p className="muted mb-6">Find guidance organized around the decisions people actually face.</p>
      <Input
        placeholder="Search categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm mb-8"
      />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
        {filtered.length === 0 && <p className="muted text-sm col-span-3 text-center py-10">No categories match "{query}".</p>}
      </div>
    </div>
  );
}
