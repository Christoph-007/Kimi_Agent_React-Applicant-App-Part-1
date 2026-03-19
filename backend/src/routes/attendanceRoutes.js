const express = require('express');
const router = express.Router();
const {
    checkIn,
    checkOut,
    getShiftAttendance,
    getEmployerAttendanceRecords,
    getApplicantAttendanceHistory,
    approveAttendance,
    declineAttendance,
    markManualAttendance,
} = require('../controllers/attendanceController');
const {
    protect,
    authorize,
    checkApplicantActive,
    checkEmployerBlocked,
} = require('../middlewares/authMiddleware');

// Applicant routes
router.post(
    '/:shiftId/checkin',
    protect,
    authorize('applicant'),
    checkApplicantActive,
    checkIn
);

router.post(
    '/:shiftId/checkout',
    protect,
    authorize('applicant'),
    checkApplicantActive,
    checkOut
);

router.get(
    '/applicant/history',
    protect,
    authorize('applicant'),
    getApplicantAttendanceHistory
);

// Employer routes
router.get(
    '/employer/records',
    protect,
    authorize('employer'),
    getEmployerAttendanceRecords
);

router.put(
    '/:id/approve',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    approveAttendance
);

router.put(
    '/:id/decline',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    declineAttendance
);

router.post(
    '/manual',
    protect,
    authorize('employer'),
    checkEmployerBlocked,
    markManualAttendance
);

// Shared routes (Employer/Applicant)
router.get(
    '/shift/:shiftId',
    protect,
    authorize('employer', 'applicant'),
    getShiftAttendance
);

module.exports = router;
