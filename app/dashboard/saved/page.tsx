'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { useSavedStore } from '@/store/useSavedStore';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';

export default function SavedPage() {
  const { items, remove } = useSavedStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const filtered = useMemo(
    () => items.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()) && (!category || s.category === category)),
    [items, query, category],
  );

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Saved advice</h1>
      <div className="flex gap-2 mb-5">
        <Input placeholder="Search saved..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-auto" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      {filtered.length ? (
        <div className="flex flex-col gap-2">
          {filtered.map((s) => (
            <div key={`${s.type}-${s.id}`} className="card p-4 flex items-center justify-between">
              <Link href={`/${s.type}/${s.id}`} className="text-sm hover:underline truncate">
                {s.label}
              </Link>
              <button onClick={() => remove(s.type, s.id)} className="text-xs muted" style={{ color: undefined }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Nothing saved yet." />
      )}
    </div>
  );
}
