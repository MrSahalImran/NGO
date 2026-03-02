export interface Program {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Impact {
  beneficiaries: number;
  projects: number;
  volunteers: number;
  yearsActive: number;
}

export interface Contact {
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

export interface NGOInfo {
  name: string;
  mission: string;
  vision: string;
  founded: string;
  description: string;
  programs: Program[];
  impact: Impact;
  contact: Contact;
  socialMedia: SocialMedia;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  message: string;
  image?: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: string;
}
