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
}

export interface School {
  id: string;
  name: string;
  curriculum: string;
  emirate: string;
  rating: string;
  tuitionRange: string;
}

export interface Program {
  id: string;
  title: string;
  organizer: string;
  type: "Hackathon" | "Course" | "Fellowship" | "Summer School";
  eligibility: string;
  deadline: string;
  link: string;
}

export interface Perk {
  id: string;
  title: string;
  provider: string;
  description: string;
  category: "Software" | "Hardware" | "Food" | "Entertainment";
  link: string;
}
