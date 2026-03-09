const nodemailer = require('nodemailer');

let transporter = null;

// Only initialize email if credentials are properly configured
if (process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_USER !== 'your-email@gmail.com') {

    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Verify transporter configuration
    transporter.verify((error, success) => {
        if (error) {
            console.log('❌ Email configuration error:', error.message);
        } else {
            console.log('✅ Email server is ready to send messages');
        }
    });
} else {
    console.warn('⚠️  Email credentials not configured. Email functionality will be disabled.');
}

module.exports = transporter;
