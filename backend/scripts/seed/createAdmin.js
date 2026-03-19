require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

const createAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@shiftmaster.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@shiftmaster.com',
            password: 'admin123456',
            role: 'super-admin',
            permissions: ['all'],
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@shiftmaster.com');
        console.log('🔑 Password: admin123456');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
