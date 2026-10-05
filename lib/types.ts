export type Category = {
  id?: number;
  slug: string;
  name: string;
  icon: string;
  description: string;
  created_at?: string;
  question_count?: number;
};

export type BackendCategory = {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  question_count?: number;
};

export type Advice = {
  id: string;
  category: string;
  categoryName: string;
  title: string;
  description: string;
  readTime: string;
  helpfulPct: number;
  keyPoints: string[];
};

export type Expert = {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  rating: number;
  experienceYears: number;
  consultations: number;
  verified: boolean;
  bio: string;
  availability: 'Available today' | 'Available this week' | 'Booking ahead';
};

export type Article = {
  slug: string;
  category: string;
  categoryName: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
};

export type Question = {
  id: string;
  category: string;
  categoryName: string;
  question: string;
  context?: string;
  outcome?: string;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Answered' | 'Pending' | 'Draft';
  date: string;
  keyPoints: string[];
};

export type SavedItem = {
  type: 'advice' | 'article';
  id: string;
  label: string;
  category?: string;
  savedAt: string;
};

export type HistoryItem = {
  type: 'advice' | 'article' | 'expert';
  id: string;
  label: string;
  viewedAt: string;
};

export type Booking = {
  id: string;
  expertId: string;
  expertName: string;
  date: string;
  time: string;
  consultationType: 'Video call' | 'Chat';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
};

export type User = {
  id?: number;
  name: string;
  email: string;
  bio: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'blocked';
  interests: string[];
  joinedAt: string;
  token?: string;
};

export type AdminStats = {
  total_users: number;
  total_admins: number;
  active_users: number;
  blocked_users: number;
  total_questions: number;
  total_answers: number;
  total_categories: number;
  total_reports: number;
  pending_reports: number;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  created_at: string;
  question_count: number;
  answer_count: number;
};

export type AdminReport = {
  id: number;
  user_id: number;
  question_id: number | null;
  answer_id: number | null;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  reporter_name: string;
  reporter_email: string;
  question_title: string | null;
  answer_snippet: string | null;
};

