import React from 'react';
import { cn } from '../../lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'motion/react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'mint' | 'blue' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Button({ className, variant = 'primary', size = 'md', asChild = false, ...props }: ButtonProps) {
  if (asChild) {
    return (
      <Slot
        className={cn(
          "inline-flex items-center justify-center font-sans font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-[50px] border relative select-none active:scale-[0.97]",
          {
            "bg-white text-ink border-ink hover:bg-gray-50 hover:scale-[1.02]": variant === 'primary',
            "bg-[#ff705d] text-white border-transparent hover:bg-[#ff8676] hover:scale-[1.02]": variant === 'secondary',
            "bg-transparent text-ink border-ink/30 hover:bg-ink/5 hover:border-ink": variant === 'outline',
            "bg-transparent text-ink border-transparent hover:underline underline-offset-4": variant === 'ghost',
            "bg-[#8ed462] text-ink border-transparent hover:bg-[#9de473] hover:scale-[1.02]": variant === 'mint',
            "bg-[#2ba0ff] text-white border-transparent hover:bg-[#40aeff] hover:scale-[1.02]": variant === 'blue',
            "bg-[#f5e211] text-ink border-transparent hover:bg-[#f6e632] hover:scale-[1.02]": variant === 'yellow',
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

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "inline-flex items-center justify-center font-sans font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer rounded-[50px] border relative select-none",
        {
          "bg-white text-ink border-ink hover:bg-gray-50": variant === 'primary',
          "bg-[#ff705d] text-white border-transparent hover:bg-[#ff8676]": variant === 'secondary',
          "bg-transparent text-ink border-ink/30 hover:bg-ink/5 hover:border-ink": variant === 'outline',
          "bg-transparent text-ink border-transparent hover:underline underline-offset-4": variant === 'ghost',
          "bg-[#8ed462] text-ink border-transparent hover:bg-[#9de473]": variant === 'mint',
          "bg-[#2ba0ff] text-white border-transparent hover:bg-[#40aeff]": variant === 'blue',
          "bg-[#f5e211] text-ink border-transparent hover:bg-[#f6e632]": variant === 'yellow',
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

