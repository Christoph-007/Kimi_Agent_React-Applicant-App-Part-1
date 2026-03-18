const mongoose = require('mongoose');
const Job = require('../models/Job');
const Employer = require('../models/Employer');
const Applicant = require('../models/Applicant'); // NEW: for job-match notifications
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');
// NEW: event-driven job-match notification (does not modify existing logic)
const { notifyApplicantsJobMatchAlert } = require('../services/inAppNotificationService');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer, Approved)
const createJob = async (req, res) => {
    try {
        // Check if employer is approved
        if (!req.user.isApproved) {
            return errorResponse(
                res,
                403,
                'Your account must be approved before posting jobs'
            );
        }

        const {
            salaryAmount, salaryPeriod,
            city, state, pincode, address,
            requiredSkills,
            ...remaining
        } = req.body;

        const jobData = {
            ...remaining,
            employer: req.user._id,
        };

        // Map salary if not already object
        if (!req.body.salary && salaryAmount) {
            jobData.salary = {
                amount: salaryAmount,
                period: salaryPeriod || 'hourly'
            };
        }

        // Map location if not already object
        if (!req.body.location && city) {
            jobData.location = {
                city,
                state,
                pincode,
                address: address || ''
            };
        }

        // Map skills to requirements.skills
        if (requiredSkills && !jobData.requirements) {
            jobData.requirements = {
                skills: requiredSkills
            };
        } else if (requiredSkills && jobData.requirements) {
            jobData.requirements.skills = requiredSkills;
        }

        const job = await Job.create(jobData);

        // Update employer stats
        await Employer.findByIdAndUpdate(req.user._id, {
            $inc: { totalJobsPosted: 1, activeJobs: 1 },
        });

        const populatedJob = await Job.findById(job._id).populate(
            'employer',
            'storeName ownerName email phone businessType'
        );

        // NEW: fire-and-forget — notify applicants whose interests match this job
        (async () => {
            try {
                const categoryMap = {
                    restaurant: 'food-service',
                    retail: 'retail',
                    logistics: 'logistics',
                    healthcare: 'healthcare',
                    hospitality: 'hospitality',
                    other: 'other',
                };
                const matchCategory = categoryMap[populatedJob.employer?.businessType];
                if (matchCategory) {
                    const matchingApplicants = await Applicant.find({
                        isActive: true,
                        isAvailable: true,
                        jobCategories: matchCategory,
                    }).select('name email phone jobCategories');

                    if (matchingApplicants.length > 0) {
                        await notifyApplicantsJobMatchAlert(populatedJob, matchingApplicants);
                    }
                }
            } catch (err) {
                console.error('[JobController] Job-match notification failed:', err.message);
            }
        })();

        return successResponse(res, 201, 'Job created successfully', populatedJob);
    } catch (error) {
        console.error('Create job error:', error);
        return errorResponse(res, 500, 'Error creating job', error.message);
    }
};

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
    try {
        const {
            jobType,
            city,
            state,
            minSalary,
            maxSalary,
            search,
            category,
            status = 'open',
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        // Build query
        const query = {};

        if (jobType) {
            query.jobType = jobType;
        }

        if (city) {
            query['location.city'] = new RegExp(city, 'i');
        }

        if (state) {
            query['location.state'] = new RegExp(state, 'i');
        }

        if (req.query.skills) {
            const skillsVal = req.query.skills;
            const skillsArray = Array.isArray(skillsVal) ? skillsVal : skillsVal.split(',').map(s => s.trim());
            if (skillsArray.length > 0) {
                query['requirements.skills'] = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
            }
        }

        if (status) {
            query.status = status;
        }

        if (minSalary || maxSalary) {
            query['salary.amount'] = {};
            if (minSalary) {
                query['salary.amount'].$gte = parseFloat(minSalary);
            }
            if (maxSalary) {
                query['salary.amount'].$lte = parseFloat(maxSalary);
            }
        }

        // Search improvements
        const searchFilters = [];
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            searchFilters.push({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { 'requirements.skills': searchRegex },
                ]
            });
        }

        if (req.query.locationSearch) {
            const locationRegex = new RegExp(req.query.locationSearch, 'i');
            searchFilters.push({
                $or: [
                    { 'location.city': locationRegex },
                    { 'location.state': locationRegex },
                    { 'location.address': locationRegex },
                ]
            });
        }

        if (category) {
            const categoryRegex = new RegExp(category, 'i');
            searchFilters.push({
                $or: [
                    { title: categoryRegex },
                    { description: categoryRegex },
                    { 'requirements.skills': categoryRegex },
                ]
            });
        }

        // Apply AND to the search filters if they exist
        if (searchFilters.length > 0) {
            query.$and = searchFilters;
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Sort
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        // Execute query
        const jobs = await Job.find(query)
            .populate('employer', 'storeName businessType location.city location.state')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalJobs = await Job.countDocuments(query);

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalJobs / limitNum),
            totalItems: totalJobs,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalJobs / limitNum),
            hasPrevPage: pageNum > 1,
        };

        let jobsWithApplied = jobs.map(j => j.toObject());

        // If authenticated as applicant, check which jobs they've applied for
        if (req.user && req.userType === 'applicant') {
            const Application = require('../models/Application');
            const userApplications = await Application.find({
                applicant: req.user._id,
                job: { $in: jobs.map(j => j._id) }
            }).select('job');

            const appliedJobIds = new Set(userApplications.map(a => a.job.toString()));

            // Check saved jobs
            const applicant = await Applicant.findById(req.user._id).select('savedJobs');
            const savedJobIds = new Set(applicant?.savedJobs?.map(id => id.toString()) || []);

            jobsWithApplied = jobsWithApplied.map(job => ({
                ...job,
                hasApplied: appliedJobIds.has(job._id.toString()),
                isSaved: savedJobIds.has(job._id.toString())
            }));
        }

        return paginatedResponse(
            res,
            200,
            'Jobs retrieved successfully',
            jobsWithApplied,
            pagination
        );
    } catch (error) {
        console.error('Get all jobs error:', error);
        return errorResponse(res, 500, 'Error retrieving jobs', error.message);
    }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            'employer',
            'storeName ownerName businessType address location.city location.state'
        );

        if (!job) {
            return errorResponse(res, 404, 'Job not found');
        }

        // Increment views
        job.views += 1;
        await job.save();

        const jobObj = job.toObject();

        // If authenticated as applicant, check if already applied
        if (req.user && req.userType === 'applicant') {
            const Application = require('../models/Application');
            const application = await Application.findOne({
                job: job._id,
                applicant: req.user._id,
            });
            jobObj.hasApplied = !!application;

            // Check if saved
            const applicant = await Applicant.findById(req.user._id).select('savedJobs');
            jobObj.isSaved = applicant?.savedJobs?.some(id => id.toString() === job._id.toString());
        }

        return successResponse(res, 200, 'Job retrieved successfully', jobObj);
    } catch (error) {
        console.error('Get job by ID error:', error);
        return errorResponse(res, 500, 'Error retrieving job', error.message);
    }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (Employer)
