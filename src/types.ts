export interface GroundedOverview {
  text: string;
  groundingChunks?: any[];
  webSearchQueries?: string[];
}

export interface GroundedLocation {
  text: string;
  groundingChunks?: any[];
}

export interface University {
  id: string;
  name: string;
  domain: string;
  location: string;
  type: string;
  description: string;
  tuitionFee: number | string;
  acceptanceRate?: number | string;
  intakes: string[];
  lastUpdated?: string;
  groundedOverview?: GroundedOverview;
  groundedLocation?: GroundedLocation;
}

export interface School {
  id: string;
  name: string;
  domain: string;
  curriculum: string;
  emirate: string;
  country: string;
  rating: string;
  tuitionRange: string;
  description?: string;
  ranking?: number;
  groundedOverview?: GroundedOverview;
  groundedLocation?: GroundedLocation;
}

export interface Program {
  id: string;
  title: string;
  organizer: string;
  domain?: string;
  type: "Hackathon" | "Course" | "Fellowship" | "Summer School";
  eligibility: string;
  deadline: string;
  link: string;
  groundedOverview?: GroundedOverview;
  groundedLocation?: GroundedLocation;
}

export interface Perk {
  id: string;
  title: string;
  provider: string;
  domain?: string;
  description: string;
  category: "AI & ML" | "Development Tools" | "Design & Creative" | "Learning & Education" | "Media & Entertainment" | "Cloud & Hosting" | "Productivity" | "Apparel" | "Travel" | "Software" | "Hardware" | "Food" | "Entertainment";
  link: string;
  groundedOverview?: GroundedOverview;
  groundedLocation?: GroundedLocation;
}
