// Script to seed Asian and European countries into the Country collection
const mongoose = require('mongoose');
const Country = require('./models/Country');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toor';

const countries = [
  // Asia
  { name: 'Nepal', continent: 'Asia', flag: '' },
  { name: 'India', continent: 'Asia', flag: '' },
  { name: 'China', continent: 'Asia', flag: '' },
  { name: 'Japan', continent: 'Asia', flag: '' },
  { name: 'Thailand', continent: 'Asia', flag: '' },
  { name: 'Vietnam', continent: 'Asia', flag: '' },
  { name: 'Indonesia', continent: 'Asia', flag: '' },
  { name: 'Malaysia', continent: 'Asia', flag: '' },
  { name: 'Singapore', continent: 'Asia', flag: '' },
  // Europe
  { name: 'France', continent: 'Europe', flag: '' },
  { name: 'Germany', continent: 'Europe', flag: '' },
  { name: 'Italy', continent: 'Europe', flag: '' },
  { name: 'Spain', continent: 'Europe', flag: '' },
  { name: 'United Kingdom', continent: 'Europe', flag: '' },
  { name: 'Switzerland', continent: 'Europe', flag: '' },
  { name: 'Netherlands', continent: 'Europe', flag: '' },
  { name: 'Greece', continent: 'Europe', flag: '' },
  { name: 'Austria', continent: 'Europe', flag: '' },
];

async function seedCountries() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    for (const country of countries) {
      const exists = await Country.findOne({ name: country.name });
      if (!exists) {
        await Country.create(country);
        console.log(`Seeded: ${country.name}`);
      } else {
        console.log(`Already exists: ${country.name}`);
      }
    }
  } catch (err) {
    console.error('Error seeding countries:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedCountries();
