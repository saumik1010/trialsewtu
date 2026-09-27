import { create } from 'zustand';
import { 
  User, 
  WorkerProfile, 
  CooperativeProfile, 
  Job, 
  GovernmentScheme, 
  AppNotification, 
  Training, 
  InstitutionalContract, 
  MassHiring, 
  EquipmentItem, 
  IncidentReport, 
  Complaint, 
  NotificationPreferences,
  JobFeedback,
  JobPayment
} from '../types';

interface AppState {
  currentUser: User | null;
  users: (User | WorkerProfile | CooperativeProfile)[];
  jobs: Job[];
  schemes: GovernmentScheme[];
  notifications: AppNotification[];
  trainings: Training[];
  contracts: InstitutionalContract[];
  massHirings: MassHiring[];
  equipments: EquipmentItem[];
  equipment: EquipmentItem[];
  incidents: IncidentReport[];
  complaints: Complaint[];
  grievances?: Complaint[];
  selectedWorkerForBooking?: string | null;
  notificationPreferences: NotificationPreferences;
  whatsAppLogs: { id: string; phone: string; message: string; timestamp: string; status: 'Delivered' | 'Queued' }[];
  
  // Auth Actions
  login: (email: string) => void;
  logout: () => void;
  
  // Customer & Matching Actions
  selectWorkerForBooking: (workerId: string) => void;
  bookService: (jobData: Omit<Job, 'id' | 'status' | 'createdAt' | 'customerId'>) => Job;
  findBestWorkerMatch: (service: string, locality: string, womenPreferred: boolean) => { worker: WorkerProfile | null; reasons: string[]; distanceKm: number; travelMins: number };
  submitFeedback: (jobId: string, feedback: JobFeedback) => void;
  respondExtraCharges: (jobId: string, approve: boolean) => void;
  payJob: (jobId: string, payment: JobPayment) => void;
  
  // Worker Actions
  updateWorkerStatus: (status: WorkerProfile['status']) => void;
  acceptJob: (jobId: string) => void;
  declineJob: (jobId: string) => void;
  updateJobStatus: (jobId: string, status: Job['status'], workProof?: Job['workProof']) => void;
  requestExtraCharges: (jobId: string, description: string, amount: number) => void;
  enrollTraining: (trainingId: string) => void;
  
  // Cooperative Actions
  assignWorker: (jobId: string, workerId: string) => void;
  assignJobToWorker: (jobId: string, workerId: string) => void;
  assignWorkerManually: (jobId: string, workerId: string) => void;
  createTraining: (trainingData: Omit<Training, 'id' | 'enrolledWorkerIds' | 'status'>) => void;
  enrollInTraining: (trainingId: string, workerId: string) => void;
  completeTrainingForWorker: (trainingId: string, workerId: string) => void;
  assignInstitutionalWorker: (contractId: string, workerId: string) => void;
  applyForMassHiring: (massHiringId: string, workerId: string) => void;
  deployMassHiring: (massHiringId: string) => void;
  
  // Equipment Actions
  addEquipment: (item: Omit<EquipmentItem, 'id'>) => void;
  toggleEquipmentAvailability: (id: string) => void;
  borrowEquipment: (id: string, memberName?: string) => void;
  returnEquipment: (id: string) => void;
  
  // Incident / Complaint Actions
  submitIncident: (incident: Omit<IncidentReport, 'id' | 'createdAt' | 'status'>) => void;
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => void;
  updateComplaintStatus: (complaintId: string, status: Complaint['status'], notes?: string) => void;
  resolveComplaint: (complaintId: string) => void;
  resolveGrievance: (complaintId: string, notes?: string) => void;
  resolveIncident: (incidentId: string, notes?: string) => void;
  
  // Notification Actions
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  sendWhatsAppMessage: (phone: string, message: string) => void;
}

