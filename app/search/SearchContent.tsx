'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { adviceItems } from '@/data/advice';
import { experts } from '@/data/experts';
import { articles } from '@/data/articles';
import { categories } from '@/data/categories';
import { AdviceCard } from '@/components/advice/AdviceCard';
import { ExpertCard } from '@/components/experts/ExpertCard';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { CategoryCard } from '@/components/common/CategoryCard';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useRecentSearchStore } from '@/store/useRecentSearchStore';

const FILTERS = ['All', 'Advice', 'Experts', 'Articles', 'Categories'] as const;

export default function SearchPage() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const { queries, push } = useRecentSearchStore();

  useEffect(() => {
    if (query.trim()) push(query.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const q = query.toLowerCase().trim();

  const advM = useMemo(() => adviceItems.filter((a) => a.title.toLowerCase().includes(q) || a.categoryName.toLowerCase().includes(q)), [q]);
  const expM = useMemo(() => experts.filter((e) => e.name.toLowerCase().includes(q) || e.categoryName.toLowerCase().includes(q)), [q]);
  const artM = useMemo(() => articles.filter((a) => a.title.toLowerCase().includes(q)), [q]);
  const catM = useMemo(() => categories.filter((c) => c.name.toLowerCase().includes(q)), [q]);

  const totalResults = advM.length + expM.length + artM.length + catM.length;

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-serif text-3xl mb-6">Search</h1>
      <Input
        placeholder="Search advice, experts, articles, categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-5"
      />
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}>
            <Badge active={filter === f}>{f}</Badge>
          </button>
        ))}
      </div>

      {!q ? (
        <div>
          <p className="muted text-sm mb-4">Start typing to search across advice, experts, articles and categories.</p>
          <h2 className="text-sm font-medium muted mb-2">Recent searches</h2>
          <div className="flex gap-2 flex-wrap">
            {queries.length ? (
              queries.map((r) => (
                <button key={r} onClick={() => setQuery(r)} className="chip">
                  {r}
                </button>
              ))
            ) : (
              <span className="muted text-sm">No recent searches yet.</span>
            )}
          </div>
        </div>
      ) : totalResults === 0 ? (
        <div className="text-center py-10 muted">
          <p className="mb-1">No results for "{query}"</p>
          <p className="text-xs">Try a different word or browse categories instead.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {(filter === 'All' || filter === 'Advice') && advM.map((a) => <AdviceCard key={a.id} advice={a} />)}
          {(filter === 'All' || filter === 'Experts') && expM.map((e) => <ExpertCard key={e.id} expert={e} />)}
          {(filter === 'All' || filter === 'Articles') && artM.map((a) => <ArticleCard key={a.slug} article={a} />)}
          {(filter === 'All' || filter === 'Categories') && catM.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      )}
    </div>
  );
}
