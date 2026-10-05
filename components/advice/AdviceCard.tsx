'use client';
import Link from 'next/link';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Advice } from '@/lib/types';
import { useSavedStore } from '@/store/useSavedStore';
import { useToast } from '@/components/ui/Toast';

export function AdviceCard({ advice }: { advice: Advice }) {
  const { isSaved, toggle } = useSavedStore();
  const { show } = useToast();
  const saved = isSaved('advice', advice.id);

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="chip">{advice.categoryName}</span>
        <button
          onClick={() => {
            toggle({ type: 'advice', id: advice.id, label: advice.title, category: advice.category });
            if (!saved) show('Saved');
          }}
          className="p-1 rounded"
          style={{ color: saved ? 'var(--accent)' : 'var(--ink-soft)' }}
          aria-label="Save"
        >
          {saved ? <BookmarkCheck className="w-[18px] h-[18px]" /> : <Bookmark className="w-[18px] h-[18px]" />}
        </button>
      </div>
      <Link href={`/advice/${advice.id}`} className="font-medium leading-snug hover:underline">
        {advice.title}
      </Link>
      <p className="muted text-sm line-clamp-2">{advice.description}</p>
      <div className="flex items-center justify-between text-xs muted pt-1">
        <span>{advice.readTime}</span>
        <Link href={`/advice/${advice.id}`} className="font-medium" style={{ color: 'var(--primary)' }}>
          Read more →
        </Link>
      </div>
    </div>
  );
}
