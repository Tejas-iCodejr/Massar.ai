import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  Award, 
  Globe, 
  HelpCircle,
  Check,
  Building2,
  Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function EquivalencyWizard() {
  const [curriculum, setCurriculum] = useState<string>('IB');
  const [destination, setDestination] = useState<string>('Dubai (KHDA)');
  const [attestationCompleted, setAttestationCompleted] = useState<boolean>(false);
  const [resultShown, setResultShown] = useState<boolean>(false);

  const curriculums = [
    { id: 'IB', label: 'IB Diploma / DP', desc: 'International Baccalaureate' },
    { id: 'British', label: 'British Curriculum (A-Levels / IGCSE)', desc: 'Edexcel / Cambridge' },
    { id: 'American', label: 'American High School Diploma', desc: 'SAT / AP Coursework' },
    { id: 'CBSE', label: 'Indian CBSE / ICSE', desc: 'Grade 12 Senior Secondary' },
    { id: 'National', label: 'UAE / Arab National General Secondary', desc: 'Thanaweya Amma' },
  ];

  const destinations = [
    { id: 'Dubai (KHDA)', label: 'Dubai Institutions (KHDA)', authority: 'KHDA & CAA' },
    { id: 'Abu Dhabi (ADEK)', label: 'Abu Dhabi Institutions (ADEK)', authority: 'ADEK & CAA' },
    { id: 'Federal UAE (CAA)', label: 'UAE Federal Universities (CAA)', authority: 'Ministry of Education (MOE)' },
    { id: 'GCC Regional', label: 'Wider GCC Universities (Saudi / Qatar)', authority: 'GCC Ministry' },
  ];

  return (
    <Card className="bg-white border-2 border-ink shadow-[4px_4px_0px_#2c2e2a] rounded-[36px] p-6 sm:p-8 mb-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#ff705d]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-hairline-mist">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8ed462]/20 rounded-full font-mono text-[10px] font-bold text-ink uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8ed462]" />
            <span>Interactive Middle East Legal & Equivalency Checker</span>
          </div>
          <h3 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink">
            Degree & Certificate Equivalency Wizard
          </h3>
          <p className="font-sans font-medium text-xs text-stone-gray mt-0.5 max-w-xl">
            Check MOE attestation steps, EmSAT requirements, and accreditation validity for your high school certificate before applying to Middle East institutions.
          </p>
        </div>

        <button
          onClick={() => setResultShown(!resultShown)}
          className="px-4 py-2 bg-[#f5f1e4] hover:bg-ink hover:text-white rounded-[50px] font-sans text-xs font-bold uppercase transition-all select-none cursor-pointer border border-hairline-mist flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Calculator</span>
        </button>
      </div>

      {/* Step 1: Curriculum Selection */}
      <div className="space-y-6">
        <div>
          <label className="font-mono text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-3 block">
            1. SELECT YOUR HIGH SCHOOL / QUALIFICATION CURRICULUM
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {curriculums.map((c) => {
              const isSelected = curriculum === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCurriculum(c.id)}
                  className={cn(
                    "p-4 rounded-2xl border text-left font-sans text-xs transition-all cursor-pointer select-none flex items-start justify-between",
                    isSelected 
                      ? "bg-ink text-white border-ink shadow-sm" 
                      : "bg-stone-50 text-ink border-hairline-mist hover:bg-stone-100"
                  )}
                >
                  <div>
                    <div className="font-bold text-sm leading-snug">{c.label}</div>
                    <div className={cn("text-[10px] mt-1 font-mono", isSelected ? "text-[#8ed462]" : "text-stone-500")}>
                      {c.desc}
                    </div>
                  </div>
                  {isSelected && <CheckCircle className="w-4 h-4 text-[#8ed462] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Target Study Destination */}
        <div>
          <label className="font-mono text-[10px] uppercase font-bold text-stone-gray tracking-wider mb-3 block">
            2. SELECT TARGET STUDY DESTINATION / REGULATORY ZONE
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {destinations.map((d) => {
              const isSelected = destination === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDestination(d.id)}
                  className={cn(
                    "p-3.5 rounded-2xl border text-left font-sans text-xs font-bold transition-all cursor-pointer select-none flex items-center justify-between",
                    isSelected 
                      ? "bg-[#2ba0ff] text-white border-[#2ba0ff] shadow-sm" 
                      : "bg-stone-50 text-ink border-hairline-mist hover:bg-stone-100"
                  )}
                >
                  <div>
                    <div>{d.label}</div>
                    <div className={cn("text-[9px] font-mono mt-0.5", isSelected ? "text-white/80" : "text-stone-500")}>
                      Gov: {d.authority}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Attestation Checkbox */}
        <div className="p-4 bg-[#f5f1e4]/50 border border-hairline-mist rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="attestCheck"
              checked={attestationCompleted}
              onChange={(e) => setAttestationCompleted(e.target.checked)}
              className="w-4 h-4 accent-[#ff705d] cursor-pointer rounded"
            />
            <label htmlFor="attestCheck" className="font-sans text-xs font-semibold text-ink cursor-pointer select-none">
              I have initiated / completed eDAS 2.0 Digital MOFA Attestation in my home country
            </label>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#ff705d] uppercase px-2 py-0.5 bg-white rounded border border-[#ff705d]/20 shrink-0">
            {attestationCompleted ? 'Verified Stamp' : 'Pending Stamp'}
          </span>
        </div>

        {/* DYNAMIC EQUIVALENCY RESULTS PANEL */}
        <div className="pt-4 border-t border-hairline-mist">
          <div className="p-6 bg-white border-2 border-ink rounded-[28px] space-y-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-sans font-black text-lg text-ink uppercase tracking-tight">
                <Award className="w-5 h-5 text-[#8ed462]" />
                <span>Equivalency & Admission Requirements Summary</span>
              </div>
              <div className="font-mono text-xs font-bold bg-[#8ed462]/20 text-ink px-3 py-1 rounded-full border border-[#8ed462]/30">
                100% MOE / CAA Compliant
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              
              {/* Requirement 1: Attestation Chain */}
              <div className="p-4 border border-hairline-mist bg-[#f5f1e4]/40 rounded-2xl space-y-2">
                <div className="font-bold text-ink uppercase flex items-center gap-1.5 text-[11px]">
                  <FileText className="w-3.5 h-3.5 text-[#ff705d]" /> 1. Required Attestation Chain
                </div>
                <p className="text-stone-gray text-[11px] leading-relaxed">
                  {curriculum === 'IB' && 'Official IB Diploma Transcript + Legalized MOFA eDAS 2.0 digital QR code attestation required for UAE Ministry of Education equivalency.'}
                  {curriculum === 'British' && 'Minimum 3 IGCSE subjects (Grade A*-C) + 2 A-Level subjects (Grade A*-D). MOFA + British Council stamp required.'}
                  {curriculum === 'American' && 'Grade 10-12 Transcripts + High School Diploma + SAT Reasoning score (min 1050) or 2 AP Coursework certificates.'}
                  {curriculum === 'CBSE' && 'Grade 10 & 12 Board Marksheets (CBSE/ICSE) + Home Ministry Attestation + UAE Embassy stamp.'}
                  {curriculum === 'National' && 'Thanaweya Amma General Secondary Certificate with minimum average percentage cutoff.'}
                </p>
              </div>

              {/* Requirement 2: English & Standardized Competency */}
              <div className="p-4 border border-hairline-mist bg-[#f5f1e4]/40 rounded-2xl space-y-2">
                <div className="font-bold text-ink uppercase flex items-center gap-1.5 text-[11px]">
                  <Globe className="w-3.5 h-3.5 text-[#2ba0ff]" /> 2. English & Competency Cutoffs
                </div>
                <p className="text-stone-gray text-[11px] leading-relaxed">
                  Required: <strong>IELTS Academic (min 6.0)</strong> or <strong>TOEFL iBT (min 79)</strong> or <strong>EmSAT English (min 1400)</strong>. Non-exempt candidates take campus English Placement.
                </p>
              </div>

              {/* Requirement 3: Post-Graduation Career / Visa Legal Status */}
              <div className="p-4 border border-hairline-mist bg-[#f5f1e4]/40 rounded-2xl space-y-2">
                <div className="font-bold text-ink uppercase flex items-center gap-1.5 text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-[#8ed462]" /> 3. Visa & Career Pathway
                </div>
                <p className="text-stone-gray text-[11px] leading-relaxed">
                  Student Visa sponsored by institution or parents. High achievers (GPA ≥ 3.75) qualify for <strong>10-Year UAE Golden Visa</strong> upon graduation under Ministry guidelines.
                </p>
              </div>

            </div>

            <div className="pt-2 flex justify-between items-center text-xs font-sans">
              <span className="text-stone-gray font-semibold">Need official certificate attestation support?</span>
              <a 
                href="/accreditation" 
                className="text-[#ff705d] font-bold hover:underline inline-flex items-center gap-1"
              >
                View Full UAE Accreditation Directives <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </Card>
  );
}
