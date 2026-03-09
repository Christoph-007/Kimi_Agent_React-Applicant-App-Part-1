const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: [true, 'Job is required'],
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Applicant',
            required: [true, 'Applicant is required'],
        },
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer',
            required: [true, 'Employer is required'],
        },
        coverLetter: {
            type: String,
        },
        expectedSalary: {
            type: Number,
            min: [0, 'Expected salary cannot be negative'],
        },
        status: {
            type: String,
            enum: ['applied', 'reviewing', 'accepted', 'rejected', 'withdrawn'],
            default: 'applied',
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    required: true,
                },
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    refPath: 'statusHistory.updatedByModel',
                },
                updatedByModel: {
                    type: String,
                    enum: ['Employer', 'Applicant', 'Admin'],
                },
                note: {
                    type: String,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        rejectionReason: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound unique index to prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Method to update status with history tracking
applicationSchema.methods.updateStatus = function (
    newStatus,
    updatedBy,
    model,
    note = ''
) {
    this.status = newStatus;
    this.statusHistory.push({
        status: newStatus,
        updatedBy: updatedBy,
        updatedByModel: model,
        note: note,
        timestamp: new Date(),
    });
};

module.exports = mongoose.model('Application', applicationSchema);