const getEmployerJobs = async (req, res) => {
    try {
        const {
            status,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        const query = { employer: req.user._id };

        if (status) {
            query.status = status;
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const jobs = await Job.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalJobs = await Job.countDocuments(query);

        // Fetch accurate counts for each job to avoid denormalization sync issues
        const Application = require('../models/Application');
        const jobsWithStats = await Promise.all(jobs.map(async (job) => {
            const [total, accepted] = await Promise.all([
                Application.countDocuments({ job: job._id }),
                Application.countDocuments({ job: job._id, status: 'accepted' })
            ]);
            
            const jobObj = job.toObject();
            jobObj.totalApplications = total;
            jobObj.acceptedApplicants = accepted;
            return jobObj;
        }));

        const pagination = {
            currentPage: pageNum,
            totalPages: Math.ceil(totalJobs / limitNum),
            totalItems: totalJobs,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalJobs / limitNum),
            hasPrevPage: pageNum > 1,
        };

        return paginatedResponse(
            res,
            200,
            'Employer jobs retrieved successfully',
            jobsWithStats,
            pagination
        );
    } catch (error) {
        console.error('Get employer jobs error:', error);
        return errorResponse(res, 500, 'Error retrieving jobs', error.message);
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer, own jobs)
const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return errorResponse(res, 404, 'Job not found');
        }

        // Check if job belongs to employer
        if (job.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to update this job');
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('employer', 'storeName ownerName businessType');

        return successResponse(res, 200, 'Job updated successfully', job);
    } catch (error) {
        console.error('Update job error:', error);
        return errorResponse(res, 500, 'Error updating job', error.message);
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer, own jobs)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return errorResponse(res, 404, 'Job not found');
        }

        // Check if job belongs to employer
        if (job.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to delete this job');
        }

        await job.deleteOne();

        // Update employer stats
        if (job.status === 'open') {
            await Employer.findByIdAndUpdate(req.user._id, {
                $inc: { activeJobs: -1 },
            });
        }

        return successResponse(res, 200, 'Job deleted successfully');
    } catch (error) {
        console.error('Delete job error:', error);
        return errorResponse(res, 500, 'Error deleting job', error.message);
    }
};

// @desc    Close job
// @route   PUT /api/jobs/:id/close
// @access  Private (Employer, own jobs)
const closeJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return errorResponse(res, 404, 'Job not found');
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to close this job');
        }

        if (job.status === 'closed') {
            return errorResponse(res, 400, 'Job is already closed');
        }

        job.status = 'closed';
        await job.save();

        // Update employer stats
        await Employer.findByIdAndUpdate(req.user._id, {
            $inc: { activeJobs: -1 },
        });

        return successResponse(res, 200, 'Job closed successfully', job);
    } catch (error) {
        console.error('Close job error:', error);
        return errorResponse(res, 500, 'Error closing job', error.message);
    }
};

