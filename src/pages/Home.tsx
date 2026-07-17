import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, GraduationCap, School, Star, Search, Compass, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export function Home() {
  const [activePath, setActivePath] = useState<'middle' | 'high' | 'university'>('high');
  const [savedCount, setSavedCount] = useState(0);

  // Fetch local saved count for badge
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_universities') || '[]');
      setSavedCount(saved.length);
    } catch (e) {
      setSavedCount(0);
    }
  }, []);

  return (
    <div className="grid-bg min-h-screen pb-16 bg-[#f5f1e4]">
      
      {/* Upper Soft Marquee Accent */}
      <div className="bg-white border-b border-hairline-mist py-3 overflow-hidden font-sans text-xs font-semibold tracking-wider text-[#2c2e2a]/80 select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
          <span>★ EMIRATES HIGHER EDUCATION INDEX 2026</span>
          <span className="text-secondary">★ DISCOVER NATIONWIDE CURRICULUMS</span>
          <span>★ ADMISSIONS INTAKES FOR 2026/2027</span>
          <span className="text-[#2ba0ff]">★ LOCAL BRANCH CAMPUS DIRECTORY</span>
          <span>★ KHDA OUTSTANDING INSPECTION RATINGS</span>
          <span className="text-[#ff705d]">★ ELITE PATHWAYS TRACKER</span>
          
          {/* Duplicate for infinite marquee loop */}
          <span>★ EMIRATES HIGHER EDUCATION INDEX 2026</span>
          <span className="text-secondary">★ DISCOVER NATIONWIDE CURRICULUMS</span>
          <span>★ ADMISSIONS INTAKES FOR 2026/2027</span>
          <span className="text-[#2ba0ff]">★ LOCAL BRANCH CAMPUS DIRECTORY</span>
          <span>★ KHDA OUTSTANDING INSPECTION RATINGS</span>
          <span className="text-[#ff705d]">★ ELITE PATHWAYS TRACKER</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Bold Inter Editorial Typography */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-[#8ed462]/20 border border-[#8ed462]/40 px-4 py-2 mb-8 font-sans text-xs font-bold uppercase tracking-wider rounded-[50px] text-ink select-none">
                <Sparkles className="w-4 h-4 text-[#8ed462]" />
                <span>The Definitive Gulf Student Companion</span>
              </div>
              
              <h1 className="font-sans font-black text-5xl sm:text-7xl lg:text-8xl -tracking-[0.05em] leading-[0.95] text-[#2c2e2a] mb-8 uppercase">
                Find your <br />
                <span className="text-[#ff705d] font-serif italic lowercase font-normal tracking-normal block my-1">
                  future pathway
                </span>
                with absolute <br />
                <span className="text-[#2ba0ff]">precision.</span>
              </h1>
              
              <p className="font-sans font-medium text-base sm:text-lg max-w-xl text-[#2c2e2a]/80 leading-relaxed mb-10 pl-5 border-l-2 border-[#8ed462]">
                Massar is a warm, illustrated directory built to align your aspirations with verified academic opportunities. Discover elite campuses, compare tuition ranges, and map your K-12 and university roadmap.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/universities" className="flex items-center gap-2">
                    Browse Higher Ed <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="primary" asChild>
                  <Link to="/compare" className="flex items-center gap-2">
                    Compare Side-by-Side
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Column: Beautiful Paper-Cut Aesthetic Illustration Container */}
            <div className="lg:col-span-5 relative">
              <div className="animate-float relative z-10 p-8 bg-white border border-hairline-mist rounded-[50px] shadow-sm flex flex-col items-center text-center">
                
                {/* Clean geometric vector art simulating flat paper-cut character */}
                <div className="w-48 h-48 bg-[#f5e211]/30 rounded-full relative flex items-center justify-center mb-8 overflow-hidden border border-[#f5e211]/50">
                  <svg className="w-40 h-40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="80" r="32" fill="#ff705d" />
                    <path d="M50 160 C 50 120, 150 120, 150 160 Z" fill="#8ed462" />
                    <rect x="85" y="105" width="30" height="20" rx="4" fill="#2ba0ff" />
                    <path d="M85 110 L100 125 L115 110" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="85" cy="80" r="4" fill="#2c2e2a" />
                    <circle cx="115" cy="80" r="4" fill="#2c2e2a" />
                  </svg>
                  <div className="absolute top-4 right-6 w-8 h-8 rounded-full bg-[#2ba0ff] opacity-80 animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-6 h-6 rounded-full bg-[#ff705d] opacity-95"></div>
                </div>

                <div className="font-sans font-bold text-lg text-ink mb-2">Every Step mapped for High-Achievers</div>
                <p className="font-sans text-xs text-stone-gray max-w-xs leading-relaxed">
                  Toggle stages below to calibrate your current educational focus. Map K-12 inspections, local branches, or partner student benefits.
                </p>
              </div>

              {/* Decorative sunlit sticker spots */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#f5e211] rounded-full -z-0 opacity-40 blur-lg"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#8ed462] rounded-full -z-0 opacity-30 blur-xl"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Path Choice Bento Interactive Stage Switcher */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card variant="default" interactive={false} className="p-8 md:p-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between mb-8 pb-6 border-b border-hairline-mist">
            <div>
              <span className="font-mono text-[10px] text-[#80827f] uppercase font-bold tracking-widest mb-1 block">Institutional Focus</span>
              <h3 className="font-sans font-black text-2xl sm:text-3xl text-[#2c2e2a] uppercase">Select Your Academic Roadmap</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {(['middle', 'high', 'university'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setActivePath(level)}
                  className={cn(
                    "px-6 py-3 font-sans font-semibold text-xs uppercase rounded-[50px] border tracking-wider transition-all select-none cursor-pointer",
                    activePath === level 
                      ? "bg-[#ff705d] text-white border-transparent shadow-sm" 
                      : "bg-[#f5f1e4] text-[#2c2e2a] border-hairline-mist hover:bg-white"
                  )}
                >
                  {level === 'middle' ? 'K-8 Primary' : level === 'high' ? 'High School' : 'Higher Ed'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-[30px] bg-[#f5f1e4]/50 border border-hairline-mist text-ink">
            {activePath === 'middle' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                  <span className="font-mono text-[10px] text-[#ff705d] font-bold uppercase block mb-2 tracking-widest">Early Development</span>
                  <h4 className="font-sans font-black text-xl sm:text-2xl uppercase mb-3 text-[#2c2e2a]">Foundational K-12 Inspections</h4>
                  <p className="font-sans text-sm text-stone-gray leading-relaxed max-w-2xl">
                    Discover and compare elementary and secondary schools across the UAE. Directly access official KHDA (Dubai) and ADEK (Abu Dhabi) inspection reviews, curriculum mappings, and local community feedback to lay down strong academic roots.
                  </p>
                </div>
                <div className="md:col-span-4 text-left md:text-right">
                  <Link to="/schools" className="inline-flex items-center gap-1.5 px-6 py-3 bg-white border border-ink text-ink font-sans font-semibold text-xs uppercase rounded-[50px] hover:bg-[#8ed462] hover:text-ink transition-all">
                    Explore Schools Directory <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
            {activePath === 'high' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                  <span className="font-mono text-[10px] text-[#2ba0ff] font-bold uppercase block mb-2 tracking-widest">Secondary Target</span>
                  <h4 className="font-sans font-black text-xl sm:text-2xl uppercase mb-3 text-[#2c2e2a]">Admissions Prep & Fellowships</h4>
                  <p className="font-sans text-sm text-stone-gray leading-relaxed max-w-2xl">
                    Prepare your application portfolios early. Find local tech hackathons, science research Course credits, and elite secondary student programs. Parse exact university acceptance criteria and map out your requirements instantly.
                  </p>
                </div>
                <div className="md:col-span-4 text-left md:text-right">
                  <Link to="/programs" className="inline-flex items-center gap-1.5 px-6 py-3 bg-white border border-ink text-ink font-sans font-semibold text-xs uppercase rounded-[50px] hover:bg-[#2ba0ff] hover:text-white transition-all">
                    Explore Fellowships <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
            {activePath === 'university' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                  <span className="font-mono text-[10px] text-[#8ed462] font-bold uppercase block mb-2 tracking-widest">Higher Horizons</span>
                  <h4 className="font-sans font-black text-xl sm:text-2xl uppercase mb-3 text-[#2c2e2a]">University Branch Comparisons</h4>
                  <p className="font-sans text-sm text-stone-gray leading-relaxed max-w-2xl">
                    Side-by-side comparison arrays for regional branch campuses and national universities. Review accurate tuition limits, accredited curriculum pathways, international affiliations, and verify direct student benefits & perks.
                  </p>
                </div>
                <div className="md:col-span-4 text-left md:text-right">
                  <Link to="/universities" className="inline-flex items-center gap-1.5 px-6 py-3 bg-white border border-ink text-ink font-sans font-semibold text-xs uppercase rounded-[50px] hover:bg-[#f5e211] hover:text-[#2c2e2a] transition-all">
                    Explore Universities <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Bento Grid Pillars Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-hairline-mist">
          <div>
            <h2 className="font-sans font-black text-4xl sm:text-6xl -tracking-[0.04em] uppercase leading-none text-ink">
              Core Pillars
            </h2>
            <p className="font-sans font-medium text-stone-gray max-w-md mt-3 text-sm leading-relaxed">
              Every stage of your educational discovery path, beautifully organized and structured for clarity.
            </p>
          </div>
          <Link to="/universities" className="text-xs font-sans font-bold uppercase tracking-wider hover:underline text-ink">
            See all avenues &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1: Universities */}
          <Card variant="mint" className="group h-80 flex flex-col justify-between p-8 bg-white hover:bg-white">
            <div>
              <div className="w-12 h-12 bg-[#8ed462]/10 rounded-[15px] flex items-center justify-center font-bold mb-6">
                <GraduationCap className="w-6 h-6 text-[#2c2e2a]" />
              </div>
              <h3 className="font-sans font-black text-2xl uppercase tracking-tight mb-2 text-[#2c2e2a]">Universities</h3>
              <p className="font-sans font-medium text-xs text-stone-gray leading-relaxed">
                Analyze acceptance rates, search UAE national universities and global branch campuses. Filter by annual tuition parameters, region, and intakes.
              </p>
            </div>
            <Link to="/universities" className="inline-flex items-center font-sans font-bold uppercase text-xs text-ink group-hover:text-[#ff705d] hover:underline gap-1 mt-6">
              Search Universities <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>

          {/* Pillar 2: Schools */}
          <Card variant="yellow" className="group h-80 flex flex-col justify-between p-8 bg-white hover:bg-white">
            <div>
              <div className="w-12 h-12 bg-[#f5e211]/10 rounded-[15px] flex items-center justify-center font-bold mb-6">
                <School className="w-6 h-6 text-[#2c2e2a]" />
              </div>
              <h3 className="font-sans font-black text-2xl uppercase tracking-tight mb-2 text-[#2c2e2a]">Schools Directory</h3>
              <p className="font-sans font-medium text-xs text-stone-gray leading-relaxed">
                Compare primary and secondary school performance in Dubai and Abu Dhabi. View curriculums, tuition fee tiers, and board evaluations.
              </p>
            </div>
            <Link to="/schools" className="inline-flex items-center font-sans font-bold uppercase text-xs text-ink group-hover:text-[#ff705d] hover:underline gap-1 mt-6">
              Search Schools <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>

          {/* Pillar 3: Compare */}
          <Card variant="default" className="group h-80 flex flex-col justify-between p-8 bg-white hover:bg-white">
            <div>
              <div className="w-12 h-12 bg-[#2ba0ff]/10 rounded-[15px] flex items-center justify-center font-bold mb-6">
                <Search className="w-6 h-6 text-[#2ba0ff]" />
              </div>
              <h3 className="font-sans font-black text-2xl uppercase tracking-tight mb-2 text-[#2c2e2a]">Compare Sandbox</h3>
              <p className="font-sans font-medium text-xs text-stone-gray leading-relaxed">
                An editorial side-by-side matric comparison sandbox. Cross-examine tuition ranges, classified domains, rates, and active intakes simultaneously.
              </p>
            </div>
            <Link to="/compare" className="inline-flex items-center font-sans font-bold uppercase text-xs text-ink group-hover:text-[#ff705d] hover:underline gap-1 mt-6">
              Enter Sandbox <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>

        </div>
      </section>

      {/* Helpful Illustrated Guidance Card */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 bg-white rounded-[50px] border border-hairline-mist shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-mono text-[10px] text-[#ff705d] font-bold uppercase block mb-2 tracking-widest">COMMUNITY VALUES</span>
              <h3 className="font-sans font-black text-3xl sm:text-4xl text-[#2c2e2a] uppercase mb-6 leading-tight">
                Empowering your search <br />
                with clear credentials
              </h3>
              <p className="font-sans text-sm text-stone-gray leading-relaxed mb-6">
                Educational journeys should be anchored on real facts. That's why Massar gathers direct parameters straight from institution registries, Ministry listings, and public inspection boards. We maintain transparency so that families and students can make comfortable, informed higher education transitions.
              </p>
              
              <div className="flex items-center gap-6">
                <div>
                  <div className="font-sans font-bold text-2xl text-[#2ba0ff]">Verified</div>
                  <div className="font-sans text-xs text-stone-gray">Direct Registry Sources</div>
                </div>
                <div className="w-px h-8 bg-hairline-mist"></div>
                <div>
                  <div className="font-sans font-bold text-2xl text-[#8ed462]">Accredited</div>
                  <div className="font-sans text-xs text-stone-gray">Ministry & Board Sync</div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#f5f1e4] rounded-[40px] border border-[#e0dbce] text-ink relative overflow-hidden flex flex-col justify-between min-h-[250px]">
              <div>
                <span className="font-sans font-bold text-lg block mb-2 text-ink">Exclusive Student Perks Directory</span>
                <p className="font-sans text-xs text-stone-gray leading-relaxed">
                  We've curated a dedicated catalogue of verified student benefits. From local software licensing credentials to food and hardware reductions across the UAE, check out what exclusive perks your student status unlocks today.
                </p>
              </div>
              <div className="mt-6">
                <Link to="/perks" className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#ff705d] text-white font-sans font-semibold text-xs uppercase rounded-[50px] hover:opacity-90 transition-opacity">
                  Check Perks Directory <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#f5e211] opacity-40 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