const mockUsers: (User | WorkerProfile | CooperativeProfile)[] = [
  {
    id: 'c1',
    name: 'Priya Sharma',
    email: 'customer@test.com',
    role: 'customer',
    phone: '+91 98201 44521',
    location: 'Bandra West, Mumbai',
    locality: 'Bandra West',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'c2',
    name: 'Rahul Verma',
    email: 'rahul@test.com',
    role: 'customer',
    phone: '+91 98112 33456',
    location: 'Andheri West, Mumbai',
    locality: 'Andheri West',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'w1',
    name: 'Rajesh Kumar',
    email: 'rajesh@test.com',
    role: 'worker',
    phone: '+91 98765 43211',
    location: 'Andheri West, Mumbai',
    locality: 'Andheri West',
    serviceLocality: 'Andheri West',
    serviceRadius: 10,
    coordinates: { lat: 19.1136, lng: 72.8697 },
    skills: ['Plumbing Solutions', 'Pipe Fitting', 'Sanitary Repair'],
    experience: 6,
    rating: 4.8,
    completedJobs: 127,
    status: 'available',
    cooperativeId: 'coop1',
    gender: 'male',
    earnings: 45000,
    workload: 1,
    languages: ['Hindi', 'Marathi', 'Basic English'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    certifications: [
      { title: 'National Skill Development (NSDC) - Level 4 Plumber', issuer: 'Govt. of India Skill India', year: '2021', verified: true },
      { title: 'Water Leakage & Drainage Specialist', issuer: 'Maharashtra Labour Board', year: '2023', verified: true }
    ],
    verifiedDocuments: [
      { type: 'Aadhaar ID', idMasked: 'XXXX-XXXX-4821', verified: true },
      { type: 'PAN Card', idMasked: 'ABCDE9821K', verified: true },
      { type: 'Police Verification Certificate', idMasked: 'PVC-MUM-88219', verified: true },
      { type: 'Trade Union Member ID', idMasked: 'MLCS-W1048', verified: true }
    ],
    earningsHistory: [
      { month: 'October', jobs: 24, earnings: 34200 },
      { month: 'November', jobs: 28, earnings: 39500 },
      { month: 'December', jobs: 26, earnings: 36800 },
      { month: 'January', jobs: 30, earnings: 42100 },
      { month: 'February', jobs: 27, earnings: 38400 },
      { month: 'March (Active)', jobs: 19, earnings: 28700 },
    ],
    reviews: [
      { id: 'r1', customerName: 'Priya Sharma', rating: 5, review: 'Rajesh fixed the kitchen sink leak quickly. Very clean work and punctual!', date: '2026-03-02', serviceQuality: 5, punctuality: 5, cleanliness: 5 },
      { id: 'r2', customerName: 'Deepak Merchant', rating: 4.8, review: 'Polite, explained the issue with the valve, fair charges.', date: '2026-02-18', serviceQuality: 5, punctuality: 4, cleanliness: 5 }
    ]
  },
  {
    id: 'w2',
    name: 'Sunita Devi',
    email: 'sunita@test.com',
    role: 'worker',
    phone: '+91 98765 43212',
    location: 'Bandra West, Mumbai',
    locality: 'Bandra West',
    serviceLocality: 'Bandra West',
    serviceRadius: 8,
    coordinates: { lat: 19.0596, lng: 72.8295 },
    skills: ['Deep Cleaning', 'Home Care & Nursing', 'Sanitization'],
    experience: 5,
    rating: 4.9,
    completedJobs: 98,
    status: 'available',
    cooperativeId: 'coop1',
    gender: 'female',
    isWomenWorker: true,
    earnings: 38500,
    workload: 0,
    languages: ['Hindi', 'Marathi'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    certifications: [
      { title: 'Certified Home Sanitization & Deep Clean', issuer: 'FICSI Skill Council', year: '2022', verified: true },
      { title: 'Geriatric Patient Care Certificate', issuer: 'Red Cross Society Mumbai', year: '2023', verified: true }
    ],
    verifiedDocuments: [
      { type: 'Aadhaar ID', idMasked: 'XXXX-XXXX-9142', verified: true },
      { type: 'PAN Card', idMasked: 'BFGPA2210M', verified: true },
      { type: 'Police Verification Certificate', idMasked: 'PVC-MUM-99321', verified: true }
    ],
    earningsHistory: [
      { month: 'October', jobs: 20, earnings: 26000 },
      { month: 'November', jobs: 22, earnings: 30200 },
      { month: 'December', jobs: 25, earnings: 34500 },
      { month: 'January', jobs: 28, earnings: 37900 },
      { month: 'February', jobs: 24, earnings: 33100 },
      { month: 'March (Active)', jobs: 18, earnings: 27400 },
    ],
    reviews: [
      { id: 'r3', customerName: 'Ananya Deshmukh', rating: 5, review: 'Sunita did an incredible job deep cleaning our 2BHK apartment. Very trustworthy.', date: '2026-03-08', serviceQuality: 5, punctuality: 5, cleanliness: 5 }
    ]
  },
  {
    id: 'w3',
    name: 'Amit Patel',
    email: 'amit@test.com',
    role: 'worker',
    phone: '+91 98765 43213',
    location: 'Dadar East, Mumbai',
    locality: 'Dadar East',
    serviceLocality: 'Dadar East',
    serviceRadius: 12,
    coordinates: { lat: 19.0178, lng: 72.8478 },
    skills: ['Electrical & Wiring', 'Appliance Repair', 'AC Servicing'],
    experience: 8,
    rating: 4.7,
    completedJobs: 210,
    status: 'busy',
    cooperativeId: 'coop1',
    gender: 'male',
    earnings: 65000,
    workload: 2,
    languages: ['Gujarati', 'Hindi', 'Marathi', 'English'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    certifications: [
      { title: 'Licensed Wireman Grade 1', issuer: 'Public Works Department (PWD)', year: '2019', verified: true },
      { title: 'Inverter & HVAC Technician Diploma', issuer: 'ITI Dadar', year: '2020', verified: true }
    ],
    verifiedDocuments: [
      { type: 'Aadhaar ID', idMasked: 'XXXX-XXXX-6321', verified: true },
      { type: 'PAN Card', idMasked: 'AQZPK7712H', verified: true },
      { type: 'Police Verification Certificate', idMasked: 'PVC-MUM-71234', verified: true }
    ],
    earningsHistory: [
      { month: 'October', jobs: 32, earnings: 46000 },
      { month: 'November', jobs: 35, earnings: 51200 },
      { month: 'December', jobs: 31, earnings: 44800 },
      { month: 'January', jobs: 36, earnings: 54000 },
      { month: 'February', jobs: 34, earnings: 49800 },
      { month: 'March (Active)', jobs: 24, earnings: 38200 },
    ],
    reviews: [
      { id: 'r4', customerName: 'Kunal G.', rating: 4.8, review: 'Troubleshot a complex circuit breaker issue in minutes.', date: '2026-03-01' }
    ]
  },
  {
    id: 'w4',
    name: 'Meena Tai Kamble',
    email: 'meena@test.com',
    role: 'worker',
    phone: '+91 98765 43214',
    location: 'Shastri Nagar, Mumbai',
    locality: 'Shastri Nagar',
    serviceLocality: 'Shastri Nagar',
    serviceRadius: 6,
    coordinates: { lat: 19.0825, lng: 72.8415 },
    skills: ['Deep Cleaning', 'Home Care & Nursing'],
    experience: 7,
    rating: 4.95,
    completedJobs: 160,
    status: 'available',
    cooperativeId: 'coop1',
    gender: 'female',
    isWomenWorker: true,
    earnings: 49000,
    workload: 1,
    languages: ['Marathi', 'Hindi'],
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    certifications: [
      { title: 'Geriatric and Infant Care Certified', issuer: 'Mahila Vikas Mahamandal', year: '2020', verified: true }
    ],
    verifiedDocuments: [
      { type: 'Aadhaar ID', idMasked: 'XXXX-XXXX-1102', verified: true }
    ],
    earningsHistory: [
      { month: 'October', jobs: 26, earnings: 35000 },
      { month: 'November', jobs: 28, earnings: 39000 },
      { month: 'December', jobs: 29, earnings: 41200 },
      { month: 'January', jobs: 31, earnings: 44000 },
      { month: 'February', jobs: 29, earnings: 40500 },
      { month: 'March (Active)', jobs: 21, earnings: 31800 },
    ],
    reviews: []
  },
  {
    id: 'coop1',
    name: 'Mumbai Labour Cooperative Society',
    email: 'admin@coop.com',
    role: 'cooperative',
    phone: '+91 98765 43220',
    location: 'Mumbai Central',
    locality: 'Mumbai Central',
    region: 'Mumbai Metropolitan Region',
  }
];

const mockJobs: Job[] = [
  {
    id: 'j1',
    customerId: 'c1',
    workerId: 'w3',
    cooperativeId: 'coop1',
    service: 'Electrical & Wiring',
    description: 'Ceiling fan regulator sparking and circuit tripping in living room',
    address: 'Flat 402, Shivam Apts, Hill Road, Bandra West',
    locality: 'Bandra West',
    coordinates: { lat: 19.0596, lng: 72.8295 },
    priority: 'normal',
    status: 'completed',
    price: 650,
    scheduledDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80', label: 'Sparking switch board' }
    ],
    workProof: {
      beforePhoto: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
      afterPhoto: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
      notes: 'Replaced faulty 16A modular switch and renewed burnt wiring.'
    },
    payment: {
      method: 'upi',
      transactionId: 'UPI/2026/0315/99824',
      paidAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      amount: 650,
      invoiceNumber: 'INV-SHRAM-2026-0812'
    },
    feedback: {
      rating: 5,
      serviceQuality: 5,
      professionalBehaviour: 5,
      punctuality: 5,
      communication: 5,
      cleanliness: 5,
      wouldRequestAgain: true,
      writtenFeedback: 'Amit was on time, diagnosed the issue safely, and replaced the burnt wiring cleanly.',
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    matchReasons: ['Certified Electrical Skill', 'Coop Quality Rating 4.7', 'Safe wiring compliance']
  },
  {
    id: 'j2',
    customerId: 'c1',
    workerId: 'w1',
    cooperativeId: 'coop1',
    service: 'Plumbing Solutions',
    description: 'Major leak under kitchen sink valve, water collecting on floor',
    address: 'Flat 402, Shivam Apts, Hill Road, Bandra West',
    locality: 'Bandra West',
    coordinates: { lat: 19.0596, lng: 72.8295 },
    priority: 'urgent',
    status: 'accepted',
    price: 750,
    scheduledDate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80', label: 'Leaking pipe joint' }
    ],
    matchReasons: ['Required skill: Plumbing', 'Available now', 'Nearby (2.4 km)', 'Balanced workload candidate'],
    estimatedDistanceKm: 2.4,
    estimatedTravelMins: 12
  },
  {
    id: 'j3',
    customerId: 'c2',
    workerId: 'w2',
    cooperativeId: 'coop1',
    service: 'Deep Cleaning',
    description: 'Post-renovation full 2BHK dusting, chemical bathroom scrub and floor polish',
    address: 'B-12, Green Acres, Lokhandwala, Andheri West',
    locality: 'Andheri West',
    coordinates: { lat: 19.1363, lng: 72.8276 },
    priority: 'normal',
    status: 'on_the_way',
    price: 1800,
    preference: 'women_preferred',
    scheduledDate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80', label: 'Bathroom tiles stain' }
    ],
    matchReasons: ['Verified Women Worker preferred', 'Deep Cleaning certified', 'Nearby service area (1.8 km)', 'Low current workload'],
    estimatedDistanceKm: 1.8,
    estimatedTravelMins: 9
  }
];

const mockSchemes: GovernmentScheme[] = [
  {
    id: 's1',
    name: 'PM SVANidhi Yojana',
    category: 'Credit & Working Capital',
    description: 'Special Micro-Credit Facility Scheme for urban informal and street workers by Ministry of Housing & Urban Affairs.',
    eligibility: [
      'Engaged in unorganized/street trade on or before March 2020',
      'Urban local body identification or recommendation certificate',
      'Bank account linked to Aadhaar'
    ],
    benefits: 'Initial collateral-free working capital loan of ₹10,000 with 7% interest subsidy on timely repayment, scalable to ₹50,000.',
    documents: ['Aadhaar Card', 'Bank Passbook / Cancelled Cheque', 'Voter ID or Local Body Certificate'],
    officialUrl: 'https://pmsvanidhi.mohua.gov.in/'
  },
  {
    id: 's2',
    name: 'e-Shram National Database for Unorganised Workers',
    category: 'Social Security & Insurance',
    description: 'Comprehensive portal created by Ministry of Labour & Employment for unorganised workers to deliver direct welfare benefits.',
    eligibility: [
      'Age between 16 and 59 years',
      'Worker in unorganised sector (plumber, electrician, domestic worker, etc.)',
      'Not an income tax payer or member of EPFO/ESIC'
    ],
    benefits: 'Universal Account Number (UAN), accidental death/permanent disability cover of ₹2 Lakhs, automatic inclusion in social security initiatives.',
    documents: ['Aadhaar Card with linked Mobile Number', 'Active Bank Account details'],
    officialUrl: 'https://eshram.gov.in/'
  },
  {
    id: 's3',
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    category: 'Life Insurance',
    description: 'Government-backed life insurance scheme providing death coverage due to any reason for informal earners.',
    eligibility: [
      'Age 18 to 50 years',
      'Savings bank account holder with auto-debit consent'
    ],
    benefits: '₹2 Lakh life risk cover for premium of ₹436 per annum.',
    documents: ['Aadhaar Card', 'Bank Account Mandate'],
    officialUrl: 'https://financialservices.gov.in/insurance-divisions/Government-Sponsored-Socially-Oriented-Insurance-Schemes/Pradhan-Mantri-Jeevan-Jyoti-Bima-Yojana(PMJJBY)'
  },
  {
    id: 's4',
    name: 'Ayushman Bharat PM-JAY (Health Card)',
    category: 'Healthcare & Hospitalization',
    description: 'World’s largest government-funded healthcare program covering secondary and tertiary hospital care.',
    eligibility: [
      'Families identified under SECC database or active informal worker welfare board card',
      'No cap on family size or age'
    ],
    benefits: 'Cashless treatment up to ₹5 Lakhs per family per year across empaneled public and private hospitals.',
    documents: ['Ration Card / SECC verification', 'Aadhaar Card'],
    officialUrl: 'https://pmjay.gov.in/'
  }
];

const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    userId: 'w1',
    role: 'worker',
    title: 'New Service Assigned',
    message: 'You have been matched with a Plumbing Solutions job at Bandra West (2.4 km away).',
    type: 'job',
    link: '/dashboard/worker',
    read: false,
    createdAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'n2',
    userId: 'w1',
    role: 'worker',
    title: 'Training Schedule Notice',
    message: 'Advanced Leakage & Pipe Threading training begins on 20 March at 10:00 AM at Coop Centre.',
    type: 'training',
    link: '/dashboard/worker/schemes',
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'n3',
    userId: 'c1',
    role: 'customer',
    title: 'Worker On The Way',
    message: 'Rajesh Kumar has started travel for your Plumbing request. Estimated arrival: 12 minutes.',
    type: 'job',
    link: '/dashboard/customer/bookings',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'n4',
    userId: 'coop1',
    role: 'cooperative',
    title: 'AI Seasonal Demand Alert',
    message: 'AC Repair requests projected to increase by 45% next month based on historical data.',
    type: 'alert',
    link: '/dashboard/coop/forecast',
    read: false,
    createdAt: new Date(Date.now() - 14400000).toISOString()
  }
];

