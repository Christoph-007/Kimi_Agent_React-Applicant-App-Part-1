
const Employer = require('../models/Employer');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Shift = require('../models/Shift');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');
const {
    notifyEmployerApproval,
    notifyApplicantActivation,
    notifyEmployerBlocked,
    notifyEmployerUnblocked,
    notifyApplicantDeactivated,
    notifyEmployerJobDeleted,
} = require('../services/notificationService');

// @desc    Get analytics chart data (monthly trends)
// @route   GET /api/admin/analytics/charts
// @access  Private (Admin)
const getAnalyticsChartData = async (req, res) => {
    try {
        const monthsBack = 6;
        const months = [];
        const now = new Date();

        for (let i = monthsBack - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                label: d.toLocaleString('en-US', { month: 'short' }) + ' ' + d.getFullYear(),
                start: new Date(d.getFullYear(), d.getMonth(), 1),
                end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
            });
        }

        // Aggregate applicants per month
        const applicantAgg = await Applicant.aggregate([
            { $match: { createdAt: { $gte: months[0].start } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Aggregate employers per month
        const employerAgg = await Employer.aggregate([
            { $match: { createdAt: { $gte: months[0].start } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Aggregate jobs per month
        const jobAgg = await Job.aggregate([
            { $match: { createdAt: { $gte: months[0].start } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Aggregate applications per month
        const applicationAgg = await Application.aggregate([
            { $match: { createdAt: { $gte: months[0].start } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
        ]);

        const findCount = (agg, year, month) => {
            const found = agg.find(a => a._id.year === year && a._id.month === month);
            return found ? found.count : 0;
        };

        const userGrowth = months.map(m => ({
            month: m.label,
            applicants: findCount(applicantAgg, m.year, m.month),
            employers: findCount(employerAgg, m.year, m.month),
        }));

        const jobTrend = months.map(m => ({
            month: m.label,
            jobs: findCount(jobAgg, m.year, m.month),
            applications: findCount(applicationAgg, m.year, m.month),
        }));

        return successResponse(res, 200, 'Analytics chart data retrieved', { userGrowth, jobTrend });
    } catch (error) {
        console.error('Get analytics chart data error:', error);
        return errorResponse(res, 500, 'Error retrieving analytics data', error.message);
    }
};

// @desc    Get all jobs (admin)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAllJobs = async (req, res) => {
    try {
        const {
            search,
            status,
            jobType,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        const query = {};

        if (status) {
            query.status = status;
        }

        if (jobType) {
            query.jobType = jobType;
        }

        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
            ];
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const jobs = await Job.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .populate('employer', 'storeName businessType');

        const totalJobs = await Job.countDocuments(query);

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalJobs / limitNum),
            totalItems: totalJobs,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalJobs / limitNum),
            hasPrevPage: pageNum > 1,
        };

        return paginatedResponse(res, 200, 'Jobs retrieved successfully', jobs, pagination);
    } catch (error) {
        console.error('Get all jobs (admin) error:', error);
        return errorResponse(res, 500, 'Error retrieving jobs', error.message);
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        // Employer stats
        const totalEmployers = await Employer.countDocuments();
        const pendingEmployers = await Employer.countDocuments({ isApproved: false });
        const approvedEmployers = await Employer.countDocuments({ isApproved: true });
        const blockedEmployers = await Employer.countDocuments({ isBlocked: true });

        // Applicant stats
        const totalApplicants = await Applicant.countDocuments();
        const activeApplicants = await Applicant.countDocuments({ isActive: true });

        // Job stats
        const totalJobs = await Job.countDocuments();
        const openJobs = await Job.countDocuments({ status: 'open' });
        const closedJobs = await Job.countDocuments({ status: 'closed' });

        // Application stats
        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: 'applied' });
        const acceptedApplications = await Application.countDocuments({ status: 'accepted' });

        // Shift stats
        const totalShifts = await Shift.countDocuments();
        const upcomingShifts = await Shift.countDocuments({
            date: { $gte: new Date() },
            status: { $in: ['scheduled', 'confirmed'] },
        });

        // Recent jobs
        const recentJobs = await Job.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('employer', 'storeName');

        // Recent applications
        const recentApplications = await Application.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('job', 'title')
            .populate('applicant', 'name')
            .populate('employer', 'storeName');

        const stats = {
            employers: {
                total: totalEmployers,
                pending: pendingEmployers,
                approved: approvedEmployers,
                blocked: blockedEmployers,
            },
            applicants: {
                total: totalApplicants,
                active: activeApplicants,
            },
            jobs: {
                total: totalJobs,
                open: openJobs,
                closed: closedJobs,
            },
            applications: {
                total: totalApplications,
                pending: pendingApplications,
                accepted: acceptedApplications,
            },
            shifts: {
                total: totalShifts,
                upcoming: upcomingShifts,
            },
            recentJobs,
            recentApplications,
        };

        return successResponse(res, 200, 'Dashboard stats retrieved successfully', stats);
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return errorResponse(res, 500, 'Error retrieving dashboard stats', error.message);
    }
};

// @desc    Get all employers
// @route   GET /api/admin/employers
// @access  Private (Admin)
const getAllEmployers = async (req, res) => {
    try {
        const {
            isApproved,
            isBlocked,
            businessType,
            search,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        const query = {};

        if (isApproved !== undefined) {
            query.isApproved = isApproved === 'true' || isApproved === true;
        }

        if (isBlocked !== undefined) {
            query.isBlocked = isBlocked === 'true' || isBlocked === true;
        }

        if (businessType) {
            // Use case-insensitive search or exact match based on your preference
            // Given the frontend uses "Restaurant" but database might have "restaurant"
            query.businessType = new RegExp(`^${businessType}$`, 'i');
        }

        if (search) {
            query.$or = [
                { storeName: new RegExp(search, 'i') },
                { ownerName: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
            ];
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const employers = await Employer.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalEmployers = await Employer.countDocuments(query);

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalEmployers / limitNum),
            totalItems: totalEmployers,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalEmployers / limitNum),
            hasPrevPage: pageNum > 1,
        };

        return paginatedResponse(
            res,
            200,
            'Employers retrieved successfully',
            employers,
            pagination
        );
    } catch (error) {
        console.error('Get all employers error:', error);
        return errorResponse(res, 500, 'Error retrieving employers', error.message);
    }
};

// @desc    Approve employer
// @route   PUT /api/admin/employers/:id/approve
// @access  Private (Admin)
const approveEmployer = async (req, res) => {
    try {
        console.log(`[Admin] Attempting to approve employer ID: ${req.params.id}`);
        const employer = await Employer.findById(req.params.id);

        if (!employer) {
            console.warn(`[Admin] Employer not found: ${req.params.id}`);
            return errorResponse(res, 404, 'Employer not found');
        }

        if (employer.isApproved) {
            console.log(`[Admin] Employer ${req.params.id} is already approved`);
            return successResponse(res, 200, 'Employer is already approved', employer);
        }

        employer.isApproved = true;
        employer.approvedBy = req.user._id;
        employer.approvedAt = new Date();
        await employer.save();

        console.log(`[Admin] Employer ${employer.email} approved successfully. isApproved: ${employer.isApproved}`);

        // Send approval notification (non-fatal)
        try {
            await notifyEmployerApproval(employer);
        } catch (err) {
            console.error(`[Admin] Approval notification failed for ${employer.email}:`, err.message);
        }

        return successResponse(res, 200, 'Employer approved successfully', employer);
    } catch (error) {
        console.error('Approve employer error:', error);
        return errorResponse(res, 500, 'Error approving employer', error.message);
    }
};

// @desc    Block employer
// @route   PUT /api/admin/employers/:id/block
// @access  Private (Admin)
const blockEmployer = async (req, res) => {
    try {
        const employer = await Employer.findById(req.params.id);

        if (!employer) {
            return errorResponse(res, 404, 'Employer not found');
        }

        if (employer.isBlocked) {
            return errorResponse(res, 400, 'Employer is already blocked');
        }

        employer.isBlocked = true;
        await employer.save();

        // Notify employer of suspension
        try {
            await notifyEmployerBlocked(employer);
        } catch (err) {
            console.error('[Admin] Employer block notification failed:', err.message);
        }

        return successResponse(res, 200, 'Employer blocked successfully', employer);
    } catch (error) {
        console.error('Block employer error:', error);
        return errorResponse(res, 500, 'Error blocking employer', error.message);
    }
};

// @desc    Unblock employer
// @route   PUT /api/admin/employers/:id/unblock
// @access  Private (Admin)
const unblockEmployer = async (req, res) => {
    try {
        const employer = await Employer.findById(req.params.id);

        if (!employer) {
            return errorResponse(res, 404, 'Employer not found');
        }

        if (!employer.isBlocked) {
            return errorResponse(res, 400, 'Employer is not blocked');
        }

        employer.isBlocked = false;
        await employer.save();

        // Notify employer of restoration
        try {
            await notifyEmployerUnblocked(employer);
        } catch (err) {
            console.error('[Admin] Employer unblock notification failed:', err.message);
        }

        return successResponse(res, 200, 'Employer unblocked successfully', employer);
    } catch (error) {
        console.error('Unblock employer error:', error);
        return errorResponse(res, 500, 'Error unblocking employer', error.message);
    }
};

// @desc    Get all applicants
// @route   GET /api/admin/applicants
// @access  Private (Admin)
const getAllApplicants = async (req, res) => {
    try {
        const {
            isActive,
            search,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        const query = {};

        if (isActive !== undefined) {
            query.isActive = isActive === 'true' || isActive === true;
        }

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { phone: new RegExp(search, 'i') },
            ];
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const applicants = await Applicant.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalApplicants = await Applicant.countDocuments(query);

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalApplicants / limitNum),
            totalItems: totalApplicants,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalApplicants / limitNum),
            hasPrevPage: pageNum > 1,
        };

        return paginatedResponse(
            res,
            200,
            'Applicants retrieved successfully',
            applicants,
            pagination
        );
    } catch (error) {
        console.error('Get all applicants error:', error);
        return errorResponse(res, 500, 'Error retrieving applicants', error.message);
    }
};

// @desc    Deactivate applicant
// @route   PUT /api/admin/applicants/:id/deactivate
// @access  Private (Admin)
const deactivateApplicant = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.params.id);

        if (!applicant) {
            return errorResponse(res, 404, 'Applicant not found');
        }

        if (!applicant.isActive) {
            return errorResponse(res, 400, 'Applicant is already deactivated');
        }

        applicant.isActive = false;
        await applicant.save();

        // Notify applicant of deactivation
        try {
            await notifyApplicantDeactivated(applicant);
        } catch (err) {
            console.error('[Admin] Applicant deactivation notification failed:', err.message);
        }

        return successResponse(res, 200, 'Applicant deactivated successfully', applicant);
    } catch (error) {
        console.error('Deactivate applicant error:', error);
        return errorResponse(res, 500, 'Error deactivating applicant', error.message);
    }
};

