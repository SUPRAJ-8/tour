const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @route POST /api/upload
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please select an image to upload', 400));
  }

  const url = `${req.protocol}://${req.get('host')}/uploads/covers/${req.file.filename}`;
  res.status(201).json({ success: true, url });
});
