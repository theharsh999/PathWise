import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategory } from '@/data/categories';
import { getAdviceByCategory } from '@/data/advice';
import { getExpertsByCategory } from '@/data/experts';
import { getArticlesByCategory } from '@/data/articles';
import { AdviceCard } from '@/components/advice/AdviceCard';
import { ExpertCard } from '@/components/experts/ExpertCard';
import { ArticleCard } from '@/components/blog/ArticleCard';

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const items = getAdviceByCategory(category.slug);
  const expertsList = getExpertsByCategory(category.slug);
  const articlesList = getArticlesByCategory(category.slug);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <Link href="/categories" className="text-sm muted hover:text-ink">← Categories</Link>
      <div className="flex items-center gap-3 mt-3 mb-2">
        <span className="text-3xl">{category.icon}</span>
        <h1 className="font-serif text-3xl">{category.name}</h1>
      </div>
      <p className="muted mb-8 max-w-xl">{category.description}</p>

      <h2 className="font-medium mb-4">Featured advice</h2>
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {items.length ? items.slice(0, 6).map((a) => <AdviceCard key={a.id} advice={a} />) : <p className="muted text-sm">No advice yet in this category.</p>}
      </div>

      <h2 className="font-medium mb-4">Experts in {category.name}</h2>
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {expertsList.length ? expertsList.map((e) => <ExpertCard key={e.id} expert={e} />) : <p className="muted text-sm">No experts listed yet.</p>}
      </div>

      <h2 className="font-medium mb-4">Related articles</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {articlesList.length ? articlesList.map((a) => <ArticleCard key={a.slug} article={a} />) : <p className="muted text-sm">No articles yet.</p>}
      </div>
    </div>
  );
}
