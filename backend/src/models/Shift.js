const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: [true, 'Job is required'],
        },
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer',
            required: [true, 'Employer is required'],
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Applicant',
            required: [true, 'Applicant is required'],
        },
        date: {
            type: Date,
            required: [true, 'Shift date is required'],
        },
        startTime: {
            type: String,
            required: [true, 'Start time is required'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format'],
        },
        endTime: {
            type: String,
            required: [true, 'End time is required'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format'],
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
        },
        instructions: {
            type: String,
        },
        status: {
            type: String,
            enum: [
                'scheduled',
                'confirmed',
                'in-progress',
                'completed',
                'cancelled',
                'no-show',
            ],
            default: 'scheduled',
        },
        confirmedByApplicant: {
            type: Boolean,
            default: false,
        },
        confirmedAt: {
            type: Date,
        },
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'cancelledByModel',
        },
        cancelledByModel: {
            type: String,
            enum: ['Employer', 'Applicant'],
        },
        cancellationReason: {
            type: String,
        },
        cancelledAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },
        paymentAmount: {
            type: Number,
            min: [0, 'Payment amount cannot be negative'],
        },
    },
    {
        timestamps: true,
    }
);

// Method to check if shift can be cancelled
shiftSchema.methods.canBeCancelled = function () {
    return ['scheduled', 'confirmed'].includes(this.status);
};

// Index for efficient queries
shiftSchema.index({ employer: 1, date: 1 });
shiftSchema.index({ applicant: 1, date: 1 });
shiftSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model('Shift', shiftSchema);
