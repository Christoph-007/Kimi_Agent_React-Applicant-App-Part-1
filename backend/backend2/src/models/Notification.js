const mongoose = require('mongoose');

/**
 * Notification Model
 * Stores in-app notifications for applicants and employers.
 * NEW — does not modify any existing model.
 *
 * recipientModel: 'Applicant' | 'Employer'
 * type: identifies the notification trigger for frontend rendering
 */
const notificationSchema = new mongoose.Schema(
    {
        // Who receives this notification
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Recipient is required'],
            refPath: 'recipientModel',
        },
        recipientModel: {
            type: String,
            required: true,
            enum: ['Applicant', 'Employer'],
        },

        // Notification category
        type: {
            type: String,
            required: true,
            enum: [
                // Applicant-facing
                'job_request_received',       // employer sent applicant a job request
                'job_request_status_changed', // applicant's job request was accepted/declined/expired
                'job_match_alert',            // a new job matches applicant's area of interest
                'new_employer_match',         // a new employer joined whose jobs match applicant's interests

                // Employer-facing
                'job_request_response',       // applicant responded to employer's job request
                'new_matching_applicant',     // a new applicant signed up matching employer's saved filters
            ],
        },

        // Human-readable title and body
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },

        // Optional reference data for deep-linking on the frontend
        // e.g. { jobId, jobRequestId, applicantId, employerId }
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        // Read / dismissed state
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
        },
        isDismissed: {
            type: Boolean,
            default: false,
        },
        dismissedAt: {
            type: Date,
        },

        // Whether an email was also sent for this notification
        emailSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for fast per-user queries
notificationSchema.index({ recipient: 1, recipientModel: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, recipientModel: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
