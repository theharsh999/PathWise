import { articles, getArticleBySlug, getArticlesByCategory, getRelatedArticles } from '@/data/articles';
import { Article } from '@/lib/types';
import { delay } from '@/lib/utils';

export async function fetchArticles(): Promise<Article[]> {
  return delay(articles, 300);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | undefined> {
  return delay(getArticleBySlug(slug), 300);
}

export async function fetchArticlesByCategory(slug: string): Promise<Article[]> {
  return delay(getArticlesByCategory(slug), 250);
}

export async function fetchRelatedArticles(slug: string, category: string): Promise<Article[]> {
  return delay(getRelatedArticles(slug, category), 200);
}

export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.toLowerCase();
  return delay(articles.filter((a) => a.title.toLowerCase().includes(q)), 250);
}
