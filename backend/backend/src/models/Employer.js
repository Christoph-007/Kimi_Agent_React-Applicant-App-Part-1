const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employerSchema = new mongoose.Schema(
    {
        storeName: {
            type: String,
            required: [true, 'Store name is required'],
            trim: true,
        },
        ownerName: {
            type: String,
            required: [true, 'Owner name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        address: {
            street: {
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
        },
        businessType: {
            type: String,
            enum: [
                'restaurant',
                'retail',
                'logistics',
                'healthcare',
                'hospitality',
                'other',
            ],
            required: [true, 'Business type is required'],
        },
        businessDescription: {
            type: String,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },
        approvedAt: {
            type: Date,
        },
        totalJobsPosted: {
            type: Number,
            default: 0,
        },
        activeJobs: {
            type: Number,
            default: 0,
        },

        // ── NEW FIELDS (additive) ──────────────────────────────────────────────

        // Saved filter preferences for the employer's applicant browse view.
        // When a new applicant signs up, the system checks these filters and
        // sends a notification if the new applicant matches.
        savedFilters: {
            jobCategories: {
                type: [String],
                default: [],
            },
            preferredShiftType: {
                type: String,
                enum: ['full-time', 'part-time', 'weekends-only', 'flexible', ''],
                default: '',
            },
            preferredWorkLocation: {
                type: String,
                default: '',
            },
            minHourlyRate: {
                type: Number,
                default: 0,
            },
            maxHourlyRate: {
                type: Number,
                default: 0,
            },
            availableDays: {
                type: [String],
                default: [],
            },
        },

        // ── END NEW FIELDS ────────────────────────────────────────────────────
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
employerSchema.pre('save', async function (next) {
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
employerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Employer', employerSchema);
