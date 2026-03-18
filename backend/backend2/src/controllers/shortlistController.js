/**
 * shortlistController.js
 * NEW — Employer shortlist (save/favourite) applicants with private notes.
 * Applicants have zero visibility into this data.
 * Does NOT modify any existing controller.
 */

const Shortlist = require('../models/Shortlist');
const Applicant = require('../models/Applicant');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Add an applicant to the employer's shortlist
// @route   POST /api/shortlist
// @access  Private (Employer, Approved)
// ─────────────────────────────────────────────────────────────────────────────
const addToShortlist = async (req, res) => {
    try {
        const { applicantId, notes, label } = req.body;

        if (!applicantId) {
            return errorResponse(res, 400, 'applicantId is required');
        }

        // Verify applicant exists
        const applicant = await Applicant.findById(applicantId).select('name isActive');
        if (!applicant) {
            return errorResponse(res, 404, 'Applicant not found');
        }
        if (!applicant.isActive) {
            return errorResponse(res, 400, 'Applicant account is not active');
        }

        // upsert: if already shortlisted, update notes/label; otherwise create
        const shortlistEntry = await Shortlist.findOneAndUpdate(
            { employer: req.user._id, applicant: applicantId },
            { notes: notes || '', label: label || '' },
            { new: true, upsert: true, runValidators: true }
        ).populate('applicant', 'name jobCategories preferredShiftType preferredWorkLocation expectedHourlyRate');

        return successResponse(res, 201, 'Applicant added to shortlist', shortlistEntry);
    } catch (error) {
        console.error('Add to shortlist error:', error);
        return errorResponse(res, 500, 'Error adding to shortlist', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all shortlisted applicants for the logged-in employer
// @route   GET /api/shortlist
// @access  Private (Employer)
// ─────────────────────────────────────────────────────────────────────────────
const getShortlist = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const entries = await Shortlist.find({ employer: req.user._id })
            .populate(
                'applicant',
                'name jobCategories preferredShiftType preferredWorkLocation weeklyAvailability expectedHourlyRate skills experience isAvailable'
            )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalItems = await Shortlist.countDocuments({ employer: req.user._id });

        return paginatedResponse(res, 200, 'Shortlist retrieved successfully', entries, {
            currentPage: pageNum,
            totalPages: Math.ceil(totalItems / limitNum),
            totalItems,
            itemsPerPage: limitNum,
            hasNextPage: pageNum < Math.ceil(totalItems / limitNum),
            hasPrevPage: pageNum > 1,
        });
    } catch (error) {
        console.error('Get shortlist error:', error);
        return errorResponse(res, 500, 'Error retrieving shortlist', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update notes/label for a shortlisted applicant
// @route   PUT /api/shortlist/:id
// @access  Private (Employer)
// ─────────────────────────────────────────────────────────────────────────────
const updateShortlistEntry = async (req, res) => {
    try {
        const { notes, label } = req.body;

        const entry = await Shortlist.findById(req.params.id);

        if (!entry) {
            return errorResponse(res, 404, 'Shortlist entry not found');
        }

        // Only the employer who created the entry can update it
        if (entry.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to update this shortlist entry');
        }

        if (notes !== undefined) entry.notes = notes;
        if (label !== undefined) entry.label = label;
        await entry.save();

        return successResponse(res, 200, 'Shortlist entry updated', entry);
    } catch (error) {
        console.error('Update shortlist entry error:', error);
        return errorResponse(res, 500, 'Error updating shortlist entry', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Remove an applicant from the employer's shortlist
// @route   DELETE /api/shortlist/:id
// @access  Private (Employer)
// ─────────────────────────────────────────────────────────────────────────────
const removeFromShortlist = async (req, res) => {
    try {
        const entry = await Shortlist.findById(req.params.id);

        if (!entry) {
            return errorResponse(res, 404, 'Shortlist entry not found');
        }

        if (entry.employer.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to remove this shortlist entry');
        }

        await entry.deleteOne();

        return successResponse(res, 200, 'Applicant removed from shortlist');
    } catch (error) {
        console.error('Remove from shortlist error:', error);
        return errorResponse(res, 500, 'Error removing from shortlist', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Check if a specific applicant is in the employer's shortlist
// @route   GET /api/shortlist/check/:applicantId
// @access  Private (Employer)
// ─────────────────────────────────────────────────────────────────────────────
const checkShortlisted = async (req, res) => {
    try {
        const entry = await Shortlist.findOne({
            employer: req.user._id,
            applicant: req.params.applicantId,
        });

        return successResponse(res, 200, 'Shortlist status retrieved', {
            isShortlisted: !!entry,
            entry: entry || null,
        });
    } catch (error) {
        console.error('Check shortlisted error:', error);
        return errorResponse(res, 500, 'Error checking shortlist status', error.message);
    }
};

module.exports = {
    addToShortlist,
    getShortlist,
    updateShortlistEntry,
    removeFromShortlist,
    checkShortlisted,
};
