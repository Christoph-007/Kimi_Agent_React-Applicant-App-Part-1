const Employer = require('../models/Employer');
const Applicant = require('../models/Applicant');
const Admin = require('../models/Admin');
const { sendTokenResponse } = require('../utils/tokenUtils');
const { successResponse, errorResponse } = require('../utils/responseUtils');
const {
    notifyEmployerSignup,
    notifyApplicantSignup,
    notifyForgotPassword,
    notifyAdminOfEmployerSignup,
} = require('../services/notificationService');
const crypto = require('crypto');

// NEW: in-app notification service (does not replace the above)
const {
    notifyEmployersNewMatchingApplicant,
} = require('../services/inAppNotificationService');

// @desc    Register employer
// @route   POST /api/auth/employer/signup
// @access  Public
const employerSignup = async (req, res) => {
    try {
        const {
            storeName,
            ownerName,
            email,
            phone,
            password,
            address, // might be string (street) or object
            city,
            state,
            pincode,
            businessType,
            description,
            businessDescription,
        } = req.body;

        // Check if employer already exists
        const existingEmployer = await Employer.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingEmployer) {
            return errorResponse(
                res,
                400,
                'An employer with this email or phone already exists'
            );
        }

        // Map address fields
        const addressObj = {
            street: typeof address === 'string' ? address : (address?.street || ''),
            city: city || address?.city,
            state: state || address?.state,
            pincode: pincode || address?.pincode,
        };

        // Create employer
        const employer = await Employer.create({
            storeName,
            ownerName,
            email,
            phone,
            password,
            address: addressObj,
            businessType: businessType?.toLowerCase() || 'other',
            businessDescription: description || businessDescription || '',
            isApproved: false,
        });

        // Send welcome email (graceful failure)
        try {
            await notifyEmployerSignup(employer);
            await notifyAdminOfEmployerSignup(employer);
        } catch (err) {
            console.error('[Auth] Welcome email failed:', err.message);
        }

        // Send token response
        sendTokenResponse(employer, 201, res, 'employer');
    } catch (error) {
        console.error('Employer signup error:', error);
        return errorResponse(res, 500, 'Error creating employer account', error.message);
    }
};

// @desc    Register applicant
// @route   POST /api/auth/applicant/signup
// @access  Public
const applicantSignup = async (req, res) => {
    try {
        let {
            name,
            fullName,
            phone,
            email,
            password,
            skills,
            experience,
            preferredJobType,
            jobCategories,
            preferredShiftType,
            preferredWorkLocation,
            weeklyAvailability,
            availabilityDays,
            expectedHourlyRate,
        } = req.body;

        // If email is an empty string, set it to undefined to avoid violating the unique sparse index
        if (!email || email.trim() === '') {
            email = undefined;
        }

        // Check if applicant already exists
        const query = { phone };
        if (email) {
            query.$or = [{ phone }, { email }];
        }

        const existingApplicant = await Applicant.findOne(query);

        if (existingApplicant) {
            return errorResponse(
                res,
                400,
                'An applicant with this phone or email already exists'
            );
        }

        // Map weekly availability
        const availability = weeklyAvailability || {
            days: availabilityDays || [],
        };

        // Create applicant
        const applicant = await Applicant.create({
            name: name || fullName,
            phone,
            email,
            password,
            skills,
            experience,
            preferredJobType,
            jobCategories,
            preferredShiftType,
            preferredWorkLocation,
            weeklyAvailability: availability,
            expectedHourlyRate,
        });

        // Send welcome email if email provided (graceful failure)
        if (email) {
            try {
                await notifyApplicantSignup(applicant);
            } catch (err) {
                console.error('[Auth] Applicant welcome email failed:', err.message);
            }
        }

        // NEW: notify employers whose saved filters match this new applicant
        if (jobCategories && jobCategories.length > 0) {
            (async () => {
                try {
                    const matchingEmployers = await Employer.find({
                        isApproved: true,
                        isBlocked: false,
                        'savedFilters.jobCategories': { $in: jobCategories },
                    });
                    if (matchingEmployers.length > 0) {
                        await notifyEmployersNewMatchingApplicant(applicant, matchingEmployers);
                    }
                } catch (err) {
                    console.error('[Auth] Employer match notification failed:', err.message);
                }
            })();
        }

        // Send token response
        sendTokenResponse(applicant, 201, res, 'applicant');
    } catch (error) {
        console.error('Applicant signup error:', error);
        return errorResponse(res, 500, 'Error creating applicant account', error.message);
    }
};

