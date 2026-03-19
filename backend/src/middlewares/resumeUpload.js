/**
 * resumeUpload.js
 * NEW — Multer middleware for resume file uploads (PDF / DOC / DOCX).
 * Uses Cloudinary for storage (already installed: multer-storage-cloudinary, cloudinary).
 * Does NOT modify any existing upload middleware.
 *
 * Usage in routes:
 *   const { uploadResume } = require('../middlewares/resumeUpload');
 *   router.post('/resume', protect, authorize('applicant'), uploadResume, handler);
 */

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary (reads from existing env vars)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage — resumes stored in a dedicated folder, kept as raw files
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'shiftmatch/resumes',
        resource_type: 'auto',
        // Use applicant ID + timestamp as public_id for uniqueness
        public_id: (req, file) => {
            return `resume_${req.user._id}_${Date.now()}`;
        },
    },
});

// File filter — only allow PDF and Word documents
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        console.warn(`[Resume] Blocked upload: Unsupported mimetype "${file.mimetype}" for file "${file.originalname}"`);
        cb(new Error('Only PDF and Word documents (.doc, .docx) are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // Increased to 10 MB max
    },
});

// Single-file middleware — field name must be "resume"
const uploadResume = upload.single('resume');

module.exports = { uploadResume, cloudinary };
