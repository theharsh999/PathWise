export function LoadingSkeleton({ rows = 3, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 rounded-xl card animate-pulse" style={{ background: 'var(--border)' }} />
      ))}
    </div>
  );
}
