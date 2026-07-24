import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  stagger?: number;
  delay?: number;
}

export function SplitTextReveal({ children, className = '', as: Component = 'h1', stagger = 0.04, delay = 0 }: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    const text = children.trim();
    const wordsArray = text.split(/\s+/);
    
    el.innerHTML = '';
    el.setAttribute('aria-label', text);

    const wordElements: HTMLElement[] = [];

    wordsArray.forEach((wordText) => {
      const mask = document.createElement('span');
      mask.className = 'split-word-mask mr-[0.25em]';
      mask.setAttribute('aria-hidden', 'true');

      const wordSpan = document.createElement('span');
      wordSpan.className = 'split-word';
      wordSpan.textContent = wordText;

      mask.appendChild(wordSpan);
      el.appendChild(mask);
      wordElements.push(wordSpan);
    });

    const anim = gsap.fromTo(
      wordElements,
      { yPercent: 110, autoAlpha: 0, filter: 'blur(8px)' },
      {
        yPercent: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 0.95,
        ease: 'power4.out',
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );

    return () => {
      anim.kill();
    };
  }, [children, stagger, delay]);

  return <Component ref={containerRef as any} className={className}>{children}</Component>;
}
