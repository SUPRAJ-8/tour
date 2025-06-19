require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Tour = require('../models/Tour');
const Country = require('../models/Country');
const Destination = require('../models/Destination');

/**
 * Utility: strip a hard-coded development host (http://localhost:5000) from image paths.
 * Keeps absolute URLs that already point to a remote host untouched.
 * For example:
 *   http://localhost:5000/uploads/abc.jpg  -> /uploads/abc.jpg
 *   http://localhost:5000/images/foo.jpg    -> /images/foo.jpg
 */
function stripLocalhost(url) {
  if (!url || typeof url !== 'string') return url;
  return url.replace(/https?:\/\/localhost:5000/gi, '');
}

async function fixCollection(Model, fields) {
  const docs = await Model.find({});
  let changed = 0;

  for (const doc of docs) {
    let dirty = false;

    for (const field of fields) {
      const value = doc.get(field);

      // String field
      if (typeof value === 'string') {
        const newVal = stripLocalhost(value);
        if (newVal !== value) {
          doc.set(field, newVal);
          dirty = true;
        }
      }

      // Array of strings field (e.g. images)
      if (Array.isArray(value)) {
        const newArr = value.map(stripLocalhost);
        if (JSON.stringify(newArr) !== JSON.stringify(value)) {
          doc.set(field, newArr);
          dirty = true;
        }
      }
    }

    if (dirty) {
      await doc.save();
      changed += 1;
    }
  }

  return changed;
}

(async function () {
  try {
    await connectDB();
    console.log('✅ Mongo connected');

    const tourChanged = await fixCollection(Tour, ['coverImage', 'images']);
    const destChanged = await fixCollection(Destination, ['image']);
    const countryChanged = await fixCollection(Country, ['image', 'flagImage']);

    console.log(`✨ Done. Updated: Tours ${tourChanged}, Destinations ${destChanged}, Countries ${countryChanged}`);
  } catch (err) {
    console.error('❌ Error fixing image URLs:', err);
  } finally {
    mongoose.connection.close();
  }
})();
