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
    console.log('Fetching country by name:', req.params.name);
    
    // Convert the name parameter to lowercase for case-insensitive comparison
    const nameParam = req.params.name.toLowerCase();
    
    // Find all countries and then filter by lowercase name
    const countries = await Country.find();
    console.log('Found', countries.length, 'countries in database');
    
    const country = countries.find(c => c.name.toLowerCase() === nameParam);
    
    if (!country) {
      console.log('Country not found with name:', nameParam);
      return res.status(404).json({ message: 'Country not found' });
    }
    
    console.log('Found country:', country.name);
    console.log('Hero image:', country.heroImage);
    console.log('Main image:', country.image);
    
    res.json(country);
  } catch (err) {
    console.error('Error fetching country by name:', err);
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
    // Log the incoming data for debugging
    console.log('Updating country with ID:', req.params.id);
    console.log('Update data:', req.body);
    
    // Ensure heroImage is included in the update
    if (!req.body.heroImage && req.body.image) {
      req.body.heroImage = req.body.image;
    }
    
    // Find the country first to see what we're updating
    const existingCountry = await Country.findById(req.params.id);
    console.log('Existing country data:', existingCountry);
    
    // Update the country with the new data
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    console.log('Updated country data:', country);
    res.json(country);
  } catch (err) {
    console.error('Error updating country:', err);
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