// @desc    Login user (employer/applicant/admin)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        let { identifier, password, userType } = req.body;
        
        // Trim inputs
        identifier = identifier?.trim();
        password = password?.trim();

        console.log('[Auth] Login attempt:', { 
            identifier, 
            userType, 
            passwordLength: password?.length 
        });

        let user = null;
        let detectedUserType = userType;

        if (userType) {
            let Model;
            if (userType === 'employer') Model = Employer;
            else if (userType === 'applicant') Model = Applicant;
            else if (userType === 'admin') Model = Admin;
            
            if (Model) {
              user = await Model.findOne({
                  $or: [{ email: identifier }, { phone: identifier }],
              }).select('+password');
            }
        } else {
            // Auto-detect by searching all models
            // Priority: Admin -> Employer -> Applicant
            user = await Admin.findOne({
                $or: [{ email: identifier }, { phone: identifier }],
            }).select('+password');
            if (user) detectedUserType = 'admin';

            if (!user) {
                user = await Employer.findOne({
                    $or: [{ email: identifier }, { phone: identifier }],
                }).select('+password');
                if (user) detectedUserType = 'employer';
            }

            if (!user) {
                user = await Applicant.findOne({
                    $or: [{ email: identifier }, { phone: identifier }],
                }).select('+password');
                if (user) detectedUserType = 'applicant';
            }
        }

        if (!user) {
            console.log(`[Auth] User not found for identifier: ${identifier}`);
            return errorResponse(res, 401, 'Invalid credentials');
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            console.log(`[Auth] Password mismatch for identifier: ${identifier}`);
            return errorResponse(res, 401, 'Invalid credentials');
        }

        if (detectedUserType === 'employer' && user.isBlocked) {
            return errorResponse(res, 403, 'Your account has been blocked.');
        }

        if (detectedUserType === 'applicant' && !user.isActive) {
            return errorResponse(res, 403, 'Your account has been deactivated.');
        }

        if (detectedUserType === 'admin' && !user.isActive) {
            return errorResponse(res, 403, 'Your admin account has been deactivated.');
        }

        if (detectedUserType === 'admin') {
            user.lastLogin = new Date();
            await user.save();
        }

        user.password = undefined;
        sendTokenResponse(user, 200, res, detectedUserType);
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(res, 500, 'Error logging in', error.message);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const userObj = req.user.toObject ? req.user.toObject() : { ...req.user };
        userObj.type = req.userType;

        // Ensure name is available for consistent display in both apps
        if (req.userType === 'employer' && !userObj.name) {
            userObj.name = userObj.ownerName || userObj.storeName;
        }

        console.log(`[Auth] getMe for ${userObj.email} (${req.userType}). isApproved: ${userObj.isApproved}`);

        return successResponse(res, 200, 'User retrieved successfully', userObj);
    } catch (error) {
        return errorResponse(res, 500, 'Error retrieving user', error.message);
    }
};

