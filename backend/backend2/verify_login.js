const mongoose = require('mongoose');
const Applicant = require('./src/models/Applicant');
const Employer = require('./src/models/Employer');
const Admin = require('./src/models/Admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'john@grandrestaurant.com';
    const password = '12345678';
    console.log(`\nSearching for user with email: ${email}`);

    const employer = await Employer.findOne({ email }).select('+password');
    if (employer) {
      console.log('Found Employer:');
      console.log(`Name: ${employer.storeName}`);
      console.log(`isBlocked: ${employer.isBlocked}`);
      if (employer.password) {
        const isMatch = await bcrypt.compare(password, employer.password);
        console.log(`Password "${password}" matches: ${isMatch}`);
      } else {
        console.log('Password field is missing in employer record.');
      }
    } else {
      console.log('Employer not found by email.');
    }
    const admin = await Admin.findOne({ email: 'admin@example.com' }).select('+password');
    if (admin) {
      console.log('Found Admin:');
      const isMatch = await bcrypt.compare('password123', admin.password);
      console.log(`Password "password123" matches: ${isMatch}`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkUser();
