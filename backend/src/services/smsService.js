const twilioClient = require('../config/sms');

const sendSMS = async ({ to, message }) => {
    try {
        // Check if Twilio is configured
        if (!twilioClient) {
            console.warn(`⚠️  SMS not sent to ${to}: Twilio not configured`);
            return { success: false, error: 'SMS service not configured' };
        }

        // Ensure phone number is in E.164 format (+country code + number)
        const formattedPhone = to.startsWith('+') ? to : `+91${to}`;

        const smsResponse = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone,
        });

        console.log(`✅ SMS sent to ${to}: ${smsResponse.sid}`);
        return { success: true, sid: smsResponse.sid };
    } catch (error) {
        console.error(`❌ SMS sending failed to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendSMS };
