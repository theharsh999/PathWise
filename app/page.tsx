import Link from 'next/link';
import { categories } from '@/data/categories';
import { adviceItems } from '@/data/advice';
import { experts } from '@/data/experts';
import { articles } from '@/data/articles';
import { AdviceCard } from '@/components/advice/AdviceCard';
import { ExpertCard } from '@/components/experts/ExpertCard';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { CategoryCard } from '@/components/common/CategoryCard';
import { SearchBar } from '@/components/common/SearchBar';

export default function HomePage() {
  const featuredAdvice = adviceItems.slice(0, 3);
  const featuredExperts = experts.slice(0, 3);
  const trending = adviceItems.slice(4, 8);
  const latestArticles = articles.slice(0, 3);

  return (
    <>
      <section className="max-w-6xl mx-auto px-5 pt-14 pb-16 grid md:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.1] font-medium mb-5">
            Not sure what
            <br />
            to do next?
          </h1>
          <p className="muted text-lg mb-7 max-w-md">
            Get thoughtful guidance for life's important decisions — career, money, relationships, and everything in between.
          </p>
          <div className="mb-6 max-w-md">
            <SearchBar placeholder="What do you need advice about?" />
          </div>
          <div className="flex gap-3">
            <Link href="/ask" className="bg-primary text-primary-ink rounded-lg px-5 py-2.5 text-sm font-medium">
              Ask for Advice
            </Link>
            <Link href="/categories" className="border border-border rounded-lg px-5 py-2.5 text-sm">
              Explore Topics
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <svg viewBox="0 0 320 260" className="w-full">
            <path d="M20 220 C 90 220, 90 140, 160 140 S 230 60, 300 60" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="20" cy="220" r="7" fill="var(--ink-soft)" />
            <circle cx="160" cy="140" r="7" fill="var(--accent)" />
            <circle cx="300" cy="60" r="9" fill="var(--primary)" />
            <text x="30" y="242" fontSize="11" fill="var(--ink-soft)">the question</text>
            <text x="120" y="128" fontSize="11" fill="var(--ink-soft)">the crossroads</text>
            <text x="240" y="48" fontSize="11" fill="var(--ink-soft)">your next step</text>
          </svg>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <h2 className="font-serif text-2xl mb-5">Popular categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-4 gap-6">
        {[
          ['Ask your question', "Tell us what you're working through, in your own words."],
          ['Explore relevant guidance', 'See advice and articles matched to your situation.'],
          ['Understand your options', 'Weigh practical next steps and things to consider.'],
          ['Decide your next step', 'Move forward with a clearer, calmer head.'],
        ].map(([title, desc], i) => (
          <div key={title}>
            <div className="font-serif text-3xl mb-2" style={{ color: 'var(--primary)' }}>{i + 1}</div>
            <div className="font-medium mb-1">{title}</div>
            <div className="muted text-sm">{desc}</div>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl">Featured advice</h2>
          <Link href="/categories" className="text-sm muted hover:text-ink">See all</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {featuredAdvice.map((a) => (
            <AdviceCard key={a.id} advice={a} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl">Featured experts</h2>
          <Link href="/experts" className="text-sm muted hover:text-ink">See all</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {featuredExperts.map((e) => (
            <ExpertCard key={e.id} expert={e} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <h2 className="font-serif text-2xl mb-5">Trending questions</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {trending.map((a) => (
            <Link key={a.id} href={`/advice/${a.id}`} className="card p-4 flex items-center justify-between hover:shadow-sm">
              <span className="text-sm">{a.title}</span>
              <span className="muted">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl">Latest articles</h2>
          <Link href="/blog" className="text-sm muted hover:text-ink">See all</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {latestArticles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="card p-10 text-center" style={{ background: 'var(--primary)', borderColor: 'var(--primary)' }}>
          <h2 className="font-serif text-2xl sm:text-3xl mb-4" style={{ color: 'var(--primary-ink)' }}>
            Have a question? Let's figure it out.
          </h2>
          <Link
            href="/ask"
            className="inline-block px-6 py-3 rounded-lg font-semibold text-sm"
            style={{ background: 'var(--primary-ink)', color: 'var(--primary)' }}
          >
            Get Advice
          </Link>
        </div>
      </section>
    </>
  );
}
