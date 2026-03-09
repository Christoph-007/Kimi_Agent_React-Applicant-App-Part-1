
const Employer = require('../models/Employer');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Shift = require('../models/Shift');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');
const { notifyEmployerApproval } = require('../services/notificationService');

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
            query.isApproved = isApproved === 'true';
        }

        if (isBlocked !== undefined) {
            query.isBlocked = isBlocked === 'true';
        }

        if (businessType) {
            query.businessType = businessType;
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
        const employer = await Employer.findById(req.params.id);

        if (!employer) {
            return errorResponse(res, 404, 'Employer not found');
        }

        if (employer.isApproved) {
            return errorResponse(res, 400, 'Employer is already approved');
        }

        employer.isApproved = true;
        employer.approvedBy = req.user._id;
        employer.approvedAt = new Date();
        await employer.save();

        // Send approval notification
        await notifyEmployerApproval(employer);

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
            query.isActive = isActive === 'true';
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

        return successResponse(res, 200, 'Applicant deactivated successfully', applicant);
    } catch (error) {
        console.error('Deactivate applicant error:', error);
        return errorResponse(res, 500, 'Error deactivating applicant', error.message);
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

        return successResponse(res, 200, 'Job deleted successfully');
    } catch (error) {
        console.error('Delete job error:', error);
        return errorResponse(res, 500, 'Error deleting job', error.message);
    }
};

module.exports = {
    getDashboardStats,
    getAllEmployers,
    approveEmployer,
    blockEmployer,
    unblockEmployer,
    getAllApplicants,
    deactivateApplicant,
    deleteJob,
};
