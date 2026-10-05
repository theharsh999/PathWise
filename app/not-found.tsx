import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-24 text-center">
      <div className="font-serif text-5xl mb-4" style={{ color: 'var(--primary)' }}>404</div>
      <h1 className="font-medium mb-2">Page not found</h1>
      <p className="muted text-sm mb-6">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/" className="inline-block bg-primary text-primary-ink rounded-lg px-5 py-2.5 text-sm font-medium">
        Back home
      </Link>
    </div>
  );
}
