import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Check, Loader, CalendarPlus, LogIn, LogOut, Info, AlertCircle, Plane, Bed, ShieldCheck, CheckSquare, Square, FileCheck, Landmark, Compass, DollarSign, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  googleSignIn, 
  initAuth, 
  logout, 
  listUpcomingEvents, 
  createCalendarEvent, 
  CalendarEvent 
} from '../lib/calendar';
import { User } from 'firebase/auth';

// Some mock official UAE Academic Deadlines students can sync
const UAE_ACADEMIC_DEADLINES = [
  {
    id: 'uaeu-fall',
    title: 'UAEU Fall 2026 Application Deadline',
    description: 'Final deadline to submit undergraduate applications for United Arab Emirates University (UAEU).',
    date: '2026-08-15',
    time: '23:59',
    university: 'United Arab Emirates University',
    category: 'Admission'
  },
  {
    id: 'ku-intake',
    title: 'Khalifa University Registration Orientation',
    description: 'Mandatory intake orientation program for newly admitted engineering and science students.',
    date: '2026-09-01',
    time: '09:00',
    university: 'Khalifa University',
    category: 'Orientation'
  },
  {
    id: 'nyuad-dead',
    title: 'NYU Abu Dhabi Early Decision I Deadline',
    description: 'Submission deadline for Early Decision I candidates applying to New York University Abu Dhabi.',
    date: '2026-11-01',
    time: '23:59',
    university: 'NYU Abu Dhabi',
    category: 'Admission'
  },
  {
    id: 'aus-spring',
    title: 'American University of Sharjah Spring Intake',
    description: 'Deadline for early admissions applications for the Spring 2027 semester.',
    date: '2026-12-10',
    time: '18:00',
    university: 'American University of Sharjah',
    category: 'Intake'
  }
];

