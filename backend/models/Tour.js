const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a tour title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  destination: {
    type: mongoose.Schema.ObjectId,
    ref: 'Destination',
    required: [true, 'Tour must belong to a destination']
  },
  duration: {
    type: Number,
    required: [true, 'Tour must have a duration']
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price']
  },
  currency: {
    type: String,
    default: 'NPR',
    enum: ['NPR', 'USD', 'EUR', 'GBP']
  },
  discountPrice: {
    type: Number
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be at least 1.0'],
    max: [5, 'Rating must can not be more than 5.0'],
    set: val => Math.round(val * 10) / 10 // 4.666666 -> 4.7
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  images: [String],
  coverImage: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  startDates: [Date],
  itinerary: [{
    day: Number,
    description: String,
    activities: [String]
  }],
  includes: [String],
  excludes: [String],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Tour must belong to a user']
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate
TourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// Index for faster queries
TourSchema.index({ price: 1, ratingsAverage: -1 });
TourSchema.index({ destination: 1 });

module.exports = mongoose.model('Tour', TourSchema);
