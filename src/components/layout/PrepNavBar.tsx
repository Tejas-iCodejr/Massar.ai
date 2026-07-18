import React, { useState } from 'react';
import { Calendar, ShieldAlert, Award, FileText, CheckCircle2, X, ExternalLink, Sparkles, HelpCircle, ArrowUpRight, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Button';

interface ExamDetails {
  id: string;
  name: string;
  fullTitle: string;
  weighting: string;
  requiredFor: string;
  minScore: string;
  description: string;
  testPattern: string;
  strategy: string;
  mockLinks: { label: string; url: string }[];
}

const EXAM_PREPS: Record<string, ExamDetails> = {
  sat: {
    id: 'sat',
    name: 'SAT',
    fullTitle: 'Scholastic Assessment Test (SAT)',
    weighting: 'Admissions Weight: 35% - 50% (Highly critical for selective merit scholarships)',
    requiredFor: 'NYU Abu Dhabi (Highly Recommended), Khalifa University, American University of Sharjah, US/Global Universities.',
    minScore: '1350+ for KU/AUS; 1500+ for competitive NYUAD applications.',
    description: 'Standardized test measuring verbal, mathematical, and writing skills. Essential for matching international equivalent benchmark frameworks.',
    testPattern: 'Digital SAT adaptive structure (Reading & Writing: 54 questions, Math: 44 questions. Total 120 minutes).',
    strategy: 'Focus heavily on algebra, advanced math formulas, and evidence-based analytical reading.',
    mockLinks: [
      { label: 'Official CollegeBoard Practice', url: 'https://satsuite.collegeboard.org/digital/practice-preparation' },
      { label: 'Khan Academy SAT Academy', url: 'https://www.khanacademy.org/SAT' }
    ]
  },
  ielts: {
    id: 'ielts',
    name: 'IELTS',
    fullTitle: 'International English Language Testing System (IELTS)',
    weighting: 'English Proficiency Gatekeeper: Mandatory 100% threshold check (Must be passed to review files)',
    requiredFor: 'All English-medium universities globally, including UAE (UAEU, NYUAD, KU, AUS) and 100% of UK Study Abroad routes.',
    minScore: 'Academic Band 6.0+ (UAEU, KU); Band 6.5+ (AUS); Band 7.5+ (NYUAD/UK top tier).',
    description: 'The world\'s most popular language test for education and migration, evaluating Listening, Reading, Writing, and Speaking.',
    testPattern: 'Paper-based or Computer-delivered Academic format (Listening: 30m, Reading: 60m, Writing: 60m, Speaking: 11-14m).',
    strategy: 'Familiarize with different chart description styles for Writing Task 1 and practice high-speed skimming for Reading.',
    mockLinks: [
      { label: 'British Council IELTS Prep', url: 'https://takeielts.britishcouncil.org/take-ielts/prepare' },
      { label: 'IDP Official Practice Materials', url: 'https://ielts.idp.com/prepare' }
    ]
  },
  cambridge: {
    id: 'cambridge',
    name: 'Cambridge Test',
    fullTitle: 'Cambridge English Qualifications (C1 Advanced / C2 Proficiency)',
    weighting: 'UK Visa & Academic Weight: Mandatory baseline for UK Universities (Oxford, Cambridge, Imperial, etc.)',
    requiredFor: 'UK Study Abroad, elite European universities, and specific private UAE branch institutions.',
    minScore: 'Minimum Score 176+ (equivalent to C1 Advanced grade B/C); 185+ for highly selective programs.',
    description: 'In-depth, high-level credentials showing you have the language skills that employers and universities are actively seeking.',
    testPattern: '4 papers: Reading and Use of English (90 mins), Writing (90 mins), Listening (40 mins), Speaking (15 mins).',
    strategy: 'Perfect your lexical grammar structures, phrasal verbs, and sentence transformation accuracy.',
    mockLinks: [
      { label: 'Cambridge C1 Exam Prep Guides', url: 'https://www.cambridgeenglish.org/exams-and-tests/advanced/preparation/' },
      { label: 'Sample Reading & Speaking Tests', url: 'https://www.cambridgeenglish.org/' }
    ]
  },
  emsat: {
    id: 'emsat',
    name: 'EmSAT',
    fullTitle: 'Emirates Standardized Test (EmSAT Achieve)',
    weighting: 'UAE Public Admission Weight: 40% - 60% of score (Mandatory for UAE Nationals applying to national colleges)',
    requiredFor: 'United Arab Emirates University (UAEU), Khalifa University, Zayed University, and Higher Colleges of Technology (HCT).',
    minScore: 'Math: 1350+; Physics: 1100+; English: 1400+; Arabic: 1000+.',
    description: 'A national system of standardized computer-based tests designed to assess students\' skills and knowledge in the UAE.',
    testPattern: 'Varies by subject. Dynamic adaptive computer testing with multiple choice and drag-drop items.',
    strategy: 'Review national MoE curriculum standards in Mathematics, Physics, Chemistry, and Computer Science.',
    mockLinks: [
      { label: 'UAE Ministry of Education EmSAT Portal', url: 'https://emsat.moe.gov.ae/' },
      { label: 'Official EmSAT Sample Papers', url: 'https://emsat.moe.gov.ae/emsat/EmSAT_Achieve_spec.aspx' }
    ]
  }
};

export function PrepNavBar() {
  const [activeExam, setActiveExam] = useState<ExamDetails | null>(null);

  return (
    <>
      {/* Dynamic Slim Sticky Exam Prep Header */}
      <div className="bg-[#1c1d1a] text-[#f5f1e4] border-b border-stone-800 text-[11px] py-2 px-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-sans font-black uppercase text-[#ff705d] tracking-wider text-[10px]">
              <GraduationCap className="w-3.5 h-3.5" /> Exam Prep Hub:
            </span>
            <span className="text-[#a0a49e] font-sans font-medium hidden sm:inline">
              Required admission tests, weighting structures, and target scores.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-5">
            {Object.values(EXAM_PREPS).map((exam) => (
              <button
                key={exam.id}
                onClick={() => setActiveExam(exam)}
                className="font-mono text-[10px] font-bold text-white hover:text-[#8ed462] flex items-center gap-1 uppercase tracking-wide select-none cursor-pointer transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-[#8ed462] rounded-full animate-pulse" />
                <span>{exam.name}</span>
                <span className="text-[8px] text-[#a0a49e] lowercase font-normal">
                  ({exam.id === 'ielts' || exam.id === 'cambridge' ? 'proficiency' : 'weighted'})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exam Details Modal overlay */}
      {activeExam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 transition-all" onClick={() => setActiveExam(null)}>
          <div 
            className="w-full max-w-2xl bg-white border-2 border-ink rounded-[40px] shadow-xl p-8 relative overflow-hidden animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Visual accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ff705d]/10 rounded-full" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/15 rounded-full text-ink font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff705d]" /> Academic Exam Guide
                </span>
                <h3 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink mt-2">
                  {activeExam.fullTitle}
                </h3>
              </div>
              <button 
                onClick={() => setActiveExam(null)}
                className="w-9 h-9 border border-hairline-mist rounded-full flex items-center justify-center hover:bg-stone-50 text-ink cursor-pointer select-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Highlight weight banner */}
              <div className="p-4 rounded-2xl bg-[#ff705d]/10 border border-[#ff705d]/25 text-xs text-ink flex gap-3 items-start">
                <ShieldAlert className="w-5 h-5 text-[#ff705d] shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans font-bold uppercase tracking-wide text-[10px] text-[#e05442]">WEIGHTING & SIGNIFICANCE</p>
                  <p className="font-sans font-semibold text-xs mt-1 leading-relaxed text-ink/90">
                    {activeExam.weighting}
                  </p>
                </div>
              </div>

              {/* Requirements & Target */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-hairline-mist bg-stone-50 space-y-1.5">
                  <h4 className="font-sans font-extrabold text-[10px] uppercase text-stone-gray tracking-wider">Required For:</h4>
                  <p className="font-sans font-semibold text-xs text-ink leading-relaxed">
                    {activeExam.requiredFor}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#8ed462]/30 bg-[#8ed462]/10 space-y-1.5">
                  <h4 className="font-sans font-extrabold text-[10px] uppercase text-[#4da81b] tracking-wider">Typical Target Score:</h4>
                  <p className="font-sans font-black text-sm text-ink leading-normal">
                    {activeExam.minScore}
                  </p>
                </div>
              </div>

              {/* Description & Pattern */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-xs uppercase text-stone-gray tracking-wide">Exam Description</h4>
                  <p className="font-sans text-xs text-ink leading-relaxed">
                    {activeExam.description}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-xs uppercase text-stone-gray tracking-wide">Test Format & Pattern</h4>
                  <p className="font-sans text-xs text-ink leading-relaxed">
                    {activeExam.testPattern}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-xs uppercase text-stone-gray tracking-wide">Top Scoring Strategy</h4>
                  <p className="font-sans text-xs text-ink leading-relaxed italic bg-[#f5f1e4]/60 p-3 rounded-xl border border-dashed border-hairline-mist">
                    " {activeExam.strategy} "
                  </p>
                </div>
              </div>

              {/* Official Study links */}
              <div className="space-y-2.5 pt-4 border-t border-hairline-mist">
                <div className="font-sans text-[10px] font-bold uppercase text-stone-gray tracking-wider">
                  Verified Practice and Study Links:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeExam.mockLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 bg-white border border-hairline-mist rounded-xl hover:bg-stone-50 hover:border-[#ff705d] group transition-all"
                    >
                      <span className="font-sans font-bold text-xs text-ink group-hover:text-[#ff705d] transition-colors">{link.label}</span>
                      <ArrowUpRight className="w-4 h-4 text-stone-gray group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={() => setActiveExam(null)} className="rounded-full px-6 text-xs uppercase font-bold bg-[#1c1d1a] text-white">
                Close Guide
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
