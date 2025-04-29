const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  continent: {
    type: String,
    required: true,
    enum: ["asia", "europe"],
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  flagImage: {
    type: String,
    trim: true
  },
  capital: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
    trim: true
  },
  currency: {
    type: String,
    required: true,
    trim: true
  },
  timeZone: {
    type: String,
    required: true,
    trim: true
  },
  popularDestinations: [{
    type: String,
    trim: true
  }],
  bestTimeToVisit: {
    type: String,
    required: true,
    trim: true
  },
  travelTips: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Country", CountrySchema);
