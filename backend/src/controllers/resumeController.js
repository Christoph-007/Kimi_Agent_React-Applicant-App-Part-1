/**
 * resumeController.js
 * NEW — Applicant can upload/replace their resume; employer can view/download it.
 * Resume is stored on Cloudinary; the URL and publicId are saved on the Applicant document.
 * The existing `resume: { url, publicId }` field on Applicant.js is already defined — no schema change needed.
 */

const Applicant = require('../models/Applicant');
const { cloudinary } = require('../middlewares/resumeUpload');
const { successResponse, errorResponse } = require('../utils/responseUtils');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Upload or replace the applicant's resume
// @route   POST /api/resume/upload
// @access  Private (Applicant)
// ─────────────────────────────────────────────────────────────────────────────
const uploadResume = async (req, res) => {
    try {
        if (req.file) {
            console.log('[Resume] Uploaded File metadata:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                path: req.file.path,
                filename: req.file.filename,
                size: req.file.size
            });
        }

        if (!req.file) {
            return errorResponse(res, 400, 'No file uploaded. Please attach a PDF or Word document.');
        }

        // If applicant already has a resume, delete the old one from Cloudinary
        const applicant = await Applicant.findById(req.user._id);
        if (applicant.resume && applicant.resume.publicId) {
            try {
                // Better detection — check URL for '/raw/'
                const isLegacyRaw = applicant.resume.url && applicant.resume.url.includes('/raw/');
                const resType = isLegacyRaw ? 'raw' : 'image';
                
                await cloudinary.uploader.destroy(applicant.resume.publicId, {
                    resource_type: resType,
                });
            } catch (deleteErr) {
                // Non-fatal — log and continue
                console.warn('[Resume] Failed to delete old resume from Cloudinary:', deleteErr.message);
            }
        }

        applicant.resume = {
            url: req.file.path,        // Cloudinary URL
            publicId: req.file.filename, // Cloudinary public_id
        };
        await applicant.save();
        console.log('[Resume] Success: Saved for user', applicant._id, '->', applicant.resume.publicId);

        return successResponse(res, 200, 'Resume uploaded successfully', {
            url: applicant.resume.url,
            publicId: applicant.resume.publicId,
        });
    } catch (error) {
        console.error('Upload resume error:', error);
        return errorResponse(res, 500, 'Error uploading resume', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete the applicant's resume
// @route   DELETE /api/resume
// @access  Private (Applicant)
// ─────────────────────────────────────────────────────────────────────────────
const deleteResume = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.user._id);

        if (!applicant.resume || !applicant.resume.url) {
            return errorResponse(res, 404, 'No resume found to delete');
        }

        // Delete from Cloudinary
        if (applicant.resume.publicId) {
            try {
                // Determine resource_type from URL
                const isRaw = applicant.resume.url && applicant.resume.url.includes('/raw/');
                const resource_type = isRaw ? 'raw' : 'image';
                
                await cloudinary.uploader.destroy(applicant.resume.publicId, {
                    resource_type: resource_type,
                });
            } catch (cloudinaryErr) {
                // Non-fatal — log and continue so the DB is still cleared
                console.warn('[Resume] Failed to delete resume from Cloudinary during removal:', cloudinaryErr.message);
            }
        }

        // Completely remove the resume field to ensure it is deleted from the document
        applicant.resume = undefined;
        await applicant.save();

        return successResponse(res, 200, 'Resume deleted successfully');
    } catch (error) {
        console.error('Delete resume error:', error);
        return errorResponse(res, 500, 'Error deleting resume', error.message);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get resume URL for a specific applicant (employer read-only access)
// @route   GET /api/resume/:applicantId
// @access  Private (Employer, Approved)
// ─────────────────────────────────────────────────────────────────────────────
const getApplicantResume = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.params.applicantId).select('name resume isActive');

        if (!applicant) {
            return errorResponse(res, 404, 'Applicant not found');
        }

        if (!applicant.isActive) {
            return errorResponse(res, 404, 'Applicant profile is not available');
        }

        if (!applicant.resume || !applicant.resume.url) {
            return errorResponse(res, 404, 'This applicant has not uploaded a resume');
        }

        return successResponse(res, 200, 'Resume retrieved successfully', {
            applicantName: applicant.name,
            url: applicant.resume.url,
        });
    } catch (error) {
        console.error('Get resume error:', error);
        return errorResponse(res, 500, 'Error retrieving resume', error.message);
    }
};

module.exports = { uploadResume, deleteResume, getApplicantResume };
