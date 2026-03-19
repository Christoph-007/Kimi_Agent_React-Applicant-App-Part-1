/**
 * resumeRoutes.js
 * NEW — Resume upload/delete for applicants; read-only access for employers.
 */

const express = require('express');
const router = express.Router();

const { uploadResume: uploadMiddleware } = require('../middlewares/resumeUpload');
const {
    uploadResume,
    deleteResume,
    getApplicantResume,
} = require('../controllers/resumeController');

const {
    protect,
    authorize,
    checkApplicantActive,
    checkEmployerApproval,
    checkEmployerBlocked,
} = require('../middlewares/authMiddleware');

// Applicant: upload (or replace) their resume
// POST /api/resume/upload  (multipart/form-data, field: "resume")
router.post(
    '/upload',
    protect,
    authorize('applicant'),
    checkApplicantActive,
    uploadMiddleware,
    uploadResume
);

// Applicant: delete their resume
// DELETE /api/resume
router.delete(
    '/',
    protect,
    authorize('applicant'),
    checkApplicantActive,
    deleteResume
);

// Employer: view/download a specific applicant's resume (read-only)
// GET /api/resume/:applicantId
router.get(
    '/:applicantId',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    checkEmployerApproval,
    getApplicantResume
);

module.exports = router;
