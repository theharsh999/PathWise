import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question } from '@/lib/types';

type QuestionsState = {
  questions: Question[];
  add: (q: Question) => void;
  getById: (id: string) => Question | undefined;
  remove: (id: string) => void;
};

export const useQuestionsStore = create<QuestionsState>()(
  persist(
    (set, get) => ({
      questions: [],
      add: (q) => set((state) => ({ questions: [q, ...state.questions] })),
      getById: (id) => get().questions.find((q) => q.id === id),
      remove: (id) => set((state) => ({ questions: state.questions.filter((q) => q.id !== id) })),
    }),
    { name: 'pw_questions' },
  ),
);
