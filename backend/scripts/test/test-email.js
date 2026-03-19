require('dotenv').config();
const nodemailer = require('nodemailer');

const testTextEmail = async () => {
    console.log('\n📧 Sending Plain Text Email...\n');

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log('✅ SMTP connection verified.\n');

    // Plain text email data
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_USER,   // sending to yourself as test
        subject: 'ShiftMaster - Plain Text Test Email',
        text: `Hello from ShiftMaster!

This is a plain text test email sent from the ShiftMaster application.

Details:
  - Sent At   : ${new Date().toLocaleString()}
  - SMTP Host : ${process.env.EMAIL_HOST}
  - Port      : ${process.env.EMAIL_PORT}
  - Sender    : ${process.env.EMAIL_FROM}

This confirms that the email service is working correctly using plain text format.

Regards,
ShiftMaster Team`,
    };

    console.log('📤 To      :', mailOptions.to);
    console.log('📝 Subject :', mailOptions.subject);
    console.log('📄 Body    :\n');
    console.log(mailOptions.text);
    console.log('\n--- Sending ---');

    const info = await transporter.sendMail(mailOptions);

    console.log('\n✅ Email sent successfully!');
    console.log('   Message ID :', info.messageId);
    console.log('   Server Res :', info.response);
    console.log('\n📬 Check inbox at:', process.env.EMAIL_USER);
};

testTextEmail().catch((err) => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
});
