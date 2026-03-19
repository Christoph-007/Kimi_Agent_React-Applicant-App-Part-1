// Database Seeding Script - Comprehensive Sample Data
// This script populates the database with complete sample data

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Admin = require('../src/models/Admin');
const Employer = require('../src/models/Employer');
const Applicant = require('../src/models/Applicant');
const Job = require('../src/models/Job');
const Application = require('../src/models/Application');
const Category = require('../src/models/Category');

// Sample data
const sampleData = {
    admin: {
        name: 'Super Admin',
        email: 'admin@shiftmaster.com',
        password: 'admin123456',
        role: 'super-admin',
        permissions: ['all'],
    },

    employers: [
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
    ],

    applicants: [
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
    ],
};

async function seedDatabase() {
    let connection;

    try {
        console.log('\n========================================');
        console.log('  SHIFTMASTER DATABASE SEEDING');
        console.log('========================================\n');

        // Connect to database with retry logic
        console.log('Connecting to MongoDB...');
        let retries = 3;
        while (retries > 0) {
            try {
                connection = await mongoose.connect(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    serverSelectionTimeoutMS: 10000,
                    socketTimeoutMS: 45000,
                });
                console.log('✓ Connected to MongoDB:', connection.connection.host);
                break;
            } catch (err) {
                retries--;
                if (retries === 0) throw err;
                console.log(`Connection failed, retrying... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // Clear existing data
        console.log('\nClearing existing data...');
        await Promise.all([
            Admin.deleteMany({}),
            Employer.deleteMany({}),
            Applicant.deleteMany({}),
            Job.deleteMany({}),
            Application.deleteMany({}),
            Category.deleteMany({}),
        ]);
        console.log('✓ Database cleared');

        // Create Categories
        console.log('\nCreating Categories...');
        const initialCategories = [
            { name: 'Waiter/Waitress', icon: 'User' },
            { name: 'Chef', icon: 'ChefHat' },
            { name: 'Barista', icon: 'Coffee' },
            { name: 'Kitchen Helper', icon: 'Utensils' },
            { name: 'Sales Associate', icon: 'ShoppingBag' },
            { name: 'Delivery Person', icon: 'Truck' },
        ];
        const categories = await Category.create(initialCategories);
        console.log('✓ Categories created:', categories.length);

        // Create Admin
        console.log('\nCreating Admin...');
        const admin = await Admin.create(sampleData.admin);
        console.log('✓ Admin created:', admin.email);

        // Create Employers
        console.log('\nCreating Employers...');
        const employers = [];
        for (const empData of sampleData.employers) {
            const employer = await Employer.create(empData);
            employers.push(employer);
            console.log('✓ Employer created:', employer.email);
        }

        // Create Applicants
        console.log('\nCreating Applicants...');
        const applicants = [];
        for (const appData of sampleData.applicants) {
            const applicant = await Applicant.create(appData);
            applicants.push(applicant);
            console.log('✓ Applicant created:', applicant.email);
        }

        // Create Jobs
        console.log('\nCreating Jobs...');
        const jobs = [];

        const jobsData = [
            {
                employer: employers[0]._id,
                title: 'Waiter/Waitress',
                description: 'Looking for experienced waiters to join our fine dining team. Must have excellent customer service skills.',
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
                description: 'Join our team as a barista! Make great coffee and serve customers.',
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
                description: 'Assist in food preparation and maintain kitchen cleanliness.',
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
                description: 'Deliver products to customers. Must have valid driving license.',
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
        ];

        for (const jobData of jobsData) {
            const job = await Job.create(jobData);
            jobs.push(job);
            console.log('✓ Job created:', job.title);
        }

        // Create Applications
        console.log('\nCreating Applications...');
        const applicationsData = [
            {
                job: jobs[0]._id,
                applicant: applicants[0]._id,
                employer: employers[0]._id,
                status: 'applied',
                coverLetter: 'I am very interested in this position and have 2 years of experience.',
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
                coverLetter: 'I love making coffee and would be thrilled to join your team!',
            },
            {
                job: jobs[2]._id,
                applicant: applicants[2]._id,
                employer: employers[1]._id,
                status: 'applied',
                coverLetter: 'I have experience in customer service and am eager to learn.',
            },
            {
                job: jobs[4]._id,
                applicant: applicants[2]._id,
                employer: employers[2]._id,
                status: 'reviewing',
                coverLetter: 'I have 1 year of experience in retail.',
            },
            {
                job: jobs[5]._id,
                applicant: applicants[3]._id,
                employer: employers[2]._id,
                status: 'accepted',
                coverLetter: 'I have 4 years of delivery experience and a valid license.',
            },
        ];

        for (const appData of applicationsData) {
            const application = await Application.create(appData);
            console.log('✓ Application created: Job', application.job);
        }

        // Summary
        console.log('\n========================================');
        console.log('  SEEDING COMPLETED SUCCESSFULLY!');
        console.log('========================================\n');

        console.log('Database Summary:');
        console.log(`  • Admins:       ${await Admin.countDocuments()}`);
        console.log(`  • Employers:    ${await Employer.countDocuments()}`);
        console.log(`  • Applicants:   ${await Applicant.countDocuments()}`);
        console.log(`  • Categories:   ${await Category.countDocuments()}`);
        console.log(`  • Jobs:         ${await Job.countDocuments()}`);
        console.log(`  • Applications: ${await Application.countDocuments()}`);

        console.log('\nLogin Credentials:');
        console.log('\n  ADMIN:');
        console.log('    Email:    admin@shiftmaster.com');
        console.log('    Password: admin123456');

        console.log('\n  EMPLOYERS:');
        console.log('    1. john@grandrestaurant.com / password123');
        console.log('    2. sarah@quickbites.com / password123');
        console.log('    3. michael@retailparadise.com / password123');

        console.log('\n  APPLICANTS:');
        console.log('    1. priya.sharma@email.com / password123');
        console.log('    2. rahul.kumar@email.com / password123');
        console.log('    3. anita.patel@email.com / password123');
        console.log('    4. vikram.singh@email.com / password123');
        console.log('    5. sneha.reddy@email.com / password123');

        console.log('\n========================================\n');

        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);

    } catch (error) {
        console.error('\n========================================');
        console.error('  ERROR DURING SEEDING');
        console.error('========================================\n');
        console.error('Error:', error.message);
        console.error('\nFull error:', error);

        if (connection) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

// Run the seeding
seedDatabase();
