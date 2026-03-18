const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);
router.get('/analytics/charts', getAnalyticsChartData);

// Employer management
router.get('/employers', getAllEmployers);
router.put('/employers/:id/approve', approveEmployer);
router.put('/employers/:id/block', blockEmployer);
router.put('/employers/:id/unblock', unblockEmployer);

// Applicant management
router.get('/applicants', getAllApplicants);
router.put('/applicants/:id/deactivate', deactivateApplicant);
router.put('/applicants/:id/activate', activateApplicant);

// Job moderation
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJob);

module.exports = router;
