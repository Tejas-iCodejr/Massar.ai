import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  Search, 
  Building2, 
  Scale, 
  FileText, 
  Globe, 
  ExternalLink, 
  HelpCircle, 
  Check, 
  AlertTriangle,
  BookOpen,
  GraduationCap,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface AccreditationItem {
  id: string;
  name: string;
  type: 'University' | 'School' | 'Program';
  location: string;
  authority: 'CAA (UAE Federal)' | 'KHDA (Dubai)' | 'ADEK (Abu Dhabi)' | 'SPEA (Sharjah)' | 'GCC Ministry';
  status: 'Fully Accredited' | 'KHDA Licensed' | 'ADEK Approved' | 'MOE Equivalency';
  international: string[];
  rating?: string;
  details: string;
}

const ACCREDITED_INSTITUTIONS: AccreditationItem[] = [
  {
    id: 'khalifa',
    name: 'Khalifa University of Science and Technology',
    type: 'University',
    location: 'Abu Dhabi, UAE',
    authority: 'CAA (UAE Federal)',
    status: 'Fully Accredited',
    international: ['ABET (Engineering)', 'SACSCOC'],
    details: 'Federal university fully licensed by the UAE Ministry of Education (MOE) and CAA. All engineering and medical programs hold international ABET and WFME recognitions.'
  },
  {
    id: 'aus',
    name: 'American University of Sharjah',
    type: 'University',
    location: 'Sharjah, UAE',
    authority: 'SPEA (Sharjah)',
    status: 'Fully Accredited',
    international: ['ABET', 'AACSB (Business)', 'NAAB (Architecture)', 'MSCHE (USA)'],
    details: 'Licensed by the UAE Ministry of Education CAA and regionally accredited in the USA by MSCHE. Business school holds prestigious AACSB accreditation.'
  },
  {
    id: 'nyuad',
    name: 'New York University Abu Dhabi',
    type: 'University',
    location: 'Abu Dhabi, UAE',
    authority: 'ADEK (Abu Dhabi)',
    status: 'ADEK Approved',
    international: ['MSCHE (USA)', 'ABET'],
    details: 'Degree-granting institution established in partnership with the Emirate of Abu Dhabi under ADEK higher education frameworks and US Middle States Commission.'
  },
  {
    id: 'uaeu',
    name: 'United Arab Emirates University (UAEU)',
    type: 'University',
    location: 'Al Ain, UAE',
    authority: 'CAA (UAE Federal)',
    status: 'Fully Accredited',
    international: ['AACSB', 'ABET', 'WASC'],
    details: 'Flagship national federal university established under UAE Law. Holds CAA degree authorization across all undergraduate and postgraduate faculties.'
  },
  {
    id: 'gems-world',
    name: 'GEMS World Academy',
    type: 'School',
    location: 'Dubai, UAE',
    authority: 'KHDA (Dubai)',
    status: 'KHDA Licensed',
    international: ['IB World School (PYP, MYP, DP, CP)', 'CIS'],
    rating: 'Very Good (KHDA DSIB)',
    details: 'Inspected annually by the Dubai Schools Inspection Bureau (DSIB/KHDA). Authorized IB World School delivering full Continuum curriculum.'
  },
  {
    id: 'dubai-college',
    name: 'Dubai College',
    type: 'School',
    location: 'Dubai, UAE',
    authority: 'KHDA (Dubai)',
    status: 'KHDA Licensed',
    international: ['BSO (British Schools Overseas)', 'COBIS'],
    rating: 'Outstanding (KHDA DSIB)',
    details: 'Top-tier British curriculum secondary school holding KHDA "Outstanding" inspection rating for consecutive academic cycles.'
  },
  {
    id: 'heriot-watt',
    name: 'Heriot-Watt University Dubai',
    type: 'University',
    location: 'Dubai Knowledge Park, UAE',
    authority: 'KHDA (Dubai)',
    status: 'KHDA Licensed',
    international: ['QAA (UK Royal Charter)', 'RIBA', 'CIMA'],
    details: 'Operating under KHDA Higher Education Academic Permit in Dubai. Degrees awarded directly by Heriot-Watt University UK with full global equivalence.'
  },
  {
    id: 'rit-dubai',
    name: 'Rochester Institute of Technology (RIT) Dubai',
    type: 'University',
    location: 'Dubai Silicon Oasis, UAE',
    authority: 'CAA (UAE Federal)',
    status: 'Fully Accredited',
    international: ['AACSB', 'ABET', 'MSCHE'],
    details: 'Dual-accredited by both the UAE CAA and the US Middle States Commission on Higher Education. Engineering & Technology programs ABET certified.'
  }
];

