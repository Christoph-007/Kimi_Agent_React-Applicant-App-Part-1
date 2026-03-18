const express = require('express');
const router = express.Router();
const {
    applyForJob,
    getMyApplications,
    getJobApplications,
    getApplicationById,
    acceptApplication,
    rejectApplication,
    withdrawApplication,
    getEmployerApplications,
} = require('../controllers/applicationController');
const {
    protect,
    authorize,
    checkApplicantActive,
    checkEmployerBlocked,
} = require('../middlewares/authMiddleware');

// Applicant routes
router.post(
    '/:jobId',
    protect,
    authorize('applicant'),
    checkApplicantActive,
    applyForJob
);

router.get(
    '/my-applications',
    protect,
    authorize('applicant'),
    getMyApplications
);

router.put(
    '/:id/withdraw',
    protect,
    authorize('applicant'),
    withdrawApplication
);

// Employer routes
router.get(
    '/job/:jobId',
    protect,
    authorize('employer'),
    getJobApplications
);

router.get(
    '/employer/all',
    protect,
    authorize('employer'),
    getEmployerApplications
);

router.put(
    '/:id/accept',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    acceptApplication
);

router.put(
    '/:id/reject',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    rejectApplication
);

// Shared routes (Employer/Applicant)
router.get(
    '/:id',
    protect,
    authorize('employer', 'applicant'),
    getApplicationById
);

module.exports = router;
