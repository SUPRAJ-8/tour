const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

// GET /api/countries - Get all countries
router.get("/", async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/countries/name/:name - Get country by name
router.get("/name/:name", async (req, res) => {
  try {
    const country = await Country.findOne({
      name: { $regex: new RegExp('^' + req.params.name + '$', 'i') }
    });
    
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    res.json(country);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/countries/continent/:continent - Get countries by continent
router.get("/continent/:continent", async (req, res) => {
  try {
    const countries = await Country.find({ 
      continent: req.params.continent.toLowerCase() 
    });
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/countries - Add a new country
router.post("/", async (req, res) => {
  const country = new Country(req.body);
  try {
    const newCountry = await country.save();
    res.status(201).json(newCountry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/countries/:id - Update a country
router.patch("/:id", async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(country);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/countries/:id - Delete a country
router.delete("/:id", async (req, res) => {
  try {
    await Country.findByIdAndDelete(req.params.id);
    res.json({ message: 'Country deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
