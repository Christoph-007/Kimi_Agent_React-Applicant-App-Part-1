/**
 * inAppNotificationService.js
 * NEW — handles creation of in-app Notification documents and optional email dispatch.
 * Does NOT modify or import from the existing notificationService.js.
 *
 * All functions are fire-and-forget safe (wrapped in try/catch) so that a
 * notification failure never breaks the primary request flow.
 */

const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');
const {
    jobRequestReceivedTemplate,
    jobRequestResponseTemplate,
    jobMatchAlertTemplate,
    newMatchingApplicantTemplate,
} = require('../utils/newEmailTemplates');

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPER — create a Notification document
// ─────────────────────────────────────────────────────────────────────────────
const createNotification = async ({
    recipientId,
    recipientModel,
    type,
    title,
    body,
    metadata = {},
    sendEmailTo = null,      // { address, subject, html, text }
}) => {
    try {
        const notification = await Notification.create({
            recipient: recipientId,
            recipientModel,
            type,
            title,
            body,
            metadata,
            emailSent: false,
        });

        // Optionally send an email for high-priority events
        if (sendEmailTo) {
            const result = await sendEmail({
                to: sendEmailTo.address,
                subject: sendEmailTo.subject,
                html: sendEmailTo.html,
                text: sendEmailTo.text,
            });
            if (result.success) {
                notification.emailSent = true;
                await notification.save();
            }
        }

        return notification;
    } catch (err) {
        // Log but never throw — notification failure must not break the caller
        console.error(`[InAppNotification] Failed to create notification (${type}):`, err.message);
        return null;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// APPLICANT NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Notify an applicant that an employer has sent them a Job Request.
 * @param {Object} jobRequest - populated JobRequest document
 * @param {Object} applicant  - Applicant document
 * @param {Object} employer   - Employer document
 */
const notifyApplicantJobRequestReceived = async (jobRequest, applicant, employer) => {
    const title = `New Job Request from ${employer.storeName}`;
    const body = `${employer.storeName} has sent you a job request for "${jobRequest.jobTitle}". Tap to review and respond.`;

    let emailPayload = null;
    if (applicant.email) {
        const tpl = jobRequestReceivedTemplate(
            applicant.name,
            employer.storeName,
            jobRequest.jobTitle,
            jobRequest.shiftType,
            jobRequest.location,
            jobRequest.offeredHourlyRate,
            jobRequest.message
        );
        emailPayload = {
            address: applicant.email,
            subject: tpl.subject,
            html: tpl.html,
            text: tpl.text,
        };
    }

    return createNotification({
        recipientId: applicant._id,
        recipientModel: 'Applicant',
        type: 'job_request_received',
        title,
        body,
        metadata: {
            jobRequestId: jobRequest._id,
            employerId: employer._id,
            employerName: employer.storeName,
            jobTitle: jobRequest.jobTitle,
        },
        sendEmailTo: emailPayload,
    });
};

/**
 * Notify an applicant that their job request status changed (accepted/declined/expired).
 * @param {Object} jobRequest - populated JobRequest document
 * @param {Object} applicant  - Applicant document
 */
const notifyApplicantJobRequestStatusChanged = async (jobRequest, applicant) => {
    const statusLabels = {
        accepted: 'accepted',
        declined: 'declined',
        expired: 'expired',
    };
    const label = statusLabels[jobRequest.status] || jobRequest.status;
    const title = `Job Request ${label.charAt(0).toUpperCase() + label.slice(1)}`;
    const body = `Your job request for "${jobRequest.jobTitle}" has been ${label}.`;

    return createNotification({
        recipientId: applicant._id,
        recipientModel: 'Applicant',
        type: 'job_request_status_changed',
        title,
        body,
        metadata: {
            jobRequestId: jobRequest._id,
            status: jobRequest.status,
            jobTitle: jobRequest.jobTitle,
        },
    });
};

/**
 * Notify matching applicants when a new job is posted.
 * Called automatically from the job creation flow.
 *
 * @param {Object} job      - newly created Job document (populated with employer)
 * @param {Array}  applicants - array of Applicant documents whose interests match
 */
const notifyApplicantsJobMatchAlert = async (job, applicants) => {
    const employerName = job.employer?.storeName || 'An employer';
    const results = [];

    for (const applicant of applicants) {
        const title = `New Job Match: ${job.title}`;
        const body = `A new ${job.jobType} job at ${employerName} in ${job.location.city} matches your interests. Tap to view.`;

        let emailPayload = null;
        if (applicant.email) {
            const tpl = jobMatchAlertTemplate(
                applicant.name,
                job.title,
                employerName,
                job.location.city,
                job.jobType,
                job._id
            );
            emailPayload = {
                address: applicant.email,
                subject: tpl.subject,
                html: tpl.html,
                text: tpl.text,
            };
        }

        const n = await createNotification({
            recipientId: applicant._id,
            recipientModel: 'Applicant',
            type: 'job_match_alert',
            title,
            body,
            metadata: {
                jobId: job._id,
                jobTitle: job.title,
                employerId: job.employer?._id,
                employerName,
                location: job.location.city,
                jobType: job.jobType,
            },
            sendEmailTo: emailPayload,
        });
        results.push(n);
    }

    return results;
};

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYER NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Notify an employer when an applicant responds to their Job Request.
 * @param {Object} jobRequest - populated JobRequest document
 * @param {Object} employer   - Employer document
 * @param {Object} applicant  - Applicant document
 */
const notifyEmployerJobRequestResponse = async (jobRequest, employer, applicant) => {
    const label = jobRequest.status === 'accepted' ? 'accepted' : 'declined';
    const title = `Job Request ${label.charAt(0).toUpperCase() + label.slice(1)}`;
    const body = `${applicant.name} has ${label} your job request for "${jobRequest.jobTitle}".`;

    let emailPayload = null;
    if (employer.email) {
        const tpl = jobRequestResponseTemplate(
            employer.ownerName,
            applicant.name,
            jobRequest.jobTitle,
            jobRequest.status
        );
        emailPayload = {
            address: employer.email,
            subject: tpl.subject,
            html: tpl.html,
            text: tpl.text,
        };
    }

    return createNotification({
        recipientId: employer._id,
        recipientModel: 'Employer',
        type: 'job_request_response',
        title,
        body,
        metadata: {
            jobRequestId: jobRequest._id,
            applicantId: applicant._id,
            applicantName: applicant.name,
            jobTitle: jobRequest.jobTitle,
            status: jobRequest.status,
        },
        sendEmailTo: emailPayload,
    });
};

/**
 * Notify employers whose saved filters match a newly registered applicant.
 * Called automatically from the applicant signup flow.
 *
 * @param {Object} applicant  - newly created Applicant document
 * @param {Array}  employers  - array of Employer documents whose savedFilters match
 */
const notifyEmployersNewMatchingApplicant = async (applicant, employers) => {
    const results = [];

    for (const employer of employers) {
        const title = `New Matching Applicant: ${applicant.name}`;
        const body = `A new applicant matching your saved filters has joined the platform. Tap to view their profile.`;

        let emailPayload = null;
        if (employer.email) {
            const tpl = newMatchingApplicantTemplate(
                employer.ownerName,
                applicant.name,
                applicant.jobCategories,
                applicant.preferredWorkLocation
            );
            emailPayload = {
                address: employer.email,
                subject: tpl.subject,
                html: tpl.html,
                text: tpl.text,
            };
        }

        const n = await createNotification({
            recipientId: employer._id,
            recipientModel: 'Employer',
            type: 'new_matching_applicant',
            title,
            body,
            metadata: {
                applicantId: applicant._id,
                applicantName: applicant.name,
                jobCategories: applicant.jobCategories,
                preferredWorkLocation: applicant.preferredWorkLocation,
            },
            sendEmailTo: emailPayload,
        });
        results.push(n);
    }

    return results;
};

module.exports = {
    notifyApplicantJobRequestReceived,
    notifyApplicantJobRequestStatusChanged,
    notifyApplicantsJobMatchAlert,
    notifyEmployerJobRequestResponse,
    notifyEmployersNewMatchingApplicant,
};
