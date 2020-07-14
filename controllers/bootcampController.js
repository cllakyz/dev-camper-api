/**
 * @desc    Get all bootcamps
 * @method  GET /api/v1/bootcamps
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Show all bootcamps'
    });
};

/**
 * @desc    Get one bootcamp
 * @method  GET /api/v1/bootcamps/:id
 * @access  Public
 * @param   req
 * @param   res
 * @param   next
 */
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Show one bootcamp'
    });
};

/**
 * @desc    Create new bootcamp
 * @method  POST /api/v1/bootcamps
 * @access  Private
 * @param   req
 * @param   res
 * @param   next
 */
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Create new bootcamp'
    });
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