const Joi = require('joi');

// Employer signup validation
const employerSignupSchema = Joi.object({
    storeName: Joi.string().trim().required().messages({
        'string.empty': 'Store name is required',
        'any.required': 'Store name is required',
    }),
    ownerName: Joi.string().trim().required().messages({
        'string.empty': 'Owner name is required',
        'any.required': 'Owner name is required',
    }),
    email: Joi.string().email().lowercase().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
    }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Please provide a valid 10-digit phone number',
        'any.required': 'Phone number is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required',
    }),
    // Accept either nested object (backend expectation) or flat fields (frontend actual)
    address: Joi.alternatives().try(
        Joi.object({
            street: Joi.string().allow(''),
            city: Joi.string().required(),
            state: Joi.string().required(),
            pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
        }),
        Joi.string().allow('')
    ).optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).optional(),
    businessType: Joi.string().allow('').optional(),
    description: Joi.string().allow('').optional(),
    businessDescription: Joi.string().allow('').optional(),
});

// Applicant signup validation
const applicantSignupSchema = Joi.object({
    name: Joi.string().trim().optional(),
    fullName: Joi.string().trim().optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Please provide a valid 10-digit phone number',
        'any.required': 'Phone number is required',
    }),
    email: Joi.string().email().lowercase().allow('').optional(),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required',
    }),
    skills: Joi.array().items(Joi.string()).optional(),
    experience: Joi.number().min(0).allow(null, '').optional(),
    preferredJobType: Joi.string().allow('').optional(),
    jobCategories: Joi.array().items(Joi.string()).optional(),
    preferredShiftType: Joi.string().allow('').optional(),
    preferredWorkLocation: Joi.string().allow('').optional(),
    weeklyAvailability: Joi.object().optional(),
    availabilityDays: Joi.array().items(Joi.string()).optional(),
    expectedHourlyRate: Joi.number().min(0).allow(null, '').optional(),
}).or('name', 'fullName').messages({
    'object.missing': 'Please provide either Name or Full Name',
});

// Login validation
const loginSchema = Joi.object({
    identifier: Joi.string().required().messages({
        'string.empty': 'Email or phone is required',
        'any.required': 'Email or phone is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
    userType: Joi.string()
        .valid('employer', 'applicant', 'admin')
        .required()
        .messages({
            'any.only': 'Invalid user type',
            'any.required': 'User type is required',
        }),
});

// Job creation validation
const jobCreationSchema = Joi.object({
    title: Joi.string().trim().required().messages({
        'string.empty': 'Job title is required',
        'any.required': 'Job title is required',
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Job description is required',
        'any.required': 'Job description is required',
    }),
    jobType: Joi.string()
        .valid('full-time', 'part-time', 'shift', 'contract')
        .required()
        .messages({
            'any.only': 'Invalid job type',
            'any.required': 'Job type is required',
        }),
    // Accept either nested object (frontend expected) or flat fields (original backend expected)
    salary: Joi.alternatives().try(
        Joi.object({
            amount: Joi.number().min(0).required(),
            period: Joi.string().valid('hourly', 'daily', 'weekly', 'monthly', 'yearly').required(),
        }),
        Joi.object().optional()
    ).optional(),
    salaryAmount: Joi.number().min(0).optional(),
    salaryPeriod: Joi.string().optional(),

    workingHours: Joi.object().optional(),

    // Accept either nested object (frontend expected) or flat fields (original backend expected)
    location: Joi.alternatives().try(
        Joi.object({
            address: Joi.string().allow('').optional(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
            coordinates: Joi.object().optional(),
        }),
        Joi.object().optional()
    ).optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).optional(),

    requirements: Joi.object().optional(),
    requiredSkills: Joi.array().items(Joi.string()).optional(),
    benefits: Joi.array().items(Joi.string()).optional(),
    expiryDate: Joi.date().allow('').optional(),
});

// Shift creation validation
const shiftCreationSchema = Joi.object({
    jobId: Joi.string().required().messages({
        'any.required': 'Job ID is required',
    }),
    applicantId: Joi.string().required().messages({
        'any.required': 'Applicant ID is required',
    }),
    date: Joi.date().required().messages({
        'any.required': 'Shift date is required',
    }),
    startTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide start time in HH:MM format',
            'any.required': 'Start time is required',
        }),
    endTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide end time in HH:MM format',
            'any.required': 'End time is required',
        }),
    location: Joi.string().required().messages({
        'any.required': 'Location is required',
    }),
    instructions: Joi.string().allow('').optional(),
    paymentAmount: Joi.number().min(0).optional(),
});

module.exports = {
    employerSignupSchema,
    applicantSignupSchema,
    loginSchema,
    jobCreationSchema,
    shiftCreationSchema,
};
