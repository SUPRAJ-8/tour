// Script to seed a sample country into the destinations collection
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toor';

async function seedCountry() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const sampleCountry = {
    name: 'Nepal',
    description: 'A beautiful country in South Asia, home to the Himalayas.',
    country: 'Nepal',
    continent: 'Asia',
    bestTimeToVisit: 'October to December',
    travelTips: ['Carry cash', 'Respect local customs'],
    attractions: ['Mount Everest', 'Kathmandu Valley'],
    coordinates: { latitude: 28.3949, longitude: 84.124 },
    featured: true,
    coverImage: 'https://example.com/nepal.jpg'
  };
  try {
    const exists = await Destination.findOne({ name: sampleCountry.name });
    if (!exists) {
      await Destination.create(sampleCountry);
      console.log('Sample country seeded!');
    } else {
      console.log('Sample country already exists.');
    }
  } catch (err) {
    console.error('Error seeding country:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedCountry();
