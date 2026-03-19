const mongoose = require('mongoose');
require('dotenv').config();
const Applicant = require('./src/models/Applicant');
const Employer = require('./src/models/Employer');

async function searchUser(searchTerm) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const query = { 
            $or: [
                { email: searchTerm },
                { phone: searchTerm },
                { name: searchTerm },
                { fullName: searchTerm },
                { storeName: searchTerm },
                { ownerName: searchTerm }
            ] 
        };

        const applicants = await Applicant.find(query);
        const employers = await Employer.find(query);

        console.log('--- Search Results for:', searchTerm, '---');
        console.log('Applicants found:', applicants.length);
        applicants.forEach(a => console.log(`  - ${a.name} (${a.email}) [ID: ${a._id}]`));
        
        console.log('Employers found:', employers.length);
        employers.forEach(e => console.log(`  - ${e.ownerName} / ${e.storeName} (${e.email}) [ID: ${e._id}]`));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

// Search for the name "Christoph Leon"
searchUser('Christoph Leon');
