// Script to seed Asian and European countries into the Country collection
const mongoose = require('mongoose');
const Country = require('./models/Country');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toor';

const countries = [
  // Asia
  { 
    name: 'India',
    continent: 'Asia',
    flag: 'https://flagcdn.com/in.svg',
    capital: 'New Delhi',
    description: 'A diverse country with rich history, vibrant culture, and varied landscapes from mountains to beaches.',
    language: 'Hindi, English',
    currency: 'INR',
    timeZone: 'UTC+5:30',
    bestTimeToVisit: 'October to March'
  },
  { 
    name: 'China',
    continent: 'Asia',
    flag: 'https://flagcdn.com/cn.svg',
    capital: 'Beijing',
    description: 'The world\'s most populous country with ancient wonders like the Great Wall and modern metropolises.',
    language: 'Mandarin',
    currency: 'CNY',
    timeZone: 'UTC+8',
    bestTimeToVisit: 'September to October'
  },
  { 
    name: 'Japan',
    continent: 'Asia',
    flag: 'https://flagcdn.com/jp.svg',
    capital: 'Tokyo',
    description: 'An island nation blending ancient traditions with cutting-edge technology and unique culture.',
    language: 'Japanese',
    currency: 'JPY',
    timeZone: 'UTC+9',
    bestTimeToVisit: 'March to May'
  },
  { 
    name: 'Thailand',
    continent: 'Asia',
    flag: 'https://flagcdn.com/th.svg',
    capital: 'Bangkok',
    description: 'Known for tropical beaches, opulent royal palaces, ancient ruins and ornate temples.',
    language: 'Thai',
    currency: 'THB',
    timeZone: 'UTC+7',
    bestTimeToVisit: 'November to March'
  }
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
