const mongoose = require('mongoose');
const Employer = require('./src/models/Employer');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'john@grandrestaurant.com';
    const newPassword = '12345678';
    
    // Hash password manually to be safe, or just use the model's pre-save if it has one
    // Actually, it's safer to just find and save
    const employer = await Employer.findOne({ email });
    
    if (employer) {
      employer.password = newPassword;
      employer.isBlocked = false;
      await employer.save();
      console.log(`✓ Password for ${email} has been reset to: ${newPassword}`);
      console.log(`✓ Account is unblocked.`);
    } else {
      console.log('✗ Employer not found.');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

fixPassword();
