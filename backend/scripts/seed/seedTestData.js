require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');
const Employer = require('../src/models/Employer');
const Applicant = require('../src/models/Applicant');
const Job = require('../src/models/Job');
const Application = require('../src/models/Application');

const seedTestData = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ Connected to MongoDB');

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing data...');
        await Admin.deleteMany({});
        await Employer.deleteMany({});
        await Applicant.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});
        console.log('✅ Existing data cleared');

        // 1. Create Admin User
        console.log('\n📝 Creating Admin User...');
        const admin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@shiftmaster.com',
            password: 'admin123456',
            role: 'super-admin',
            permissions: ['all'],
        });
        console.log('✅ Admin created:', admin.email);

        // 2. Create Employers
        console.log('\n📝 Creating Employers...');
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
                businessDescription: 'Multi-brand retail store with clothing and accessories',
                isApproved: true,
                isActive: true,
            },
        ]);
        console.log(`✅ Created ${employers.length} employers`);

        // 3. Create Applicants
        console.log('\n📝 Creating Applicants...');
        const applicants = await Applicant.create([
            {
                name: 'Priya Sharma',
                phone: '9123456780',
                email: 'priya.sharma@email.com',
                password: 'password123',
                skills: ['customer service', 'communication', 'teamwork'],
                experience: 2,
                preferredJobType: 'shift',
                location: {
                    city: 'Mumbai',
                    state: 'Maharashtra',
                },
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
                location: {
                    city: 'Mumbai',
                    state: 'Maharashtra',
                },
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
                location: {
                    city: 'Bangalore',
                    state: 'Karnataka',
                },
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
                location: {
                    city: 'Delhi',
                    state: 'Delhi',
                },
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
                location: {
                    city: 'Bangalore',
                    state: 'Karnataka',
                },
                isActive: true,
            },
        ]);
        console.log(`✅ Created ${applicants.length} applicants`);

        // 4. Create Jobs
        console.log('\n📝 Creating Jobs...');
        const jobs = await Job.create([
            {
                employer: employers[0]._id,
                title: 'Waiter/Waitress',
                description: 'Looking for experienced waiters to join our fine dining team. Must have excellent customer service skills.',
                jobType: 'shift',
                salary: {
                    amount: 500,
                    period: 'daily',
                },
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
                description: 'Experienced chef needed for continental cuisine. Must be creative and passionate about food.',
                jobType: 'full-time',
                salary: {
                    amount: 35000,
                    period: 'monthly',
                },
                location: {
                    address: '123 MG Road',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                },
                requirements: {
                    minimumExperience: 3,
                    skills: ['cooking', 'food preparation', 'kitchen management'],
                    education: 'Culinary Degree Preferred',
                },
                openings: 1,
                status: 'open',
            },
            {
                employer: employers[1]._id,
                title: 'Barista',
                description: 'Join our team as a barista! Make great coffee and serve customers with a smile.',
                jobType: 'part-time',
                salary: {
                    amount: 300,
                    period: 'daily',
                },
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
                salary: {
                    amount: 400,
                    period: 'daily',
                },
                location: {
                    address: '456 Brigade Road',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    pincode: '560001',
                },
                requirements: {
                    minimumExperience: 0,
                    skills: ['teamwork', 'basic cooking'],
                    education: 'Any',
                },
                openings: 2,
                status: 'open',
            },
            {
                employer: employers[2]._id,
                title: 'Sales Associate',
                description: 'Help customers find products and manage inventory in our retail store.',
                jobType: 'full-time',
                salary: {
                    amount: 25000,
                    period: 'monthly',
                },
                location: {
                    address: '789 Park Street',
                    city: 'Delhi',
                    state: 'Delhi',
                    pincode: '110001',
                },
                requirements: {
                    minimumExperience: 1,
                    skills: ['sales', 'customer service', 'inventory management'],
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
                salary: {
                    amount: 600,
                    period: 'daily',
                },
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
        console.log(`✅ Created ${jobs.length} jobs`);

        // 5. Create Applications
        console.log('\n📝 Creating Applications...');
        const applications = await Application.create([
            {
                job: jobs[0]._id,
                applicant: applicants[0]._id,
                employer: employers[0]._id,
                status: 'applied',
                coverLetter: 'I am very interested in this position and have 2 years of experience in customer service.',
            },
            {
                job: jobs[1]._id,
                applicant: applicants[1]._id,
                employer: employers[0]._id,
                status: 'reviewing',
                coverLetter: 'I am a passionate chef with 3 years of experience in continental cuisine.',
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
                coverLetter: 'I have experience in customer service and am eager to learn barista skills.',
            },
            {
                job: jobs[4]._id,
                applicant: applicants[2]._id,
                employer: employers[2]._id,
                status: 'reviewing',
                coverLetter: 'I have 1 year of experience in retail and excellent customer service skills.',
            },
            {
                job: jobs[5]._id,
                applicant: applicants[3]._id,
                employer: employers[2]._id,
                status: 'accepted',
                coverLetter: 'I have 4 years of delivery experience and a valid driving license.',
            },
        ]);
        console.log(`✅ Created ${applications.length} applications`);

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('🎉 TEST DATA SEEDED SUCCESSFULLY!');
        console.log('='.repeat(50));
        console.log('\n📊 Summary:');
        console.log(`   • ${await Admin.countDocuments()} Admin(s)`);
        console.log(`   • ${await Employer.countDocuments()} Employer(s)`);
        console.log(`   • ${await Applicant.countDocuments()} Applicant(s)`);
        console.log(`   • ${await Job.countDocuments()} Job(s)`);
        console.log(`   • ${await Application.countDocuments()} Application(s)`);

        console.log('\n🔑 Login Credentials:');
        console.log('\n   ADMIN:');
        console.log('   Email: admin@shiftmaster.com');
        console.log('   Password: admin123456');

        console.log('\n   EMPLOYERS:');
        console.log('   1. john@grandrestaurant.com / password123');
        console.log('   2. sarah@quickbites.com / password123');
        console.log('   3. michael@retailparadise.com / password123');

        console.log('\n   APPLICANTS:');
        console.log('   1. priya.sharma@email.com / password123');
        console.log('   2. rahul.kumar@email.com / password123');
        console.log('   3. anita.patel@email.com / password123');
        console.log('   4. vikram.singh@email.com / password123');
        console.log('   5. sneha.reddy@email.com / password123');

        console.log('\n✅ You can now test the API with this data!');
        console.log('='.repeat(50) + '\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error.message);
        console.error(error);
        process.exit(1);
    }
};

seedTestData();
