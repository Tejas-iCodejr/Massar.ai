import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Award, BookOpen, Star, Sparkles, CheckCircle2, UserCheck, 
  Mail, Phone, Calendar, Send, HelpCircle, FileSpreadsheet, Upload, 
  Check, FileText, AlertCircle, PlusCircle, Search, RefreshCw, Layers 
} from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { BudgetCalculator } from './BudgetCalculator';
import { CourseProfessorExplorer } from './CourseProfessorExplorer';

// Interfaces for structured data
interface ProgramOffer {
  name: string;
  degree: 'Bachelor' | 'Master' | 'Doctorate';
  duration: string;
  qsRanking?: string;
  isTopFeatured?: boolean;
}

interface Counselor {
  name: string;
  role: string;
  specialties: string[];
  email: string;
  phone: string;
  image: string;
}

interface ExamCriteria {
  sat: string;
  ielts: string;
  cambridge: string;
}

interface CommonDataSet {
  year: string;
  enrollment: number;
  avgGpa: number;
  avgSat: number;
  acceptanceRate: number;
}

interface UniversityConfig {
  id: string;
  name: string;
  topPrograms: ProgramOffer[];
  counselor: Counselor;
  examCriteria: ExamCriteria;
  commonDataSets: CommonDataSet[];
}

