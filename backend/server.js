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
const uploadRoutes = require('./routes/upload');

const app = express();

// Connect to MongoDB
connectDB();

// ---------------------- Canonical domain redirect ----------------------
// Enforce a single canonical host+scheme (https, non-www) so search engines
// don't index duplicate content served across http/https and www/non-www.
// Gated on the request's actual Host header (not NODE_ENV) so local/dev
// requests to localhost are never redirected, regardless of how NODE_ENV
// is set in that environment.
const CANONICAL_HOST = 'goldenhopetravels.com';
app.set('trust proxy', 1);
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  if (host !== CANONICAL_HOST && host !== `www.${CANONICAL_HOST}`) {
    return next();
  }
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  if (host === `www.${CANONICAL_HOST}` || proto !== 'https') {
    return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
  }
  next();
});

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
  `https://${CANONICAL_HOST}`
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
} // <-- close production CORS block

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '1y', immutable: true }));
app.use('/images', express.static(path.join(__dirname, 'public/images'), { maxAge: '1y', immutable: true }));

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
app.use('/api/upload', uploadRoutes);

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

// Health check routes (must be registered before the frontend catch-all
// below, otherwise it intercepts GET /health first and shadows this route).
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

// --------------- Frontend fallback ---------------
// Paths matching the client-side route table (see frontend/src/App.js) get a 200 —
// React Router owns rendering from there. Anything else is a genuine 404: still
// serve the SPA shell (so NotFound.js renders), but with a real 404 status so
// crawlers don't index broken/typo'd URLs as valid pages.
const KNOWN_ROUTE_PATTERNS = [
  /^\/$/,
  /^\/tours$/,
  /^\/tours\/[^/]+$/,
  /^\/working-visa\/[^/]+$/,
  /^\/countries$/,
  /^\/countries\/asia$/,
  /^\/countries\/europe$/,
  /^\/countries\/asia\/[^/]+$/,
  /^\/countries\/europe\/[^/]+$/,
  /^\/countries\/asia\/[^/]+\/tours\/[^/]+$/,
  /^\/countries\/europe\/[^/]+\/tours\/[^/]+$/,
  /^\/countries\/[^/]+\/[^/]+\/tour\/[^/]+$/,
  /^\/countries\/[^/]+\/[^/]+$/,
  /^\/about$/,
  /^\/contact$/,
  /^\/login$/,
  /^\/register$/,
  /^\/book\/[^/]+$/,
  /^\/admin$/,
  /^\/admin-dashboard$/,
  /^\/dashboard$/
];

app.get('*', (req, res, next) => {
  // Skip if the request is clearly for our API or assets
  if (req.originalUrl.startsWith('/api/') || req.originalUrl.startsWith('/uploads') || req.originalUrl.startsWith('/images')) {
    return next();
  }
  const isKnownRoute = KNOWN_ROUTE_PATTERNS.some((pattern) => pattern.test(req.path));
  res.status(isKnownRoute ? 200 : 404).sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Any /api/* request that fell through the routers and health checks above
// is a real 404, not the SPA shell — return JSON so API clients and crawlers
// get a clean signal instead of an HTML page.
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || (err.code === 'LIMIT_FILE_SIZE' ? 400 : 500);
  res.status(statusCode).json({
    message: statusCode < 500 ? err.message : 'Something went wrong!',
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
