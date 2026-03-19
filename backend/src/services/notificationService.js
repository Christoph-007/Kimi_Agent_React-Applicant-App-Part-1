const { sendEmail } = require('./emailService');
const { sendSMS } = require('./smsService');
const {
    employerSignupTemplate,
    employerApprovalTemplate,
    applicantSignupTemplate,
    shiftAssignmentTemplate,
    forgotPasswordTemplate,
    adminNewEmployerTemplate,
    employerNewApplicationTemplate,
    applicantActivationTemplate,
    employerBlockedTemplate,
    employerUnblockedTemplate,
    applicantDeactivatedTemplate,
    employerJobDeletedTemplate,
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

    if (employer.phone) {
        await sendSMS({
            to: employer.phone,
            message: `Great news! Your ShiftMatch employer account for ${employer.storeName} has been approved. You can now post jobs and hire applicants!`,
        });
    }
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

// Notify user on password reset request
const notifyForgotPassword = async (user, resetUrl) => {
    const template = forgotPasswordTemplate(user.name || user.ownerName, resetUrl);
    await sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
    });

    // Also send SMS if phone is available
    if (user.phone) {
        await sendSMS({
            to: user.phone,
            message: `Your ShiftMatch password reset link: ${resetUrl}`,
        });
    }
};

// Notify admin of new employer signup
const notifyAdminOfEmployerSignup = async (employer) => {
    const adminEmail = process.env.EMAIL_USER; // Default to EMAIL_USER as admin email
    const template = adminNewEmployerTemplate(employer);
    await sendEmail({
        to: adminEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
    });
};

// Notify employer of new application
const notifyEmployerOfNewApplication = async (employer, applicant, job) => {
    if (employer.email) {
        const template = employerNewApplicationTemplate(employer.ownerName, applicant.name, job.title);
        await sendEmail({
            to: employer.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
    
    // Optional SMS to employer
    if (employer.phone) {
        await sendSMS({
            to: employer.phone,
            message: `New application received from ${applicant.name} for your job: ${job.title}.`,
        });
    }
};

// Notify applicant on account activation
const notifyApplicantActivation = async (applicant) => {
    if (applicant.email) {
        const template = applicantActivationTemplate(applicant.name);
        await sendEmail({
            to: applicant.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
    
    if (applicant.phone) {
        await sendSMS({
            to: applicant.phone,
            message: `Congratulations ${applicant.name}! Your ShiftMatch account has been activated. You can now start applying for jobs.`,
        });
    }
};

// Notify employer on block
const notifyEmployerBlocked = async (employer) => {
    if (employer.email) {
        const template = employerBlockedTemplate(employer.ownerName, employer.storeName);
        await sendEmail({
            to: employer.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }

    if (employer.phone) {
        await sendSMS({
            to: employer.phone,
            message: `Notice: Your ShiftMatch employer account for ${employer.storeName} has been suspended. Please check your email for details.`,
        });
    }
};

// Notify employer on unblock
const notifyEmployerUnblocked = async (employer) => {
    if (employer.email) {
        const template = employerUnblockedTemplate(employer.ownerName, employer.storeName);
        await sendEmail({
            to: employer.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }

    if (employer.phone) {
        await sendSMS({
            to: employer.phone,
            message: `Great News! Your ShiftMatch employer account for ${employer.storeName} has been restored. You can now log in.`,
        });
    }
};

// Notify applicant on deactivation
const notifyApplicantDeactivated = async (applicant) => {
    if (applicant.email) {
        const template = applicantDeactivatedTemplate(applicant.name);
        await sendEmail({
            to: applicant.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }

    if (applicant.phone) {
        await sendSMS({
            to: applicant.phone,
            message: `Notice: Your ShiftMatch applicant account has been deactivated. Please contact support.`,
        });
    }
};

// Notify employer on job deletion
const notifyEmployerJobDeleted = async (employer, job) => {
    if (employer.email) {
        const template = employerJobDeletedTemplate(employer.ownerName, job.title);
        await sendEmail({
            to: employer.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }

    if (employer.phone) {
        await sendSMS({
            to: employer.phone,
            message: `Notice: Your job posting "${job.title}" has been removed by an administrator. Check email for details.`,
        });
    }
};

module.exports = {
    notifyEmployerSignup,
    notifyEmployerApproval,
    notifyApplicantSignup,
    notifyApplicationStatus,
    notifyShiftAssignment,
    notifyForgotPassword,
    notifyAdminOfEmployerSignup,
    notifyEmployerOfNewApplication,
    notifyApplicantActivation,
    notifyEmployerBlocked,
    notifyEmployerUnblocked,
    notifyApplicantDeactivated,
    notifyEmployerJobDeleted,
};
