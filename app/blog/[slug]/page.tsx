'use client';
import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import { getArticleBySlug, getRelatedArticles } from '@/data/articles';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useSavedStore } from '@/store/useSavedStore';
import { useToast } from '@/components/ui/Toast';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { Button } from '@/components/ui/Button';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  const { push } = useHistoryStore();
  const { isSaved, toggle } = useSavedStore();
  const { show } = useToast();

  useEffect(() => {
    if (article) push({ type: 'article', id: article.slug, label: article.title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.slug]);

  if (!article) notFound();

  const saved = isSaved('article', article.slug);
  const related = getRelatedArticles(article.slug, article.category, 2);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      show('Link copied');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="text-xs muted mb-3">
        <Link href="/blog" className="hover:underline">Blog</Link> / {article.categoryName}
      </div>
      <span className="chip">{article.categoryName}</span>
      <h1 className="font-serif text-3xl mt-3 mb-3 leading-tight">{article.title}</h1>
      <div className="text-sm muted mb-6">
        {article.author} · {article.date} · {article.readTime}
      </div>
      <div className="h-48 rounded-xl mb-8" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', opacity: 0.85 }} />
      <div className="flex flex-col gap-4 text-[15px] leading-relaxed">
        {article.content.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="flex gap-2 mt-8">
        <Button variant="ghost" onClick={share} className="flex items-center gap-2">
          <Share2 className="w-4 h-4" /> Share
        </Button>
        <Button
          variant="ghost"
          onClick={() => toggle({ type: 'article', id: article.slug, label: article.title, category: article.category })}
          className="flex items-center gap-2"
        >
          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          {saved ? 'Saved' : 'Save'}
        </Button>
      </div>
      {related.length > 0 && (
        <>
          <h2 className="font-medium mt-10 mb-3">Related articles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
