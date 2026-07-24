import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Search, 
  UserCheck, 
  Sparkles, 
  ExternalLink, 
  Calendar, 
  Mail, 
  CheckCircle2, 
  FileText, 
  Star, 
  Bookmark, 
  Building2, 
  BadgeCheck, 
  ChevronRight,
  Send,
  Microscope,
  Briefcase
} from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { cn } from '../../lib/utils';

export interface Professor {
  id: string;
  name: string;
  title: string;
  globalRank: string;
  hIndex: number;
  citations: string;
  almaMater: string;
  specialization: string[];
  activeLab: string;
  awards: string[];
  email: string;
  office: string;
  officeHours: string;
  avatar: string;
  scholarLink: string;
}

export interface CourseProgram {
  id: string;
  name: string;
  degree: 'Bachelor' | 'Master' | 'Doctorate';
  field: 'Computer Science & AI' | 'Medicine & Health' | 'Engineering & Robotics' | 'Business & Finance' | 'Architecture & Design';
  duration: string;
  qsSubjectRank: string;
  tuitionPerYear: string;
  accreditation: string;
  overview: string;
  professors: Professor[];
}

interface CourseProfessorExplorerProps {
  universityId: string;
  universityName: string;
}

// Preset course offerings & world-ranked professors per university
const UNIVERSITY_COURSE_DATA: Record<string, CourseProgram[]> = {
  // 1. UAEU
  "1": [
    {
      id: "uaeu-md",
      name: "Doctor of Medicine & Health Sciences (MD)",
      degree: "Bachelor",
      field: "Medicine & Health",
      duration: "6 Years",
      qsSubjectRank: "#220 Globally in Medicine",
      tuitionPerYear: "AED 55,000",
      accreditation: "CAA Accredited & GMC Approved",
      overview: "Comprehensive clinical program offering hospital rotations, genomic research, and direct patient care in Sheikh Khalifa Medical City.",
      professors: [
        {
          id: "prof-uaeu-1",
          name: "Prof. Dr. Fatima Al-Khatib",
          title: "Chair Professor of Clinical Genomics & Precision Medicine",
          globalRank: "#12 Worldwide in Arab Genomic Research",
          hIndex: 72,
          citations: "18,400+",
          almaMater: "Harvard Medical School (Ph.D. Genetics)",
          specialization: ["Diabetes Genomics", "Precision Oncology", "CRISPR Therapeutics"],
          activeLab: "Emirates Center for Genomic Health & Biomarkers",
          awards: ["UAE President's Award for Science", "Lancet Medical Fellow"],
          email: "fatima.khatib@uaeu.ac.ae",
          office: "College of Medicine, Hall B-302",
          officeHours: "Mon / Wed 10:00 AM - 12:30 PM",
          avatar: "https://images.unsplash.com/photo-1594824813566-78a9c8b7463f?w=200&auto=format&fit=crop&q=80",
          scholarLink: "https://scholar.google.com"
        },
        {
          id: "prof-uaeu-2",
          name: "Dr. Arthur Pendelton",
          title: "Professor of Neurobiology & Molecular Pharmacology",
          globalRank: "#45 Worldwide in Neuroscience",
          hIndex: 64,
          citations: "14,100+",
          almaMater: "Oxford University (D.Phil. Neuroscience)",
          specialization: ["Neurodegenerative Diseases", "Synaptic Plasticity"],
          activeLab: "UAEU Cognitive Neuroscience Lab",
          awards: ["Brain Research Society Fellow"],
          email: "a.pendelton@uaeu.ac.ae",
          office: "Medicine Tower A-410",
          officeHours: "Tue / Thu 2:00 PM - 4:00 PM",
          avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80",
          scholarLink: "https://scholar.google.com"
        }
      ]
    },
    {
      id: "uaeu-petroleum",
      name: "B.Sc. in Petroleum & Chemical Engineering",
      degree: "Bachelor",
      field: "Engineering & Robotics",
      duration: "4 Years",
      qsSubjectRank: "#48 Globally in Petroleum Eng.",
      tuitionPerYear: "AED 34,000",
      accreditation: "ABET Accredited",
      overview: "Focuses on clean hydrogen energy transition, reservoir modeling, carbon capture, and sustainable subsurface engineering.",
      professors: [
        {
          id: "prof-uaeu-3",
          name: "Prof. Dr. Tariq Al-Mansoori",
          title: "Distinguished Professor of Subsurface Carbon Storage",
          globalRank: "#8 Worldwide in Petroleum Hydrodynamics",
          hIndex: 85,
          citations: "24,800+",
          almaMater: "Stanford University (Ph.D. Energy Resources)",
          specialization: ["CO2 Sequestration", "Hydrogen Storage", "Reservoir AI Modeling"],
          activeLab: "ADNOC Carbon Transition Research Center",
          awards: ["SPE International Technical Achievement Award", "IEEE Clean Energy Medal"],
          email: "t.mansoori@uaeu.ac.ae",
          office: "Engineering Building F1-104",
          officeHours: "Wed 1:00 PM - 4:00 PM",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
          scholarLink: "https://scholar.google.com"
        }
      ]
    }
  ],

  // 2. NYUAD
  "2": [
    {
      id: "nyuad-cs-ai",
      name: "B.Sc. in Computer Science & Artificial Intelligence",
      degree: "Bachelor",
      field: "Computer Science & AI",
      duration: "4 Years",
      qsSubjectRank: "#110 Globally in Computer Science",
      tuitionPerYear: "AED 78,000 (Full Need Aid Available)",
      accreditation: "NYU Global & MSCHE Accredited",
      overview: "World-class liberal arts & deep technology program focusing on neural networks, robotics, quantum algorithms, and AI alignment.",
      professors: [
        {
          id: "prof-nyuad-1",
          name: "Prof. Dr. Yannis Vlachos",
          title: "Global Chair Professor of Computer Science & Robotics",
          globalRank: "#14 Worldwide in Autonomous Neural Robotics",
          hIndex: 91,
          citations: "32,600+",
          almaMater: "MIT (Ph.D. EECS)",
          specialization: ["Reinforcement Learning", "Autonomous Drone Swarms", "Generative Vision"],
          activeLab: "NYUAD Center for AI and Robotics (CAIR)",
          awards: ["ACM Fellow", "IEEE Robotics Pioneer Award"],
          email: "yannis.vlachos@nyu.edu",
          office: "C2 Engineering Complex 304",
          officeHours: "Tue 2:00 PM - 5:00 PM",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
          scholarLink: "https://scholar.google.com"
        },
        {
          id: "prof-nyuad-2",
          name: "Dr. Sarah Al-Zahra",
          title: "Associate Professor of Cryptography & Quantum Computing",
          globalRank: "#28 Worldwide in Post-Quantum Security",
          hIndex: 58,
          citations: "11,200+",
          almaMater: "Cambridge University (Ph.D. Pure Math)",
          specialization: ["Quantum Key Distribution", "Zero-Knowledge Proofs", "Blockchain Resilience"],
          activeLab: "Cyber Security & Quantum Information Center",
          awards: ["MIT Technology Review Innovator Under 35"],
          email: "sarah.alzahra@nyu.edu",
          office: "A1 Science Building 212",
          officeHours: "Mon / Thu 11:00 AM - 1:00 PM",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
          scholarLink: "https://scholar.google.com"
        }
      ]
    },
    {
      id: "nyuad-econ",
      name: "B.A. in Economics & Quantitative Finance",
      degree: "Bachelor",
      field: "Business & Finance",
      duration: "4 Years",
      qsSubjectRank: "#75 Globally in Economics",
      tuitionPerYear: "AED 78,000",
      accreditation: "MSCHE Accredited",
      overview: "Rigorous econometrics and computational finance program in partnership with Abu Dhabi Global Market (ADGM) financial institutions.",
      professors: [
        {
          id: "prof-nyuad-3",
          name: "Prof. Dr. Marcus Vance",
          title: "Professor of Behavioral Economics & FinTech",
          globalRank: "#19 Worldwide in Algorithmic Market Microstructure",
          hIndex: 78,
          citations: "21,500+",
          almaMater: "Princeton University (Ph.D. Economics)",
          specialization: ["DeFi Markets", "Macroeconomic Modeling", "Central Bank Digital Currencies"],
          activeLab: "NYUAD Experimental Economics Lab",
          awards: ["Econometric Society Fellow"],
          email: "marcus.vance@nyu.edu",
          office: "B4 Social Sciences Building 401",
          officeHours: "Fri 9:00 AM - 12:00 PM",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80",
          scholarLink: "https://scholar.google.com"
        }
      ]
    }
  ],

  // 4. Khalifa University
  "4": [
    {
      id: "ku-robotics",
      name: "B.Sc. in Robotics & Autonomous Systems",
      degree: "Bachelor",
      field: "Engineering & Robotics",
      duration: "4 Years",
      qsSubjectRank: "#85 Globally in Engineering & Tech",
      tuitionPerYear: "AED 48,000",
      accreditation: "ABET Accredited",
      overview: "Preeminent regional robotics degree covering space exploration, marine robotics, self-driving vehicles, and bio-inspired actuators.",
      professors: [
        {
          id: "prof-ku-1",
          name: "Prof. Dr. Lakmal Seneviratne",
          title: "Director of Khalifa University Robotics Institute (KURI)",
          globalRank: "#6 Worldwide in Autonomous Field Robotics",
          hIndex: 96,
          citations: "38,900+",
          almaMater: "King's College London (Ph.D. Mechanical Eng)",
          specialization: ["Surgical Robotics", "Extreme Environment Exploration", "Haptic Controls"],
          activeLab: "Khalifa University Robotics Institute (KURI)",
          awards: ["IEEE Life Fellow", "UAE Golden Visa Medal of Scientific Distinction"],
          email: "lakmal.seneviratne@ku.ac.ae",
          office: "Building 9 - KURI Director Wing",
          officeHours: "Tue / Wed 10:00 AM - 1:00 PM",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
          scholarLink: "https://scholar.google.com"
        },
        {
          id: "prof-ku-2",
          name: "Dr. Khaled Al-Hashimi",
          title: "Associate Professor of Aerospace Guidance & Satellite Systems",
          globalRank: "#31 Worldwide in Space Systems Engineering",
          hIndex: 52,
          citations: "9,800+",
          almaMater: "Caltech (Ph.D. Aerospace Engineering)",
          specialization: ["CubeSat Systems", "Lunar Lander Guidance", "Orbital Mechanics"],
          activeLab: "Space Technology & Innovation Center (STIC)",
          awards: ["MBRSC Space Pioneer Medal"],
          email: "khaled.hashimi@ku.ac.ae",
          office: "Aerospace Complex A-102",
          officeHours: "Mon 1:00 PM - 4:00 PM",
          avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
          scholarLink: "https://scholar.google.com"
        }
      ]
    }
  ]
};

