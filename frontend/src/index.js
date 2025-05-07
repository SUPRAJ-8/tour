import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css';
import App from './App';
import { BrowserRouter, HashRouter, createHashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// Import router configuration with future flags
import { routerFutureConfig } from './router-config';
// Import axios config to set up interceptors for GitHub Pages
import './services/axiosConfig';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter future={routerFutureConfig}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
