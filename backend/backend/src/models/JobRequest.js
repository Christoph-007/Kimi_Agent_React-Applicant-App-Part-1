const mongoose = require('mongoose');

/**
 * JobRequest Model
 * NEW — Employer-initiated job offer sent directly to an applicant.
 * Completely separate from the existing Application model (applicant-initiated).
 *
 * Flow:
 *   Employer sends request → status: 'sent'
 *   Applicant accepts      → status: 'accepted'
 *   Applicant declines     → status: 'declined'
 *   Cron/TTL expires it    → status: 'expired'
 */
const jobRequestSchema = new mongoose.Schema(
    {
        // The employer who sent the request
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer',
            required: [true, 'Employer is required'],
        },

        // The applicant who receives the request
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Applicant',
            required: [true, 'Applicant is required'],
        },

        // Job details included in the request
        jobTitle: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        jobDescription: {
            type: String,
            required: [true, 'Job description is required'],
        },
        shiftType: {
            type: String,
            enum: ['full-time', 'part-time', 'weekends-only', 'flexible'],
            required: [true, 'Shift type is required'],
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
        },
        offeredHourlyRate: {
            type: Number,
            min: [0, 'Hourly rate cannot be negative'],
            required: [true, 'Offered hourly rate is required'],
        },

        // Optional personal message from the employer
        message: {
            type: String,
        },

        // Lifecycle status
        status: {
            type: String,
            enum: ['sent', 'accepted', 'declined', 'expired'],
            default: 'sent',
        },

        // When the applicant responded
        respondedAt: {
            type: Date,
        },

        // Optional reason if declined
        declineReason: {
            type: String,
        },

        // Auto-expire after N days (set by server on creation)
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate active requests from same employer to same applicant
jobRequestSchema.index(
    { employer: 1, applicant: 1, status: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'sent' }, // only enforce uniqueness on active requests
    }
);

// Indexes for dashboard queries
jobRequestSchema.index({ employer: 1, createdAt: -1 });
jobRequestSchema.index({ applicant: 1, status: 1 });
jobRequestSchema.index({ expiresAt: 1 }); // for expiry cron job

module.exports = mongoose.model('JobRequest', jobRequestSchema);
