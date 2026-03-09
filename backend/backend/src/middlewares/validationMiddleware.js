const { errorResponse } = require('../utils/responseUtils');

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            return errorResponse(res, 400, errorMessage);
        }

        next();
    };
};

module.exports = { validate };
