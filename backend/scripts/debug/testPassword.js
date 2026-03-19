const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shiftmaster';

async function test() {
  try {
    console.log('Connecting to:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const Employer = require('../src/models/Employer');
    const user = await Employer.findOne({ email: 'john@grandrestaurant.com' }).select('+password');
    
    if (!user) {
      console.log('User john@grandrestaurant.com NOT found in database.');
      // List all employers
      const all = await Employer.find().select('email');
      console.log('Available employers:', all.map(e => e.email));
    } else {
      console.log('User found. Password hash:', user.password);
      const isMatch = await bcrypt.compare('password123', user.password);
      console.log(`Does 'password123' match? ${isMatch}`);
      
      const isMatch2 = await bcrypt.compare('123456', user.password);
      console.log(`Does '123456' match? ${isMatch2}`);
    }
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

test();
