/**
 * jobRequestController.js
 * NEW — Employer sends job requests directly to applicants.
 * Applicants can accept or decline. Status lifecycle: sent → accepted/declined/expired.
 * Does NOT touch the existing Application model or applicationController.
 */

const JobRequest = require('../models/JobRequest');
const Applicant = require('../models/Applicant');
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');
const {
    notifyApplicantJobRequestReceived,
    notifyApplicantJobRequestStatusChanged,
    notifyEmployerJobRequestResponse,
} = require('../services/inAppNotificationService');

// Default expiry window in days
const JOB_REQUEST_EXPIRY_DAYS = parseInt(process.env.JOB_REQUEST_EXPIRY_DAYS) || 7;

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Employer sends a job request to an applicant
// @route   POST /api/job-requests
// @access  Private (Employer, Approved)
// ─────────────────────────────────────────────────────────────────────────────
const sendJobRequest = async (req, res) => {
    try {
        const {
            applicantId,
            jobTitle,
            jobDescription,
            shiftType,
            location,
            offeredHourlyRate,
            message,
            jobId,
        } = req.body;

        // Validate required fields
        if (!applicantId || !jobTitle || !jobDescription || !shiftType || !location || offeredHourlyRate === undefined) {
            return errorResponse(res, 400, 'applicantId, jobTitle, jobDescription, shiftType, location, and offeredHourlyRate are required');
        }

        // Ensure applicant exists and is active/available
        const applicant = await Applicant.findById(applicantId);
        if (!applicant) {
            return errorResponse(res, 404, 'Applicant not found');
        }
        if (!applicant.isActive) {
            return errorResponse(res, 400, 'Applicant account is not active');
        }

        // Check for an existing pending request from this employer to this applicant
        const existingRequest = await JobRequest.findOne({
            employer: req.user._id,
            applicant: applicantId,
            status: 'sent',
        });
        if (existingRequest) {
            return errorResponse(res, 409, 'You already have a pending job request to this applicant');
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + JOB_REQUEST_EXPIRY_DAYS);

        const jobRequest = await JobRequest.create({
            employer: req.user._id,
            applicant: applicantId,
            job: jobId || undefined,
            jobTitle,
            jobDescription,
            shiftType,
            location,
            offeredHourlyRate,
            message,
            expiresAt,
        });

        // Fire-and-forget notification
        notifyApplicantJobRequestReceived(jobRequest, applicant, req.user).catch(console.error);

        return successResponse(res, 201, 'Job request sent successfully', jobRequest);
    } catch (error) {
        console.error('Send job request error:', error);
        return errorResponse(res, 500, 'Error sending job request', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all job requests sent by the logged-in employer
// @route   GET /api/job-requests/employer/sent
// @access  Private (Employer)
// ─────────────────────────────────────────────────────────────────────────────
const getEmployerSentRequests = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { employer: req.user._id };
        if (status) query.status = status;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const requests = await JobRequest.find(query)
            .populate('applicant', 'name phone email jobCategories preferredShiftType preferredWorkLocation expectedHourlyRate')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalItems = await JobRequest.countDocuments(query);

        return paginatedResponse(res, 200, 'Job requests retrieved successfully', requests, {
            currentPage: pageNum,
            totalPages: Math.ceil(totalItems / limitNum),
            totalItems,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalItems / limitNum),
            hasPrevPage: pageNum > 1,
        });
    } catch (error) {
        console.error('Get employer sent requests error:', error);
        return errorResponse(res, 500, 'Error retrieving job requests', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all job requests received by the logged-in applicant
// @route   GET /api/job-requests/applicant/received
// @access  Private (Applicant)
// ─────────────────────────────────────────────────────────────────────────────
const getApplicantReceivedRequests = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { applicant: req.user._id };
        if (status) query.status = status;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const requests = await JobRequest.find(query)
            .populate('employer', 'storeName ownerName email phone businessType address')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalItems = await JobRequest.countDocuments(query);

        return paginatedResponse(res, 200, 'Job requests retrieved successfully', requests, {
            currentPage: pageNum,
            totalPages: Math.ceil(totalItems / limitNum),
            totalItems,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalItems / limitNum),
            hasPrevPage: pageNum > 1,
        });
    } catch (error) {
        console.error('Get applicant received requests error:', error);
        return errorResponse(res, 500, 'Error retrieving job requests', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single job request by ID
// @route   GET /api/job-requests/:id
// @access  Private (Employer who sent it OR Applicant who received it)
// ─────────────────────────────────────────────────────────────────────────────
const getJobRequestById = async (req, res) => {
    try {
        const jobRequest = await JobRequest.findById(req.params.id)
            .populate('employer', 'storeName ownerName email phone businessType address')
            .populate('applicant', 'name phone email jobCategories preferredShiftType preferredWorkLocation expectedHourlyRate');

        if (!jobRequest) {
            return errorResponse(res, 404, 'Job request not found');
        }

        // Access control: only the employer who sent it or the applicant who received it
        const isEmployer =
            req.userType === 'employer' &&
            jobRequest.employer._id.toString() === req.user._id.toString();
        const isApplicant =
            req.userType === 'applicant' &&
            jobRequest.applicant._id.toString() === req.user._id.toString();

        if (!isEmployer && !isApplicant) {
            return errorResponse(res, 403, 'Not authorized to view this job request');
        }

        return successResponse(res, 200, 'Job request retrieved successfully', jobRequest);
    } catch (error) {
        console.error('Get job request by ID error:', error);
        return errorResponse(res, 500, 'Error retrieving job request', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Applicant accepts a job request
// @route   PUT /api/job-requests/:id/accept
// @access  Private (Applicant)
// ─────────────────────────────────────────────────────────────────────────────
const acceptJobRequest = async (req, res) => {
    try {
        const jobRequest = await JobRequest.findById(req.params.id);

        if (!jobRequest) {
            return errorResponse(res, 404, 'Job request not found');
        }

        // Only the intended applicant can accept
        if (jobRequest.applicant.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to respond to this job request');
        }

        if (jobRequest.status !== 'sent') {
            return errorResponse(res, 400, `Cannot accept a request with status '${jobRequest.status}'`);
        }

        // Check expiry
        if (new Date() > jobRequest.expiresAt) {
            jobRequest.status = 'expired';
            await jobRequest.save();
            return errorResponse(res, 400, 'This job request has expired');
        }

        jobRequest.status = 'accepted';
        jobRequest.respondedAt = new Date();
        await jobRequest.save();

        // If linked to a job, create/update an Application entry
        if (jobRequest.job) {
            const existingApp = await Application.findOne({
                job: jobRequest.job,
                applicant: req.user._id,
            });

            if (!existingApp) {
                await Application.create({
                    job: jobRequest.job,
                    applicant: req.user._id,
                    employer: jobRequest.employer,
                    status: 'accepted',
                    coverLetter: 'Accepted from job request.',
                    expectedSalary: jobRequest.offeredHourlyRate,
                    history: [{
                        status: 'accepted',
                        updatedBy: jobRequest.employer,
                        updatedByType: 'Employer',
                        note: 'Application automatically created from accepted job request.',
                        updatedAt: new Date()
                    }]
                });

                // Update Stats
                await Job.findByIdAndUpdate(jobRequest.job, { $inc: { totalApplications: 1, acceptedApplicants: 1 } });
                await Applicant.findByIdAndUpdate(req.user._id, { $inc: { totalApplications: 1, acceptedApplications: 1 } });
            } else if (existingApp.status !== 'accepted') {
                existingApp.status = 'accepted';
                existingApp.history.push({
                    status: 'accepted',
                    updatedBy: jobRequest.employer,
                    updatedByType: 'Employer',
                    note: 'Accepted via direct job request.',
                    updatedAt: new Date()
                });
                await existingApp.save();
                
                await Job.findByIdAndUpdate(jobRequest.job, { $inc: { acceptedApplicants: 1 } });
                await Applicant.findByIdAndUpdate(req.user._id, { $inc: { acceptedApplications: 1 } });
            }
        }

        // Notify employer (fire-and-forget)
        const employer = await Employer.findById(jobRequest.employer);
        if (employer) {
            notifyEmployerJobRequestResponse(jobRequest, employer, req.user).catch(console.error);
        }

        return successResponse(res, 200, 'Job request accepted', jobRequest);
    } catch (error) {
        console.error('Accept job request error:', error);
        return errorResponse(res, 500, 'Error accepting job request', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Applicant declines a job request
// @route   PUT /api/job-requests/:id/decline
// @access  Private (Applicant)
// ─────────────────────────────────────────────────────────────────────────────
const declineJobRequest = async (req, res) => {
    try {
        const jobRequest = await JobRequest.findById(req.params.id);

        if (!jobRequest) {
            return errorResponse(res, 404, 'Job request not found');
        }

        if (jobRequest.applicant.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to respond to this job request');
        }

        if (jobRequest.status !== 'sent') {
            return errorResponse(res, 400, `Cannot decline a request with status '${jobRequest.status}'`);
        }

        jobRequest.status = 'declined';
        jobRequest.respondedAt = new Date();
        if (req.body.declineReason) {
            jobRequest.declineReason = req.body.declineReason;
        }
        await jobRequest.save();

        // Notify employer (fire-and-forget)
        const employer = await Employer.findById(jobRequest.employer);
        if (employer) {
            notifyEmployerJobRequestResponse(jobRequest, employer, req.user).catch(console.error);
        }

        return successResponse(res, 200, 'Job request declined', jobRequest);
    } catch (error) {
        console.error('Decline job request error:', error);
        return errorResponse(res, 500, 'Error declining job request', error.message);
    }
};

module.exports = {
    sendJobRequest,
    getEmployerSentRequests,
    getApplicantReceivedRequests,
    getJobRequestById,
    acceptJobRequest,
    declineJobRequest,
};