export function Planner() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Tab switcher
  const [activeTab, setActiveTab] = useState<'calendar' | 'relocation'>('calendar');
  
  // Relocation checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('massar_relocation_checklist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      transcripts: false,
      visa: false,
      accommodation: false,
      flights: false,
      medical: false,
      finance: false,
    };
  });

  const toggleChecklistItem = (item: string) => {
    const updated = { ...checklist, [item]: !checklist[item] };
    setChecklist(updated);
    localStorage.setItem('massar_relocation_checklist', JSON.stringify(updated));
  };

  const getChecklistProgress = () => {
    const total = Object.keys(checklist).length;
    const completed = Object.values(checklist).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };
  
  // Calendar data state
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  
  // Custom event form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState('2026-07-18');
  const [formTime, setFormTime] = useState('10:00');
  const [formDuration, setFormDuration] = useState('60'); // minutes
  const [formLoc, setFormLoc] = useState('');
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventSuccessMsg, setEventSuccessMsg] = useState<string | null>(null);

  // Syncing specific UAE university deadlines
  const [syncingDeadlineId, setSyncingDeadlineId] = useState<string | null>(null);
  const [syncedDeadlines, setSyncedDeadlines] = useState<string[]>([]);

  // Observe authentication state
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

  // Fetch upcoming calendar events when token becomes available
  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  const fetchEvents = async () => {
    if (!token) return;
    setLoadingEvents(true);
    setCalendarError(null);
    try {
      const fetched = await listUpcomingEvents(token);
      setEvents(fetched);
    } catch (err: any) {
      console.error(err);
      setCalendarError('Failed to load upcoming events. Your session may have expired.');
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setCalendarError(null);
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
        setCalendarError('Authorization was cancelled by closing the popup.');
      } else {
        console.error('Google Calendar authorization failed:', err);
        setCalendarError('Google Calendar authorization was cancelled or failed.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out and disconnect Google Calendar?')) {
      await logout();
      setUser(null);
      setToken(null);
      setEvents([]);
      setNeedsAuth(true);
    }
  };

  // Create custom study session / task event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formTitle.trim()) return;

    // Prompt user confirmation before writing to their primary Google Calendar
    const confirmMessage = `Add "${formTitle}" on ${formDate} at ${formTime} to your Google Calendar?`;
    if (!window.confirm(confirmMessage)) return;

    setIsCreatingEvent(true);
    setEventSuccessMsg(null);

    try {
      // Calculate start and end ISO datetimes
      const startDateTime = new Date(`${formDate}T${formTime}:00`).toISOString();
      const endDateTime = new Date(new Date(startDateTime).getTime() + parseInt(formDuration) * 60000).toISOString();

      const newEvent: CalendarEvent = {
        summary: formTitle,
        description: formDesc || 'Created via Massar Student Academic Planner.',
        location: formLoc || 'Online / Remote Study Space',
        start: {
          dateTime: startDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      await createCalendarEvent(token, newEvent);
      
      // Reset form & refresh list
      setFormTitle('');
      setFormDesc('');
      setFormLoc('');
      setShowAddForm(false);
      setEventSuccessMsg(`Event "${formTitle}" successfully scheduled in your Google Calendar!`);
      fetchEvents();

      // Clear success notification after 5 seconds
      setTimeout(() => setEventSuccessMsg(null), 6000);
    } catch (err: any) {
      console.error(err);
      alert('Failed to add event. Please make sure your token is valid.');
    } finally {
      setIsCreatingEvent(false);
    }
  };

  // Sync a pre-made UAE Academic Deadline to calendar
  const handleSyncDeadline = async (deadline: typeof UAE_ACADEMIC_DEADLINES[0]) => {
    if (!token) {
      alert('Please connect your Google Calendar first.');
      return;
    }

    // MANDATORY Confirmation step for mutations
    const confirmMessage = `Are you sure you want to add the "${deadline.title}" directly to your Google Calendar?`;
    if (!window.confirm(confirmMessage)) return;

    setSyncingDeadlineId(deadline.id);

    try {
      const startDateTime = new Date(`${deadline.date}T${deadline.time}:00`).toISOString();
      // Assume 1 hour duration
      const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60000).toISOString();

      const newEvent: CalendarEvent = {
        summary: deadline.title,
        description: `${deadline.description}\n\nOrganizer: ${deadline.university}\nSynced via Massar Student Platform.`,
        location: deadline.university,
        start: {
          dateTime: startDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      await createCalendarEvent(token, newEvent);
      setSyncedDeadlines(prev => [...prev, deadline.id]);
      setEventSuccessMsg(`Synced "${deadline.title}" successfully!`);
      fetchEvents();

      setTimeout(() => setEventSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error(err);
      alert('Failed to sync deadline. Your session might have expired.');
    } finally {
      setSyncingDeadlineId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="academic-planner-container">
      {/* Editorial Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-ink font-mono text-[10px] font-bold tracking-wider uppercase mb-3">
          <Calendar className="w-3 h-3 text-[#ff705d]" />
          <span>Massar Planner Hub</span>
        </div>
        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl text-ink tracking-tight leading-tight">
          Admissions & Relocation Planner
        </h1>
        <p className="font-sans text-sm text-stone-gray mt-3 leading-relaxed">
          Unify your college search, intake deadlines, visa filings, travel logistics, and accommodations checklist in a single cohesive workspace.
        </p>
      </div>

      {/* Tab Select Switcher */}
      <div className="max-w-md mx-auto mb-10 p-1.5 bg-stone-100 rounded-[28px] border border-hairline-mist flex gap-1">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 py-3 rounded-[22px] font-sans text-xs uppercase tracking-wider font-bold transition-all select-none cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'calendar'
              ? 'bg-ink text-[#f5f1e4] shadow-sm'
              : 'text-stone-gray hover:text-ink'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Academic Calendar</span>
        </button>
        <button
          onClick={() => setActiveTab('relocation')}
          className={`flex-1 py-3 rounded-[22px] font-sans text-xs uppercase tracking-wider font-bold transition-all select-none cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'relocation'
              ? 'bg-ink text-[#f5f1e4] shadow-sm'
              : 'text-stone-gray hover:text-ink'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Study Abroad Guide</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {eventSuccessMsg && (
        <div className="mb-8 p-4 bg-[#8ed462]/10 border border-[#8ed462]/30 rounded-2xl flex items-center gap-3 animate-bounce">
          <Check className="w-5 h-5 text-[#8ed462] flex-shrink-0" />
          <span className="font-sans text-xs text-ink font-semibold">{eventSuccessMsg}</span>
        </div>
      )}

      {/* Error Banner */}
      {calendarError && (
        <div className="mb-8 p-4 bg-[#ff705d]/10 border border-[#ff705d]/30 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#ff705d] flex-shrink-0" />
          <span className="font-sans text-xs text-ink font-semibold">{calendarError}</span>
        </div>
      )}

      {activeTab === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Connection & Actions Sidebar */}
          <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-white border border-hairline-mist rounded-[30px] flex flex-col justify-between h-full min-h-[300px]">
            <div>
              <h2 className="font-sans font-bold text-lg text-ink mb-2">Google Integration</h2>
              <p className="font-sans text-xs text-stone-gray leading-relaxed mb-6">
                Connect your personal Google account to synchronize university visitation calendars, SAT mock prep timings, and official school intakes directly.
              </p>

              {user ? (
                <div className="space-y-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-10 h-10 rounded-full border border-hairline-mist" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-sans font-bold text-ink">
                        {user.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="font-sans font-bold text-xs text-ink">{user.displayName}</div>
                      <div className="font-mono text-[9px] text-stone-gray">{user.email}</div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#8ed462]/10 text-ink rounded-full font-mono text-[9px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8ed462] animate-pulse" />
                    <span>Calendar Connected</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200 text-center py-6">
                  <p className="font-sans text-xs text-stone-gray mb-3">No account connected currently.</p>
                </div>
              )}
            </div>

            <div className="mt-8">
              {needsAuth ? (
                <Button 
                  onClick={handleLogin} 
                  disabled={isLoggingIn}
                  variant="primary" 
                  className="w-full justify-center gap-2 border border-ink hover:bg-gray-50 rounded-[50px] py-3 text-xs font-bold uppercase transition-all"
                >
                  {isLoggingIn ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span>Connect Google Calendar</span>
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    variant="primary"
                    className="w-full justify-center gap-2 bg-[#8ed462] hover:bg-[#8ed462]/90 border border-transparent rounded-[50px] py-3 text-xs font-bold text-ink uppercase transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Custom Study Task</span>
                  </Button>
                  <Button 
                    onClick={handleLogout} 
                    variant="secondary"
                    className="w-full justify-center gap-2 border border-hairline-mist rounded-[50px] py-3 text-xs font-bold text-stone-gray uppercase hover:bg-stone-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect Account</span>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Calendar Events or Instructions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Custom Event Creator Form */}
          {showAddForm && (
            <Card className="p-6 bg-[#f5f1e4]/40 border border-[#e8e3d5] rounded-[30px] animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-bold text-base text-ink">Schedule Study Task</h3>
                <button onClick={() => setShowAddForm(false)} className="text-stone-gray hover:text-ink text-xs underline font-sans font-medium">
                  Cancel
                </button>
              </div>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block font-sans text-xs font-semibold text-ink mb-1">Task / Event Title</label>
                  <input 
                    type="text" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    placeholder="e.g. UAEU General Admission Essay Draft"
                    className="w-full px-4 py-2.5 bg-white border border-hairline-mist rounded-xl font-sans text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-ink mb-1">Date</label>
                    <input 
                      type="date" 
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-hairline-mist rounded-xl font-sans text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-ink mb-1">Start Time</label>
                    <input 
                      type="time" 
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-hairline-mist rounded-xl font-sans text-xs outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-ink mb-1">Duration (Minutes)</label>
                    <select
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-hairline-mist rounded-xl font-sans text-xs outline-none"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-ink mb-1">Campus / Location</label>
                    <input 
                      type="text" 
                      value={formLoc}
                      onChange={(e) => setFormLoc(e.target.value)}
                      placeholder="e.g. Al Ain Campus / Library"
                      className="w-full px-4 py-2.5 bg-white border border-hairline-mist rounded-xl font-sans text-xs outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-xs font-semibold text-ink mb-1">Description / Notes</label>
                  <textarea 
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Details about program requirements, documents to bring, or checklist..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-white border border-hairline-mist rounded-xl font-sans text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isCreatingEvent}
                  variant="primary" 
                  className="w-full justify-center bg-[#8ed462] hover:bg-[#8ed462]/90 border border-transparent rounded-xl py-2.5 text-xs text-ink font-bold uppercase transition-all"
                >
                  {isCreatingEvent ? <Loader className="w-4 h-4 animate-spin mr-1.5" /> : null}
                  <span>Schedule Event on Google Calendar</span>
                </Button>
              </form>
            </Card>
          )}

          {/* Primary View: Fetch real events */}
          <Card className="p-6 bg-white border border-hairline-mist rounded-[30px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-sans font-extrabold text-xl text-ink">Upcoming Study Tasks</h2>
              {user && (
                <button onClick={fetchEvents} className="text-primary hover:underline text-xs font-sans font-bold flex items-center gap-1">
                  Refresh Calendar
                </button>
              )}
            </div>

            {needsAuth ? (
              <div className="text-center py-12 px-4 border border-dashed border-stone-200 rounded-2xl bg-stone-50/30">
                <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="font-sans font-bold text-sm text-ink mb-1">Connect to View Your Schedule</h3>
                <p className="font-sans text-xs text-stone-gray max-w-sm mx-auto leading-relaxed">
                  Sign in with your Google account to dynamically download, coordinate, and organize your genuine calendar deadlines on this dashboard.
                </p>
                <Button onClick={handleLogin} variant="primary" size="sm" className="mt-4 text-xs font-bold border border-ink hover:bg-gray-50 rounded-full px-6">
                  Connect Google Calendar
                </Button>
              </div>
            ) : loadingEvents ? (
              <div className="text-center py-16">
                <Loader className="w-8 h-8 text-[#8ed462] animate-spin mx-auto mb-3" />
                <p className="font-mono text-[10px] uppercase font-bold tracking-wider text-stone-gray animate-pulse">
                  Querying primary calendar index...
                </p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-stone-200 rounded-2xl bg-stone-50/30">
                <p className="font-sans text-xs text-stone-gray leading-relaxed mb-3">
                  No upcoming events or student tasks found in your next 30 days.
                </p>
                <Button onClick={() => setShowAddForm(true)} variant="primary" size="sm" className="bg-[#8ed462] border border-transparent text-ink hover:bg-[#8ed462]/90 rounded-full text-xs font-bold px-6">
                  Create Academic Event
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((evt) => {
                  const eventDate = evt.start.dateTime 
                    ? new Date(evt.start.dateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
                    : 'All Day';
                  const eventTime = evt.start.dateTime
                    ? new Date(evt.start.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                    : '';

                  return (
                    <div 
                      key={evt.id} 
                      className="p-4 bg-stone-50 hover:bg-stone-100/70 border border-stone-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#8ed462]/10 rounded-xl flex flex-col items-center justify-center text-[#4da81b] flex-shrink-0 mt-0.5">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-sans font-bold text-sm text-ink">{evt.summary}</h4>
                          <p className="font-sans text-xs text-stone-gray mt-0.5 max-w-md line-clamp-1">
                            {evt.description || 'Academic Planning Event'}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 font-sans text-[11px] text-stone-gray">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-stone-400" />
                              <span>{eventDate} {eventTime && `· ${eventTime}`}</span>
                            </span>
                            {evt.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                <span className="line-clamp-1">{evt.location}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {evt.htmlLink && (
                        <a 
                          href={evt.htmlLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          referrerPolicy="no-referrer"
                          className="self-end sm:self-center px-4 py-1.5 bg-white hover:bg-gray-50 border border-hairline-mist rounded-full font-sans font-bold text-[10px] uppercase text-ink flex items-center gap-1 select-none cursor-pointer"
                        >
                          View in Google
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Sync Official UAE University Admission Deadlines */}
          <Card className="p-6 bg-white border border-hairline-mist rounded-[30px]">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 bg-[#ff705d]/10 rounded-xl">
                <CalendarPlus className="w-5 h-5 text-[#ff705d]" />
              </div>
              <div>
                <h2 className="font-sans font-extrabold text-lg text-ink">UAE Universities Official Timetable</h2>
                <p className="font-sans text-xs text-stone-gray mt-0.5">
                  Import official intake deadlines directly into your Google Calendar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {UAE_ACADEMIC_DEADLINES.map((dl) => {
                const isSynced = syncedDeadlines.includes(dl.id);
                const isSyncing = syncingDeadlineId === dl.id;
                
                return (
                  <div 
                    key={dl.id} 
                    className="p-5 border border-hairline-mist bg-[#f5f1e4]/20 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="px-2.5 py-0.5 bg-primary/20 text-ink rounded-full font-mono text-[9px] font-bold">
                          {dl.category}
                        </span>
                        <span className="font-mono text-[10px] text-stone-gray font-bold">
                          {new Date(dl.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="font-sans font-bold text-xs text-ink line-clamp-1 mb-1">{dl.title}</h4>
                      <p className="font-sans text-[11px] text-stone-gray line-clamp-2 leading-relaxed mb-4">
                        {dl.description}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleSyncDeadline(dl)}
                      disabled={isSynced || isSyncing}
                      variant="primary"
                      className="w-full justify-center gap-1.5 border border-ink hover:bg-gray-50 rounded-full py-1.5 text-[10px] font-bold uppercase"
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
                );
              })}
            </div>
          </Card>
        </div>
      </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* Relocation Checklist Card */}
          <Card className="p-8 bg-white border border-hairline-mist rounded-[32px] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#8ed462]/15 border border-[#8ed462]/30 text-ink rounded-full font-mono text-[9px] font-bold uppercase">
                  Relocation Progress
                </span>
                <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-ink flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#8ed462]" /> Study Abroad Milestones
                </h2>
                <p className="font-sans text-xs text-stone-gray max-w-xl">
                  Track your critical pre-departure and post-arrival milestones. Check off items as you secure them to ensure a seamless transition to campus life!
                </p>
              </div>

              {/* Interactive Progress indicator */}
              <div className="flex items-center gap-4 bg-stone-50 p-4 border border-stone-100 rounded-2xl">
                <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded-full border border-hairline-mist font-mono font-black text-xs text-ink">
                  {getChecklistProgress()}%
                </div>
                <div>
                  <p className="font-sans font-extrabold text-[10px] text-stone-gray uppercase tracking-wider">Requirements Met</p>
                  <p className="font-sans font-bold text-xs text-[#4da81b]">
                    {Object.values(checklist).filter(Boolean).length} of {Object.keys(checklist).length} items cleared
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'transcripts', label: 'Equivalency Certificate', desc: 'Attest and verify secondary school transcripts with UAE Ministry of Education.' },
                { key: 'visa', label: 'Student Visa Sponsorship', desc: 'Secure sponsor documents from the registrar or submit outstanding Golden Visa files.' },
                { key: 'accommodation', label: 'Housing Reservation', desc: 'Reserve a dorm room via student portal or secure off-campus accommodation.' },
                { key: 'flights', label: 'Baggage & Flights', desc: 'Book tickets with dedicated 40kg student allowances on Emirates or Etihad.' },
                { key: 'medical', label: 'Medical Fitness Screening', desc: 'Schedule health scans at accredited centers for state residency clearance.' },
                { key: 'finance', label: 'Student Bank Setup', desc: 'Setup your multi-currency account and activate student travel benefits.' }
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => toggleChecklistItem(item.key)}
                  className={`p-4 border rounded-2xl select-none cursor-pointer transition-all flex items-start gap-3.5 ${
                    checklist[item.key]
                      ? 'bg-[#8ed462]/10 border-[#8ed462] text-ink'
                      : 'bg-stone-50 border-stone-100 hover:bg-stone-100 text-stone-gray'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {checklist[item.key] ? (
                      <CheckSquare className="w-5 h-5 text-[#8ed462] fill-[#8ed462]/15" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-300 hover:text-stone-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-ink leading-tight">{item.label}</h4>
                    <p className="font-sans text-[10px] text-stone-gray mt-1 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Detailed Relocation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Visa Info */}
            <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-sm uppercase tracking-wider text-ink">Visa Sponsorship</h3>
                    <p className="font-sans text-[9px] font-bold text-stone-gray uppercase">Academic Entries & Golden Visa</p>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs text-stone-gray leading-relaxed">
                  <p>
                    All overseas students require a sponsored residence visa to study in the UAE. Institutions handle visa sponsorship upon formal acceptance.
                  </p>
                  <ul className="space-y-2 list-disc pl-4 text-[11px]">
                    <li><strong>Required files:</strong> Offer letters, transcripts, passport scans, and recent passport-sized photos.</li>
                    <li><strong>Golden Visa track:</strong> Outstanding graduates with 95%+ high school averages are eligible for self-sponsored 10-year residency cards.</li>
                    <li><strong>Visa Lead Time:</strong> Standard processing ranges from 14 to 21 working days. Submit files early.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-hairline-mist">
                <a
                  href="https://gdrfad.gov.ae/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 border border-hairline-mist hover:border-ink rounded-full font-sans font-bold text-[10px] uppercase text-ink select-none cursor-pointer transition-all"
                >
                  <span>UAE Visa Portal (GDRFA)</span>
                  <ExternalLink className="w-3 h-3 text-stone-gray" />
                </a>
              </div>
            </Card>

            {/* Flying / Arrival */}
            <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#ff705d]/10 border border-[#ff705d]/20 rounded-xl text-[#ff705d]">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-sm uppercase tracking-wider text-ink">Flights & Flying</h3>
                    <p className="font-sans text-[9px] font-bold text-stone-gray uppercase">Student Baggage & Discounts</p>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs text-stone-gray leading-relaxed">
                  <p>
                    The UAE maintains highly efficient airline networks with direct access via Dubai (DXB), Abu Dhabi (AUH), and Sharjah (SHJ).
                  </p>
                  <ul className="space-y-2 list-disc pl-4 text-[11px]">
                    <li><strong>Student Clubs:</strong> Joining the Emirates Student Club or Etihad Student Club unlocks 10% discounts and an extra 10kg checked-luggage allowance.</li>
                    <li><strong>Baggage Allowances:</strong> Verify that your airline ticket supports the standard 40kg student limit before departure.</li>
                    <li><strong>Campus Shuttle:</strong> Coordinate with your designated admissions counselor (listed on university details) to book arrival airport pickups.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-hairline-mist">
                <a
                  href="https://www.emirates.com/ae/english/special-offers/student-special-fares/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 border border-[#ff705d]/30 hover:border-[#ff705d] rounded-full font-sans font-bold text-[10px] uppercase text-ink select-none cursor-pointer transition-all"
                >
                  <span>Emirates Student Club</span>
                  <ExternalLink className="w-3 h-3 text-[#ff705d]" />
                </a>
              </div>
            </Card>

            {/* Stay / Accommodations */}
            <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#8ed462]/10 border border-[#8ed462]/20 rounded-xl text-[#4da81b]">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-sm uppercase tracking-wider text-ink">Dorms & Stay</h3>
                    <p className="font-sans text-[9px] font-bold text-stone-gray uppercase">Campuses & Private Rentals</p>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs text-stone-gray leading-relaxed">
                  <p>
                    Lodging options range from high-spec university residences to shared independent student apartments.
                  </p>
                  <ul className="space-y-2 list-disc pl-4 text-[11px]">
                    <li><strong>Campus Residences:</strong> Extremely convenient for first-year arrivals. UAEU dorms start at AED 4,000/sem. NYUAD provides fully funded fellow housing.</li>
                    <li><strong>Off-Campus Rent:</strong> Studio rentals range from AED 2,500 to 4,500 monthly. Rent is generally lower in Sharjah compared to Abu Dhabi.</li>
                    <li><strong>Facilities:</strong> All verified student lodgings include complimentary high-speed Wi-Fi, laundry facilities, study lounges, and 24/7 safety patrols.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-hairline-mist">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between text-[10px] font-sans">
                  <span className="text-stone-gray font-semibold uppercase">Estimated Monthly Rent:</span>
                  <span className="font-mono font-black text-ink">AED 2,500 - 5,000</span>
                </div>
              </div>
            </Card>

          </div>
        </div>
      )}
    </div>
  );
}
