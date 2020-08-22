const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler  = require('./../middlewares/async');
const Review        = require('../models/Review');
const Bootcamp      = require('../models/Bootcamp');

/**
 * @desc    Get reviews
 * @method  GET /api/v1/reviews
 * @method  GET /api/v1/bootcamps/:bootcampId/reviews
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            length: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

/**
 * @desc    Get single review
 * @method  GET /api/v1/reviews/:id
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: review
    });
});