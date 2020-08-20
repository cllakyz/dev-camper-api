const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler  = require('./../middlewares/async');
const Course        = require('../models/Course');
const Bootcamp      = require('../models/Bootcamp');

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
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            length: courses.length,
            data: courses
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

/**
 * @desc    Get one course
 * @method  GET /api/v1/courses/:id
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

/**
 * @desc    Create new course
 * @method  POST /api/v1/bootcamps/:bootcampId/courses
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404));
    }

    // Make sure user bootcamp owner
    if (bootcamp.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401));
    }

    const course = await Course.create(req.body);

    res.status(201).json({
        success: true,
        data: course
    });
});

/**
 * @desc    Update course
 * @method  PUT /api/v1/courses/:id
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Make sure user course owner
    if (course.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update a course`, 401));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    });
});

/**
 * @desc    Delete course
 * @method  DELETE /api/v1/courses/:id
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Make sure user course owner
    if (course.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete a course`, 401));
    }

    await course.remove();
    res.status(204).json({success: true});
});