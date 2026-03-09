const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/jobController');
const {
    protect,
    optionalProtect,
    authorize,
    checkEmployerApproval,
    checkEmployerBlocked,
} = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { jobCreationSchema } = require('../utils/validators');

// Specific Public Routes
router.get('/popular/roles', getPopularRoles);
router.get('/stats/landing', getLandingStats);

// Applicant Job Actions (Must be before generic :id routes if they clash)
router.get('/applicant/saved', protect, authorize('applicant'), getSavedJobs);
router.post('/:id/save', protect, authorize('applicant'), toggleSaveJob);

// Generic Job Routes
router.get('/', optionalProtect, getAllJobs);
router.get('/:id', optionalProtect, getJobById);

// Employer routes (protected)
router.post(
    '/',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    checkEmployerApproval,
    validate(jobCreationSchema),
    createJob
);

router.get(
    '/employer/my-jobs',
    protect,
    authorize('employer'),
    getEmployerJobs
);

router.put(
    '/:id',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    updateJob
);

router.delete(
    '/:id',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    deleteJob
);

router.put(
    '/:id/close',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    closeJob
);

router.put(
    '/:id/reopen',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    reopenJob
);

module.exports = router;
