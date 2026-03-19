/**
 * notificationRoutes.js
 * NEW — In-app notification routes for applicants and employers.
 * Both user types share the same endpoints; the controller uses req.userType
 * to scope queries to the correct recipient.
 */

const express = require('express');
const router = express.Router();

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
} = require('../controllers/notificationController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// All notification routes require an authenticated applicant or employer
router.use(protect, authorize('applicant', 'employer'));

// Get all notifications (with optional ?isRead=true/false filter)
// GET /api/notifications?isRead=&page=&limit=
router.get('/', getNotifications);

// Get unread notification count (for badge display)
// GET /api/notifications/unread-count
router.get('/unread-count', getUnreadCount);

// Mark all notifications as read
// PUT /api/notifications/read-all
router.put('/read-all', markAllAsRead);

// Mark a single notification as read
// PUT /api/notifications/:id/read
router.put('/:id/read', markAsRead);

// Dismiss (soft-delete) a single notification
// DELETE /api/notifications/:id
router.delete('/:id', dismissNotification);

module.exports = router;
