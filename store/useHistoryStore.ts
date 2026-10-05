import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HistoryItem } from '@/lib/types';

type HistoryState = {
  items: HistoryItem[];
  push: (item: Omit<HistoryItem, 'viewedAt'>) => void;
  clear: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      push: (item) =>
        set((state) => {
          const filtered = state.items.filter((i) => !(i.type === item.type && i.id === item.id));
          return { items: [{ ...item, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 30) };
        }),
      clear: () => set({ items: [] }),
    }),
    { name: 'pw_history' },
  ),
);
