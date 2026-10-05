import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type RecentSearchState = {
  queries: string[];
  push: (q: string) => void;
};

export const useRecentSearchStore = create<RecentSearchState>()(
  persist(
    (set) => ({
      queries: [],
      push: (q) =>
        set((state) => ({ queries: [q, ...state.queries.filter((x) => x !== q)].slice(0, 6) })),
    }),
    { name: 'pw_recent_search' },
  ),
);
