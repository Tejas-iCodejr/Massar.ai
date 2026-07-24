import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, GraduationCap, School, BookOpen, Star, Search, Globe, User, Menu, Calendar, X, Bookmark, Scale, ChevronRight, ChevronLeft, ShieldCheck, FileText, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';

// Mock searchable directory data
const SEARCH_DATABASE = [
  { id: 'khalifa', name: 'Khalifa University', type: 'university', category: 'Universities', desc: 'Abu Dhabi, UAE • Top-ranked Research Institution' },
  { id: 'aus', name: 'American University of Sharjah', type: 'university', category: 'Universities', desc: 'Sharjah, UAE • Acclaimed Business & Engineering' },
  { id: 'nyuad', name: 'New York University Abu Dhabi', type: 'university', category: 'Universities', desc: 'Abu Dhabi, UAE • Global Liberal Arts Campus' },
  { id: 'gems-world', name: 'GEMS World Academy', type: 'school', category: 'Schools', desc: 'Dubai, UAE • IB World School with premium facilities' },
  { id: 'dubai-college', name: 'Dubai College', type: 'school', category: 'Schools', desc: 'Dubai, UAE • Leading British Curriculum School' },
  { id: 'hackathon', name: 'AI Hackathon Dubai', type: 'program', category: 'Opportunities', desc: 'Dubai, UAE • National Tech Competition for Students' },
  { id: 'fellowship', name: 'Massar Youth Fellowship', type: 'program', category: 'Opportunities', desc: 'Dubai, UAE • Educational Leadership Development' },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submenu, setSubmenu] = useState<'main' | 'directory' | 'workspace'>('main');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(SEARCH_DATABASE);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when search overlay opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      setSearchQuery('');
      setSearchResults(SEARCH_DATABASE);
    }
  }, [searchOpen]);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter search results
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults(SEARCH_DATABASE);
    } else {
      const filtered = SEARCH_DATABASE.filter(item => 
        item.name.toLowerCase().includes(val.toLowerCase()) ||
        item.desc.toLowerCase().includes(val.toLowerCase()) ||
        item.category.toLowerCase().includes(val.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const leftLinks = [
    { name: 'Universities', path: '/universities', icon: GraduationCap },
    { name: 'Schools', path: '/schools', icon: School },
  ];

  const rightLinks = [
    { name: 'Opportunities', path: '/programs', icon: BookOpen },
    { name: 'Perks', path: '/perks', icon: Star },
  ];

  const drawerLinks = [
    { 
      name: 'Academic Planner', 
      path: '/planner', 
      icon: Calendar,
      desc: 'Schedule advising & application dates',
      badgeColor: 'bg-[#ff705d]/10 text-[#ff705d] border-[#ff705d]/20'
    },
    { 
      name: 'Saved Desk', 
      path: '/saved', 
      icon: Bookmark,
      desc: 'View bookmarked campuses & saved perks',
      badgeColor: 'bg-[#f5e211]/20 text-ink border-[#f5e211]/40'
    },
    { 
      name: 'Compare Sandbox', 
      path: '/compare', 
      icon: Scale,
      desc: 'Side-by-side tuition & criteria matrix',
      badgeColor: 'bg-[#2ba0ff]/10 text-[#2ba0ff] border-[#2ba0ff]/20'
    },
    { 
      name: 'Accreditation & Policies', 
      path: '/accreditation', 
      icon: ShieldCheck,
      desc: 'CAA, KHDA, ADEK & PDPL legal rules',
      badgeColor: 'bg-[#8ed462]/15 text-[#4da81b] border-[#8ed462]/30'
    },
    { 
      name: 'Equivalency Wizard', 
      path: '/accreditation#equivalency', 
      icon: FileText,
      desc: 'MOE eDAS 2.0 digital attestation guide',
      badgeColor: 'bg-[#9f5ffd]/10 text-[#9f5ffd] border-[#9f5ffd]/20'
    },
    { 
      name: 'Net Cost Calculator', 
      path: '/universities#budget', 
      icon: Sparkles,
      desc: 'Tuition, housing & lifestyle budget',
      badgeColor: 'bg-[#ff705d]/10 text-[#ff705d] border-[#ff705d]/20'
    },
    { 
      name: 'National Vision Mapper', 
      path: '/universities#vision', 
      icon: TrendingUp,
      desc: 'UAE 2031 & KSA 2030 job market matrix',
      badgeColor: 'bg-[#2ba0ff]/10 text-[#2ba0ff] border-[#2ba0ff]/20'
    },
  ];

  return (
    <nav className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      
      {/* Standalone Hamburger Trigger (Fixed at top-left corner of the window) */}
      <button 
        onClick={() => {
          if (drawerOpen) {
            setDrawerOpen(false);
          } else {
            setSubmenu('main');
            setDrawerOpen(true);
          }
        }}
        className="fixed top-6 left-6 sm:top-8 sm:left-8 shrink-0 flex items-center justify-center text-ink hover:opacity-75 transition-all select-none cursor-pointer z-55 bg-transparent border-0 shadow-none outline-none"
      >
        {drawerOpen ? (
          /* Naked single-line close/minimize icon */
          <svg className="w-6 h-6 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        ) : (
          /* Naked two-line hamburger icon (top longer, bottom shorter) */
          <svg className="w-6 h-6 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="9" x2="20" y2="9" />
            <line x1="4" y1="15" x2="14" y2="15" />
          </svg>
        )}
      </button>

      {/* Main Navbar Capsule (Authentic macOS Sequoia / visionOS Liquid Glass) */}
      <div className="bg-white/40 backdrop-blur-[32px] backdrop-saturate-[190%] backdrop-brightness-[105%] border border-white/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04),inset_0_1.5px_1px_0_rgba(255,255,255,0.9),inset_0_-1px_1px_0_rgba(0,0,0,0.03)] rounded-[50px] px-6 h-16 sm:h-20 flex items-center justify-between w-fit mx-auto transition-all duration-300 relative select-none overflow-hidden group/nav">
        
        {/* Top Specular Liquid Light Sheen Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/[0.02] pointer-events-none" />

        {/* Desktop View: Centered, evenly spaced links (8px system) */}
        <div className="hidden lg:flex items-center gap-6 h-full relative z-10">
          
          {/* Left Links */}
          {leftLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative px-4 py-2 flex items-center gap-2 font-sans text-[14px] rounded-[50px] transition-all duration-200 ease-out select-none group/link",
                  isActive 
                    ? "bg-white/70 text-ink font-bold shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/80" 
                    : "text-ink/80 hover:text-ink hover:bg-white/40 hover:border hover:border-white/50 hover:shadow-xs"
                )}
              >
                <Icon className={cn("w-[18px] h-[18px] transition-transform duration-200 group-hover/link:scale-110", isActive ? "text-[#4da81b]" : "text-stone-gray group-hover/link:text-ink")} strokeWidth={2} />
                <span>{link.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeUnderline" 
                    className="absolute -bottom-1 left-4 right-4 h-[3px] bg-[#8ed462] rounded-full shadow-[0_2px_6px_rgba(142,212,98,0.5)]" 
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Center Logo Badge with Liquid Glass Embellishment */}
          <Link to="/" className="flex items-center group h-full px-3 transition-transform duration-200 hover:scale-[1.03]">
            <div className="w-10 h-10 bg-[#8ed462] rounded-[14px] flex items-center justify-center transition-all duration-300 group-hover:rotate-6 shadow-[0_4px_14px_rgba(142,212,98,0.4),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-white/40">
              <span className="text-[#2c2e2a] font-sans font-black text-xl select-none tracking-tighter">M</span>
            </div>
            <div className="ml-3 flex flex-col justify-center">
              <span className="font-sans font-black text-lg tracking-tight text-ink leading-none">Massar</span>
            </div>
          </Link>

          {/* Right Links */}
          {rightLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative px-4 py-2 flex items-center gap-2 font-sans text-[14px] rounded-[50px] transition-all duration-200 ease-out select-none group/link",
                  isActive 
                    ? "bg-white/70 text-ink font-bold shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/80" 
                    : "text-ink/80 hover:text-ink hover:bg-white/40 hover:border hover:border-white/50 hover:shadow-xs"
                )}
              >
                <Icon className={cn("w-[18px] h-[18px] transition-transform duration-200 group-hover/link:scale-110", isActive ? "text-[#4da81b]" : "text-stone-gray group-hover/link:text-ink")} strokeWidth={2} />
                <span>{link.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeUnderline" 
                    className="absolute -bottom-1 left-4 right-4 h-[3px] bg-[#8ed462] rounded-full shadow-[0_2px_6px_rgba(142,212,98,0.5)]" 
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Liquid Glass Search Trigger Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="w-10 h-10 rounded-full bg-white/60 hover:bg-white/90 border border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center text-ink hover:text-[#2ba0ff] transition-all duration-200 hover:scale-105 cursor-pointer ml-1"
            title="Search Directory (⌘K)"
          >
            <Search className="w-4 h-4" strokeWidth={2.2} />
          </button>

        </div>

        {/* Mobile/Tablet View Capsule Content (Just Logo & Search Icon) */}
        <div className="lg:hidden flex items-center justify-between w-full gap-4">
          <Link to="/" className="flex items-center group">
            <div className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center shadow-sm">
              <span className="text-white font-sans font-black text-lg select-none">M</span>
            </div>
            <span className="ml-2.5 font-sans font-bold text-base tracking-tight text-ink">Massar</span>
          </Link>
          <button 
            onClick={() => setSearchOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/[0.03] active:bg-black/[0.06] transition-all cursor-pointer"
          >
            <Search className="w-5 h-5 text-ink/80" strokeWidth={1.75} />
          </button>
        </div>
        
      </div>

      {/* Global Glassmorphic Search Overlay Dialog */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#2c2e2a]/40 backdrop-blur-xl z-55 flex items-start justify-center pt-24 px-4 sm:px-6"
          >
            {/* Scrim close click */}
            <div className="absolute inset-0 cursor-default" onClick={() => setSearchOpen(false)} />

            {/* Search Box Panel */}
            <motion.div 
              initial={{ scale: 0.95, y: -16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white/60 backdrop-blur-[30px] backdrop-saturate-[180%] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.4)] rounded-[32px] w-full max-w-xl p-6 relative z-10 overflow-hidden"
            >
              
              {/* Search Header Input */}
              <div className="flex items-center gap-3 border-b border-hairline-mist pb-4 mb-4">
                <Search className="w-5 h-5 text-[#2ba0ff]" strokeWidth={2} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search universities, schools, opportunities..."
                  className="flex-grow bg-transparent border-0 outline-none font-sans font-medium text-base text-ink placeholder-stone-gray/60 focus:placeholder-[#2ba0ff]/40"
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#2ba0ff]/10 text-stone-gray hover:text-[#2ba0ff] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-[300px] overflow-y-auto pr-1 flex flex-col gap-1.5">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSearchOpen(false);
                        navigate(`/details/${item.type}/${item.id}`);
                      }}
                      className="w-full text-left p-3.5 hover:bg-[#2ba0ff]/10 active:bg-[#2ba0ff]/20 rounded-2xl transition-all cursor-pointer select-none flex items-start gap-3.5 group border border-transparent hover:border-[#2ba0ff]/20"
                    >
                      <div className="w-9 h-9 bg-[#2ba0ff]/10 rounded-xl flex items-center justify-center shrink-0">
                        {item.type === 'university' && <GraduationCap className="w-4.5 h-4.5 text-[#2ba0ff]" strokeWidth={1.75} />}
                        {item.type === 'school' && <School className="w-4.5 h-4.5 text-[#2ba0ff]" strokeWidth={1.75} />}
                        {item.type === 'program' && <BookOpen className="w-4.5 h-4.5 text-[#2ba0ff]" strokeWidth={1.75} />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="font-sans font-bold text-sm text-ink group-hover:text-[#2ba0ff] transition-colors">{item.name}</span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-stone-gray px-2 py-0.5 bg-gray-100 rounded-md">{item.category}</span>
                        </div>
                        <p className="font-sans text-xs text-stone-gray mt-0.5 leading-normal">{item.desc}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="font-sans font-semibold text-stone-gray text-sm">No results found for "{searchQuery}"</p>
                    <p className="font-sans text-stone-gray/60 text-xs mt-1">Try searching for other terms like Khalifa, GEMS, or Hackathon.</p>
                  </div>
                )}
              </div>

              {/* Search Footer hint */}
              <div className="border-t border-hairline-mist pt-3 mt-4 flex items-center justify-between text-[11px] text-stone-gray font-mono">
                <span>Database: 7 curated seeds</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200">ESC</kbd> to close</span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over Left Drawer Menu */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Dark Scrim Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-[#2c2e2a]/30 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Left Drawer Panel */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[320px] sm:w-[360px] bg-white border-r border-hairline-mist z-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              
              {/* Drawer Content Wrapper */}
              <div className="flex-1 space-y-6 overflow-y-auto pr-1">
                
                {/* DRAWER HEADER: Brand Emblem & Close Button */}
                <div className="flex items-center justify-between pb-4 border-b border-hairline-mist">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#8ed462] flex items-center justify-center text-ink shadow-xs font-black">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-sans font-black text-base text-ink uppercase tracking-tight leading-none">
                        Massar Workspace
                      </h3>
                      <span className="font-mono text-[10px] text-stone-gray font-bold uppercase tracking-wider">
                        Student Career OS
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-ink hover:text-white transition-colors flex items-center justify-center text-stone-gray cursor-pointer"
                    title="Close Drawer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* WORKSPACE & TOOLS SECTION */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-mono text-[10px] font-bold text-stone-gray uppercase tracking-widest block">
                      Interactive Tools
                    </span>
                    <span className="font-mono text-[9px] font-bold text-[#ff705d] bg-[#ff705d]/10 px-2 py-0.5 rounded-full border border-[#ff705d]/20">
                      7 Available
                    </span>
                  </div>

                  {/* Rich Cards Grid */}
                  <div className="space-y-2.5">
                    {drawerLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setDrawerOpen(false)}
                          className={cn(
                            "p-3.5 flex items-start gap-3.5 rounded-[22px] border transition-all select-none group relative overflow-hidden",
                            isActive 
                              ? "bg-ink text-[#f5f1e4] border-ink shadow-md" 
                              : "bg-[#f5f1e4]/40 border-hairline-mist hover:bg-white hover:border-ink hover:shadow-xs text-ink"
                          )}
                        >
                          {/* Icon Badge */}
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5",
                            isActive ? "bg-white/10 text-[#f5e211] border-white/20" : link.badgeColor
                          )}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>

                          {/* Text Details */}
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className={cn(
                                "font-sans font-bold text-xs leading-snug truncate",
                                isActive ? "text-[#f5f1e4]" : "text-ink group-hover:text-ink"
                              )}>
                                {link.name}
                              </span>
                              <ChevronRight className={cn(
                                "w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1",
                                isActive ? "text-[#f5e211]" : "text-stone-gray group-hover:text-ink"
                              )} />
                            </div>
                            
                            <p className={cn(
                              "font-sans text-[11px] leading-tight mt-0.5 multiline-truncate",
                              isActive ? "text-stone-300" : "text-stone-gray"
                            )}>
                              {link.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions (Stationary) */}
              <div className="flex flex-col gap-3 border-t border-hairline-mist pt-4 shrink-0 mt-4">
                
                {/* Language Selector */}
                <button
                  onClick={() => setLang(lang === 'EN' ? 'AR' : 'EN')}
                  className="flex items-center justify-between px-4 py-2.5 border border-hairline-mist rounded-[50px] font-sans text-[12px] font-bold bg-[#f5f1e4]/50 text-ink hover:bg-white transition-all cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-stone-gray" />
                    <span>Language</span>
                  </div>
                  <span className="text-[#ff705d] font-mono text-xs font-black bg-[#ff705d]/10 px-2 py-0.5 rounded-md">{lang}</span>
                </button>

                {/* Login Button */}
                <Button variant="primary" className="w-full flex items-center justify-center bg-ink text-white hover:bg-stone-800 border border-ink font-sans font-bold py-3 text-xs rounded-[50px] shadow-sm" asChild>
                  <Link to="/login" onClick={() => setDrawerOpen(false)}>
                    <User className="w-4 h-4 mr-2 text-[#f5e211]" /> Student Login
                  </Link>
                </Button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
