import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Globe, MapPin, ExternalLink, Calendar, Bookmark, CheckCircle, Award, ShieldCheck, HelpCircle, Loader, Landmark, BookOpen, GraduationCap, Cpu, Laptop, Gift, Coffee, DollarSign, Star, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import { UniversityLogo } from '../components/ui/UniversityLogo';
import { cn } from '../lib/utils';
import { googleSignIn, initAuth, createCalendarEvent } from '../lib/calendar';
import { User } from 'firebase/auth';
import { UniversityDetailsExpanded } from '../components/ui/UniversityDetailsExpanded';

interface DetailsData {
  text: string;
  groundingChunks: any[];
  webSearchQueries: string[];
}

export function Details() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  
  const [item, setItem] = useState<any>(null);
  const [loadingItem, setLoadingItem] = useState(true);
  
  const [loadingGrounding, setLoadingGrounding] = useState(false);
  const [groundingError, setGroundingError] = useState<string | null>(null);
  const [groundingResult, setGroundingResult] = useState<DetailsData | null>(null);
  
  const [isSaved, setIsSaved] = useState(false);

  // Google Calendar Integration States
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);
  const [advisingDate, setAdvisingDate] = useState('2026-07-20');
  const [advisingTime, setAdvisingTime] = useState('11:00');

  const [loadingMaps, setLoadingMaps] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const [mapsResult, setMapsResult] = useState<{ text: string; groundingChunks: any[] } | null>(null);

  // Fetch target item details on mount
  useEffect(() => {
    if (!type || !id) return;
    
    setLoadingItem(true);
    let apiEndpoint = '';
    if (type === 'university') apiEndpoint = '/api/universities';
    else if (type === 'school') apiEndpoint = '/api/schools';
    else if (type === 'program') apiEndpoint = '/api/programs';
    else if (type === 'perk') apiEndpoint = '/api/perks';
    
    if (!apiEndpoint) {
      setLoadingItem(false);
      return;
    }

    fetch(apiEndpoint)
      .then(res => res.json())
      .then(data => {
        const found = data.find((x: any) => x.id === id);
        if (found) {
          setItem(found);
          // Check if item is saved
          try {
            const savedKey = `saved_${type}s`;
            const saved = JSON.parse(localStorage.getItem(savedKey) || '[]');
            setIsSaved(saved.includes(id));
          } catch (e) {
            setIsSaved(false);
          }
        }
        setLoadingItem(false);
      })
      .catch(err => {
        console.error("Failed to load item", err);
        setLoadingItem(false);
      });
  }, [type, id]);

  // Synchronize calendar authentications
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleConnectCalendar = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.message?.includes('popup-closed-by-user')) {
        console.warn('Google Calendar authorization was cancelled by the user.');
      } else {
        console.error('Google Calendar authorization failed:', err);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleScheduleSession = async () => {
    if (!token || !item) return;

    const itemName = item.name || item.title || 'Institution';
    const eventSummary = `Advising Consultation: ${itemName}`;
    
    // MANDATORY confirmation dialog for any user mutations
    const confirmMessage = `Would you like to schedule a virtual admissions consultation with ${itemName} on ${advisingDate} at ${advisingTime} and add it directly to your primary Google Calendar?`;
    if (!window.confirm(confirmMessage)) return;

    setIsScheduling(true);
    setScheduleSuccess(null);

    try {
      const startISO = new Date(`${advisingDate}T${advisingTime}:00`).toISOString();
      // 45 minutes duration
      const endISO = new Date(new Date(startISO).getTime() + 45 * 60000).toISOString();

      await createCalendarEvent(token, {
        summary: eventSummary,
        description: `Admissions advising session for ${itemName}.\nOrganized via Massar Student Platform.\nConsultation details, curriculum review, and document submission guidelines.`,
        location: item.location || 'Online / Virtual Meet',
        start: {
          dateTime: startISO,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endISO,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });

      setScheduleSuccess(`Advising session with ${itemName} successfully added to your calendar!`);
      setTimeout(() => setScheduleSuccess(null), 8000);
    } catch (err) {
      console.error(err);
      alert('Failed to book session. Please reconnect your calendar.');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleAddDeadline = async () => {
    if (!token || !item) return;

    const itemName = item.name || item.title || 'Program';
    const eventSummary = `Admission Deadline: ${itemName}`;
    const deadlineStr = item.deadline || 'August 15, 2026';
    
    // MANDATORY confirmation dialog
    const confirmMessage = `Add application deadline reminder for "${itemName}" (${deadlineStr}) to your Google Calendar?`;
    if (!window.confirm(confirmMessage)) return;

    setIsScheduling(true);
    setScheduleSuccess(null);

    try {
      // Create event on 2026-08-15 12:00 or a custom parsed date
      const dlISO = new Date(`2026-08-15T12:00:00`).toISOString();
      const endISO = new Date(`2026-08-15T13:00:00`).toISOString();

      await createCalendarEvent(token, {
        summary: eventSummary,
        description: `Application submission deadline for ${itemName}.\nOfficial Closing: ${deadlineStr}.\nSynced via Massar Student Platform.`,
        location: item.location || 'Online Portal',
        start: {
          dateTime: dlISO,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endISO,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });

      setScheduleSuccess(`Deadline reminder for ${itemName} successfully added to your Google Calendar!`);
      setTimeout(() => setScheduleSuccess(null), 8000);
    } catch (err) {
      console.error(err);
      alert('Failed to add deadline reminder. Please reconnect your calendar.');
    } finally {
      setIsScheduling(false);
    }
  };

  // Trigger search grounding automatically once item is loaded
  useEffect(() => {
    if (!item || !type) return;

    setLoadingGrounding(true);
    setGroundingError(null);

    let payload = {
      type,
      name: item.name || item.title || '',
      organizer: item.organizer || item.provider || item.curriculum || '',
      eligibility: item.eligibility || item.category || item.rating || '',
      location: item.location || item.emirate || '',
      extraInfo: item.deadline || item.tuitionRange || item.tuitionFee?.toString() || item.description || ''
    };

    fetch('/api/details-grounding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to retrieve detailed search analysis.');
        }
        return res.json();
      })
      .then(data => {
        setGroundingResult(data);
      })
      .catch(err => {
        console.error("Grounding error", err);
        setGroundingError(err.message || "Unable to reach Gemini Search Grounding engine.");
      })
      .finally(() => {
        setLoadingGrounding(false);
      });
  }, [item, type]);

  // Trigger Maps Grounding automatically once item is loaded
  useEffect(() => {
    if (!item || !type) return;
    if (type === 'perk') return;

    setLoadingMaps(true);
    setMapsError(null);

    const payload = {
      name: item.name || item.title || '',
      location: item.location || item.emirate || '',
      type
    };

    fetch('/api/maps-grounding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to retrieve detailed location maps.');
        }
        return res.json();
      })
      .then(data => {
        setMapsResult(data);
      })
      .catch(err => {
        console.error("Maps grounding error", err);
        setMapsError(err.message || "Unable to reach Gemini Maps Grounding engine.");
      })
      .finally(() => {
        setLoadingMaps(false);
      });
  }, [item, type]);

  const toggleSave = () => {
    if (!type || !id) return;
    try {
      const savedKey = `saved_${type}s`;
      let saved = JSON.parse(localStorage.getItem(savedKey) || '[]');
      if (saved.includes(id)) {
        saved = saved.filter((x: string) => x !== id);
        setIsSaved(false);
      } else {
        saved.push(id);
        setIsSaved(true);
      }
      localStorage.setItem(savedKey, JSON.stringify(saved));
    } catch (e) {
      console.error(e);
    }
  };

  if (loadingItem) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center min-h-screen bg-[#f5f1e4] grid-bg flex flex-col justify-center items-center">
        <Loader className="w-12 h-12 animate-spin text-[#ff705d] mb-4" />
        <h3 className="font-sans font-black text-xl uppercase tracking-wider text-ink animate-pulse">
          Loading Official Records...
        </h3>
        <p className="font-sans text-stone-gray text-xs mt-1">
          Fetching structural metadata and preparing secure sandbox parameters.
        </p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center min-h-screen bg-[#f5f1e4] grid-bg flex flex-col justify-center items-center">
        <Landmark className="w-16 h-16 text-stone-gray mb-4" />
        <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-ink">
          Profile Not Found
        </h3>
        <p className="font-sans text-stone-gray text-sm max-w-md mx-auto mt-2 leading-relaxed">
          The requested profile ID does not exist or has been archived by the admissions office.
        </p>
        <Button className="mt-8 rounded-[50px] font-sans font-bold text-xs uppercase" asChild>
          <Link to="/">Return to Homepage</Link>
        </Button>
      </div>
    );
  }

  // Extract human-friendly details
  const name = item.name || item.title || '';
  const subtitle = item.organizer || item.provider || item.curriculum || '';
  const locationText = item.location || (item.emirate ? `${item.emirate}, UAE` : 'United Arab Emirates');
  
  // Real external link builder
  let realExternalUrl = '';
  if (type === 'university' && item.domain) {
    realExternalUrl = item.domain.startsWith('http') ? item.domain : `https://${item.domain}`;
  } else if (item.link) {
    realExternalUrl = item.link;
  } else {
    // default school link using official web searches
    realExternalUrl = `https://www.google.com/search?q=${encodeURIComponent(name + " " + locationText)}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid-bg min-h-screen bg-[#f5f1e4]">
      
      {/* Back button breadcrumb */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#ff705d]/10 border border-hairline-mist hover:border-[#ff705d] rounded-[50px] text-ink font-sans font-semibold text-xs uppercase transition-all select-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#ff705d]" />
          <span>Back to previous page</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Deep Dynamic Analysis Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Display Header Card */}
          <Card className="bg-white border-2 border-ink p-8 relative overflow-hidden rounded-[32px]">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ff705d]/10 rounded-full pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row gap-6 items-start justify-between relative z-10">
              <div className="flex gap-4 items-center">
                {type === 'university' ? (
                  <UniversityLogo domain={item.domain} name={name} className="w-16 h-16 rounded-[20px]" />
                ) : (
                  <div className="w-16 h-16 bg-[#2c2e2a]/5 border border-hairline-mist rounded-[20px] flex items-center justify-center font-sans font-black text-2xl text-ink">
                    {type === 'program' && (item.type === 'Hackathon' ? <Cpu className="w-8 h-8 text-[#2ba0ff]" /> : item.type === 'Fellowship' ? <Award className="w-8 h-8 text-[#ff705d]" /> : <BookOpen className="w-8 h-8 text-[#8ed462]" />)}
                    {type === 'perk' && (item.category === 'Software' ? <Laptop className="w-8 h-8 text-[#2ba0ff]" /> : item.category === 'Food' ? <Coffee className="w-8 h-8 text-[#8ed462]" /> : <Gift className="w-8 h-8 text-[#ff705d]" />)}
                    {type === 'school' && <Landmark className="w-8 h-8 text-ink" />}
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge variant={type === 'university' ? 'default' : type === 'program' ? 'success' : type === 'school' ? 'warning' : 'default'} className="uppercase text-[9px] tracking-widest font-black">
                      {type}
                    </Badge>
                    {item.type && <Badge variant="default" className="text-[9px] font-bold uppercase">{item.type}</Badge>}
                    {item.category && <Badge variant="default" className="text-[9px] font-bold uppercase">{item.category}</Badge>}
                  </div>
                  <h1 className="font-sans font-black text-3xl sm:text-4xl uppercase tracking-tight leading-none text-ink">
                    {name}
                  </h1>
                  <p className="font-sans text-xs text-stone-gray font-bold uppercase tracking-wider mt-2.5">
                    {type === 'school' ? 'Curriculum' : 'Organizer/Provider'}: <span className="text-ink underline">{subtitle}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={toggleSave}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center border border-hairline-mist rounded-full bg-white transition-all hover:bg-gray-50 select-none",
                    isSaved ? "bg-[#f5e211]/30 border-[#f5e211]" : ""
                  )}
                  title="Bookmark profile"
                >
                  <Bookmark className={cn("w-5 h-5", isSaved ? "fill-ink text-ink" : "text-stone-gray")} />
                </button>
                <Button 
                  asChild
                  className="bg-[#2c2e2a] hover:bg-ink text-white font-sans font-bold text-xs uppercase px-6 py-3.5 rounded-[50px] border-2 border-transparent hover:border-[#2c2e2a] transition-all cursor-pointer flex items-center gap-1.5 flex-grow sm:flex-grow-0"
                >
                  <a href={realExternalUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
                    Visit Official Site <ExternalLink className="w-4 h-4 text-white" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>

          {/* TWO-COLUMN REQUIREMENTS & STATISTICS MATRIX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Core Requirements & Criteria */}
            <Card className="bg-white border border-hairline-mist p-6 rounded-[24px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ff705d]" />
              <div className="pl-2">
                <h3 className="font-sans font-black text-sm uppercase tracking-wider text-ink mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#ff705d]" /> Requirements & Access Criteria
                </h3>
                
                <div className="space-y-4">
                  {type === 'university' && (
                    <>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Academic Level Target</div>
                        <div className="font-sans text-xs text-ink font-semibold bg-[#f5f1e4]/50 p-2.5 rounded-lg border border-hairline-mist">
                          Open to secondary school graduates with accredited regional secondary certificates.
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Standard Intakes</div>
                        <div className="font-sans text-xs text-ink font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#8ed462]" /> 
                          <span>{item.intakes?.join(', ') || 'Fall & Spring cycles'}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Authorized Verification</div>
                        <div className="font-sans text-[11px] text-stone-gray">
                          Requires official transcripts, certificate of equivalency from UAE Ministry of Education, and English competency score (IELTS/TOEFL).
                        </div>
                      </div>
                    </>
                  )}

                  {type === 'program' && (
                    <>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Target Eligibility</div>
                        <div className="font-sans text-xs text-ink font-bold bg-[#ff705d]/10 text-ink px-3 py-2 rounded-lg border border-[#ff705d]/20 inline-block">
                          {item.eligibility}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Prerequisite Experience</div>
                        <div className="font-sans text-xs text-ink font-semibold bg-[#f5f1e4]/50 p-2.5 rounded-lg border border-hairline-mist">
                          Enthusiastic individuals; coding knowledge is beneficial but not strictly mandatory.
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Filing Deadline</div>
                        <div className="font-sans text-xs text-ink font-semibold flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#ff705d]" />
                          <span className="text-[#ff705d] font-bold">{item.deadline}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {type === 'school' && (
                    <>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Accredited Curriculum</div>
                        <div className="font-sans text-xs text-ink font-bold bg-[#8ed462]/10 text-ink px-3 py-2 rounded-lg border border-[#8ed462]/20 inline-block">
                          {item.curriculum} Curriculum
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Mandatory Inspection Rating</div>
                        <div className="font-sans text-xs text-ink font-semibold flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#2ba0ff]" />
                          <span>Rated <strong className="text-[#2ba0ff] font-black">{item.rating}</strong> by KHDA / ADEK guidelines.</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Age Limits & Admission</div>
                        <div className="font-sans text-[11px] text-stone-gray">
                          Offers grades KG1 through Grade 12. Assessment exam is required for initial placement.
                        </div>
                      </div>
                    </>
                  )}

                  {type === 'perk' && (
                    <>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Redemption Coupon Code</div>
                        <div className="font-mono text-sm text-ink font-bold bg-[#f5e211]/20 border border-[#f5e211]/50 px-3.5 py-2 rounded-lg text-center select-all cursor-pointer">
                          MASSARSTUDENT
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Verification Required</div>
                        <div className="font-sans text-xs text-ink font-semibold flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#8ed462]" />
                          <span>Official <code className="bg-[#f5f1e4] px-1 rounded font-mono">.edu</code> / <code className="bg-[#f5f1e4] px-1 rounded font-mono">.ae</code> email or physical ID</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Eligibility Bracket</div>
                        <div className="font-sans text-xs text-stone-gray">
                          Valid for active students in secondary schools & universities in the UAE and wider Gulf region.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Column 2: Performance Statistics & Financials */}
            <Card className="bg-white border border-hairline-mist p-6 rounded-[24px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8ed462]" />
              <div className="pl-2">
                <h3 className="font-sans font-black text-sm uppercase tracking-wider text-ink mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#8ed462]" /> Institutional Stats & Financials
                </h3>
                
                <div className="space-y-4">
                  {type === 'university' && (
                    <>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Annual Tuition Standard</div>
                        <div className="font-sans text-sm text-ink font-bold flex items-baseline gap-1 bg-[#8ed462]/10 text-ink px-3 py-2 rounded-lg border border-[#8ed462]/20 inline-block">
                          <span className="text-xs">AED</span>
                          <span className="text-lg font-black leading-none">{item.tuitionFee?.toLocaleString()}</span>
                          <span className="text-[10px] font-semibold text-stone-gray font-sans">/ year</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Acceptance Rate</div>
                        <div className="font-sans text-xs text-ink font-semibold flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#f5e211]" />
                          <span>{item.acceptanceRate}% (Selective Academic Intake)</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Primary Campus Region</div>
                        <div className="font-sans text-xs text-ink font-semibold flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#ff705d]" />
                          <span>{locationText}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {type === 'program' && (
                    <>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Host Organizer Entity</div>
                        <div className="font-sans text-xs text-ink font-bold bg-[#2ba0ff]/10 text-ink px-3 py-2 rounded-lg border border-[#2ba0ff]/20 inline-block">
                          {subtitle}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Participation Toll & Costs</div>
                        <div className="font-sans text-xs text-[#8ed462] font-extrabold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> 100% Fully Sponsored & Free
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Geographic Target</div>
                        <div className="font-sans text-xs text-ink font-semibold flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#ff705d]" />
                          <span>{locationText}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {type === 'school' && (
                    <>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Annual Fee Scale</div>
                        <div className="font-sans text-xs text-ink font-bold bg-[#ff705d]/10 text-ink px-3 py-2 rounded-lg border border-[#ff705d]/20 inline-block">
                          {item.tuitionRange}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Regulatory Board Location</div>
                        <div className="font-sans text-xs text-ink font-semibold flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#8ed462]" />
                          <span>{locationText} Education District</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Facilities Grade</div>
                        <div className="font-sans text-xs text-stone-gray">
                          Equipped with modern laboratories, computing suites, and elite campus athletic domains.
                        </div>
                      </div>
                    </>
                  )}

                  {type === 'perk' && (
                    <>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Standard Discount/Benefit</div>
                        <div className="font-sans text-xs text-ink font-bold bg-[#8ed462]/10 text-ink px-3 py-2 rounded-lg border border-[#8ed462]/20 inline-block">
                          {item.discount || "Premium Free Access Pack"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Provider Parent</div>
                        <div className="font-sans text-xs text-ink font-semibold flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#2ba0ff]" />
                          <span>{subtitle} Global Education Support</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-1">Verified Status</div>
                        <div className="font-sans text-xs text-[#8ed462] font-bold flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> Fully Operational for 2026/2027 Academic Year
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

          </div>

          {/* Core Institutional Features & Academic Tabs */}
          {type === 'university' && (
            <UniversityDetailsExpanded universityId={id || ''} universityName={name || ''} />
          )}

          {/* Deep Content Block */}
          <Card className="bg-white border border-hairline-mist p-8 rounded-[32px] min-h-[300px]">
            {loadingGrounding ? (
              <div className="text-center py-20">
                <Loader className="w-10 h-10 animate-spin text-[#ff705d] mx-auto mb-4" />
                <h4 className="font-sans font-black text-md uppercase tracking-tight text-ink mb-1 animate-pulse">
                  Engaging Grounded Search Core...
                </h4>
                <p className="font-sans text-stone-gray text-xs max-w-sm mx-auto leading-relaxed">
                  Synthesizing real-time directories, comparing regional criteria databases, and formatting custom summaries.
                </p>
              </div>
            ) : groundingError ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-sans font-black text-xl uppercase tracking-tight text-ink mb-2">General Overview</h3>
                  <p className="font-sans text-sm text-stone-gray leading-relaxed">
                    {item.description || "Detailed profile data is currently being calibrated by our research councils."}
                  </p>
                </div>
                {(() => {
                  const isQuota = groundingError.toLowerCase().includes("429") || groundingError.toLowerCase().includes("quota") || groundingError.toLowerCase().includes("resource_exhausted");
                  return (
                    <div className="p-5 bg-[#ff705d]/5 border border-[#ff705d]/20 rounded-[20px] flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#ff705d] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-sans font-bold text-xs text-ink uppercase tracking-wide">
                          {isQuota ? "Gemini API Quota Exceeded (Rate Limit)" : "AI Details Module Offline"}
                        </div>
                        <p className="font-sans text-xs text-stone-gray mt-1 leading-relaxed">
                          {isQuota ? (
                            <span>
                              Your Gemini API Key is configured successfully, but the current request has hit a rate limit or exceeded its daily quota (429 Resource Exhausted). Please wait a moment and refresh, or configure a premium key in Settings &gt; Secrets.
                            </span>
                          ) : (
                            <span>
                              Could not retrieve live search-grounded details. Please configure your <strong>GEMINI_API_KEY</strong> environment variable in Settings &gt; Secrets to unlock elite real-time program summaries.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : groundingResult ? (
              <div className="space-y-8">
                {/* Markdown analysis */}
                <div className="prose max-w-none">
                  <MarkdownRenderer content={groundingResult.text} />
                </div>

                {/* Grounding Citations */}
                {groundingResult.groundingChunks && groundingResult.groundingChunks.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-hairline-mist">
                    <div className="font-sans text-xs text-stone-gray uppercase font-bold tracking-wider mb-3 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-stone-gray" /> Verified Information Sources:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {groundingResult.groundingChunks.map((chunk: any, cIdx: number) => {
                        if (!chunk.web) return null;
                        return (
                          <a
                            key={cIdx}
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            referrerPolicy="no-referrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f1e4]/50 border border-hairline-mist hover:border-[#2c2e2a] hover:bg-[#8ed462]/10 rounded-[50px] font-sans text-[11px] text-ink font-semibold transition-colors select-none"
                          >
                            <span>{cIdx + 1}. {chunk.web.title || 'Source'}</span>
                            <ExternalLink className="w-3 h-3 text-stone-gray" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="font-sans font-black text-xl uppercase tracking-tight text-ink mb-2">Overview Description</h3>
                <p className="font-sans text-sm text-stone-gray leading-relaxed bg-[#f5f1e4]/40 p-6 rounded-[24px] border border-hairline-mist">
                  {item.description || "Detailed profile data is currently being calibrated by our research councils."}
                </p>
              </div>
            )}
          </Card>

          {/* Bottom Back Navigation */}
          <div className="mt-6 flex justify-start">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#ff705d]/10 border-2 border-ink rounded-[50px] text-ink font-sans font-black text-xs uppercase transition-all select-none cursor-pointer shadow-sm hover:shadow"
            >
              <ArrowLeft className="w-4 h-4 text-[#ff705d] stroke-[2.5]" />
              <span>Back to previous page</span>
            </button>
          </div>
        </div>

        {/* Right Side: Quick Parameters & Action Sidebar */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          
          {/* Quick Metrics Panel */}
          <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] space-y-5">
            <h3 className="font-sans font-black text-xs uppercase tracking-wider text-stone-gray border-b border-hairline-mist pb-3">
              Essential Profile Facts
            </h3>

            <div className="space-y-4">
              
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-stone-gray uppercase flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#8ed462]" /> Region / Location
                </span>
                <span className="text-ink text-right">{locationText}</span>
              </div>

              {type === 'university' && (
                <>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-gray uppercase flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#8ed462]" /> Tuition Fee
                    </span>
                    <span className="text-ink font-bold bg-[#f5f1e4] px-3 py-1 rounded-full border border-hairline-mist">
                      AED {item.tuitionFee?.toLocaleString()} / Yr
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-gray uppercase flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#f5e211]" /> Acceptance Rate
                    </span>
                    <span className="text-ink font-bold bg-[#f5f1e4] px-3 py-1 rounded-full border border-hairline-mist">
                      {item.acceptanceRate}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-gray uppercase flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#ff705d]" /> Intakes
                    </span>
                    <span className="text-ink font-bold bg-[#f5f1e4] px-3 py-1 rounded-full border border-hairline-mist">
                      {item.intakes?.join(', ') || 'Fall, Spring'}
                    </span>
                  </div>
                </>
              )}

              {type === 'school' && (
                <>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-gray uppercase flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#ff705d]" /> Curriculum
                    </span>
                    <span className="text-ink font-bold bg-[#f5f1e4] px-3 py-1 rounded-full border border-hairline-mist">
                      {item.curriculum}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-gray uppercase flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#8ed462]" /> Inspection Board
                    </span>
                    <span className="text-ink font-bold bg-[#f5f1e4] px-3 py-1 rounded-full border border-hairline-mist">
                      {item.rating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-gray uppercase flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#8ed462]" /> Fee Range
                    </span>
                    <span className="text-ink font-bold bg-[#f5f1e4] px-3 py-1 rounded-full border border-hairline-mist">
                      {item.tuitionRange}
                    </span>
                  </div>
                </>
              )}

              {type === 'program' && (
                <>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-gray uppercase flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#8ed462]" /> Eligibility
                    </span>
                    <span className="text-ink font-bold bg-[#f5f1e4] px-3 py-1 rounded-full border border-hairline-mist">
                      {item.eligibility}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-gray uppercase flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#ff705d]" /> Closing Deadline
                    </span>
                    <span className="text-[#ff705d] font-bold bg-[#f5f1e4] px-3 py-1 rounded-full border border-hairline-mist">
                      {item.deadline}
                    </span>
                  </div>
                </>
              )}

              {type === 'perk' && (
                <>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-gray uppercase flex items-center gap-1.5">
                      <Laptop className="w-4 h-4 text-[#2ba0ff]" /> Category
                    </span>
                    <span className="text-ink font-bold bg-[#f5f1e4] px-3 py-1 rounded-full border border-hairline-mist">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-gray uppercase flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#8ed462]" /> Promo Code
                    </span>
                    <span className="text-[#ff705d] font-mono font-bold bg-[#f5f1e4] px-3 py-1 rounded-full border border-hairline-mist select-all cursor-pointer">
                      MASSARSTUDENT
                    </span>
                  </div>
                </>
              )}

            </div>
          </Card>

          {/* Campus Location Discovery (Google Maps Grounding) */}
          {type !== 'perk' && (
            <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] space-y-4">
              <h3 className="font-sans font-black text-xs uppercase tracking-wider text-stone-gray border-b border-hairline-mist pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ff705d]" /> Campus Location & Navigation
              </h3>

              {loadingMaps ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Loader className="w-8 h-8 animate-spin text-[#ff705d] mb-2.5" />
                  <p className="font-sans text-stone-gray text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    Consulting Real-time Maps...
                  </p>
                </div>
              ) : mapsError ? (
                <div className="space-y-4">
                  {(() => {
                    const isQuota = mapsError.toLowerCase().includes("429") || mapsError.toLowerCase().includes("quota") || mapsError.toLowerCase().includes("resource_exhausted");
                    return (
                      <div className="p-4 bg-[#ff705d]/5 border border-[#ff705d]/10 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-ink">
                          <AlertTriangle className="w-4 h-4 text-[#ff705d]" />
                          <p className="font-sans text-xs font-bold uppercase tracking-wider text-ink">
                            {isQuota ? "Gemini API Quota Exceeded (429)" : "Navigation Lookup Error"}
                          </p>
                        </div>
                        <p className="font-sans text-[11px] text-stone-gray leading-relaxed">
                          {isQuota ? (
                            <span>
                              Your Gemini API key is configured correctly, but it has reached its rate limit or exceeded its daily quota (429 Resource Exhausted).
                            </span>
                          ) : (
                            <span>
                              General region: <strong>{locationText}</strong>. Please check your API key configuration in the <strong>Settings &gt; Secrets</strong> panel of the AI Studio UI.
                            </span>
                          )}
                        </p>
                        <div className="text-[9px] text-stone-gray font-mono bg-stone-50 p-2 rounded border border-stone-200 break-all select-all">
                          {mapsError}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Fallback direct map navigation link */}
                  <div className="p-4 bg-[#f5f1e4]/40 border border-[#e8e3d5] rounded-2xl space-y-3">
                    <p className="font-sans text-[11px] text-stone-gray leading-relaxed">
                      While the real-time AI mapping grounding service is busy, you can locate and navigate to <strong>{name}</strong> directly using Google Maps:
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + locationText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#8ed462]/10 border border-[#8ed462] hover:border-[#8ed462] rounded-[50px] text-ink font-sans font-bold text-xs uppercase transition-all select-none cursor-pointer shadow-sm text-center"
                    >
                      <MapPin className="w-4 h-4 text-[#ff705d]" />
                      <span>Open Campus on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-gray ml-1" />
                    </a>
                  </div>
                </div>
              ) : mapsResult ? (
                <div className="space-y-4">
                  {/* Detailed Description */}
                  <div className="font-sans text-xs text-stone-gray leading-relaxed space-y-3 prose max-w-none">
                    <MarkdownRenderer content={mapsResult.text} />
                  </div>

                  {/* Grounding Maps Citations / Links */}
                  {(() => {
                    const mapsCitations: { uri: string; title: string; reviewSnippet?: string }[] = [];
                    if (mapsResult.groundingChunks) {
                      mapsResult.groundingChunks.forEach((chunk: any) => {
                        if (chunk.maps) {
                          const uri = chunk.maps.uri;
                          const title = chunk.maps.title || name;
                          let snippet = '';
                          if (chunk.maps.placeAnswerSources?.reviewSnippets?.[0]?.text) {
                            snippet = chunk.maps.placeAnswerSources.reviewSnippets[0].text;
                          }
                          if (!mapsCitations.some(c => c.uri === uri)) {
                            mapsCitations.push({ uri, title, reviewSnippet: snippet });
                          }
                        } else if (chunk.web) {
                          const uri = chunk.web.uri;
                          const title = chunk.web.title || 'Official map / guide';
                          if (!mapsCitations.some(c => c.uri === uri) && (uri.includes('maps') || uri.includes('location') || uri.includes('contact') || uri.includes('address'))) {
                            mapsCitations.push({ uri, title });
                          }
                        }
                      });
                    }

                    if (mapsCitations.length === 0) return null;

                    return (
                      <div className="pt-4 border-t border-hairline-mist space-y-2">
                        <div className="text-[10px] font-bold uppercase text-stone-gray tracking-wider">
                          Official Google Maps Links:
                        </div>
                        <div className="space-y-2">
                          {mapsCitations.map((cit, idx) => (
                            <div key={idx} className="p-3 bg-[#f5f1e4]/40 border border-[#e8e3d5] rounded-2xl space-y-1.5 transition-all hover:bg-[#8ed462]/10 hover:border-[#8ed462]/30">
                              <a
                                href={cit.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                referrerPolicy="no-referrer"
                                className="flex items-center gap-1.5 text-ink hover:text-[#ff705d] font-bold text-xs underline transition-colors"
                              >
                                <Globe className="w-3.5 h-3.5 text-[#ff705d]" />
                                <span className="line-clamp-1">{cit.title}</span>
                                <ExternalLink className="w-3 h-3 text-stone-gray shrink-0" />
                              </a>
                              {cit.reviewSnippet && (
                                <p className="text-[10px] text-stone-gray italic leading-normal">
                                  "{cit.reviewSnippet}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="p-4 bg-[#f5f1e4]/50 border border-hairline-mist rounded-2xl text-center">
                  <p className="font-sans text-xs text-stone-gray">
                    Location maps coordinates are currently queued for sync.
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Google Calendar Assistant */}
          {type !== 'perk' && (
            <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] space-y-4">
              <h3 className="font-sans font-black text-xs uppercase tracking-wider text-stone-gray border-b border-hairline-mist pb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ff705d]" /> Google Calendar Assistant
              </h3>

              {scheduleSuccess && (
                <div className="p-3.5 bg-[#8ed462]/10 border border-[#8ed462]/20 rounded-2xl flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#8ed462] shrink-0 mt-0.5" />
                  <p className="font-sans text-[11px] font-semibold text-ink leading-snug">
                    {scheduleSuccess}
                  </p>
                </div>
              )}

              {needsAuth ? (
                <div className="space-y-3">
                  <p className="font-sans text-[11px] text-stone-gray leading-relaxed">
                    Connect your Google Calendar to schedule personalized admissions advising consultations, or to save official application deadlines straight into your private diary.
                  </p>
                  <Button
                    onClick={handleConnectCalendar}
                    disabled={isLoggingIn}
                    variant="primary"
                    className="w-full justify-center gap-1.5 border border-ink hover:bg-gray-50 rounded-full py-2 text-xs font-bold uppercase cursor-pointer"
                  >
                    {isLoggingIn ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5 text-stone-600" />}
                    <span>Connect Google Calendar</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center gap-2.5">
                    {user?.photoURL ? (
                      <img src={user.photoURL} className="w-6 h-6 rounded-full border border-hairline-mist" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center font-sans font-bold text-[10px]">
                        U
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-sans font-bold text-[10px] text-ink truncate">{user?.displayName || 'Student'}</p>
                      <p className="font-mono text-[8px] text-stone-gray truncate">{user?.email}</p>
                    </div>
                  </div>

                  {type === 'program' ? (
                    <div className="space-y-2">
                      <p className="font-sans text-[11px] text-stone-gray leading-relaxed">
                        Keep track of this program's upcoming intake close date. Sync it as a deadline to your calendar.
                      </p>
                      <Button
                        onClick={handleAddDeadline}
                        disabled={isScheduling}
                        variant="primary"
                        className="w-full justify-center gap-1.5 bg-[#8ed462] border border-transparent text-ink hover:bg-[#8ed462]/90 rounded-full py-2 text-xs font-bold uppercase cursor-pointer"
                      >
                        {isScheduling ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
                        <span>Sync Deadline Reminder</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      <p className="font-sans text-[11px] text-stone-gray leading-relaxed">
                        Coordinate a virtual consultation session with the university's academic advisors.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-sans text-[9px] font-bold text-stone-gray uppercase mb-1">Select Date</label>
                          <input
                            type="date"
                            value={advisingDate}
                            onChange={(e) => setAdvisingDate(e.target.value)}
                            className="w-full px-3 py-1.5 bg-stone-50 border border-hairline-mist rounded-lg font-sans text-[10px] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[9px] font-bold text-stone-gray uppercase mb-1">Select Time</label>
                          <input
                            type="time"
                            value={advisingTime}
                            onChange={(e) => setAdvisingTime(e.target.value)}
                            className="w-full px-3 py-1.5 bg-stone-50 border border-hairline-mist rounded-lg font-sans text-[10px] outline-none"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleScheduleSession}
                        disabled={isScheduling}
                        variant="primary"
                        className="w-full justify-center gap-1.5 bg-[#8ed462] border border-transparent text-ink hover:bg-[#8ed462]/90 rounded-full py-2 text-xs font-bold uppercase cursor-pointer"
                      >
                        {isScheduling ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
                        <span>Book Advising Session</span>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* Verification Advisory Box */}
          <Card className="bg-[#f5f1e4]/40 border border-[#e0dbce] p-6 rounded-[32px] space-y-4">
            <h4 className="font-sans font-black text-xs uppercase tracking-wider text-ink flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8ed462]" /> Massar Verification Advisory
            </h4>
            <p className="font-sans text-[11px] text-stone-gray leading-relaxed">
              Middle Eastern institutional guidelines request high school or university transcripts, institutional email IDs (<code className="bg-white px-1.5 py-0.5 rounded font-mono">.edu</code> or <code className="bg-white px-1.5 py-0.5 rounded font-mono">.ae</code> domains), or physical ID cards to authorize admission applications or claim student premium pro software benefits.
            </p>
          </Card>

        </div>

      </div>

    </div>
  );
}
