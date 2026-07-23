import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, FileText, Scale, Lock, HelpCircle, Building2, CheckCircle, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocation } from 'react-router-dom';

export function Legal() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<'privacy' | 'terms' | 'regulatory' | 'faq'>('privacy');

  useEffect(() => {
    if (location.pathname.includes('privacy')) setActiveSection('privacy');
    else if (location.pathname.includes('terms')) setActiveSection('terms');
    else if (location.pathname.includes('regulatory') || location.pathname.includes('khda') || location.pathname.includes('adek')) setActiveSection('regulatory');
    else if (location.pathname.includes('faq')) setActiveSection('faq');
  }, [location.pathname]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid-bg min-h-screen bg-[#f5f1e4]">
      
      {/* Top Header */}
      <div className="mb-12 pb-8 border-b border-hairline-mist">
        <div className="font-sans text-xs text-[#2ba0ff] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-[#2ba0ff]" /> Governance & Legal Compliance
        </div>
        <h1 className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink leading-none">
          Legal & Privacy <br/>
          <span className="font-serif italic font-normal text-[#ff705d] lowercase tracking-normal">policy framework</span>
        </h1>
        <p className="font-sans font-medium text-stone-gray max-w-2xl mt-4 text-sm sm:text-base leading-relaxed">
          Massar platform operates under full legal compliance with United Arab Emirates laws, Federal Decree-Law No. 45/2021 (PDPL), and Middle Eastern educational regulatory guidelines.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-hairline-mist">
        {[
          { id: 'privacy', label: 'Privacy Policy (PDPL)', icon: Lock },
          { id: 'terms', label: 'Terms of Use', icon: FileText },
          { id: 'regulatory', label: 'Regulatory Framework', icon: ShieldCheck },
          { id: 'faq', label: 'Frequently Asked Questions', icon: HelpCircle },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={cn(
                "px-5 py-2.5 rounded-[50px] font-sans font-bold text-xs uppercase tracking-wider transition-all select-none cursor-pointer flex items-center gap-2 border",
                isActive 
                  ? "bg-ink text-white border-ink shadow-md" 
                  : "bg-white text-ink border-hairline-mist hover:bg-gray-50"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#8ed462]" : "text-stone-gray")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Panels */}
      {activeSection === 'privacy' && (
        <Card className="bg-white p-8 border border-hairline-mist rounded-[32px] space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-[#8ed462]" />
            <h2 className="font-sans font-black text-2xl uppercase text-ink">Personal Data Protection Policy (PDPL)</h2>
          </div>
          <p className="font-sans text-xs text-stone-gray font-mono uppercase">Last Updated: Academic Year 2026/2027 • Ref: UAE Federal Decree-Law No. 45/2021</p>
          
          <div className="space-y-4 font-sans text-xs text-stone-gray leading-relaxed border-t border-hairline-mist pt-6">
            <div>
              <h3 className="font-bold text-ink text-sm mb-1 uppercase">1. Scope and Applicability</h3>
              <p>This Privacy Policy outlines how Massar platform collects, uses, and safeguards information when users browse universities, K-12 schools, academic opportunities, and student perks across the Middle East.</p>
            </div>
            <div>
              <h3 className="font-bold text-ink text-sm mb-1 uppercase">2. Local Storage & Client State Security</h3>
              <p>User preferences (saved bookmarks, compare items, search history) are maintained in client-side storage (`localStorage`) on your browser. Massar does not sell or share student usage data with commercial data brokers.</p>
            </div>
            <div>
              <h3 className="font-bold text-ink text-sm mb-1 uppercase">3. Verification & Educational Inquiries</h3>
              <p>When claiming student perks or requesting counselor contacts, verification parameters (`.edu` or `.ae` institutional email addresses) are processed solely to validate student status.</p>
            </div>
          </div>
        </Card>
      )}

      {activeSection === 'terms' && (
        <Card className="bg-white p-8 border border-hairline-mist rounded-[32px] space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#2ba0ff]" />
            <h2 className="font-sans font-black text-2xl uppercase text-ink">Terms & Conditions of Service</h2>
          </div>
          <p className="font-sans text-xs text-stone-gray font-mono uppercase">Ref: UAE Federal Law No. 34/2021 on Cybercrimes & Information Technology</p>
          
          <div className="space-y-4 font-sans text-xs text-stone-gray leading-relaxed border-t border-hairline-mist pt-6">
            <div>
              <h3 className="font-bold text-ink text-sm mb-1 uppercase">1. Directory Information Accuracy</h3>
              <p>Massar aggregates higher education and K-12 institutional metrics from published government releases (CAA, KHDA, ADEK). While we perform strict quality audits, official tuition scales and admission deadlines should be cross-verified directly on institutional portals.</p>
            </div>
            <div>
              <h3 className="font-bold text-ink text-sm mb-1 uppercase">2. Intellectual Property & Media</h3>
              <p>All brand marks, university coats of arms, and official domain logos displayed on Massar are the property of their respective accredited institutions, displayed strictly for educational identification and career guidance purposes.</p>
            </div>
          </div>
        </Card>
      )}

      {activeSection === 'regulatory' && (
        <Card className="bg-white p-8 border border-hairline-mist rounded-[32px] space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#ff705d]" />
            <h2 className="font-sans font-black text-2xl uppercase text-ink">Middle East Regulatory & Quality Standards</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-5 border border-hairline-mist bg-[#f5f1e4]/40 rounded-2xl space-y-2">
              <div className="font-bold text-ink text-sm uppercase">KHDA (Dubai) Guidelines</div>
              <p className="text-xs text-stone-gray leading-relaxed">
                Oversees private schools and university branch campuses in Dubai free zones (DIAC & DKP) under Dubai Cabinet Decrees.
              </p>
            </div>

            <div className="p-5 border border-hairline-mist bg-[#f5f1e4]/40 rounded-2xl space-y-2">
              <div className="font-bold text-ink text-sm uppercase">ADEK (Abu Dhabi) Guidelines</div>
              <p className="text-xs text-stone-gray leading-relaxed">
                Regulates higher education and K-12 education in Abu Dhabi, Al Ain, and Western Region via Irtiqaa Inspection framework.
              </p>
            </div>
          </div>
        </Card>
      )}

      {activeSection === 'faq' && (
        <Card className="bg-white p-8 border border-hairline-mist rounded-[32px] space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-[#f5e211]" />
            <h2 className="font-sans font-black text-2xl uppercase text-ink">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4 font-sans text-xs text-stone-gray leading-relaxed pt-4">
            <div className="p-4 border border-hairline-mist rounded-2xl bg-[#f5f1e4]/30 space-y-1">
              <div className="font-bold text-ink text-sm">How does Massar verify institution accreditation?</div>
              <p>Massar audits university profiles against the UAE Ministry of Education CAA register, KHDA Higher Education directory, and ADEK database.</p>
            </div>
            <div className="p-4 border border-hairline-mist rounded-2xl bg-[#f5f1e4]/30 space-y-1">
              <div className="font-bold text-ink text-sm">Are student perks free to claim?</div>
              <p>Yes. Student perks listed on Massar are official corporate discounts and developer licenses requiring only a valid student email (`.edu` or `.ae`) or student ID card.</p>
            </div>
          </div>
        </Card>
      )}

    </div>
  );
}
