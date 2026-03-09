const Category = require('../models/Category');
const { successResponse, errorResponse } = require('../utils/responseUtils');

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort('name');
        return successResponse(res, 200, 'Categories retrieved successfully', categories);
    } catch (error) {
        return errorResponse(res, 500, 'Error retrieving categories', error.message);
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
    try {
        const { name, description, icon } = req.body;

        const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) {
            return errorResponse(res, 400, 'Category already exists');
        }

        const category = await Category.create({ name, description, icon });
        return successResponse(res, 201, 'Category created successfully', category);
    } catch (error) {
        return errorResponse(res, 500, 'Error creating category', error.message);
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!category) return errorResponse(res, 404, 'Category not found');
        return successResponse(res, 200, 'Category updated successfully', category);
    } catch (error) {
        return errorResponse(res, 500, 'Error updating category', error.message);
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return errorResponse(res, 404, 'Category not found');
        return successResponse(res, 200, 'Category deleted successfully');
    } catch (error) {
        return errorResponse(res, 500, 'Error deleting category', error.message);
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
