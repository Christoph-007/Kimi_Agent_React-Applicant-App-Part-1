const mongoose = require('mongoose');
require('dotenv').config();
const Applicant = require('./src/models/Applicant');

async function resetPassword(email, newPassword) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const applicant = await Applicant.findOne({ email });
        if (!applicant) {
            console.log('Applicant not found');
            process.exit(1);
        }

        applicant.password = newPassword;
        await applicant.save();

        console.log('✅ Password for', email, 'has been reset to:', newPassword);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

resetPassword('justeenasanty872@gmail.com', 'password123');
