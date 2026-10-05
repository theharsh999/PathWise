import { Suspense } from 'react';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-5 py-12">
          <h1 className="font-serif text-3xl mb-6">Search</h1>
          <p className="muted">Loading search...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}