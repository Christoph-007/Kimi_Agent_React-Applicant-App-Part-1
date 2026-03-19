import type { User, Job, Application, Notification } from '@/types';

export const mockUser: User = {
    _id: 'user_1',
    email: 'ch@gmail.com',
    type: 'applicant',
    name: 'Test Applicant',
    phone: '1234567890',
    skills: ['React', 'TypeScript', 'Node.js'],
    experience: 2,
    preferredJobType: 'shift',
    jobCategories: ['Food Service', 'Retail'],
    preferredShiftType: 'Day',
    preferredWorkLocation: 'Mumbai',
    expectedHourlyRate: 200,
};

export const mockEmployer: User = {
    _id: 'employer_1',
    email: 'employer@test.com',
    type: 'employer',
    storeName: 'Test Store',
    phone: '9876543210',
};

export const mockJobs: Job[] = [
    {
        _id: 'job_1',
        title: 'Senior Chef',
        description: 'Looking for an experienced chef for morning shifts.',
        jobType: 'shift',
        salary: { amount: 500, period: 'hourly' },
        location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        workingHours: { hoursPerDay: 8, daysPerWeek: 5, shiftTiming: '09:00 - 17:00' },
        requirements: { minimumExperience: 3, skills: ['Cooking', 'Management'] },
        status: 'open',
        employer: { _id: 'employer_1', storeName: 'Grand Hotel', businessType: 'Hospitality' },
        totalApplications: 5,
        views: 120,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'job_2',
        title: 'Retail Assistant',
        description: 'Help customers and manage inventory.',
        jobType: 'part-time',
        salary: { amount: 15000, period: 'monthly' },
        location: { city: 'Delhi', state: 'Delhi', pincode: '110001' },
        status: 'open',
        employer: { _id: 'employer_2', storeName: 'Fashion Hub', businessType: 'Retail' },
        totalApplications: 12,
        views: 350,
        createdAt: new Date().toISOString(),
    },
];

export const mockApplications: Application[] = [
    {
        _id: 'app_1',
        job: mockJobs[0],
        applicant: { _id: 'user_1', name: 'Test Applicant', phone: '1234567890' },
        employer: { _id: 'employer_1', storeName: 'Grand Hotel' },
        status: 'applied',
        statusHistory: [{ status: 'applied', updatedBy: 'user_1', updatedByModel: 'User', timestamp: new Date().toISOString() }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const mockNotifications: Notification[] = [
    {
        _id: 'not_1',
        recipient: 'user_1',
        recipientModel: 'User',
        type: 'info',
        title: 'Welcome to ShiftMatch',
        message: 'Thanks for joining our platform!',
        isRead: false,
        isDismissed: false,
        createdAt: new Date().toISOString(),
    },
];
