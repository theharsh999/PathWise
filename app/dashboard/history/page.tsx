'use client';
import Link from 'next/link';
import { useHistoryStore } from '@/store/useHistoryStore';
import { EmptyState } from '@/components/ui/EmptyState';

const routeByType: Record<string, string> = { advice: 'advice', article: 'blog', expert: 'experts' };

export default function HistoryPage() {
  const { items, clear } = useHistoryStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl">History</h1>
        {items.length > 0 && (
          <button onClick={clear} className="text-sm muted hover:underline">
            Clear history
          </button>
        )}
      </div>
      {items.length ? (
        <div className="flex flex-col gap-2">
          {items.map((x) => (
            <Link key={`${x.type}-${x.id}`} href={`/${routeByType[x.type]}/${x.id}`} className="card p-4 flex justify-between items-center hover:shadow-sm">
              <span className="text-sm truncate">{x.label}</span>
              <span className="text-xs muted shrink-0 ml-3">{new Date(x.viewedAt).toLocaleDateString()}</span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="Nothing viewed yet." />
      )}
    </div>
  );
}
