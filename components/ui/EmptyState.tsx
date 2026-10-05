import Link from 'next/link';

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="card p-10 text-center">
      <p className="muted mb-1">{title}</p>
      {description && <p className="muted text-sm mb-4">{description}</p>}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="inline-block bg-primary text-primary-ink rounded-lg px-5 py-2.5 text-sm font-medium mt-2">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
