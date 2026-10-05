'use client';
import { useMemo, useState } from 'react';
import { experts } from '@/data/experts';
import { ExpertCard } from '@/components/experts/ExpertCard';
import { ExpertFilters, ExpertFilterState } from '@/components/experts/ExpertFilters';

export default function ExpertsPage() {
  const [filters, setFilters] = useState<ExpertFilterState>({ query: '', category: '', sort: 'rating' });

  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase();
    let list = experts.filter(
      (e) => (e.name.toLowerCase().includes(q) || e.categoryName.toLowerCase().includes(q)) && (!filters.category || e.category === filters.category),
    );
    list = [...list].sort((a, b) => (filters.sort === 'rating' ? b.rating - a.rating : b.experienceYears - a.experienceYears));
    return list;
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="font-serif text-3xl mb-2">Find an expert</h1>
      <p className="muted mb-6">Real people who can walk through your situation with you.</p>
      <ExpertFilters value={filters} onChange={setFilters} />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filtered.length ? filtered.map((e) => <ExpertCard key={e.id} expert={e} />) : <p className="muted text-sm col-span-3 text-center py-10">No experts match your filters.</p>}
      </div>
    </div>
  );
}