// Fallback courses generator for any university ID
function getCoursesForUniversity(uniId: string, uniName: string): CourseProgram[] {
  if (UNIVERSITY_COURSE_DATA[uniId]) {
    return UNIVERSITY_COURSE_DATA[uniId];
  }

  // Default fallback curriculum & professors
  return [
    {
      id: `${uniId}-cs`,
      name: "B.Sc. in Computer Science & Data Analytics",
      degree: "Bachelor",
      field: "Computer Science & AI",
      duration: "4 Years",
      qsSubjectRank: "#250 Globally",
      tuitionPerYear: "AED 42,000",
      accreditation: "CAA Accredited",
      overview: "Core degree focusing on software engineering, cloud computing, database optimization, and modern machine learning.",
      professors: [
        {
          id: `prof-${uniId}-1`,
          name: `Prof. Dr. Rashid Al-Kaabi`,
          title: "Head of Computer Science & Software Engineering",
          globalRank: "#40 Worldwide in Cloud Systems",
          hIndex: 68,
          citations: "16,200+",
          almaMater: "Carnegie Mellon University (Ph.D. CS)",
          specialization: ["Distributed Systems", "Cloud Security", "Parallel Computing"],
          activeLab: "Center for High-Performance Computing",
          awards: ["IEEE Senior Member"],
          email: `r.kaabi@${uniName.toLowerCase().replace(/[^a-z]/g, '')}.ac.ae`,
          office: "Science Building - Hall C-201",
          officeHours: "Mon / Wed 11:00 AM - 1:00 PM",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
          scholarLink: "https://scholar.google.com"
        }
      ]
    },
    {
      id: `${uniId}-bba`,
      name: "Bachelor of Business Administration (BBA)",
      degree: "Bachelor",
      field: "Business & Finance",
      duration: "4 Years",
      qsSubjectRank: "#200 Globally",
      tuitionPerYear: "AED 38,000",
      accreditation: "AACSB Accredited",
      overview: "Comprehensive business management curriculum covering strategic leadership, international trade, and digital marketing.",
      professors: [
        {
          id: `prof-${uniId}-2`,
          name: `Dr. Helen Thorne`,
          title: "Professor of Strategic Leadership & Global Business",
          globalRank: "#52 Worldwide in International Business Strategy",
          hIndex: 54,
          citations: "10,800+",
          almaMater: "London Business School (Ph.D. Strategy)",
          specialization: ["Corporate Strategy", "Emerging Market Ventures"],
          activeLab: "Global Entrepreneurship Observatory",
          awards: ["Academy of Management Best Paper Award"],
          email: `h.thorne@${uniName.toLowerCase().replace(/[^a-z]/g, '')}.ac.ae`,
          office: "Business Tower - 5th Floor",
          officeHours: "Tue / Thu 1:00 PM - 3:30 PM",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
          scholarLink: "https://scholar.google.com"
        }
      ]
    }
  ];
}

