const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const notImplemented = (req, res) => res.status(501).json({ success: false, message: 'Not implemented yet' });

exports.getCountries = asyncHandler(notImplemented);
exports.createCountry = asyncHandler(notImplemented);
exports.updateCountry = asyncHandler(notImplemented);
exports.deleteCountry = asyncHandler(notImplemented);
