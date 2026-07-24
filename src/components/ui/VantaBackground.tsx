import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';

interface VantaBackgroundProps {
  className?: string;
  color?: number;
  shininess?: number;
  waveHeight?: number;
  waveSpeed?: number;
  zoom?: number;
}

export function VantaBackground({
  className = "absolute inset-0 -z-10 pointer-events-none overflow-hidden",
  color = 0x8ed462,
  shininess = 35.00,
  waveHeight = 15.00,
  waveSpeed = 0.65,
  zoom = 0.85
}: VantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    // Only initialize on screens >= 768px to preserve battery and GPU on small mobile devices
    const isDesktop = window.innerWidth >= 768;

    if (!vantaEffect.current && vantaRef.current && isDesktop) {
      try {
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
          color: color,
          shininess: shininess,
          waveHeight: waveHeight,
          waveSpeed: waveSpeed,
          zoom: zoom
        });
      } catch (err) {
        console.warn("Vanta.js WebGL initialization skipped:", err);
      }
    }

    return () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (e) {
          // Ignore destruction error on unmount
        }
        vantaEffect.current = null;
      }
    };
  }, [color, shininess, waveHeight, waveSpeed, zoom]);

  return (
    <div className={className}>
      <div ref={vantaRef} className="w-full h-full opacity-40 transition-opacity duration-700" />
    </div>
  );
}