export function CourseProfessorExplorer({ universityId, universityName }: CourseProfessorExplorerProps) {
  const courses = getCoursesForUniversity(universityId, universityName);
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('All');
  const [bookingProfessor, setBookingProfessor] = useState<Professor | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Filter courses by field and search term
  const filteredCourses = courses.filter(c => {
    const matchesField = selectedField === 'All' || c.field === selectedField;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.overview.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesField && matchesSearch;
  });

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const handleBookOfficeHours = (prof: Professor) => {
    setBookingProfessor(prof);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingProfessor) return;
    setBookingSuccess(`Office hours appointment with ${bookingProfessor.name} successfully scheduled! Details emailed to your student address.`);
    setTimeout(() => {
      setBookingSuccess(null);
      setBookingProfessor(null);
    }, 4000);
  };

  return (
    <Card className="bg-white border-2 border-ink shadow-[4px_4px_0px_#2c2e2a] rounded-[36px] p-6 sm:p-8 space-y-8 relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#2ba0ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline-mist">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2ba0ff]/10 rounded-full font-mono text-[10px] font-bold text-[#2ba0ff] uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Faculty & Course Directory</span>
          </div>
          <h3 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink">
            Course Selection & Top World-Ranked Professors
          </h3>
          <p className="font-sans text-xs text-stone-gray mt-1 max-w-xl">
            Explore academic degree offerings at {universityName} and meet internationally renowned chair professors and research fellows leading each course.
          </p>
        </div>

        {/* Course Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search courses or majors..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#f5f1e4]/50 border border-hairline-mist py-2.5 px-4 pr-10 rounded-full font-sans text-xs text-ink placeholder-stone-gray focus:outline-none focus:border-[#2ba0ff]"
          />
          <Search className="w-4 h-4 text-stone-gray absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Success Notification */}
      {bookingSuccess && (
        <div className="p-4 bg-[#8ed462]/15 border border-[#8ed462]/30 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#4da81b] shrink-0" />
          <p className="font-sans text-xs font-bold text-ink">{bookingSuccess}</p>
        </div>
      )}

      {/* Main Grid: Left = Course Selector, Right = Top Professors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Course Selection List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase font-bold text-stone-gray tracking-wider">Available Majors ({filteredCourses.length})</span>
            
            {/* Field Selector */}
            <select
              value={selectedField}
              onChange={e => setSelectedField(e.target.value)}
              className="bg-white border border-hairline-mist text-[11px] font-sans font-bold px-2.5 py-1 rounded-full text-ink focus:outline-none focus:border-[#2ba0ff]"
            >
              <option value="All">All Fields</option>
              <option value="Computer Science & AI">CS & AI</option>
              <option value="Medicine & Health">Medicine</option>
              <option value="Engineering & Robotics">Engineering</option>
              <option value="Business & Finance">Business</option>
            </select>
          </div>

          {/* Courses List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredCourses.map(course => {
              const isSelected = course.id === activeCourse.id;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={cn(
                    "p-4 rounded-[24px] border transition-all cursor-pointer select-none space-y-2 relative",
                    isSelected 
                      ? "bg-ink text-[#f5f1e4] border-ink shadow-md" 
                      : "bg-[#f5f1e4]/40 border-hairline-mist hover:bg-white text-ink hover:border-ink"
                  )}
                >
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant={isSelected ? 'success' : 'default'} className="text-[9px]">
                      {course.degree}
                    </Badge>
                    <span className={cn(
                      "font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border",
                      isSelected ? "bg-white/10 border-white/20 text-[#2ba0ff]" : "bg-white border-hairline-mist text-[#2ba0ff]"
                    )}>
                      {course.qsSubjectRank}
                    </span>
                  </div>

                  <h4 className="font-sans font-black text-sm leading-snug">
                    {course.name}
                  </h4>

                  <div className="flex flex-wrap items-center justify-between text-[11px] font-sans pt-1 border-t border-white/10 border-dashed">
                    <span className={isSelected ? "text-stone-300" : "text-stone-gray"}>Duration: <strong>{course.duration}</strong></span>
                    <span className={isSelected ? "text-stone-300" : "text-stone-gray"}>Tuition: <strong>{course.tuitionPerYear}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Top World-Ranked Professors for Selected Course (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Course Badge & Title */}
          <div className="bg-[#f5f1e4]/60 border border-hairline-mist p-5 rounded-[28px] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-bold text-[#ff705d] uppercase tracking-wider bg-[#ff705d]/10 px-2.5 py-1 rounded-full border border-[#ff705d]/20">
                Selected Degree Focus
              </span>
              <span className="font-sans text-xs text-stone-gray font-semibold">
                Accreditation: <strong>{activeCourse.accreditation}</strong>
              </span>
            </div>
            
            <h4 className="font-sans font-black text-xl text-ink">
              {activeCourse.name}
            </h4>
            
            <p className="font-sans text-xs text-stone-gray leading-relaxed">
              {activeCourse.overview}
            </p>
          </div>

          {/* World-Ranked Professors List Header */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-sans font-black text-lg text-ink uppercase tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2ba0ff]" /> Top World-Ranked Faculty & Professors
              </h4>
              <span className="font-mono text-[10px] font-bold text-stone-gray uppercase bg-stone-100 px-2.5 py-1 rounded-full">
                {activeCourse.professors.length} Lead Scholars
              </span>
            </div>

            {/* Professors Cards Grid */}
            <div className="space-y-6">
              {activeCourse.professors.map(prof => (
                <div key={prof.id} className="bg-white border-2 border-ink rounded-[28px] p-6 space-y-5 shadow-[3px_3px_0px_#2c2e2a]">
                  
                  {/* Professor Header Info */}
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <img 
                      src={prof.avatar} 
                      alt={prof.name}
                      className="w-16 h-16 rounded-[20px] object-cover border-2 border-ink shrink-0 shadow-sm"
                    />

                    <div className="space-y-1 flex-grow">
                      {/* Global Rank Badge */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#f5e211] text-ink font-mono text-[10px] font-black uppercase rounded-full border border-ink shadow-xs">
                        <Sparkles className="w-3 h-3 text-ink" />
                        <span>{prof.globalRank}</span>
                      </div>

                      <h5 className="font-sans font-black text-lg text-ink leading-tight">
                        {prof.name}
                      </h5>

                      <p className="font-sans text-xs font-bold text-[#ff705d]">
                        {prof.title}
                      </p>

                      <p className="font-mono text-[11px] text-stone-gray">
                        Ph.D. Alma Mater: <strong className="text-ink">{prof.almaMater}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Research Metrics (h-Index & Citations) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#f5f1e4]/50 p-3 rounded-[20px] border border-hairline-mist font-sans text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-stone-gray uppercase block">h-Index Score</span>
                      <span className="font-mono font-black text-sm text-ink">{prof.hIndex}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-stone-gray uppercase block">Global Citations</span>
                      <span className="font-mono font-black text-sm text-[#2ba0ff]">{prof.citations}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-mono text-stone-gray uppercase block">Office Location</span>
                      <span className="font-sans font-bold text-xs text-ink truncate block">{prof.office}</span>
                    </div>
                  </div>

                  {/* Specializations & Active Lab */}
                  <div className="space-y-2 text-xs font-sans">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-stone-gray uppercase block mb-1">Research Focus:</span>
                      <div className="flex flex-wrap gap-1">
                        {prof.specialization.map((spec, idx) => (
                          <span key={idx} className="bg-[#2ba0ff]/10 text-[#2ba0ff] border border-[#2ba0ff]/20 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-hairline-mist">
                      <span className="text-[10px] font-mono text-stone-gray uppercase">Active Research Lab:</span>
                      <span className="font-sans font-bold text-ink block text-xs mt-0.5">{prof.activeLab}</span>
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-hairline-mist">
                    <a
                      href={prof.scholarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#ff705d] hover:underline inline-flex items-center gap-1"
                    >
                      View Publications & Google Scholar <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <Button 
                      size="sm"
                      onClick={() => handleBookOfficeHours(prof)}
                      className="bg-ink text-white hover:bg-stone-800 text-xs font-bold rounded-full px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#f5e211]" /> Book Office Hours
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Professor Office Hours Booking Modal */}
      {bookingProfessor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setBookingProfessor(null)}>
          <div className="bg-white border-2 border-ink rounded-[32px] p-6 max-w-md w-full space-y-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-3 border-b border-hairline-mist">
              <h4 className="font-sans font-black text-lg text-ink uppercase tracking-tight">
                Schedule Office Hours
              </h4>
              <button onClick={() => setBookingProfessor(null)} className="text-stone-gray hover:text-ink font-bold text-sm">✕</button>
            </div>

            <div className="flex items-center gap-3 bg-[#f5f1e4] p-3 rounded-2xl">
              <img src={bookingProfessor.avatar} alt={bookingProfessor.name} className="w-12 h-12 rounded-xl object-cover border border-ink" />
              <div>
                <h5 className="font-sans font-bold text-sm text-ink">{bookingProfessor.name}</h5>
                <p className="font-sans text-xs text-stone-gray">{bookingProfessor.officeHours}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 font-sans text-xs">
              <div>
                <label className="font-bold text-stone-gray block mb-1">Your Full Name</label>
                <input required type="text" placeholder="e.g. Mariam Al-Mansoori" className="w-full border border-hairline-mist p-3 rounded-xl focus:outline-none focus:border-[#2ba0ff]" />
              </div>

              <div>
                <label className="font-bold text-stone-gray block mb-1">Student Email Address</label>
                <input required type="email" placeholder="student@university.edu.ae" className="w-full border border-hairline-mist p-3 rounded-xl focus:outline-none focus:border-[#2ba0ff]" />
              </div>

              <div>
                <label className="font-bold text-stone-gray block mb-1">Inquiry Topic / Research Discussion</label>
                <textarea required rows={3} placeholder="Briefly state your academic question or lab research inquiry..." className="w-full border border-hairline-mist p-3 rounded-xl focus:outline-none focus:border-[#2ba0ff]" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setBookingProfessor(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Confirm Appointment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
