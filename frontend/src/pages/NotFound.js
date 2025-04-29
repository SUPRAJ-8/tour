import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <section className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-text">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">Back to Home</Link>
            <Link to="/tours" className="btn btn-outline">Explore Tours</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
