import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function StickyCardStack({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const cards = gsap.utils.toArray<HTMLElement>(stack.querySelectorAll('[data-stack-card]'));

    cards.forEach((card, index) => {
      const nextCard = cards[index + 1];
      if (!nextCard) return;

      gsap.to(card, {
        scale: 0.92 + index * 0.015,
        autoAlpha: 0.75,
        filter: 'blur(3px)',
        y: -24,
        ease: 'none',
        scrollTrigger: {
          trigger: nextCard,
          start: 'top 75%',
          end: 'top 20%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={stackRef} data-sticky-stack className={className}>
      {children}
    </div>
  );
}
