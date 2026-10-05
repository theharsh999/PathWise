'use client';
import Link from 'next/link';
import { useQuestionsStore } from '@/store/useQuestionsStore';
import { EmptyState } from '@/components/ui/EmptyState';

export default function QuestionsPage() {
  const { questions } = useQuestionsStore();

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">My questions</h1>
      {questions.length ? (
        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <Link key={q.id} href={`/advice/${q.id}`} className="card p-4 flex items-center justify-between hover:shadow-sm">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{q.question}</div>
                <div className="text-xs muted mt-0.5">
                  {q.categoryName} · {new Date(q.date).toLocaleDateString()}
                </div>
              </div>
              <span className="chip shrink-0 ml-3">{q.status}</span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="You haven't asked any questions yet." actionHref="/ask" actionLabel="Ask for advice" />
      )}
    </div>
  );
}
