const express = require('express');
const router = express.Router();
const {
    createShift,
    getEmployerShifts,
    getApplicantShifts,
    getShiftById,
    updateShift,
    confirmShift,
    cancelShift,
    deleteShift,
} = require('../controllers/shiftController');
const {
    protect,
    authorize,
    checkEmployerBlocked,
    checkApplicantActive,
} = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { shiftCreationSchema } = require('../utils/validators');

// Employer routes
router.post(
    '/',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    validate(shiftCreationSchema),
    createShift
);

router.get(
    '/employer/my-shifts',
    protect,
    authorize('employer'),
    getEmployerShifts
);

router.put(
    '/:id',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    updateShift
);

router.delete(
    '/:id',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    deleteShift
);

// Applicant routes
router.get(
    '/applicant/my-shifts',
    protect,
    authorize('applicant'),
    getApplicantShifts
);

router.put(
    '/:id/confirm',
    protect,
    authorize('applicant'),
    checkApplicantActive,
    confirmShift
);

// Shared routes (Employer/Applicant)
router.get(
    '/:id',
    protect,
    authorize('employer', 'applicant'),
    getShiftById
);

router.put(
    '/:id/cancel',
    protect,
    authorize('employer', 'applicant'),
    cancelShift
);

module.exports = router;
