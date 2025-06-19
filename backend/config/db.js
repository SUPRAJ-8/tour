const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the connection string from the environment.
 * The URI should be supplied via the `MONGODB_URI` env variable.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('MONGODB_URI environment variable is not set.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
