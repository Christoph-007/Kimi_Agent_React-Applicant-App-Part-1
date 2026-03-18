// Success response
const successResponse = (res, statusCode, message, data = null) => {
    const response = {
        success: true,
        message,
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

// Error response
const errorResponse = (res, statusCode, message, error = null) => {
    const response = {
        success: false,
        message,
    };

    // Only include error details in development
    if (process.env.NODE_ENV === 'development' && error) {
        response.error = error;
    }

    return res.status(statusCode).json(response);
};

// Paginated response
const paginatedResponse = (res, statusCode, message, data, pagination) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        pagination: {
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            itemsPerPage: pagination.itemsPerPage,
            hasNextPage: pagination.hasNextPage,
            hasPrevPage: pagination.hasPrevPage,
        },
    });
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse,
};
