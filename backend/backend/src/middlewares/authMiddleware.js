const jwt = require('jsonwebtoken');
const Employer = require('../models/Employer');
const Applicant = require('../models/Applicant');
const Admin = require('../models/Admin');
const { errorResponse } = require('../utils/responseUtils');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return errorResponse(
                res,
                401,
                'Not authorized to access this route. Please login.'
            );
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Determine user model based on userType
            let user;
            const userType = decoded.userType;

            if (userType === 'employer') {
                user = await Employer.findById(decoded.id).select('-password');
            } else if (userType === 'applicant') {
                user = await Applicant.findById(decoded.id).select('-password');
            } else if (userType === 'admin') {
                user = await Admin.findById(decoded.id).select('-password');
            }

            // Check if user exists
            if (!user) {
                return errorResponse(res, 404, 'User not found');
            }

            // Attach user and userType to request
            req.user = user;
            req.userType = userType;

            next();
        } catch (error) {
            return errorResponse(res, 401, 'Invalid or expired token');
        }
    } catch (error) {
        return errorResponse(res, 500, 'Server error in authentication', error.message);
    }
};

// Authorize specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userType)) {
            return errorResponse(
                res,
                403,
                `User type '${req.userType}' is not authorized to access this route`
            );
        }
        next();
    };
};

// Check if employer is approved
const checkEmployerApproval = (req, res, next) => {
    if (req.userType === 'employer' && !req.user.isApproved) {
        return errorResponse(
            res,
            403,
            'Your account is pending approval. Please wait for admin approval before posting jobs.'
        );
    }
    next();
};

// Check if employer is not blocked
const checkEmployerBlocked = (req, res, next) => {
    if (req.userType === 'employer' && req.user.isBlocked) {
        return errorResponse(
            res,
            403,
            'Your account has been blocked. Please contact support.'
        );
    }
    next();
};

// Check if applicant is active
const checkApplicantActive = (req, res, next) => {
    if (req.userType === 'applicant' && !req.user.isActive) {
        return errorResponse(
            res,
            403,
            'Your account has been deactivated. Please contact support.'
        );
    }
    next();
};

// Optional protect - if token exists, verify it, but don't fail if not
const optionalProtect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userType = decoded.userType;

            let user;
            if (userType === 'employer') {
                user = await Employer.findById(decoded.id).select('-password');
            } else if (userType === 'applicant') {
                user = await Applicant.findById(decoded.id).select('-password');
            } else if (userType === 'admin') {
                user = await Admin.findById(decoded.id).select('-password');
            }

            if (user) {
                req.user = user;
                req.userType = userType;
            }
            next();
        } catch (error) {
            // Even if token is invalid, we continue for optional routes
            next();
        }
    } catch (error) {
        next();
    }
};

module.exports = {
    protect,
    optionalProtect,
    authorize,
    checkEmployerApproval,
    checkEmployerBlocked,
    checkApplicantActive,
};
