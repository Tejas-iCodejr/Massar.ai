import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      onComplete();
      setLoaded(true);
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        setLoaded(true);
        onComplete();
      },
    });

    tl.fromTo('[data-preloader-bar]', 
      { scaleX: 0, transformOrigin: 'left' }, 
      { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }
    )
    .to('[data-preloader-text]', { opacity: 0, y: -10, duration: 0.4 }, '-=0.2')
    .to('[data-preloader]', {
      yPercent: -100,
      duration: 0.85,
      ease: 'power4.inOut',
    });
  }, [onComplete]);

  if (loaded) return null;

  return (
    <div 
      data-preloader 
      className="fixed inset-0 bg-[#1c1e1a] z-50 flex flex-col items-center justify-center p-6 text-white select-none"
    >
      <div className="flex flex-col items-center gap-4 max-w-xs w-full text-center" data-preloader-text>
        <div className="w-12 h-12 bg-[#8ed462] rounded-2xl flex items-center justify-center text-[#2c2e2a] font-sans font-black text-2xl shadow-lg">
          M
        </div>
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#8ed462]">
          Massar.ai • Education Index
        </span>
      </div>

      <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mt-8">
        <div data-preloader-bar className="w-full h-full bg-gradient-to-r from-[#ff705d] via-[#2ba0ff] to-[#8ed462] rounded-full" />
      </div>
    </div>
  );
}
