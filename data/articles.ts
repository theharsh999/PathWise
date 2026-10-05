import { Article } from '@/lib/types';
import { categories } from './categories';

const names = [
  'Aarav Mehta', 'Priya Nair', 'Rohan Kapoor', 'Sara Ahmed', 'Wei Zhang',
  'Emily Carter', 'Diego Ramirez', 'Fatima Khan', 'James Wilson', 'Ananya Iyer',
];

export const articles: Article[] = categories.flatMap((cat, i) => {
  const base: Article = {
    slug: `${cat.slug}-article-1`,
    category: cat.slug,
    categoryName: cat.name,
    title: `A clearer way to think about ${cat.name.toLowerCase()}`,
    author: names[i % names.length],
    date: `Sep ${1 + i}, 2026`,
    readTime: `${5 + (i % 6)} min read`,
    excerpt: 'Most advice on this topic is either too vague or too extreme. Here\u2019s a middle path that actually holds up.',
    content: [
      'Most people overthink the first step and underthink the follow-through.',
      'Start with the smallest version of the decision you can actually test.',
      'Write down what you\u2019d need to see to change your mind \u2014 that\u2019s your real decision criteria.',
      'Revisit this in two weeks, not two days. Most clarity takes longer than it feels like it should.',
    ],
  };
  const second: Article = {
    ...base,
    slug: `${cat.slug}-article-2`,
    title: `Common mistakes people make with ${cat.name.toLowerCase()}`,
    excerpt: 'A look at the patterns that quietly derail good intentions \u2014 and how to avoid them.',
  };
  return i % 2 === 0 ? [base, second] : [base];
});

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(slug: string) {
  return articles.filter((a) => a.category === slug);
}

export function getRelatedArticles(slug: string, category: string, limit = 2) {
  return articles.filter((a) => a.category === category && a.slug !== slug).slice(0, limit);
}
