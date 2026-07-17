import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, MapPin, BookOpen, Star, School as SchoolIcon, Filter, Eye, Award } from 'lucide-react';
import { School } from '../types';
import { cn } from '../lib/utils';

export function Schools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmirate, setSelectedEmirate] = useState<'All' | 'Dubai' | 'Abu Dhabi' | 'Sharjah'>('All');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('All');

  useEffect(() => {
    fetch('/api/schools')
      .then(res => res.json())
      .then(data => {
        setSchools(data);
        setLoading(false);
      });
  }, []);

  const curriculums = ['All', ...Array.from(new Set(schools.map(s => s.curriculum)))];

  const filtered = schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.emirate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.curriculum.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmirate = selectedEmirate === 'All' || s.emirate === selectedEmirate;
    const matchesCurriculum = selectedCurriculum === 'All' || s.curriculum === selectedCurriculum;

    return matchesSearch && matchesEmirate && matchesCurriculum;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid-bg min-h-screen bg-[#f5f1e4]">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6 pb-8 border-b border-hairline-mist">
        <div>
          <div className="font-sans text-xs text-[#8ed462] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
            <SchoolIcon className="w-4 h-4 text-[#8ed462]" /> K-12 Institutional Index
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink leading-none">
            K-12 Schools <br/>
            <span className="font-serif italic font-normal text-[#ff705d] lowercase tracking-normal">directory</span>
          </h1>
          <p className="font-sans font-medium text-stone-gray max-w-xl mt-3 text-sm leading-relaxed">
            Discover primary, middle, and secondary schools evaluated by the official KHDA (Dubai) and ADEK (Abu Dhabi) inspection boards.
          </p>
        </div>
        
        {/* Search Block */}
        <div className="relative w-full lg:w-96 flex">
          <input
            type="text"
            placeholder="Search schools..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-hairline-mist p-4 pr-12 font-sans text-sm rounded-[50px] placeholder:text-stone-gray focus:outline-none focus:border-[#8ed462] shadow-sm transition-colors text-ink"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-stone-gray" />
          </div>
        </div>
      </div>

      {/* Grid Filter Blocks */}
      <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b border-hairline-mist">
        
        {/* Emirate filter selector */}
        <div className="flex items-center gap-2 border-r border-hairline-mist pr-4">
          <span className="font-sans text-xs text-stone-gray uppercase font-semibold tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-stone-gray" /> Emirate:
          </span>
          <div className="flex gap-1.5">
            {(['All', 'Dubai', 'Abu Dhabi'] as const).map(emirate => (
              <button
                key={emirate}
                onClick={() => setSelectedEmirate(emirate)}
                className={cn(
                  "px-4 py-1.5 font-sans font-semibold text-xs rounded-[50px] border tracking-wider transition-all select-none cursor-pointer",
                  selectedEmirate === emirate ? "bg-[#2ba0ff] text-white border-transparent shadow-sm" : "bg-white text-ink border-hairline-mist hover:bg-gray-50"
                )}
              >
                {emirate}
              </button>
            ))}
          </div>
        </div>

        {/* Curriculum selector */}
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs text-stone-gray uppercase font-semibold tracking-wider">Curriculum:</span>
          <select
            value={selectedCurriculum}
            onChange={e => setSelectedCurriculum(e.target.value)}
            className="px-4 py-1.5 bg-white border border-hairline-mist font-sans font-semibold text-xs uppercase tracking-wider focus:outline-none cursor-pointer rounded-[50px] text-ink"
          >
            {curriculums.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schools render */}
      {loading ? (
        <div className="text-center py-24">
          <div className="inline-block w-8 h-8 border-2 border-[#8ed462] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="font-sans text-sm font-semibold uppercase tracking-wider text-stone-gray animate-pulse">Syncing institutional records...</div>
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-hairline-mist bg-white rounded-[40px] p-8">
              <SchoolIcon className="w-12 h-12 text-stone-gray mx-auto mb-4" />
              <h3 className="font-sans font-bold text-2xl uppercase tracking-tight mb-2 text-ink">No Schools Found</h3>
              <p className="font-sans text-stone-gray text-sm max-w-sm mx-auto">
                Try widening your filters to view registered private & public academies.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(school => (
                <Card key={school.id} className="group flex flex-col h-full bg-white p-8">
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-[#2c2e2a]/5 border border-hairline-mist rounded-[15px] flex items-center justify-center font-sans font-black text-xl text-ink select-none transition-transform group-hover:rotate-6">
                      {school.name.substring(0, 2).toUpperCase()}
                    </div>
                    
                    <Badge variant={school.rating === 'Outstanding' ? 'success' : 'default'}>
                      {school.rating === 'Outstanding' && <Award className="w-3.5 h-3.5 mr-1" />}
                      {school.rating}
                    </Badge>
                  </div>
                  
                  {/* School Typography */}
                  <h2 className="font-sans font-black text-2xl uppercase tracking-tight mb-2 leading-tight group-hover:text-[#ff705d] transition-colors pr-2 text-ink">
                    {school.name}
                  </h2>
                  
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-gray uppercase mb-6">
                    <MapPin className="w-3.5 h-3.5 text-[#8ed462]" />
                    <span>{school.emirate}, UAE</span>
                  </div>

                  {/* Specification List */}
                  <div className="mt-auto space-y-3 pt-4 border-t border-hairline-mist border-dashed">
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1.5 text-stone-gray font-semibold uppercase">
                        <BookOpen className="w-3.5 h-3.5 text-[#ff705d]" /> Curriculum
                      </span>
                      <span className="font-sans font-bold bg-[#f5f1e4] px-3 py-1 rounded-full text-ink text-[11px] border border-hairline-mist">
                        {school.curriculum}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1.5 text-stone-gray font-semibold uppercase">
                        <Star className="w-3.5 h-3.5 text-[#f5e211]" /> Tuition Range
                      </span>
                      <span className="font-sans font-bold bg-[#f5f1e4] px-3 py-1 rounded-full text-ink text-[11px] border border-hairline-mist">
                        {school.tuitionRange}
                      </span>
                    </div>

                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-6 flex items-center justify-center gap-1.5 font-sans font-semibold text-xs rounded-[50px]">
                    <Eye className="w-3.5 h-3.5" /> Full Inspection Details
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
