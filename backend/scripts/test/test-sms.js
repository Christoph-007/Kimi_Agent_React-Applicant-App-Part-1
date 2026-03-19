require('dotenv').config();
const twilio = require('twilio');

const testSMS = async () => {
    console.log('\n📱 Starting SMS Test...\n');
    console.log('Twilio Configuration:');
    console.log('  Account SID  :', process.env.TWILIO_ACCOUNT_SID);
    console.log('  From Number  :', process.env.TWILIO_PHONE_NUMBER);
    console.log('');

    // --- 🔴 CHANGE THIS to your actual phone number (E.164 format) ---
    const TO_PHONE_NUMBER = '+916282794815'; // India
    // -----------------------------------------------------------------

    if (TO_PHONE_NUMBER.includes('XXXXXXXXXX')) {
        console.error('❌ Please edit test-sms.js and set your real phone number in TO_PHONE_NUMBER!');
        console.error('   Example: const TO_PHONE_NUMBER = \'+919876543210\';');
        process.exit(1);
    }

    // Initialize Twilio client
    const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    // SMS message body (plain text)
    const messageBody =
        `Hello from ShiftMaster! 👋

This is a test SMS to confirm your Twilio integration is working.

Details:
  Sent At : ${new Date().toLocaleString()}
  From    : ${process.env.TWILIO_PHONE_NUMBER}
  Status  : ✅ Delivered

Regards,
ShiftMaster Team`;

    console.log('📤 Sending SMS to :', TO_PHONE_NUMBER);
    console.log('📝 Message        :\n');
    console.log(messageBody);
    console.log('\n--- Sending ---\n');

    try {
        const message = await client.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: TO_PHONE_NUMBER,
        });

        console.log('✅ SMS sent successfully!');
        console.log('   SID    :', message.sid);
        console.log('   Status :', message.status);
        console.log('   To     :', message.to);
        console.log('   From   :', message.from);
        console.log('\n📬 Check your phone at:', TO_PHONE_NUMBER);
    } catch (err) {
        console.error('❌ Failed to send SMS:', err.message);
        if (err.code) console.error('   Twilio Error Code:', err.code);
        process.exit(1);
    }
};

testSMS();
