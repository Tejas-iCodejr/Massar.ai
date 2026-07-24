import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, GraduationCap, School, Star, Search, Compass, BookOpen, ChevronRight, Trophy, DollarSign, Check, Briefcase, Target, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { UniversityEvents } from '../components/ui/UniversityEvents';
import { InteractiveCompass, MilestoneConnector, DecorativeDoodle } from '../components/ui/InteractiveDoodle';
import { PathWizard } from '../components/ui/PathWizard';
import { EquivalencyWizard } from '../components/ui/EquivalencyWizard';
import { NationalVisionMapper } from '../components/ui/NationalVisionMapper';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import heroIllustration from '@/assets/massar_hero_illustration.png';

export function Home() {
  const [activePath, setActivePath] = useState<'middle' | 'high' | 'university'>('high');
  const [savedCount, setSavedCount] = useState(0);

  // Hook for tracking page-level scroll progress
  const { scrollY, scrollYProgress } = useScroll();
  
  // Create a smoothed spring scale for the top scroll progress indicator
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate parallax multipliers for background shapes/stickers to move independently
  const yBgShape1 = useTransform(scrollY, [0, 1200], [0, 120]);
  const yBgShape2 = useTransform(scrollY, [0, 1500], [0, -140]);
  const rotateCompass = useTransform(scrollY, [0, 2000], [0, 360]);

  // Fetch local saved count for badge
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_universities') || '[]');
      setSavedCount(saved.length);
    } catch (e) {
      setSavedCount(0);
    }
  }, []);

  // Stagger configurations for lists of elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 75,
        damping: 15
      }
    }
  };

  return (
    <div className="grid-bg min-h-screen pb-16 bg-[#f5f1e4] relative overflow-hidden">
      
      {/* Scroll Progress Bar Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ff705d] via-[#2ba0ff] to-[#8ed462] origin-left z-50 shadow-sm"
        style={{ scaleX }}
        id="scroll-progress-bar"
      />

      {/* Floating Background Elements (Static) */}
      <div 
        className="absolute top-1/4 right-[5%] w-72 h-72 rounded-full bg-[#f5e211]/15 filter blur-3xl pointer-events-none -z-10"
      />
      <div 
        className="absolute top-2/3 left-[2%] w-96 h-96 rounded-full bg-[#8ed462]/10 filter blur-3xl pointer-events-none -z-10"
      />

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
      <section className="relative overflow-hidden pt-1 pb-16 md:pt-2 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Bold Inter Editorial Typography */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
              className="lg:col-span-7"
            >
              <h1 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] -tracking-[0.05em] leading-[0.95] text-[#2c2e2a] mb-8 uppercase relative">
                Find your <br />
                <span className="text-[#ff705d] font-serif italic lowercase font-normal tracking-normal inline-block my-1 relative">
                  future pathway
                  <DecorativeDoodle type="sparkle" color="#ff705d" className="absolute -top-3 -right-10 hidden sm:inline-flex" />
                </span>
                with absolute <br />
                <span className="text-[#2ba0ff] inline-block relative">
                  precision.
                  <DecorativeDoodle type="star" color="#2ba0ff" className="absolute -bottom-2 -right-10 hidden sm:inline-flex" />
                </span>
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
            </motion.div>
            
            {/* Right Column: Hero Illustration and Floating Dashboard Cards */}
            <div className="lg:col-span-5 relative w-full h-[520px] sm:h-[580px] lg:h-[550px] flex items-center justify-center mt-10 lg:mt-0 select-none">
              
              {/* Central Illustration Base */}
              <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
                
                {/* Background soft sun glow */}
                <div className="absolute top-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-[#f5e211]/25 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
                
                {/* Main Illustration Image - Pulled up and scaled */}
                <img 
                  src={heroIllustration} 
                  alt="Massar Illustration" 
                  className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_10px_20px_rgba(44,46,42,0.06)] transform -translate-y-12 scale-110"
                />

                {/* Floating Blue Star Doodle 1 */}
                <div className="absolute top-[62%] left-[-15px] z-20 text-[#2ba0ff] animate-float">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>

                {/* Floating Blue Star Doodle 2 */}
                <div className="absolute top-[64%] left-[10%] z-20 text-[#2ba0ff] opacity-80 scale-75 animate-float" style={{ animationDelay: '1.5s' }}>
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>

                {/* --- 1. Top Universities Card (Tilted slightly left and adjusted position) --- */}
                <div className="absolute top-[0%] left-[-22%] sm:left-[-30%] z-20 bg-white/95 backdrop-blur-md border border-[#e0dbce] rounded-3xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)] w-[215px] transform -rotate-3 transition-all hover:rotate-0 hover:scale-[1.03]">
                  
                  {/* Floating blue trophy badge on card's top-left */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#2ba0ff] rounded-full flex items-center justify-center text-white border-2 border-white shadow-md">
                    <Award className="w-4 h-4" />
                  </div>

                  <div className="pl-4">
                    <span className="font-sans font-bold text-[11px] text-ink block leading-tight">Top Universities</span>
                    <span className="font-sans font-semibold text-[9px] text-stone-gray block mb-2 leading-none">United Arab Emirates</span>
                  </div>

                  <div className="space-y-1.5">
                    {/* University Item 1 */}
                    <div className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#f5f1e4]/40 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-[#2ba0ff]/10 flex items-center justify-center text-[#2ba0ff] font-bold text-xs shrink-0">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="font-sans font-bold text-[9px] text-ink leading-tight truncate">Khalifa University</div>
                        <div className="font-sans text-[7px] text-stone-gray leading-none truncate">United Arab Emirates</div>
                      </div>
                    </div>

                    {/* University Item 2 */}
                    <div className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#f5f1e4]/40 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-[#1b365d]/10 flex items-center justify-center text-[#1b365d] shrink-0">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L4 5v6c0 5.25 3.42 10.19 8 11.5 4.58-1.31 8-6.25 8-11.5V5l-8-3z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="font-sans font-bold text-[9px] text-ink leading-tight truncate">American Univ. of Sharjah</div>
                        <div className="font-sans text-[7px] text-stone-gray leading-none truncate">of United Arab Emirates</div>
                      </div>
                    </div>

                    {/* University Item 3 */}
                    <div className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#f5f1e4]/40 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-[#57068c]/10 flex items-center justify-center text-[#57068c] shrink-0 font-sans font-black text-[7px]">
                        NYU
                      </div>
                      <div className="min-w-0">
                        <div className="font-sans font-bold text-[9px] text-ink leading-tight truncate">New York University</div>
                        <div className="font-sans text-[7px] text-stone-gray leading-none truncate">Abu Dhabi</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- 2. Opportunities Card (Tilted slightly right and adjusted position) --- */}
                <div className="absolute top-[42%] right-[-22%] sm:right-[-30%] z-20 bg-white/95 backdrop-blur-md border border-[#e0dbce] rounded-3xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)] w-[185px] transform rotate-3 transition-all hover:rotate-0 hover:scale-[1.03]">
                  
                  {/* Floating green checkmark badge on card's top-right */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#8ed462] rounded-full flex items-center justify-center text-white border-2 border-white shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>

                  <span className="font-sans font-bold text-[11px] text-ink block mb-2 pl-1">Opportunities</span>

                  <div className="space-y-1">
                    {/* Item 1: Hackathons */}
                    <div className="flex items-center justify-between p-1 rounded-xl hover:bg-[#f5f1e4]/40 transition-colors cursor-pointer group/item">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6.5 h-6.5 rounded-lg bg-[#f5e211]/20 flex items-center justify-center text-[#d4af37] shrink-0">
                          <Target className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-sans font-bold text-[9px] text-ink leading-tight truncate">Hackathons</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-stone-gray shrink-0 transition-transform group-hover/item:translate-x-0.5" />
                    </div>

                    {/* Item 2: Scholarships */}
                    <div className="flex items-center justify-between p-1 rounded-xl hover:bg-[#f5f1e4]/40 transition-colors cursor-pointer group/item">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6.5 h-6.5 rounded-lg bg-[#f5e211]/20 flex items-center justify-center text-[#d4af37] shrink-0">
                          <DollarSign className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-sans font-bold text-[9px] text-ink leading-tight truncate">Scholarships</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-stone-gray shrink-0 transition-transform group-hover/item:translate-x-0.5" />
                    </div>

                    {/* Item 3: Internships */}
                    <div className="flex items-center justify-between p-1 rounded-xl hover:bg-[#f5f1e4]/40 transition-colors cursor-pointer group/item">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6.5 h-6.5 rounded-lg bg-[#f5e211]/20 flex items-center justify-center text-[#d4af37] shrink-0">
                          <Briefcase className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-sans font-bold text-[9px] text-ink leading-tight truncate">Internships</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-stone-gray shrink-0 transition-transform group-hover/item:translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* --- 3. Pathway Planner Timeline Card (Tilted slightly right and adjusted position) --- */}
                <div className="absolute bottom-[-6%] left-[6%] sm:left-[10%] z-20 bg-white/95 backdrop-blur-md border border-[#e0dbce] rounded-3xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)] w-[260px] transform rotate-1 transition-all hover:rotate-0 hover:scale-[1.03]">
                  
                  <span className="font-sans font-bold text-[11px] text-ink block mb-3">Pathway Planner</span>

                  {/* Horizontal Timeline */}
                  <div className="relative flex items-center justify-between px-1">
                    
                    {/* Background track line */}
                    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#8ed462]/30 -z-10" />
                    
                    {/* K-12 node */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#8ed462] border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <span className="font-sans font-bold text-[7px] text-stone-gray leading-none">K-12</span>
                    </div>

                    {/* Undergraduate active node with coral/red halo */}
                    <div className="flex flex-col items-center gap-1 relative">
                      <div className="absolute -top-1.5 w-6 h-6 rounded-full bg-[#ff705d]/20 animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="w-3.5 h-3.5 rounded-full bg-[#ff705d] border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <span className="font-sans font-bold text-[7px] text-[#ff705d] leading-none">Undergraduate</span>
                    </div>

                    {/* Career node */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#8ed462] border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <span className="font-sans font-bold text-[7px] text-stone-gray leading-none">Career</span>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* UI/UX Pro Max Bento Grid Feature Showcase */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#2ba0ff] bg-[#2ba0ff]/10 px-3 py-1 rounded-full border border-[#2ba0ff]/20 inline-block mb-3">
            MASSAR PLATFORM CAPABILITIES
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-[#2c2e2a] uppercase tracking-tight">
            Decision-Support Ecosystem
          </h2>
          <p className="font-sans text-sm sm:text-base text-stone-gray mt-2">
            Explore verified directories, automated equivalence tools, and side-by-side comparators built for Middle East students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Box 1: AI Grounded Search */}
          <div className="md:col-span-7 bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#2ba0ff]/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#2ba0ff]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#2ba0ff]/20 transition-all" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#2ba0ff]/10 border border-[#2ba0ff]/20 flex items-center justify-center text-[#2ba0ff] mb-4 shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#2ba0ff] block mb-1">AI Grounded Intelligence</span>
              <h3 className="font-sans font-black text-2xl text-[#2c2e2a] mb-2">Live Search & Maps Verification</h3>
              <p className="font-sans text-sm text-stone-gray leading-relaxed max-w-md">
                Powered by Gemini 2.5 Flash with live Google Search & Maps tool grounding. Get official campus addresses, tuition figures, and accredited program profiles.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-hairline-mist flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-[#2c2e2a]">Real-Time Google Grounding</span>
              <Link to="/universities" className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#2ba0ff] hover:underline">
                Search Directory <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Box 2: Student Perks Vault */}
          <div className="md:col-span-5 bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#ff705d]/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff705d]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#ff705d]/20 transition-all" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#ff705d]/10 border border-[#ff705d]/20 flex items-center justify-center text-[#ff705d] mb-4 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#ff705d] block mb-1">Student Value</span>
              <h3 className="font-sans font-black text-2xl text-[#2c2e2a] mb-2">111+ Verified Student Perks</h3>
              <p className="font-sans text-sm text-stone-gray leading-relaxed">
                Unlock developer software bundles, cloud credits, design subscriptions, and regional academic grants.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-hairline-mist flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-stone-gray">UNiDAYS / SheerID Verified</span>
              <Link to="/perks" className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#ff705d] hover:underline">
                Explore Perks <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Box 3: Side-by-Side Multi-Uni Comparator */}
          <div className="md:col-span-6 bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#8ed462]/40 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#8ed462]/10 border border-[#8ed462]/20 flex items-center justify-center text-[#4da81b] mb-4 shadow-xs">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#4da81b] block mb-1">Decision Support</span>
              <h3 className="font-sans font-black text-2xl text-[#2c2e2a] mb-2">3-Slot Mutually Exclusive Comparator</h3>
              <p className="font-sans text-sm text-stone-gray leading-relaxed">
                Compare tuition fees, global ranks, acceptance rates, and campus amenities side-by-side with smart mutual exclusion selectors.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-hairline-mist flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-[#2c2e2a]">Interactive Metric Diffing</span>
              <Link to="/compare" className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#4da81b] hover:underline">
                Compare Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Box 4: eDAS 2.0 MOE Attestation Wizard */}
          <div className="md:col-span-6 bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#f5e211]/60 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#f5e211]/20 border border-[#f5e211]/40 flex items-center justify-center text-[#b89500] mb-4 shadow-xs">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#b89500] block mb-1">Ministry Guidance</span>
              <h3 className="font-sans font-black text-2xl text-[#2c2e2a] mb-2">MOE / eDAS 2.0 Attestation Wizard</h3>
              <p className="font-sans text-sm text-stone-gray leading-relaxed">
                Step-by-step guidance through Ministry of Education equivalency attestations for British, IB, American, and Indian curriculums.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-hairline-mist flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-[#2c2e2a]">Official MOE Checklist</span>
              <a href="#equivalency-wizard" className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#b89500] hover:underline">
                Launch Wizard <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Path Wizard Section */}
      <div id="equivalency-wizard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-12">
        <PathWizard />
        <EquivalencyWizard />
        <NationalVisionMapper />
      </div>

      {/* Path Choice Bento Interactive Stage Switcher */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
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
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
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
              </motion.div>
            )}
            {activePath === 'high' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                <div className="md:col-span-8">
                  <span className="font-mono text-[10px] text-[#2ba0ff] font-bold uppercase block mb-2 tracking-widest">Secondary Target</span>
                  <h4 className="font-sans font-black text-xl sm:text-2xl uppercase mb-3 text-[#2c2e2a]">Global Opportunities & Prep</h4>
                  <p className="font-sans text-sm text-stone-gray leading-relaxed max-w-2xl">
                    Prepare your application portfolios early. Find global student hackathons, prestigious summer schools, elite leadership fellowships, and advanced academic courses. Analyze eligibility parameters and build an outstanding student profile.
                  </p>
                </div>
                <div className="md:col-span-4 text-left md:text-right">
                  <Link to="/programs" className="inline-flex items-center gap-1.5 px-6 py-3 bg-white border border-ink text-ink font-sans font-semibold text-xs uppercase rounded-[50px] hover:bg-[#2ba0ff] hover:text-white transition-all">
                    Explore Opportunities <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
            {activePath === 'university' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
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
              </motion.div>
            )}
          </div>
        </Card>
      </motion.section>

      {/* Bento Grid Pillars Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-hairline-mist"
        >
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
        </motion.div>

        {/* Scroll-Triggered Staggered Pillar Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          
          {/* Pillar 1: Universities */}
          <motion.div variants={itemVariants} className="flex h-full">
            <Card variant="mint" className="group w-full h-80 flex flex-col justify-between p-8 bg-white hover:bg-white">
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
          </motion.div>

          {/* Pillar 2: Schools */}
          <motion.div variants={itemVariants} className="flex h-full">
            <Card variant="yellow" className="group w-full h-80 flex flex-col justify-between p-8 bg-white hover:bg-white">
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
          </motion.div>

          {/* Pillar 3: Compare */}
          <motion.div variants={itemVariants} className="flex h-full">
            <Card variant="default" className="group w-full h-80 flex flex-col justify-between p-8 bg-white hover:bg-white">
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
          </motion.div>

        </motion.div>
      </section>

      {/* Dynamic University Events Feed */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65 }}
        className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <UniversityEvents />
      </motion.section>



    </div>
  );
}
