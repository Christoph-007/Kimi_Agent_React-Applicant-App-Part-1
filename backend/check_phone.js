const mongoose = require('mongoose');
require('dotenv').config();
const Applicant = require('./src/models/Applicant');
const Employer = require('./src/models/Employer');

async function checkUser(phone) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const applicant = await Applicant.findOne({ phone });
        const employer = await Employer.findOne({ phone });

        console.log('--- Results for Phone:', phone, '---');
        console.log('Applicant found:', !!applicant, applicant ? `(ID: ${applicant._id}, Email: ${applicant.email})` : '');
        console.log('Employer found:', !!employer, employer ? `(ID: ${employer._id}, Email: ${employer.email})` : '');
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUser('8590328473');
