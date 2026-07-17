import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Percent, Gift, Laptop, Coffee, Flame, ArrowUpRight, Check } from 'lucide-react';
import { Perk } from '../types';
import { cn } from '../lib/utils';

export function Perks() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Software' | 'Hardware' | 'Food' | 'Entertainment'>('All');
  const [redeemedId, setRedeemedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/perks')
      .then(res => res.json())
      .then(data => {
        setPerks(data);
        setLoading(false);
      });
  }, []);

  const handleRedeem = (id: string) => {
    setRedeemedId(id);
    setTimeout(() => {
      setRedeemedId(null);
    }, 3000);
  };

  const filtered = perks.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid-bg min-h-screen bg-[#f5f1e4]">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6 pb-8 border-b border-hairline-mist">
        <div>
          <div className="font-sans text-xs text-[#8ed462] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-[#8ed462]" /> Exclusive Middle East Perks
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink leading-none">
            Student Perks <br/>
            <span className="font-serif italic font-normal text-[#ff705d] lowercase tracking-normal">directory</span>
          </h1>
          <p className="font-sans font-medium text-stone-gray max-w-xl mt-3 text-sm leading-relaxed">
            Unlock premium corporate partnerships, software bundles, food vouchers, and electronics reductions tailored specifically for verified students.
          </p>
        </div>
        
        {/* Search Block */}
        <div className="relative w-full lg:w-96 flex">
          <input
            type="text"
            placeholder="Search discounts..."
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
        <span className="font-sans text-xs text-stone-gray uppercase font-semibold tracking-wider">Category:</span>
        <div className="flex gap-1.5 font-sans">
          {(['All', 'Software', 'Hardware', 'Food', 'Entertainment'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-1.5 font-sans font-semibold text-xs rounded-[50px] border tracking-wider transition-all select-none cursor-pointer",
                selectedCategory === cat ? "bg-[#f5e211] text-ink border-transparent shadow-sm" : "bg-white text-ink border-hairline-mist hover:bg-gray-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Render Cards */}
      {loading ? (
        <div className="text-center py-24">
          <div className="inline-block w-8 h-8 border-2 border-[#8ed462] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="font-sans text-sm font-semibold uppercase tracking-wider text-stone-gray animate-pulse">Syncing coupon tables...</div>
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-hairline-mist bg-white rounded-[40px] p-8">
              <Flame className="w-12 h-12 text-stone-gray mx-auto mb-4" />
              <h3 className="font-sans font-bold text-2xl uppercase tracking-tight mb-2 text-ink">No Perks Found</h3>
              <p className="font-sans text-stone-gray text-sm max-w-sm mx-auto">
                No active coupon structures match your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(perk => (
                <Card key={perk.id} className="group flex flex-col justify-between h-full bg-white p-8">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-[#2c2e2a]/5 border border-hairline-mist rounded-[15px] flex items-center justify-center text-ink select-none transition-transform group-hover:rotate-6">
                        {perk.category === 'Software' ? (
                          <Laptop className="w-7 h-7 text-[#2ba0ff]" />
                        ) : perk.category === 'Food' ? (
                          <Coffee className="w-7 h-7 text-[#8ed462]" />
                        ) : (
                          <Gift className="w-7 h-7 text-[#ff705d]" />
                        )}
                      </div>
                      <Badge variant={perk.category === 'Software' ? 'default' : perk.category === 'Food' ? 'success' : 'warning'}>
                        {perk.category}
                      </Badge>
                    </div>

                    <h2 className="font-sans font-black text-2xl uppercase tracking-tight mb-1 leading-tight text-ink">
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
                    {/* Copy Promo Code Sandbox block */}
                    <div className="p-3 border border-dashed border-hairline-mist font-mono text-xs rounded-[12px] bg-[#f5f1e4]/50 flex items-center justify-between text-ink">
                      <span className="text-stone-gray font-bold uppercase text-[10px]">PROMO CODE:</span>
                      <span className="text-[#ff705d] select-all cursor-pointer font-extrabold uppercase bg-white px-2.5 py-1 rounded-[6px] border border-hairline-mist">
                        MASSARSTUDENT
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full font-sans font-semibold text-xs flex items-center justify-center gap-1.5 rounded-[50px]"
                      onClick={() => handleRedeem(perk.id)}
                    >
                      {redeemedId === perk.id ? (
                        <span className="flex items-center gap-1.5 text-[#8ed462]">
                          <Check className="w-4 h-4 text-[#8ed462]" /> Applied Successfully!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          Redeem Perk <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}
