import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Check, CalendarPlus, Loader, Filter, Sparkles } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { googleSignIn, initAuth, createCalendarEvent } from '../../lib/calendar';
import { User } from 'firebase/auth';

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

          const dateStr = new Date(evt.date).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          return (
            <Card
              key={evt.id}
              className="bg-white border border-hairline-mist p-6 rounded-[32px] flex flex-col justify-between h-full transition-all hover:translate-y-[-2px] hover:shadow-sm"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <span className="font-mono text-[9px] font-bold text-stone-gray block">
                    {evt.university}
                  </span>
                  <Badge variant={
                    evt.category === 'Open Day' ? 'success' :
                    evt.category === 'Seminar' ? 'default' :
                    evt.category === 'Hackathon' ? 'warning' : 'warning'
                  } className="rounded-full text-[9px] px-2.5 font-bold uppercase shrink-0">
                    {evt.category}
                  </Badge>
                </div>

                <h3 className="font-sans font-extrabold text-base text-ink mb-2 leading-snug line-clamp-2 hover:text-[#ff705d] transition-colors">
                  {evt.title}
                </h3>

                <p className="font-sans text-xs text-stone-gray line-clamp-3 mb-5 leading-relaxed">
                  {evt.description}
                </p>

                {/* Event details list */}
                <div className="space-y-2.5 pb-5 mb-5 border-b border-dashed border-hairline-mist">
                  <div className="flex items-center gap-2 text-stone-gray font-sans text-xs">
                    <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-gray font-sans text-xs">
                    <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{evt.time} GST</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-gray font-sans text-xs">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>
              </div>

              {/* Sync and tags footer */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {evt.tags.map((tg, i) => (
                    <span key={i} className="font-sans text-[9px] font-semibold bg-stone-50 text-stone-gray border border-stone-100 rounded-md px-2 py-0.5">
                      #{tg}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => handleSync(evt)}
                  disabled={isSynced || isSyncing}
                  variant="primary"
                  className="w-full justify-center gap-1.5 rounded-full py-2 text-[11px] font-bold uppercase transition-all border border-ink bg-white text-ink hover:bg-stone-50"
                >
                  {isSyncing ? (
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                  ) : isSynced ? (
                    <Check className="w-3.5 h-3.5 text-[#8ed462]" />
                  ) : (
                    <CalendarPlus className="w-3.5 h-3.5 text-stone-600" />
                  )}
                  <span>{isSynced ? 'Synced to Calendar' : 'Sync to Calendar'}</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