// Hardcoded expert records for the 4 primary universities in data.json
const UNIVERSITY_PRESETS: Record<string, UniversityConfig> = {
  "1": {
    id: "1",
    name: "United Arab Emirates University",
    topPrograms: [
      { name: "Doctor of Medicine & Health Sciences (MD)", degree: "Bachelor", duration: "6 Years", qsRanking: "#220 globally", isTopFeatured: true },
      { name: "B.Sc. in Petroleum & Chemical Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#48 globally", isTopFeatured: true },
      { name: "Bachelor of Business Administration (BBA)", degree: "Bachelor", duration: "4 Years", qsRanking: "#190 globally", isTopFeatured: true },
      { name: "B.Sc. in Computer Science & Information Security", degree: "Bachelor", duration: "4 Years", qsRanking: "#250 globally", isTopFeatured: false },
      { name: "M.Sc. in Mechanical Engineering", degree: "Master", duration: "2 Years", qsRanking: "#200 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Amna Al Neyadi",
      role: "Direct Enrollment & Admissions Counselor",
      specialties: ["Medicine", "Petroleum Engineering", "Scholarships"],
      email: "a.neyadi@uaeu.ac.ae",
      phone: "+971 3 713 5555",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1300+ (or EmSAT Math 1400+)",
      ielts: "Minimum 6.0 overall (mandatory entrance benchmark)",
      cambridge: "Accepted (B2 First / C1 Advanced, minimum 169+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 3820, avgGpa: 3.78, avgSat: 1320, acceptanceRate: 68 },
      { year: "2024", enrollment: 3650, avgGpa: 3.75, avgSat: 1310, acceptanceRate: 70 },
      { year: "2023", enrollment: 3510, avgGpa: 3.72, avgSat: 1300, acceptanceRate: 72 }
    ]
  },
  "2": {
    id: "2",
    name: "New York University Abu Dhabi",
    topPrograms: [
      { name: "B.Sc. in Computer Science & Artificial Intelligence", degree: "Bachelor", duration: "4 Years", qsRanking: "#110 globally", isTopFeatured: true },
      { name: "B.A. in Economics & Quantitative Finance", degree: "Bachelor", duration: "4 Years", qsRanking: "#75 globally", isTopFeatured: true },
      { name: "B.Sc. in Physics & Space Science", degree: "Bachelor", duration: "4 Years", qsRanking: "#120 globally", isTopFeatured: true },
      { name: "B.A. in Political Science & Global Studies", degree: "Bachelor", duration: "4 Years", qsRanking: "#60 globally", isTopFeatured: false },
      { name: "B.Sc. in Mechanical Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#130 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Dr. Michael Sterling",
      role: "Senior International Admissions Representative",
      specialties: ["Computer Science", "Economics", "Global Fellowships"],
      email: "michael.sterling@nyu.edu",
      phone: "+971 2 628 4000",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1480 - 1560 (highly weighted in selection index)",
      ielts: "Minimum 7.5 overall academic band (essential gatekeeper)",
      cambridge: "Accepted (C1 Advanced / C2 Proficiency, minimum 185+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 420, avgGpa: 3.94, avgSat: 1510, acceptanceRate: 3.2 },
      { year: "2024", enrollment: 410, avgGpa: 3.92, avgSat: 1495, acceptanceRate: 3.5 },
      { year: "2023", enrollment: 395, avgGpa: 3.90, avgSat: 1490, acceptanceRate: 3.8 }
    ]
  },
  "3": {
    id: "3",
    name: "American University of Sharjah",
    topPrograms: [
      { name: "Bachelor of Architecture (B.Arch)", degree: "Bachelor", duration: "5 Years", qsRanking: "#120 globally", isTopFeatured: true },
      { name: "B.Sc. in Civil & Structural Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#150 globally", isTopFeatured: true },
      { name: "B.Sc. in Chemical Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#180 globally", isTopFeatured: true },
      { name: "B.Sc. in Computer Science & Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#210 globally", isTopFeatured: false },
      { name: "Master of Business Administration (MBA)", degree: "Master", duration: "2 Years", qsRanking: "#200 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Professor Robert Miller",
      role: "Director of Academic Enrollment Advisory",
      specialties: ["Architecture", "Engineering", "Study Abroad Transfer"],
      email: "rmiller@aus.edu",
      phone: "+971 6 515 5555",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1250+ (or EmSAT Math 1200+)",
      ielts: "Minimum 6.5 overall (mandatory threshold)",
      cambridge: "Accepted (C1 Advanced, minimum 176+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 1250, avgGpa: 3.68, avgSat: 1280, acceptanceRate: 74 },
      { year: "2024", enrollment: 1200, avgGpa: 3.65, avgSat: 1260, acceptanceRate: 75 },
      { year: "2023", enrollment: 1150, avgGpa: 3.62, avgSat: 1250, acceptanceRate: 77 }
    ]
  },
  "4": {
    id: "4",
    name: "Khalifa University",
    topPrograms: [
      { name: "B.Sc. in Robotics & Autonomous Systems", degree: "Bachelor", duration: "4 Years", qsRanking: "#85 globally", isTopFeatured: true },
      { name: "B.Sc. in Aerospace Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#115 globally", isTopFeatured: true },
      { name: "B.Sc. in Electrical & Electronic Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#105 globally", isTopFeatured: true },
      { name: "B.Sc. in Biomedical Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#160 globally", isTopFeatured: false },
      { name: "Doctor of Medicine (MD) - Postgrad Entry", degree: "Doctorate", duration: "4 Years", qsRanking: "#180 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Eng. Salem Al Blooshi",
      role: "Senior Registrar & STEM Admissions Lead",
      specialties: ["Aerospace Engineering", "Robotics & AI", "Admissions Tests"],
      email: "salem.blooshi@ku.ac.ae",
      phone: "+971 2 312 3333",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1380+ (or EmSAT Math 1350+)",
      ielts: "Minimum 6.5 overall (mandatory language check)",
      cambridge: "Accepted (C1 Advanced, minimum 176+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 860, avgGpa: 3.84, avgSat: 1390, acceptanceRate: 24 },
      { year: "2024", enrollment: 820, avgGpa: 3.81, avgSat: 1370, acceptanceRate: 25 },
      { year: "2023", enrollment: 790, avgGpa: 3.79, avgSat: 1360, acceptanceRate: 26 }
    ]
  },
  "5": {
    id: "5",
    name: "Manipal Academy of Higher Education, Dubai",
    topPrograms: [
      { name: "B.Tech in Computer Science & Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#701 globally", isTopFeatured: true },
      { name: "B.Sc. in Biotechnology", degree: "Bachelor", duration: "3 Years", qsRanking: "#651 globally", isTopFeatured: true },
      { name: "B.A. in Media & Communication", degree: "Bachelor", duration: "3 Years", qsRanking: "#501 globally", isTopFeatured: false },
      { name: "Master of Business Administration (MBA)", degree: "Master", duration: "2 Years", qsRanking: "#551 globally", isTopFeatured: true }
    ],
    counselor: {
      name: "Mrs. Shreya Mehta",
      role: "Senior Admissions Manager & Academic Advisor",
      specialties: ["Biotechnology Admissions", "CBSE Equivalency", "Scholarship Allocation"],
      email: "shreya.mehta@manipaldubai.com",
      phone: "+971 4 429 0888",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1150+ (or 60%+ CBSE/High School aggregate)",
      ielts: "Minimum 5.5 overall (or school instruction waiver)",
      cambridge: "Accepted (B2 First, minimum 160+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 1540, avgGpa: 3.25, avgSat: 1150, acceptanceRate: 85 },
      { year: "2024", enrollment: 1420, avgGpa: 3.22, avgSat: 1120, acceptanceRate: 86 },
      { year: "2023", enrollment: 1300, avgGpa: 3.20, avgSat: 1100, acceptanceRate: 88 }
    ]
  },
  "6": {
    id: "6",
    name: "BITS Pilani, Dubai Campus",
    topPrograms: [
      { name: "B.E. in Computer Science & Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#801 globally", isTopFeatured: true },
      { name: "B.E. in Electronics & Communication Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#851 globally", isTopFeatured: true },
      { name: "B.E. in Biotechnology", degree: "Bachelor", duration: "4 Years", qsRanking: "#901 globally", isTopFeatured: false },
      { name: "M.B.A. in Business Analytics", degree: "Master", duration: "2 Years", qsRanking: "#601 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Dr. Anand Kumar",
      role: "Director of Admissions & STEM Counsel",
      specialties: ["BITSAT Scoring", "Indian Board Transfer", "Engineering Internships"],
      email: "admissions@dubai.bits-pilani.ac.in",
      phone: "+971 4 275 3700",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1280+ (or BITSAT rank threshold / 60%+ PCM high school)",
      ielts: "Minimum 6.0 overall (language check standard)",
      cambridge: "Accepted (B2 First or C1 Advanced)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 620, avgGpa: 3.45, avgSat: 1280, acceptanceRate: 58 },
      { year: "2024", enrollment: 580, avgGpa: 3.42, avgSat: 1260, acceptanceRate: 60 },
      { year: "2023", enrollment: 550, avgGpa: 3.40, avgSat: 1250, acceptanceRate: 62 }
    ]
  },
  "7": {
    id: "7",
    name: "IIT Delhi - Abu Dhabi",
    topPrograms: [
      { name: "B.Tech in Computer Science & Artificial Intelligence", degree: "Bachelor", duration: "4 Years", qsRanking: "#15 globally (parent)", isTopFeatured: true },
      { name: "B.Tech in Energy Engineering & Materials Science", degree: "Bachelor", duration: "4 Years", qsRanking: "#25 globally (parent)", isTopFeatured: true },
      { name: "M.Tech in Energy Transition and Sustainability", degree: "Master", duration: "2 Years", qsRanking: "#20 globally (parent)", isTopFeatured: false }
    ],
    counselor: {
      name: "Prof. Rajiv Shastri",
      role: "Dean of Academic Programs & International Outreach",
      specialties: ["JEE Advanced Pathways", "CAET Abu Dhabi Entrance Exam", "PhD Research fellowships"],
      email: "admissions.abudhabi@iitd.ac.in",
      phone: "+971 2 401 1333",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Not accepted (Must qualify JEE Advanced or CAET Entrance Exam 95%+ rank)",
      ielts: "Minimum 6.5 overall (mandatory requirement)",
      cambridge: "Accepted (C1 Advanced, minimum 180+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 60, avgGpa: 3.96, avgSat: 1540, acceptanceRate: 8 },
      { year: "2024", enrollment: 30, avgGpa: 3.95, avgSat: 1520, acceptanceRate: 10 },
      { year: "2023", enrollment: 0, avgGpa: 0, avgSat: 0, acceptanceRate: 0 }
    ]
  },
  "8": {
    id: "8",
    name: "Heriot-Watt University Dubai",
    topPrograms: [
      { name: "B.Eng. in Chemical & Petroleum Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#235 globally", isTopFeatured: true },
      { name: "B.Sc. in Data Sciences & Analytics", degree: "Bachelor", duration: "4 Years", qsRanking: "#281 globally", isTopFeatured: true },
      { name: "B.A. in Fashion Technology & Design", degree: "Bachelor", duration: "3 Years", qsRanking: "#150 globally", isTopFeatured: false },
      { name: "Master of Science in Civil Engineering", degree: "Master", duration: "2 Years", qsRanking: "#205 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Ms. Sarah Thompson",
      role: "Head of British Degree Programs Admitting Board",
      specialties: ["UCAS Transfer", "A-Level Equivalencies", "UK Degree Compliance"],
      email: "s.thompson@hw.ac.uk",
      phone: "+971 4 435 8700",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1220+ (or BBC at A-Levels / 70%+ CBSE aggregate)",
      ielts: "Minimum 6.0 overall (mandatory threshold)",
      cambridge: "Accepted (C1 Advanced, minimum 169+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 2100, avgGpa: 3.50, avgSat: 1220, acceptanceRate: 76 },
      { year: "2024", enrollment: 1950, avgGpa: 3.48, avgSat: 1200, acceptanceRate: 78 },
      { year: "2023", enrollment: 1800, avgGpa: 3.45, avgSat: 1180, acceptanceRate: 80 }
    ]
  },
  "9": {
    id: "9",
    name: "University of Birmingham Dubai",
    topPrograms: [
      { name: "B.Sc. in Computer Science with AI", degree: "Bachelor", duration: "3 Years", qsRanking: "#84 globally", isTopFeatured: true },
      { name: "B.Eng. in Mechanical Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#92 globally", isTopFeatured: true },
      { name: "B.Sc. in Business Management", degree: "Bachelor", duration: "3 Years", qsRanking: "#101 globally", isTopFeatured: false },
      { name: "M.Sc. in Artificial Intelligence & Machine Learning", degree: "Master", duration: "1 Year", qsRanking: "#75 globally", isTopFeatured: true }
    ],
    counselor: {
      name: "Dr. Edward Vance",
      role: "Senior Director of Smart Campus Admissions",
      specialties: ["Russell Group Pathways", "STEM Research Scholarships", "British Curriculum Equivalencies"],
      email: "e.vance@birmingham.ac.uk",
      phone: "+971 4 242 8000",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1350+ (or AAB at A-Levels / 80%+ CBSE aggregate)",
      ielts: "Minimum 6.5 overall (with no band less than 6.0)",
      cambridge: "Accepted (C1 Advanced, minimum 176+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 1100, avgGpa: 3.65, avgSat: 1350, acceptanceRate: 64 },
      { year: "2024", enrollment: 950, avgGpa: 3.62, avgSat: 1330, acceptanceRate: 66 },
      { year: "2023", enrollment: 800, avgGpa: 3.60, avgSat: 1300, acceptanceRate: 68 }
    ]
  },
  "10": {
    id: "10",
    name: "Zayed University",
    topPrograms: [
      { name: "B.Sc. in Information Technology (Security & Network)", degree: "Bachelor", duration: "4 Years", qsRanking: "#651 globally", isTopFeatured: true },
      { name: "B.A. in Communication & Media Sciences", degree: "Bachelor", duration: "4 Years", qsRanking: "#401 globally", isTopFeatured: true },
      { name: "B.Sc. in Business & Finance", degree: "Bachelor", duration: "4 Years", qsRanking: "#501 globally", isTopFeatured: false },
      { name: "M.Sc. in Information Technology (Cyber Security)", degree: "Master", duration: "2 Years", qsRanking: "#450 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Mrs. Fatima Al Marzooqi",
      role: "Dean of Undergraduate Recruitment & Student Affairs",
      specialties: ["EmSAT Assessment Guidance", "Government Sponsorships", "National Career Placement"],
      email: "fatima.marzooqi@zu.ac.ae",
      phone: "+971 4 402 1111",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1100+ (or EmSAT English 1250+ / High school score 80%+)",
      ielts: "Minimum 5.5 overall (mandatory threshold)",
      cambridge: "Accepted (B2 First, minimum 160+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 4200, avgGpa: 3.40, avgSat: 1100, acceptanceRate: 80 },
      { year: "2024", enrollment: 3950, avgGpa: 3.38, avgSat: 1080, acceptanceRate: 82 },
      { year: "2023", enrollment: 3700, avgGpa: 3.35, avgSat: 1050, acceptanceRate: 84 }
    ]
  },
  "11": {
    id: "11",
    name: "King Abdullah University of Science and Technology (KAUST)",
    topPrograms: [
      { name: "Ph.D. in Computer Science & Artificial Intelligence", degree: "Doctorate", duration: "3-4 Years", qsRanking: "#1 globally in Citations per Faculty", isTopFeatured: true },
      { name: "M.Sc./Ph.D. in Marine Science", degree: "Doctorate", duration: "2-4 Years", qsRanking: "#34 globally in Earth & Marine Sciences", isTopFeatured: true },
      { name: "M.Sc. in Electrical and Computer Engineering", degree: "Master", duration: "2 Years", qsRanking: "#80 globally", isTopFeatured: true },
      { name: "M.Sc. in Bioscience", degree: "Master", duration: "2 Years", qsRanking: "#110 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Dr. Fahad Al-Mutairi",
      role: "Office of Graduate Admissions & Fellowship Advisor",
      specialties: ["KAUST Fellowship Program", "PhD Research Proposals", "Global STEM Outreach"],
      email: "admissions@kaust.edu.sa",
      phone: "+966 12 808 3422",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Not Applicable (Graduate-only. Requires Bachelor's GPA 3.5+ / 4.0 scale)",
      ielts: "Minimum 6.5 overall (mandatory threshold)",
      cambridge: "Accepted (C1 Advanced or C2 Proficiency)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 450, avgGpa: 3.85, avgSat: 0, acceptanceRate: 9 },
      { year: "2024", enrollment: 420, avgGpa: 3.82, avgSat: 0, acceptanceRate: 10 },
      { year: "2023", enrollment: 390, avgGpa: 3.80, avgSat: 0, acceptanceRate: 11 }
    ]
  },
  "12": {
    id: "12",
    name: "King Fahd University of Petroleum and Minerals (KFUPM)",
    topPrograms: [
      { name: "B.Sc. in Petroleum Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#4 globally", isTopFeatured: true },
      { name: "B.Sc. in Chemical Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#52 globally", isTopFeatured: true },
      { name: "B.Sc. in Software Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#120 globally", isTopFeatured: true },
      { name: "Master of Science in Materials Science", degree: "Master", duration: "2 Years", qsRanking: "#95 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Engr. Tariq Al-Ghamdi",
      role: "Senior Coordinator of International Undergraduate Admissions",
      specialties: ["SAT/AP Equivalency Evaluation", "Saudi Aramco Sponsorships", "Engineering Track Admissions"],
      email: "admissions@kfupm.edu.sa",
      phone: "+966 13 860 2901",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1380+ (or Qudrat 85+ and Tahsili 85+ score)",
      ielts: "Minimum 6.0 overall (language check standard)",
      cambridge: "Accepted (B2 First, minimum 169+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 1850, avgGpa: 3.75, avgSat: 1380, acceptanceRate: 12 },
      { year: "2024", enrollment: 1720, avgGpa: 3.72, avgSat: 1350, acceptanceRate: 14 },
      { year: "2023", enrollment: 1600, avgGpa: 3.70, avgSat: 1320, acceptanceRate: 15 }
    ]
  },
  "13": {
    id: "13",
    name: "Qatar University",
    topPrograms: [
      { name: "B.Sc. in Computer Science", degree: "Bachelor", duration: "4 Years", qsRanking: "#173 globally", isTopFeatured: true },
      { name: "B.Sc. in Mechanical Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#150 globally", isTopFeatured: true },
      { name: "Doctor of Pharmacy (PharmD)", degree: "Doctorate", duration: "6 Years", qsRanking: "#101 globally", isTopFeatured: true },
      { name: "Master of Business Administration (MBA)", degree: "Master", duration: "2 Years", qsRanking: "#201 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Dr. Hassan Al-Sayed",
      role: "Senior International Admissions Representative",
      specialties: ["Qatar National Vision Scholarships", "International Transfer Equivalency", "Graduate Research Assistantships"],
      email: "hassan.alsayed@qu.edu.qa",
      phone: "+974 4403 4444",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1200+ (or Math QU-Placer 200+)",
      ielts: "Minimum 6.0 overall (or TOEFL iBT 61+)",
      cambridge: "Accepted (B2 First, minimum 169+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 3100, avgGpa: 3.52, avgSat: 1210, acceptanceRate: 40 },
      { year: "2024", enrollment: 2950, avgGpa: 3.50, avgSat: 1190, acceptanceRate: 42 },
      { year: "2023", enrollment: 2800, avgGpa: 3.48, avgSat: 1180, acceptanceRate: 44 }
    ]
  },
  "14": {
    id: "14",
    name: "King Saud University",
    topPrograms: [
      { name: "Bachelor of Medicine & Bachelor of Surgery (MBBS)", degree: "Bachelor", duration: "6 Years", qsRanking: "#203 globally", isTopFeatured: true },
      { name: "B.Sc. in Computer Science & Artificial Intelligence", degree: "Bachelor", duration: "4 Years", qsRanking: "#151 globally", isTopFeatured: true },
      { name: "B.Sc. in Mechanical Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#180 globally", isTopFeatured: true },
      { name: "M.Sc. in Civil Engineering", degree: "Master", duration: "2 Years", qsRanking: "#120 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Dr. Abdulrahman Al-Harbi",
      role: "Director of International Academic Enrollment",
      specialties: ["Medical Stream Entry Index", "Saudi Government Merit Scholarships", "Trans-Arab Credit Transfers"],
      email: "admissions@ksu.edu.sa",
      phone: "+966 11 467 0000",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1320+ (or Qudrat 80+ and Tahsili 80+ scores)",
      ielts: "Minimum 6.0 overall (mandatory language threshold)",
      cambridge: "Accepted (C1 Advanced, minimum 176+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 4500, avgGpa: 3.65, avgSat: 1320, acceptanceRate: 15 },
      { year: "2024", enrollment: 4200, avgGpa: 3.62, avgSat: 1300, acceptanceRate: 17 },
      { year: "2023", enrollment: 4000, avgGpa: 3.60, avgSat: 1280, acceptanceRate: 18 }
    ]
  },
  "15": {
    id: "15",
    name: "Abu Dhabi University",
    topPrograms: [
      { name: "B.Sc. in Computer Engineering (AI & Cybersecurity)", degree: "Bachelor", duration: "4 Years", qsRanking: "#581 globally", isTopFeatured: true },
      { name: "Bachelor of Business Administration (BBA)", degree: "Bachelor", duration: "4 Years", qsRanking: "#301 globally", isTopFeatured: true },
      { name: "B.Sc. in Civil Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#401 globally", isTopFeatured: false },
      { name: "Master of Business Administration (MBA)", degree: "Master", duration: "2 Years", qsRanking: "#250 globally", isTopFeatured: true }
    ],
    counselor: {
      name: "Ms. Fatima Al-Shamsi",
      role: "Senior Lead of Student Recruitment",
      specialties: ["ADU Academic Merit Scholarships", "High School Equivalency Assessment", "Corporate Sponsorships"],
      email: "admissions@adu.ac.ae",
      phone: "+971 2 501 5555",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1180+ (or EmSAT Math 1100+)",
      ielts: "Minimum 5.5 overall (language threshold requirement)",
      cambridge: "Accepted (B2 First, minimum 162+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 1650, avgGpa: 3.35, avgSat: 1150, acceptanceRate: 75 },
      { year: "2024", enrollment: 1550, avgGpa: 3.32, avgSat: 1120, acceptanceRate: 77 },
      { year: "2023", enrollment: 1450, avgGpa: 3.30, avgSat: 1100, acceptanceRate: 79 }
    ]
  },
  "16": {
    id: "16",
    name: "King Khalid University",
    topPrograms: [
      { name: "Bachelor of Medicine & Bachelor of Surgery (MBBS)", degree: "Bachelor", duration: "6 Years", qsRanking: "#601 globally", isTopFeatured: true },
      { name: "B.Sc. in Computer Science", degree: "Bachelor", duration: "4 Years", qsRanking: "#501 globally", isTopFeatured: true },
      { name: "B.Sc. in Electrical Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#551 globally", isTopFeatured: false },
      { name: "M.Sc. in Mathematics", degree: "Master", duration: "2 Years", qsRanking: "#401 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Dr. Saeed Al-Asmari",
      role: "Dean of Admissions & Academic Registry",
      specialties: ["Regional Student Support", "Health Sciences Transfer Indices", "Asir Region Community Scholarships"],
      email: "admissions@kku.edu.sa",
      phone: "+966 17 241 8000",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1150+ (or Qudrat 75+ / Tahsili 75+)",
      ielts: "Minimum 5.5 overall (mandatory language check)",
      cambridge: "Accepted (B2 First, minimum 160+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 2800, avgGpa: 3.42, avgSat: 1150, acceptanceRate: 35 },
      { year: "2024", enrollment: 2600, avgGpa: 3.40, avgSat: 1120, acceptanceRate: 37 },
      { year: "2023", enrollment: 2500, avgGpa: 3.38, avgSat: 1100, acceptanceRate: 39 }
    ]
  },
  "17": {
    id: "17",
    name: "Lebanese American University",
    topPrograms: [
      { name: "B.E. in Computer Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#501 globally", isTopFeatured: true },
      { name: "B.S. in Biology (Pre-Med)", degree: "Bachelor", duration: "3 Years", qsRanking: "#451 globally", isTopFeatured: true },
      { name: "B.S. in Business Administration", degree: "Bachelor", duration: "3 Years", qsRanking: "#351 globally", isTopFeatured: true },
      { name: "Master of Business Administration (MBA)", degree: "Master", duration: "2 Years", qsRanking: "#301 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Ms. Nicole Ghosn",
      role: "Senior Director of Financial Aid & Admissions",
      specialties: ["Lebanese Baccalaureate Equivalency", "USAID Student Grants", "International Study Abroad Programs"],
      email: "admissions@lau.edu.lb",
      phone: "+961 1 786 456",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1150+ (or strong high school math grades)",
      ielts: "Minimum 6.5 overall (language waiver available)",
      cambridge: "Accepted (C1 Advanced, minimum 176+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 1150, avgGpa: 3.40, avgSat: 1150, acceptanceRate: 68 },
      { year: "2024", enrollment: 1080, avgGpa: 3.38, avgSat: 1120, acceptanceRate: 70 },
      { year: "2023", enrollment: 1020, avgGpa: 3.35, avgSat: 1100, acceptanceRate: 72 }
    ]
  },
  "18": {
    id: "18",
    name: "The British University in Dubai",
    topPrograms: [
      { name: "B.Sc. in Computer Science (Software Engineering)", degree: "Bachelor", duration: "3 Years", qsRanking: "#651 globally", isTopFeatured: true },
      { name: "B.Sc. in Business Management", degree: "Bachelor", duration: "3 Years", qsRanking: "#551 globally", isTopFeatured: true },
      { name: "M.Sc. in Project Management", degree: "Master", duration: "2 Years", qsRanking: "#401 globally", isTopFeatured: false },
      { name: "PhD in Education", degree: "Doctorate", duration: "3 Years", qsRanking: "#301 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Ms. Clara Hughes",
      role: "Registrar & Academic Student Liaison",
      specialties: ["British Curriculum Pathways", "Postgraduate Research Fellowships", "UK University Credit Transfers"],
      email: "clara.hughes@buid.ac.ae",
      phone: "+971 4 279 1400",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1100+ (or GCSE/A-level points profile)",
      ielts: "Minimum 6.0 overall (mandatory threshold)",
      cambridge: "Accepted (B2 First, minimum 169+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 720, avgGpa: 3.28, avgSat: 1120, acceptanceRate: 80 },
      { year: "2024", enrollment: 680, avgGpa: 3.25, avgSat: 1100, acceptanceRate: 82 },
      { year: "2023", enrollment: 640, avgGpa: 3.22, avgSat: 1080, acceptanceRate: 84 }
    ]
  },
  "19": {
    id: "19",
    name: "Prince Mohammad Bin Fahd University",
    topPrograms: [
      { name: "B.Sc. in Mechanical Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#751 globally", isTopFeatured: true },
      { name: "B.Sc. in Computer Science", degree: "Bachelor", duration: "4 Years", qsRanking: "#701 globally", isTopFeatured: true },
      { name: "B.S. in Finance & Accounting", degree: "Bachelor", duration: "4 Years", qsRanking: "#601 globally", isTopFeatured: false },
      { name: "M.S. in Human Resources Management", degree: "Master", duration: "2 Years", qsRanking: "#501 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Dr. Jamil Al-Saeed",
      role: "Coordinator of International Recruitment",
      specialties: ["Eastern Province Industrial Sponsorships", "COOP Student Internship Placement", "High School GPA Conversions"],
      email: "admissions@pmu.edu.sa",
      phone: "+966 13 849 8500",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1100+ (or PMU Entrance Math placement)",
      ielts: "Minimum 5.5 overall (remedial English courses available)",
      cambridge: "Accepted (B2 First, minimum 160+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 1120, avgGpa: 3.30, avgSat: 1100, acceptanceRate: 70 },
      { year: "2024", enrollment: 1050, avgGpa: 3.28, avgSat: 1080, acceptanceRate: 72 },
      { year: "2023", enrollment: 980, avgGpa: 3.25, avgSat: 1050, acceptanceRate: 75 }
    ]
  },
  "20": {
    id: "20",
    name: "King Abdulaziz University (KAU)",
    topPrograms: [
      { name: "Bachelor of Medicine & Surgery (MBBS)", degree: "Bachelor", duration: "6 Years", qsRanking: "#109 globally", isTopFeatured: true },
      { name: "B.Sc. in Computer Science & Artificial Intelligence", degree: "Bachelor", duration: "4 Years", qsRanking: "#85 globally", isTopFeatured: true },
      { name: "B.Sc. in Nuclear & Chemical Engineering", degree: "Bachelor", duration: "4 Years", qsRanking: "#95 globally", isTopFeatured: true },
      { name: "M.Sc. in Renewable Energy Systems", degree: "Master", duration: "2 Years", qsRanking: "#70 globally", isTopFeatured: false }
    ],
    counselor: {
      name: "Dr. Huda Al-Ghamdi",
      role: "Director of International Graduate & Undergraduate Admissions",
      specialties: ["KAU Global Excellence Fellowships", "Medical College Entrance Index", "STEM Credit Equivalency"],
      email: "admissions@kau.edu.sa",
      phone: "+966 12 695 2000",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    examCriteria: {
      sat: "Recommended 1420+ (or Qudrat 88+ and Tahsili 88+ score)",
      ielts: "Minimum 6.5 overall (mandatory requirement)",
      cambridge: "Accepted (C1 Advanced, minimum 176+)"
    },
    commonDataSets: [
      { year: "2025", enrollment: 5200, avgGpa: 3.88, avgSat: 1430, acceptanceRate: 25 },
      { year: "2024", enrollment: 4900, avgGpa: 3.85, avgSat: 1410, acceptanceRate: 26 },
      { year: "2023", enrollment: 4600, avgGpa: 3.82, avgSat: 1390, acceptanceRate: 28 }
    ]
  }
};

interface Props {
  universityId: string;
  universityName: string;
}

export function UniversityDetailsExpanded({ universityId, universityName }: Props) {
  // Try to find matching preset, otherwise build default
  const presetKey = Object.keys(UNIVERSITY_PRESETS).includes(universityId) ? universityId : "1";
  const initialConfig = UNIVERSITY_PRESETS[presetKey];

  // State management
  const [activeTab, setActiveTab] = useState<'programs' | 'professors' | 'exams' | 'counselor' | 'cds' | 'budget'>('programs');
  const [selectedProgram, setSelectedProgram] = useState<string>(initialConfig.topPrograms[0].name);
  const [config, setConfig] = useState<UniversityConfig>(initialConfig);
  
  // Custom CDS input state
  const [editingYear, setEditingYear] = useState<'2025' | '2024' | '2023'>('2025');
  const [inputEnrollment, setInputEnrollment] = useState<string>('');
  const [inputGpa, setInputGpa] = useState<string>('');
  const [inputSat, setInputSat] = useState<string>('');
  const [inputAcceptance, setInputAcceptance] = useState<string>('');
  
  // Simulation states for manual uploads
  const [isDragging, setIsDragging] = useState(false);
  const [parsingState, setParsingState] = useState<'idle' | 'parsing' | 'success'>('idle');
  const [parsedFileName, setParsedFileName] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Score eligibility calculator state
  const [userSatScore, setUserSatScore] = useState<string>('');
  const [userIeltsScore, setUserIeltsScore] = useState<string>('');
  const [eligibilityResult, setEligibilityResult] = useState<{ status: 'meet' | 'warn' | 'unknown', text: string } | null>(null);

  // Counselor message form state
  const [messageSent, setMessageSent] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Load local storage overrides on mount or ID change
  useEffect(() => {
    const key = `cds_override_${universityId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfig(prev => ({ ...prev, commonDataSets: parsed }));
      } catch (e) {
        console.error(e);
      }
    } else {
      setConfig(UNIVERSITY_PRESETS[presetKey] || UNIVERSITY_PRESETS["1"]);
    }
    
    // Set program
    const uniData = UNIVERSITY_PRESETS[presetKey] || UNIVERSITY_PRESETS["1"];
    setSelectedProgram(uniData.topPrograms[0].name);
    
    // Clear simulation states
    setParsingState('idle');
    setParsedFileName('');
    setSuccessToast(null);
    setMessageSent(false);
    setMessageText('');
    setEligibilityResult(null);
    setUserSatScore('');
    setUserIeltsScore('');
  }, [universityId, presetKey]);

  // Handle Score eligibility calculator check
  const handleCheckEligibility = () => {
    const sat = parseFloat(userSatScore);
    const ielts = parseFloat(userIeltsScore);
    
    if (isNaN(sat) || isNaN(ielts)) {
      setEligibilityResult({ status: 'unknown', text: 'Please input both valid numerical SAT and IELTS scores to compute index match.' });
      return;
    }

    // Rough comparison logic based on university minimum guidelines
    let targetSat = 1300;
    let targetIelts = 6.0;

    if (presetKey === "2") { // NYUAD
      targetSat = 1480;
      targetIelts = 7.5;
    } else if (presetKey === "4") { // KU
      targetSat = 1350;
      targetIelts = 6.5;
    } else if (presetKey === "3") { // AUS
      targetSat = 1250;
      targetIelts = 6.5;
    }

    if (sat >= targetSat && ielts >= targetIelts) {
      setEligibilityResult({
        status: 'meet',
        text: `✨ Highly Competitive Candidate! Your SAT (${sat}) and IELTS (${ielts}) comfortably exceed the competitive admission baselines for ${universityName}. Your metrics place you in the top tier of international applications!`
      });
    } else if (sat >= targetSat - 80 && ielts >= targetIelts - 0.5) {
      setEligibilityResult({
        status: 'warn',
        text: `⚠️ Strong Candidate with Potential. Your scores are within range of historical acceptances. Focus on drafting a persuasive personal essay and secure strong counselor recommendations to bridge any minor score delta.`
      });
    } else {
      setEligibilityResult({
        status: 'warn',
        text: `⚠️ Minimum Threshold Review. Your scores are slightly below the highly selective ranges for this cycle. We highly recommend utilizing our Test Prep Hub (top menu) to schedule another exam attempt, or submit secondary EmSAT test scores as equivalencies.`
      });
    }
  };

  // Populate form with current values when editing year changes
  useEffect(() => {
    const currentDataSet = config.commonDataSets.find(d => d.year === editingYear);
    if (currentDataSet) {
      setInputEnrollment(currentDataSet.enrollment.toString());
      setInputGpa(currentDataSet.avgGpa.toString());
      setInputSat(currentDataSet.avgSat.toString());
      setInputAcceptance(currentDataSet.acceptanceRate.toString());
    }
  }, [editingYear, config]);

  // Commit updated/uploaded data to state and localStorage
  const handleSaveCDS = () => {
    const enroll = parseInt(inputEnrollment);
    const gpa = parseFloat(inputGpa);
    const sat = parseInt(inputSat);
    const acceptance = parseFloat(inputAcceptance);

    if (isNaN(enroll) || isNaN(gpa) || isNaN(sat) || isNaN(acceptance)) {
      alert("Please ensure all inputs contain valid numerical parameters.");
      return;
    }

    const updatedDataSets = config.commonDataSets.map(dataset => {
      if (dataset.year === editingYear) {
        return {
          year: editingYear,
          enrollment: enroll,
          avgGpa: gpa,
          avgSat: sat,
          acceptanceRate: acceptance
        };
      }
      return dataset;
    });

    // Save
    setConfig(prev => ({ ...prev, commonDataSets: updatedDataSets }));
    localStorage.setItem(`cds_override_${universityId}`, JSON.stringify(updatedDataSets));
    
    setSuccessToast(`Common Data Set for academic year ${editingYear} successfully saved!`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  // Handle Simulated CSV/PDF Drag and Drop Upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateParsing(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateParsing(file.name);
    }
  };

  const simulateParsing = (filename: string) => {
    setParsedFileName(filename);
    setParsingState('parsing');
    
    // Simulate smart parsing delay
    setTimeout(() => {
      setParsingState('success');
      
      // Auto-populate with realistic, slightly modified data based on the selected year
      if (editingYear === '2025') {
        setInputEnrollment((config.commonDataSets[0].enrollment + 25).toString());
        setInputGpa("3.91");
        setInputSat((config.commonDataSets[0].avgSat + 15).toString());
        setInputAcceptance((config.commonDataSets[0].acceptanceRate - 0.4).toString());
      } else {
        setInputEnrollment("1040");
        setInputGpa("3.82");
        setInputSat("1410");
        setInputAcceptance("15.5");
      }
      
      setSuccessToast(`Successfully parsed and extracted parameters from "${filename}"! Review extracted fields below and click Save.`);
      setTimeout(() => setSuccessToast(null), 8000);
    }, 1800);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText('');
      alert(`Your admissions inquiry regarding "${selectedProgram}" has been securely routed to counselor ${config.counselor.name}. They will respond to your registered student email address within 24 working hours.`);
    }, 1000);
  };

  return (
    <div className="space-y-8" id="university-expanded-section">
      
      {/* Premium Tab Bar Controls */}
      <div className="bg-white border border-hairline-mist rounded-[32px] p-2 flex flex-wrap gap-1 shadow-sm">
        {(['programs', 'professors', 'exams', 'counselor', 'cds', 'budget'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 min-w-[120px] px-5 py-3 rounded-[24px] font-sans text-xs uppercase tracking-wider font-bold transition-all select-none cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === tab
                ? 'bg-ink text-[#f5f1e4] shadow-sm'
                : 'text-stone-gray hover:text-ink hover:bg-stone-50'
            }`}
          >
            {tab === 'programs' && <BookOpen className="w-4 h-4" />}
            {tab === 'professors' && <GraduationCap className="w-4 h-4 text-[#2ba0ff]" />}
            {tab === 'exams' && <Award className="w-4 h-4" />}
            {tab === 'counselor' && <UserCheck className="w-4 h-4" />}
            {tab === 'cds' && <FileSpreadsheet className="w-4 h-4" />}
            {tab === 'budget' && <Sparkles className="w-4 h-4 text-[#8ed462]" />}
            <span>
              {tab === 'programs' && 'Programs & QS Ranking'}
              {tab === 'professors' && 'Course & Top Professors'}
              {tab === 'exams' && 'Exams & Requirements'}
              {tab === 'counselor' && 'Student Counselor'}
              {tab === 'cds' && 'Common Data Sets'}
              {tab === 'budget' && 'Cost Calculator'}
            </span>
          </button>
        ))}
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="p-4 bg-[#8ed462]/10 border border-[#8ed462]/20 rounded-2xl flex items-start gap-3 animate-fade-in">
          <Check className="w-5 h-5 text-[#4da81b] shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-ink font-semibold leading-relaxed">
            {successToast}
          </p>
        </div>
      )}

      {/* TAB 1: Programs offered & QS Ranking */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Programs offered list (Left) */}
          <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] md:col-span-7 space-y-6">
            <div>
              <span className="font-mono text-[9px] uppercase font-bold text-[#ff705d] tracking-wider block mb-1">Official Curriculum</span>
              <h4 className="font-sans font-black text-xl uppercase tracking-tight text-ink flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-stone-600" /> Degrees & Programs Offered
              </h4>
              <p className="font-sans text-stone-gray text-xs leading-relaxed mt-1.5">
                Select your intended major to check admissions counselor availability and sync study timelines.
              </p>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
              {config.topPrograms.map((prog, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedProgram(prog.name)}
                  className={`p-4 border rounded-2xl transition-all select-none cursor-pointer flex justify-between items-center ${
                    selectedProgram === prog.name
                      ? 'bg-[#8ed462]/15 border-[#8ed462] shadow-sm'
                      : 'bg-stone-50 border-stone-100 hover:bg-stone-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-extrabold text-xs text-ink leading-tight">{prog.name}</span>
                      {prog.isTopFeatured && (
                        <span className="px-1.5 py-0.2 bg-[#f5e211]/20 border border-[#f5e211]/40 rounded text-[8px] text-ink font-mono font-bold uppercase">QS Elite</span>
                      )}
                    </div>
                    <div className="flex gap-3 text-[10px] text-stone-gray font-sans font-medium">
                      <span>Degree: {prog.degree}</span>
                      <span>•</span>
                      <span>Duration: {prog.duration}</span>
                    </div>
                  </div>
                  <div className="shrink-0 pl-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedProgram === prog.name ? 'border-[#8ed462] bg-[#8ed462]' : 'border-stone-300'}`}>
                      {selectedProgram === prog.name && <Check className="w-3.5 h-3.5 text-ink" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* QS Ranking & Featured Programs (Right) */}
          <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] md:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <span className="font-mono text-[9px] uppercase font-bold text-[#8ed462] tracking-wider block mb-1">QS Rankings Directory</span>
                <h4 className="font-sans font-black text-xl uppercase tracking-tight text-ink flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#f5e211] fill-[#f5e211]" /> Top QS World Rankings
                </h4>
                <p className="font-sans text-stone-gray text-xs leading-relaxed mt-1">
                  Recognized global academic standing in highly selective disciplines.
                </p>
              </div>

              <div className="space-y-3.5">
                {config.topPrograms.filter(p => p.isTopFeatured).map((prog, idx) => (
                  <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                    <div className="font-sans font-bold text-xs text-ink leading-tight">{prog.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-stone-gray font-sans uppercase">QS Specialty Rank:</span>
                      <span className="font-mono text-[10px] font-bold text-ink bg-[#f5e211]/30 border border-[#f5e211]/40 px-2.5 py-0.5 rounded-full">
                        {prog.qsRanking}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-[11px] text-stone-gray leading-relaxed flex gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Choosing an elite QS listed program substantially enhances priority eligibility index for government sponsored national graduate scholarships.</span>
            </div>
          </Card>

        </div>
      )}

      {/* TAB 2: Course Selection & Top World-Ranked Professors */}
      {activeTab === 'professors' && (
        <div className="animate-fade-in">
          <CourseProfessorExplorer universityId={universityId} universityName={universityName} />
        </div>
      )}

      {/* TAB 3: Exams & Requirements */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Exam Requirements Matrix */}
          <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] md:col-span-7 space-y-6">
            <div>
              <span className="font-mono text-[9px] uppercase font-bold text-[#ff705d] tracking-wider block mb-1">Standardized Thresholds</span>
              <h4 className="font-sans font-black text-xl uppercase tracking-tight text-ink">
                Mandatory Examinations & Equivalencies
              </h4>
              <p className="font-sans text-stone-gray text-xs leading-relaxed mt-1.5">
                The university admissions office verifies academic benchmarks against standardized local and international exams.
              </p>
            </div>

            <div className="space-y-4">
              {/* SAT */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#ff705d]/10 border border-[#ff705d]/30 flex items-center justify-center font-mono text-[10px] font-black text-ink shrink-0">SAT</div>
                <div className="min-w-0">
                  <h5 className="font-sans font-bold text-xs text-ink uppercase tracking-wide">Scholastic Assessment Test (SAT)</h5>
                  <p className="font-sans text-[11px] text-stone-gray mt-0.5 leading-relaxed">
                    Requirement: <span className="text-ink font-semibold">{config.examCriteria.sat}</span>
                  </p>
                </div>
              </div>

              {/* IELTS */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#8ed462]/15 border border-[#8ed462]/35 flex items-center justify-center font-mono text-[10px] font-black text-ink shrink-0">IELTS</div>
                <div className="min-w-0">
                  <h5 className="font-sans font-bold text-xs text-ink uppercase tracking-wide">English Language Proficiency (IELTS)</h5>
                  <p className="font-sans text-[11px] text-stone-gray mt-0.5 leading-relaxed">
                    Requirement: <span className="text-ink font-semibold">{config.examCriteria.ielts}</span>
                  </p>
                </div>
              </div>

              {/* Cambridge Test */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-mono text-[10px] font-black text-ink shrink-0">C1</div>
                <div className="min-w-0">
                  <h5 className="font-sans font-bold text-xs text-ink uppercase tracking-wide">Cambridge Test (C1/C2 Standard)</h5>
                  <p className="font-sans text-[11px] text-stone-gray mt-0.5 leading-relaxed">
                    Requirement: <span className="text-ink font-semibold">{config.examCriteria.cambridge}</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Eligibility score calculator */}
          <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] md:col-span-5 space-y-5">
            <div>
              <span className="font-mono text-[9px] uppercase font-bold text-[#8ed462] tracking-wider block mb-1">Admissions Sandbox</span>
              <h4 className="font-sans font-black text-xl uppercase tracking-tight text-ink flex items-center gap-2">
                <Layers className="w-5 h-5 text-stone-600" /> Score Eligibility Matcher
              </h4>
              <p className="font-sans text-stone-gray text-xs leading-relaxed mt-1">
                Enter your test scores to instantly evaluate if your academic profile aligns with target admissions.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block font-sans text-[9px] font-bold text-stone-gray uppercase mb-1">Your SAT Score (400 - 1600)</label>
                <input
                  type="number"
                  placeholder="e.g. 1420"
                  value={userSatScore}
                  onChange={(e) => setUserSatScore(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-hairline-mist rounded-xl font-sans text-xs outline-none focus:border-[#ff705d] text-ink"
                />
              </div>

              <div>
                <label className="block font-sans text-[9px] font-bold text-stone-gray uppercase mb-1">Your IELTS Band (1.0 - 9.0)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 7.0"
                  value={userIeltsScore}
                  onChange={(e) => setUserIeltsScore(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-hairline-mist rounded-xl font-sans text-xs outline-none focus:border-[#ff705d] text-ink"
                />
              </div>

              <Button
                onClick={handleCheckEligibility}
                variant="primary"
                className="w-full justify-center gap-1.5 rounded-full py-2.5 text-xs font-bold uppercase cursor-pointer"
              >
                Calculate Eligibility Profile
              </Button>

              {eligibilityResult && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  eligibilityResult.status === 'meet' 
                    ? 'bg-[#8ed462]/10 border-[#8ed462]/30 text-ink'
                    : eligibilityResult.status === 'warn'
                    ? 'bg-[#f5e211]/10 border-[#f5e211]/30 text-ink'
                    : 'bg-stone-50 border-stone-200 text-stone-gray'
                }`}>
                  <p className="font-sans font-medium">{eligibilityResult.text}</p>
                </div>
              )}
            </div>
          </Card>

        </div>
      )}

      {/* TAB 3: Highlight student counselor */}
      {activeTab === 'counselor' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Assigned Counselor Details (Left) */}
          <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] md:col-span-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <img
                src={config.counselor.image}
                alt={config.counselor.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-ink shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="text-center sm:text-left min-w-0">
                <span className="px-3 py-1 bg-[#8ed462]/15 border border-[#8ed462]/35 rounded-full text-ink font-mono text-[9px] font-bold uppercase tracking-wider">
                  Official Representative
                </span>
                <h4 className="font-sans font-black text-2xl uppercase tracking-tight text-ink mt-2.5">
                  {config.counselor.name}
                </h4>
                <p className="font-sans text-xs text-stone-gray font-bold uppercase tracking-wide mt-0.5">
                  {config.counselor.role}
                </p>
                <p className="font-sans text-stone-gray text-xs mt-2 italic leading-relaxed">
                  "Let's align your high school curriculum, exams transcripts, and portfolio milestones to secure admission and merit scholarships."
                </p>
              </div>
            </div>

            {/* Selected interested Program Alert */}
            <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-sans font-black text-[10px] text-indigo-950 uppercase tracking-wide">Program Selected for Admission</span>
              </div>
              <p className="font-sans text-[11px] text-indigo-900 leading-normal font-semibold">
                Interested in: <strong className="underline text-indigo-950 font-bold">{selectedProgram}</strong>
              </p>
              <div className="pt-2 text-[10px] text-indigo-700/80 font-sans leading-normal">
                ✨ Direct Counselor Connection Available! {config.counselor.name} is the designated expert for this specific program pathway.
              </div>
            </div>

            {/* Specialties and contacts */}
            <div className="space-y-4 pt-2 border-t border-hairline-mist">
              <div className="space-y-1.5">
                <span className="block font-sans text-[9px] font-bold text-stone-gray uppercase tracking-wider">Expertise Sectors:</span>
                <div className="flex flex-wrap gap-1.5">
                  {config.counselor.specialties.map((spec, i) => (
                    <span key={i} className="font-sans text-[9px] font-bold bg-stone-50 border border-stone-200 text-[#ff705d] px-2.5 py-0.5 rounded-full uppercase">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 font-sans text-xs text-stone-gray">
                <div className="p-3 border border-stone-100 rounded-xl space-y-0.5">
                  <span className="font-bold text-[9px] text-stone-400 block uppercase">Email</span>
                  <span className="font-semibold text-ink break-all select-all">{config.counselor.email}</span>
                </div>
                <div className="p-3 border border-stone-100 rounded-xl space-y-0.5">
                  <span className="font-bold text-[9px] text-stone-400 block uppercase">Phone</span>
                  <span className="font-semibold text-ink break-all">{config.counselor.phone}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Counselor Instant Inquiry Form (Right) */}
          <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] md:col-span-6 space-y-5">
            <div>
              <span className="font-mono text-[9px] uppercase font-bold text-[#ff705d] tracking-wider block mb-1">Direct Communication</span>
              <h4 className="font-sans font-black text-xl uppercase tracking-tight text-ink flex items-center gap-2">
                <Send className="w-5 h-5 text-stone-600" /> Dispatch Admissions Inquiry
              </h4>
              <p className="font-sans text-stone-gray text-xs leading-relaxed mt-1">
                Ask a direct question regarding eligibility, document review, or credit transfers for your chosen program.
              </p>
            </div>

            <form onSubmit={handleSendInquiry} className="space-y-4">
              <div>
                <label className="block font-sans text-[9px] font-bold text-stone-gray uppercase mb-1">Selected Program of Interest</label>
                <input
                  type="text"
                  value={selectedProgram}
                  disabled
                  className="w-full px-3 py-2 bg-stone-50 border border-hairline-mist rounded-xl font-sans text-xs font-semibold text-ink outline-none cursor-not-allowed opacity-80"
                />
              </div>

              <div>
                <label className="block font-sans text-[9px] font-bold text-stone-gray uppercase mb-1">Compose Message for {config.counselor.name}</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Introduce your academic background, list your school curriculum, and detail your specific admissions query..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-hairline-mist rounded-xl font-sans text-xs outline-none focus:border-[#ff705d] text-ink resize-none leading-relaxed placeholder:text-stone-400"
                />
              </div>

              <Button
                type="submit"
                disabled={messageSent}
                variant="primary"
                className="w-full justify-center gap-1.5 rounded-full py-2.5 text-xs font-bold uppercase cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Secure Inquiry</span>
              </Button>
            </form>
          </Card>

        </div>
      )}

      {/* TAB 4: Common Data Sets (CDS) for last 3 years */}
      {activeTab === 'cds' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Three Year Comparison Grid (Left) */}
          <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase font-bold text-[#8ed462] tracking-wider block mb-1">Institutional Transparency</span>
                <h4 className="font-sans font-black text-xl uppercase tracking-tight text-ink flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#8ed462]" /> Common Data Sets (CDS)
                </h4>
                <p className="font-sans text-stone-gray text-xs leading-relaxed mt-1">
                  Comparative intake metrics compiled for the last three consecutive academic years.
                </p>
              </div>

              {/* Reset overrides shortcut */}
              <button
                onClick={() => {
                  localStorage.removeItem(`cds_override_${universityId}`);
                  setConfig(UNIVERSITY_PRESETS[presetKey]);
                  setSuccessToast("Successfully reset Common Data Set to official baseline values!");
                  setTimeout(() => setSuccessToast(null), 4000);
                }}
                className="text-[10px] uppercase font-bold text-stone-gray hover:text-[#ff705d] flex items-center gap-1 transition-colors select-none cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset baseline
              </button>
            </div>

            {/* Multi-Year Data Table */}
            <div className="overflow-x-auto border border-hairline-mist rounded-2xl bg-white shadow-sm">
              <table className="w-full font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-hairline-mist text-stone-gray font-bold uppercase tracking-wider text-[9px] text-left">
                    <th className="p-3.5 pl-4">Academic Year</th>
                    <th className="p-3.5">Total Enrollment</th>
                    <th className="p-3.5">Average GPA</th>
                    <th className="p-3.5">Average SAT</th>
                    <th className="p-3.5 pr-4">Acceptance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-ink">
                  {config.commonDataSets.map((dataset) => (
                    <tr key={dataset.year} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3.5 pl-4 font-black">Intake {dataset.year}</td>
                      <td className="p-3.5 font-mono">{dataset.enrollment.toLocaleString()} students</td>
                      <td className="p-3.5 font-mono">{dataset.avgGpa.toFixed(2)} / 4.00</td>
                      <td className="p-3.5 font-mono">{dataset.avgSat} pts</td>
                      <td className="p-3.5 pr-4">
                        <span className="font-mono bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-[10px]">
                          {dataset.acceptanceRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visual comparison insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <span className="font-sans text-[9px] font-bold text-stone-gray block uppercase">Enrollment Trend (3-Yr Delta)</span>
                <p className="font-sans text-xs text-ink font-semibold">
                  Intake has grown by <strong>{Math.round(((config.commonDataSets[0].enrollment - config.commonDataSets[2].enrollment) / config.commonDataSets[2].enrollment) * 100)}%</strong> from {config.commonDataSets[2].year} to {config.commonDataSets[0].year}, highlighting expanding campus facilities.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <span className="font-sans text-[9px] font-bold text-stone-gray block uppercase">Selectivity Index Status</span>
                <p className="font-sans text-xs text-ink font-semibold">
                  {config.commonDataSets[0].acceptanceRate <= 5 
                    ? "Classification: Elite Tier Selectivity. Requires rigorous academic portfolios, flawless essays, and superior standardized scores." 
                    : "Classification: Standard Competitive Selectivity. Highly accessible for students meeting MoE equivalent curriculum guidelines."}
                </p>
              </div>
            </div>
          </Card>

          {/* Manual CDS Data Customizer Console (Right) */}
          <Card className="bg-white border border-hairline-mist p-6 rounded-[32px] lg:col-span-5 space-y-5">
            <div>
              <span className="font-mono text-[9px] uppercase font-bold text-[#ff705d] tracking-wider block mb-1">Administrative Console</span>
              <h4 className="font-sans font-black text-xl uppercase tracking-tight text-ink flex items-center gap-2">
                <Upload className="w-5 h-5 text-stone-600" /> Manual Data Customizer
              </h4>
              <p className="font-sans text-stone-gray text-xs leading-relaxed mt-1">
                Upload official Common Data Set reports or manually enter intake updates to persist local custom modifications.
              </p>
            </div>

            {/* Interactive Year Selector */}
            <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl">
              {(['2025', '2024', '2023'] as const).map(yr => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setEditingYear(yr)}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all select-none cursor-pointer ${
                    editingYear === yr ? 'bg-white text-ink shadow-xs' : 'text-stone-gray hover:text-ink'
                  }`}
                >
                  Intake {yr}
                </button>
              ))}
            </div>

            {/* Drag & Drop File Upload Sandbox */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all relative ${
                isDragging ? 'border-[#8ed462] bg-[#8ed462]/10' : 'border-stone-200 hover:border-[#ff705d] bg-stone-50'
              }`}
            >
              <input
                type="file"
                id="cds-file-picker"
                accept=".csv,.json,.pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              <label htmlFor="cds-file-picker" className="cursor-pointer space-y-1.5 block">
                {parsingState === 'idle' && (
                  <>
                    <Upload className="w-7 h-7 mx-auto text-stone-400" />
                    <p className="font-sans font-bold text-[10px] uppercase text-ink">Upload CSV/PDF Common Data Set</p>
                    <p className="font-sans text-[9px] text-stone-gray">Drag & drop or click to upload</p>
                  </>
                )}
                {parsingState === 'parsing' && (
                  <>
                    <RefreshCw className="w-7 h-7 mx-auto text-[#ff705d] animate-spin" />
                    <p className="font-sans font-bold text-[10px] uppercase text-ink">Parsing CDS Document...</p>
                    <p className="font-mono text-[8px] text-[#ff705d]">{parsedFileName}</p>
                  </>
                )}
                {parsingState === 'success' && (
                  <>
                    <CheckCircle2 className="w-7 h-7 mx-auto text-[#8ed462]" />
                    <p className="font-sans font-bold text-[10px] uppercase text-[#4da81b]">Extracted successfully!</p>
                    <p className="font-sans text-[9px] text-stone-gray">{parsedFileName}</p>
                  </>
                )}
              </label>
            </div>

            {/* Manual Form Entry fields */}
            <div className="space-y-3.5 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-sans text-[9px] font-bold text-stone-gray uppercase mb-1">Total Enrollment</label>
                  <input
                    type="number"
                    value={inputEnrollment}
                    onChange={(e) => setInputEnrollment(e.target.value)}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-hairline-mist rounded-xl font-sans text-xs outline-none text-ink font-mono"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[9px] font-bold text-stone-gray uppercase mb-1">Average GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputGpa}
                    onChange={(e) => setInputGpa(e.target.value)}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-hairline-mist rounded-xl font-sans text-xs outline-none text-ink font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-sans text-[9px] font-bold text-stone-gray uppercase mb-1">Average SAT</label>
                  <input
                    type="number"
                    value={inputSat}
                    onChange={(e) => setInputSat(e.target.value)}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-hairline-mist rounded-xl font-sans text-xs outline-none text-ink font-mono"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[9px] font-bold text-stone-gray uppercase mb-1">Acceptance Rate %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputAcceptance}
                    onChange={(e) => setInputAcceptance(e.target.value)}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-hairline-mist rounded-xl font-sans text-xs outline-none text-ink font-mono"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveCDS}
                variant="primary"
                className="w-full justify-center gap-1.5 bg-[#8ed462] border-transparent text-ink hover:bg-[#8ed462]/90 rounded-full py-2 text-xs font-bold uppercase cursor-pointer"
              >
                Save Intake {editingYear} Override
              </Button>
            </div>
          </Card>

        </div>
      )}

      {/* TAB 5: Student Budget Calculator */}
      {activeTab === ('budget' as any) && (
        <div className="animate-fade-in">
          <BudgetCalculator universityName={universityName} />
        </div>
      )}

    </div>
  );
}
