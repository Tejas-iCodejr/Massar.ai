import React, { useEffect, useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { UniversityLogo } from '../components/ui/UniversityLogo';
import { Button } from '../components/ui/Button';
import { University } from '../types';
import { Scale, ArrowRight, X, Sparkles, ChevronDown, Search, Check, AlertCircle } from 'lucide-react';
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

  // Smart Mutual Exclusion Filtering for Dropdowns
  const optionsForSlot1 = universities.filter(u => u.id !== slot2Id && u.id !== slot3Id);
  const optionsForSlot2 = universities.filter(u => u.id !== slot1Id && u.id !== slot3Id);
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
            <SearchableUniversitySelect
              slotLabel="University 1 Selection"
              placeholder="Search & choose 1st University..."
              selectedId={slot1Id}
              options={optionsForSlot1}
              onSelect={setSlot1Id}
            />

            {uni1 ? (
              <RenderUniversityCard uni={uni1} onRemove={() => handleClearSlot(1)} />
            ) : (
              <RenderEmptySlot slotNumber={1} onSelect={setSlot1Id} options={optionsForSlot1} />
            )}
          </div>

          {/* ================= SLOT 2 COLUMN ================= */}
          <div className="space-y-4">
            <SearchableUniversitySelect
              slotLabel="University 2 Selection"
              placeholder="Search & choose 2nd University..."
              selectedId={slot2Id}
              options={optionsForSlot2}
              onSelect={setSlot2Id}
            />

            {uni2 ? (
              <RenderUniversityCard uni={uni2} onRemove={() => handleClearSlot(2)} />
            ) : (
              <RenderEmptySlot slotNumber={2} onSelect={setSlot2Id} options={optionsForSlot2} />
            )}
          </div>

          {/* ================= SLOT 3 COLUMN ================= */}
          <div className="space-y-4">
            <SearchableUniversitySelect
              slotLabel="University 3 Selection (Optional)"
              placeholder="Search & choose 3rd University..."
              selectedId={slot3Id}
              options={optionsForSlot3}
              onSelect={setSlot3Id}
            />

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

// Subcomponent: Custom App-Styled Searchable University Dropdown
function SearchableUniversitySelect({
  slotLabel,
  placeholder,
  selectedId,
  options,
  onSelect
}: {
  slotLabel: string;
  placeholder: string;
  selectedId: string;
  options: University[];
  onSelect: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedUni = options.find(u => u.id === selectedId) || null;

  // Filter options based on search query
  const filteredOptions = options.filter(u => {
    const q = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(q) || 
           u.location.toLowerCase().includes(q) || 
           u.type.toLowerCase().includes(q);
  });

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <label className="font-mono text-[10px] uppercase font-bold text-stone-gray tracking-wider block mb-1.5 pl-1">
        {slotLabel}
      </label>

      {/* Trigger Box - Styled with App UI Aesthetics */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white border-2 border-ink p-3 rounded-[20px] shadow-[3px_3px_0px_#2c2e2a] transition-all cursor-pointer flex items-center justify-between gap-2 select-none",
          isOpen ? "ring-2 ring-[#2ba0ff]/50 border-[#2ba0ff]" : "hover:bg-stone-50"
        )}
      >
        {selectedUni ? (
          <div className="flex items-center gap-3 min-w-0">
            <UniversityLogo domain={selectedUni.domain} name={selectedUni.name} className="w-8 h-8 rounded-xl border border-hairline-mist shrink-0" />
            <div className="min-w-0">
              <div className="font-sans font-black text-xs text-ink truncate">{selectedUni.name}</div>
              <div className="font-mono text-[9px] text-stone-gray truncate">{selectedUni.location} • {selectedUni.type}</div>
            </div>
          </div>
        ) : (
          <span className="font-sans font-bold text-xs text-stone-gray px-1">
            {placeholder}
          </span>
        )}

        <div className="flex items-center gap-1 shrink-0">
          {selectedId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect('');
                setIsOpen(false);
              }}
              className="p-1 text-stone-gray hover:text-[#ff705d] transition-colors rounded-full hover:bg-stone-100"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={cn("w-4 h-4 text-stone-gray transition-transform duration-200", isOpen && "rotate-180 text-[#2ba0ff]")} />
        </div>
      </div>

      {/* Dropdown Menu Overlay with Top Search Bar */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-ink rounded-[24px] shadow-[4px_4px_0px_#2c2e2a] z-40 p-3 space-y-2 max-h-80 flex flex-col overflow-hidden animate-fade-in">
          
          {/* Top Search Bar */}
          <div className="relative shrink-0">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name or emirate region..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#f5f1e4]/70 border border-hairline-mist py-2.5 px-3 pl-9 rounded-xl font-sans font-medium text-xs text-ink placeholder-stone-gray focus:outline-none focus:border-[#2ba0ff] focus:bg-white"
            />
            <Search className="w-4 h-4 text-[#2ba0ff] absolute left-3 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-gray hover:text-ink text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtered Options List */}
          <div className="overflow-y-auto flex-1 space-y-1 pr-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((uni) => {
                const isSelected = uni.id === selectedId;
                return (
                  <div
                    key={uni.id}
                    onClick={() => {
                      onSelect(uni.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group select-none",
                      isSelected 
                        ? "bg-[#2ba0ff]/15 border-[#2ba0ff]/40 text-ink font-bold" 
                        : "bg-white border-transparent hover:bg-[#f5f1e4]/60 hover:border-hairline-mist text-ink"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UniversityLogo domain={uni.domain} name={uni.name} className="w-7 h-7 rounded-lg border border-hairline-mist shrink-0" />
                      <div className="min-w-0">
                        <div className="font-sans font-bold text-xs truncate group-hover:text-[#2ba0ff] transition-colors">{uni.name}</div>
                        <div className="font-mono text-[9px] text-stone-gray truncate">{uni.location}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#2ba0ff] shrink-0 stroke-[3px]" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-stone-gray font-sans text-xs">
                No matching universities found.
              </div>
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
          Search or choose a university from the dropdown above to calibrate metrics side-by-side.
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
