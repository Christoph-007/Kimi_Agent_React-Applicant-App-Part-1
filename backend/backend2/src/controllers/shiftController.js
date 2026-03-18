const Shift = require('../models/Shift');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');
const { notifyShiftAssignment } = require('../services/notificationService');

// @desc    Create a new shift
// @route   POST /api/shifts
// @access  Private (Employer)
const createShift = async (req, res) => {
    try {
        const { jobId, applicantId, date, startTime, endTime, location, instructions, paymentAmount } = req.body;

        // Check if job exists and belongs to employer
        const job = await Job.findById(jobId);

        if (!job) {
            return errorResponse(res, 404, 'Job not found');
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to create shifts for this job');
        }

        // Check if accepted application exists
        const application = await Application.findOne({
            job: jobId,
            applicant: applicantId,
            status: 'accepted',
        }).populate('applicant', 'name phone email');

        if (!application) {
            return errorResponse(
                res,
                400,
                'No accepted application found for this applicant and job'
            );
        }

        // Create shift
        const shift = await Shift.create({
            job: jobId,
            employer: req.user._id,
            applicant: applicantId,
            date,
            startTime,
            endTime,
            location,
            instructions,
            paymentAmount,
        });

        const populatedShift = await Shift.findById(shift._id)
            .populate('job', 'title jobType')
            .populate('employer', 'storeName')
            .populate('applicant', 'name phone email');

        // Send notification
        await notifyShiftAssignment(populatedShift, application.applicant, job);

        return successResponse(res, 201, 'Shift created successfully', populatedShift);
    } catch (error) {
        console.error('Create shift error:', error);
        return errorResponse(res, 500, 'Error creating shift', error.message);
    }
};

// @desc    Get employer's shifts
// @route   GET /api/shifts/employer/my-shifts
// @access  Private (Employer)
const getEmployerShifts = async (req, res) => {
    try {
        const {
            status,
            date,
            page = 1,
            limit = 10,
            sortBy = 'date',
            order = 'asc',
        } = req.query;

        const query = { employer: req.user._id };

        if (status) {
            query.status = status;
        }

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const shifts = await Shift.find(query)
            .populate('job', 'title jobType')
            .populate('applicant', 'name phone email')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalShifts = await Shift.countDocuments(query);

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalShifts / limitNum),
            totalItems: totalShifts,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalShifts / limitNum),
            hasPrevPage: pageNum > 1,
        };

        return paginatedResponse(
            res,
            200,
            'Employer shifts retrieved successfully',
            shifts,
            pagination
        );
    } catch (error) {
        console.error('Get employer shifts error:', error);
        return errorResponse(res, 500, 'Error retrieving shifts', error.message);
    }
};

// @desc    Get applicant's shifts
// @route   GET /api/shifts/applicant/my-shifts
// @access  Private (Applicant)
const getApplicantShifts = async (req, res) => {
    try {
        const {
            status,
            date,
            page = 1,
            limit = 10,
            sortBy = 'date',
            order = 'asc',
        } = req.query;

        const query = { applicant: req.user._id };

        if (status) {
            query.status = status;
        }

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const shifts = await Shift.find(query)
            .populate('job', 'title jobType salary')
            .populate('employer', 'storeName phone address')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalShifts = await Shift.countDocuments(query);

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalShifts / limitNum),
            totalItems: totalShifts,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalShifts / limitNum),
            hasPrevPage: pageNum > 1,
        };

        return paginatedResponse(
            res,
            200,
            'Applicant shifts retrieved successfully',
            shifts,
            pagination
        );
    } catch (error) {
        console.error('Get applicant shifts error:', error);
        return errorResponse(res, 500, 'Error retrieving shifts', error.message);
    }
};

// @desc    Get shift by ID
// @route   GET /api/shifts/:id
// @access  Private (Employer/Applicant)
const getShiftById = async (req, res) => {
    try {
        const shift = await Shift.findById(req.params.id)
            .populate('job', 'title description jobType salary location')
            .populate('employer', 'storeName phone address')
            .populate('applicant', 'name phone email');

        if (!shift) {
            return errorResponse(res, 404, 'Shift not found');
        }

        // Check authorization
        const isEmployer =
            req.userType === 'employer' &&
            shift.employer._id.toString() === req.user._id.toString();
        const isApplicant =
            req.userType === 'applicant' &&
            shift.applicant._id.toString() === req.user._id.toString();

        if (!isEmployer && !isApplicant) {
            return errorResponse(res, 403, 'Not authorized to view this shift');
        }

        return successResponse(res, 200, 'Shift retrieved successfully', shift);
    } catch (error) {
        console.error('Get shift by ID error:', error);
        return errorResponse(res, 500, 'Error retrieving shift', error.message);
    }
};

