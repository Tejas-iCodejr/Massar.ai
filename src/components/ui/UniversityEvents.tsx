import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Check, CalendarPlus, Loader, Filter, Sparkles } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { googleSignIn, initAuth, createCalendarEvent } from '../../lib/calendar';
import { User } from 'firebase/auth';
import { cn } from '../../lib/utils';

export interface UniversityEvent {
  id: string;
  title: string;
  university: string;
  date: string;
  time: string;
  location: string;
  category: 'Open Day' | 'Seminar' | 'College Fair' | 'Hackathon' | 'Exhibition';
  description: string;
  tags: string[];
}

const EVENTS_DATA: UniversityEvent[] = [
  {
    id: 'nyuad-open',
    title: 'NYU Abu Dhabi Fall Campus Open Day',
    university: 'NYU Abu Dhabi',
    date: '2026-10-14',
    time: '10:00',
    location: 'Saadiyat Island Campus, Abu Dhabi',
    category: 'Open Day',
    description: 'Explore state-of-the-art labs, attend sample lectures by world-renowned faculty, and receive direct admissions guidance.',
    tags: ['Admissions', 'Saadiyat', 'Undergrad']
  },
  {
    id: 'uaeu-grad',
    title: 'UAEU Virtual Graduate Programs Expo',
    university: 'United Arab Emirates University',
    date: '2026-09-22',
    time: '16:00',
    location: 'Virtual Session (Online MS Teams)',
    category: 'Seminar',
    description: 'Meet department heads and discover specialized Masters and PhD scholarships offered at UAE\'s flagship national institution.',
    tags: ['Graduate', 'Scholarships', 'Online']
  },
  {
    id: 'ku-hackathon',
    title: 'Khalifa University Robotics & AI Innovation Hackathon',
    university: 'Khalifa University',
    date: '2026-11-05',
    time: '08:30',
    location: 'Main Campus, Zone C, Abu Dhabi',
    category: 'Hackathon',
    description: 'A 24-hour national challenge for high school seniors and undergrads to construct solutions for real-world municipal problems.',
    tags: ['Engineering', 'Prizes', 'AI']
  },
  {
    id: 'aus-fair',
    title: 'AUS Annual Majors & Careers Fair',
    university: 'American University of Sharjah',
    date: '2026-10-28',
    time: '09:00',
    location: 'Main Auditorium, University City, Sharjah',
    category: 'College Fair',
    description: 'Engage with top multinational recruiters, explore interdisciplinary research projects, and find potential corporate fellowships.',
    tags: ['Careers', 'Sharjah', 'Networking']
  },
  {
    id: 'sorbonne-talk',
    title: 'Sorbonne Abu Dhabi French Literature & Law Colloquium',
    university: 'Sorbonne University Abu Dhabi',
    date: '2026-09-15',
    time: '14:00',
    location: 'Al Reem Island Campus, Abu Dhabi',
    category: 'Seminar',
    description: 'Immerse yourself in bilingual educational pathways, bridging historical methodologies with modern legislative theories.',
    tags: ['Bilingual', 'Law', 'Arts']
  }
];

