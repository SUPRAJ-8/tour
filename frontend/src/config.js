const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || '/api'  // Use environment variable in production
    : 'http://localhost:5000/api' // Development URL
};

export default config; 