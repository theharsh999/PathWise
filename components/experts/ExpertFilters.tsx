'use client';
import { categories } from '@/data/categories';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';

export type ExpertFilterState = { query: string; category: string; sort: 'rating' | 'experience' };

export function ExpertFilters({
  value,
  onChange,
}: {
  value: ExpertFilterState;
  onChange: (v: ExpertFilterState) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Input
        placeholder="Search by name or specialization"
        value={value.query}
        onChange={(e) => onChange({ ...value, query: e.target.value })}
        className="w-auto"
      />
      <Select value={value.category} onChange={(e) => onChange({ ...value, category: e.target.value })}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select value={value.sort} onChange={(e) => onChange({ ...value, sort: e.target.value as ExpertFilterState['sort'] })}>
        <option value="rating">Sort: Rating</option>
        <option value="experience">Sort: Experience</option>
      </Select>
    </div>
  );
}
