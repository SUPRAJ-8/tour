const express = require('express');
const { check } = require('express-validator');
const { 
  getBookings, 
  getMyBookings, 
  getBooking, 
  createBooking, 
  updateBookingStatus, 
  cancelBooking 
} = require('../controllers/bookingController');
const { createGuestBooking } = require('../controllers/guestBookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post(
  '/guest',
  [
    check('tour', 'Tour is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('numberOfPeople', 'Number of people is required').isNumeric(),
    check('paymentMethod', 'Payment method is required').isIn([
      'credit_card', 'paypal', 'bank_transfer', 'cash'
    ])
  ],
  createGuestBooking
);

// Protected routes (user)
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.post(
  '/',
  [
    protect,
    check('tour', 'Tour is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('numberOfPeople', 'Number of people is required').isNumeric(),
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

module.exports = router;
