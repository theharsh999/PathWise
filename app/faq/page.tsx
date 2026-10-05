'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';

const faqs: [string, string][] = [
  ['How does the platform work?', 'You ask a question, we generate structured guidance, and you can save it or talk to an expert.'],
  ['Is advice free?', 'Yes, guidance on the platform is free. Expert consultations may have their own pricing in the future.'],
  ["Can I ask anonymously?", "Yes — you don't need an account to get advice, only to save it or track history."],
  ['How are experts verified?', 'Experts are reviewed for relevant experience before being listed, shown with a verified badge.'],
  ['Can I save advice?', "Yes, use the save button on any advice or article — it's stored to your account."],
  ['Can I delete my questions?', 'Yes, from your dashboard under My Questions.'],
  ['Is this professional advice?', 'No — it\u2019s general guidance. For legal, medical or financial matters, consult a licensed professional.'],
  ['How can I contact support?', 'Use the Contact page — we read every message.'],
];

export default function FAQPage() {
  const [query, setQuery] = useState('');
  const filtered = faqs.filter(([q]) => q.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <h1 className="font-serif text-3xl mb-6">Frequently asked questions</h1>
      <Input placeholder="Search FAQs" value={query} onChange={(e) => setQuery(e.target.value)} className="mb-6" />
      <div className="flex flex-col gap-2">
        {filtered.map(([q, a]) => (
          <details key={q} className="card p-4">
            <summary className="cursor-pointer font-medium text-sm">{q}</summary>
            <p className="muted text-sm mt-2">{a}</p>
          </details>
        ))}
        {filtered.length === 0 && <p className="muted text-sm text-center py-6">No matching questions.</p>}
      </div>
    </div>
  );
}
