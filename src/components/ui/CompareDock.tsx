import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { UniversityLogo } from './UniversityLogo';
import { University } from '../../types';
import { useNavigate } from 'react-router-dom';

interface CompareDockProps {
  selectedItems: University[];
  onRemove: (id: string) => void;
  onClear: () => void;
  maxSelection?: number;
}

export function CompareDock({ selectedItems, onRemove, onClear, maxSelection = 3 }: CompareDockProps) {
  const navigate = useNavigate();

  if (selectedItems.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl select-none"
      >
        <div className="bg-ink/90 backdrop-blur-2xl text-white border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[32px] p-4 px-6 flex items-center justify-between gap-4 relative overflow-hidden">
          
          {/* Subtle green ambient accent glow */}
          <div className="absolute -top-10 -left-10 w-28 h-28 bg-[#8ed462]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Left Info & Items */}
          <div className="flex items-center gap-4 overflow-x-auto py-1 no-scrollbar">
            <div className="flex items-center gap-2 pr-2 border-r border-white/15 shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#8ed462]/20 border border-[#8ed462]/40 flex items-center justify-center">
                <Scale className="w-4 h-4 text-[#8ed462]" />
              </div>
              <div className="hidden sm:block">
                <span className="font-sans font-black text-xs uppercase tracking-wider block leading-tight">Compare Sandbox</span>
                <span className="font-mono text-[10px] text-stone-300">{selectedItems.length} of {maxSelection} Selected</span>
              </div>
            </div>

            {/* Selected Avatars / Badges */}
            <div className="flex items-center gap-2">
              {selectedItems.map((uni) => (
                <div 
                  key={uni.id} 
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-full transition-all group shrink-0"
                >
                  <UniversityLogo domain={uni.domain} name={uni.name} className="w-6 h-6 rounded-md text-[8px]" />
                  <span className="font-sans text-xs font-bold truncate max-w-[100px] sm:max-w-[120px]">{uni.name}</span>
                  <button 
                    onClick={() => onRemove(uni.id)}
                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => navigate('/compare')}
              className="bg-[#8ed462] hover:bg-[#a0e872] text-ink font-sans font-bold text-xs uppercase px-5 py-2.5 rounded-full border-0 flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <span>Launch Compare</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
