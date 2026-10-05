import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2">
          <div className="font-serif text-lg font-semibold mb-2">Pathwise</div>
          <p className="muted max-w-xs">Thoughtful guidance for the decisions that are hard to think through alone.</p>
        </div>
        <div>
          <div className="font-medium mb-2">Explore</div>
          <div className="flex flex-col gap-1.5 muted">
            <Link href="/categories">Categories</Link>
            <Link href="/experts">Experts</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
        <div>
          <div className="font-medium mb-2">Company</div>
          <div className="flex flex-col gap-1.5 muted">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 py-5 border-t border-border text-xs muted flex flex-wrap justify-between gap-2">
        <span>© 2026 Pathwise. Guidance only — not a substitute for professional advice.</span>
        <span className="flex gap-4">
          <Link href="/faq">Privacy</Link>
          <Link href="/faq">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
