const express = require('express');
const { check } = require('express-validator');
const { 
  getBookings, 
  getMyBookings, 
  getBooking, 
  createBooking, 
  updateBookingStatus, 
  cancelBooking,
  deleteBooking
} = require('../controllers/bookingController');
const { createGuestBooking } = require('../controllers/guestBookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for guest bookings (no express-validator checks here)
router.post('/guest', createGuestBooking);

// Protected routes (user)
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.post(
  '/',
  [
    protect,
    check('tour', 'Tour is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    // Allow numeric types for numberOfPeople (validated in controller)
    check('numberOfPeople', 'Number of people is required').not().isEmpty(),
    check('paymentMethod', 'Payment method is required').isIn([
      'credit_card', 'paypal', 'bank_transfer', 'cash'
    ])
  ],
  createBooking
);
router.put('/:id/cancel', protect, cancelBooking);

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), getBookings);
router.put('/:id', protect, authorize('admin'), updateBookingStatus);
router.delete('/:id', protect, authorize('admin'), deleteBooking);

module.exports = router;
