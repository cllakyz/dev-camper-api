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
    const token = await user.getSignedJwtToken();

    res.status(201).json({
        success: true,
        token
    });
});

/**
 * @desc    Login user
 * @method  POST /api/v1/auth/login
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token
    });
});