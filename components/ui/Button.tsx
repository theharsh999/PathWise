'use client';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const base = 'rounded-lg text-sm font-medium px-4 py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed';
    const styles: Record<Variant, string> = {
      primary: 'bg-primary text-primary-ink hover:brightness-105',
      ghost: 'border border-border text-ink hover:bg-bg',
      danger: 'border border-danger text-danger hover:bg-bg',
    };
    return <button ref={ref} className={cn(base, styles[variant], className)} {...props} />;
  },
);
Button.displayName = 'Button';