// @desc    Update shift
// @route   PUT /api/shifts/:id
// @access  Private (Employer)
const updateShift = async (req, res) => {
    try {
        let shift = await Shift.findById(req.params.id);

        if (!shift) {
            return errorResponse(res, 404, 'Shift not found');
        }

        if (shift.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to update this shift');
        }

        // Don't allow updates to completed or cancelled shifts
        if (['completed', 'cancelled'].includes(shift.status)) {
            return errorResponse(
                res,
                400,
                `Cannot update ${shift.status} shifts`
            );
        }

        shift = await Shift.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('job', 'title jobType')
            .populate('applicant', 'name phone email');

        return successResponse(res, 200, 'Shift updated successfully', shift);
    } catch (error) {
        console.error('Update shift error:', error);
        return errorResponse(res, 500, 'Error updating shift', error.message);
    }
};

// @desc    Confirm shift
// @route   PUT /api/shifts/:id/confirm
// @access  Private (Applicant)
const confirmShift = async (req, res) => {
    try {
        const shift = await Shift.findById(req.params.id);

        if (!shift) {
            return errorResponse(res, 404, 'Shift not found');
        }

        if (shift.applicant.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to confirm this shift');
        }

        if (shift.confirmedByApplicant) {
            return errorResponse(res, 400, 'Shift is already confirmed');
        }

        shift.confirmedByApplicant = true;
        shift.confirmedAt = new Date();
        shift.status = 'confirmed';
        await shift.save();

        return successResponse(res, 200, 'Shift confirmed successfully', shift);
    } catch (error) {
        console.error('Confirm shift error:', error);
        return errorResponse(res, 500, 'Error confirming shift', error.message);
    }
};

// @desc    Cancel shift
// @route   PUT /api/shifts/:id/cancel
// @access  Private (Employer/Applicant)
const cancelShift = async (req, res) => {
    try {
        const { cancellationReason } = req.body;

        const shift = await Shift.findById(req.params.id);

        if (!shift) {
            return errorResponse(res, 404, 'Shift not found');
        }

        // Check authorization
        const isEmployer =
            req.userType === 'employer' &&
            shift.employer.toString() === req.user._id.toString();
        const isApplicant =
            req.userType === 'applicant' &&
            shift.applicant.toString() === req.user._id.toString();

        if (!isEmployer && !isApplicant) {
            return errorResponse(res, 403, 'Not authorized to cancel this shift');
        }

        if (!shift.canBeCancelled()) {
            return errorResponse(
                res,
                400,
                `Cannot cancel shift with status: ${shift.status}`
            );
        }

        shift.status = 'cancelled';
        shift.cancelledBy = req.user._id;
        shift.cancelledByModel = req.userType === 'employer' ? 'Employer' : 'Applicant';
        shift.cancellationReason = cancellationReason;
        shift.cancelledAt = new Date();
        await shift.save();

        return successResponse(res, 200, 'Shift cancelled successfully', shift);
    } catch (error) {
        console.error('Cancel shift error:', error);
        return errorResponse(res, 500, 'Error cancelling shift', error.message);
    }
};

// @desc    Delete shift
// @route   DELETE /api/shifts/:id
// @access  Private (Employer)
const deleteShift = async (req, res) => {
    try {
        const shift = await Shift.findById(req.params.id);

        if (!shift) {
            return errorResponse(res, 404, 'Shift not found');
        }

        if (shift.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to delete this shift');
        }

        // Only allow deletion of scheduled or cancelled shifts
        if (!['scheduled', 'cancelled'].includes(shift.status)) {
            return errorResponse(
                res,
                400,
                'Can only delete scheduled or cancelled shifts'
            );
        }

        await shift.deleteOne();

        return successResponse(res, 200, 'Shift deleted successfully');
    } catch (error) {
        console.error('Delete shift error:', error);
        return errorResponse(res, 500, 'Error deleting shift', error.message);
    }
};

module.exports = {
    createShift,
    getEmployerShifts,
    getApplicantShifts,
    getShiftById,
    updateShift,
    confirmShift,
    cancelShift,
    deleteShift,
};
