const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        shift: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shift',
            required: [true, 'Shift is required'],
            unique: true,
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
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: [true, 'Job is required'],
        },
        checkIn: {
            time: {
                type: Date,
            },
            location: {
                latitude: {
                    type: Number,
                },
                longitude: {
                    type: Number,
                },
            },
            method: {
                type: String,
                enum: ['app', 'manual'],
                default: 'app',
            },
        },
        checkOut: {
            time: {
                type: Date,
            },
            location: {
                latitude: {
                    type: Number,
                },
                longitude: {
                    type: Number,
                },
            },
            method: {
                type: String,
                enum: ['app', 'manual'],
                default: 'app',
            },
        },
        totalHours: {
            type: Number,
            min: [0, 'Total hours cannot be negative'],
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'half-day'],
            default: 'present',
        },
        isLate: {
            type: Boolean,
            default: false,
        },
        lateByMinutes: {
            type: Number,
            default: 0,
            min: [0, 'Late minutes cannot be negative'],
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer',
        },
        approvedAt: {
            type: Date,
        },
        applicantRemarks: {
            type: String,
        },
        employerRemarks: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for checkInTime
attendanceSchema.virtual('checkInTime').get(function () {
    return this.checkIn?.time;
});

// Virtual for checkOutTime
attendanceSchema.virtual('checkOutTime').get(function () {
    return this.checkOut?.time;
});

// Virtual for checkInLocation
attendanceSchema.virtual('checkInLocation').get(function () {
    return this.checkIn?.location;
});

// Virtual for checkOutLocation
attendanceSchema.virtual('checkOutLocation').get(function () {
    return this.checkOut?.location;
});

// Virtual for lateBy (minutes)
attendanceSchema.virtual('lateBy').get(function () {
    return this.lateByMinutes;
});

// Virtual for remarks (applicant's remarks)
attendanceSchema.virtual('remarks').get(function () {
    return this.applicantRemarks;
});

// Method to calculate total hours worked
attendanceSchema.methods.calculateTotalHours = function () {
    if (this.checkIn.time && this.checkOut.time) {
        const diffMs = this.checkOut.time - this.checkIn.time;
        const diffHours = diffMs / (1000 * 60 * 60);
        this.totalHours = Math.round(diffHours * 100) / 100; // Round to 2 decimal places
        return this.totalHours;
    }
    return 0;
};

// Method to check if check-in was late
attendanceSchema.methods.checkIfLate = function (expectedStartTime) {
    if (!this.checkIn.time || !expectedStartTime) {
        return false;
    }

    // Parse expected start time (format: "HH:MM")
    const [hours, minutes] = expectedStartTime.split(':').map(Number);
    const shiftDate = new Date(this.checkIn.time);
    const expectedTime = new Date(shiftDate);
    expectedTime.setHours(hours, minutes, 0, 0);

    if (this.checkIn.time > expectedTime) {
        this.isLate = true;
        const diffMs = this.checkIn.time - expectedTime;
        this.lateByMinutes = Math.floor(diffMs / (1000 * 60));

        // Set status to late if more than 15 minutes late
        if (this.lateByMinutes > 15) {
            this.status = 'late';
        }

        return true;
    }

    return false;
};

// Index for efficient queries
attendanceSchema.index({ applicant: 1, createdAt: -1 });
attendanceSchema.index({ employer: 1, createdAt: -1 });
attendanceSchema.index({ shift: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
