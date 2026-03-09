// User Types
export type UserType = 'applicant' | 'employer' | 'admin';

export interface User {
  _id: string;
  email: string;
  type: UserType;
  name?: string;
  storeName?: string;
  ownerName?: string;
  isApproved?: boolean;
  isBlocked?: boolean;
  isActive?: boolean;
  phone?: string;
  skills?: string[];
  experience?: number;
  preferredJobType?: string;
  jobCategories?: string[];
  preferredShiftType?: string;
  preferredWorkLocation?: string;
  expectedHourlyRate?: number;
  availabilityDays?: string[];
  businessType?: string;
  businessDescription?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  resume?: {
    url: string;
    publicId: string;
  };
}

// Job Types
export interface Job {
  _id: string;
  title: string;
  description: string;
  jobType: 'full-time' | 'part-time' | 'shift' | 'contract';
  salary: {
    amount: number;
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  location: {
    address?: string;
    city: string;
    state: string;
    pincode: string;
  };
  workingHours?: {
    hoursPerDay?: number;
    daysPerWeek?: number;
    shiftTiming?: string;
  };
  requirements?: {
    minimumExperience?: number;
    skills?: string[];
    education?: string;
    otherRequirements?: string;
  };
  benefits?: string[];
  status: 'open' | 'closed' | 'filled';
  employer: {
    _id: string;
    storeName: string;
    businessType: string;
  };
  totalApplications: number;
  acceptedApplicants: number;
  views: number;
  hasApplied?: boolean;
  expiryDate?: string;
  createdAt: string;
}

// Application Types
export interface Application {
  _id: string;
  job: Job;
  applicant: Applicant;
  employer: {
    _id: string;
    storeName: string;
  };
  coverLetter?: string;
  expectedSalary?: number;
  status: 'applied' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn';
  rejectionReason?: string;
  statusHistory: StatusHistory[];
  createdAt: string;
}

export interface Applicant {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  skills?: string[];
  experience?: number;
  preferredJobType?: string;
  jobCategories?: string[];
  preferredShiftType?: string;
  preferredWorkLocation?: string;
  expectedHourlyRate?: number;
  availabilityDays?: string[];
  resume?: {
    url: string;
    publicId: string;
  };
}

export interface StatusHistory {
  status: string;
  updatedBy: string;
  updatedByModel: string;
  note?: string;
  timestamp: string;
}

// Shift Types
export interface Shift {
  _id: string;
  job: {
    _id: string;
    title: string;
  };
  applicant: {
    _id: string;
    name: string;
  };
  employer: {
    _id: string;
    storeName: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instructions?: string;
  paymentAmount?: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

// Attendance Types
export interface Attendance {
  _id: string;
  shift: Shift;
  checkInTime?: string;
  checkOutTime?: string;
  checkInLocation?: {
    latitude: number;
    longitude: number;
  };
  checkOutLocation?: {
    latitude: number;
    longitude: number;
  };
  totalHours?: number;
  status: 'present' | 'late' | 'absent';
  lateBy?: number;
  remarks?: string;
  isApproved: boolean;
  employerRemarks?: string;
}

// Job Request Types
export interface JobRequest {
  _id: string;
  employer: {
    _id: string;
    storeName: string;
    businessType: string;
  };
  applicant: {
    _id: string;
    name: string;
  };
  jobTitle: string;
  jobDescription: string;
  shiftType: string;
  location: string;
  offeredHourlyRate: number;
  message?: string;
  status: 'sent' | 'accepted' | 'declined' | 'expired';
  declineReason?: string;
  expiresAt: string;
  createdAt: string;
}

// Notification Types
export interface Notification {
  _id: string;
  recipient: string;
  recipientModel: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

// Pagination
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}

// Filter Types
export interface JobFilters {
  page?: number;
  limit?: number;
  jobType?: string;
  city?: string;
  state?: string;
  minSalary?: number;
  maxSalary?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ApplicationFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface ShiftFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface NotificationFilters {
  isRead?: boolean;
  page?: number;
  limit?: number;
}
