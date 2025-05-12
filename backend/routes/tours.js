const express = require('express');
const { check } = require('express-validator');
const { 
  getTours, 
  getTour, 
  createTour, 
  updateTour, 
  deleteTour,
  getTopTours,
  getTourStats
} = require('../controllers/tourController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/top-5-cheap', getTopTours);
router.get('/', getTours);
router.get('/:id', getTour);

// Protected routes (admin only)
router.post(
  '/',
  [
    protect,
    authorize('admin'),
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('destination', 'Destination is required').not().isEmpty(),
    check('duration', 'Duration is required').isNumeric(),
    check('price', 'Price is required').isNumeric(),
    check('maxGroupSize', 'Max group size is required').isNumeric(),
    check('difficulty', 'Difficulty is required').isIn(['easy', 'medium', 'difficult']),
    check('coverImage', 'Cover image is required').not().isEmpty()
  ],
  createTour
);

router.put('/:id', protect, authorize('admin'), updateTour);
router.delete('/:id', protect, authorize('admin'), deleteTour);
router.get('/stats', protect, authorize('admin'), getTourStats);

module.exports = router;
