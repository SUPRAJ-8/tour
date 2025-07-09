const WorkingVisa = require('../models/visaModel');
const catchAsync = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getAllVisas = catchAsync(async (req, res, next) => {
  const visas = await WorkingVisa.find();

  res.status(200).json({
    status: 'success',
    results: visas.length,
    data: { data: visas },
  });
});

exports.getVisa = catchAsync(async (req, res, next) => {
  const visa = await WorkingVisa.findById(req.params.id);

  if (!visa) {
    return next(new ErrorResponse('No visa found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { data: visa },
  });
});

exports.createVisa = catchAsync(async (req, res, next) => {
  const newVisa = await WorkingVisa.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { data: newVisa },
  });
});

exports.updateVisa = catchAsync(async (req, res, next) => {
  const visa = await WorkingVisa.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!visa) {
    return next(new ErrorResponse('No visa found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { data: visa },
  });
});

exports.deleteVisa = catchAsync(async (req, res, next) => {
  const visa = await WorkingVisa.findByIdAndDelete(req.params.id);

  if (!visa) {
    return next(new ErrorResponse('No visa found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
