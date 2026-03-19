const mongoose = require('mongoose');
require('dotenv').config();
const Applicant = require('./src/models/Applicant');
const Employer = require('./src/models/Employer');

async function checkUser(email) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const applicant = await Applicant.findOne({ email });
        const employer = await Employer.findOne({ email });

        console.log('--- Results for:', email, '---');
        console.log('Applicant found:', !!applicant, applicant ? `(ID: ${applicant._id})` : '');
        console.log('Employer found:', !!employer, employer ? `(ID: ${employer._id})` : '');
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUser('christophleon00762@gmail.com');
