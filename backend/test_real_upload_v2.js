const jwt = require('jsonwebtoken');
require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUploadReal() {
    try {
        const userId = '69baba9c3a4e5f317102ea33'; 
        const userType = 'applicant';
        const token = jwt.sign({ id: userId, userType }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        console.log('--- Testing Upload with Valid PDF header ---');
        
        const dummyPath = path.join(__dirname, 'dummy_resume.pdf');
        // A minimal valid PDF header/footer
        const pdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF');
        fs.writeFileSync(dummyPath, pdfContent);

        const form = new FormData();
        // Manually set mimetype to mimic browser behavior
        form.append('resume', fs.createReadStream(dummyPath), { contentType: 'application/pdf', filename: 'dummy_resume.pdf' });

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
