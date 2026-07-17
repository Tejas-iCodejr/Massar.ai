import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Calendar, Award, GraduationCap, ArrowUpRight, Cpu, Compass, BookOpen } from 'lucide-react';
import { Program } from '../types';
import { cn } from '../lib/utils';

export function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Hackathon' | 'Course' | 'Fellowship'>('All');

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        setPrograms(data);
        setLoading(false);
      });
  }, []);

  const filtered = programs.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.eligibility.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || p.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid-bg min-h-screen bg-[#f5f1e4]">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6 pb-8 border-b border-hairline-mist">
        <div>
          <div className="font-sans text-xs text-[#8ed462] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#8ed462]" /> Active Development Portfolios
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink leading-none">
            Programs &<br/>
            <span className="font-serif italic font-normal text-[#ff705d] lowercase tracking-normal">fellowships</span>
          </h1>
          <p className="font-sans font-medium text-stone-gray max-w-xl mt-3 text-sm leading-relaxed">
            Discover local hackathons, specialized courses, and prestigious youth fellowships curated to enhance your portfolio.
          </p>
        </div>
        
        {/* Search Block */}
        <div className="relative w-full lg:w-96 flex">
          <input
            type="text"
            placeholder="Search opportunities..."
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
        <span className="font-sans text-xs text-stone-gray uppercase font-semibold tracking-wider">Filter:</span>
        <div className="flex gap-1.5">
          {(['All', 'Hackathon', 'Course', 'Fellowship'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-4 py-1.5 font-sans font-semibold text-xs rounded-[50px] border tracking-wider transition-all select-none cursor-pointer",
                selectedType === type ? "bg-[#ff705d] text-white border-transparent shadow-sm" : "bg-white text-ink border-hairline-mist hover:bg-gray-50"
              )}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {/* Render Opportunities */}
      {loading ? (
        <div className="text-center py-24">
          <div className="inline-block w-8 h-8 border-2 border-[#8ed462] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="font-sans text-sm font-semibold uppercase tracking-wider text-stone-gray animate-pulse">Syncing opportunity clusters...</div>
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-hairline-mist bg-white rounded-[40px] p-8">
              <Compass className="w-12 h-12 text-stone-gray mx-auto mb-4" />
              <h3 className="font-sans font-bold text-2xl uppercase tracking-tight mb-2 text-ink">No Programs Found</h3>
              <p className="font-sans text-stone-gray text-sm max-w-sm mx-auto">
                No active directories found matching your specific query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map(prog => (
                <Card key={prog.id} className="bg-white flex flex-col justify-between p-8">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-[#2c2e2a]/5 border border-hairline-mist rounded-[15px] flex items-center justify-center text-ink select-none">
                        {prog.type === 'Hackathon' ? (
                          <Cpu className="w-7 h-7 text-[#2ba0ff]" />
                        ) : prog.type === 'Fellowship' ? (
                          <Award className="w-7 h-7 text-[#ff705d]" />
                        ) : (
                          <BookOpen className="w-7 h-7 text-[#8ed462]" />
                        )}
                      </div>
                      <Badge variant={prog.type === 'Hackathon' ? 'default' : prog.type === 'Fellowship' ? 'success' : 'warning'}>
                        {prog.type}
                      </Badge>
                    </div>

                    <h2 className="font-sans font-black text-2xl uppercase tracking-tight mb-2 leading-tight text-ink">
                      {prog.title}
                    </h2>
                    
                    <div className="font-sans text-xs font-semibold text-stone-gray uppercase tracking-wide mb-6">
                      ORGANIZED BY <span className="text-ink underline">{prog.organizer}</span>
                    </div>

                    {/* Specification section */}
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

                  <Button variant="outline" size="sm" className="mt-2 w-full font-sans font-semibold text-xs uppercase flex items-center justify-center gap-1.5 rounded-[50px]">
                    Learn More & Apply <ArrowUpRight className="w-3.5 h-3.5" />
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
