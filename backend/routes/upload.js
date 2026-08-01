const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage } = require('../controllers/uploadController');

router.post('/', protect, authorize('admin'), upload.single('image'), uploadImage);

module.exports = router;
