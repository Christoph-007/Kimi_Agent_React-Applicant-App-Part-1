const Application = require('../models/Application');
const Job = require('../models/Job');
const Applicant = require('../models/Applicant');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');
const { notifyApplicationStatus } = require('../services/notificationService');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Applicant)
const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { coverLetter, expectedSalary } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId).populate('employer');

        if (!job) {
            return errorResponse(res, 404, 'Job not found');
        }

        // Check if job is accepting applications
        if (!job.isAcceptingApplications()) {
            return errorResponse(res, 400, 'This job is not accepting applications');
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user._id,
        });

        if (existingApplication) {
            return errorResponse(res, 400, 'You have already applied for this job');
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
            employer: job.employer._id,
            coverLetter,
            expectedSalary,
        });

        // Add initial status to history
        application.updateStatus('applied', req.user._id, 'Applicant', 'Application submitted');
        await application.save();

        // Update job stats
        await Job.findByIdAndUpdate(jobId, {
            $inc: { totalApplications: 1 },
        });

        // Update applicant stats
        await Applicant.findByIdAndUpdate(req.user._id, {
            $inc: { totalApplications: 1 },
        });

        const populatedApplication = await Application.findById(application._id)
            .populate('job', 'title jobType salary location')
            .populate('employer', 'storeName')
            .populate('applicant', 'name phone email');

        return successResponse(
            res,
            201,
            'Application submitted successfully',
            populatedApplication
        );
    } catch (error) {
        console.error('Apply for job error:', error);
        return errorResponse(res, 500, 'Error submitting application', error.message);
    }
};

// @desc    Get applicant's applications
// @route   GET /api/applications/my-applications
// @access  Private (Applicant)
const getMyApplications = async (req, res) => {
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

        const applications = await Application.find(query)
            .populate('job', 'title jobType salary location status')
            .populate('employer', 'storeName businessType')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalApplications = await Application.countDocuments(query);

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalApplications / limitNum),
            totalItems: totalApplications,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalApplications / limitNum),
            hasPrevPage: pageNum > 1,
        };

        return paginatedResponse(
            res,
            200,
            'Applications retrieved successfully',
            applications,
            pagination
        );
    } catch (error) {
        console.error('Get my applications error:', error);
        return errorResponse(res, 500, 'Error retrieving applications', error.message);
    }
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const {
            status,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        // Check if job exists and belongs to employer
        const job = await Job.findById(jobId);

        if (!job) {
            return errorResponse(res, 404, 'Job not found');
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to view these applications');
        }

        const query = { job: jobId };

        if (status) {
            query.status = status;
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const applications = await Application.find(query)
            .populate('applicant', 'name phone email skills experience')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalApplications = await Application.countDocuments(query);

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalApplications / limitNum),
            totalItems: totalApplications,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalApplications / limitNum),
            hasPrevPage: pageNum > 1,
        };

        return paginatedResponse(
            res,
            200,
            'Job applications retrieved successfully',
            applications,
            pagination
        );
    } catch (error) {
        console.error('Get job applications error:', error);
        return errorResponse(res, 500, 'Error retrieving applications', error.message);
    }
};

// @desc    Get application details
// @route   GET /api/applications/:id
// @access  Private (Employer/Applicant)
const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('job', 'title description jobType salary location requirements benefits')
            .populate('employer', 'storeName ownerName businessType address')
            .populate('applicant', 'name phone email skills experience resume');

        if (!application) {
            return errorResponse(res, 404, 'Application not found');
        }

        // Check authorization
        const isEmployer =
            req.userType === 'employer' &&
            application.employer._id.toString() === req.user._id.toString();
        const isApplicant =
            req.userType === 'applicant' &&
            application.applicant._id.toString() === req.user._id.toString();

        if (!isEmployer && !isApplicant) {
            return errorResponse(res, 403, 'Not authorized to view this application');
        }

        return successResponse(
            res,
            200,
            'Application retrieved successfully',
            application
        );
    } catch (error) {
        console.error('Get application by ID error:', error);
        return errorResponse(res, 500, 'Error retrieving application', error.message);
    }
};

// @desc    Accept application
// @route   PUT /api/applications/:id/accept
// @access  Private (Employer)
const acceptApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('job', 'title')
            .populate('applicant', 'name phone email')
            .populate('employer', 'storeName');

        if (!application) {
            return errorResponse(res, 404, 'Application not found');
        }

        // Check if application belongs to employer
        if (application.employer._id.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to accept this application');
        }

        // Check if already accepted
        if (application.status === 'accepted') {
            return errorResponse(res, 400, 'Application is already accepted');
        }

        // Update status
        application.updateStatus('accepted', req.user._id, 'Employer', req.body.note || 'Application accepted');
        await application.save();

        // Update job stats
        await Job.findByIdAndUpdate(application.job._id, {
            $inc: { acceptedApplicants: 1 },
        });

        // Update applicant stats
        await Applicant.findByIdAndUpdate(application.applicant._id, {
            $inc: { acceptedApplications: 1 },
        });

        // Send notification
        await notifyApplicationStatus(
            application,
            application.applicant,
            application.job,
            application.employer
        );

        return successResponse(res, 200, 'Application accepted successfully', application);
    } catch (error) {
        console.error('Accept application error:', error);
        return errorResponse(res, 500, 'Error accepting application', error.message);
    }
};

// @desc    Reject application
// @route   PUT /api/applications/:id/reject
// @access  Private (Employer)
const rejectApplication = async (req, res) => {
    try {
        const { rejectionReason } = req.body;

        const application = await Application.findById(req.params.id)
            .populate('job', 'title')
            .populate('applicant', 'name phone email')
            .populate('employer', 'storeName');

        if (!application) {
            return errorResponse(res, 404, 'Application not found');
        }

        if (application.employer._id.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to reject this application');
        }

        if (application.status === 'rejected') {
            return errorResponse(res, 400, 'Application is already rejected');
        }

        // Update status
        application.updateStatus('rejected', req.user._id, 'Employer', rejectionReason || 'Application rejected');
        application.rejectionReason = rejectionReason;
        await application.save();

        // Send notification
        await notifyApplicationStatus(
            application,
            application.applicant,
            application.job,
            application.employer
        );

        return successResponse(res, 200, 'Application rejected', application);
    } catch (error) {
        console.error('Reject application error:', error);
        return errorResponse(res, 500, 'Error rejecting application', error.message);
    }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (Applicant)
const withdrawApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return errorResponse(res, 404, 'Application not found');
        }

        if (application.applicant.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to withdraw this application');
        }

        if (application.status === 'withdrawn') {
            return errorResponse(res, 400, 'Application is already withdrawn');
        }

        // Update status
        application.updateStatus('withdrawn', req.user._id, 'Applicant', 'Application withdrawn by applicant');
        await application.save();

        return successResponse(res, 200, 'Application withdrawn successfully', application);
    } catch (error) {
        console.error('Withdraw application error:', error);
        return errorResponse(res, 500, 'Error withdrawing application', error.message);
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplications,
    getApplicationById,
    acceptApplication,
    rejectApplication,
    withdrawApplication,
};
