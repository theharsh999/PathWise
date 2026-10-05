'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ placeholder = 'Search...' }: { placeholder?: string }) {
  const [value, setValue] = useState('');
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(value)}`);
      }}
      className="flex gap-2"
    >
      <input
        className="input-field flex-1 px-4 py-3 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="bg-primary text-primary-ink rounded-lg px-5 text-sm font-medium">
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}
