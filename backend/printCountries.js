// Script to print all destination documents' country and continent fields
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toor';

async function printCountries() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const docs = await Destination.find({}, { name: 1, country: 1, continent: 1, _id: 0 });
    if (docs.length === 0) {
      console.log('No destinations found.');
    } else {
      docs.forEach(doc => {
        console.log(`Name: ${doc.name} | Country: ${doc.country} | Continent: ${doc.continent}`);
      });
    }
  } catch (err) {
    console.error('Error printing destinations:', err);
  } finally {
    await mongoose.disconnect();
  }
}

printCountries();
