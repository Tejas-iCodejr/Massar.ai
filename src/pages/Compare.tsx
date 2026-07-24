import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { UniversityLogo } from '../components/ui/UniversityLogo';
import { Button } from '../components/ui/Button';
import { University } from '../types';
import { Scale, ArrowRight, X, Sparkles, ChevronDown, CheckCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export function Compare() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  // 3 Comparison Slot States
  const [slot1Id, setSlot1Id] = useState<string>('');
  const [slot2Id, setSlot2Id] = useState<string>('');
  const [slot3Id, setSlot3Id] = useState<string>('');

  useEffect(() => {
    fetch('/api/universities')
      .then(res => res.json())
      .then(data => {
        setUniversities(data);
        
        // Initialize from localStorage or defaults
        try {
          const stored = JSON.parse(localStorage.getItem('compare_ids') || '[]');
          if (stored.length > 0) {
            setSlot1Id(stored[0] || data[0]?.id || '');
            setSlot2Id(stored[1] || data[1]?.id || '');
            setSlot3Id(stored[2] || '');
          } else if (data.length >= 2) {
            setSlot1Id(data[0].id);
            setSlot2Id(data[1].id);
            setSlot3Id('');
          }
        } catch (e) {
          if (data.length >= 2) {
            setSlot1Id(data[0].id);
            setSlot2Id(data[1].id);
          }
        }
        setLoading(false);
      });
  }, []);

  // Update local storage when slots change
  useEffect(() => {
    const activeIds = [slot1Id, slot2Id, slot3Id].filter(Boolean);
    localStorage.setItem('compare_ids', JSON.stringify(activeIds));
  }, [slot1Id, slot2Id, slot3Id]);

  // Smart Exclusion Filtering for Dropdowns
  // Slot 1 excludes Slot 2 and Slot 3
  const optionsForSlot1 = universities.filter(u => u.id !== slot2Id && u.id !== slot3Id);
  // Slot 2 excludes Slot 1 and Slot 3
  const optionsForSlot2 = universities.filter(u => u.id !== slot1Id && u.id !== slot3Id);
  // Slot 3 excludes Slot 1 and Slot 2
  const optionsForSlot3 = universities.filter(u => u.id !== slot1Id && u.id !== slot2Id);

  const uni1 = universities.find(u => u.id === slot1Id);
  const uni2 = universities.find(u => u.id === slot2Id);
  const uni3 = universities.find(u => u.id === slot3Id);

  const handleClearSlot = (slotIndex: 1 | 2 | 3) => {
    if (slotIndex === 1) setSlot1Id('');
    if (slotIndex === 2) setSlot2Id('');
    if (slotIndex === 3) setSlot3Id('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid-bg min-h-screen bg-[#f5f1e4]">
      
      {/* Page Header */}
      <div className="mb-10 pb-8 border-b border-hairline-mist flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="font-sans text-xs text-[#8ed462] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#8ed462]" /> Evaluation Sandbox
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink leading-none">
            Side-by-Side <br/>
            <span className="font-serif italic font-normal text-[#ff705d] lowercase tracking-normal">comparator</span>
          </h1>
          <p className="font-sans font-medium text-stone-gray max-w-xl text-sm leading-relaxed mt-3">
            Cross-examine tuition fees, intake periods, acceptance rates, and regional rankings for up to three institutions dynamically.
          </p>
        </div>

        {/* Quick Reset Button */}
        {(slot1Id || slot2Id || slot3Id) && (
          <button
            onClick={() => { setSlot1Id(''); setSlot2Id(''); setSlot3Id(''); }}
            className="text-xs font-mono font-bold text-stone-gray hover:text-[#ff705d] px-4 py-2 bg-white border border-hairline-mist rounded-full shadow-xs transition-colors self-start md:self-auto cursor-pointer"
          >
            Clear All Selections
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-24">
          <div className="inline-block w-8 h-8 border-2 border-[#8ed462] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="font-sans text-sm font-semibold uppercase tracking-wider text-stone-gray animate-pulse">Initializing comparison matrix...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* ================= SLOT 1 COLUMN ================= */}
          <div className="space-y-4">
            <div className="bg-white border-2 border-ink rounded-[24px] p-4 shadow-[3px_3px_0px_#2c2e2a]">
              <label className="font-mono text-[10px] uppercase font-bold text-stone-gray tracking-wider block mb-1.5">
                University 1 Selection
              </label>
              <div className="relative">
                <select
                  value={slot1Id}
                  onChange={e => setSlot1Id(e.target.value)}
                  className="w-full bg-[#f5f1e4]/60 border border-hairline-mist p-3 pr-10 rounded-xl font-sans font-bold text-xs text-ink appearance-none focus:outline-none focus:border-[#2ba0ff] cursor-pointer"
                >
                  <option value="">-- Choose 1st University --</option>
                  {optionsForSlot1.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.location})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-gray absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {uni1 ? (
              <RenderUniversityCard uni={uni1} onRemove={() => handleClearSlot(1)} />
            ) : (
              <RenderEmptySlot slotNumber={1} onSelect={setSlot1Id} options={optionsForSlot1} />
            )}
          </div>

          {/* ================= SLOT 2 COLUMN ================= */}
          <div className="space-y-4">
            <div className="bg-white border-2 border-ink rounded-[24px] p-4 shadow-[3px_3px_0px_#2c2e2a]">
              <label className="font-mono text-[10px] uppercase font-bold text-stone-gray tracking-wider block mb-1.5">
                University 2 Selection
              </label>
              <div className="relative">
                <select
                  value={slot2Id}
                  onChange={e => setSlot2Id(e.target.value)}
                  className="w-full bg-[#f5f1e4]/60 border border-hairline-mist p-3 pr-10 rounded-xl font-sans font-bold text-xs text-ink appearance-none focus:outline-none focus:border-[#2ba0ff] cursor-pointer"
                >
                  <option value="">-- Choose 2nd University --</option>
                  {optionsForSlot2.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.location})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-gray absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {uni2 ? (
              <RenderUniversityCard uni={uni2} onRemove={() => handleClearSlot(2)} />
            ) : (
              <RenderEmptySlot slotNumber={2} onSelect={setSlot2Id} options={optionsForSlot2} />
            )}
          </div>

          {/* ================= SLOT 3 COLUMN ================= */}
          <div className="space-y-4">
            <div className="bg-white border-2 border-ink rounded-[24px] p-4 shadow-[3px_3px_0px_#2c2e2a]">
              <label className="font-mono text-[10px] uppercase font-bold text-stone-gray tracking-wider block mb-1.5">
                University 3 Selection (Optional)
              </label>
              <div className="relative">
                <select
                  value={slot3Id}
                  onChange={e => setSlot3Id(e.target.value)}
                  className="w-full bg-[#f5f1e4]/60 border border-hairline-mist p-3 pr-10 rounded-xl font-sans font-bold text-xs text-ink appearance-none focus:outline-none focus:border-[#2ba0ff] cursor-pointer"
                >
                  <option value="">-- Choose 3rd University --</option>
                  {optionsForSlot3.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.location})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-gray absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {uni3 ? (
              <RenderUniversityCard uni={uni3} onRemove={() => handleClearSlot(3)} />
            ) : (
              <RenderEmptySlot slotNumber={3} onSelect={setSlot3Id} options={optionsForSlot3} />
            )}
          </div>

        </div>
      )}

    </div>
  );
}

