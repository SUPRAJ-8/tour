const mongoose = require('mongoose');

// Helper validator to restrict hero images array to maximum of 5 URLs
function arrayLimit(val) {
  return !val || val.length <= 5;
}

const workingVisaSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  jobOpportunities: {
    type: [String],
  },
  documentsRequired: {
    type: [String],
  },
  culturalNotes: {
    type: [String],
  },
  // New fields added 2025-07-04
  tourPackageName: {
    type: String,
  },
  packageName: {
    type: String,
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true,
  },
  description: {
    type: String,
  },
  mainCoverImage: {
    type: String,
  },
  heroImages: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5 hero images'],
  },
  groupSize: {
    type: String,
  },
  bestSeason: {
    type: String,
  },
  duration: {
    type: String,
  },
  workPermitVisa: {
    type: String,
  },
  requirements: {
    type: [String],
  },
  importantNotes: {
    type: [String],
  },
  headlines: {
    type: [
      {
        title: { type: String, trim: true },
        details: { type: String }
      }
    ],
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const WorkingVisa = mongoose.model('WorkingVisa', workingVisaSchema);

module.exports = WorkingVisa;
