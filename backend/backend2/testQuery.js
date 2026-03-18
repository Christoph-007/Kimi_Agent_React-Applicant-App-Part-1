const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const Applicant = require('./src/models/Applicant');
    const applicants = await Applicant.find({ isActive: true, isAvailable: true });
    console.log(`Found ${applicants.length} applicants.`);
    console.log(applicants.map(a => a.name));
    mongoose.connection.close();
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
