const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer',
            required: [true, 'Employer is required'],
        },
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Job description is required'],
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'shift', 'contract'],
            required: [true, 'Job type is required'],
        },
        salary: {
            amount: {
                type: Number,
                required: [true, 'Salary amount is required'],
                min: [0, 'Salary cannot be negative'],
            },
            period: {
                type: String,
                enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
                required: [true, 'Salary period is required'],
            },
        },
        workingHours: {
            hoursPerDay: {
                type: Number,
                min: [0, 'Hours per day cannot be negative'],
            },
            daysPerWeek: {
                type: Number,
                min: [0, 'Days per week cannot be negative'],
                max: [7, 'Days per week cannot exceed 7'],
            },
            shiftTiming: {
                type: String,
            },
        },
        location: {
            address: {
                type: String,
            },
            city: {
                type: String,
                required: [true, 'City is required'],
            },
            state: {
                type: String,
                required: [true, 'State is required'],
            },
            pincode: {
                type: String,
                required: [true, 'Pincode is required'],
                match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode'],
            },
            coordinates: {
                latitude: {
                    type: Number,
                },
                longitude: {
                    type: Number,
                },
            },
        },
        requirements: {
            minimumExperience: {
                type: Number,
                default: 0,
                min: [0, 'Minimum experience cannot be negative'],
            },
            skills: {
                type: [String],
                default: [],
            },
            education: {
                type: String,
            },
            otherRequirements: {
                type: String,
            },
        },
        benefits: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['open', 'closed', 'filled'],
            default: 'open',
        },
        totalApplications: {
            type: Number,
            default: 0,
        },
        acceptedApplicants: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        expiryDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Method to check if job is accepting applications
jobSchema.methods.isAcceptingApplications = function () {
    if (this.status !== 'open') {
        return false;
    }

    if (this.expiryDate && new Date() > this.expiryDate) {
        return false;
    }

    return true;
};

// Index for search optimization
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ 'location.city': 1, 'location.state': 1 });
jobSchema.index({ jobType: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);
