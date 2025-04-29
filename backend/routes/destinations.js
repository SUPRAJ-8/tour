const express = require('express');
const { check } = require('express-validator');
const { 
  getDestinations, 
  getDestination, 
  createDestination, 
  updateDestination, 
  deleteDestination,
  getDestinationsByContinent,
  getFeaturedDestinations
} = require('../controllers/destinationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Custom route to get all unique country names
const Destination = require('../models/Destination');
router.get('/countries', async (req, res) => {
  try {
    const countries = await Destination.aggregate([
      {
        $group: {
          _id: "$country",
          continent: { $first: "$continent" }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          continent: { $toLower: "$continent" }
        }
      }
    ]);
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public routes
router.get('/featured', getFeaturedDestinations);
router.get('/continent/:continent', getDestinationsByContinent);
router.get('/', getDestinations);
router.get('/:id', getDestination);

// Protected routes (admin only)
router.post(
  '/',
  [
    protect,
    authorize('admin'),
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('country', 'Country is required').not().isEmpty(),
    check('continent', 'Continent is required').isIn([
      'Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'
    ]),
    check('coverImage', 'Cover image is required').not().isEmpty()
  ],
  createDestination
);

router.put('/:id', protect, authorize('admin'), updateDestination);
router.delete('/:id', protect, authorize('admin'), deleteDestination);

module.exports = router;
