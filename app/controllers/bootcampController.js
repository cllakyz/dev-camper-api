const Bootcamp      = require('./../models/bootcampModel');
const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler  = require('./../middlewares/async');
const geocoder      = require('./../utils/geocoder');

/**
 * @desc    Get all bootcamps
 * @method  GET /api/v1/bootcamps
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr));

    const bootcamps = await query;

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

/**
 * @desc    Get bootcamps within a radius
 * @method  GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc raidus using radians
    // Divide distance by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[ lng, lat ], radius] }
        }
    });

    res.status(200).json({
        success: true,
        length: bootcamps.length,
        data: bootcamps
    });
});