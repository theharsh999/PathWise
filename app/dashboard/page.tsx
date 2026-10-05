'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuestionsStore } from '@/store/useQuestionsStore';
import { useSavedStore } from '@/store/useSavedStore';
import { useBookingsStore } from '@/store/useBookingsStore';
import { EmptyState } from '@/components/ui/EmptyState';

export default function DashboardHome() {
  const { user } = useAuthStore();
  const { questions } = useQuestionsStore();
  const { items: saved } = useSavedStore();
  const { bookings } = useBookingsStore();
  const upcoming = bookings.find((b) => b.status === 'Upcoming');
  const helpfulCount = Math.round(questions.length * 0.8);

  return (
    <div>
      <h1 className="font-serif text-2xl mb-1">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
      <p className="muted text-sm mb-7">Here's what's happening with your account.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          ['Questions asked', questions.length],
          ['Advice saved', saved.length],
          ['Consultations', bookings.length],
          ['Helpful responses', helpfulCount],
        ].map(([label, value]) => (
          <div key={label as string} className="card p-4">
            <div className="font-serif text-2xl">{value}</div>
            <div className="muted text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-medium mb-3">Recent questions</h2>
          {questions.length ? (
            questions.slice(0, 4).map((q) => (
              <Link key={q.id} href={`/advice/${q.id}`} className="card p-4 flex justify-between items-center mb-2 hover:shadow-sm">
                <span className="text-sm truncate">{q.question}</span>
                <span className="chip shrink-0 ml-2">{q.status}</span>
              </Link>
            ))
          ) : (
            <EmptyState title="You haven't asked anything yet." actionHref="/ask" actionLabel="Ask your first question" />
          )}
        </div>
        <div>
          <h2 className="font-medium mb-3">Saved advice</h2>
          {saved.length ? (
            saved.slice(0, 4).map((s) => (
              <Link key={`${s.type}-${s.id}`} href={`/${s.type}/${s.id}`} className="card p-4 flex justify-between items-center mb-2 hover:shadow-sm">
                <span className="text-sm truncate">{s.label}</span>
              </Link>
            ))
          ) : (
            <EmptyState title="Nothing saved yet." />
          )}
        </div>
      </div>

      <h2 className="font-medium mb-3 mt-8">Upcoming consultation</h2>
      {upcoming ? (
        <div className="card p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">{upcoming.expertName}</div>
            <div className="text-xs muted">
              {upcoming.date} · {upcoming.time} · {upcoming.consultationType}
            </div>
          </div>
          <span className="chip">{upcoming.status}</span>
        </div>
      ) : (
        <EmptyState title="No consultations booked." actionHref="/experts" actionLabel="Browse experts" />
      )}
    </div>
  );
}