const mockTrainings: Training[] = [
  {
    id: 't1',
    name: 'HVAC & AC Servicing Certification',
    skill: 'Appliance Repair',
    trainer: 'Voltas & Daikin Authorized Skill Trainer',
    startDate: '2026-03-25',
    endDate: '2026-03-28',
    duration: '4 Days (16 Hours)',
    seats: 15,
    enrolledWorkerIds: ['w1', 'w3'],
    status: 'upcoming',
    certificateTitle: 'Certified Residential Cooling Technician'
  },
  {
    id: 't2',
    name: 'Smart Home Wiring & Solar Inverters',
    skill: 'Electrical & Wiring',
    trainer: 'National Power Training Institute',
    startDate: '2026-03-12',
    endDate: '2026-03-15',
    duration: '3 Days (12 Hours)',
    seats: 20,
    enrolledWorkerIds: ['w3'],
    status: 'completed',
    certificateTitle: 'Solar & Modular Electrical Safety Level 2'
  },
  {
    id: 't3',
    name: 'Hygiene & Commercial Deep Sanitation',
    skill: 'Deep Cleaning',
    trainer: 'BMC Sanitation & Health Department',
    startDate: '2026-03-18',
    endDate: '2026-03-20',
    duration: '2 Days (8 Hours)',
    seats: 12,
    enrolledWorkerIds: ['w2', 'w4'],
    status: 'active',
    certificateTitle: 'Hospital Grade Sanitation Specialist'
  }
];

