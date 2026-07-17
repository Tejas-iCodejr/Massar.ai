import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, GraduationCap, School, BookOpen, Star, Search, Globe, User, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export function Navbar() {
  const location = useLocation();
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');

  const navLinks = [
    { name: 'Discover', path: '/', icon: Compass },
    { name: 'Universities', path: '/universities', icon: GraduationCap },
    { name: 'Compare', path: '/compare', icon: Search },
    { name: 'Schools', path: '/schools', icon: School },
    { name: 'Programs', path: '/programs', icon: BookOpen },
    { name: 'Perks', path: '/perks', icon: Star },
  ];

  return (
    <nav className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="bg-white border border-hairline-mist rounded-[50px] px-6 sm:px-8 shadow-sm flex justify-between items-center h-20">
        
        {/* Logo Brand Block - rounded square, ~40px */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center group h-full">
            <div className="w-10 h-10 bg-primary rounded-[12px] flex items-center justify-center transition-transform duration-300 group-hover:rotate-6">
              <span className="text-white font-sans font-black text-xl select-none">M</span>
            </div>
            <div className="ml-3 flex flex-col justify-center">
              <span className="font-sans font-bold text-lg tracking-tight text-ink leading-none">Massar</span>
              <span className="font-mono text-[8px] tracking-wider text-stone-gray uppercase font-bold leading-none mt-1">مسار · STUDENT PLATFORM</span>
            </div>
          </Link>
        </div>
        
        {/* Main Navigation - links at 15px Inter 500 in #2c2e2a */}
        <div className="hidden lg:flex items-center gap-1.5 h-full">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 flex items-center gap-2 font-sans font-medium text-[14px] rounded-[50px] transition-all relative group select-none",
                  isActive 
                    ? "bg-primary/20 text-ink font-semibold" 
                    : "text-ink/80 hover:text-ink hover:bg-gray-50"
                )}
              >
                <Icon className="w-3.5 h-3.5 text-ink/70" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Blocks */}
        <div className="flex items-center gap-3">
          {/* Language Selector block */}
          <button
            onClick={() => setLang(lang === 'EN' ? 'AR' : 'EN')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-hairline-mist rounded-[50px] font-mono text-[11px] font-bold bg-white text-ink hover:bg-gray-50 select-none transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-stone-gray" />
            <span>{lang}</span>
          </button>

          {/* Primary CTA Button is a white/light pill button with 50px radius */}
          <Button variant="primary" size="sm" className="hidden sm:flex border border-ink hover:bg-gray-50 font-sans font-medium px-5 py-2 text-xs">
            <User className="w-3.5 h-3.5 mr-1.5" /> Login
          </Button>
          
          {/* Menu button for small viewports - Green button fill with a dark menu icon */}
          <button className="lg:hidden w-10 h-10 rounded-full bg-primary flex items-center justify-center text-ink hover:opacity-90 transition-opacity">
            <Menu className="w-5 h-5 text-ink" />
          </button>
        </div>
        
      </div>
    </nav>
  );
}

