// Placeholder Destination controller with stubbed methods
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const notImplemented = (req, res) => res.status(501).json({ success: false, message: 'Not implemented yet' });

exports.getDestinations = asyncHandler(notImplemented);
exports.getDestination = asyncHandler(notImplemented);
exports.createDestination = asyncHandler(notImplemented);
exports.updateDestination = asyncHandler(notImplemented);
exports.deleteDestination = asyncHandler(notImplemented);
exports.getDestinationsByContinent = asyncHandler(notImplemented);
exports.getFeaturedDestinations = asyncHandler(notImplemented);