const mockContracts: InstitutionalContract[] = [
  {
    id: 'ic1',
    institutionName: 'St. Xavier High School Campus',
    workType: 'Pre-Monsoon Roof & Pipe Waterproofing',
    workersRequired: 6,
    location: 'Fort, Mumbai',
    startDate: '2026-04-05',
    budget: 95000,
    status: 'upcoming',
    assignedWorkerIds: ['w1']
  },
  {
    id: 'ic2',
    institutionName: 'Municipal General Hospital Ward B',
    workType: 'Complete Electrical Rewiring & Backup Generator Line',
    workersRequired: 8,
    location: 'Kurla West, Mumbai',
    startDate: '2026-03-28',
    budget: 140000,
    status: 'upcoming',
    assignedWorkerIds: ['w3']
  },
  {
    id: 'ic3',
    institutionName: 'Godrej Business Complex',
    workType: 'Commercial Window & Deep Carpet Scrubbing',
    workersRequired: 12,
    location: 'Vikhroli, Mumbai',
    startDate: '2026-03-22',
    budget: 85000,
    status: 'active',
    assignedWorkerIds: ['w2', 'w4']
  }
];

const mockMassHirings: MassHiring[] = [
  {
    id: 'mh1',
    organization: 'Mumbai Metro Rail Line 3 Maintenance',
    requiredWorkers: 15,
    skills: ['Electrical & Wiring', 'Plumbing Solutions'],
    location: 'Aarey to Bandra Corridor',
    paymentBudget: '₹950 / Day + Safety Kit & Food Allowance',
    status: 'open',
    appliedWorkerIds: ['w1']
  },
  {
    id: 'mh2',
    organization: 'Tata Housing Greenfield Township',
    requiredWorkers: 20,
    skills: ['Carpentry & Wood', 'Painting & Decor'],
    location: 'Thane West Extension',
    paymentBudget: '₹1,100 / Day + Travel Allowance',
    status: 'open',
    appliedWorkerIds: []
  }
];

const mockEquipments: EquipmentItem[] = [
  {
    id: 'eq1',
    name: 'Bosch GBH 2-26 Heavy Rotary Hammer Drill (800W)',
    category: 'Power Tools',
    condition: 'Like New',
    type: 'both',
    buyPrice: 6500,
    rentalPricePerDay: 250,
    location: 'Andheri West (Coop Depot)',
    distanceKm: 2.1,
    ownerName: 'Mumbai Labour Cooperative Society',
    ownerPhone: '+91 98765 43220',
    available: true,
    description: 'Includes 4 SDS-plus bits, depth stop, and auxiliary handle. Ideal for anchor bolting and heavy masonry drilling.',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'eq2',
    name: '14ft Telescoping Aluminium Multi-Ladder',
    category: 'Ladders & Access',
    condition: 'Good',
    type: 'rent',
    rentalPricePerDay: 180,
    location: 'Bandra West (Depot B)',
    distanceKm: 1.5,
    ownerName: 'Mumbai Labour Cooperative Society',
    ownerPhone: '+91 98765 43220',
    available: true,
    description: 'Certified 150 kg load capacity. Compact fold for easy two-wheeler transport.',
    imageUrl: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'eq3',
    name: 'Karcher High-Pressure Jet Cleaner (130 Bar)',
    category: 'Cleaning Machines',
    condition: 'New',
    type: 'both',
    buyPrice: 12500,
    rentalPricePerDay: 350,
    location: 'Dadar Central Hub',
    distanceKm: 3.8,
    ownerName: 'Amit Electrical Tools',
    ownerPhone: '+91 98765 43213',
    available: true,
    description: 'Heavy duty pressure washer with dirt blaster nozzle. Suitable for exterior wash and drainage pipe unclogging.',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'eq4',
    name: 'Electric Pipe Threader & Hydrostatic Pressure Test Pump',
    category: 'Plumbing Tools',
    condition: 'Good',
    type: 'rent',
    rentalPricePerDay: 300,
    location: 'Andheri West',
    distanceKm: 2.3,
    ownerName: 'Rajesh Kumar',
    ownerPhone: '+91 98765 43211',
    available: true,
    description: 'Accurate pipe threading up to 2 inches with hydraulic hand pump for checking plumbing leaks under pressure.',
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&auto=format&fit=crop&q=80'
  }
];

