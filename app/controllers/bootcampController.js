const Bootcamp = require('./../models/bootcampModel');
const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler = require('./../middlewares/async');

/**
 * @desc    Get all bootcamps
 * @method  GET /api/v1/bootcamps
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
        success: true,
        length: bootcamps.length,
        data: bootcamps
    });
});

/**
 * @desc    Get one bootcamp
 * @method  GET /api/v1/bootcamps/:id
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

/**
 * @desc    Create new bootcamp
 * @method  POST /api/v1/bootcamps
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

/**
 * @desc    Update bootcamp
 * @method  PUT /api/v1/bootcamps/:id
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

/**
 * @desc    Delete bootcamp
 * @method  DELETE /api/v1/bootcamps/:id
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(204).json({success: true});
});