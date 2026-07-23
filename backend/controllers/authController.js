const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// helper to send token
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// @route POST /api/auth/register
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  sendToken(user, 201, res);
});

// @route POST /api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendToken(user, 200, res);
});

// @route GET /api/auth/me
exports.getMe = asyncHandler(async (req, res, next) => {
  res.json({ success: true, data: req.user });
});

// @route PATCH /api/auth/updatedetails
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fields = { name: req.body.name, email: req.body.email };
  const user = await User.findByIdAndUpdate(req.user.id, fields, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: user });
});

// @route PATCH /api/auth/updatepassword
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});
