---
name: vantajs
description: "Use when adding animated WebGL background effects with Vanta.js (setup, parameters, resizing, performance, integration in React/Next.js)."
---

# Vanta.js — Animated WebGL Backgrounds Skill

When to use:
- Decorative animated backgrounds behind hero sections
- Creating quick, immersive WebGL visual effects without manually coding custom Three.js shaders
- Lightweight integration into React / Single Page Applications

## Key APIs & Lifecycle Patterns

### React Integration Pattern:
```tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// Import specific Vanta effect
import WAVES from 'vanta/dist/vanta.waves.min';

export function VantaHeroBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      vantaEffect.current = WAVES({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x8ed462,
        shininess: 35.00,
        waveHeight: 15.00,
        waveSpeed: 0.75,
        zoom: 0.85
      });
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return <div ref={vantaRef} className="absolute inset-0 -z-10 pointer-events-none" />;
}
```

## Performance & UX Guidelines
1. **Container Dimensions**: Target element must have explicit size (`min-h-screen`, `h-full`, etc.).
2. **GPU Load**: Keep to **max 1 Vanta canvas per page**.
3. **Contrast & Readability**: Always place a semi-transparent backdrop scrim (`bg-[#f5f1e4]/70 backdrop-blur-xs`) or high-contrast typography over the canvas.
4. **Cleanup**: Always destroy effect instance on unmount to prevent WebGL context loss errors.
