import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { UniversityLogo } from '../components/ui/UniversityLogo';
import { Button } from '../components/ui/Button';
import { University } from '../types';
import { Check, X, Scale, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Compare() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/universities')
      .then(res => res.json())
      .then(data => {
        setUniversities(data);
        if (data.length > 0) {
          setSelectedIds([data[0].id, data[1]?.id].filter(Boolean));
        }
        setLoading(false);
      });
  }, []);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedUnis = selectedIds.map(id => universities.find(u => u.id === id)).filter(Boolean) as University[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid-bg min-h-screen bg-[#f5f1e4]">
      
      {/* Page Header */}
      <div className="mb-12 pb-8 border-b border-hairline-mist">
        <div className="font-sans text-xs text-[#8ed462] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-[#8ed462]" /> Evaluation Sandbox
        </div>
        <h1 className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink leading-none mb-4">
          Side-by-Side <br/>
          <span className="font-serif italic font-normal text-[#ff705d] lowercase tracking-normal">comparator</span>
        </h1>
        <p className="font-sans font-medium text-stone-gray max-w-xl text-sm leading-relaxed">
          Cross-examine tuition, intake periods, acceptance rates, and region specifics for up to three institutions dynamically.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-24">
          <div className="inline-block w-8 h-8 border-2 border-[#8ed462] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="font-sans text-sm font-semibold uppercase tracking-wider text-stone-gray animate-pulse">Initializing sandbox arrays...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Selector Panel Left */}
          <div className="lg:col-span-1 space-y-6">
            <Card variant="default" interactive={false} className="p-6">
              <h3 className="font-sans font-black uppercase text-sm tracking-tight mb-4 border-b border-hairline-mist pb-2 flex justify-between items-center text-ink">
                <span>Select Presets</span>
                <span className="font-mono text-[9px] bg-ink text-white px-2 py-0.5 rounded-[50px] font-bold">MAX 3</span>
              </h3>
              
              <div className="space-y-2">
                {universities.map(uni => {
                  const isSelected = selectedIds.includes(uni.id);
                  return (
                    <div 
                      key={uni.id} 
                      onClick={() => toggleSelection(uni.id)}
                      className={`p-3 border border-hairline-mist rounded-[50px] cursor-pointer flex items-center justify-between font-sans font-bold text-xs tracking-wider transition-all select-none ${isSelected ? 'bg-[#f5e211]/20 border-[#f5e211]/50 text-ink shadow-sm' : 'bg-[#f5f1e4]/50 hover:bg-white text-ink'}`}
                    >
                      <span className="truncate pr-2">{uni.name}</span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 flex-shrink-0 text-ink stroke-[3px]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 flex-shrink-0 text-stone-gray stroke-[3px]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="p-5 border border-[#8ed462]/30 bg-[#8ed462]/10 rounded-[30px] font-sans text-xs font-semibold leading-relaxed text-ink/80 flex gap-2">
              <AlertCircle className="w-4 h-4 text-[#ff705d] flex-shrink-0 mt-0.5" />
              <span>
                To analyze a different set of campuses, click cards on the list to toggle selection. High contrast selections represent active presets.
              </span>
            </div>
          </div>

          {/* Comparison Cards Right */}
          <div className="lg:col-span-3">
            {selectedUnis.length === 0 ? (
              <div className="h-96 border border-dashed border-hairline-mist rounded-[40px] flex flex-col items-center justify-center bg-white/40 p-8 text-center">
                <Scale className="w-12 h-12 text-[#ff705d] mb-4 animate-bounce" />
                <span className="font-sans font-black uppercase text-xl text-ink/75 tracking-tight mb-2">No Campuses Active</span>
                <p className="font-sans text-stone-gray text-xs max-w-xs leading-relaxed">
                  Toggle on universities from the left preset checklist to calibrate side-by-side matrices instantly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {selectedUnis.map(uni => (
                  <Card key={uni.id} className="bg-white flex flex-col h-full justify-between p-8">
                    
                    {/* Header bar of comparison block */}
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <UniversityLogo domain={uni.domain} name={uni.name} className="w-12 h-12 text-xs" />
                        <button 
                          onClick={() => toggleSelection(uni.id)} 
                          className="w-8 h-8 border border-hairline-mist rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-stone-gray"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <h3 className="font-sans font-black text-xl text-ink uppercase tracking-tight leading-tight mb-6 min-h-[48px] line-clamp-2">
                        {uni.name}
                      </h3>
                      
                      {/* Metric lines with dashed dividers */}
                      <div className="space-y-4 pt-4 border-t border-hairline-mist border-dashed">
                        
                        <div>
                          <div className="font-mono text-[9px] text-stone-gray uppercase font-bold tracking-widest mb-1">EMIRATE REGION</div>
                          <div className="font-sans font-bold text-sm text-ink">{uni.location}</div>
                        </div>
                        
                        <div>
                          <div className="font-mono text-[9px] text-stone-gray uppercase font-bold tracking-widest mb-1">CLASSIFICATION</div>
                          <div className="font-sans font-bold text-sm text-ink">{uni.type} University</div>
                        </div>
                        
                        <div>
                          <div className="font-mono text-[9px] text-stone-gray uppercase font-bold tracking-widest mb-1">TUITION COST / YEAR</div>
                          <div className="font-sans font-black text-sm text-[#ff705d]">
                            AED {uni.tuitionFee?.toLocaleString() || uni.tuitionFee}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-mono text-[9px] text-stone-gray uppercase font-bold tracking-widest mb-1">ADMISSIONS RATE</div>
                          <div className="font-sans font-black text-sm text-[#2ba0ff]">
                            {uni.acceptanceRate ? `${uni.acceptanceRate}%` : 'N/A'}
                          </div>
                        </div>

                        <div>
                          <div className="font-mono text-[9px] text-stone-gray uppercase font-bold tracking-widest mb-1">OFFERED INTAKES</div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {uni.intakes?.map(intake => (
                              <span key={intake} className="bg-[#ff705d]/10 border border-[#ff705d]/20 text-ink font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                                {intake}
                              </span>
                            )) || <span className="text-xs font-semibold">Fall</span>}
                          </div>
                        </div>

                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="mt-8 w-full font-sans font-semibold text-xs uppercase flex items-center justify-center gap-1 rounded-[50px]">
                      Learn More <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                    
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
