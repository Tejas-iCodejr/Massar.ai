import React, { useState } from 'react';
import { DollarSign, Calculator, Home as HomeIcon, Bus, Utensils, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

interface BudgetCalculatorProps {
  universityName?: string;
  baseTuition?: number;
}

export function BudgetCalculator({ universityName = "Selected Institution", baseTuition = 35000 }: BudgetCalculatorProps) {
  const [tuition, setTuition] = useState<number>(baseTuition);
  const [housingOption, setHousingOption] = useState<'dorm' | 'apartment' | 'family'>('dorm');
  const [transportOption, setTransportOption] = useState<'shuttle' | 'car'>('shuttle');
  const [lifestyleOption, setLifestyleOption] = useState<'standard' | 'premium'>('standard');
  const [currency, setCurrency] = useState<'AED' | 'USD'>('AED');

  const housingCost = housingOption === 'dorm' ? 18000 : housingOption === 'apartment' ? 32000 : 0;
  const transportCost = transportOption === 'shuttle' ? 2400 : 7200;
  const lifestyleCost = lifestyleOption === 'standard' ? 7200 : 14400;

  const totalCostAED = tuition + housingCost + transportCost + lifestyleCost;
  const totalCostUSD = Math.round(totalCostAED / 3.67);
  const monthlyCostAED = Math.round(totalCostAED / 12);

  const displayTotal = currency === 'AED' ? `AED ${totalCostAED.toLocaleString()}` : `$${totalCostUSD.toLocaleString()}`;
  const displayMonthly = currency === 'AED' ? `AED ${monthlyCostAED.toLocaleString()}/mo` : `$${Math.round(totalCostUSD / 12).toLocaleString()}/mo`;

  return (
    <Card className="bg-white border-2 border-ink shadow-[4px_4px_0px_#2c2e2a] rounded-[36px] p-6 sm:p-8 relative overflow-hidden">
      {/* Aesthetic Blobs */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#8ed462]/10 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-hairline-mist">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2ba0ff]/10 rounded-full font-mono text-[10px] font-bold text-[#2ba0ff] uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Cost Calculator</span>
          </div>
          <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-ink">
            Estimated Student Budget
          </h3>
          <p className="font-sans font-medium text-xs text-stone-gray mt-0.5">
            Calibrate expected tuition, housing, and living expenses for {universityName}.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center bg-gray-100 p-1 rounded-full border border-hairline-mist select-none">
          <button
            onClick={() => setCurrency('AED')}
            className={`px-3 py-1 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
              currency === 'AED' ? 'bg-ink text-white shadow-sm' : 'text-stone-gray hover:text-ink'
            }`}
          >
            AED
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
              currency === 'USD' ? 'bg-ink text-white shadow-sm' : 'text-stone-gray hover:text-ink'
            }`}
          >
            USD
          </button>
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Tuition slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-sans font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#ff705d]" /> Annual Tuition Fee
              </label>
              <span className="font-mono text-xs font-bold text-[#ff705d]">
                {currency === 'AED' ? `AED ${tuition.toLocaleString()}` : `$${Math.round(tuition / 3.67).toLocaleString()}`}
              </span>
            </div>
            <input 
              type="range"
              min="10000"
              max="90000"
              step="1000"
              value={tuition}
              onChange={(e) => setTuition(Number(e.target.value))}
              className="w-full accent-[#ff705d] cursor-pointer"
            />
          </div>

          {/* 2. Housing Option Buttons */}
          <div>
            <label className="font-sans font-bold text-xs uppercase tracking-wider text-ink block mb-2 flex items-center gap-1.5">
              <HomeIcon className="w-4 h-4 text-[#2ba0ff]" /> Housing & Residence
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dorm', label: 'Campus Dorm', cost: 18000 },
                { id: 'apartment', label: 'Private Flat', cost: 32000 },
                { id: 'family', label: 'With Family', cost: 0 },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setHousingOption(opt.id as any)}
                  className={`p-3 rounded-2xl border text-left font-sans transition-all cursor-pointer select-none ${
                    housingOption === opt.id
                      ? 'bg-[#2ba0ff]/10 border-[#2ba0ff] text-ink font-bold shadow-xs'
                      : 'bg-stone-50 border-hairline-mist text-stone-gray hover:bg-white'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className="font-mono text-[10px] text-stone-500 mt-1">
                    {opt.cost === 0 ? 'FREE' : `+AED ${(opt.cost/1000).toFixed(0)}k/yr`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Transport & Dining toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans font-bold text-xs uppercase tracking-wider text-ink block mb-2 flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-[#8ed462]" /> Transit Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTransportOption('shuttle')}
                  className={`p-2.5 rounded-xl border text-center font-sans text-xs font-semibold transition-all cursor-pointer ${
                    transportOption === 'shuttle' ? 'bg-[#8ed462]/20 border-[#8ed462] text-ink' : 'bg-stone-50 border-hairline-mist text-stone-gray'
                  }`}
                >
                  Metro / Shuttle
                </button>
                <button
                  onClick={() => setTransportOption('car')}
                  className={`p-2.5 rounded-xl border text-center font-sans text-xs font-semibold transition-all cursor-pointer ${
                    transportOption === 'car' ? 'bg-[#8ed462]/20 border-[#8ed462] text-ink' : 'bg-stone-50 border-hairline-mist text-stone-gray'
                  }`}
                >
                  Personal Car
                </button>
              </div>
            </div>

            <div>
              <label className="font-sans font-bold text-xs uppercase tracking-wider text-ink block mb-2 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-[#f5e211] stroke-ink" /> Daily Dining
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLifestyleOption('standard')}
                  className={`p-2.5 rounded-xl border text-center font-sans text-xs font-semibold transition-all cursor-pointer ${
                    lifestyleOption === 'standard' ? 'bg-[#f5e211]/30 border-[#f5e211] text-ink' : 'bg-stone-50 border-hairline-mist text-stone-gray'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setLifestyleOption('premium')}
                  className={`p-2.5 rounded-xl border text-center font-sans text-xs font-semibold transition-all cursor-pointer ${
                    lifestyleOption === 'premium' ? 'bg-[#f5e211]/30 border-[#f5e211] text-ink' : 'bg-stone-50 border-hairline-mist text-stone-gray'
                  }`}
                >
                  Dining Out
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Summary Card Column */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-ink text-white rounded-[28px] relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff705d]/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-[#8ed462] tracking-widest block mb-2">
              ESTIMATED ANNUAL INVESTMENT
            </span>
            <div className="font-sans font-black text-4xl sm:text-5xl text-white tracking-tight leading-none mb-2">
              {displayTotal}
            </div>
            <div className="font-mono text-xs text-stone-300">
              ≈ {displayMonthly}
            </div>

            {/* Breakdown Stack */}
            <div className="mt-6 space-y-3 pt-4 border-t border-white/15">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-stone-300">Tuition Fee:</span>
                <span className="font-mono font-bold text-white">AED {tuition.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-stone-300">Housing:</span>
                <span className="font-mono font-bold text-[#2ba0ff]">AED {housingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-stone-300">Transit & Shuttle:</span>
                <span className="font-mono font-bold text-[#8ed462]">AED {transportCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-stone-300">Dining & Books:</span>
                <span className="font-mono font-bold text-[#f5e211]">AED {lifestyleCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[10px] font-mono text-stone-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8ed462]" />
            <span>Figures based on UAE Ministry of Higher Education benchmarks.</span>
          </div>
        </div>

      </div>
    </Card>
  );
}
