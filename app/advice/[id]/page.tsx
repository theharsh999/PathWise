'use client';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { getAdviceById, getRelatedAdvice } from '@/data/advice';
import { getRelatedArticles } from '@/data/articles';
import { useQuestionsStore } from '@/store/useQuestionsStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { AdviceActions } from '@/components/advice/AdviceActions';
import { AdviceCard } from '@/components/advice/AdviceCard';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { Disclaimer } from '@/components/common/Disclaimer';
import { Advice } from '@/lib/types';

const SENSITIVE = ['finance', 'relationships'];

export default function AdviceResultPage({ params }: { params: { id: string } }) {
  const { getById } = useQuestionsStore();
  const { push } = useHistoryStore();
  const [resolved, setResolved] = useState<Advice | null | undefined>(undefined);

  useEffect(() => {
    const stock = getAdviceById(params.id);
    if (stock) {
      setResolved(stock);
      push({ type: 'advice', id: stock.id, label: stock.title });
      return;
    }
    const asked = getById(params.id);
    if (asked) {
      const adapted: Advice = {
        id: asked.id,
        category: asked.category,
        categoryName: asked.categoryName,
        title: asked.question,
        description: asked.context ?? '',
        readTime: '',
        helpfulPct: 0,
        keyPoints: asked.keyPoints,
      };
      setResolved(adapted);
      push({ type: 'advice', id: asked.id, label: asked.question });
      return;
    }
    setResolved(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (resolved === undefined) return <div className="max-w-2xl mx-auto px-5 py-12 muted text-sm">Loading…</div>;
  if (resolved === null) notFound();

  const advice = resolved;
  const related = getRelatedAdvice(advice.id, advice.category);
  const relatedArticles = getRelatedArticles('', advice.category, 2);
  const sensitive = SENSITIVE.includes(advice.category);

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <span className="chip">{advice.categoryName}</span>
      <h1 className="font-serif text-3xl mt-3 mb-6 leading-tight">{advice.title}</h1>
      {advice.description && (
        <p className="muted text-sm mb-6">
          <strong style={{ color: 'var(--ink)' }}>Context:</strong> {advice.description}
        </p>
      )}

      <div className="card p-6 mb-6">
        <h2 className="font-medium mb-3">Guidance</h2>
        <p className="text-sm leading-relaxed muted">
          Here's a grounded way to think about this — not a single right answer, but a way to move forward with more clarity.
        </p>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-medium mb-3">Key points</h2>
        <ul className="flex flex-col gap-3">
          {advice.keyPoints.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="mt-0.5" style={{ color: 'var(--primary)' }}>✓</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-medium mb-3">Practical next steps</h2>
        <ol className="flex flex-col gap-2 text-sm list-decimal list-inside muted">
          <li>Write down the actual decision you're facing in one sentence.</li>
          <li>Pick one point above and act on it this week, in a small way.</li>
          <li>Revisit this in two weeks with fresh eyes.</li>
        </ol>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-medium mb-3">Things to consider</h2>
        <p className="text-sm muted">
          Everyone's situation carries details a general answer can't see. Weigh this against your own constraints, risk
          tolerance, and what matters most to you right now.
        </p>
      </div>

      <Disclaimer strong={sensitive} />

      <div className="my-6">
        <AdviceActions id={advice.id} title={advice.title} category={advice.category} />
      </div>

      {related.length > 0 && (
        <>
          <h2 className="font-medium mb-3 mt-10">Related advice</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {related.map((a) => (
              <AdviceCard key={a.id} advice={a} />
            ))}
          </div>
        </>
      )}

      {relatedArticles.length > 0 && (
        <>
          <h2 className="font-medium mb-3">Related articles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
