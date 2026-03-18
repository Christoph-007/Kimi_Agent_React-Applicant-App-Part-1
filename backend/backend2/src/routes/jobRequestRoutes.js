/**
 * jobRequestRoutes.js
 * NEW — Routes for the employer-to-applicant job request system.
 * Employer routes: send request, view sent requests.
 * Applicant routes: view received requests, accept, decline.
 * Shared route: get single request by ID (access-controlled inside controller).
 */

const express = require('express');
const router = express.Router();

const {
    sendJobRequest,
    getEmployerSentRequests,
    getApplicantReceivedRequests,
    getJobRequestById,
    acceptJobRequest,
    declineJobRequest,
} = require('../controllers/jobRequestController');

const {
    protect,
    authorize,
    checkEmployerApproval,
    checkEmployerBlocked,
    checkApplicantActive,
} = require('../middlewares/authMiddleware');

// ── Employer routes ──────────────────────────────────────────────────────────

// Send a job request to an applicant
// POST /api/job-requests
router.post(
    '/',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    checkEmployerApproval,
    sendJobRequest
);

// Get all job requests sent by the employer
// GET /api/job-requests/employer/sent?status=&page=&limit=
router.get(
    '/employer/sent',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    getEmployerSentRequests
);

// ── Applicant routes ─────────────────────────────────────────────────────────

// Get all job requests received by the applicant
// GET /api/job-requests/applicant/received?status=&page=&limit=
router.get(
    '/applicant/received',
    protect,
    authorize('applicant'),
    checkApplicantActive,
    getApplicantReceivedRequests
);

// Accept a job request
// PUT /api/job-requests/:id/accept
router.put(
    '/:id/accept',
    protect,
    authorize('applicant'),
    checkApplicantActive,
    acceptJobRequest
);

// Decline a job request
// PUT /api/job-requests/:id/decline
router.put(
    '/:id/decline',
    protect,
    authorize('applicant'),
    checkApplicantActive,
    declineJobRequest
);

// ── Shared route ─────────────────────────────────────────────────────────────

// Get a single job request by ID (access-controlled inside controller)
// GET /api/job-requests/:id
router.get('/:id', protect, authorize('employer', 'applicant'), getJobRequestById);

module.exports = router;
