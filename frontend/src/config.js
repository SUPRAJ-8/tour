const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://tour-3.vercel.app/api'  // Production URL
    : 'http://localhost:5000/api' // Development URL
};

export default config; 