const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'covers');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

const allowedExt = /\.(jpe?g|png|webp|gif)$/i;
const allowedMime = /^image\/(jpeg|png|webp|gif)$/;

const fileFilter = (req, file, cb) => {
  if (allowedExt.test(path.extname(file.originalname)) && allowedMime.test(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Only JPG, PNG, WEBP or GIF image files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;
