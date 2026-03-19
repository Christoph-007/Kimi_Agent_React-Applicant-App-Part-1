const mongoose = require('mongoose');
const Applicant = require('../src/models/Applicant');
const Employer = require('./src/models/Employer');
require('dotenv').config();

async function checkStatus() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const applicants = await Applicant.find({}, 'name phone isActive').limit(20);
    console.log('\n--- Applicants ---');
    applicants.forEach(a => console.log(`${a.name} (${a.phone}): isActive=${a.isActive}`));

    const employers = await Employer.find({}, 'storeName isBlocked').limit(20);
    console.log('\n--- Employers ---');
    employers.forEach(e => console.log(`${e.storeName}: isBlocked=${e.isBlocked}`));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkStatus();
