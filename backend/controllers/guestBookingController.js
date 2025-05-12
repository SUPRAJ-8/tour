const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const { validationResult } = require('express-validator');

// @desc    Create new booking for guest (non-authenticated) users
// @route   POST /api/bookings/guest
// @access  Public
exports.createGuestBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if tour exists
    const tour = await Tour.findById(req.body.tour);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Calculate total amount
    const totalAmount = tour.price * req.body.numberOfPeople;
    
    // Create booking object with guest information
    const bookingData = {
      tour: req.body.tour,
      guestInfo: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      },
      price: tour.price,
      currency: tour.currency || 'NPR',
      startDate: req.body.startDate,
      numberOfPeople: req.body.numberOfPeople,
      totalAmount: totalAmount,
      status: 'pending',
      paymentMethod: req.body.paymentMethod,
      paymentStatus: 'pending',
      specialRequests: req.body.specialRequests,
      isGuestBooking: true
    };

    // Create booking
    const booking = await Booking.create(bookingData);

    // Send email notification (in a real app)
    // This would be implemented with a proper email service

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
