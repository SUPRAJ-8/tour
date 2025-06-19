// Simple placeholder authentication controller so the API starts.
// TODO: Replace these stubs with real implementation.

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Return 501 for unimplemented routes
const notImplemented = (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

exports.register = asyncHandler(notImplemented);
exports.login = asyncHandler(notImplemented);
exports.getMe = asyncHandler(notImplemented);
exports.updateDetails = asyncHandler(notImplemented);
exports.updatePassword = asyncHandler(notImplemented);
