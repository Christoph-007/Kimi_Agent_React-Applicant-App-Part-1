const mongoose = require('mongoose');

/**
 * Shortlist Model
 * NEW — Allows an employer to save/favourite applicants for later review.
 * Employers can also attach private internal notes per saved applicant.
 * Applicants have no visibility into this model.
 */
const shortlistSchema = new mongoose.Schema(
    {
        // The employer who created this shortlist entry
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer',
            required: [true, 'Employer is required'],
        },

        // The applicant being saved
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Applicant',
            required: [true, 'Applicant is required'],
        },

        // Private employer notes — never exposed to the applicant
        notes: {
            type: String,
            default: '',
        },

        // Optional label/tag the employer assigns (e.g. "Top Pick", "Follow Up")
        label: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Each employer can only shortlist a given applicant once
shortlistSchema.index({ employer: 1, applicant: 1 }, { unique: true });

// Fast lookup of all shortlisted applicants for an employer
shortlistSchema.index({ employer: 1, createdAt: -1 });

module.exports = mongoose.model('Shortlist', shortlistSchema);
