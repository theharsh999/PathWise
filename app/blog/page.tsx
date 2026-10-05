'use client';
import { useMemo, useState } from 'react';
import { articles } from '@/data/articles';
import { categories } from '@/data/categories';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const featured = articles[0];

  const filtered = useMemo(
    () =>
      articles
        .slice(1)
        .filter((a) => a.title.toLowerCase().includes(query.toLowerCase()) && (!category || a.category === category)),
    [query, category],
  );

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="font-serif text-3xl mb-2">Blog</h1>
      <p className="muted mb-6">Perspectives and deeper reads on the topics people ask about most.</p>
      <div className="flex flex-wrap gap-2 mb-8">
        <Input placeholder="Search articles" value={query} onChange={(e) => setQuery(e.target.value)} className="w-auto" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="max-w-sm">
        <ArticleCard article={featured} />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-8">
        {filtered.length ? filtered.map((a) => <ArticleCard key={a.slug} article={a} />) : <p className="muted text-sm col-span-3 text-center py-10">No articles match.</p>}
      </div>
    </div>
  );
}
