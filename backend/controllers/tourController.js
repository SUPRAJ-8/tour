const mongoose = require('mongoose');
const Tour = require('../models/Tour');
const { validationResult } = require('express-validator');

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
exports.getTours = async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected. Current state:', mongoose.connection.readyState);
      return res.status(500).json({
        success: false,
        message: 'Database connection error'
      });
    }

    console.log('MongoDB connected, building query...');

    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Handle tour status filtering
    const isAdmin = req.user && req.user.role === 'admin';
    const includeInactive = req.query.includeInactive === 'true';
    
    // Only show inactive tours if:
    // 1. User is admin, OR
    // 2. includeInactive parameter is true
    if (!isAdmin && !includeInactive) {
      queryObj.status = 'active';
    }
    
    console.log('Query parameters:', {
      isAdmin,
      includeInactive,
      queryObj
    });

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);
    console.log('Parsed MongoDB query:', parsedQuery);
    
    let query = Tour.find(parsedQuery);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      console.log('Sorting by:', sortBy);
    } else {
      query = query.sort('-createdAt');
      console.log('Default sort by -createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
      console.log('Selected fields:', fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    console.log('Pagination:', { page, limit, skip });

    // Add population
    console.log('Adding destination population...');
    query = query.populate('destination');

    // Execute query
    console.log('Executing main query...');
    const tours = await query;
    console.log(`Found ${tours.length} tours`);

    console.log('Counting total documents...');
    const total = await Tour.countDocuments(parsedQuery);
    console.log('Total documents:', total);

    res.status(200).json({
      success: true,
      count: tours.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: tours
    });
  } catch (err) {
    console.error('Error in getTours:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to fetch tours',
      error: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        stack: err.stack
      } : undefined
    });
  }
};

// @desc    Get single tour
// @route   GET /api/tours/:id
// @access  Public
exports.getTour = async (req, res) => {
  try {
    console.log('Attempting to fetch tour with ID:', req.params.id);
    
    // First check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid tour ID format:', req.params.id);
      return res.status(404).json({ 
        success: false,
        message: 'Invalid tour ID format' 
      });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected. Current state:', mongoose.connection.readyState);
      return res.status(500).json({
        success: false,
        message: 'Database connection error'
      });
    }

    console.log('MongoDB connected, attempting to find tour...');
    
    // Try to find the tour and populate in a single query
    let tour = await Tour.findById(req.params.id)
      .populate({
        path: 'destination',
        select: 'name country description coverImage'
      })
      .lean();
      
    if (tour) {
      // Try to populate reviews separately to handle missing Review model gracefully
      try {
        const populatedTour = await Tour.populate(tour, {
          path: 'reviews',
          select: 'rating review user createdAt'
        });
        tour = populatedTour;
      } catch (populateErr) {
        console.warn('Could not populate reviews:', populateErr.message);
        // Continue without reviews
        tour.reviews = [];
      }
    }

    if (!tour) {
      console.log('Tour not found in database');
      return res.status(404).json({ 
        success: false,
        message: 'Tour not found' 
      });
    }

    console.log('Tour found:', tour._id);
    console.log('Destination:', tour.destination ? 'populated' : 'missing');
    console.log('Reviews:', tour.reviews ? tour.reviews.length : 'none');

    res.status(200).json({
      success: true,
      data: tour
    });
  } catch (err) {
    console.error('Tour fetch error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to fetch tour details',
      error: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        stack: err.stack
      } : undefined
    });
  }
};

// @desc    Create new tour
// @route   POST /api/tours
// @access  Private (Admin)
exports.createTour = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add user to req.body
    req.body.createdBy = req.user.id;

    const tour = await Tour.create(req.body);

    res.status(201).json({
      success: true,
      data: tour
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private (Admin)
exports.updateTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: tour
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete tour
// @route   DELETE /api/tours/:id
// @access  Private (Admin)
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    await tour.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get top 5 cheap tours
// @route   GET /api/tours/top-5-cheap
// @access  Public
exports.getTopTours = async (req, res) => {
  try {
    const tours = await Tour.find()
      .sort({ price: 1, ratingsAverage: -1 })
      .limit(5)
      .populate('destination');

    res.status(200).json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get tour stats
// @route   GET /api/tours/stats
// @access  Private (Admin)
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
