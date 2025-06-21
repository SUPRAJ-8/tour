const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// Generic async wrapper to avoid repetitive try/catch
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Get current user’s bookings
// @route   GET /api/bookings/my-bookings
// @access  Private/User
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Get single booking (owner or admin)
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  // Ensure user owns booking or is admin
  if (booking.isGuestBooking === false && booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  res.status(200).json({ success: true, data: booking });
});

// @desc    Create booking (authenticated user)
// @route   POST /api/bookings
// @access  Private/User
exports.createBooking = asyncHandler(async (req, res) => {
  // Confirm tour exists
  const tour = await Tour.findById(req.body.tour);
  if (!tour) {
    return res.status(404).json({ success: false, message: 'Tour not found' });
  }

  const numberOfPeople = parseInt(req.body.numberOfPeople, 10) || 1;
  const pricePerPerson = typeof tour.price === 'number' ? tour.price : 0;
  const totalAmount = pricePerPerson * numberOfPeople;

  const booking = await Booking.create({
    tour: tour._id,
    user: req.user.id,
    price: pricePerPerson,
    currency: tour.currency || 'NPR',
    startDate: new Date(req.body.startDate),
    numberOfPeople,
    totalAmount,
    status: 'pending',
    paymentMethod: req.body.paymentMethod,
    paymentStatus: 'pending',
    specialRequests: req.body.specialRequests,
    isGuestBooking: false
  });

  res.status(201).json({ success: true, data: booking });
});

// @desc    Update booking status or payment (admin)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const updates = {};
  if (req.body.status) updates.status = req.body.status;
  if (req.body.paymentStatus) updates.paymentStatus = req.body.paymentStatus;

  const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  res.status(200).json({ success: true, data: booking });
});

// @desc    Cancel a booking (owner or admin)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  if (booking.isGuestBooking === false && booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  booking.status = 'cancelled';
  await booking.save();
  res.status(200).json({ success: true, data: booking });
});

// @desc    Delete booking (admin)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  res.status(200).json({ success: true, message: 'Booking deleted' });
});
