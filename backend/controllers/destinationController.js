const Destination = require('../models/Destination');
const { validationResult } = require('express-validator');

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
exports.getDestinations = async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    let query = Destination.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const destinations = await query;
    const total = await Destination.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      success: true,
      count: destinations.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: destinations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
exports.getDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Private (Admin)
exports.createDestination = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const destination = await Destination.create(req.body);

    res.status(201).json({
      success: true,
      data: destination
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private (Admin)
exports.updateDestination = async (req, res) => {
  try {
    let destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private (Admin)
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    await destination.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get destinations by continent
// @route   GET /api/destinations/continent/:continent
// @access  Public
exports.getDestinationsByContinent = async (req, res) => {
  try {
    const destinations = await Destination.find({ 
      continent: req.params.continent 
    });

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured destinations
// @route   GET /api/destinations/featured
// @access  Public
exports.getFeaturedDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({ featured: true }).limit(6);

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
