const express = require('express');

const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/CourseController');

const Course = require('../models/Course');
const advancedResults = require('../middlewares/advancedResults');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middlewares/auth');

router.route('/')
    .get(advancedResults(Course, { path: 'bootcamp', select: 'name description' }), getCourses)
    .post(protect, createCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);

module.exports = router;