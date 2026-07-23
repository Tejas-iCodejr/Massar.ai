import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { UniversityLogo } from '../components/ui/UniversityLogo';
import { Button } from '../components/ui/Button';
import { Search, MapPin, DollarSign, Clock, Star, Landmark, Bookmark, CheckCircle, GraduationCap, X, ChevronRight, ChevronLeft, Scale, ArrowUpDown } from 'lucide-react';
import { University } from '../types';
import { cn } from '../lib/utils';
import { CompareDock } from '../components/ui/CompareDock';
import { EquivalencyWizard } from '../components/ui/EquivalencyWizard';
import { NationalVisionMapper } from '../components/ui/NationalVisionMapper';
import { BudgetCalculator } from '../components/ui/BudgetCalculator';
import { Link } from 'react-router-dom';

export function Universities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Public' | 'Private' | 'Branch Campus'>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [savedUnis, setSavedUnis] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [activeDetailUni, setActiveDetailUni] = useState<University | null>(null);

  // Pagination & Sorting States
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'fee-asc' | 'fee-desc' | 'rate-asc' | 'rate-desc'>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch('/api/universities')
      .then(res => res.json())
      .then(data => {
        setUniversities(data);
        setLoading(false);
      });

    // Load saved universities
    try {
      const saved = JSON.parse(localStorage.getItem('saved_universities') || '[]');
      setSavedUnis(saved);
    } catch (e) {
      setSavedUnis([]);
    }
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedLocation]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = [...savedUnis];
    if (updated.includes(id)) {
      updated = updated.filter(item => item !== id);
    } else {
      updated.push(id);
    }
    setSavedUnis(updated);
    localStorage.setItem('saved_universities', JSON.stringify(updated));
  };

  const locations = ['All', ...Array.from(new Set(universities.map(u => u.location)))];

  const filtered = universities.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || u.type === selectedType;
    const matchesLocation = selectedLocation === 'All' || u.location === selectedLocation;

    return matchesSearch && matchesType && matchesLocation;
  });

  // Sort logic
  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    if (sortBy === 'fee-asc') return (a.tuitionFee || 0) - (b.tuitionFee || 0);
    if (sortBy === 'fee-desc') return (b.tuitionFee || 0) - (a.tuitionFee || 0);
    if (sortBy === 'rate-asc') return (a.acceptanceRate || 0) - (b.acceptanceRate || 0);
    if (sortBy === 'rate-desc') return (b.acceptanceRate || 0) - (a.acceptanceRate || 0);
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
            <GraduationCap className="w-4 h-4 text-[#8ed462]" /> Higher Education Directory
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink leading-none">
            Universities <br/>
            <span className="font-serif italic font-normal text-[#ff705d] lowercase tracking-normal">directory</span>
          </h1>
          <p className="font-sans font-medium text-stone-gray max-w-xl mt-3 text-sm leading-relaxed">
            Discover and compare elite public national universities and highly selective private branch campuses in Abu Dhabi, Dubai, and Sharjah.
          </p>
        </div>
        
        {/* Search Block */}
        <div className="relative w-full lg:w-96 flex">
          <input
            type="text"
            placeholder="Search universities..."
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
        
        {/* Type selector */}
        <div className="flex items-center gap-2 border-r border-hairline-mist pr-4">
          <span className="font-sans text-xs text-stone-gray uppercase font-semibold tracking-wider">Type:</span>
          <div className="flex gap-1.5">
            {(['All', 'Public', 'Private', 'Branch Campus'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "px-4 py-1.5 font-sans font-semibold text-xs rounded-[50px] border tracking-wider transition-all select-none cursor-pointer",
                  selectedType === type ? "bg-[#8ed462] text-[#2c2e2a] border-transparent shadow-sm" : "bg-white text-ink border-hairline-mist hover:bg-gray-50"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Region selector */}
        <div className="flex items-center gap-2 border-r border-hairline-mist pr-4">
          <span className="font-sans text-xs text-stone-gray uppercase font-semibold tracking-wider">Region:</span>
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="px-4 py-1.5 bg-white border border-hairline-mist font-sans font-semibold text-xs uppercase tracking-wider focus:outline-none cursor-pointer rounded-[50px] text-ink"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
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
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="fee-asc">Tuition: Low to High</option>
            <option value="fee-desc">Tuition: High to Low</option>
            <option value="rate-asc">Acceptance: Low to High</option>
            <option value="rate-desc">Acceptance: High to Low</option>
          </select>
        </div>

        {/* Saved shortcut pill & Comparison Sandbox Button */}
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {savedUnis.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-[#f5e211]/20 border border-[#f5e211]/40 rounded-[50px] px-4 py-1.5 font-sans text-xs font-semibold uppercase text-ink">
              <Bookmark className="w-3.5 h-3.5 fill-ink text-ink" />
              <span>Saved {savedUnis.length} items</span>
            </div>
          )}
          
          <Link 
            to="/compare" 
            className="inline-flex items-center gap-2 bg-ink text-white hover:bg-[#ff705d] border border-ink hover:border-transparent font-sans font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-[50px] transition-all select-none shadow-sm"
          >
            <Scale className="w-3.5 h-3.5 text-[#ff705d] stroke-[2.5px]" />
            <span>Compare Sandbox</span>
          </Link>
        </div>
      </div>

      {/* Content Render */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <Card key={idx} className="flex flex-col h-full bg-white relative p-8 animate-pulse border border-hairline-mist rounded-[40px]">
              {/* Header Controls */}
              <div className="flex justify-between items-start mb-6 w-full">
                {/* University Logo placeholder */}
                <div className="w-14 h-14 bg-stone-200 rounded-[15px]" />
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-stone-200" />
                  <div className="w-16 h-5 rounded-full bg-stone-200" />
                </div>
              </div>
              
              {/* Name placeholder */}
              <div className="h-6 bg-stone-200 rounded w-3/4 mb-2.5" />
              <div className="h-6 bg-stone-200 rounded w-1/2 mb-4" />
              
              {/* Location placeholder */}
              <div className="flex items-center gap-1.5 mb-6">
                <div className="w-3.5 h-3.5 rounded-full bg-stone-200" />
                <div className="h-3.5 bg-stone-200 rounded w-1/3" />
              </div>
              
              {/* Description placeholder */}
              <div className="space-y-2 mb-6">
                <div className="h-3 bg-stone-200 rounded w-full" />
                <div className="h-3 bg-stone-200 rounded w-5/6" />
              </div>
              
              {/* Stats placeholder */}
              <div className="mt-auto space-y-3 pt-4 border-t border-hairline-mist border-dashed">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 bg-stone-200 rounded w-1/4" />
                  <div className="h-6 bg-stone-200 rounded-[50px] w-1/4" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-3.5 bg-stone-200 rounded w-1/4" />
                  <div className="h-6 bg-stone-200 rounded-[50px] w-1/4" />
                </div>
              </div>
              
              {/* Button placeholder */}
              <div className="h-9 bg-stone-200 rounded-[50px] w-full mt-6" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-hairline-mist bg-white rounded-[40px] p-8">
              <Landmark className="w-12 h-12 text-stone-gray mx-auto mb-4" />
              <h3 className="font-sans font-bold text-2xl uppercase tracking-tight mb-2 text-ink">No Universities Match</h3>
              <p className="font-sans text-stone-gray text-sm max-w-sm mx-auto">
                Adjust your filters or query constraints to locate Middle Eastern institutions.
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map(uni => {
                  const isSaved = savedUnis.includes(uni.id);
                  return (
                    <Card 
                      key={uni.id} 
                      className="group cursor-pointer flex flex-col h-full bg-white relative p-8"
                      onClick={() => setActiveDetailUni(uni)}
                    >
                      {/* Header Controls */}
                      <div className="flex justify-between items-start mb-6 w-full">
                        <UniversityLogo domain={uni.domain} name={uni.name} />
                        
                        <div className="flex items-center gap-2">
                          {/* Compare Toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompareIds(prev => prev.includes(uni.id) ? prev.filter(x => x !== uni.id) : prev.length < 3 ? [...prev, uni.id] : prev);
                            }}
                            className={cn(
                              "w-8 h-8 flex items-center justify-center border border-hairline-mist rounded-full bg-white transition-all hover:bg-gray-50 select-none",
                              compareIds.includes(uni.id) ? "bg-[#8ed462]/30 border-[#8ed462]" : ""
                            )}
                            title={compareIds.includes(uni.id) ? "Remove from Compare" : "Add to Compare"}
                          >
                            <Scale className={cn("w-3.5 h-3.5", compareIds.includes(uni.id) ? "text-ink stroke-[2.5]" : "text-stone-gray")} />
                          </button>

                          {/* Save Item Toggle */}
                          <button
                            onClick={(e) => toggleSave(uni.id, e)}
                            className={cn(
                              "w-8 h-8 flex items-center justify-center border border-hairline-mist rounded-full bg-white transition-all hover:bg-gray-50 select-none",
                              isSaved ? "bg-[#f5e211]/30 border-[#f5e211]" : ""
                            )}
                          >
                            <Bookmark className={cn("w-3.5 h-3.5", isSaved ? "fill-ink text-ink" : "text-stone-gray")} />
                          </button>
                          <Badge variant={uni.type === 'Public' ? 'default' : 'warning'}>{uni.type}</Badge>
                        </div>
                      </div>
                      
                      {/* Main University Typography */}
                      <h2 className="font-sans font-black text-2xl uppercase tracking-tight mb-2 leading-tight group-hover:text-[#ff705d] transition-colors pr-2 text-ink">
                        {uni.name}
                      </h2>
                      
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-gray uppercase mb-4">
                        <MapPin className="w-3.5 h-3.5 text-[#8ed462]" />
                        <span>{uni.location}</span>
                      </div>
                      
                      <p className="font-sans font-medium text-stone-gray text-xs leading-relaxed mb-6 line-clamp-2">
                        {uni.description}
                      </p>
                      
                      {/* Dynamic Stats Grid */}
                      <div className="mt-auto space-y-3 pt-4 border-t border-hairline-mist border-dashed">
                        
                        <div className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-1.5 text-stone-gray uppercase"><DollarSign className="w-3.5 h-3.5 text-[#8ed462]" /> Tuition / Yr</span>
                          <span className="font-sans font-bold bg-[#f5f1e4] px-3 py-1 rounded-full text-ink text-[11px] border border-hairline-mist">
                            AED {uni.tuitionFee?.toLocaleString() || uni.tuitionFee}
                          </span>
                        </div>
                        
                        {uni.acceptanceRate && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-1.5 text-stone-gray uppercase"><Star className="w-3.5 h-3.5 text-[#f5e211]" /> Acceptance</span>
                            <span className="font-sans font-bold bg-[#f5f1e4] px-3 py-1 rounded-full text-ink text-[11px] border border-hairline-mist">
                              {uni.acceptanceRate}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full mt-6 flex items-center justify-center gap-1.5 font-sans font-semibold text-xs rounded-[50px]" asChild>
                        <Link to={`/details/university/${uni.id}`} onClick={(e) => e.stopPropagation()}>
                          Analyze Profile <ChevronRight className="w-3.5 h-3.5" />
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
                    Showing <strong className="text-ink">{indexOfFirstItem + 1}</strong> to <strong className="text-ink">{Math.min(indexOfLastItem, sortedAndFiltered.length)}</strong> of <strong className="text-ink">{sortedAndFiltered.length}</strong> universities
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

      {/* Interactive Student Solution Tools addressing Pain Points */}
      <div className="mt-16 space-y-12">
        <EquivalencyWizard />
        <BudgetCalculator universityName="Selected UAE / GCC Universities" baseTuition={45000} />
        <NationalVisionMapper />
      </div>

      {/* Slide-out Interactive Detail Drawer / Dialog */}
      {activeDetailUni && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm p-4" onClick={() => setActiveDetailUni(null)}>
          <div 
            className="w-full max-w-2xl bg-[#f5f1e4] border border-hairline-mist rounded-[40px] md:rounded-[50px] shadow-sm h-full flex flex-col animate-in slide-in-from-right duration-300 relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Close Control */}
            <div className="p-6 border-b border-hairline-mist flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <UniversityLogo domain={activeDetailUni.domain} name={activeDetailUni.name} />
                <div>
                  <h3 className="font-sans font-black text-xl uppercase tracking-tight leading-none text-ink">{activeDetailUni.name}</h3>
                  <span className="font-mono text-[9px] text-stone-gray uppercase font-semibold mt-1 block">{activeDetailUni.domain}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveDetailUni(null)}
                className="w-10 h-10 border border-hairline-mist rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Content Body */}
            <div className="p-8 overflow-y-auto flex-grow space-y-8">
              
              {/* High Contrast Banner card */}
              <div className="p-6 rounded-[30px] bg-[#8ed462]/20 border border-[#8ed462]/30 relative overflow-hidden">
                <span className="font-mono text-[9px] text-ink font-bold uppercase tracking-wider block mb-1">OFFICIAL ENROLLMENT GUIDE</span>
                <h4 className="font-sans font-black text-xl uppercase tracking-tight leading-none mb-3 text-ink">
                  Admissions Profile
                </h4>
                <p className="font-sans text-xs text-stone-gray leading-relaxed max-w-md">
                  This profile features compiled parameters parsed from direct institution websites. Data changes frequently; use the comparison engine to cross-examine.
                </p>
              </div>

              {/* General Description */}
              <div>
                <h5 className="font-sans font-semibold text-xs text-stone-gray uppercase tracking-wider mb-3">Overview</h5>
                <p className="font-sans text-sm text-ink leading-relaxed bg-white p-6 rounded-[30px] border border-hairline-mist">
                  {activeDetailUni.description}
                </p>
              </div>

              {/* Academic Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 border border-hairline-mist bg-white rounded-[30px]">
                  <div className="font-sans text-xs text-stone-gray font-semibold mb-2">INTAKE SEMESTERS</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activeDetailUni.intakes?.map(intake => (
                      <span key={intake} className="bg-[#8ed462]/10 border border-[#8ed462]/20 text-ink font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                        {intake}
                      </span>
                    )) || <span className="text-xs font-semibold">Fall</span>}
                  </div>
                </div>

                <div className="p-5 border border-hairline-mist bg-white rounded-[30px]">
                  <div className="font-sans text-xs text-stone-gray font-semibold mb-2">CURRICULUM ACCREDITATION</div>
                  <span className="text-[10px] font-sans font-black uppercase text-[#2ba0ff] block mt-1">
                    KHDA & ADEK APPROVED
                  </span>
                </div>
              </div>

              {/* Cost of Attendance Sandbox */}
              <div className="p-6 border border-hairline-mist bg-white rounded-[30px] relative">
                <h5 className="font-sans text-xs text-stone-gray font-bold tracking-wider mb-4">COST CALCULATOR</h5>
                <div className="space-y-3 font-semibold text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs">
                    <span className="text-stone-gray">Base Tuition Fee (Annual)</span>
                    <span className="font-mono text-ink">AED {activeDetailUni.tuitionFee?.toLocaleString() || activeDetailUni.tuitionFee}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs">
                    <span className="text-stone-gray">Estimated Housing & Living</span>
                    <span className="font-mono text-ink">AED 15,000</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 font-black text-sm text-[#ff705d]">
                    <span>ESTIMATED TOTAL / YEAR</span>
                    <span className="font-mono">AED {((activeDetailUni.tuitionFee as any || 0) + 15000).toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-hairline-mist bg-white flex justify-end gap-3 rounded-b-[40px] md:rounded-b-[50px]">
              <Button variant="outline" size="sm" onClick={() => setActiveDetailUni(null)}>
                Dismiss
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/compare" onClick={() => setActiveDetailUni(null)}>
                  Compare Side-by-Side
                </Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link to={`/details/university/${activeDetailUni.id}`} onClick={() => setActiveDetailUni(null)}>
                  Open Full Profile
                </Link>
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Comparison Sandbox Dock */}
      <CompareDock 
        selectedItems={universities.filter(u => compareIds.includes(u.id))}
        onRemove={(id) => setCompareIds(prev => prev.filter(x => x !== id))}
        onClear={() => setCompareIds([])}
      />

    </div>
  );
}
