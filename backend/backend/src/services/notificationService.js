const { sendEmail } = require('./emailService');
const { sendSMS } = require('./smsService');
const {
    employerSignupTemplate,
    employerApprovalTemplate,
    applicantSignupTemplate,
    applicationStatusTemplate,
    shiftAssignmentTemplate,
} = require('../utils/emailTemplates');

// Notify employer on signup
const notifyEmployerSignup = async (employer) => {
    const template = employerSignupTemplate(employer.ownerName, employer.storeName);
    await sendEmail({
        to: employer.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
    });
};

// Notify employer on approval
const notifyEmployerApproval = async (employer) => {
    const template = employerApprovalTemplate(employer.ownerName, employer.storeName);
    await sendEmail({
        to: employer.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
    });
};

// Notify applicant on signup
const notifyApplicantSignup = async (applicant) => {
    if (applicant.email) {
        const template = applicantSignupTemplate(applicant.name);
        await sendEmail({
            to: applicant.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
};

// Notify applicant on application status change
const notifyApplicationStatus = async (application, applicant, job, employer) => {
    const template = applicationStatusTemplate(
        applicant.name,
        job.title,
        application.status,
        employer.storeName
    );

    // Send email if available
    if (applicant.email) {
        await sendEmail({
            to: applicant.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }

    // Send SMS for accepted applications
    if (application.status === 'accepted') {
        await sendSMS({
            to: applicant.phone,
            message: `Congratulations! Your application for ${job.title} at ${employer.storeName} has been accepted. Check your email for details.`,
        });
    }
};

// Notify applicant on shift assignment
const notifyShiftAssignment = async (shift, applicant, job) => {
    const template = shiftAssignmentTemplate(
        applicant.name,
        job.title,
        shift.date,
        shift.startTime,
        shift.endTime,
        shift.location
    );

    // Send email if available
    if (applicant.email) {
        await sendEmail({
            to: applicant.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }

    // Send SMS notification
    await sendSMS({
        to: applicant.phone,
        message: `New shift assigned for ${job.title} on ${new Date(shift.date).toLocaleDateString()} at ${shift.startTime}. Location: ${shift.location}`,
    });
};

module.exports = {
    notifyEmployerSignup,
    notifyEmployerApproval,
    notifyApplicantSignup,
    notifyApplicationStatus,
    notifyShiftAssignment,
};