export function Accreditation() {
  const [activeTab, setActiveTab] = useState<'overview' | 'caa' | 'khda' | 'adek' | 'pdpl' | 'verify'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'University' | 'School'>('All');

  const filteredInstitutions = ACCREDITED_INSTITUTIONS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.international.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedFilter === 'All' || item.type === selectedFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid-bg min-h-screen bg-[#f5f1e4]">
      
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6 pb-8 border-b border-hairline-mist">
        <div>
          <div className="font-sans text-xs text-[#ff705d] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#ff705d]" /> Official Middle East Accreditation & Regulatory Policy
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink leading-none">
            Accreditation <br/>
            <span className="font-serif italic font-normal text-[#8ed462] lowercase tracking-normal">& legal compliance</span>
          </h1>
          <p className="font-sans font-medium text-stone-gray max-w-2xl mt-4 text-sm sm:text-base leading-relaxed">
            Massar operates under strict alignment with Middle Eastern educational laws, UAE Ministry of Education (MOE) directives, CAA federal standards, KHDA/ADEK regional inspection frameworks, and GCC statutory policies.
          </p>
        </div>

        {/* Quick Fact Badge */}
        <div className="bg-white border-2 border-ink p-5 rounded-[24px] shadow-sm flex items-center gap-4 shrink-0 max-w-sm">
          <div className="w-12 h-12 bg-[#8ed462]/20 rounded-2xl flex items-center justify-center text-ink shrink-0">
            <Award className="w-6 h-6 text-[#2c2e2a]" />
          </div>
          <div>
            <div className="font-sans font-black text-xs uppercase tracking-wider text-ink">100% Audit Verified</div>
            <div className="font-sans text-xs text-stone-gray font-medium mt-0.5">
              Every university & school profile is cross-verified against CAA & KHDA databases.
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Category Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-hairline-mist overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Framework Overview', icon: Building2 },
          { id: 'caa', label: 'UAE CAA (Federal)', icon: Award },
          { id: 'khda', label: 'Dubai KHDA', icon: ShieldCheck },
          { id: 'adek', label: 'Abu Dhabi ADEK', icon: Scale },
          { id: 'pdpl', label: 'Data Privacy & Legal', icon: Lock },
          { id: 'verify', label: 'Accreditation Checker', icon: Search },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-5 py-2.5 rounded-[50px] font-sans font-bold text-xs uppercase tracking-wider transition-all select-none cursor-pointer flex items-center gap-2 shrink-0 border",
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

      {/* TAB CONTENT SECTIONS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          
          {/* Key Regulatory Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white p-8 border border-hairline-mist rounded-[32px] space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#8ed462]/20 rounded-2xl flex items-center justify-center text-[#2c2e2a]">
                <Award className="w-6 h-6" />
              </div>
              <Badge variant="success">Federal Level</Badge>
              <h3 className="font-sans font-black text-xl uppercase tracking-tight text-ink">
                UAE CAA Accreditation
              </h3>
              <p className="font-sans text-xs text-stone-gray leading-relaxed">
                The Commission for Academic Accreditation (CAA) is the UAE Federal Government’s quality assurance agency for higher education. Massar lists institutions holding active CAA licensure & program accreditation.
              </p>
              <div className="pt-2 text-xs font-bold text-ink flex items-center gap-1">
                <span>MOESR Compliant</span> <CheckCircle className="w-4 h-4 text-[#8ed462]" />
              </div>
            </Card>

            <Card className="bg-white p-8 border border-hairline-mist rounded-[32px] space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#ff705d]/20 rounded-2xl flex items-center justify-center text-[#ff705d]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <Badge variant="warning">Emirate Level</Badge>
              <h3 className="font-sans font-black text-xl uppercase tracking-tight text-ink">
                KHDA & ADEK Quality Ratings
              </h3>
              <p className="font-sans text-xs text-stone-gray leading-relaxed">
                Regional regulatory authorities in Dubai (KHDA) and Abu Dhabi (ADEK) conduct annual DSIB and Irtiqaa inspection cycles, evaluating teaching quality, governance, and campus safety.
              </p>
              <div className="pt-2 text-xs font-bold text-ink flex items-center gap-1">
                <span>DSIB Ratings Grounded</span> <CheckCircle className="w-4 h-4 text-[#ff705d]" />
              </div>
            </Card>

            <Card className="bg-white p-8 border border-hairline-mist rounded-[32px] space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#2ba0ff]/20 rounded-2xl flex items-center justify-center text-[#2ba0ff]">
                <Globe className="w-6 h-6" />
              </div>
              <Badge variant="default">GCC & Global</Badge>
              <h3 className="font-sans font-black text-xl uppercase tracking-tight text-ink">
                GCC Reciprocity & Global Standards
              </h3>
              <p className="font-sans text-xs text-stone-gray leading-relaxed">
                Cross-accreditation with GCC Ministries of Education (Saudi MOE, Qatar QHEI, Oman OAAA) and global charter bodies (ABET, AACSB, EQUIS, IB, WASC, BSO) ensuring global degree equivalence.
              </p>
              <div className="pt-2 text-xs font-bold text-ink flex items-center gap-1">
                <span>Global Recognition</span> <CheckCircle className="w-4 h-4 text-[#2ba0ff]" />
              </div>
            </Card>
          </div>

          {/* Legal Compliance Accordion Banner */}
          <Card className="bg-white border-2 border-ink p-8 rounded-[36px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#f5e211]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-[#ff705d]" />
                <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-ink">
                  Statutory Directives & Consumer Protection Laws
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs text-stone-gray leading-relaxed">
                <div className="p-5 bg-[#f5f1e4]/50 border border-hairline-mist rounded-[20px] space-y-2">
                  <div className="font-bold text-ink uppercase text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#ff705d]" /> Degree Authenticity & Attestation
                  </div>
                  <p>
                    Under UAE Cabinet Resolution No. 23/2020, higher education degrees awarded by private institutes within free zones must hold valid academic permits or CAA licensure to qualify for Ministry of Education certificate equivalency. Massar highlights equivalency status on every profile.
                  </p>
                </div>

                <div className="p-5 bg-[#f5f1e4]/50 border border-hairline-mist rounded-[20px] space-y-2">
                  <div className="font-bold text-ink uppercase text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#8ed462]" /> Personal Data Protection Law (PDPL)
                  </div>
                  <p>
                    Massar complies with UAE Federal Decree-Law No. 45/2021 regarding Personal Data Protection. Student inquiries, application saves, and verification submissions are processed with end-to-end encryption without third-party data brokerage.
                  </p>
                </div>
              </div>
            </div>
          </Card>

        </div>
      )}

      {/* 2. UAE CAA TAB */}
      {activeTab === 'caa' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <Card className="bg-white p-8 border border-hairline-mist rounded-[32px] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#8ed462]/20 rounded-2xl flex items-center justify-center text-ink font-bold font-mono text-xl">
                CAA
              </div>
              <div>
                <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-ink">
                  Commission for Academic Accreditation (CAA)
                </h2>
                <p className="font-sans text-xs text-stone-gray font-semibold uppercase tracking-wider">
                  UAE Ministry of Higher Education and Scientific Research (MOHESR)
                </p>
              </div>
            </div>

            <p className="font-sans text-sm text-stone-gray leading-relaxed">
              The CAA is the federal quality assurance agency responsible for determining whether higher education institutions in the UAE conduct operations in accordance with international standards. Licensure of an institution by the CAA indicates that it has the administrative capacity, physical infrastructure, and academic faculty to offer higher education programs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 border border-hairline-mist bg-[#f5f1e4]/40 rounded-2xl space-y-1">
                <div className="font-bold text-ink text-xs uppercase flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#8ed462]" /> Institutional Licensure
                </div>
                <div className="text-xs text-stone-gray">Authorizes the college or university to operate legally within the UAE.</div>
              </div>

              <div className="p-4 border border-hairline-mist bg-[#f5f1e4]/40 rounded-2xl space-y-1">
                <div className="font-bold text-ink text-xs uppercase flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#8ed462]" /> Program Accreditation
                </div>
                <div className="text-xs text-stone-gray">Evaluates individual Bachelor, Master, and PhD curricula for academic rigor.</div>
              </div>
            </div>

            <div className="pt-4 border-t border-hairline-mist flex justify-between items-center">
              <span className="text-xs font-semibold text-stone-gray">Official CAA Directory Portal</span>
              <a 
                href="https://www.caa.ae" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-white font-sans font-bold text-xs uppercase rounded-[50px] hover:bg-[#8ed462] hover:text-ink transition-colors"
              >
                Visit CAA.ae <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        </div>
      )}

      {/* 3. KHDA TAB */}
      {activeTab === 'khda' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <Card className="bg-white p-8 border border-hairline-mist rounded-[32px] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#ff705d]/20 rounded-2xl flex items-center justify-center text-ink font-bold font-mono text-xl">
                KHDA
              </div>
              <div>
                <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-ink">
                  Knowledge and Human Development Authority (KHDA)
                </h2>
                <p className="font-sans text-xs text-stone-gray font-semibold uppercase tracking-wider">
                  Government of Dubai Educational Regulatory Authority
                </p>
              </div>
            </div>

            <p className="font-sans text-sm text-stone-gray leading-relaxed">
              KHDA oversees the private education sector in Dubai, including early learning centers, K-12 private schools, higher education institutes (located in Dubai International Academic City and Dubai Knowledge Park), and training institutes.
            </p>

            <div className="space-y-3">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-ink">Dubai Schools Inspection Bureau (DSIB) Ratings Scale:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans text-xs">
                <div className="p-3 bg-[#8ed462]/20 border border-[#8ed462]/40 rounded-xl font-bold text-ink text-center">
                  Outstanding
                </div>
                <div className="p-3 bg-[#2ba0ff]/20 border border-[#2ba0ff]/40 rounded-xl font-bold text-ink text-center">
                  Very Good
                </div>
                <div className="p-3 bg-[#f5e211]/20 border border-[#f5e211]/40 rounded-xl font-bold text-ink text-center">
                  Good
                </div>
                <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl font-bold text-stone-600 text-center">
                  Acceptable
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-hairline-mist flex justify-between items-center">
              <span className="text-xs font-semibold text-stone-gray">Official KHDA Dubai Portal</span>
              <a 
                href="https://www.khda.gov.ae" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-white font-sans font-bold text-xs uppercase rounded-[50px] hover:bg-[#ff705d] hover:text-white transition-colors"
              >
                Visit KHDA.gov.ae <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        </div>
      )}

      {/* 4. ADEK TAB */}
      {activeTab === 'adek' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <Card className="bg-white p-8 border border-hairline-mist rounded-[32px] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#2ba0ff]/20 rounded-2xl flex items-center justify-center text-ink font-bold font-mono text-xl">
                ADEK
              </div>
              <div>
                <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-ink">
                  Abu Dhabi Department of Education and Knowledge (ADEK)
                </h2>
                <p className="font-sans text-xs text-stone-gray font-semibold uppercase tracking-wider">
                  Emirate of Abu Dhabi Educational Regulatory Body
                </p>
              </div>
            </div>

            <p className="font-sans text-sm text-stone-gray leading-relaxed">
              ADEK regulates and licenses all private and public education institutions in the Emirate of Abu Dhabi, Al Ain, and Al Dhafra regions. Through the <em>Irtiqaa Inspection Program</em>, ADEK assesses school performance across six core performance standards.
            </p>

            <div className="p-4 border border-hairline-mist bg-[#f5f1e4]/40 rounded-2xl space-y-2 font-sans text-xs">
              <div className="font-bold text-ink uppercase">Irtiqaa Inspection Evaluation Framework</div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-gray">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#2ba0ff]" /> Students’ Achievement & Progress</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#2ba0ff]" /> Students’ Personal & Social Development</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#2ba0ff]" /> Teaching & Assessment Quality</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#2ba0ff]" /> Curriculum Adaptation & Innovation</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-hairline-mist flex justify-between items-center">
              <span className="text-xs font-semibold text-stone-gray">Official ADEK Abu Dhabi Portal</span>
              <a 
                href="https://www.adek.gov.ae" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-white font-sans font-bold text-xs uppercase rounded-[50px] hover:bg-[#2ba0ff] hover:text-white transition-colors"
              >
                Visit ADEK.gov.ae <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        </div>
      )}

      {/* 5. PDPL LEGAL TAB */}
      {activeTab === 'pdpl' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <Card className="bg-white p-8 border border-hairline-mist rounded-[32px] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#9f5ffd]/20 rounded-2xl flex items-center justify-center text-ink font-bold font-mono text-xl">
                PDPL
              </div>
              <div>
                <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-ink">
                  UAE Personal Data Protection Law (Federal Decree-Law No. 45/2021)
                </h2>
                <p className="font-sans text-xs text-stone-gray font-semibold uppercase tracking-wider">
                  Digital Governance & Student Privacy Compliance
                </p>
              </div>
            </div>

            <p className="font-sans text-sm text-stone-gray leading-relaxed">
              Federal Decree-Law No. 45 of 2021 regarding the Protection of Personal Data constitutes an integrated framework to ensure the confidentiality of information and protect student data rights in the United Arab Emirates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 border border-hairline-mist bg-[#f5f1e4]/40 rounded-2xl space-y-2">
                <div className="font-bold text-ink text-xs uppercase flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#9f5ffd]" /> Data Minimization
                </div>
                <p className="text-xs text-stone-gray leading-relaxed">
                  Massar collects only essential parameters required for institution location grounding and perk verification. We never store un-encrypted government IDs.
                </p>
              </div>

              <div className="p-5 border border-hairline-mist bg-[#f5f1e4]/40 rounded-2xl space-y-2">
                <div className="font-bold text-ink text-xs uppercase flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8ed462]" /> User Consent & Control
                </div>
                <p className="text-xs text-stone-gray leading-relaxed">
                  Students retain full ownership over saved bookmarks, search parameters, and counselor inquiries stored on local desk states.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 6. ACCREDITATION CHECKER TOOL TAB */}
      {activeTab === 'verify' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[28px] border border-hairline-mist">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search institution or accreditation body..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5f1e4]/50 border border-hairline-mist p-3.5 pr-10 font-sans text-xs rounded-[50px] outline-none text-ink focus:border-[#8ed462]"
              />
              <Search className="w-4 h-4 text-stone-gray absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-sans text-xs text-stone-gray font-bold uppercase">Filter:</span>
              {(['All', 'University', 'School'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-[50px] font-sans font-bold text-xs uppercase cursor-pointer border transition-colors",
                    selectedFilter === f ? "bg-[#8ed462] text-ink border-transparent" : "bg-white text-ink border-hairline-mist hover:bg-gray-50"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInstitutions.map(item => (
              <Card key={item.id} className="bg-white p-6 border border-hairline-mist rounded-[24px] space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant={item.type === 'University' ? 'default' : 'warning'}>
                      {item.type}
                    </Badge>
                    <span className="font-mono text-[10px] font-bold uppercase px-2.5 py-1 bg-[#8ed462]/15 text-ink rounded-full border border-[#8ed462]/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-[#8ed462]" /> {item.status}
                    </span>
                  </div>

                  <h3 className="font-sans font-black text-lg text-ink leading-tight mb-1">
                    {item.name}
                  </h3>
                  <div className="font-sans text-xs text-stone-gray font-semibold uppercase tracking-wider mb-3">
                    {item.location} • Authority: <span className="text-ink underline">{item.authority}</span>
                  </div>

                  <p className="font-sans text-xs text-stone-gray leading-relaxed mb-4">
                    {item.details}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.international.map((acc, i) => (
                      <span key={i} className="text-[10px] font-mono bg-[#f5f1e4] px-2 py-0.5 rounded border border-hairline-mist text-ink">
                        {acc}
                      </span>
                    ))}
                    {item.rating && (
                      <span className="text-[10px] font-bold bg-[#ff705d]/10 text-[#ff705d] px-2 py-0.5 rounded border border-[#ff705d]/20">
                        {item.rating}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-hairline-mist flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-stone-gray">Massar Audit Verified</span>
                  <Link 
                    to={`/details/${item.type.toLowerCase()}/${item.id}`}
                    className="text-xs font-bold text-[#ff705d] hover:underline flex items-center gap-1"
                  >
                    View Full Profile <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>

        </div>
      )}

      {/* Footer Legal Disclaimer Notice */}
      <div className="mt-16 pt-8 border-t border-hairline-mist text-center">
        <p className="font-sans text-xs text-stone-gray max-w-3xl mx-auto leading-relaxed">
          <strong>Legal Disclaimer:</strong> Massar platform presents educational institutional data sourced directly from official government gazettes, CAA listings, KHDA inspection releases, and ADEK registries. For formal degree equivalency or attestation procedures, students are advised to consult the official UAE Ministry of Education portal at <a href="https://www.moe.gov.ae" target="_blank" rel="noopener noreferrer" className="text-ink underline font-bold">moe.gov.ae</a>.
        </p>
      </div>

    </div>
  );
}
