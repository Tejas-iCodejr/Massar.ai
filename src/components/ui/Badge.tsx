import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, children, variant = 'default' }: { className?: string, children: React.ReactNode, variant?: 'default' | 'success' | 'warning' }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-[10px] border",
        {
          "bg-primary/10 text-ink border-primary/20": variant === 'default',
          "bg-tertiary/20 text-ink border-tertiary/30": variant === 'warning',
          "bg-secondary/20 text-[#ff705d] border-secondary/30": variant === 'success',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
