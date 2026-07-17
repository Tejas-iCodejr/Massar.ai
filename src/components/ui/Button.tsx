import React from 'react';
import { cn } from '../../lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'mint' | 'blue' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Button({ className, variant = 'primary', size = 'md', asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center font-sans font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-[50px] border relative select-none",
        {
          /* Primary is light/white pill button - ghost/light style, not a filled chromatic action by default */
          "bg-white text-ink border-ink hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98]": variant === 'primary',
          /* Secondary is the coral pop filled action button */
          "bg-[#ff705d] text-white border-transparent hover:bg-[#ff8676] hover:scale-[1.02] active:scale-[0.98]": variant === 'secondary',
          "bg-transparent text-ink border-ink/30 hover:bg-ink/5 hover:border-ink": variant === 'outline',
          "bg-transparent text-ink border-transparent hover:underline underline-offset-4": variant === 'ghost',
          /* Mint is fresh grass green structural/toggle fill */
          "bg-[#8ed462] text-ink border-transparent hover:bg-[#9de473] hover:scale-[1.02] active:scale-[0.98]": variant === 'mint',
          "bg-[#2ba0ff] text-white border-transparent hover:bg-[#40aeff] hover:scale-[1.02] active:scale-[0.98]": variant === 'blue',
          "bg-[#f5e211] text-ink border-transparent hover:bg-[#f6e632] hover:scale-[1.02] active:scale-[0.98]": variant === 'yellow',
          "px-4 py-1.5 text-xs": size === 'sm',
          "px-6 py-2.5 text-sm": size === 'md',
          "px-8 py-3.5 text-base": size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}

