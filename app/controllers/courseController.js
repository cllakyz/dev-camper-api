const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler  = require('./../middlewares/async');
const Course        = require('./../models/courseModel');

/**
 * @desc    Get courses
 * @method  GET /api/v1/courses
 * @method  GET /api/v1/bootcamps/:bootcampId/courses
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        length: courses.length,
        data: courses
    });
});