const Bootcamp = require('./../models/bootcampModel');

/**
 * @desc    Get all bootcamps
 * @method  GET /api/v1/bootcamps
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();

        res.status(200).json({
            success: true,
            length: bootcamps.length,
            data: bootcamps
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

/**
 * @desc    Get one bootcamp
 * @method  GET /api/v1/bootcamps/:id
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return res.status(404).json({ success: false });
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

/**
 * @desc    Create new bootcamp
 * @method  POST /api/v1/bootcamps
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

/**
 * @desc    Update bootcamp
 * @method  PUT /api/v1/bootcamps/:id
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Update bootcamp'
    });
};

/**
 * @desc    Delete bootcamp
 * @method  DELETE /api/v1/bootcamps/:id
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Delete bootcamp'
    });
};