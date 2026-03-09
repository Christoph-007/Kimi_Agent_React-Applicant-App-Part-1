const twilio = require('twilio');

// Only initialize Twilio if credentials are properly configured
let twilioClient = null;

if (process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_ACCOUNT_SID !== 'your_account_sid') {
    twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
} else {
    console.warn('⚠️  Twilio credentials not configured. SMS functionality will be disabled.');
}

module.exports = twilioClient;
