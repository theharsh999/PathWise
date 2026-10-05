import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Booking } from '@/lib/types';

type BookingsState = {
  bookings: Booking[];
  add: (b: Booking) => void;
  setStatus: (id: string, status: Booking['status']) => void;
};

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set) => ({
      bookings: [],
      add: (b) => set((state) => ({ bookings: [b, ...state.bookings] })),
      setStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        })),
    }),
    { name: 'pw_bookings' },
  ),
);