const mockIncidents: IncidentReport[] = [
  {
    id: 'inc1',
    userId: 'w1',
    userName: 'Rajesh Kumar',
    userRole: 'worker',
    incidentType: 'Safety Threat',
    location: 'Bandra West (Hill Road)',
    description: 'Customer dog was untied and rushed at technician during inspection.',
    bookingId: 'j2',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const mockComplaints: Complaint[] = [
  {
    id: 'cmp1',
    userId: 'c1',
    userName: 'Priya Sharma',
    userRole: 'customer',
    bookingId: 'j1',
    subject: 'Request invoice copy with GST details',
    details: 'Need tax receipt for society audit documentation.',
    status: 'Resolved',
    resolutionNotes: 'Invoice INV-SHRAM-2026-0812 regenerated and emailed.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const useStore = create<AppState>((set, get) => ({
  currentUser: mockUsers[0], // Default logged-in as customer Priya Sharma
  users: mockUsers,
  jobs: mockJobs,
  schemes: mockSchemes,
  notifications: mockNotifications,
  trainings: mockTrainings,
  contracts: mockContracts,
  massHirings: mockMassHirings,
  equipments: mockEquipments,
  equipment: mockEquipments,
  incidents: mockIncidents,
  complaints: mockComplaints,
  grievances: mockComplaints,
  selectedWorkerForBooking: null,
  notificationPreferences: {
    inApp: true,
    whatsapp: true,
    sms: true,
    voiceIvr: true,
    phone: '+91 98201 44521'
  },
  whatsAppLogs: [
    {
      id: 'wa-1',
      phone: '+91 98201 44521',
      message: 'SHRAMSETU Update: Your booking #j2 for Plumbing Solutions is confirmed. Worker Rajesh Kumar (4.8★) will arrive shortly.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'Delivered'
    }
  ],

  login: (email) => set((state) => {
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    return { currentUser: user };
  }),

  logout: () => set({ currentUser: null }),

  selectWorkerForBooking: (workerId) => set({ selectedWorkerForBooking: workerId }),

  findBestWorkerMatch: (service: string, locality: string, womenPreferred: boolean) => {
    const state = get();
    const workers = state.users.filter(u => u.role === 'worker') as WorkerProfile[];
    
    // Filter matching skills
    const serviceKeywords = service.toLowerCase().split(' ');
    let candidates = workers.filter(w => 
      w.skills.some(skill => 
        serviceKeywords.some(kw => kw.length > 3 && skill.toLowerCase().includes(kw)) ||
        skill.toLowerCase().includes(service.toLowerCase()) ||
        service.toLowerCase().includes(skill.toLowerCase())
      )
    );

    if (candidates.length === 0) {
      candidates = workers; // fallback to general pool if new skill
    }

    if (womenPreferred) {
      const womenCandidates = candidates.filter(w => w.isWomenWorker || w.gender === 'female');
      if (womenCandidates.length > 0) {
        candidates = womenCandidates;
      }
    }

    // Score candidates based on:
    // 1. Availability (+35)
    // 2. Locality match (+30)
    // 3. Low workload (+25)
    // 4. Rating (+10)
    // 5. Women preference matched (+25)
    let bestWorker: WorkerProfile | null = null;
    let highestScore = -1;
    let bestReasons: string[] = [];
    let calculatedDist = 2.4;
    let travelMins = 12;

    candidates.forEach(w => {
      let score = 0;
      const reasons: string[] = [];

      reasons.push(`Verified trade skill: ${w.skills[0]}`);

      if (w.status === 'available') {
        score += 35;
        reasons.push('Available now for instant assignment');
      } else if (w.status === 'busy') {
        score += 10;
      }

      const isSameLocality = w.serviceLocality.toLowerCase().includes(locality.toLowerCase()) ||
                             locality.toLowerCase().includes(w.serviceLocality.toLowerCase());
      if (isSameLocality) {
        score += 30;
        reasons.push(`Nearby in ${w.serviceLocality} (approx. 1.8 km)`);
        calculatedDist = 1.8;
        travelMins = 9;
      } else {
        score += 15;
        reasons.push(`Within service radius (${w.serviceRadius} km)`);
        calculatedDist = 3.2;
        travelMins = 16;
      }

      // Fair opportunity & workload balancing:
      if (w.workload === 0) {
        score += 25;
        reasons.push('Fair Workload Balancing: Candidate currently has low queue');
      } else if (w.workload === 1) {
        score += 15;
        reasons.push('Manageable daily workload');
      }

      if (womenPreferred && (w.isWomenWorker || w.gender === 'female')) {
        score += 25;
        reasons.push('Verified Women Worker preference met');
      }

      score += Math.round(w.rating * 4);

      if (score > highestScore) {
        highestScore = score;
        bestWorker = w;
        bestReasons = reasons;
      }
    });

    return {
      worker: bestWorker,
      reasons: bestReasons,
      distanceKm: calculatedDist,
      travelMins
    };
  },

  bookService: (jobData) => {
    const state = get();
    const customer = state.currentUser;
    if (!customer) throw new Error('Must be logged in to book');

    const match = state.findBestWorkerMatch(
      jobData.service, 
      jobData.locality || customer.locality || 'Bandra West', 
      jobData.preference === 'women_preferred'
    );

    const newJob: Job = {
      ...jobData,
      id: `j${Date.now()}`,
      customerId: customer.id,
      workerId: match.worker ? match.worker.id : undefined,
      cooperativeId: match.worker ? match.worker.cooperativeId : 'coop1',
      status: match.worker ? 'assigned' : 'requested',
      createdAt: new Date().toISOString(),
      matchReasons: match.reasons,
      estimatedDistanceKm: match.distanceKm,
      estimatedTravelMins: match.travelMins
    };

    const newNotifications: AppNotification[] = [
      {
        id: `notif-${Date.now()}-c`,
        userId: customer.id,
        role: 'customer',
        title: 'Booking Confirmed',
        message: `Your booking for ${newJob.service} is placed. Worker ${match.worker?.name || 'finding'} has been allocated.`,
        type: 'job',
        link: '/dashboard/customer/bookings',
        read: false,
        createdAt: new Date().toISOString()
      }
    ];

    if (match.worker) {
      newNotifications.push({
        id: `notif-${Date.now()}-w`,
        userId: match.worker.id,
        role: 'worker',
        title: 'New Service Assigned',
        message: `New booking: ${newJob.service} at ${newJob.locality}. Priority: ${newJob.priority}.`,
        type: 'job',
        link: '/dashboard/worker',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    newNotifications.push({
      id: `notif-${Date.now()}-coop`,
      userId: 'coop1',
      role: 'cooperative',
      title: 'New Customer Service Request',
      message: `${newJob.service} booked by ${customer.name} in ${newJob.locality}.`,
      type: 'job',
      link: '/dashboard/coop/requests',
      read: false,
      createdAt: new Date().toISOString()
    });

    // Send WhatsApp notification if opted in
    if (state.notificationPreferences.whatsapp) {
      state.sendWhatsAppMessage(
        customer.phone, 
        `SHRAMSETU: Your ${newJob.service} booking #${newJob.id} is confirmed with worker ${match.worker?.name || 'allocated'}. Track live on dashboard.`
      );
    }

    set({
      jobs: [newJob, ...state.jobs],
      notifications: [...newNotifications, ...state.notifications]
    });

    return newJob;
  },

  submitFeedback: (jobId, feedback) => set((state) => {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job || !job.workerId) return state;

    const workerId = job.workerId;
    const customer = state.currentUser;

    // Update job with feedback
    const updatedJobs = state.jobs.map(j => 
      j.id === jobId ? { ...j, feedback } : j
    );

    // Update worker reviews, completed jobs & average rating
    const updatedUsers = state.users.map(u => {
      if (u.id === workerId && u.role === 'worker') {
        const worker = u as WorkerProfile;
        const newRating = Number(((worker.rating * worker.completedJobs + feedback.rating) / (worker.completedJobs + 1)).toFixed(2));
        const newReview = {
          id: `rev-${Date.now()}`,
          customerName: customer?.name || 'Customer',
          rating: feedback.rating,
          review: feedback.writtenFeedback || 'Quality cooperative service provided.',
          date: new Date().toISOString().split('T')[0],
          serviceQuality: feedback.serviceQuality,
          punctuality: feedback.punctuality,
          cleanliness: feedback.cleanliness
        };
        return {
          ...worker,
          rating: Math.min(5, Math.max(1, newRating)),
          completedJobs: worker.completedJobs + 1,
          reviews: [newReview, ...(worker.reviews || [])]
        };
      }
      return u;
    });

    // Notify worker
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: workerId,
      role: 'worker',
      title: 'New Customer Feedback & Rating',
      message: `You received ${feedback.rating}★ from ${customer?.name || 'customer'} for ${job.service}.`,
      type: 'system',
      link: '/dashboard/worker/portfolio',
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      jobs: updatedJobs,
      users: updatedUsers,
      notifications: [newNotif, ...state.notifications]
    };
  }),

  respondExtraCharges: (jobId, approve) => set((state) => {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job || !job.extraCharges) return state;

    const updatedJobs = state.jobs.map(j => {
      if (j.id === jobId && j.extraCharges) {
        return {
          ...j,
          price: approve ? j.price + j.extraCharges.amount : j.price,
          extraCharges: { ...j.extraCharges, approved: approve }
        };
      }
      return j;
    });

    if (job.workerId) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: job.workerId,
        role: 'worker',
        title: approve ? 'Extra Charges Approved' : 'Extra Charges Rejected',
        message: approve 
          ? `Customer approved additional charge of ₹${job.extraCharges.amount} for ${job.extraCharges.description}.`
          : `Customer declined additional charge of ₹${job.extraCharges.amount}.`,
        type: 'payment',
        link: '/dashboard/worker',
        read: false,
        createdAt: new Date().toISOString()
      };
      return { jobs: updatedJobs, notifications: [notif, ...state.notifications] };
    }

    return { jobs: updatedJobs };
  }),

  payJob: (jobId, payment) => set((state) => {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job) return state;

    const updatedJobs = state.jobs.map(j => 
      j.id === jobId ? { ...j, payment, status: 'completed' as const } : j
    );

    // Update worker earnings & workload
    const updatedUsers = state.users.map(u => {
      if (u.id === job.workerId && u.role === 'worker') {
        const worker = u as WorkerProfile;
        const netWorkerPay = Math.round(payment.amount * 0.95); // 5% cooperative welfare share
        return {
          ...worker,
          earnings: worker.earnings + netWorkerPay,
          workload: Math.max(0, worker.workload - 1),
          status: 'available' as const
        };
      }
      return u;
    });

    const notifs: AppNotification[] = [];
    if (job.workerId) {
      notifs.push({
        id: `notif-${Date.now()}-w`,
        userId: job.workerId,
        role: 'worker',
        title: 'Payment Received',
        message: `₹${payment.amount} received via ${payment.method.toUpperCase()} for ${job.service}. Invoice #${payment.invoiceNumber}.`,
        type: 'payment',
        link: '/dashboard/worker/earnings',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    return {
      jobs: updatedJobs,
      users: updatedUsers,
      notifications: [...notifs, ...state.notifications]
    };
  }),

  updateWorkerStatus: (status) => set((state) => {
    if (!state.currentUser || state.currentUser.role !== 'worker') return state;
    const updatedUsers = state.users.map(u => 
      u.id === state.currentUser?.id ? { ...u, status } : u
    );
    return { 
      users: updatedUsers,
      currentUser: updatedUsers.find(u => u.id === state.currentUser?.id)
    };
  }),

  acceptJob: (jobId) => set((state) => {
    if (!state.currentUser || state.currentUser.role !== 'worker') return state;
    const workerId = state.currentUser.id;
    const job = state.jobs.find(j => j.id === jobId);

    const updatedJobs = state.jobs.map(j => 
      j.id === jobId ? { ...j, status: 'accepted' as const, workerId } : j
    );

    // Update worker workload
    const updatedUsers = state.users.map(u => 
      u.id === workerId && u.role === 'worker' 
        ? { ...u, workload: (u as WorkerProfile).workload + 1 }
        : u
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: job?.customerId || '',
      role: 'customer',
      title: 'Worker Accepted Request',
      message: `${state.currentUser.name} has accepted your ${job?.service || 'service'} request.`,
      type: 'job',
      link: '/dashboard/customer/bookings',
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      jobs: updatedJobs,
      users: updatedUsers,
      notifications: [notif, ...state.notifications]
    };
  }),

  declineJob: (jobId) => set((state) => {
    return {
      jobs: state.jobs.map(j => j.id === jobId ? { ...j, status: 'requested', workerId: undefined } : j)
    };
  }),

  updateJobStatus: (jobId, status, workProof) => set((state) => {
    const job = state.jobs.find(j => j.id === jobId);
    const updatedJobs = state.jobs.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status,
          workProof: workProof ? { ...(j.workProof || {}), ...workProof } : j.workProof
        };
      }
      return j;
    });

    const notifs: AppNotification[] = [];
    if (job?.customerId) {
      let title = `Booking Update: ${status.replace(/_/g, ' ')}`;
      let message = `Worker status updated to: ${status.replace(/_/g, ' ')}`;

      if (status === 'on_the_way') {
        title = 'Worker On The Way';
        message = 'Your service professional has started traveling to your address.';
      } else if (status === 'arrived') {
        title = 'Worker Arrived';
        message = 'The service professional has reached your premises.';
      } else if (status === 'started') {
        title = 'Service In Progress';
        message = 'Work has commenced at your location.';
      } else if (status === 'completed') {
        title = 'Work Completed';
        message = 'The worker marked work as finished. Please inspect before final payment.';
      }

      notifs.push({
        id: `notif-${Date.now()}`,
        userId: job.customerId,
        role: 'customer',
        title,
        message,
        type: 'job',
        link: '/dashboard/customer/bookings',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    return {
      jobs: updatedJobs,
      notifications: [...notifs, ...state.notifications]
    };
  }),

  requestExtraCharges: (jobId, description, amount) => set((state) => {
    const job = state.jobs.find(j => j.id === jobId);
    const updatedJobs = state.jobs.map(j => 
      j.id === jobId ? { ...j, extraCharges: { description, amount, approved: false } } : j
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: job?.customerId || '',
      role: 'customer',
      title: 'Additional Charges Approval Required',
      message: `Worker requested ₹${amount} for spare parts/materials: "${description}". Please review and approve.`,
      type: 'payment',
      link: '/dashboard/customer/bookings',
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      jobs: updatedJobs,
      notifications: [notif, ...state.notifications]
    };
  }),

  assignWorker: (jobId, workerId) => set((state) => {
    return {
      jobs: state.jobs.map(j => j.id === jobId ? { ...j, status: 'assigned', workerId } : j)
    };
  }),

  assignWorkerManually: (jobId, workerId) => get().assignWorker(jobId, workerId),

  createTraining: (trainingData) => set((state) => {
    const newTraining: Training = {
      ...trainingData,
      id: `t${Date.now()}`,
      enrolledWorkerIds: [],
      status: 'upcoming'
    };

    // Send notification to all workers matching skill
    const skillWorkers = (state.users || []).filter(u => 
      u.role === 'worker' && ((u as WorkerProfile).skills || []).some(s => s.toLowerCase().includes(trainingData.skill.toLowerCase()))
    );

    const newNotifs: AppNotification[] = skillWorkers.map(w => ({
      id: `notif-${Date.now()}-${w.id}`,
      userId: w.id,
      role: 'worker' as const,
      title: 'New Cooperative Training Announced',
      message: `${trainingData.name} starts on ${trainingData.startDate}. Seats: ${trainingData.seats}. Enroll now!`,
      type: 'training' as const,
      link: '/dashboard/worker/schemes',
      read: false,
      createdAt: new Date().toISOString()
    }));

    return {
      trainings: [newTraining, ...state.trainings],
      notifications: [...newNotifs, ...state.notifications]
    };
  }),

  enrollInTraining: (trainingId, workerId) => set((state) => {
    const updatedTrainings = state.trainings.map(t => {
      if (t.id === trainingId && !t.enrolledWorkerIds.includes(workerId)) {
        return {
          ...t,
          enrolledWorkerIds: [...t.enrolledWorkerIds, workerId]
        };
      }
      return t;
    });

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: workerId,
      role: 'worker',
      title: 'Enrolled in Training Session',
      message: 'You have successfully enrolled. Check training dates and center location.',
      type: 'training',
      link: '/dashboard/worker/schemes',
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      trainings: updatedTrainings,
      notifications: [notif, ...state.notifications]
    };
  }),

  completeTrainingForWorker: (trainingId, workerId) => set((state) => {
    const training = state.trainings.find(t => t.id === trainingId);
    if (!training) return state;

    // Add certification to worker profile
    const certTitle = training.certificateTitle || `${training.skill} Skill Certification`;
    const updatedUsers = state.users.map(u => {
      if (u.id === workerId && u.role === 'worker') {
        const worker = u as WorkerProfile;
        const exists = worker.certifications.some(c => c.title === certTitle);
        if (!exists) {
          return {
            ...worker,
            certifications: [
              ...worker.certifications,
              {
                title: certTitle,
                issuer: training.trainer,
                year: '2026',
                verified: true
              }
            ]
          };
        }
      }
      return u;
    });

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: workerId,
      role: 'worker',
      title: 'Training Completed & Certificate Available',
      message: `Congratulations! Your ${certTitle} has been verified and added to your digital portfolio.`,
      type: 'training',
      link: '/dashboard/worker/portfolio',
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      users: updatedUsers,
      notifications: [notif, ...state.notifications]
    };
  }),

  assignInstitutionalWorker: (contractId, workerId) => set((state) => {
    const updatedContracts = state.contracts.map(c => {
      if (c.id === contractId && !c.assignedWorkerIds.includes(workerId)) {
        return {
          ...c,
          assignedWorkerIds: [...c.assignedWorkerIds, workerId]
        };
      }
      return c;
    });

    const contract = state.contracts.find(c => c.id === contractId);
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: workerId,
      role: 'worker',
      title: 'Institutional Contract Deployment',
      message: `You are deployed for institutional contract: ${contract?.institutionName} - ${contract?.workType}.`,
      type: 'job',
      link: '/dashboard/worker',
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      contracts: updatedContracts,
      notifications: [notif, ...state.notifications]
    };
  }),

  applyForMassHiring: (massHiringId, workerId) => set((state) => {
    const updatedMassHirings = state.massHirings.map(mh => {
      if (mh.id === massHiringId && !mh.appliedWorkerIds.includes(workerId)) {
        return {
          ...mh,
          appliedWorkerIds: [...mh.appliedWorkerIds, workerId],
          status: 'applied' as const
        };
      }
      return mh;
    });

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: workerId,
      role: 'worker',
      title: 'Mass Hiring Application Submitted',
      message: 'Your cooperative profile has been sent to the institutional contractor.',
      type: 'job',
      link: '/dashboard/worker',
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      massHirings: updatedMassHirings,
      notifications: [notif, ...state.notifications]
    };
  }),

  deployMassHiring: (massHiringId) => set((state) => ({
    massHirings: state.massHirings.map(mh => mh.id === massHiringId ? { ...mh, status: 'deployed' as const } : mh)
  })),

  assignJobToWorker: (jobId, workerId) => {
    get().assignWorker(jobId, workerId);
  },

  enrollTraining: (trainingId) => {
    const state = get();
    const workerId = state.currentUser?.id || 'w1';
    state.enrollInTraining(trainingId, workerId);
  },

  addEquipment: (item) => set((state) => {
    const newItem: EquipmentItem = {
      ...item,
      id: `eq-${Date.now()}`
    };
    return {
      equipments: [newItem, ...state.equipments],
      equipment: [newItem, ...state.equipment]
    };
  }),

  toggleEquipmentAvailability: (id) => set((state) => {
    const updated = state.equipments.map(e => e.id === id ? { ...e, available: !e.available } : e);
    return {
      equipments: updated,
      equipment: updated
    };
  }),

  borrowEquipment: (id, memberName = 'Field Technician') => set((state) => {
    const updated = state.equipments.map(e => e.id === id ? { ...e, available: false, borrowedBy: memberName } : e);
    return {
      equipments: updated,
      equipment: updated
    };
  }),

  returnEquipment: (id) => set((state) => {
    const updated = state.equipments.map(e => e.id === id ? { ...e, available: true, borrowedBy: undefined } : e);
    return {
      equipments: updated,
      equipment: updated
    };
  }),

  submitIncident: (incidentData) => set((state) => {
    const newInc: IncidentReport = {
      ...incidentData,
      id: `inc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Submitted'
    };

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'coop1',
      role: 'cooperative',
      title: 'Emergency Incident Reported',
      message: `Worker ${incidentData.userName} logged a ${incidentData.incidentType} alert at ${incidentData.location}.`,
      type: 'alert',
      link: '/dashboard/worker/welfare',
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      incidents: [newInc, ...state.incidents],
      notifications: [notif, ...state.notifications]
    };
  }),

  submitComplaint: (complaintData) => set((state) => {
    const newCmp: Complaint = {
      ...complaintData,
      id: `cmp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Submitted'
    };

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'coop1',
      role: 'cooperative',
      title: 'New Grievance / Complaint Raised',
      message: `Grievance registered for booking #${complaintData.bookingId || 'N/A'}: ${complaintData.subject}`,
      type: 'alert',
      link: '/dashboard/worker/welfare',
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      complaints: [newCmp, ...state.complaints],
      notifications: [notif, ...state.notifications]
    };
  }),

  updateComplaintStatus: (complaintId, status, notes) => set((state) => ({
    complaints: state.complaints.map(c => 
      c.id === complaintId ? { ...c, status, resolutionNotes: notes || c.resolutionNotes } : c
    )
  })),

  resolveComplaint: (complaintId) => set((state) => ({
    complaints: state.complaints.map(c => 
      c.id === complaintId ? { ...c, status: 'Resolved' as const, resolutionNotes: 'Resolved amicably by cooperative grievance ombudsman.' } : c
    ),
    grievances: state.complaints.map(c => 
      c.id === complaintId ? { ...c, status: 'Resolved' as const, resolutionNotes: 'Resolved amicably by cooperative grievance ombudsman.' } : c
    )
  })),

  resolveGrievance: (complaintId, notes) => set((state) => ({
    complaints: state.complaints.map(c => 
      c.id === complaintId ? { ...c, status: 'Resolved' as const, resolutionNotes: notes || 'Resolved amicably by cooperative grievance ombudsman.' } : c
    ),
    grievances: state.complaints.map(c => 
      c.id === complaintId ? { ...c, status: 'Resolved' as const, resolutionNotes: notes || 'Resolved amicably by cooperative grievance ombudsman.' } : c
    )
  })),

  resolveIncident: (incidentId, notes) => set((state) => ({
    incidents: state.incidents.map(inc => 
      inc.id === incidentId ? { ...inc, status: 'Resolved' as const, description: notes ? `${inc.description} [Resolution: ${notes}]` : inc.description } : inc
    )
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [
      {
        ...notification,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false
      },
      ...state.notifications
    ]
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  updateNotificationPreferences: (prefs) => set((state) => ({
    notificationPreferences: { ...state.notificationPreferences, ...prefs }
  })),

  sendWhatsAppMessage: (phone, message) => set((state) => ({
    whatsAppLogs: [
      {
        id: `wa-${Date.now()}`,
        phone,
        message,
        timestamp: new Date().toISOString(),
        status: 'Delivered'
      },
      ...state.whatsAppLogs
    ]
  }))
}));
