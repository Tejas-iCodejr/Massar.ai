import React, { useState } from 'react';
import { Compass, Sparkles, ArrowRight, Check, RefreshCw, GraduationCap, School, BookOpen, Star, MapPin } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export function PathWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<string>('High School Senior');
  const [goal, setGoal] = useState<string>('Top Accredited University');
  const [region, setRegion] = useState<string>('All UAE');

  const roles = ['High School Senior', 'Undergraduate Student', 'Parent / Guardian', 'Graduate Candidate'];
  const goals = [
    { label: 'Top Accredited University', path: '/universities', icon: GraduationCap, color: 'text-[#ff705d]' },
    { label: 'KHDA Outstanding K-12', path: '/schools', icon: School, color: 'text-[#2ba0ff]' },
    { label: 'Tech Hackathons & Grants', path: '/programs', icon: BookOpen, color: 'text-[#8ed462]' },
    { label: 'Student Software Perks', path: '/perks', icon: Star, color: 'text-[#f5e211]' },
  ];
  const regions = ['All UAE', 'Abu Dhabi', 'Dubai', 'Sharjah', 'Al Ain'];

  const handleFinish = () => {
    const selectedGoalObj = goals.find(g => g.label === goal);
    const targetPath = selectedGoalObj ? selectedGoalObj.path : '/universities';
    navigate(targetPath);
  };

  return (
    <Card className="bg-white border-2 border-ink shadow-[4px_4px_0px_#2c2e2a] rounded-[36px] p-6 sm:p-8 mb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#f5e211]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Wizard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-hairline-mist">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff705d]/10 rounded-full font-mono text-[10px] font-bold text-[#ff705d] uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Decision Wizard</span>
          </div>
          <h3 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink">
            Find Your Educational Path
          </h3>
          <p className="font-sans font-medium text-xs text-stone-gray mt-0.5">
            Step {step} of 3 • Tailor your discovery engine to your current academic goals.
          </p>
        </div>

        {/* Stepper Dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              onClick={() => setStep(s as any)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer border ${
                step === s
                  ? 'bg-ink text-white border-ink scale-110 shadow-sm'
                  : step > s
                  ? 'bg-[#8ed462] text-ink border-[#8ed462]'
                  : 'bg-stone-100 text-stone-400 border-hairline-mist'
              }`}
            >
              {step > s ? <Check className="w-4 h-4 stroke-[3px]" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[160px] flex flex-col justify-center">
        {step === 1 && (
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-3 block">
              STEP 1: SELECT YOUR CURRENT STATUS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setStep(2); }}
                  className={`p-4 rounded-2xl border text-left font-sans text-xs font-bold transition-all cursor-pointer select-none flex items-center justify-between ${
                    role === r
                      ? 'bg-ink text-white border-ink shadow-sm'
                      : 'bg-stone-50 text-ink border-hairline-mist hover:bg-stone-100'
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <Check className="w-4 h-4 text-[#8ed462]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-3 block">
              STEP 2: WHAT IS YOUR PRIMARY FOCUS?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map((g) => {
                const Icon = g.icon;
                const isSelected = goal === g.label;
                return (
                  <button
                    key={g.label}
                    onClick={() => { setGoal(g.label); setStep(3); }}
                    className={`p-4 rounded-2xl border text-left font-sans text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-3 ${
                      isSelected
                        ? 'bg-ink text-white border-ink shadow-sm'
                        : 'bg-stone-50 text-ink border-hairline-mist hover:bg-stone-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#8ed462]' : 'text-stone-600'}`} />
                    </div>
                    <span className="flex-grow">{g.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#8ed462]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-3 block">
              STEP 3: CHOOSE PREFERRED REGION IN GCC / UAE
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setRegion(reg)}
                  className={`p-3.5 rounded-2xl border text-center font-sans text-xs font-bold transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 ${
                    region === reg
                      ? 'bg-[#2ba0ff] text-white border-[#2ba0ff] shadow-sm'
                      : 'bg-stone-50 text-ink border-hairline-mist hover:bg-stone-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{reg}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Controls */}
      <div className="mt-6 pt-4 border-t border-hairline-mist flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono text-[11px] text-stone-gray flex items-center gap-2">
          <span>Configured:</span>
          <span className="bg-stone-100 px-2 py-0.5 rounded text-ink font-bold">{role}</span>
          <span>•</span>
          <span className="bg-stone-100 px-2 py-0.5 rounded text-ink font-bold">{goal}</span>
          <span>•</span>
          <span className="bg-[#2ba0ff]/10 text-[#2ba0ff] px-2 py-0.5 rounded font-bold">{region}</span>
        </div>

        <div className="flex items-center gap-2">
          {step > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep((step - 1) as any)}
              className="rounded-full text-xs font-bold uppercase px-4 cursor-pointer"
            >
              Back
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFinish}
            className="rounded-full text-xs font-bold uppercase px-6 cursor-pointer flex items-center gap-1.5 bg-[#ff705d] text-white hover:bg-[#ff8676]"
          >
            <span>Launch Discovery</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