// Subcomponent: Active University Comparison Card
function RenderUniversityCard({ uni, onRemove }: { uni: University; onRemove: () => void }) {
  return (
    <Card className="bg-white border-2 border-ink rounded-[32px] p-6 sm:p-8 flex flex-col justify-between h-full shadow-[4px_4px_0px_#2c2e2a] relative overflow-hidden">
      <div>
        <div className="flex justify-between items-start mb-6">
          <UniversityLogo domain={uni.domain} name={uni.name} className="w-14 h-14 rounded-[18px]" />
          <button 
            onClick={onRemove} 
            className="w-8 h-8 border border-hairline-mist rounded-full flex items-center justify-center hover:bg-[#ff705d]/10 hover:text-[#ff705d] transition-colors text-stone-gray cursor-pointer"
            title="Remove from slot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="font-sans font-black text-xl text-ink uppercase tracking-tight leading-tight mb-6 line-clamp-2">
          {uni.name}
        </h3>

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
            <div className="font-mono text-[9px] text-stone-gray uppercase font-bold tracking-widest mb-1">ANNUAL TUITION FEE</div>
            <div className="font-sans font-black text-lg text-[#ff705d]">
              AED {uni.tuitionFee?.toLocaleString() || uni.tuitionFee}
            </div>
          </div>

          <div>
            <div className="font-mono text-[9px] text-stone-gray uppercase font-bold tracking-widest mb-1">ADMISSIONS ACCEPTANCE RATE</div>
            <div className="font-sans font-black text-base text-[#2ba0ff]">
              {uni.acceptanceRate ? `${uni.acceptanceRate}%` : 'N/A'}
            </div>
          </div>

          <div>
            <div className="font-mono text-[9px] text-stone-gray uppercase font-bold tracking-widest mb-1">OFFERED INTAKES</div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {uni.intakes?.map(intake => (
                <span key={intake} className="bg-[#ff705d]/10 border border-[#ff705d]/20 text-ink font-mono text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                  {intake}
                </span>
              )) || <span className="text-xs font-semibold">Fall & Spring</span>}
            </div>
          </div>
        </div>
      </div>

      <Button 
        variant="primary" 
        size="sm" 
        className="mt-8 w-full font-sans font-bold text-xs uppercase flex items-center justify-center gap-1.5 rounded-[50px] py-3.5"
        asChild
      >
        <Link to={`/details/university/${uni.id}`}>
          Learn More <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
    </Card>
  );
}

// Subcomponent: Empty Slot Card Prompt
function RenderEmptySlot({ slotNumber, onSelect, options }: { slotNumber: number; onSelect: (id: string) => void; options: University[] }) {
  return (
    <div className="min-h-[420px] border-2 border-dashed border-hairline-mist rounded-[32px] bg-white/50 p-6 flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-[#2ba0ff]/10 text-[#2ba0ff] flex items-center justify-center font-mono font-bold text-lg">
        #{slotNumber}
      </div>
      <div>
        <h4 className="font-sans font-black text-base uppercase text-ink">
          Empty Comparison Slot
        </h4>
        <p className="font-sans text-xs text-stone-gray mt-1 max-w-xs leading-relaxed">
          Select a university from the dropdown above to calibrate metrics side-by-side.
        </p>
      </div>

      {options.length > 0 && (
        <button
          onClick={() => onSelect(options[0].id)}
          className="text-xs font-sans font-bold text-[#2ba0ff] hover:underline cursor-pointer pt-2"
        >
          + Quick Select {options[0].name}
        </button>
      )}
    </div>
  );
}
