// Placeholder Booking controller
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const notImplemented = (req, res) => res.status(501).json({ success: false, message: 'Not implemented yet' });

exports.getBookings = asyncHandler(notImplemented);
exports.getMyBookings = asyncHandler(notImplemented);
exports.getBooking = asyncHandler(notImplemented);
exports.createBooking = asyncHandler(notImplemented);
exports.updateBookingStatus = asyncHandler(notImplemented);
exports.cancelBooking = asyncHandler(notImplemented);
exports.deleteBooking = asyncHandler(notImplemented);
