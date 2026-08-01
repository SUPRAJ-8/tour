const fs = require('fs/promises');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { processImageBuffer } = require('../utils/imageProcessing');
const { uploadDir } = require('../middleware/upload');

// @route POST /api/upload
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please select an image to upload', 400));
  }

  const { jpeg, webp } = await processImageBuffer(req.file.buffer, {
    maxWidth: 1920,
    jpegQuality: 80,
    webpQuality: 80,
  });

  const base = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const jpegPath = path.join(uploadDir, `${base}.jpg`);
  const webpPath = path.join(uploadDir, `${base}.webp`);

  await Promise.all([fs.writeFile(jpegPath, jpeg), fs.writeFile(webpPath, webp)]);

  const origin = `${req.protocol}://${req.get('host')}`;
  res.status(201).json({
    success: true,
    url: `${origin}/uploads/covers/${base}.jpg`,
    webpUrl: `${origin}/uploads/covers/${base}.webp`,
  });
});
