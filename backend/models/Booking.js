const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: function() {
      return !this.isGuestBooking; // Only required if not a guest booking
    }
  },
  guestInfo: {
    name: String,
    email: String,
    phone: String
  },
  isGuestBooking: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price.']
  },
  currency: {
    type: String,
    default: 'NPR',
    enum: ['NPR', 'USD', 'EUR', 'GBP']
  },
  startDate: {
    type: Date,
    required: [true, 'Booking must have a start date.']
  },
  numberOfPeople: {
    type: Number,
    required: [true, 'Booking must have number of people.'],
    min: [1, 'Number of people must be at least 1']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Booking must have a total amount.']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'cash'],
    required: [true, 'Booking must have a payment method.']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  specialRequests: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for faster queries
BookingSchema.index({ tour: 1, user: 1 }, { unique: true, sparse: true }); // sparse allows null user field for guest bookings
BookingSchema.index({ startDate: 1 });
BookingSchema.index({ status: 1 });

// Populate tour and user when finding bookings
BookingSchema.pre(/^find/, function(next) {
  // Only populate user if it's not a guest booking
  if (!this.isGuestBooking) {
    this.populate({
      path: 'user',
      select: 'name email phone'
    });
  }
  
  // Always populate tour
  this.populate({
    path: 'tour',
    select: 'title duration'
  });
  
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
