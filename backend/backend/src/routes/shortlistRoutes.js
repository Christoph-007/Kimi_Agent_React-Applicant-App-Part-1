/**
 * shortlistRoutes.js
 * NEW — Employer shortlist (save/favourite applicants) routes.
 * All routes require an authenticated employer.
 */

const express = require('express');
const router = express.Router();

const {
    addToShortlist,
    getShortlist,
    updateShortlistEntry,
    removeFromShortlist,
    checkShortlisted,
} = require('../controllers/shortlistController');

const {
    protect,
    authorize,
    checkEmployerBlocked,
} = require('../middlewares/authMiddleware');

// All shortlist routes require an authenticated, non-blocked employer
router.use(protect, authorize('employer'), checkEmployerBlocked);

// Add an applicant to the shortlist (upsert)
// POST /api/shortlist
router.post('/', addToShortlist);

// Get all shortlisted applicants for this employer
// GET /api/shortlist?page=&limit=
router.get('/', getShortlist);

// Check if a specific applicant is shortlisted
// GET /api/shortlist/check/:applicantId
router.get('/check/:applicantId', checkShortlisted);

// Update notes/label for a shortlist entry
// PUT /api/shortlist/:id
router.put('/:id', updateShortlistEntry);

// Remove an applicant from the shortlist
// DELETE /api/shortlist/:id
router.delete('/:id', removeFromShortlist);

module.exports = router;
