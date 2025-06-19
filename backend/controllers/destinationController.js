const Destination = require('../models/Destination');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get all destinations (optional ?continent, pagination)
// @route     GET /api/destinations
// @access    Public
exports.getDestinations = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page, 10)  || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip  = (page - 1) * limit;

  const filter = {};
  if (req.query.continent) filter.continent = req.query.continent;

  const [data, total] = await Promise.all([
    Destination.find(filter).skip(skip).limit(limit),
    Destination.countDocuments(filter)
  ]);

  res.json({ success: true, count: data.length, total, page, data });
});

// @desc      Get single destination
// @route     GET /api/destinations/:id
// @access    Public
exports.getDestination = asyncHandler(async (req, res, next) => {
  const dest = await Destination.findById(req.params.id).populate('tours');
  if (!dest) return next(new ErrorResponse('Destination not found', 404));
  res.json({ success: true, data: dest });
});

// @desc      Create destination
// @route     POST /api/destinations
// @access    Private (admin)
exports.createDestination = asyncHandler(async (req, res) => {
  const dest = await Destination.create(req.body);
  res.status(201).json({ success: true, data: dest });
});

// @desc      Update destination
// @route     PUT /api/destinations/:id
// @access    Private (admin)
exports.updateDestination = asyncHandler(async (req, res, next) => {
  const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!dest) return next(new ErrorResponse('Destination not found', 404));
  res.json({ success: true, data: dest });
});

// @desc      Delete destination
// @route     DELETE /api/destinations/:id
// @access    Private (admin)
exports.deleteDestination = asyncHandler(async (req, res, next) => {
  const dest = await Destination.findByIdAndDelete(req.params.id);
  if (!dest) return next(new ErrorResponse('Destination not found', 404));
  res.json({ success: true, data: {} });
});

// @desc      Get destinations by continent
// @route     GET /api/destinations/continent/:continent
// @access    Public
exports.getDestinationsByContinent = asyncHandler(async (req, res) => {
  const data = await Destination.find({ continent: req.params.continent });
  res.json({ success: true, count: data.length, data });
});

// @desc      Get featured destinations
// @route     GET /api/destinations/featured
// @access    Public
exports.getFeaturedDestinations = asyncHandler(async (req, res) => {
  const data = await Destination.find({ featured: true }).limit(10);
  res.json({ success: true, count: data.length, data });
});
