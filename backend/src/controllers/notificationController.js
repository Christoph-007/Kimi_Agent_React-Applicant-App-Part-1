/**
 * notificationController.js
 * NEW — CRUD for in-app notifications (read, mark read, dismiss).
 * Works for both Applicant and Employer recipients.
 * Does NOT modify any existing controller.
 */

const Notification = require('../models/Notification');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all notifications for the logged-in user (applicant or employer)
// @route   GET /api/notifications
// @access  Private (Applicant | Employer)
// ─────────────────────────────────────────────────────────────────────────────
const getNotifications = async (req, res) => {
    try {
        const { isRead, page = 1, limit = 20 } = req.query;

        // Determine recipient model from userType
        const recipientModel = req.userType === 'employer' ? 'Employer' : 'Applicant';

        const query = {
            recipient: req.user._id,
            recipientModel,
            isDismissed: false,
        };

        if (isRead !== undefined) {
            query.isRead = isRead === 'true';
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalItems = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            recipientModel,
            isRead: false,
            isDismissed: false,
        });

        return paginatedResponse(
            res,
            200,
            'Notifications retrieved successfully',
            notifications,
            {
                currentPage: pageNum,
                totalPages: Math.ceil(totalItems / limitNum),
                totalItems,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < Math.ceil(totalItems / limitNum),
                hasPrevPage: pageNum > 1,
                unreadCount,
            }
        );
    } catch (error) {
        console.error('Get notifications error:', error);
        return errorResponse(res, 500, 'Error retrieving notifications', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private (Applicant | Employer)
// ─────────────────────────────────────────────────────────────────────────────
const getUnreadCount = async (req, res) => {
    try {
        const recipientModel = req.userType === 'employer' ? 'Employer' : 'Applicant';

        const count = await Notification.countDocuments({
            recipient: req.user._id,
            recipientModel,
            isRead: false,
            isDismissed: false,
        });

        return successResponse(res, 200, 'Unread count retrieved', { unreadCount: count });
    } catch (error) {
        console.error('Get unread count error:', error);
        return errorResponse(res, 500, 'Error retrieving unread count', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private (Applicant | Employer)
// ─────────────────────────────────────────────────────────────────────────────
const markAsRead = async (req, res) => {
    try {
        const recipientModel = req.userType === 'employer' ? 'Employer' : 'Applicant';

        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id,
            recipientModel,
        });

        if (!notification) {
            return errorResponse(res, 404, 'Notification not found');
        }

        if (!notification.isRead) {
            notification.isRead = true;
            notification.readAt = new Date();
            await notification.save();
        }

        return successResponse(res, 200, 'Notification marked as read', notification);
    } catch (error) {
        console.error('Mark as read error:', error);
        return errorResponse(res, 500, 'Error marking notification as read', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mark ALL notifications as read for the logged-in user
// @route   PUT /api/notifications/read-all
// @access  Private (Applicant | Employer)
// ─────────────────────────────────────────────────────────────────────────────
const markAllAsRead = async (req, res) => {
    try {
        const recipientModel = req.userType === 'employer' ? 'Employer' : 'Applicant';

        const result = await Notification.updateMany(
            {
                recipient: req.user._id,
                recipientModel,
                isRead: false,
                isDismissed: false,
            },
            {
                $set: { isRead: true, readAt: new Date() },
            }
        );

        return successResponse(res, 200, `${result.modifiedCount} notifications marked as read`, {
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        return errorResponse(res, 500, 'Error marking notifications as read', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Dismiss (soft-delete) a single notification
// @route   DELETE /api/notifications/:id
// @access  Private (Applicant | Employer)
// ─────────────────────────────────────────────────────────────────────────────
const dismissNotification = async (req, res) => {
    try {
        const recipientModel = req.userType === 'employer' ? 'Employer' : 'Applicant';

        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id,
            recipientModel,
        });

        if (!notification) {
            return errorResponse(res, 404, 'Notification not found');
        }

        notification.isDismissed = true;
        notification.dismissedAt = new Date();
        await notification.save();

        return successResponse(res, 200, 'Notification dismissed');
    } catch (error) {
        console.error('Dismiss notification error:', error);
        return errorResponse(res, 500, 'Error dismissing notification', error.message);
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
};
