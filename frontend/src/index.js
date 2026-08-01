import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css';
import './assets/css/phone-link.css';
import './assets/css/email-link.css';
import './assets/css/location-link.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// Import router configuration with future flags
import { routerFutureConfig } from './router-config';
// Import axios config to set up interceptors for GitHub Pages
import './services/axiosConfig';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter future={routerFutureConfig}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Dev: log every metric to the console as it's measured.
// Prod: structured so it's a one-line swap to send to an analytics endpoint later,
// e.g. navigator.sendBeacon('/api/vitals', JSON.stringify(metric)).
if (process.env.NODE_ENV === 'production') {
  reportWebVitals(() => {});
} else {
  reportWebVitals(console.log);
}
