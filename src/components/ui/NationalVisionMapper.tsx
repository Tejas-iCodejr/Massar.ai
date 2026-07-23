import React, { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  Cpu, 
  HeartPulse, 
  Zap, 
  Building2, 
  ShieldCheck, 
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface VisionMajor {
  id: string;
  title: string;
  visionAlignment: 'UAE Vision 2031' | 'Saudi Vision 2030' | 'Qatar Vision 2030';
  category: 'AI & Deep Tech' | 'Healthcare & Biotech' | 'Clean Energy' | 'Fintech & Digital Business';
  demandLevel: 'High Demand' | 'Critical Growth' | 'National Priority';
  avgStartingSalary: string;
  topUniversities: string[];
  description: string;
}

const VISION_MAJORS: VisionMajor[] = [
  {
    id: 'ai-robotics',
    title: 'Artificial Intelligence & Robotics Engineering',
    visionAlignment: 'UAE Vision 2031',
    category: 'AI & Deep Tech',
    demandLevel: 'Critical Growth',
    avgStartingSalary: 'AED 22,000 - 35,000 / mo',
    topUniversities: ['Khalifa University', 'MBZUAI', 'NYU Abu Dhabi', 'AUS'],
    description: 'Aligned with the UAE Strategy for Artificial Intelligence. Focuses on autonomous systems, generative AI, and smart city infrastructure.'
  },
  {
    id: 'cybersecurity',
    title: 'Cyber Security & Digital Forensics',
    visionAlignment: 'UAE Vision 2031',
    category: 'AI & Deep Tech',
    demandLevel: 'National Priority',
    avgStartingSalary: 'AED 20,000 - 32,000 / mo',
    topUniversities: ['Zayed University', 'Khalifa University', 'RIT Dubai'],
    description: 'High-demand specialization for national digital infrastructure defense and private sector compliance mandates.'
  },
  {
    id: 'renewable-energy',
    title: 'Sustainable & Renewable Energy Engineering',
    visionAlignment: 'UAE Vision 2031',
    category: 'Clean Energy',
    demandLevel: 'High Demand',
    avgStartingSalary: 'AED 18,000 - 28,000 / mo',
    topUniversities: ['Khalifa University', 'Heriot-Watt Dubai', 'UAEU'],
    description: 'Directly linked to COP28 legacy programs and UAE Net Zero 2050 strategic initiatives across solar, hydrogen, and clean grid technology.'
  },
  {
    id: 'health-informatics',
    title: 'Biomedical Engineering & Health Informatics',
    visionAlignment: 'Saudi Vision 2030',
    category: 'Healthcare & Biotech',
    demandLevel: 'High Demand',
    avgStartingSalary: 'SAR 16,000 - 26,000 / mo',
    topUniversities: ['King Saud University', 'UAEU', 'Gulf Medical University'],
    description: 'Addresses expanding regional healthcare systems, digital patient records, and modern genomic research centers.'
  },
  {
    id: 'fintech-analytics',
    title: 'Financial Technology (FinTech) & Business Analytics',
    visionAlignment: 'UAE Vision 2031',
    category: 'Fintech & Digital Business',
    demandLevel: 'Critical Growth',
    avgStartingSalary: 'AED 19,000 - 30,000 / mo',
    topUniversities: ['American University of Sharjah', 'Middlesex Dubai', 'CUD'],
    description: 'Tailored for DIFC & ADGM financial hubs, digital banking innovation, and regional venture capital development.'
  }
];

export function NationalVisionMapper() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredMajors = VISION_MAJORS.filter(m => selectedCategory === 'All' || m.category === selectedCategory);

  return (
    <Card className="bg-white border-2 border-ink shadow-[4px_4px_0px_#2c2e2a] rounded-[36px] p-6 sm:p-8 mb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f5e211]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-hairline-mist">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff705d]/10 rounded-full font-mono text-[10px] font-bold text-[#ff705d] uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#ff705d]" />
            <span>Middle East National Vision Career Mapper</span>
          </div>
          <h3 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink">
            Future Degree & Industry Growth Matrix
          </h3>
          <p className="font-sans font-medium text-xs text-stone-gray mt-0.5 max-w-xl">
            Explore academic degree programs mapped directly to UAE Vision 2031, Saudi Vision 2030, and high-demand private sector quotas.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap gap-1.5 font-sans text-xs">
          {(['All', 'AI & Deep Tech', 'Healthcare & Biotech', 'Clean Energy', 'Fintech & Digital Business'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-[50px] font-bold tracking-wider transition-all select-none cursor-pointer border",
                selectedCategory === cat ? "bg-ink text-white border-ink shadow-sm" : "bg-[#f5f1e4] text-ink border-hairline-mist hover:bg-stone-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Majors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMajors.map(m => (
          <div key={m.id} className="p-6 bg-[#f5f1e4]/40 border border-hairline-mist rounded-[28px] space-y-4 flex flex-col justify-between hover:border-ink transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant={m.demandLevel === 'National Priority' ? 'warning' : 'success'}>
                  {m.demandLevel}
                </Badge>
                <span className="font-mono text-[10px] font-bold text-[#2ba0ff] uppercase bg-[#2ba0ff]/10 px-2.5 py-1 rounded-full border border-[#2ba0ff]/20">
                  {m.visionAlignment}
                </span>
              </div>

              <h4 className="font-sans font-black text-lg text-ink leading-tight mb-2">
                {m.title}
              </h4>

              <p className="font-sans text-xs text-stone-gray leading-relaxed mb-4">
                {m.description}
              </p>

              <div className="space-y-2 text-xs font-sans border-t border-hairline-mist pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-stone-gray font-bold uppercase text-[10px]">Estimated Graduate Salary:</span>
                  <span className="font-mono font-bold text-ink">{m.avgStartingSalary}</span>
                </div>
                <div>
                  <span className="text-stone-gray font-bold uppercase text-[10px] block mb-1">Top Regional Universities Offering Degree:</span>
                  <div className="flex flex-wrap gap-1">
                    {m.topUniversities.map((uni, i) => (
                      <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-hairline-mist font-bold text-ink">
                        {uni}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-hairline-mist flex justify-between items-center">
              <span className="text-[10px] font-mono text-stone-gray uppercase">Emiratization & Saudization Quota Compatible</span>
              <Link 
                to="/universities" 
                className="text-xs font-bold text-[#ff705d] hover:underline inline-flex items-center gap-1"
              >
                Browse Universities <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
