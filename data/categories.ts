import { Category } from '@/lib/types';

export const categories: Category[] = [
  { slug: 'career', name: 'Career & Education', icon: '🎯', description: 'Choosing paths, switching fields, and building skills that matter.' },
  { slug: 'business', name: 'Business', icon: '🧭', description: 'Starting, running, and growing something of your own.' },
  { slug: 'finance', name: 'Finance', icon: '💰', description: 'Budgeting, saving, debt, and making sense of money.' },
  { slug: 'relationships', name: 'Relationships', icon: '💬', description: 'Family, friendships, and romantic relationships.' },
  { slug: 'growth', name: 'Personal Growth', icon: '🌱', description: 'Habits, confidence, and becoming who you want to be.' },
  { slug: 'technology', name: 'Technology', icon: '💻', description: 'Learning tech, tools, and staying current.' },
  { slug: 'college', name: 'College Life', icon: '🎓', description: 'Courses, campus life, and figuring college out.' },
  { slug: 'jobs', name: 'Jobs & Interviews', icon: '🗂️', description: 'Resumes, interviews, offers, and job searching.' },
  { slug: 'lifestyle', name: 'Lifestyle', icon: '🏡', description: 'Everyday living, habits, and wellbeing.' },
  { slug: 'study', name: 'Study', icon: '📚', description: 'Exams, focus, and effective learning.' },
  { slug: 'productivity', name: 'Productivity', icon: '⚡', description: 'Getting meaningful work done without burning out.' },
  { slug: 'entrepreneurship', name: 'Entrepreneurship', icon: '🚀', description: 'Turning an idea into something real.' },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
