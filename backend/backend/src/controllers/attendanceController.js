const Attendance = require('../models/Attendance');
const Shift = require('../models/Shift');
const Applicant = require('../models/Applicant');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');

// @desc    Check in for a shift
// @route   POST /api/attendance/:shiftId/checkin
// @access  Private (Applicant)
const checkIn = async (req, res) => {
    try {
        const { shiftId } = req.params;
        const { latitude, longitude } = req.body;

        // Find shift
        const shift = await Shift.findById(shiftId).populate('job');

        if (!shift) {
            return errorResponse(res, 404, 'Shift not found');
        }

        // Verify shift belongs to applicant
        if (shift.applicant.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to check in for this shift');
        }

        // Check if shift date is today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const shiftDate = new Date(shift.date);
        shiftDate.setHours(0, 0, 0, 0);

        if (shiftDate.getTime() !== today.getTime()) {
            return errorResponse(res, 400, 'Can only check in on the shift date');
        }

        // Check if already checked in
        let attendance = await Attendance.findOne({ shift: shiftId });

        if (attendance && attendance.checkIn.time) {
            return errorResponse(res, 400, 'Already checked in for this shift');
        }

        // Create or update attendance
        if (!attendance) {
            attendance = await Attendance.create({
                shift: shiftId,
                applicant: req.user._id,
                employer: shift.employer,
                job: shift.job._id,
            });
        }

        // Set check-in details
        attendance.checkIn = {
            time: new Date(),
            location: {
                latitude: latitude || null,
                longitude: longitude || null,
            },
            method: 'app',
        };

        // Check if late
        attendance.checkIfLate(shift.startTime);

        await attendance.save();

        // Update shift status
        shift.status = 'in-progress';
        await shift.save();

        const populatedAttendance = await Attendance.findById(attendance._id)
            .populate('shift', 'date startTime endTime location')
            .populate('job', 'title')
            .populate('employer', 'storeName');

        return successResponse(res, 200, 'Checked in successfully', populatedAttendance);
    } catch (error) {
        console.error('Check in error:', error);
        return errorResponse(res, 500, 'Error checking in', error.message);
    }
};

// @desc    Check out from a shift
// @route   POST /api/attendance/:shiftId/checkout
// @access  Private (Applicant)
const checkOut = async (req, res) => {
    try {
        const { shiftId } = req.params;
        const { latitude, longitude, remarks } = req.body;

        // Find attendance
        const attendance = await Attendance.findOne({ shift: shiftId }).populate('shift');

        if (!attendance) {
            return errorResponse(res, 404, 'Attendance record not found. Please check in first.');
        }

        // Verify attendance belongs to applicant
        if (attendance.applicant.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to check out for this shift');
        }

        // Check if already checked out
        if (attendance.checkOut.time) {
            return errorResponse(res, 400, 'Already checked out from this shift');
        }

        // Check if checked in
        if (!attendance.checkIn.time) {
            return errorResponse(res, 400, 'Must check in before checking out');
        }

        // Set check-out details
        attendance.checkOut = {
            time: new Date(),
            location: {
                latitude: latitude || null,
                longitude: longitude || null,
            },
            method: 'app',
        };

        if (remarks) {
            attendance.applicantRemarks = remarks;
        }

        // Calculate total hours
        attendance.calculateTotalHours();

        await attendance.save();

        // Update shift status
        const shift = await Shift.findById(shiftId);
        shift.status = 'completed';
        shift.completedAt = new Date();
        await shift.save();

        // Increment applicant's completed shifts
        await Applicant.findByIdAndUpdate(req.user._id, {
            $inc: { completedShifts: 1 },
        });

        const populatedAttendance = await Attendance.findById(attendance._id)
            .populate('shift', 'date startTime endTime location')
            .populate('job', 'title')
            .populate('employer', 'storeName');

        return successResponse(res, 200, 'Checked out successfully', populatedAttendance);
    } catch (error) {
        console.error('Check out error:', error);
        return errorResponse(res, 500, 'Error checking out', error.message);
    }
};

// @desc    Get attendance for a specific shift
// @route   GET /api/attendance/shift/:shiftId
// @access  Private (Employer/Applicant)
const getShiftAttendance = async (req, res) => {
    try {
        const { shiftId } = req.params;

        const attendance = await Attendance.findOne({ shift: shiftId })
            .populate('shift', 'date startTime endTime location status')
            .populate('job', 'title jobType')
            .populate('employer', 'storeName')
            .populate('applicant', 'name phone email');

        if (!attendance) {
            return errorResponse(res, 404, 'Attendance record not found');
        }

        // Check authorization
        const isEmployer =
            req.userType === 'employer' &&
            attendance.employer._id.toString() === req.user._id.toString();
        const isApplicant =
            req.userType === 'applicant' &&
            attendance.applicant._id.toString() === req.user._id.toString();

        if (!isEmployer && !isApplicant) {
            return errorResponse(res, 403, 'Not authorized to view this attendance record');
        }

        return successResponse(res, 200, 'Attendance retrieved successfully', attendance);
    } catch (error) {
        console.error('Get shift attendance error:', error);
        return errorResponse(res, 500, 'Error retrieving attendance', error.message);
    }
};

