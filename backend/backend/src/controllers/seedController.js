const Admin = require('../models/Admin');
const Employer = require('../models/Employer');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Seed database with sample data
// @route   POST /api/admin/seed
// @access  Public (should be protected in production)
const seedDatabase = async (req, res) => {
    try {
        console.log('Starting database seeding...');

        // Clear existing data
        await Promise.all([
            Admin.deleteMany({}),
            Employer.deleteMany({}),
            Applicant.deleteMany({}),
            Job.deleteMany({}),
            Application.deleteMany({}),
        ]);

        // Create Admin
        const admin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@shiftmaster.com',
            password: 'admin123456',
            role: 'super-admin',
            permissions: ['all'],
        });

        // Create Employers
        const employers = await Employer.create([
            {
                storeName: 'The Grand Restaurant',
                ownerName: 'John Smith',
                email: 'john@grandrestaurant.com',
                phone: '9876543210',
                password: 'password123',
                address: {
                    street: '123 MG Road',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                },
                businessType: 'restaurant',
                businessDescription: 'Fine dining restaurant specializing in continental cuisine',
                isApproved: true,
                isActive: true,
            },
            {
                storeName: 'Quick Bites Cafe',
                ownerName: 'Sarah Johnson',
                email: 'sarah@quickbites.com',
                phone: '9876543211',
                password: 'password123',
                address: {
                    street: '456 Brigade Road',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    pincode: '560001',
                },
                businessType: 'restaurant',
                businessDescription: 'Fast casual cafe with fresh sandwiches and coffee',
                isApproved: true,
                isActive: true,
            },
            {
                storeName: 'Retail Paradise',
                ownerName: 'Michael Brown',
                email: 'michael@retailparadise.com',
                phone: '9876543212',
                password: 'password123',
                address: {
                    street: '789 Park Street',
                    city: 'Delhi',
                    state: 'Delhi',
                    pincode: '110001',
                },
                businessType: 'retail',
                businessDescription: 'Multi-brand retail store',
                isApproved: true,
                isActive: true,
            },
        ]);

        // Create Applicants
        const applicants = await Applicant.create([
            {
                name: 'Priya Sharma',
                phone: '9123456780',
                email: 'priya.sharma@email.com',
                password: 'password123',
                skills: ['customer service', 'communication', 'teamwork'],
                experience: 2,
                preferredJobType: 'shift',
                location: { city: 'Mumbai', state: 'Maharashtra' },
                isActive: true,
            },
            {
                name: 'Rahul Kumar',
                phone: '9123456781',
                email: 'rahul.kumar@email.com',
                password: 'password123',
                skills: ['cooking', 'food preparation', 'kitchen management'],
                experience: 3,
                preferredJobType: 'full-time',
                location: { city: 'Mumbai', state: 'Maharashtra' },
                isActive: true,
            },
            {
                name: 'Anita Patel',
                phone: '9123456782',
                email: 'anita.patel@email.com',
                password: 'password123',
                skills: ['sales', 'customer service', 'inventory management'],
                experience: 1,
                preferredJobType: 'part-time',
                location: { city: 'Bangalore', state: 'Karnataka' },
                isActive: true,
            },
            {
                name: 'Vikram Singh',
                phone: '9123456783',
                email: 'vikram.singh@email.com',
                password: 'password123',
                skills: ['delivery', 'driving', 'logistics'],
                experience: 4,
                preferredJobType: 'shift',
                location: { city: 'Delhi', state: 'Delhi' },
                isActive: true,
            },
            {
                name: 'Sneha Reddy',
                phone: '9123456784',
                email: 'sneha.reddy@email.com',
                password: 'password123',
                skills: ['barista', 'coffee making', 'customer service'],
                experience: 1,
                preferredJobType: 'part-time',
                location: { city: 'Bangalore', state: 'Karnataka' },
                isActive: true,
            },
        ]);

        // Create Jobs
        const jobs = await Job.create([
            {
                employer: employers[0]._id,
                title: 'Waiter/Waitress',
                description: 'Looking for experienced waiters to join our fine dining team.',
                jobType: 'shift',
                salary: { amount: 500, period: 'daily' },
                location: {
                    address: '123 MG Road',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                },
                requirements: {
                    minimumExperience: 1,
                    skills: ['customer service', 'communication'],
                    education: 'High School',
                },
                openings: 3,
                status: 'open',
            },
            {
                employer: employers[0]._id,
                title: 'Chef',
                description: 'Experienced chef needed for continental cuisine.',
                jobType: 'full-time',
                salary: { amount: 35000, period: 'monthly' },
                location: {
                    address: '123 MG Road',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                },
                requirements: {
                    minimumExperience: 3,
                    skills: ['cooking', 'food preparation'],
                    education: 'Culinary Degree Preferred',
                },
                openings: 1,
                status: 'open',
            },
            {
                employer: employers[1]._id,
                title: 'Barista',
                description: 'Join our team as a barista!',
                jobType: 'part-time',
                salary: { amount: 300, period: 'daily' },
                location: {
                    address: '456 Brigade Road',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    pincode: '560001',
                },
                requirements: {
                    minimumExperience: 0,
                    skills: ['customer service', 'coffee making'],
                    education: 'Any',
                },
                openings: 2,
                status: 'open',
            },
            {
                employer: employers[1]._id,
                title: 'Kitchen Helper',
                description: 'Assist in food preparation and maintain cleanliness.',
                jobType: 'shift',
                salary: { amount: 400, period: 'daily' },
                location: {
                    address: '456 Brigade Road',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    pincode: '560001',
                },
                requirements: {
                    minimumExperience: 0,
                    skills: ['teamwork'],
                    education: 'Any',
                },
                openings: 2,
                status: 'open',
            },
            {
                employer: employers[2]._id,
                title: 'Sales Associate',
                description: 'Help customers find products and manage inventory.',
                jobType: 'full-time',
                salary: { amount: 25000, period: 'monthly' },
                location: {
                    address: '789 Park Street',
                    city: 'Delhi',
                    state: 'Delhi',
                    pincode: '110001',
                },
                requirements: {
                    minimumExperience: 1,
                    skills: ['sales', 'customer service'],
                    education: 'High School',
                },
                openings: 4,
                status: 'open',
            },
            {
                employer: employers[2]._id,
                title: 'Delivery Person',
                description: 'Deliver products to customers.',
                jobType: 'shift',
                salary: { amount: 600, period: 'daily' },
                location: {
                    address: '789 Park Street',
                    city: 'Delhi',
                    state: 'Delhi',
                    pincode: '110001',
                },
                requirements: {
                    minimumExperience: 2,
                    skills: ['delivery', 'driving'],
                    education: 'Any',
                },
                openings: 3,
                status: 'open',
            },
        ]);

        // Create Applications
        await Application.create([
            {
                job: jobs[0]._id,
                applicant: applicants[0]._id,
                employer: employers[0]._id,
                status: 'applied',
                coverLetter: 'I am very interested in this position.',
            },
            {
                job: jobs[1]._id,
                applicant: applicants[1]._id,
                employer: employers[0]._id,
                status: 'reviewing',
                coverLetter: 'I am a passionate chef with 3 years of experience.',
            },
            {
                job: jobs[2]._id,
                applicant: applicants[4]._id,
                employer: employers[1]._id,
                status: 'accepted',
                coverLetter: 'I love making coffee!',
            },
            {
                job: jobs[2]._id,
                applicant: applicants[2]._id,
                employer: employers[1]._id,
                status: 'applied',
                coverLetter: 'I am eager to learn barista skills.',
            },
            {
                job: jobs[4]._id,
                applicant: applicants[2]._id,
                employer: employers[2]._id,
                status: 'reviewing',
                coverLetter: 'I have retail experience.',
            },
            {
                job: jobs[5]._id,
                applicant: applicants[3]._id,
                employer: employers[2]._id,
                status: 'accepted',
                coverLetter: 'I have 4 years of delivery experience.',
            },
        ]);

        // Get counts
        const counts = {
            admins: await Admin.countDocuments(),
            employers: await Employer.countDocuments(),
            applicants: await Applicant.countDocuments(),
            jobs: await Job.countDocuments(),
            applications: await Application.countDocuments(),
        };

        res.status(200).json({
            success: true,
            message: 'Database seeded successfully',
            data: counts,
            credentials: {
                admin: { email: 'admin@shiftmaster.com', password: 'admin123456' },
                employers: [
                    { email: 'john@grandrestaurant.com', password: 'password123' },
                    { email: 'sarah@quickbites.com', password: 'password123' },
                    { email: 'michael@retailparadise.com', password: 'password123' },
                ],
                applicants: [
                    { email: 'priya.sharma@email.com', password: 'password123' },
                    { email: 'rahul.kumar@email.com', password: 'password123' },
                    { email: 'anita.patel@email.com', password: 'password123' },
                    { email: 'vikram.singh@email.com', password: 'password123' },
                    { email: 'sneha.reddy@email.com', password: 'password123' },
                ],
            },
        });
    } catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({
            success: false,
            message: 'Error seeding database',
            error: error.message,
        });
    }
};

module.exports = { seedDatabase };
