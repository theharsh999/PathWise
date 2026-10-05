import { Advice } from '@/lib/types';
import { categories } from './categories';
import { generateAdvicePoints } from './mockTemplates';

const titlesByCategory: Record<string, string[]> = {
  career: ['Should I switch careers at 30?', 'Is it worth doing a master\u2019s degree?', 'How do I know if I\u2019m in the wrong job?'],
  business: ['How do I validate a business idea with no budget?', 'Should I quit my job to go full-time on my startup?', 'How do I find my first paying customer?'],
  finance: ['How much should I actually be saving each month?', 'Should I pay off debt or invest first?', 'How do I build a budget that I\u2019ll stick to?'],
  relationships: ['How do I set boundaries without guilt?', 'How do I bring up a hard topic with my partner?', 'Is it normal to drift apart from close friends?'],
  growth: ['Why do I keep abandoning new habits?', 'How do I build confidence in social situations?', 'How do I stop procrastinating on things that matter?'],
  technology: ['Is it too late to learn to code?', 'Which skills are actually worth learning right now?', 'How do I choose between two tech career tracks?'],
  college: ['How do I pick a major I won\u2019t regret?', 'Should I take a gap year?', 'How do I balance academics and a social life?'],
  jobs: ['How do I answer "why should we hire you"?', 'How do I negotiate a job offer?', 'How do I explain a gap in my resume?'],
  lifestyle: ['How do I build a morning routine that sticks?', 'How do I say no without feeling guilty?', 'How do I simplify a life that feels too busy?'],
  study: ['How do I stop cramming the night before?', 'How do I stay focused while studying at home?', 'How do I retain what I read long-term?'],
  productivity: ['Why do I feel busy but never get anything done?', 'How do I stop multitasking so much?', 'How do I plan a week that actually holds up?'],
  entrepreneurship: ['How do I know if my idea is worth pursuing?', 'How do I find a co-founder I can trust?', 'When should I raise money vs bootstrap?'],
};

function buildAdvice(): Advice[] {
  const items: Advice[] = [];
  let counter = 0;
  for (const cat of categories) {
    const titles = titlesByCategory[cat.slug] ?? [];
    titles.forEach((title, i) => {
      items.push({
        id: `adv-${counter}`,
        category: cat.slug,
        categoryName: cat.name,
        title,
        description: `A practical, level-headed look at ${title.toLowerCase().replace('?', '')}.`,
        readTime: `${4 + (counter % 5)} min read`,
        helpfulPct: 60 + ((counter * 7) % 35),
        keyPoints: generateAdvicePoints(cat.slug),
      });
      counter++;
    });
  }
  return items;
}

export const adviceItems: Advice[] = buildAdvice();

export function getAdviceById(id: string) {
  return adviceItems.find((a) => a.id === id);
}

export function getAdviceByCategory(slug: string) {
  return adviceItems.filter((a) => a.category === slug);
}

export function getRelatedAdvice(id: string, category: string, limit = 3) {
  return adviceItems.filter((a) => a.category === category && a.id !== id).slice(0, limit);
}
