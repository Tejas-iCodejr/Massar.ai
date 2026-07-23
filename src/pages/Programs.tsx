import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Calendar, Award, GraduationCap, ArrowUpRight, Cpu, Compass, BookOpen, Sun, ChevronLeft, ChevronRight, ArrowUpDown, Bookmark } from 'lucide-react';
import { UniversityLogo } from '../components/ui/UniversityLogo';
import { Program } from '../types';
import { cn } from '../lib/utils';

import { Link } from 'react-router-dom';



export function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Hackathon' | 'Course' | 'Fellowship' | 'Summer School'>('All');
  const [savedPrograms, setSavedPrograms] = useState<string[]>([]);

  // Sorting and Pagination
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'deadline-asc'>('title-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        setPrograms(data);
        setLoading(false);
      });

    try {
      const saved = JSON.parse(localStorage.getItem('saved_programs') || '[]');
      setSavedPrograms(saved);
    } catch (e) {
      setSavedPrograms([]);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  const toggleSaveProgram = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let updated = [...savedPrograms];
    if (updated.includes(id)) {
      updated = updated.filter(item => item !== id);
    } else {
      updated.push(id);
    }
    setSavedPrograms(updated);
    localStorage.setItem('saved_programs', JSON.stringify(updated));
  };

  const filtered = programs.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.eligibility.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || p.type === selectedType;

    return matchesSearch && matchesType;
  });

  // Sort logic
  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
    if (sortBy === 'deadline-asc') return a.deadline.localeCompare(b.deadline);
    return 0;
  });

  // Pagination slice
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFiltered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid-bg min-h-screen bg-[#f5f1e4]">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6 pb-8 border-b border-hairline-mist">
        <div>
          <div className="font-sans text-xs text-[#8ed462] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#8ed462]" /> Curated Student Launchpad
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink leading-none">
            Global <br/>
            <span className="font-serif italic font-normal text-[#ff705d] lowercase tracking-normal">opportunities</span>
          </h1>
          <p className="font-sans font-medium text-stone-gray max-w-xl mt-3 text-sm leading-relaxed">
            Discover upcoming international hackathons, prestigious summer schools, elite leadership fellowships, and specialized courses designed to build a competitive student portfolio.
          </p>
        </div>
        
        {/* Search Block */}
        <div className="relative w-full lg:w-96 flex">
          <input
            type="text"
            placeholder="Search global opportunities..."
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
      <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b border-[#d5d5d4]">
        
        {/* Category Filter */}
        <div className="flex items-center gap-2 border-r border-[#d5d5d4] pr-4">
          <span className="font-sans text-xs text-stone-gray uppercase font-semibold tracking-wider">Filter:</span>
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Hackathon', 'Course', 'Fellowship', 'Summer School'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "px-4 py-1.5 font-sans font-semibold text-xs rounded-[50px] border tracking-wider transition-all select-none cursor-pointer",
                  selectedType === type ? "bg-[#ff705d] text-white border-transparent shadow-sm" : "bg-white text-ink border-hairline-mist hover:bg-gray-50"
                )}
              >
                {type === 'All' ? 'All Opportunities' : type + 's'}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs text-stone-gray uppercase font-semibold tracking-wider flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-[#ff705d]" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-4 py-1.5 bg-white border border-[#d5d5d4] font-sans font-semibold text-xs uppercase tracking-wider focus:outline-none cursor-pointer rounded-[50px] text-ink"
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="deadline-asc">Deadline (Soonest)</option>
          </select>
        </div>

        {/* Saved opportunities pill */}
        {savedPrograms.length > 0 && (
          <div className="ml-auto inline-flex items-center gap-2 bg-[#f5e211]/20 border border-[#f5e211]/40 rounded-[50px] px-4 py-1.5 font-sans text-xs font-semibold uppercase text-ink">
            <Bookmark className="w-3.5 h-3.5 fill-ink text-ink" />
            <span>Saved {savedPrograms.length} opportunities</span>
          </div>
        )}
      </div>

      {/* Render Opportunities */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, idx) => (
            <Card key={idx} className="bg-white flex flex-col justify-between p-8 animate-pulse border border-hairline-mist rounded-[40px]">
              <div>
                <div className="flex justify-between items-start mb-6">
                  {/* Icon placeholder */}
                  <div className="w-14 h-14 bg-stone-200 rounded-[15px]" />
                  {/* Badge placeholder */}
                  <div className="w-20 h-5 rounded-full bg-stone-200" />
                </div>

                {/* Title placeholder */}
                <div className="h-6 bg-stone-200 rounded w-4/5 mb-2.5" />
                <div className="h-6 bg-stone-200 rounded w-1/2 mb-4" />
                
                {/* Organizer placeholder */}
                <div className="h-3.5 bg-stone-200 rounded w-1/3 mb-6" />

                {/* Specification Section placeholder */}
                <div className="space-y-3.5 p-5 rounded-[24px] border border-hairline-mist bg-[#f5f1e4]/30 relative mb-6">
                  <div className="flex justify-between items-center">
                    <div className="h-3.5 bg-stone-200 rounded w-1/4" />
                    <div className="h-3.5 bg-stone-200 rounded w-1/3" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3.5 bg-stone-200 rounded w-1/4" />
                    <div className="h-3.5 bg-stone-200 rounded w-1/4" />
                  </div>
                </div>
              </div>

              {/* Button placeholder */}
              <div className="h-9 bg-stone-200 rounded-[50px] w-full mt-2" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-hairline-mist bg-white rounded-[40px] p-8">
              <Compass className="w-12 h-12 text-stone-gray mx-auto mb-4" />
              <h3 className="font-sans font-bold text-2xl uppercase tracking-tight mb-2 text-ink">No Opportunities Found</h3>
              <p className="font-sans text-stone-gray text-sm max-w-sm mx-auto">
                No active directories found matching your specific filter query. Try searching dynamically above!
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentItems.map(prog => {
                  const isSaved = savedPrograms.includes(prog.id);
                  return (
                    <Card key={prog.id} className="bg-white flex flex-col justify-between p-8">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <UniversityLogo domain={prog.domain} name={prog.organizer} className="w-14 h-14" />
                          
                          <div className="flex items-center gap-2">
                            {/* Save Program Toggle */}
                            <button
                              onClick={(e) => toggleSaveProgram(prog.id, e)}
                              className={cn(
                                "w-8 h-8 flex items-center justify-center border border-hairline-mist rounded-full bg-white transition-all hover:bg-gray-50 select-none",
                                isSaved ? "bg-[#f5e211]/30 border-[#f5e211]" : ""
                              )}
                            >
                              <Bookmark className={cn("w-3.5 h-3.5", isSaved ? "fill-ink text-ink" : "text-stone-gray")} />
                            </button>
                            
                            <Badge variant={prog.type === 'Hackathon' ? 'default' : prog.type === 'Fellowship' ? 'success' : 'warning'}>
                              {prog.type}
                            </Badge>
                          </div>
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

                      <Button variant="outline" size="sm" className="mt-2 w-full font-sans font-semibold text-xs uppercase flex items-center justify-center gap-1.5 rounded-[50px]" asChild>
                        <Link to={`/details/program/${prog.id}`}>
                          Learn More & Apply <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-6 border-t border-hairline-mist">
                  <span className="font-sans text-xs text-stone-gray font-medium">
                    Showing <strong className="text-ink">{indexOfFirstItem + 1}</strong> to <strong className="text-ink">{Math.min(indexOfLastItem, sortedAndFiltered.length)}</strong> of <strong className="text-ink">{sortedAndFiltered.length}</strong> opportunities
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1}
                      className={cn("px-4 py-2 flex items-center gap-1.5", currentPage === 1 ? "opacity-40 cursor-not-allowed" : "")}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Prev
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-8 h-8 rounded-full font-sans font-bold text-xs border flex items-center justify-center transition-all cursor-pointer",
                            currentPage === page 
                              ? "bg-ink text-white border-transparent shadow-sm" 
                              : "bg-white text-ink border-hairline-mist hover:bg-gray-50"
                          )}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages}
                      className={cn("px-4 py-2 flex items-center gap-1.5", currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "")}
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
