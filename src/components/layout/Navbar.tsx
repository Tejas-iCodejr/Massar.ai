import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, GraduationCap, School, BookOpen, Star, Search, Globe, User, Menu, Calendar, X, Bookmark, Scale, ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react';
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
    { name: 'Planner', path: '/planner', icon: Calendar },
    { name: 'Saved Desk', path: '/saved', icon: Bookmark },
    { name: 'Compare Sandbox', path: '/compare', icon: Scale },
    { name: 'Accreditation & Policies', path: '/accreditation', icon: ShieldCheck },
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

      {/* Main Navbar Capsule (iOS-Style Frosted Glass) */}
      <div className="bg-white/45 backdrop-blur-[24px] backdrop-saturate-[180%] border border-white/40 shadow-[0_8px_32px_rgba(31,38,135,0.06),inset_0_1px_1px_rgba(255,255,255,0.3)] rounded-[50px] px-6 h-16 sm:h-20 flex items-center justify-between w-fit mx-auto transition-all duration-300 relative select-none">
        
        {/* Desktop View: Centered, evenly spaced links (8px system) */}
        <div className="hidden lg:flex items-center gap-8 h-full">
          
          {/* Left Links */}
          {leftLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative px-4 py-2 flex items-center gap-2 font-sans font-medium text-[14px] rounded-[50px] transition-all duration-150 ease-in-out hover:-translate-y-[1px] hover:bg-black/[0.02] select-none group",
                  isActive ? "text-ink font-bold" : "text-ink/80 hover:text-ink"
                )}
              >
                <Icon className="w-[18px] h-[18px] transition-opacity" strokeWidth={1.5} style={{ opacity: isActive ? 1 : 0.7 }} />
                <span>{link.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeUnderline" 
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#8ed462] rounded-full" 
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Center Logo */}
          <Link to="/" className="flex items-center group h-full px-2">
            <div className="w-10 h-10 bg-primary rounded-[12px] flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 shadow-sm">
              <span className="text-white font-sans font-black text-xl select-none">M</span>
            </div>
            <div className="ml-3 flex flex-col justify-center">
              <span className="font-sans font-bold text-lg tracking-tight text-ink leading-none">Massar</span>
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
                  "relative px-4 py-2 flex items-center gap-2 font-sans font-medium text-[14px] rounded-[50px] transition-all duration-150 ease-in-out hover:-translate-y-[1px] hover:bg-black/[0.02] select-none group",
                  isActive ? "text-ink font-bold" : "text-ink/80 hover:text-ink"
                )}
              >
                <Icon className="w-[18px] h-[18px] transition-opacity" strokeWidth={1.5} style={{ opacity: isActive ? 1 : 0.7 }} />
                <span>{link.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeUnderline" 
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#8ed462] rounded-full" 
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Search Trigger (Icon + Cmd+K Badge) */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search (⌘K)"
            className="relative px-3 py-1.5 flex items-center gap-1.5 font-sans font-medium rounded-full transition-all duration-150 ease-in-out hover:-translate-y-[1px] hover:bg-black/[0.03] select-none cursor-pointer text-ink/80 hover:text-ink group border border-hairline-mist bg-white/50"
          >
            <Search className="w-[16px] h-[16px] transition-opacity opacity-70 group-hover:opacity-100" strokeWidth={1.5} />
            <span className="font-mono text-[10px] font-bold text-stone-500 bg-gray-100 border border-stone-200 px-1.5 py-0.5 rounded">⌘K</span>
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
              className="fixed left-0 top-0 bottom-0 w-[300px] sm:w-[340px] bg-white border-r border-hairline-mist z-50 shadow-2xl p-6 sm:p-8 pt-24 flex flex-col justify-between overflow-y-auto"
            >
              
              {/* Direct Grouped Navigation Sections */}
              <div className="flex-1 space-y-6 overflow-y-auto pr-1">
                
                {/* SECTION 1: DIRECTORIES */}
                <div>
                  <span className="font-mono text-[9px] font-bold text-stone-gray uppercase tracking-widest pl-3 mb-2 block">
                    Directories
                  </span>
                  
                  <div className="space-y-1">
                    {[...leftLinks, ...rightLinks].map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setDrawerOpen(false)}
                          className={cn(
                            "px-4 py-3 flex items-center justify-between font-sans font-semibold text-[14px] rounded-[50px] transition-all select-none group",
                            isActive 
                              ? "bg-[#8ed462]/20 text-ink font-bold shadow-xs border border-[#8ed462]/30" 
                              : "text-ink/80 hover:bg-stone-100/80 hover:text-ink"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn("w-4.5 h-4.5 transition-colors", isActive ? "text-ink font-bold" : "text-stone-gray group-hover:text-ink")} />
                            <span>{link.name}</span>
                          </div>
                          <ChevronRight className={cn("w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5", isActive ? "text-ink" : "text-stone-gray/50")} />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 2: WORKSPACE & TOOLS */}
                <div className="pt-2 border-t border-hairline-mist">
                  <span className="font-mono text-[9px] font-bold text-stone-gray uppercase tracking-widest pl-3 mb-2 block">
                    Workspace & Tools
                  </span>

                  <div className="space-y-1">
                    {drawerLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setDrawerOpen(false)}
                          className={cn(
                            "px-4 py-3 flex items-center justify-between font-sans font-semibold text-[14px] rounded-[50px] transition-all select-none group",
                            isActive 
                              ? "bg-[#ff705d]/15 text-[#ff705d] font-bold shadow-xs border border-[#ff705d]/30" 
                              : "text-ink/80 hover:bg-stone-100/80 hover:text-ink"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn("w-4.5 h-4.5 transition-colors", isActive ? "text-[#ff705d]" : "text-stone-gray group-hover:text-ink")} />
                            <span>{link.name}</span>
                          </div>
                          <ChevronRight className={cn("w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5", isActive ? "text-[#ff705d]" : "text-stone-gray/50")} />
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions (Stationary) */}
              <div className="flex flex-col gap-4 border-t border-hairline-mist pt-6 shrink-0">
                
                {/* Language Selector */}
                <button
                  onClick={() => setLang(lang === 'EN' ? 'AR' : 'EN')}
                  className="flex items-center justify-between px-4 py-3 border border-hairline-mist rounded-[50px] font-sans text-[12px] font-bold bg-white text-ink hover:bg-gray-50 transition-all cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-stone-gray" />
                    <span>Language</span>
                  </div>
                  <span className="text-secondary font-mono">{lang}</span>
                </button>

                {/* Login Button */}
                <Button variant="primary" className="w-full flex items-center justify-center border border-ink font-sans font-bold py-3.5 text-xs rounded-[50px]" asChild>
                  <Link to="/login" onClick={() => setDrawerOpen(false)}>
                    <User className="w-4 h-4 mr-2" /> Login
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
