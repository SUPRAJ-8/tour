const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const { validationResult } = require('express-validator');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user or user is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to access this booking' });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add user to req.body
    req.body.user = req.user.id;

    // Check if tour exists
    const tour = await Tour.findById(req.body.tour);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Calculate total amount
    const totalAmount = tour.price * req.body.numberOfPeople;
    req.body.price = tour.price;
    req.body.totalAmount = totalAmount;
    req.body.currency = tour.currency || 'NPR';

    // Create booking
    const booking = await Booking.create(req.body);

    // Return consistent data shape
    res.status(201).json({
      success: true,
      count: 1,
      data: [booking]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Build updates from body
    const updates = {};
    ['status', 'paymentStatus', 'numberOfPeople', 'startDate', 'specialRequests'].forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    // Map name/email/phone to guestInfo
    if (req.body.name || req.body.email || req.body.phone) {
      updates.guestInfo = {
        name: req.body.name || booking.guestInfo?.name,
        email: req.body.email || booking.guestInfo?.email,
        phone: req.body.phone || booking.guestInfo?.phone,
      };
    }
    // Perform update
    booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error('Update booking failed:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user (for regular) or user is admin
    if (req.user.role !== 'admin') {
      if (!booking.user || booking.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to cancel this booking' });
      }
    }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ 
        message: `Booking cannot be cancelled as it is already ${booking.status}` 
      });
    }

    // Update booking status
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Permanently delete booking
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    console.error('Delete booking failed:', err.stack || err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Return actual error message for debugging
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
