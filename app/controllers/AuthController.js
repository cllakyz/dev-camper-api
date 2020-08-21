const crypto        = require('crypto');
const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler  = require('./../middlewares/async');
const sendEmail     = require('../utils/sendEmail');
const User          = require('./../models/User');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
}

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

    sendTokenResponse(user, 201, res);
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

    sendTokenResponse(user, 200, res);
});

/**
 * @desc    Get current logged in user
 * @method  POST /api/v1/auth/me
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * @desc    Forgot password
 * @method  POST /api/v1/auth/forgotpassword
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message
        });

        res.status(200).json({
            success: true,
            data: 'Email sent'
        });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could be not sent', 500));
    }
});

/**
 * @desc    Reset password
 * @method  PUT /api/v1/auth/resetpassword/:resetToken
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

/**
 * @desc    Update user details
 * @method  PUT /api/v1/auth/updatedetails
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * @desc    Update password
 * @method  PUT /api/v1/auth/updatepassword
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Current password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});