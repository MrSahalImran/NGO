// User and Authentication Types
export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: User; message?: string }>;
  register: (
    userData: any
  ) => Promise<{ success: boolean; user?: User; message?: string }>;
  logout: () => void;
  loading: boolean;
  isAdmin: () => boolean;
}

// NGO Information Types
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

// Testimonials and News Types
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  message: string;
  image: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: string;
}

// Registration Types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: Address;
}

export interface Availability {
  preferredDays: string[];
  timeCommitment: string;
  startDate: string;
}

export interface Registration {
  _id?: string;
  personalInfo: PersonalInfo;
  availability: Availability;
  skills: string[];
  interests: string[];
  experience?: string;
  motivation?: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// Payment Types
export interface DonorInfo {
  name: string;
  email: string;
  message?: string;
}

export interface Payment {
  _id?: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
  donorInfo: DonorInfo;
  paymentMethod?: string;
  receiptUrl?: string;
  createdAt?: string;
  completedAt?: string;
}

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

// Dashboard Types
export interface DashboardStats {
  totalVolunteers: number;
  pendingApplications: number;
  totalDonations: number;
  monthlyDonations: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentRegistrations: Registration[];
  recentPayments: Payment[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

// Form Props Types
export interface FormErrors {
  [key: string]: string;
}

// Stripe Types
export interface StripeFormData {
  amount: number;
  donorInfo: DonorInfo;
}

// Component Props Types
export interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export interface PaymentFormProps {
  onSuccess: (payment: Payment) => void;
}

// Utility Types
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
