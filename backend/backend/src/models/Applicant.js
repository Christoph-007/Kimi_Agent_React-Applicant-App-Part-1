const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const applicantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        skills: {
            type: [String],
            default: [],
        },
        experience: {
            type: Number,
            default: 0,
            min: [0, 'Experience cannot be negative'],
        },
        preferredJobType: {
            type: String,
            enum: ['full-time', 'part-time', 'shift', 'contract'],
        },

        // ── NEW FIELDS (additive) ──────────────────────────────────────────────

        // Areas / job categories the applicant is interested in
        jobCategories: {
            type: [String],
            default: [],
        },

        // Preferred shift type (more granular than preferredJobType)
        preferredShiftType: {
            type: String,
        },

        // Preferred work location / area (free-text city or area name)
        preferredWorkLocation: {
            type: String,
            trim: true,
        },

        // Weekly availability — days + hours per week
        weeklyAvailability: {
            days: {
                type: [String],
                enum: [
                    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
                    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
                ],
                default: [],
            },
            hoursPerWeek: {
                type: Number,
                min: [0, 'Hours per week cannot be negative'],
                max: [168, 'Hours per week cannot exceed 168'],
            },
        },

        // Expected hourly rate in the platform's base currency (optional)
        expectedHourlyRate: {
            type: Number,
            min: [0, 'Expected hourly rate cannot be negative'],
        },

        // Controls visibility in the employer's applicant browse list
        // Applicant can toggle this themselves; admin can also set it
        isAvailable: {
            type: Boolean,
            default: true,
        },

        // ── END NEW FIELDS ────────────────────────────────────────────────────
        availability: {
            days: {
                type: [String],
                enum: [
                    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
                    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
                ],
                default: [],
            },
            timeSlots: {
                type: [String],
                enum: ['morning', 'afternoon', 'evening', 'night'],
                default: [],
            },
        },
        location: {
            city: { type: String, trim: true },
            state: { type: String, trim: true },
        },
        resume: {
            url: {
                type: String,
            },
            publicId: {
                type: String,
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        totalApplications: {
            type: Number,
            default: 0,
        },
        acceptedApplications: {
            type: Number,
            default: 0,
        },
        completedShifts: {
            type: Number,
            default: 0,
        },
        savedJobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for availabilityDays (mapping from weeklyAvailability.days)
applicantSchema.virtual('availabilityDays').get(function () {
    return this.weeklyAvailability?.days || [];
});

// Hash password before saving
applicantSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(
        parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    );
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
applicantSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes for employer-side applicant search/filter
applicantSchema.index({ jobCategories: 1, isAvailable: 1 });
applicantSchema.index({ preferredShiftType: 1, isAvailable: 1 });
applicantSchema.index({ preferredWorkLocation: 1, isAvailable: 1 });
applicantSchema.index({ isAvailable: 1, isActive: 1 });

module.exports = mongoose.model('Applicant', applicantSchema);
