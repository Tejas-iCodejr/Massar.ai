import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  key?: any;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  variant?: 'default' | 'mint' | 'yellow' | 'orange' | 'blue' | 'dark' | 'glass';
  interactive?: boolean;
}

export function Card({ className, children, variant = 'default', interactive = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "p-7 flex flex-col relative rounded-[40px] md:rounded-[50px] transition-all duration-300",
        {
          "bg-white text-ink border border-hairline-mist": variant === 'default',
          "bg-primary/10 text-ink border border-primary/20": variant === 'mint',
          "bg-tertiary/20 text-ink border border-tertiary/25": variant === 'yellow',
          "bg-primary text-ink border border-primary": variant === 'orange',
          "bg-accent/10 text-ink border border-accent/20": variant === 'blue',
          "bg-ink text-white border border-transparent": variant === 'dark',
          "bg-white/80 backdrop-blur-md border border-white/40": variant === 'glass',
          
          /* Smooth interactive states */
          "hover:-translate-y-1 hover:border-primary/60 hover:shadow-sm": interactive,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

