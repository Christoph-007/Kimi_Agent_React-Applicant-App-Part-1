const transporter = require('../config/email');

const sendEmail = async ({ to, subject, html, text }) => {
    try {
        // Check if email is configured
        if (!transporter) {
            console.warn(`⚠️  Email not sent to ${to}: Email service not configured`);
            return { success: false, error: 'Email service not configured' };
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Email sending failed to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
