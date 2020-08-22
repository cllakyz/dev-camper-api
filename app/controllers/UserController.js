const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler  = require('./../middlewares/async');
const User          = require('./../models/User');

/**
 * @desc    Get all users
 * @method  GET /api/v1/users
 * @access  Private/Admin
 * @param   req
 * @param   res
 * @param   next
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single user
 * @method  GET /api/v1/users/:id
 * @access  Private/Admin
 * @param   req
 * @param   res
 * @param   next
 */
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * @desc    Create user
 * @method  POST /api/v1/users
 * @access  Private/Admin
 * @param   req
 * @param   res
 * @param   next
 */
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});

/**
 * @desc    Update user
 * @method  PUT /api/v1/users/:id
 * @access  Private/Admin
 * @param   req
 * @param   res
 * @param   next
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * @desc    Delete user
 * @method  DELETE /api/v1/users/:id
 * @access  Private/Admin
 * @param   req
 * @param   res
 * @param   next
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({ success: true });
});