// @desc    Activate applicant
// @route   PUT /api/admin/applicants/:id/activate
// @access  Private (Admin)
const activateApplicant = async (req, res) => {
    try {
        console.log(`[Admin] Activating applicant with ID: ${req.params.id}`);
        const applicant = await Applicant.findById(req.params.id);

        if (!applicant) {
            console.log(`[Admin] Applicant not found with ID: ${req.params.id}`);
            return errorResponse(res, 404, 'Applicant not found');
        }

        if (applicant.isActive) {
            console.log(`[Admin] Applicant ${req.params.id} is already active`);
            return errorResponse(res, 400, 'Applicant is already active');
        }

        applicant.isActive = true;
        await applicant.save();
        console.log(`[Admin] Applicant ${req.params.id} activated successfully. New state:`, applicant.isActive);

        // Notify applicant of account activation
        try {
            await notifyApplicantActivation(applicant);
        } catch (err) {
            console.error('[Admin] Applicant activation notification failed:', err.message);
        }

        return successResponse(res, 200, 'Applicant activated successfully', applicant);
    } catch (error) {
        console.error('Activate applicant error:', error);
        return errorResponse(res, 500, 'Error activating applicant', error.message);
    }
};

// @desc    Delete job (moderation)
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return errorResponse(res, 404, 'Job not found');
        }

        await job.deleteOne();

        // Update employer stats
        if (job.status === 'open') {
            await Employer.findByIdAndUpdate(job.employer, {
                $inc: { activeJobs: -1 },
            });
        }

        // Notify employer of job deletion
        try {
            const tempEmployer = await Employer.findById(job.employer);
            if (tempEmployer) {
                await notifyEmployerJobDeleted(tempEmployer, job);
            }
        } catch (err) {
            console.error('[Admin] Employer job deletion notification failed:', err.message);
        }

        return successResponse(res, 200, 'Job deleted successfully');
    } catch (error) {
        console.error('Delete job error:', error);
        return errorResponse(res, 500, 'Error deleting job', error.message);
    }
};

module.exports = {
    getAnalyticsChartData,
    getAllJobs,
    getDashboardStats,
    getAllEmployers,
    approveEmployer,
    blockEmployer,
    unblockEmployer,
    getAllApplicants,
    deactivateApplicant,
    activateApplicant,
    deleteJob,
};
