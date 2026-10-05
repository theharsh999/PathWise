import { experts, getExpertById, getExpertsByCategory } from '@/data/experts';
import { Booking, Expert } from '@/lib/types';
import { delay } from '@/lib/utils';

export async function fetchExperts(): Promise<Expert[]> {
  return delay(experts, 300);
}

export async function fetchExpertById(id: string): Promise<Expert | undefined> {
  return delay(getExpertById(id), 300);
}

export async function fetchExpertsByCategory(slug: string): Promise<Expert[]> {
  return delay(getExpertsByCategory(slug), 250);
}

export async function searchExperts(query: string): Promise<Expert[]> {
  const q = query.toLowerCase();
  return delay(
    experts.filter((e) => e.name.toLowerCase().includes(q) || e.categoryName.toLowerCase().includes(q)),
    250,
  );
}

export async function createBooking(input: {
  expertId: string;
  expertName: string;
  date: string;
  time: string;
  consultationType: Booking['consultationType'];
}): Promise<Booking> {
  const booking: Booking = {
    id: `bk-${Date.now()}`,
    status: 'Upcoming',
    ...input,
  };
  return delay(booking, 600);
}
