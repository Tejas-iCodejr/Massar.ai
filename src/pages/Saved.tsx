import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Bookmark, GraduationCap, School as SchoolIcon, BookOpen, Star, 
  Trash2, MapPin, Award, Sun, Cpu, Calendar, Percent, Compass, Coffee, Laptop, Gift 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { University, School, Program, Perk } from '../types';

export function Saved() {
  const [activeTab, setActiveTab] = useState<'universities' | 'schools' | 'programs' | 'perks'>('universities');
  const [loading, setLoading] = useState(true);

  // Raw data from API
  const [universities, setUniversities] = useState<University[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [perks, setPerks] = useState<Perk[]>([]);

  // Saved IDs
  const [savedUniIds, setSavedUniIds] = useState<string[]>([]);
  const [savedSchoolIds, setSavedSchoolIds] = useState<string[]>([]);
  const [savedProgIds, setSavedProgIds] = useState<string[]>([]);
  const [savedPerkIds, setSavedPerkIds] = useState<string[]>([]);

  useEffect(() => {
    // Load IDs from localStorage
    try {
      setSavedUniIds(JSON.parse(localStorage.getItem('saved_universities') || '[]'));
      setSavedSchoolIds(JSON.parse(localStorage.getItem('saved_schools') || '[]'));
      setSavedProgIds(JSON.parse(localStorage.getItem('saved_programs') || '[]'));
      setSavedPerkIds(JSON.parse(localStorage.getItem('saved_perks') || '[]'));
    } catch (e) {
      console.error(e);
    }

    // Fetch all directories
    Promise.all([
      fetch('/api/universities').then(res => res.json()),
      fetch('/api/schools').then(res => res.json()),
      fetch('/api/programs').then(res => res.json()),
      fetch('/api/perks').then(res => res.json())
    ]).then(([uniData, schoolData, progData, perkData]) => {
      setUniversities(uniData);
      setSchools(schoolData);
      setPrograms(progData);
      setPerks(perkData);
      setLoading(false);
    }).catch(err => {
      console.error("Error loading data", err);
      setLoading(false);
    });
  }, []);

  // Filter lists to only saved items
  const savedUniversities = universities.filter(u => savedUniIds.includes(u.id));
  const savedSchools = schools.filter(s => savedSchoolIds.includes(s.id));
  const savedPrograms = programs.filter(p => savedProgIds.includes(p.id));
  const savedPerks = perks.filter(pk => savedPerkIds.includes(pk.id));

  // Handler to unsave a University
  const unsaveUniversity = (id: string) => {
    const updated = savedUniIds.filter(item => item !== id);
    setSavedUniIds(updated);
    localStorage.setItem('saved_universities', JSON.stringify(updated));
  };

  // Handler to unsave a School
  const unsaveSchool = (id: string) => {
    const updated = savedSchoolIds.filter(item => item !== id);
    setSavedSchoolIds(updated);
    localStorage.setItem('saved_schools', JSON.stringify(updated));
  };

  // Handler to unsave an Opportunity
  const unsaveProgram = (id: string) => {
    const updated = savedProgIds.filter(item => item !== id);
    setSavedProgIds(updated);
    localStorage.setItem('saved_programs', JSON.stringify(updated));
  };

  // Handler to unsave a Perk
  const unsavePerk = (id: string) => {
    const updated = savedPerkIds.filter(item => item !== id);
    setSavedPerkIds(updated);
    localStorage.setItem('saved_perks', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-[#f5f1e4]">
      
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-hairline-mist">
        <div className="font-sans text-xs text-[#ff705d] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
          <Bookmark className="w-4 h-4 fill-[#ff705d] text-[#ff705d]" /> Student Desk Control
        </div>
        <h1 className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink leading-none">
          Saved <br/>
          <span className="font-serif italic font-normal text-[#8ed462] lowercase tracking-normal">workspace</span>
        </h1>
        <p className="font-sans font-medium text-stone-gray max-w-xl mt-3 text-sm leading-relaxed">
          Manage your personal selection of universities, schools, opportunities, and corporate perks. Bookmarked records are persisted offline in your secure browser cache.
        </p>
      </div>

      {/* Tabs list with counters */}
      <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-[#d5d5d4]">
        <button
          onClick={() => setActiveTab('universities')}
          className={`px-5 py-2 rounded-[50px] font-sans font-bold text-xs uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'universities' 
              ? 'bg-[#8ed462] text-ink border-transparent shadow-sm' 
              : 'bg-white text-stone-gray border-hairline-mist hover:bg-gray-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Universities ({savedUniversities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schools')}
          className={`px-5 py-2 rounded-[50px] font-sans font-bold text-xs uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'schools' 
              ? 'bg-[#ff705d] text-white border-transparent shadow-sm' 
              : 'bg-white text-stone-gray border-hairline-mist hover:bg-gray-50'
          }`}
        >
          <SchoolIcon className="w-4 h-4" />
          <span>Schools ({savedSchools.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('programs')}
          className={`px-5 py-2 rounded-[50px] font-sans font-bold text-xs uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'programs' 
              ? 'bg-[#2ba0ff] text-white border-transparent shadow-sm' 
              : 'bg-white text-stone-gray border-hairline-mist hover:bg-gray-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Opportunities ({savedPrograms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('perks')}
          className={`px-5 py-2 rounded-[50px] font-sans font-bold text-xs uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
            activeTab === 'perks' 
              ? 'bg-[#f5e211] text-ink border-transparent shadow-sm' 
              : 'bg-white text-stone-gray border-hairline-mist hover:bg-gray-50'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Perks ({savedPerks.length})</span>
        </button>
      </div>

      {/* Render Workspace Content */}
      {loading ? (
        <div className="text-center py-24">
          <div className="inline-block w-8 h-8 border-2 border-[#8ed462] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="font-sans text-sm font-semibold uppercase tracking-wider text-stone-gray animate-pulse">Syncing saved workspace...</div>
        </div>
      ) : (
        <div>
          {/* UNIVERSITIES ACTIVE VIEW */}
          {activeTab === 'universities' && (
            savedUniversities.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-hairline-mist bg-white rounded-[40px] p-8">
                <GraduationCap className="w-12 h-12 text-stone-gray mx-auto mb-4" />
                <h3 className="font-sans font-bold text-2xl uppercase tracking-tight mb-2 text-ink">No Saved Universities</h3>
                <p className="font-sans text-stone-gray text-sm max-w-sm mx-auto mb-6">
                  Bookmark outstanding higher education academic portfolios during your exploration.
                </p>
                <Button variant="outline" size="sm" className="rounded-[50px]" asChild>
                  <Link to="/universities">Browse Universities</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
                {savedUniversities.map(uni => (
                  <Card key={uni.id} className="group flex flex-col h-full bg-white p-8 relative">
                    <button
                      onClick={() => unsaveUniversity(uni.id)}
                      className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center border border-hairline-mist rounded-full bg-white hover:bg-red-50 text-stone-gray hover:text-red-500 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-[#2c2e2a]/5 border border-hairline-mist rounded-[15px] flex items-center justify-center font-sans font-black text-xl text-ink">
                        {uni.name.substring(0, 2).toUpperCase()}
                      </div>
                    </div>

                    <h2 className="font-sans font-black text-2xl uppercase tracking-tight mb-2 leading-tight text-ink pr-8">
                      {uni.name}
                    </h2>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-gray uppercase mb-6">
                      <MapPin className="w-3.5 h-3.5 text-[#8ed462]" />
                      <span>{uni.location}</span>
                    </div>

                    <div className="mt-auto space-y-3 pt-4 border-t border-hairline-mist border-dashed text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-gray font-semibold uppercase">Tuition Fee:</span>
                        <span className="font-mono font-bold text-ink">{uni.fees}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-gray font-semibold uppercase">Acceptance Rate:</span>
                        <span className="font-mono font-bold text-[#ff705d]">{uni.acceptanceRate}</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-6 rounded-[50px]" asChild>
                      <Link to={`/details/university/${uni.id}`}>View University Profile</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            )
          )}

          {/* SCHOOLS ACTIVE VIEW */}
          {activeTab === 'schools' && (
            savedSchools.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-hairline-mist bg-white rounded-[40px] p-8">
                <SchoolIcon className="w-12 h-12 text-stone-gray mx-auto mb-4" />
                <h3 className="font-sans font-bold text-2xl uppercase tracking-tight mb-2 text-ink">No Saved Schools</h3>
                <p className="font-sans text-stone-gray text-sm max-w-sm mx-auto mb-6">
                  Keep track of highly-rated K-12 private and public schools.
                </p>
                <Button variant="outline" size="sm" className="rounded-[50px]" asChild>
                  <Link to="/schools">Browse Schools</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
                {savedSchools.map(school => (
                  <Card key={school.id} className="group flex flex-col h-full bg-white p-8 relative">
                    <button
                      onClick={() => unsaveSchool(school.id)}
                      className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center border border-hairline-mist rounded-full bg-white hover:bg-red-50 text-stone-gray hover:text-red-500 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-[#2c2e2a]/5 border border-hairline-mist rounded-[15px] flex items-center justify-center font-sans font-black text-xl text-ink">
                        {school.name.substring(0, 2).toUpperCase()}
                      </div>
                      <Badge variant={school.rating === 'Outstanding' ? 'success' : 'default'} className="mr-8">
                        {school.rating}
                      </Badge>
                    </div>

                    <h2 className="font-sans font-black text-2xl uppercase tracking-tight mb-2 leading-tight text-ink pr-8">
                      {school.name}
                    </h2>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-gray uppercase mb-6">
                      <MapPin className="w-3.5 h-3.5 text-[#8ed462]" />
                      <span>{school.emirate}, UAE</span>
                    </div>

                    <div className="mt-auto space-y-3 pt-4 border-t border-hairline-mist border-dashed text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-gray font-semibold uppercase">Curriculum:</span>
                        <span className="font-sans font-bold text-ink">{school.curriculum}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-gray font-semibold uppercase">Tuition Range:</span>
                        <span className="font-sans font-bold text-ink">{school.tuitionRange}</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-6 rounded-[50px]" asChild>
                      <Link to={`/details/school/${school.id}`}>Inspection Report</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            )
          )}

          {/* OPPORTUNITIES ACTIVE VIEW */}
          {activeTab === 'programs' && (
            savedPrograms.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-hairline-mist bg-white rounded-[40px] p-8">
                <BookOpen className="w-12 h-12 text-stone-gray mx-auto mb-4" />
                <h3 className="font-sans font-bold text-2xl uppercase tracking-tight mb-2 text-ink">No Saved Opportunities</h3>
                <p className="font-sans text-stone-gray text-sm max-w-sm mx-auto mb-6">
                  Save active student hackathons, fellowships, and research events.
                </p>
                <Button variant="outline" size="sm" className="rounded-[50px]" asChild>
                  <Link to="/programs">Browse Opportunities</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-200">
                {savedPrograms.map(prog => (
                  <Card key={prog.id} className="bg-white flex flex-col justify-between p-8 relative">
                    <button
                      onClick={() => unsaveProgram(prog.id)}
                      className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center border border-hairline-mist rounded-full bg-white hover:bg-red-50 text-stone-gray hover:text-red-500 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-[#2c2e2a]/5 border border-hairline-mist rounded-[15px] flex items-center justify-center text-ink">
                          {prog.type === 'Hackathon' ? (
                            <Cpu className="w-7 h-7 text-[#2ba0ff]" />
                          ) : prog.type === 'Fellowship' ? (
                            <Award className="w-7 h-7 text-[#ff705d]" />
                          ) : prog.type === 'Summer School' ? (
                            <Sun className="w-7 h-7 text-[#ff9f2b]" />
                          ) : (
                            <BookOpen className="w-7 h-7 text-[#8ed462]" />
                          )}
                        </div>
                        <Badge variant={prog.type === 'Hackathon' ? 'default' : prog.type === 'Fellowship' ? 'success' : 'warning'} className="mr-8">
                          {prog.type}
                        </Badge>
                      </div>

                      <h2 className="font-sans font-black text-2xl uppercase tracking-tight mb-2 leading-tight text-ink pr-8">
                        {prog.title}
                      </h2>

                      <div className="font-sans text-xs font-semibold text-stone-gray uppercase tracking-wide mb-6">
                        ORGANIZED BY <span className="text-ink underline">{prog.organizer}</span>
                      </div>

                      <div className="space-y-3.5 p-5 rounded-[24px] border border-hairline-mist bg-[#f5f1e4]/50 relative mb-6">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-gray font-semibold uppercase">Eligibility:</span>
                          <span className="text-ink font-bold uppercase">{prog.eligibility}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-gray font-semibold uppercase flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Closing Date:
                          </span>
                          <span className="font-mono font-bold text-[#ff705d]">{prog.deadline}</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="mt-2 w-full rounded-[50px]" asChild>
                      <Link to={`/details/program/${prog.id}`}>Learn & Apply</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            )
          )}

          {/* PERKS ACTIVE VIEW */}
          {activeTab === 'perks' && (
            savedPerks.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-hairline-mist bg-white rounded-[40px] p-8">
                <Star className="w-12 h-12 text-stone-gray mx-auto mb-4" />
                <h3 className="font-sans font-bold text-2xl uppercase tracking-tight mb-2 text-ink">No Saved Perks</h3>
                <p className="font-sans text-stone-gray text-sm max-w-sm mx-auto mb-6">
                  Collect free student licenses, software packages, hardware reductions, and coupon codes.
                </p>
                <Button variant="outline" size="sm" className="rounded-[50px]" asChild>
                  <Link to="/perks">Browse Perks</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
                {savedPerks.map(perk => (
                  <Card key={perk.id} className="group flex flex-col justify-between h-full bg-white p-8 relative">
                    <button
                      onClick={() => unsavePerk(perk.id)}
                      className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center border border-hairline-mist rounded-full bg-white hover:bg-red-50 text-stone-gray hover:text-red-500 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-[#2c2e2a]/5 border border-hairline-mist rounded-[15px] flex items-center justify-center text-ink transition-transform group-hover:rotate-6">
                          {perk.category === 'Software' ? (
                            <Laptop className="w-7 h-7 text-[#2ba0ff]" />
                          ) : perk.category === 'Food' ? (
                            <Coffee className="w-7 h-7 text-[#8ed462]" />
                          ) : (
                            <Gift className="w-7 h-7 text-[#ff705d]" />
                          )}
                        </div>
                        <Badge variant={perk.category === 'Software' ? 'default' : perk.category === 'Food' ? 'success' : 'warning'} className="mr-8">
                          {perk.category}
                        </Badge>
                      </div>

                      <h2 className="font-sans font-black text-2xl tracking-tight mb-1 leading-tight text-ink pr-8">
                        {perk.title}
                      </h2>

                      <div className="font-sans text-xs font-semibold text-stone-gray uppercase tracking-wide mb-4">
                        PROVIDER: <span className="text-ink underline">{perk.provider}</span>
                      </div>

                      <p className="font-sans font-medium text-stone-gray text-xs leading-relaxed mb-6">
                        {perk.description}
                      </p>
                    </div>

                    <div className="space-y-4 mt-auto">
                      <div className="p-3 border border-hairline-mist font-sans text-xs rounded-[12px] bg-[#f5f1e4]/40 flex items-center justify-between text-ink">
                        <span className="text-stone-gray font-bold uppercase text-[10px]">Access Status:</span>
                        <span className="text-[#8ed462] font-bold text-xs">
                          Verified Student Offer
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full rounded-[50px]" asChild>
                        <Link to={`/details/perk/${perk.id}`}>Details</Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      )}

    </div>
  );
}
