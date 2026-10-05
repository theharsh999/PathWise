import Link from 'next/link';
import { Article } from '@/lib/types';

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="card p-5 flex flex-col gap-2 hover:shadow-sm">
      <div
        className="h-28 rounded-lg mb-1"
        style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', opacity: 0.85 }}
      />
      <span className="chip w-fit">{article.categoryName}</span>
      <div className="font-medium leading-snug">{article.title}</div>
      <p className="muted text-sm line-clamp-2">{article.excerpt}</p>
      <div className="text-xs muted pt-1">
        {article.author} · {article.date} · {article.readTime}
      </div>
    </Link>
  );
}
