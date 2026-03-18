require('dotenv').config();
const twilio = require('twilio');

const checkStatus = async () => {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const TO_PHONE = '+918590328473';

    console.log(`\n🔍 Sending test to ${TO_PHONE} and tracking status...`);

    try {
        const message = await client.messages.create({
            body: "ShiftMaster Test: Please check if this arrives.",
            from: process.env.TWILIO_PHONE_NUMBER,
            to: TO_PHONE
        });

        console.log(`✅ Message Created. SID: ${message.sid}`);

        // Poll for status update
        for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const updatedMessage = await client.messages(message.sid).fetch();
            console.log(`   [${i + 1}] Status: ${updatedMessage.status}`);

            if (updatedMessage.status === 'failed' || updatedMessage.status === 'undelivered') {
                console.error(`❌ FAILED: ${updatedMessage.errorMessage}`);
                console.error(`   Error Code: ${updatedMessage.errorCode}`);
                console.log(`\n💡 Tip: If Error Code is 21608, you MUST verify the number at:`);
                console.log(`   https://www.twilio.com/console/phone-numbers/verified`);
                return;
            }
            if (updatedMessage.status === 'delivered') {
                console.log('🎉 SUCCESS: Message delivered!');
                return;
            }
        }

        console.log('\n⏳ Message is still queued/sending. This usually means it is waiting for carrier delivery or blocked by DND.');
    } catch (err) {
        console.error(`❌ immediate Error: ${err.message}`);
    }
};

checkStatus();
