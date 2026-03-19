const jwt = require('jsonwebtoken');
require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUploadReal() {
    try {
        // Justeena Santy's ID (from previous check)
        const userId = '69baba9c3a4e5f317102ea33'; 
        const userType = 'applicant';

        // Generate token
        const token = jwt.sign({ id: userId, userType }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        console.log('--- Testing Upload for Applicant (Justeena Santy) ---');
        
        // Create a dummy pdf file
        const dummyPath = path.join(__dirname, 'dummy_resume.pdf');
        fs.writeFileSync(dummyPath, 'This is a dummy PDF content.');

        const form = new FormData();
        form.append('resume', fs.createReadStream(dummyPath));

        const response = await axios.post('http://localhost:5005/api/resume/upload', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('SUCCESS:', response.data);
        fs.unlinkSync(dummyPath);
        process.exit(0);
    } catch (err) {
        console.error('FAILED:', err.response ? err.response.data : err.message);
        process.exit(1);
    }
}

testUploadReal();
