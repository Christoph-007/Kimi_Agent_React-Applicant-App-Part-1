/**
 * employerApplicantRoutes.js
 * NEW — Employer-facing routes for browsing applicants and managing saved filters.
 * All routes require: protect + authorize('employer') + checkEmployerApproval + checkEmployerBlocked
 */

const express = require('express');
const router = express.Router();

const {
    browseApplicants,
    getApplicantProfile,
    saveFilters,
    getSavedFilters,
    getDashboardStats,
    getRecentActivity,
} = require('../controllers/employerApplicantController');

const {
    protect,
    authorize,
    checkEmployerApproval,
    checkEmployerBlocked,
} = require('../middlewares/authMiddleware');

// All routes in this file require an approved, non-blocked employer
router.use(protect, authorize('employer'), checkEmployerBlocked, checkEmployerApproval);

// Browse all available applicants with filters
router.get('/applicants', browseApplicants);

// View a single applicant's full profile (read-only)
router.get('/applicants/:id', getApplicantProfile);

// Save employer's filter preferences
router.put('/saved-filters', saveFilters);

// Get employer's saved filter preferences
router.get('/saved-filters', getSavedFilters);

// Dashboard routes
router.get('/dashboard-stats', getDashboardStats);
router.get('/recent-activity', getRecentActivity);

module.exports = router;
