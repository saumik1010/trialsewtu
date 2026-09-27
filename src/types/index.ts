export type Role = 'customer' | 'worker' | 'cooperative';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  location: string;
  locality?: string;
  avatar?: string;
}

export interface WorkerCertification {
  title: string;
  issuer: string;
  year: string;
  verified: boolean;
}

export interface WorkerRatingReview {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  date: string;
  serviceQuality?: number;
  punctuality?: number;
  cleanliness?: number;
}

export interface EarningHistoryRecord {
  month: string;
  jobs: number;
  earnings: number;
}

export interface WorkerProfile extends User {
  role: 'worker';
  skills: string[];
  experience: number; // years
  rating: number;
  completedJobs: number;
  status: 'available' | 'busy' | 'offline';
  cooperativeId: string;
  gender: 'male' | 'female' | 'other';
  earnings: number;
  serviceLocality: string;
  serviceRadius: number; // km
  coordinates: { lat: number; lng: number };
  isWomenWorker?: boolean;
  workload: number; // active jobs count
  languages: string[];
  certifications: WorkerCertification[];
  earningsHistory: EarningHistoryRecord[];
  verifiedDocuments: { type: string; idMasked: string; verified: boolean }[];
  reviews: WorkerRatingReview[];
}

export interface CooperativeProfile extends User {
  role: 'cooperative';
  region: string;
}

export interface JobMedia {
  type: 'image' | 'video';
  url: string;
  label: string;
}

export interface JobFeedback {
  rating: number;
  serviceQuality: number;
  professionalBehaviour: number;
  punctuality: number;
  communication: number;
  cleanliness: number;
  wouldRequestAgain: boolean;
  writtenFeedback: string;
  photoUrl?: string;
  submittedAt: string;
}

export interface JobPayment {
  method: 'upi' | 'card' | 'netbanking';
  transactionId: string;
  paidAt: string;
  amount: number;
  invoiceNumber: string;
}

export interface Job {
  id: string;
  customerId: string;
  workerId?: string;
  cooperativeId?: string;
  service: string;
  description: string;
  address: string;
  locality: string;
  coordinates: { lat: number; lng: number };
  priority: 'normal' | 'urgent' | 'emergency';
  status: 'requested' | 'assigned' | 'accepted' | 'on_the_way' | 'arrived' | 'started' | 'completed' | 'cancelled';
  price: number;
  extraCharges?: { description: string; amount: number; approved: boolean };
  scheduledDate: string;
  createdAt: string;
  preference?: 'any' | 'women_preferred';
  media?: JobMedia[];
  workProof?: {
    beforePhoto?: string;
    afterPhoto?: string;
    notes?: string;
  };
  payment?: JobPayment;
  feedback?: JobFeedback;
  matchReasons?: string[];
  estimatedDistanceKm?: number;
  estimatedTravelMins?: number;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string;
  documents: string[];
  documentsRequired?: string[];
  officialUrl: string;
  category: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  role: Role | 'all';
  title: string;
  message: string;
  type: 'job' | 'training' | 'payment' | 'alert' | 'system' | 'whatsapp';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Training {
  id: string;
  name: string;
  title?: string;
  skill: string;
  trade?: string;
  description?: string;
  trainer: string;
  startDate: string;
  endDate: string;
  date?: string;
  location?: string;
  duration: string;
  seats: number;
  availableSeats?: number;
  totalSeats?: number;
  enrolledWorkerIds: string[];
  status: 'upcoming' | 'active' | 'completed';
  certificateTitle?: string;
  certification?: string;
  enrolled?: boolean;
}

export interface InstitutionalContract {
  id: string;
  institutionName: string;
  clientName?: string;
  title?: string;
  workType: string;
  workersRequired: number;
  location: string;
  startDate: string;
  budget: number;
  value?: number;
  slaResponseTime?: string;
  scope?: string;
  status: 'upcoming' | 'active' | 'completed';
  assignedWorkerIds: string[];
  assignedWorkers?: string[];
}

export interface MassHiring {
  id: string;
  organization: string;
  clientName?: string;
  title?: string;
  requiredWorkers: number;
  workerCount?: number;
  skills: string[];
  trade?: string;
  location: string;
  paymentBudget: string;
  dailyRate?: number;
  duration?: string;
  requirements?: string[];
  status: 'open' | 'applied' | 'closed' | 'deployed';
  appliedWorkerIds: string[];
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'Power Tools' | 'Ladders & Access' | 'Plumbing Tools' | 'Cleaning Machines' | 'Safety Gear' | 'Painting Tools';
  condition: 'New' | 'Like New' | 'Good';
  type: 'buy' | 'rent' | 'both';
  buyPrice?: number;
  rentalPricePerDay?: number;
  dailyRate?: number;
  location: string;
  currentLocation?: string;
  distanceKm: number;
  ownerName: string;
  ownerPhone: string;
  available: boolean;
  borrowedBy?: string;
  description: string;
  imageUrl: string;
}

export interface IncidentReport {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  incidentType: 'Safety Threat' | 'Workplace Injury' | 'Customer Harassment' | 'Payment Dispute' | 'Damage Claim' | 'Other';
  location: string;
  description: string;
  bookingId?: string;
  photoUrl?: string;
  status: 'Submitted' | 'Under Review' | 'Action Taken' | 'Resolved';
  createdAt: string;
  reportedAt?: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  bookingId?: string;
  subject: string;
  details: string;
  status: 'Submitted' | 'Under Review' | 'Action Taken' | 'Resolved';
  createdAt: string;
  resolutionNotes?: string;
}

export type Grievance = Complaint;

export interface NotificationPreferences {
  inApp: boolean;
  whatsapp: boolean;
  sms: boolean;
  voiceIvr: boolean;
  phone: string;
}
