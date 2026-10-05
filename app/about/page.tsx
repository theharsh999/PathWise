import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <h1 className="font-serif text-3xl mb-6">About Pathwise</h1>
      <p className="muted mb-4 leading-relaxed">
        We started Pathwise because most advice online is either too generic to be useful or too extreme to trust. We
        wanted something in between: grounded, specific, and honest about what it can and can't tell you.
      </p>
      <p className="muted mb-4 leading-relaxed">
        Our mission is to help people think more clearly about the decisions they're facing — not to make the decision
        for them. We pair structured guidance with real experts who've been through similar situations.
      </p>
      <h2 className="font-medium mt-8 mb-2">What we value</h2>
      <ul className="muted list-disc list-inside flex flex-col gap-1 mb-8">
        <li>Clarity over cleverness</li>
        <li>Honesty about uncertainty</li>
        <li>Respect for your own judgment</li>
      </ul>
      <div className="card p-6 text-center">
        <p className="mb-3">Have something on your mind?</p>
        <Link href="/ask" className="inline-block bg-primary text-primary-ink rounded-lg px-5 py-2.5 text-sm font-medium">
          Get Advice
        </Link>
      </div>
    </div>
  );
}
