const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// @desc    Create new booking for guest (non-authenticated) users
// @route   POST /api/bookings/guest
// @access  Public
exports.createGuestBooking = async (req, res) => {
  console.log('createGuestBooking invoked with body:', req.body);
  try {
    // Check if tour exists
    const tour = await Tour.findById(req.body.tour);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Ensure price exists to satisfy Booking model validation
    const pricePerPerson = typeof tour.price === 'number' ? tour.price : 0;

    // Calculate total amount
    const numberOfPeople = parseInt(req.body.numberOfPeople, 10) || 1;
    const totalAmount = pricePerPerson * numberOfPeople;
    
    // Create booking object with guest information
    const bookingData = {
      tour: req.body.tour,
      guestInfo: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      },
      price: pricePerPerson,
      currency: tour.currency || 'NPR',
      startDate: new Date(req.body.startDate),
      numberOfPeople: numberOfPeople,
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
    // Handle Mongoose validation errors as 400
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.values(err.errors).forEach(e => {
        errors[e.path] = e.message;
      });
      console.error('Guest booking Mongoose validation errors:', errors);
      return res.status(400).json({ success: false, errors });
    }
    console.error('Error creating guest booking:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
