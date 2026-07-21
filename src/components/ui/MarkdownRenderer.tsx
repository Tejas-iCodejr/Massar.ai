import React from 'react';
import { ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-4 font-sans text-[#2c2e2a]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Headers
        if (trimmed.startsWith('###')) {
          return (
            <h3 key={idx} className="font-sans font-black text-lg sm:text-xl uppercase tracking-tight text-ink mt-8 mb-4 pb-2 border-b border-hairline-mist">
              {trimmed.replace(/^###\s*/, '')}
            </h3>
          );
        }
        if (trimmed.startsWith('##')) {
          return (
            <h2 key={idx} className="font-sans font-black text-xl sm:text-2xl uppercase tracking-tight text-ink mt-8 mb-4 pb-2 border-b border-hairline-mist">
              {trimmed.replace(/^##\s*/, '')}
            </h2>
          );
        }
        if (trimmed.startsWith('#')) {
          return (
            <h1 key={idx} className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink mt-8 mb-4 pb-2 border-b border-hairline-mist">
              {trimmed.replace(/^#\s*/, '')}
            </h1>
          );
        }
        
        // Bullet Points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const rawText = trimmed.replace(/^[-*]\s*/, '');
          return (
            <div key={idx} className="flex gap-2.5 items-start pl-1 my-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff705d] mt-2 flex-shrink-0" />
              <div className="text-sm font-medium leading-relaxed text-ink/95">
                {parseBoldAndLinks(rawText)}
              </div>
            </div>
          );
        }

        // Paragraphs or empty lines
        if (trimmed === '') {
          return <div key={idx} className="h-1" />;
        }

        return (
          <p key={idx} className="text-sm font-medium leading-relaxed text-ink/90">
            {parseBoldAndLinks(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Helper to parse bold (**text**) and markdown links ([text](url))
function parseBoldAndLinks(text: string) {
  const boldParts = text.split(/\*\*([^*]+)\*\*/g);
  
  return boldParts.map((part, pIdx) => {
    const isBold = pIdx % 2 === 1;
    const parsedText = parseLinks(part);
    
    if (isBold) {
      return (
        <strong key={pIdx} className="font-extrabold text-ink">
          {parsedText}
        </strong>
      );
    }
    return <span key={pIdx}>{parsedText}</span>;
  });
}

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true;
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:');
}

function parseLinks(text: string) {
  const parts: React.ReactNode[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    const [_, linkText, linkUrl] = match;
    const matchIndex = match.index;
    
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }
    
    const safeHref = isSafeUrl(linkUrl) ? linkUrl : '#';

    parts.push(
      <a 
        key={matchIndex}
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="no-referrer"
        className="inline-flex items-center gap-0.5 font-bold text-[#2ba0ff] hover:underline"
      >
        {linkText}
        <ExternalLink className="w-3 h-3 inline-block" />
      </a>
    );
    
    lastIndex = linkRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}