// @desc    Get employer's attendance records
// @route   GET /api/attendance/employer/records
// @access  Private (Employer)
const getEmployerAttendanceRecords = async (req, res) => {
    try {
        const {
            status,
            isApproved,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        const query = { employer: req.user._id };

        if (status) {
            query.status = status;
        }

        if (isApproved !== undefined) {
            query.isApproved = isApproved === 'true';
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const records = await Attendance.find(query)
            .populate('shift', 'date startTime endTime')
            .populate('job', 'title')
            .populate('applicant', 'name phone')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalRecords = await Attendance.countDocuments(query);

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalRecords / limitNum),
            totalItems: totalRecords,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalRecords / limitNum),
            hasPrevPage: pageNum > 1,
        };

        return paginatedResponse(
            res,
            200,
            'Attendance records retrieved successfully',
            records,
            pagination
        );
    } catch (error) {
        console.error('Get employer attendance records error:', error);
        return errorResponse(res, 500, 'Error retrieving attendance records', error.message);
    }
};

// @desc    Get applicant's attendance history
// @route   GET /api/attendance/applicant/history
// @access  Private (Applicant)
const getApplicantAttendanceHistory = async (req, res) => {
    try {
        const {
            status,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        const query = { applicant: req.user._id };

        if (status) {
            query.status = status;
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const records = await Attendance.find(query)
            .populate('shift', 'date startTime endTime location')
            .populate('job', 'title jobType')
            .populate('employer', 'storeName')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalRecords = await Attendance.countDocuments(query);

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalRecords / limitNum),
            totalItems: totalRecords,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalRecords / limitNum),
            hasPrevPage: pageNum > 1,
        };

        return paginatedResponse(
            res,
            200,
            'Attendance history retrieved successfully',
            records,
            pagination
        );
    } catch (error) {
        console.error('Get applicant attendance history error:', error);
        return errorResponse(res, 500, 'Error retrieving attendance history', error.message);
    }
};

// @desc    Approve attendance
// @route   PUT /api/attendance/:id/approve
// @access  Private (Employer)
const approveAttendance = async (req, res) => {
    try {
        const { employerRemarks } = req.body;

        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) {
            return errorResponse(res, 404, 'Attendance record not found');
        }

        if (attendance.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to approve this attendance');
        }

        if (attendance.isApproved) {
            return errorResponse(res, 400, 'Attendance is already approved');
        }

        attendance.isApproved = true;
        attendance.approvedBy = req.user._id;
        attendance.approvedAt = new Date();
        if (employerRemarks) {
            attendance.employerRemarks = employerRemarks;
        }

        await attendance.save();

        return successResponse(res, 200, 'Attendance approved successfully', attendance);
    } catch (error) {
        console.error('Approve attendance error:', error);
        return errorResponse(res, 500, 'Error approving attendance', error.message);
    }
};

// @desc    Mark manual attendance
// @route   POST /api/attendance/manual
// @access  Private (Employer)
const markManualAttendance = async (req, res) => {
    try {
        const {
            shiftId,
            checkInTime,
            checkOutTime,
            status,
            employerRemarks,
        } = req.body;

        // Find shift
        const shift = await Shift.findById(shiftId);

        if (!shift) {
            return errorResponse(res, 404, 'Shift not found');
        }

        // Verify shift belongs to employer
        if (shift.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to mark attendance for this shift');
        }

        // Check if attendance already exists
        let attendance = await Attendance.findOne({ shift: shiftId });

        if (attendance) {
            return errorResponse(res, 400, 'Attendance already exists for this shift');
        }

        // Create attendance
        attendance = await Attendance.create({
            shift: shiftId,
            applicant: shift.applicant,
            employer: req.user._id,
            job: shift.job,
            checkIn: {
                time: checkInTime ? new Date(checkInTime) : null,
                method: 'manual',
            },
            checkOut: {
                time: checkOutTime ? new Date(checkOutTime) : null,
                method: 'manual',
            },
            status: status || 'present',
            employerRemarks,
            isApproved: true,
            approvedBy: req.user._id,
            approvedAt: new Date(),
        });

        // Calculate total hours if both times provided
        if (checkInTime && checkOutTime) {
            attendance.calculateTotalHours();
            await attendance.save();
        }

        // Update shift status
        if (checkOutTime) {
            shift.status = 'completed';
            shift.completedAt = new Date();
            await shift.save();

            // Increment applicant's completed shifts
            await Applicant.findByIdAndUpdate(shift.applicant, {
                $inc: { completedShifts: 1 },
            });
        }

        const populatedAttendance = await Attendance.findById(attendance._id)
            .populate('shift', 'date startTime endTime')
            .populate('job', 'title')
            .populate('applicant', 'name phone');

        return successResponse(
            res,
            201,
            'Manual attendance marked successfully',
            populatedAttendance
        );
    } catch (error) {
        console.error('Mark manual attendance error:', error);
        return errorResponse(res, 500, 'Error marking manual attendance', error.message);
    }
};

module.exports = {
    checkIn,
    checkOut,
    getShiftAttendance,
    getEmployerAttendanceRecords,
    getApplicantAttendanceHistory,
    approveAttendance,
    markManualAttendance,
};
