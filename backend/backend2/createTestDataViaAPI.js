// Test Data Creation via API
// This script uses the ShiftMaster API to create test data

const baseURL = 'http://localhost:5000/api';

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, token = null) {
    const url = `${baseURL}${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error with ${method} ${endpoint}:`, error.message);
        throw error;
    }
}

async function createTestData() {
    console.log('🚀 Starting test data creation via API...\n');

    try {
        // 1. Create Admin (using direct script)
        console.log('📝 Step 1: Create admin user');
        console.log('   Run: node createAdmin.js');
        console.log('   (This creates admin@shiftmaster.com / admin123456)\n');

        // 2. Register Employers
        console.log('📝 Step 2: Register Employers');

        const employer1Data = {
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
        };

        const employer1 = await apiRequest('POST', '/auth/employer/signup', employer1Data);
        console.log('   ✅ Employer 1:', employer1.success ? 'Created' : 'Failed');

        const employer2Data = {
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
            businessType: 'cafe',
            businessDescription: 'Fast casual cafe with fresh sandwiches and coffee',
        };

        const employer2 = await apiRequest('POST', '/auth/employer/signup', employer2Data);
        console.log('   ✅ Employer 2:', employer2.success ? 'Created' : 'Failed');

        // 3. Register Applicants
        console.log('\n📝 Step 3: Register Applicants');

        const applicant1Data = {
            name: 'Priya Sharma',
            phone: '9123456780',
            email: 'priya.sharma@email.com',
            password: 'password123',
            skills: ['customer service', 'communication', 'teamwork'],
            experience: 2,
            preferredJobType: 'shift',
        };

        const applicant1 = await apiRequest('POST', '/auth/applicant/signup', applicant1Data);
        console.log('   ✅ Applicant 1:', applicant1.success ? 'Created' : 'Failed');

        const applicant2Data = {
            name: 'Rahul Kumar',
            phone: '9123456781',
            email: 'rahul.kumar@email.com',
            password: 'password123',
            skills: ['cooking', 'food preparation', 'kitchen management'],
            experience: 3,
            preferredJobType: 'full-time',
        };

        const applicant2 = await apiRequest('POST', '/auth/applicant/signup', applicant2Data);
        console.log('   ✅ Applicant 2:', applicant2.success ? 'Created' : 'Failed');

        // 4. Login as Admin to approve employers
        console.log('\n📝 Step 4: Login as Admin');
        const adminLogin = await apiRequest('POST', '/auth/login', {
            identifier: 'admin@shiftmaster.com',
            password: 'admin123456',
            userType: 'admin',
        });

        if (!adminLogin.success) {
            console.log('   ⚠️  Admin login failed. Please run: node createAdmin.js first');
            return;
        }

        const adminToken = adminLogin.token;
        console.log('   ✅ Admin logged in');

        // Note: You'll need to get employer IDs and approve them manually or via admin panel
        console.log('\n📝 Step 5: Approve Employers (Manual Step)');
        console.log('   ⚠️  You need to approve employers via admin panel or API');
        console.log('   Endpoint: PUT /api/admin/employers/{employerId}/approve');

        // 5. Login as Employer and create jobs
        console.log('\n📝 Step 6: Login as Employer and Create Jobs');
        const employer1Login = await apiRequest('POST', '/auth/login', {
            identifier: 'john@grandrestaurant.com',
            password: 'password123',
            userType: 'employer',
        });

        if (employer1Login.success) {
            const employer1Token = employer1Login.token;
            console.log('   ✅ Employer 1 logged in');

            // Create a job
            const job1Data = {
                title: 'Waiter/Waitress',
                description: 'Looking for experienced waiters to join our fine dining team.',
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
            };

            const job1 = await apiRequest('POST', '/jobs', job1Data, employer1Token);
            console.log('   ✅ Job 1:', job1.success ? 'Created' : 'Failed');
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 TEST DATA CREATION COMPLETED!');
        console.log('='.repeat(60));
        console.log('\n🔑 Login Credentials:');
        console.log('\n   ADMIN:');
        console.log('   Email: admin@shiftmaster.com');
        console.log('   Password: admin123456');
        console.log('\n   EMPLOYERS:');
        console.log('   1. john@grandrestaurant.com / password123');
        console.log('   2. sarah@quickbites.com / password123');
        console.log('\n   APPLICANTS:');
        console.log('   1. priya.sharma@email.com / password123');
        console.log('   2. rahul.kumar@email.com / password123');
        console.log('\n✅ You can now test the API with this data!');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('\n❌ Error creating test data:', error.message);
    }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.error('❌ This script requires Node.js 18+ with native fetch support');
    console.log('   Alternative: Run node createAdmin.js and use Postman to create test data');
    process.exit(1);
}

createTestData();