// @desc    Reopen job
// @route   PUT /api/jobs/:id/reopen
// @access  Private (Employer, own jobs)
const reopenJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return errorResponse(res, 404, 'Job not found');
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to reopen this job');
        }

        if (job.status === 'open') {
            return errorResponse(res, 400, 'Job is already open');
        }

        job.status = 'open';
        await job.save();

        // Update employer stats
        await Employer.findByIdAndUpdate(req.user._id, {
            $inc: { activeJobs: 1 },
        });

        return successResponse(res, 200, 'Job reopened successfully', job);
    } catch (error) {
        console.error('Reopen job error:', error);
        return errorResponse(res, 500, 'Error reopening job', error.message);
    }
};

// @desc    Get popular job titles based on application count
// @route   GET /api/jobs/popular/roles
// @access  Public
const getPopularRoles = async (req, res) => {
    try {
        const Application = require('../models/Application');
        const popularRoles = await Application.aggregate([
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails',
                },
            },
            { $unwind: '$jobDetails' },
            {
                $group: {
                    _id: '$jobDetails.title',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        const roles = popularRoles.map((role) => role._id);

        // If no applications yet, fallback to some default roles from Job model
        if (roles.length === 0) {
            const jobs = await Job.find({ status: 'open' }).limit(5).select('title');
            const fallbackRoles = [...new Set(jobs.map(j => j.title))];
            return successResponse(res, 200, 'Popular roles retrieved (fallback)', fallbackRoles);
        }

        return successResponse(res, 200, 'Popular roles retrieved successfully', roles);
    } catch (error) {
        console.error('Get popular roles error:', error);
        return errorResponse(res, 500, 'Error retrieving popular roles', error.message);
    }
};

// @desc    Get landing page stats
// @route   GET /api/jobs/stats/landing
// @access  Public
const getLandingStats = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();
        const totalCompanies = await Employer.countDocuments();
        const totalSeekers = await Applicant.countDocuments();

        // Real logic could be: average time from application created to first status update
        const avgResponse = '15min+';

        return successResponse(res, 200, 'Stats retrieved successfully', {
            totalJobs: totalJobs > 0 ? `${totalJobs}+` : '0',
            totalSeekers: totalSeekers > 0 ? `${totalSeekers}+` : '0',
            totalCompanies: totalCompanies > 0 ? `${totalCompanies}+` : '0',
            avgResponse
        });
    } catch (error) {
        console.error('Get landing stats error:', error);
        return errorResponse(res, 500, 'Error retrieving landing stats', error.message);
    }
};

// @desc    Toggle save job for applicant
// @route   POST /api/jobs/:id/save
// @access  Private (Applicant)
const toggleSaveJob = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return errorResponse(res, 401, 'Unauthorized: User not found in request');
        }

        const applicant = await Applicant.findById(req.user._id);
        if (!applicant) {
            return errorResponse(res, 404, 'Applicant profile not found');
        }

        const jobId = req.params.id;
        console.log(`[DEBUG] Toggle save job: applicant=${req.user._id}, job=${jobId}`);

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return errorResponse(res, 400, 'Invalid job ID format');
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return errorResponse(res, 404, 'Job not found');
        }

        // Initialize savedJobs if it doesn't exist
        if (!applicant.savedJobs) {
            applicant.savedJobs = [];
        }

        const isSaved = applicant.savedJobs.some(id => id && id.toString() === jobId);
        console.log(`[DEBUG] Current isSaved: ${isSaved}`);

        let message = '';
        if (isSaved) {
            // Remove from saved jobs - using atomic pull for safety
            await Applicant.findByIdAndUpdate(req.user._id, {
                $pull: { savedJobs: jobId }
            });
            message = 'Job removed from saved';
        } else {
            // Add to saved jobs - using addToSet to prevent duplicates
            await Applicant.findByIdAndUpdate(req.user._id, {
                $addToSet: { savedJobs: jobId }
            });
            message = 'Job saved successfully';
        }

        return successResponse(res, 200, message, {
            isSaved: !isSaved
        });
    } catch (error) {
        console.error('Toggle save job error:', error);
        return errorResponse(res, 500, 'Error toggling save job', error.message);
    }
};
// @desc    Get applicant's saved jobs
// @route   GET /api/jobs/applicant/saved
// @access  Private (Applicant)
const getSavedJobs = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.user._id).populate({
            path: 'savedJobs',
            populate: {
                path: 'employer',
                select: 'storeName businessType location.city location.state'
            }
        });

        if (!applicant) {
            return errorResponse(res, 404, 'Applicant user profile not found');
        }

        const savedJobs = applicant.savedJobs || [];

        return successResponse(res, 200, 'Saved jobs retrieved successfully', savedJobs);
    } catch (error) {
        console.error('Get saved jobs error:', error);
        return errorResponse(res, 500, 'Error retrieving saved jobs', error.message);
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    getEmployerJobs,
    updateJob,
    deleteJob,
    closeJob,
    reopenJob,
    getPopularRoles,
    getLandingStats,
    toggleSaveJob,
    getSavedJobs,
};