export function UniversityEvents() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Auth and sync state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // UI states
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncedIds, setSyncedIds] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Initialize Auth state
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

  const handleConnect = async () => {
    setIsLoggingIn(true);
    setSuccessMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        setSuccessMsg('Successfully connected Google Calendar!');
        setTimeout(() => setSuccessMsg(null), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSync = async (event: UniversityEvent) => {
    if (!token) {
      // Connect calendar first
      handleConnect();
      return;
    }

    // Direct confirmation requirement for mutations
    const confirmMessage = `Add "${event.title}" on ${event.date} at ${event.time} to your Google Calendar?`;
    if (!window.confirm(confirmMessage)) return;

    setSyncingId(event.id);
    setSuccessMsg(null);

    try {
      const startDateTime = new Date(`${event.date}T${event.time}:00`).toISOString();
      const endDateTime = new Date(new Date(startDateTime).getTime() + 120 * 60000).toISOString(); // 2 hours default duration

      await createCalendarEvent(token, {
        summary: event.title,
        description: `${event.description}\n\nUniversity: ${event.university}\nSynced via Massar Student Companion App.`,
        location: event.location,
        start: {
          dateTime: startDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });

      setSyncedIds(prev => [...prev, event.id]);
      setSuccessMsg(`"${event.title}" added to your Google Calendar!`);
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err) {
      console.error(err);
      alert('Failed to sync event. Please try reconnecting your calendar.');
    } finally {
      setSyncingId(null);
    }
  };

  const filteredEvents = selectedCategory === 'All'
    ? EVENTS_DATA
    : EVENTS_DATA.filter(evt => evt.category === selectedCategory);

  const categories = ['All', 'Open Day', 'Seminar', 'College Fair', 'Hackathon'];

  return (
    <div className="space-y-8" id="university-events-component">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-hairline-mist">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ff705d]/10 rounded-full text-ink font-mono text-[9px] font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3 h-3 text-[#ff705d]" />
            <span>Interactive Campus Feed</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl uppercase text-ink">
            Upcoming Campus Events
          </h2>
          <p className="font-sans font-medium text-stone-gray max-w-lg mt-2 text-xs leading-relaxed">
            Attend official open days, workshops, and student exhibitions. Register and instantly synchronise details directly into your Google Calendar.
          </p>
        </div>

        {/* Calendar Auth Banner inside control area */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-full border border-stone-100">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-5 h-5 bg-[#8ed462]/20 rounded-full flex items-center justify-center font-sans font-extrabold text-[9px]">U</div>
              )}
              <span className="font-sans text-[10px] text-ink font-semibold">{user.displayName || 'Connected'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8ed462] animate-pulse" />
            </div>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isLoggingIn}
              variant="primary"
              size="sm"
              className="rounded-full text-[10px] uppercase font-bold py-1 px-4 gap-1.5 border border-ink bg-white text-ink hover:bg-stone-50"
            >
              {isLoggingIn ? <Loader className="w-3 h-3 animate-spin" /> : <CalendarPlus className="w-3.5 h-3.5 text-stone-600" />}
              <span>Enable Google Calendar Sync</span>
            </Button>
          )}
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-[10px] font-bold text-stone-gray uppercase mr-2 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter Feed:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold transition-all select-none cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-ink text-[#f5f1e4] border-transparent'
                : 'bg-white text-ink border-hairline-mist hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {successMsg && (
        <div className="p-3.5 bg-[#8ed462]/10 border border-[#8ed462]/25 rounded-2xl flex items-center gap-2.5 animate-fade-in">
          <Check className="w-4 h-4 text-[#4da81b]" />
          <span className="font-sans text-xs text-ink font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => {
          const isSynced = syncedIds.includes(evt.id);
          const isSyncing = syncingId === evt.id;

          const dateObj = new Date(evt.date);
          const monthShort = dateObj.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
          const dayNum = dateObj.getDate();
          const dateStr = dateObj.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          // Category Theme Configs for 3D & Color acccenting
          const theme = evt.category === 'Hackathon' ? {
            gradient: 'from-[#2ba0ff]/10 via-[#2ba0ff]/5 to-white',
            borderColor: 'border-[#2ba0ff]/30 hover:border-[#2ba0ff]',
            leftBar: 'bg-[#2ba0ff]',
            badgeBg: 'bg-[#2ba0ff]/15 text-[#0066cc] border-[#2ba0ff]/30',
            iconColor: 'text-[#2ba0ff]',
            dateBg: 'bg-[#2ba0ff] text-white',
            btnBg: 'bg-ink text-white hover:bg-[#2ba0ff] hover:text-white',
          } : evt.category === 'Open Day' ? {
            gradient: 'from-[#8ed462]/15 via-[#8ed462]/5 to-white',
            borderColor: 'border-[#8ed462]/40 hover:border-[#4da81b]',
            leftBar: 'bg-[#4da81b]',
            badgeBg: 'bg-[#8ed462]/20 text-[#2d7a04] border-[#8ed462]/40',
            iconColor: 'text-[#4da81b]',
            dateBg: 'bg-[#4da81b] text-white',
            btnBg: 'bg-ink text-white hover:bg-[#4da81b] hover:text-white',
          } : evt.category === 'Seminar' ? {
            gradient: 'from-[#ff705d]/12 via-[#ff705d]/5 to-white',
            borderColor: 'border-[#ff705d]/30 hover:border-[#ff705d]',
            leftBar: 'bg-[#ff705d]',
            badgeBg: 'bg-[#ff705d]/15 text-[#d93823] border-[#ff705d]/30',
            iconColor: 'text-[#ff705d]',
            dateBg: 'bg-[#ff705d] text-white',
            btnBg: 'bg-ink text-white hover:bg-[#ff705d] hover:text-white',
          } : {
            gradient: 'from-[#9f5ffd]/12 via-[#9f5ffd]/5 to-white',
            borderColor: 'border-[#9f5ffd]/30 hover:border-[#9f5ffd]',
            leftBar: 'bg-[#9f5ffd]',
            badgeBg: 'bg-[#9f5ffd]/15 text-[#6c1cd9] border-[#9f5ffd]/30',
            iconColor: 'text-[#9f5ffd]',
            dateBg: 'bg-[#9f5ffd] text-white',
            btnBg: 'bg-ink text-white hover:bg-[#9f5ffd] hover:text-white',
          };

          return (
            <div
              key={evt.id}
              className={cn(
                "group relative bg-gradient-to-br border p-6 rounded-[32px] flex flex-col justify-between h-full transition-all duration-300 transform-gpu hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/5 overflow-hidden",
                theme.gradient,
                theme.borderColor
              )}
            >
              {/* Subtle 3D Top Corner Accent Bar */}
              <div className={cn("absolute top-0 left-0 w-full h-1.5", theme.leftBar)} />
              
              {/* Subtle Background Glow Blob */}
              <div className={cn("absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-40 pointer-events-none", theme.leftBar)} />

              <div className="relative z-10">
                {/* Header with 3D Date Emblem & Category Badge */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="font-mono text-[10px] font-extrabold text-stone-gray/80 tracking-wider block uppercase mb-1">
                      {evt.university}
                    </span>
                    <span className={cn("inline-block font-mono text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border", theme.badgeBg)}>
                      {evt.category}
                    </span>
                  </div>

                  {/* 3D Glass Date Emblem */}
                  <div className="flex flex-col items-center justify-center w-12 h-13 bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.08)] shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                    <span className={cn("w-full text-center py-0.5 font-mono text-[8px] font-black uppercase tracking-wider", theme.dateBg)}>
                      {monthShort}
                    </span>
                    <span className="font-sans font-black text-sm text-ink leading-tight py-0.5">
                      {dayNum}
                    </span>
                  </div>
                </div>

                <h3 className="font-sans font-black text-lg text-ink mb-2 leading-snug line-clamp-2 group-hover:text-[#ff705d] transition-colors">
                  {evt.title}
                </h3>

                <p className="font-sans text-xs text-stone-gray/90 line-clamp-3 mb-5 leading-relaxed font-medium">
                  {evt.description}
                </p>

                {/* Event Details Matrix with Styled Icons */}
                <div className="space-y-2.5 pb-4 mb-5 border-b border-stone-200/60">
                  <div className="flex items-center gap-2.5 text-ink font-sans text-xs font-semibold">
                    <div className="w-6 h-6 rounded-lg bg-white/80 shadow-xs flex items-center justify-center shrink-0 border border-stone-100">
                      <Calendar className={cn("w-3.5 h-3.5", theme.iconColor)} />
                    </div>
                    <span>{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-ink font-sans text-xs font-semibold">
                    <div className="w-6 h-6 rounded-lg bg-white/80 shadow-xs flex items-center justify-center shrink-0 border border-stone-100">
                      <Clock className={cn("w-3.5 h-3.5", theme.iconColor)} />
                    </div>
                    <span>{evt.time} GST</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-ink font-sans text-xs font-semibold">
                    <div className="w-6 h-6 rounded-lg bg-white/80 shadow-xs flex items-center justify-center shrink-0 border border-stone-100">
                      <MapPin className={cn("w-3.5 h-3.5", theme.iconColor)} />
                    </div>
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>
              </div>

              {/* Sync Button & Hashtags Footer */}
              <div className="space-y-3.5 relative z-10">
                <div className="flex flex-wrap gap-1.5">
                  {evt.tags.map((tg, i) => (
                    <span key={i} className="font-sans text-[9px] font-bold bg-white/80 text-ink/70 border border-stone-200/80 rounded-md px-2 py-0.5 shadow-2xs group-hover:border-stone-300 transition-colors">
                      #{tg}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => handleSync(evt)}
                  disabled={isSynced || isSyncing}
                  className={cn(
                    "w-full justify-center gap-2 rounded-full py-2.5 text-[11px] font-extrabold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer select-none active:scale-98",
                    isSynced 
                      ? "bg-[#8ed462]/20 text-[#2d7a04] border border-[#8ed462]/50 shadow-inner" 
                      : theme.btnBg
                  )}
                >
                  {isSyncing ? (
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                  ) : isSynced ? (
                    <Check className="w-3.5 h-3.5 text-[#4da81b]" />
                  ) : (
                    <CalendarPlus className="w-3.5 h-3.5 text-current" />
                  )}
                  <span>{isSynced ? 'Synced to Calendar' : 'Sync to Calendar'}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
