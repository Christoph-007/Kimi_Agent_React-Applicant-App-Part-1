const mongoose = require('mongoose');
const Applicant = require('./src/models/Applicant');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'justeenasanty872@gmail.com';
    const password = 'password123';
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const result = await Applicant.findOneAndUpdate(
      { email },
      { password: hashed, isActive: true },
      { new: true }
    );

    if (result) {
      console.log(`Successfully updated password and activated account for: ${email}`);
    } else {
      console.log(`User not found: ${email}`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

fixPassword();
