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

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await axios.get(`/api/countries/name/${countryName}`);
        setCountry(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load country details');
        setLoading(false);
      }
    };

    fetchCountry();
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
        <img src={country.image} alt={country.name} className="country-image" />
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