// @desc    Update current logged in user profile
// @route   PUT /api/auth/me
// @access  Private
const updateMe = async (req, res) => {
    try {
        let Model;
        if (req.userType === 'employer') {
            Model = Employer;
        } else if (req.userType === 'applicant') {
            Model = Applicant;
        } else if (req.userType === 'admin') {
            Model = Admin;
        }

        // Fields that can be updated
        const updatableFields = [
            'fullName', 'name', 'phone', 'email', 'experience', 'expectedHourlyRate',
            'skills', 'jobCategories', 'preferredShiftType', 'preferredWorkLocation',
            'availabilityDays', 'isAvailable', 'storeName', 'ownerName', 'address',
            'city', 'state', 'pincode', 'description', 'businessDescription'
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (updatableFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Specialized mapping for Applicant
        if (req.userType === 'applicant') {
            if (updates.fullName) updates.name = updates.fullName;
            if (updates.availabilityDays) {
                updates.weeklyAvailability = {
                    ...req.user.weeklyAvailability,
                    days: updates.availabilityDays
                };
            }
        }

        // Specialized mapping for Employer
        if (req.userType === 'employer') {
            // Map name from profile edit to ownerName
            if (updates.name) updates.ownerName = updates.name;
            if (updates.fullName) updates.ownerName = updates.fullName;

            if (updates.city || updates.state || updates.pincode) {
                updates.address = {
                    street: updates.address || req.user.address?.street || '',
                    city: updates.city || req.user.address?.city,
                    state: updates.state || req.user.address?.state,
                    pincode: updates.pincode || req.user.address?.pincode,
                };
            }
            if (updates.description) updates.businessDescription = updates.description;
        }

        const user = await Model.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });

        const userObj = user.toObject ? user.toObject() : { ...user };
        userObj.type = req.userType;

        return successResponse(res, 200, 'Profile updated successfully', userObj);
    } catch (error) {
        console.error('Update profile error:', error);
        return errorResponse(res, 500, 'Error updating profile', error.message);
    }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return errorResponse(res, 400, 'Please provide current and new password');
        }

        let Model;
        if (req.userType === 'employer') Model = Employer;
        else if (req.userType === 'applicant') Model = Applicant;
        else if (req.userType === 'admin') Model = Admin;

        const user = await Model.findById(req.user._id).select('+password');
        const isPasswordMatch = await user.comparePassword(currentPassword);

        if (!isPasswordMatch) {
            return errorResponse(res, 401, 'Current password is incorrect');
        }

        user.password = newPassword;
        await user.save();

        return successResponse(res, 200, 'Password updated successfully');
    } catch (error) {
        console.error('Update password error:', error);
        return errorResponse(res, 500, 'Error updating password', error.message);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
    try {
        return successResponse(res, 200, 'Logged out successfully');
    } catch (error) {
        return errorResponse(res, 500, 'Error logging out', error.message);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email, userType } = req.body;

        if (!email || !userType) {
            return errorResponse(res, 400, 'Please provide email and user type');
        }

        let Model;
        if (userType === 'employer') Model = Employer;
        else if (userType === 'applicant') Model = Applicant;
        else if (userType === 'admin') Model = Admin;
        else return errorResponse(res, 400, 'Invalid user type');

        const user = await Model.findOne({ email });

        if (!user) {
            // Return success even if user not found for security reasons
            return successResponse(res, 200, 'If an account with that email exists, a reset link has been sent.');
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire (10 mins)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // Create reset url
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}?type=${userType}`;

        try {
            await notifyForgotPassword(user, resetUrl);
            return successResponse(res, 200, 'Password reset email sent');
        } catch (err) {
            console.error('[Auth] Reset email failed:', err.message);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return errorResponse(res, 500, 'Email could not be sent');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        return errorResponse(res, 500, 'Error in forgot password', error.message);
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { password, userType } = req.body;
        const { resetToken } = req.params;

        if (!password || !userType) {
            return errorResponse(res, 400, 'Please provide new password and user type');
        }

        let Model;
        if (userType === 'employer') Model = Employer;
        else if (userType === 'applicant') Model = Applicant;
        else if (userType === 'admin') Model = Admin;
        else return errorResponse(res, 400, 'Invalid user type');

        // Get hashed token
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const user = await Model.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return errorResponse(res, 400, 'Invalid token or token expired');
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return successResponse(res, 200, 'Password updated successfully');
    } catch (error) {
        console.error('Reset password error:', error);
        return errorResponse(res, 500, 'Error in reset password', error.message);
    }
};

module.exports = {
    employerSignup,
    applicantSignup,
    login,
    getMe,
    updateMe,
    updatePassword,
    logout,
    forgotPassword,
    resetPassword,
};
