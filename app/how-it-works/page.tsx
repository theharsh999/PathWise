import Link from 'next/link';

const steps = [
  ['Ask a question', "Type what you're facing in your own words — no need to phrase it perfectly."],
  ['Tell us your situation', 'Add context so the guidance actually fits your circumstances.'],
  ['Explore guidance', 'Read through key points, next steps, and things worth considering.'],
  ['Take your next step', 'Move forward with a clearer view of your options.'],
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <h1 className="font-serif text-3xl mb-10 text-center">How Pathwise works</h1>
      <div className="flex flex-col gap-6">
        {steps.map(([title, desc], i) => (
          <div key={title} className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-serif bg-primary text-primary-ink">
              {i + 1}
            </div>
            <div>
              <div className="font-medium mb-1">{title}</div>
              <div className="muted text-sm">{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/ask" className="inline-block bg-primary text-primary-ink rounded-lg px-6 py-3 text-sm font-medium">
          Ask your question
        </Link>
      </div>
    </div>
  );
}
