const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || '/api'  // Use environment variable if set, otherwise use relative path
    : process.env.REACT_APP_API_URL || 'http://localhost:5000/api' // In development
};

export default config; 