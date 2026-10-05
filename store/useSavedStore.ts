import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedItem } from '@/lib/types';

type SavedState = {
  items: SavedItem[];
  isSaved: (type: SavedItem['type'], id: string) => boolean;
  toggle: (item: Omit<SavedItem, 'savedAt'>) => void;
  remove: (type: SavedItem['type'], id: string) => void;
};

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      items: [],
      isSaved: (type, id) => get().items.some((i) => i.type === type && i.id === id),
      toggle: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.type === item.type && i.id === item.id);
          return exists
            ? { items: state.items.filter((i) => !(i.type === item.type && i.id === item.id)) }
            : { items: [{ ...item, savedAt: new Date().toISOString() }, ...state.items] };
        }),
      remove: (type, id) =>
        set((state) => ({ items: state.items.filter((i) => !(i.type === type && i.id === id)) })),
    }),
    { name: 'pw_saved' },
  ),
);
