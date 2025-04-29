const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a destination name'],
    trim: true,
    unique: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Please provide a country']
  },
  continent: {
    type: String,
    required: [true, 'Please provide a continent'],
    enum: ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
  },
  images: [String],
  coverImage: {
    type: String,
    required: [true, 'A destination must have a cover image']
  },
  bestTimeToVisit: {
    type: String
  },
  travelTips: [String],
  attractions: [String],
  coordinates: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate
DestinationSchema.virtual('tours', {
  ref: 'Tour',
  foreignField: 'destination',
  localField: '_id'
});

module.exports = mongoose.model('Destination', DestinationSchema);
