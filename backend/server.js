require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load models
require('./models/Tour');
require('./models/Destination');
require('./models/Review');
require('./models/User');

// Import routes
const authRoutes = require('./routes/auth');
const tourRoutes = require('./routes/tours');
const destinationRoutes = require('./routes/destinations');
const bookingRoutes = require('./routes/bookings');
const countryRoutes = require('./routes/countries');
const adminRoutes = require('./routes/admin');
const visaRoutes = require('./routes/visaRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
// ----- Extra header for Chrome Private Network Access (CORS-RFC1918) -----
app.use((req, res, next) => {
  // When browser sends Access-Control-Request-Private-Network, we must respond with this header
  // so that LAN devices (mobile) can access the API from a different port.
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});
// ---------------------- CORS CONFIG ----------------------
if (process.env.NODE_ENV !== 'production') {
  // In development, allow all origins so mobile devices on LAN can access
  // In development, reflect the request origin so credentials work correctly
  const corsOptions = {
    origin: true, // reflects the request origin
    credentials: true
  };
  app.use(cors(corsOptions));
  console.log('CORS: Development mode – dynamic origin enabled');
} else {
  // Dynamic CORS to allow configured domains in production
// ---- Production CORS ----
// Only allow our deployed front-end domains
const allowedOrigins = [
  process.env.FRONTEND_URL && process.env.FRONTEND_URL.replace(/\/+$/, ''),
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://suprajshrestha.com.np',
  'https://www.suprajshrestha.com.np'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
} // <-- close production CORS block

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// -------------------- Serve React Frontend --------------------
// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visas', visaRoutes);

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
      visas: '/api/visas',
      health: '/health'
    }
  });
});

// --------------- Frontend fallback ---------------
// For any non-API routes, send back React's index.html so client-side routing works
app.get('*', (req, res, next) => {
  // Skip if the request is clearly for our API or assets
  if (req.originalUrl.startsWith('/api/') || req.originalUrl.startsWith('/uploads') || req.originalUrl.startsWith('/images')) {
    return next();
  }
  return res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Health check route (root)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running'
  });
});

// Health check route under /api to satisfy frontend checks
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!');
  console.error(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
