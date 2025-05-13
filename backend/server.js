require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const tourRoutes = require('./routes/tours');
const destinationRoutes = require('./routes/destinations');
const bookingRoutes = require('./routes/bookings');
const countryRoutes = require('./routes/countries');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Tour API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tours: '/api/tours',
      destinations: '/api/destinations',
      bookings: '/api/bookings',
      countries: '/api/countries',
      admin: '/api/admin',
      health: '/health'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  process.exit(1);
});
