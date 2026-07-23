import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, MapPin, BookOpen, Star, School as SchoolIcon, Filter, Eye, Award, ChevronLeft, ChevronRight, ArrowUpDown, Bookmark } from 'lucide-react';
import { UniversityLogo } from '../components/ui/UniversityLogo';
import { School } from '../types';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export function Schools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<'All' | 'UAE' | 'Saudi Arabia' | 'Qatar'>('All');
  const [selectedEmirate, setSelectedEmirate] = useState<string>('All');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('All');
  const [savedSchools, setSavedSchools] = useState<string[]>([]);

  // Sorting and Pagination
  const [sortBy, setSortBy] = useState<'rank-asc' | 'name-asc' | 'name-desc' | 'rating-desc'>('rank-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch('/api/schools')
      .then(res => res.json())
      .then(data => {
        setSchools(data);
        setLoading(false);
      });

    try {
      const saved = JSON.parse(localStorage.getItem('saved_schools') || '[]');
      setSavedSchools(saved);
    } catch (e) {
      setSavedSchools([]);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry, selectedEmirate, selectedCurriculum]);

  const toggleSaveSchool = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let updated = [...savedSchools];
    if (updated.includes(id)) {
      updated = updated.filter(item => item !== id);
    } else {
      updated.push(id);
    }
    setSavedSchools(updated);
    localStorage.setItem('saved_schools', JSON.stringify(updated));
  };

  const curriculums = ['All', ...Array.from(new Set(schools.map(s => s.curriculum)))];
  const countries = ['All', 'UAE', 'Saudi Arabia', 'Qatar'];
  
  // Available cities/emirates based on selected country
  const availableEmirates = ['All', ...Array.from(new Set(
    schools
      .filter(s => selectedCountry === 'All' || s.country === selectedCountry)
      .map(s => s.emirate)
  ))];

  const filtered = schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.emirate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.country && s.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          s.curriculum.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry === 'All' || s.country === selectedCountry;
    const matchesEmirate = selectedEmirate === 'All' || s.emirate === selectedEmirate;
    const matchesCurriculum = selectedCurriculum === 'All' || s.curriculum === selectedCurriculum;

    return matchesSearch && matchesCountry && matchesEmirate && matchesCurriculum;
  });

  const ratingWeights: { [key: string]: number } = {
    'Outstanding': 5,
    'Very Good': 4,
    'Good': 3,
    'Acceptable': 2,
    'Weak': 1
  };

  // Sort logic
  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortBy === 'rank-asc') return (a.ranking || 99) - (b.ranking || 99);
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    if (sortBy === 'rating-desc') {
      const weightA = ratingWeights[a.rating] || 0;
      const weightB = ratingWeights[b.rating] || 0;
      return weightB - weightA;
    }
    return 0;
  });

  // Pagination slice
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFiltered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid-bg min-h-screen bg-[#f5f1e4]">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6 pb-8 border-b border-hairline-mist">
        <div>
          <div className="font-sans text-xs text-[#8ed462] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
            <SchoolIcon className="w-4 h-4 text-[#8ed462]" /> Top 50 Regional K-12 Institutional Index
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink leading-none">
            Top K-12 Schools <br/>
            <span className="font-serif italic font-normal text-[#ff705d] lowercase tracking-normal">UAE • Saudi Arabia • Qatar</span>
          </h1>
          <p className="font-sans font-medium text-stone-gray max-w-xl mt-3 text-sm leading-relaxed">
            Discover top-ranked primary, middle, and secondary schools evaluated by KHDA, ADEK, QNSA, and Ministry Inspection Boards across the Gulf.
          </p>
        </div>
        
        {/* Search Block */}
        <div className="relative w-full lg:w-96 flex">
          <input
            type="text"
            placeholder="Search school name, country, city..."
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
        
        {/* Country filter selector */}
        <div className="flex items-center gap-2 border-r border-hairline-mist pr-4">
          <span className="font-sans text-xs text-stone-gray uppercase font-semibold tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-stone-gray" /> Country:
          </span>
          <div className="flex gap-1.5">
            {countries.map(country => (
              <button
                key={country}
                onClick={() => {
                  setSelectedCountry(country as any);
                  setSelectedEmirate('All');
                }}
                className={cn(
                  "px-4 py-1.5 font-sans font-semibold text-xs rounded-[50px] border tracking-wider transition-all select-none cursor-pointer",
                  selectedCountry === country ? "bg-[#ff705d] text-white border-transparent shadow-sm" : "bg-white text-ink border-hairline-mist hover:bg-gray-50"
                )}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* City / Emirate selector */}
        <div className="flex items-center gap-2 border-r border-hairline-mist pr-4">
          <span className="font-sans text-xs text-stone-gray uppercase font-semibold tracking-wider">City:</span>
          <select
            value={selectedEmirate}
            onChange={e => setSelectedEmirate(e.target.value)}
            className="px-4 py-1.5 bg-white border border-hairline-mist font-sans font-semibold text-xs uppercase tracking-wider focus:outline-none cursor-pointer rounded-[50px] text-ink"
          >
            {availableEmirates.map(em => (
              <option key={em} value={em}>{em}</option>
            ))}
          </select>
        </div>

        {/* Curriculum selector */}
        <div className="flex items-center gap-2 border-r border-hairline-mist pr-4">
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

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs text-stone-gray uppercase font-semibold tracking-wider flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-[#ff705d]" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-4 py-1.5 bg-white border border-hairline-mist font-sans font-semibold text-xs uppercase tracking-wider focus:outline-none cursor-pointer rounded-[50px] text-ink"
          >
            <option value="rank-asc">Ranking (#1 to #50)</option>
            <option value="rating-desc">Rating: Outstanding First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>

        {/* Saved schools pill */}
        {savedSchools.length > 0 && (
          <div className="ml-auto inline-flex items-center gap-2 bg-[#f5e211]/20 border border-[#f5e211]/40 rounded-[50px] px-4 py-1.5 font-sans text-xs font-semibold uppercase text-ink">
            <Bookmark className="w-3.5 h-3.5 fill-ink text-ink" />
            <span>Saved {savedSchools.length} schools</span>
          </div>
        )}
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
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map(school => {
                  const isSaved = savedSchools.includes(school.id);
                  return (
                    <Card key={school.id} className="group flex flex-col h-full bg-white p-8">
                      
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-6">
                        <UniversityLogo domain={school.domain || 'dubaicollege.org'} name={school.name} className="w-14 h-14" />
                        
                        <div className="flex items-center gap-2">
                          {school.ranking && (
                            <span className="font-sans font-extrabold text-[11px] bg-[#ff705d]/10 text-[#ff705d] border border-[#ff705d]/30 px-2.5 py-0.5 rounded-full uppercase tracking-tight">
                              #{school.ranking}
                            </span>
                          )}

                          {/* Save School Toggle */}
                          <button
                            onClick={(e) => toggleSaveSchool(school.id, e)}
                            className={cn(
                              "w-8 h-8 flex items-center justify-center border border-hairline-mist rounded-full bg-white transition-all hover:bg-gray-50 select-none",
                              isSaved ? "bg-[#f5e211]/30 border-[#f5e211]" : ""
                            )}
                          >
                            <Bookmark className={cn("w-3.5 h-3.5", isSaved ? "fill-ink text-ink" : "text-stone-gray")} />
                          </button>
                          
                          <Badge variant={school.rating === 'Outstanding' ? 'success' : 'default'}>
                            {school.rating === 'Outstanding' && <Award className="w-3.5 h-3.5 mr-1" />}
                            {school.rating}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* School Typography */}
                      <h2 className="font-sans font-black text-2xl uppercase tracking-tight mb-2 leading-tight group-hover:text-[#ff705d] transition-colors pr-2 text-ink">
                        {school.name}
                      </h2>
                      
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-gray uppercase mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#8ed462]" />
                        <span>{school.emirate}, {school.country}</span>
                      </div>

                      {school.description && (
                        <p className="font-sans font-medium text-stone-gray text-xs leading-relaxed mb-6 line-clamp-2">
                          {school.description}
                        </p>
                      )}

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
                      
                      <Button variant="outline" size="sm" className="w-full mt-6 flex items-center justify-center gap-1.5 font-sans font-semibold text-xs rounded-[50px]" asChild>
                        <Link to={`/details/school/${school.id}`}>
                          <Eye className="w-3.5 h-3.5" /> Full Inspection Details
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
                    Showing <strong className="text-ink">{indexOfFirstItem + 1}</strong> to <strong className="text-ink">{Math.min(indexOfLastItem, sortedAndFiltered.length)}</strong> of <strong className="text-ink">{sortedAndFiltered.length}</strong> schools
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
