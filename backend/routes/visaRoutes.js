const express = require('express');
const visaController = require('../controllers/visaController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(visaController.getAllVisas)
  .post(protect, authorize('admin'), visaController.createVisa);

router
  .route('/:id')
  .get(visaController.getVisa)
  .patch(protect, authorize('admin'), visaController.updateVisa)
  .delete(protect, authorize('admin'), visaController.deleteVisa);

module.exports = router;
