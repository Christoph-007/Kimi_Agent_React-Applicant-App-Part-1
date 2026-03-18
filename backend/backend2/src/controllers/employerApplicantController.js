/**
 * employerApplicantController.js
 * NEW — Employer-facing endpoints for browsing, filtering, and viewing applicants.
 * Employers have READ-ONLY access to applicant data.
 * No existing controller is modified.
 */

const Applicant = require('../models/Applicant');
const Employer = require('../models/Employer');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Browse all available applicants with filtering and sorting
// @route   GET /api/employer/applicants
// @access  Private (Employer, Approved)
// ─────────────────────────────────────────────────────────────────────────────
const browseApplicants = async (req, res) => {
    try {
        const {
            jobCategory,       // single category filter
            preferredShiftType,
            preferredWorkLocation,
            minHourlyRate,
            maxHourlyRate,
            availableDay,      // single day filter
            search,            // search by name
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        // Base query: only active and available applicants
        const query = {
            isActive: true,
            isAvailable: true,
        };

        if (jobCategory) {
            query.jobCategories = jobCategory; // matches if array contains this value
        }

        if (preferredShiftType) {
            query.preferredShiftType = preferredShiftType;
        }

        if (preferredWorkLocation) {
            query.preferredWorkLocation = new RegExp(preferredWorkLocation, 'i');
        }

        if (minHourlyRate || maxHourlyRate) {
            query.expectedHourlyRate = {};
            if (minHourlyRate) query.expectedHourlyRate.$gte = parseFloat(minHourlyRate);
            if (maxHourlyRate) query.expectedHourlyRate.$lte = parseFloat(maxHourlyRate);
        }

        if (availableDay) {
            query['weeklyAvailability.days'] = availableDay;
        }

        if (search) {
            query.name = new RegExp(search, 'i');
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const sortOrder = order === 'asc' ? 1 : -1;

        // Employer sees a safe subset of applicant fields — no password, no internal counters
        const safeFields =
            'name jobCategories preferredShiftType preferredWorkLocation weeklyAvailability expectedHourlyRate skills experience availability isAvailable createdAt';

        const applicants = await Applicant.find(query)
            .select(safeFields)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limitNum);

        const totalItems = await Applicant.countDocuments(query);

        return paginatedResponse(res, 200, 'Applicants retrieved successfully', applicants, {
            currentPage: pageNum,
            totalPages: Math.ceil(totalItems / limitNum),
            totalItems,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalItems / limitNum),
            hasPrevPage: pageNum > 1,
        });
    } catch (error) {
        console.error('Browse applicants error:', error);
        return errorResponse(res, 500, 'Error retrieving applicants', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single applicant's full profile (read-only for employer)
// @route   GET /api/employer/applicants/:id
// @access  Private (Employer, Approved)
// ─────────────────────────────────────────────────────────────────────────────
const getApplicantProfile = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.params.id).select(
            '-password -totalApplications -acceptedApplications -completedShifts'
        );

        if (!applicant) {
            return errorResponse(res, 404, 'Applicant not found');
        }

        if (!applicant.isActive) {
            return errorResponse(res, 404, 'Applicant profile is not available');
        }

        return successResponse(res, 200, 'Applicant profile retrieved successfully', applicant);
    } catch (error) {
        console.error('Get applicant profile error:', error);
        return errorResponse(res, 500, 'Error retrieving applicant profile', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Save the employer's current filter preferences
// @route   PUT /api/employer/saved-filters
// @access  Private (Employer)
// ─────────────────────────────────────────────────────────────────────────────
const saveFilters = async (req, res) => {
    try {
        const {
            jobCategories,
            preferredShiftType,
            preferredWorkLocation,
            minHourlyRate,
            maxHourlyRate,
            availableDays,
        } = req.body;

        const updateData = { savedFilters: {} };

        if (jobCategories !== undefined) updateData.savedFilters.jobCategories = jobCategories;
        if (preferredShiftType !== undefined) updateData.savedFilters.preferredShiftType = preferredShiftType;
        if (preferredWorkLocation !== undefined) updateData.savedFilters.preferredWorkLocation = preferredWorkLocation;
        if (minHourlyRate !== undefined) updateData.savedFilters.minHourlyRate = minHourlyRate;
        if (maxHourlyRate !== undefined) updateData.savedFilters.maxHourlyRate = maxHourlyRate;
        if (availableDays !== undefined) updateData.savedFilters.availableDays = availableDays;

        const employer = await Employer.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        return successResponse(res, 200, 'Filters saved successfully', employer.savedFilters);
    } catch (error) {
        console.error('Save filters error:', error);
        return errorResponse(res, 500, 'Error saving filters', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get the employer's saved filter preferences
// @route   GET /api/employer/saved-filters
// @access  Private (Employer)
// ─────────────────────────────────────────────────────────────────────────────
const getSavedFilters = async (req, res) => {
    try {
        const employer = await Employer.findById(req.user._id).select('savedFilters');
        return successResponse(res, 200, 'Saved filters retrieved', employer.savedFilters || {});
    } catch (error) {
        console.error('Get saved filters error:', error);
        return errorResponse(res, 500, 'Error retrieving saved filters', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get Employer Dashboard Stats
// @route   GET /api/employer/dashboard-stats
// @access  Private (Employer)
// ─────────────────────────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
    try {
        const Job = require('../models/Job');
        const Application = require('../models/Application');
        const Shift = require('../models/Shift');
        const Shortlist = require('../models/Shortlist');

        const employerId = req.user._id;

        const [
            totalJobs,
            activeJobs,
            totalApplications,
            pendingApplications,
            upcomingShifts,
            totalShortlisted,
            totalEmployees
        ] = await Promise.all([
            Job.countDocuments({ employer: employerId }),
            Job.countDocuments({ employer: employerId, status: 'open' }),
            Application.countDocuments({ employer: employerId }),
            Application.countDocuments({ employer: employerId, status: 'applied' }),
            Shift.countDocuments({
                employer: employerId,
                date: { $gte: new Date().toISOString().split('T')[0] },
                status: 'confirmed'
            }),
            Shortlist.countDocuments({ employer: employerId }),
            Application.countDocuments({ employer: employerId, status: 'accepted' })
        ]);

        return successResponse(res, 200, 'Dashboard stats retrieved', {
            id: employerId,
            totalJobs,
            activeJobs,
            totalApplications,
            pendingApplications,
            upcomingShifts,
            totalShortlisted,
            totalEmployees
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return errorResponse(res, 500, 'Error retrieving dashboard stats', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get Employer Recent Activity
// @route   GET /api/employer/recent-activity
// @access  Private (Employer)
// ─────────────────────────────────────────────────────────────────────────────
const getRecentActivity = async (req, res) => {
    try {
        const Notification = require('../models/Notification');

        // Fetch last 10 notifications for this employer
        const notifications = await Notification.find({
            recipient: req.user._id,
            recipientModel: 'Employer'
        })
            .sort({ createdAt: -1 })
            .limit(10);

        const activities = notifications.map(notif => ({
            type: notif.type,
            title: notif.title,
            description: notif.message,
            timestamp: notif.createdAt
        }));

        return successResponse(res, 200, 'Recent activity retrieved', activities);
    } catch (error) {
        console.error('Get recent activity error:', error);
        return errorResponse(res, 500, 'Error retrieving recent activity', error.message);
    }
};

module.exports = {
    browseApplicants,
    getApplicantProfile,
    saveFilters,
    getSavedFilters,
    getDashboardStats,
    getRecentActivity,
};
