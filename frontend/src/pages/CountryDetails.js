import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaLanguage, FaMoneyBillWave, FaCalendarAlt, FaLightbulb } from 'react-icons/fa';
import './CountryDetails.css';

const CountryDetails = () => {
  const { continent, countryName } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timestamp, setTimestamp] = useState(Date.now());

  // Function to force a complete data refresh
  const forceRefresh = async () => {
    try {
      setLoading(true);
      // Log the country name we're trying to fetch
      console.log('Forcing refresh for country:', countryName);
      
      // Make the API call with cache busting
      const response = await axios.get(`/api/countries/name/${countryName}?_=${Date.now()}`);
      
      // Log the response to help with debugging
      console.log('Fresh country data received:', response.data);
      
      // Update the state with the country data
      setCountry(response.data);
      setTimestamp(Date.now()); // Update timestamp for image cache busting
      setLoading(false);
    } catch (err) {
      console.error('Error during forced refresh:', err);
      setError('Failed to load country details');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countryName) {
      forceRefresh();
    }
  }, [countryName]);

  if (loading) {
    return <div className="loading">Loading country details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!country) {
    return <div className="not-found">Country not found</div>;
  }

  return (
    <div className="country-details">
      <div className="country-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="country-title">
          <div className="country-flag">
            <img src={country.flagImage} alt={`${country.name} flag`} />
          </div>
          <h1>{country.name}</h1>
        </div>
      </div>

      <div className="country-hero">
        {/* Use heroImage if available, otherwise fall back to regular image */}
        <img 
          src={country.heroImage || country.image} 
          alt={country.name} 
          className="country-image" 
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            imageRendering: 'high-quality'
          }}
          onError={(e) => {
            console.error('Hero image failed to load, falling back to main image');
            // If heroImage fails, fall back to the regular image
            if (e.target.src !== country.image) {
              e.target.src = country.image;
            }
          }}
        />
        <div className="country-info-overlay">
          <p className="country-description">{country.description}</p>
        </div>
      </div>

      <div className="country-content">
        <div className="info-grid">
          <div className="info-card">
            <FaMapMarkerAlt className="info-icon" />
            <h3>Capital</h3>
            <p>{country.capital}</p>
          </div>
          <div className="info-card">
            <FaLanguage className="info-icon" />
            <h3>Language</h3>
            <p>{country.language}</p>
          </div>
          <div className="info-card">
            <FaMoneyBillWave className="info-icon" />
            <h3>Currency</h3>
            <p>{country.currency}</p>
          </div>
          <div className="info-card">
            <FaClock className="info-icon" />
            <h3>Time Zone</h3>
            <p>{country.timeZone}</p>
          </div>
        </div>

        <section className="country-section">
          <h2>
            <FaCalendarAlt className="section-icon" />
            Best Time to Visit
          </h2>
          <p>{country.bestTimeToVisit}</p>
        </section>

        <section className="country-section">
          <h2>Popular Destinations</h2>
          <div className="destinations-grid">
            {country.popularDestinations.map((destination, index) => (
              <div key={index} className="destination-card">
                <FaMapMarkerAlt className="destination-icon" />
                <h3>{destination}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="country-section">
          <h2>
            <FaLightbulb className="section-icon" />
            Travel Tips
          </h2>
          <ul className="travel-tips">
            {country.travelTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CountryDetails;
