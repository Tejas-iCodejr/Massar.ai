import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  domain: string;
  name: string;
  className?: string;
}

export function UniversityLogo({ domain, name, className }: LogoProps) {
  const [error, setError] = useState(false);
  const size = 128;
  const url = `https://logo.clearbit.com/${domain}?size=${size}`;

  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div className={cn("w-16 h-16 flex-shrink-0 border border-hairline-mist bg-white overflow-hidden flex items-center justify-center font-bold text-2xl rounded-[20px] shadow-sm", className)}>
      {!error ? (
        <img
          src={url}
          alt={`${name} logo`}
          className="w-full h-full object-contain p-1"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-ink">{initials}</span>
      )}
    </div>
  );
}
