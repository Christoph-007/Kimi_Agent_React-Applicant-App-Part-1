const mongoose = require('mongoose');
const Employer = require('../src/models/Employer');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkBakery() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check all that match bakery
    const bakeries = await Employer.find({ storeName: { $regex: /bakery/i } }).select('+password');
    for (const bakery of bakeries) {
      console.log(`Email: ${bakery.email}`);
      console.log(`Store Name: ${bakery.storeName}`);
      let isMatch1 = await bcrypt.compare('123456', bakery.password);
      let isMatch2 = await bcrypt.compare('12345678', bakery.password);
      let isMatch3 = await bcrypt.compare('password123', bakery.password);
      
      if (isMatch1) console.log('Password is: 123456');
      if (isMatch2) console.log('Password is: 12345678');
      if (isMatch3) console.log('Password is: password123');
    }

    if (bakeries.length === 0) {
      console.log('No bakeries found');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkBakery();
