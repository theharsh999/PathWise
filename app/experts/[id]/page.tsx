'use client';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BadgeCheck, Star } from 'lucide-react';
import { getExpertById } from '@/data/experts';
import { getAdviceByCategory } from '@/data/advice';
import { useHistoryStore } from '@/store/useHistoryStore';
import { Button } from '@/components/ui/Button';
import { AdviceCard } from '@/components/advice/AdviceCard';
import { BookingModal } from '@/components/experts/BookingModal';

export default function ExpertProfilePage({ params }: { params: { id: string } }) {
  const expert = getExpertById(params.id);
  const { push } = useHistoryStore();
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (expert) push({ type: 'expert', id: expert.id, label: expert.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expert?.id]);

  if (!expert) notFound();

  const related = getAdviceByCategory(expert.category).slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <Link href="/experts" className="text-sm muted hover:text-ink">← Experts</Link>
      <div className="card p-6 mt-4 mb-6">
        <div className="flex items-start gap-4 flex-wrap">
          <span className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold shrink-0 bg-bg border border-border">
            {expert.name[0]}
          </span>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl">{expert.name}</h1>
              {expert.verified && <BadgeCheck className="w-4 h-4" style={{ color: 'var(--primary)' }} />}
            </div>
            <div className="muted text-sm mb-2">
              {expert.categoryName} · {expert.experienceYears} yrs experience
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                <Star className="w-4 h-4 fill-current" />
                <span style={{ color: 'var(--ink)' }}>{expert.rating}</span>
              </span>
              <span className="muted">{expert.consultations} consultations</span>
              <span className="muted">{expert.availability}</span>
            </div>
          </div>
          <Button onClick={() => setBookingOpen(true)}>Book Consultation</Button>
        </div>
        <p className="text-sm muted mt-5">
          {expert.bio} With {expert.experienceYears} years of experience, they've worked through hundreds of similar
          situations and focus on practical, realistic guidance rather than one-size-fits-all answers.
        </p>
      </div>

      <h2 className="font-medium mb-3">Advice & articles by area</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {related.length ? related.map((a) => <AdviceCard key={a.id} advice={a} />) : <p className="muted text-sm">Nothing published yet.</p>}
      </div>

      <BookingModal expert={expert} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
