/**
 * Advice service — currently backed by mock data + generated content.
 * Swap the bodies of these functions for real `fetch("/api/...")` calls
 * later; nothing in the UI layer needs to change because it only ever
 * talks to this module.
 */
import { adviceItems, getAdviceById, getAdviceByCategory, getRelatedAdvice } from '@/data/advice';
import { generateAdvicePoints } from '@/data/mockTemplates';
import { getCategory } from '@/data/categories';
import { Advice, Question } from '@/lib/types';
import { delay } from '@/lib/utils';

export async function fetchFeaturedAdvice(limit = 3): Promise<Advice[]> {
  return delay(adviceItems.slice(0, limit), 300);
}

export async function fetchAdviceById(id: string): Promise<Advice | undefined> {
  return delay(getAdviceById(id), 300);
}

export async function fetchAdviceByCategory(slug: string): Promise<Advice[]> {
  return delay(getAdviceByCategory(slug), 300);
}

export async function fetchRelatedAdvice(id: string, category: string): Promise<Advice[]> {
  return delay(getRelatedAdvice(id, category), 200);
}

export async function searchAdvice(query: string): Promise<Advice[]> {
  const q = query.toLowerCase();
  return delay(
    adviceItems.filter((a) => a.title.toLowerCase().includes(q) || a.categoryName.toLowerCase().includes(q)),
    250,
  );
}

/**
 * Simulates generating a personalized advice response for a submitted
 * question. A real backend would replace this with an LLM or expert-routed
 * API call; the shape of the returned Question is what the UI depends on.
 */
export async function submitQuestion(input: {
  category: string;
  question: string;
  context?: string;
  outcome?: string;
  urgency: Question['urgency'];
}): Promise<Question> {
  const cat = getCategory(input.category);
  const question: Question = {
    id: `q-${Date.now()}`,
    category: input.category,
    categoryName: cat?.name ?? input.category,
    question: input.question,
    context: input.context,
    outcome: input.outcome,
    urgency: input.urgency,
    status: 'Answered',
    date: new Date().toISOString(),
    keyPoints: generateAdvicePoints(input.category),
  };
  return delay(question, 900);
}
