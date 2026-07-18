import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Sparkles, Compass, GraduationCap, MapPin, Target, BookOpen, Route } from 'lucide-react';

/**
 * Interactive Compass Doodle
 * Needle is a beautiful static compass design. No rotation on mouse hover.
 */
export function InteractiveCompass() {
  return (
    <div
      className="relative w-44 h-44 bg-white border border-hairline-mist rounded-full flex items-center justify-center shadow-sm select-none overflow-hidden"
      id="compass-doodle-container"
    >
      {/* Background dashed radar grid */}
      <div className="absolute inset-2 border border-dashed border-[#e0dbce] rounded-full" />
      <div className="absolute inset-8 border border-dotted border-[#e0dbce]/60 rounded-full" />
      
      {/* Static needle */}
      <div 
        className="w-full h-full absolute flex items-center justify-center pointer-events-none"
        style={{ transform: 'rotate(45deg)' }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="drop-shadow-sm">
          {/* Compass Rose center */}
          <circle cx="50" cy="50" r="4" fill="#2c2e2a" />
          
          {/* North Needle (Red Coral) */}
          <path d="M50 50 L46 50 L50 15 Z" fill="#ff705d" stroke="#2c2e2a" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M50 50 L54 50 L50 15 Z" fill="#ff8c7d" stroke="#2c2e2a" strokeWidth="1.5" strokeLinejoin="round" />
          
          {/* South Needle (Fresh Grass) */}
          <path d="M50 50 L46 50 L50 85 Z" fill="#8ed462" stroke="#2c2e2a" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M50 50 L54 50 L50 85 Z" fill="#aee689" stroke="#2c2e2a" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Static Cardinal directions */}
      <span className="absolute top-3 font-sans font-black text-[9px] uppercase tracking-widest text-[#2c2e2a]/60">N</span>
      <span className="absolute bottom-3 font-sans font-black text-[9px] uppercase tracking-widest text-[#2c2e2a]/60">S</span>
      <span className="absolute right-3 font-sans font-black text-[9px] uppercase tracking-widest text-[#2c2e2a]/60">E</span>
      <span className="absolute left-3 font-sans font-black text-[9px] uppercase tracking-widest text-[#2c2e2a]/60">W</span>

      {/* Central Indicator badge */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-[#2ba0ff] text-white px-2.5 py-0.5 rounded-full font-mono text-[8px] font-bold uppercase tracking-wider shadow-sm border border-white">
          Explore
        </div>
      </div>

      {/* Static spot decoration */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#f5e211] border border-[#2c2e2a]/20" />
    </div>
  );
}

/**
 * Interactive Path Milestone Connector Doodle
 * Shows three developmental academic stages statically without any path drawing
 * or bouncy flying animations. Users can still click nodes to toggle state.
 */
export function MilestoneConnector() {
  const [activeMilestone, setActiveMilestone] = useState<number>(1);

  const milestones = [
    {
      id: 1,
      title: 'Foundations',
      desc: 'K-12 schools, inspections & curriculums.',
      color: '#ff705d',
      bgLight: 'bg-[#ff705d]/10',
      borderCol: 'border-[#ff705d]/30',
      icon: BookOpen,
      pos: { x: '10%', y: '55%' },
    },
    {
      id: 2,
      title: 'Preparation',
      desc: 'Hackathons, target scores & research prep.',
      color: '#2ba0ff',
      bgLight: 'bg-[#2ba0ff]/10',
      borderCol: 'border-[#2ba0ff]/30',
      icon: Route,
      pos: { x: '50%', y: '25%' },
    },
    {
      id: 3,
      title: 'Accreditation',
      desc: 'Accredited university branch selection.',
      color: '#8ed462',
      bgLight: 'bg-[#8ed462]/10',
      borderCol: 'border-[#8ed462]/30',
      icon: GraduationCap,
      pos: { x: '90%', y: '65%' },
    },
  ];

  return (
    <div className="relative w-full h-52 bg-white border border-hairline-mist rounded-[40px] p-6 overflow-hidden flex flex-col justify-between shadow-sm select-none">
      
      {/* Background Storybook Graph Helper Grid */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* SVG Connecting Pathway */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 200" preserveAspectRatio="none">
        {/* Simple static connecting path */}
        <path
          d="M 50 110 Q 250 10 450 130"
          fill="none"
          stroke="#d5d5d4"
          strokeWidth="3"
          strokeDasharray="8 6"
        />
        <path
          d="M 50 110 Q 250 10 450 130"
          fill="none"
          stroke={milestones[activeMilestone - 1]?.color || '#ff705d'}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Nodes / Milestones absolute buttons */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {milestones.map((ms) => {
          const Icon = ms.icon;
          const isActive = activeMilestone === ms.id;
          
          return (
            <div
              key={ms.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
              style={{ left: ms.pos.x, top: ms.pos.y }}
              onClick={() => setActiveMilestone(ms.id)}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 bg-white ${
                  isActive ? 'border-ink shadow-md scale-110' : 'border-[#d5d5d4] hover:border-ink shadow-sm'
                } relative z-20 transition-all`}
              >
                {/* Node icon with custom brand bg */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive ? ms.bgLight : 'bg-transparent'
                  }`}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: isActive ? ms.color : '#80827f' }} 
                  />
                </div>

                {/* Micro step bubble */}
                <div 
                  className="absolute -top-3 -right-2 px-1.5 py-0.5 rounded-full text-[7px] font-bold border text-white font-mono"
                  style={{ 
                    backgroundColor: ms.color,
                    borderColor: '#2c2e2a'
                  }}
                >
                  0{ms.id}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom info-card detail area with simple static layout */}
      <div className="z-10 bg-[#f5f1e4]/70 border border-hairline-mist rounded-[24px] p-3 backdrop-blur-sm mt-auto">
        <div className="flex items-start gap-3">
          <div 
            className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" 
            style={{ backgroundColor: milestones[activeMilestone - 1].color }}
          />
          <div>
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-1.5">
              {milestones[activeMilestone - 1].title}
              <span className="font-mono text-[9px] text-[#80827f] font-normal">Step {activeMilestone} of 3</span>
            </h4>
            <p className="font-sans text-[10px] text-stone-gray leading-relaxed mt-0.5">
              {milestones[activeMilestone - 1].desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Handdrawn Decorative Star / Sparkle Doodle
 * A beautiful hand-drawn stylized vector doodle that spins, bounces and emits tiny stars when hovered.
 */
interface DecorativeDoodleProps {
  className?: string;
  type?: 'sparkle' | 'loop' | 'target' | 'star';
  color?: string;
}

export function DecorativeDoodle({ className = '', type = 'sparkle', color = '#ff705d' }: DecorativeDoodleProps) {
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; scale: number }[]>([]);

  const handleMouseEnter = () => {
    setHovered(true);
    
    // Spawn tiny decorative star particles
    const newParticles = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
      scale: Math.random() * 0.6 + 0.4,
    }));
    setParticles(newParticles);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    // clean up particles after animation completes
    setTimeout(() => {
      setParticles([]);
    }, 1000);
  };

  const getDoodleSvg = () => {
    switch (type) {
      case 'loop':
        return (
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M20,80 Q50,10 50,50 T80,20"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <motion.path
              d="M30,50 C40,40 60,40 70,50"
              stroke="#2ba0ff"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </svg>
        );

      case 'target':
        return (
          <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="#2c2e2a" strokeWidth="3" strokeDasharray="6 4" fill="none" />
            <motion.circle 
              cx="50" 
              cy="50" 
              r="25" 
              stroke={color} 
              strokeWidth="4" 
              fill="none"
              animate={{ scale: hovered ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <circle cx="50" cy="50" r="8" fill="#8ed462" stroke="#2c2e2a" strokeWidth="2" />
          </svg>
        );

      case 'star':
        return (
          <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M50 10 L62 38 L92 38 L68 56 L77 86 L50 68 L23 86 L32 56 L8 38 L38 38 Z"
              fill={hovered ? color : 'transparent'}
              stroke={hovered ? '#2c2e2a' : color}
              strokeWidth="4"
              strokeLinejoin="round"
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            />
          </svg>
        );

      case 'sparkle':
      default:
        return (
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Elegant 4-point sparkle */}
            <motion.path
              d="M50 10 C50 35 35 50 10 50 C35 50 50 65 50 90 C50 65 65 50 90 50 C65 50 50 35 50 10 Z"
              fill={color}
              stroke="#2c2e2a"
              strokeWidth="4"
              strokeLinejoin="round"
              animate={{ 
                scale: hovered ? [1, 1.15, 0.95, 1.1, 1] : 1,
                rotate: hovered ? 90 : 0
              }}
              transition={{ 
                duration: 0.6,
                scale: { type: 'keyframes', ease: 'easeInOut' },
                rotate: { type: 'spring', stiffness: 180 }
              }}
            />
          </svg>
        );
    }
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ 
          y: hovered ? -6 : 0,
          rotate: hovered && type !== 'sparkle' ? 12 : 0,
          scale: hovered ? 1.15 : 1
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 12 }}
        className="relative z-10 filter drop-shadow-[0_2px_4px_rgba(44,46,42,0.06)]"
      >
        {getDoodleSvg()}
      </motion.div>

      {/* Floating particles spawned on hover */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: p.scale }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute pointer-events-none z-0"
        >
          <Sparkles className="w-4.5 h-4.5 text-[#f5e211]" fill="#f5e211" stroke="#2c2e2a" strokeWidth="1" />
        </motion.div>
      ))}
    </div>
  );
}
