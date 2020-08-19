const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler  = require('./../middlewares/async');
const User          = require('./../models/User');

/**
 * @desc    Register user
 * @method  POST /api/v1/auth/register
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
        success: true,
        token
    });
});