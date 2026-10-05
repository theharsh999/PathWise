import { Expert } from '@/lib/types';
import { categories } from './categories';

const names = [
  'Aarav Mehta', 'Priya Nair', 'Rohan Kapoor', 'Sara Ahmed', 'Wei Zhang',
  'Emily Carter', 'Diego Ramirez', 'Fatima Khan', 'James Wilson', 'Ananya Iyer',
  'Liam O\u2019Connor', 'Neha Verma',
];

const availability: Expert['availability'][] = ['Available today', 'Available this week', 'Booking ahead'];

export const experts: Expert[] = names.map((name, i) => {
  const cat = categories[i % categories.length];
  return {
    id: `exp-${i}`,
    name,
    category: cat.slug,
    categoryName: cat.name,
    rating: Number((4.2 + ((i * 13) % 8) / 10).toFixed(1)),
    experienceYears: 3 + (i % 12),
    consultations: 120 + i * 37,
    verified: true,
    bio: `Helps people think through ${cat.name.toLowerCase()} decisions with a calm, practical approach.`,
    availability: availability[i % availability.length],
  };
});

export function getExpertById(id: string) {
  return experts.find((e) => e.id === id);
}

export function getExpertsByCategory(slug: string) {
  return experts.filter((e) => e.category === slug);
}
