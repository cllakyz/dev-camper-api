const express = require('express');

const {
    getReviews,
    getReview
} = require('../controllers/ReviewController');

const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
    .get(advancedResults(Review, { path: 'bootcamp', select: 'name description' }), getReviews);

router.route('/:id')
    .get(getReview);

module.exports = router;