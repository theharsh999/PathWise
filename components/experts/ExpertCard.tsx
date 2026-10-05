import Link from 'next/link';
import { BadgeCheck, Star } from 'lucide-react';
import { Expert } from '@/lib/types';

export function ExpertCard({ expert }: { expert: Expert }) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-full flex items-center justify-center font-semibold bg-bg border border-border">
          {expert.name[0]}
        </span>
        <div>
          <div className="font-medium text-sm flex items-center gap-1">
            {expert.name}
            {expert.verified && <BadgeCheck className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />}
          </div>
          <div className="muted text-xs">{expert.categoryName}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs muted">
        <span className="flex items-center gap-1" style={{ color: 'var(--accent)' }}>
          <Star className="w-3.5 h-3.5 fill-current" />
          <span style={{ color: 'var(--ink)' }}>{expert.rating}</span>
        </span>
        <span>{expert.experienceYears} yrs</span>
        <span>{expert.consultations} consults</span>
      </div>
      <p className="muted text-sm line-clamp-2">{expert.bio}</p>
      <Link href={`/experts/${expert.id}`} className="text-center text-sm py-2 mt-1 rounded-lg border border-border">
        View profile
      </Link>
    </div>
  );
}
