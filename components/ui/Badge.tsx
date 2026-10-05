import { cn } from '@/lib/utils';

export function Badge({ children, active, className }: { children: React.ReactNode; active?: boolean; className?: string }) {
  return <span className={cn('chip', active && 'active', className)}>{children}</span>;
}
