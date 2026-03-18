const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId, userType) => {
    return jwt.sign(
        { id: userId, userType },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE,
        }
    );
};

const sendTokenResponse = (user, statusCode, res, userType) => {
    const token = generateToken(user._id, userType);

    const userObj = user.toObject ? user.toObject() : { ...user };
    userObj.type = userType;

    // Ensure 'name' is available for all user types for consistent frontend display
    if (userType === 'employer' && !userObj.name) {
        userObj.name = userObj.ownerName || userObj.storeName;
    }

    res.status(statusCode).json({
        success: true,
        token,
        user: userObj,
    });
};

module.exports = { generateToken, sendTokenResponse };
