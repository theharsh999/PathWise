'use client';
import { useBookingsStore } from '@/store/useBookingsStore';
import { EmptyState } from '@/components/ui/EmptyState';
import { Booking } from '@/lib/types';

const GROUPS: Booking['status'][] = ['Upcoming', 'Completed', 'Cancelled'];

function BookingCard({ b }: { b: Booking }) {
  return (
    <div className="card p-4 flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">{b.expertName}</div>
        <div className="text-xs muted">
          {b.date} · {b.time} · {b.consultationType}
        </div>
      </div>
      <span className="chip">{b.status}</span>
    </div>
  );
}

export default function ConsultationsPage() {
  const { bookings } = useBookingsStore();

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Consultations</h1>
      {bookings.length ? (
        GROUPS.map((g) => {
          const items = bookings.filter((b) => b.status === g);
          if (!items.length) return null;
          return (
            <div key={g}>
              <h2 className="font-medium mb-3 mt-2">{g}</h2>
              <div className="flex flex-col gap-2 mb-6">
                {items.map((b) => (
                  <BookingCard key={b.id} b={b} />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <EmptyState title="No consultations yet." actionHref="/experts" actionLabel="Browse experts" />
      )}
    </div>
  );
}
