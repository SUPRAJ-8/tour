import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaLanguage, FaMoneyBillWave, FaCalendarAlt, FaLightbulb, FaSuitcase } from 'react-icons/fa';
import './CountryDetails.css';

const CountryDetails = () => {
  const { continent, countryName } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [tours, setTours] = useState([]);
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
      
      // Fetch tours for this country
      fetchToursForCountry(countryName);
      
      setTimestamp(Date.now()); // Update timestamp for image cache busting
      setLoading(false);
    } catch (err) {
      console.error('Error during forced refresh:', err);
      setError('Failed to load country details');
      setLoading(false);
    }
  };
  
  // Function to fetch tours for the selected country
  const fetchToursForCountry = async (countryName) => {
    try {
      // Fetch all tours
      const toursResponse = await axios.get('/api/tours');
      
      // Get all destinations to match with tours
      const destinationsResponse = await axios.get('/api/destinations');
      const destinations = destinationsResponse.data;
      
      // Normalize the country name for case-insensitive comparison
      const normalizedCountryName = countryName.toLowerCase();
      
      // Find destinations that match this country
      const countryDestinations = destinations.filter(
        dest => dest.country && dest.country.toLowerCase() === normalizedCountryName
      );
      
      console.log(`Found ${countryDestinations.length} destinations for ${countryName}:`, 
        countryDestinations.map(d => d.name));
      
      // Get destination IDs for this country
      const destinationIds = countryDestinations.map(dest => dest._id);
      
      // Filter tours that belong to these destinations
      let countryTours = [];
      if (Array.isArray(toursResponse.data)) {
        countryTours = toursResponse.data.filter(
          tour => tour.destination && (
            // Match by destination ID
            destinationIds.includes(tour.destination._id || tour.destination) ||
            // Also match by country name in case destination structure varies
            (tour.destination.country && 
             tour.destination.country.toLowerCase() === normalizedCountryName)
          )
        );
      } else if (toursResponse.data && Array.isArray(toursResponse.data.data)) {
        countryTours = toursResponse.data.data.filter(
          tour => tour.destination && (
            // Match by destination ID
            destinationIds.includes(tour.destination._id || tour.destination) ||
            // Also match by country name in case destination structure varies
            (tour.destination.country && 
             tour.destination.country.toLowerCase() === normalizedCountryName)
          )
        );
      }
      
      console.log(`Found ${countryTours.length} tours for ${countryName}`);
      setTours(countryTours);
    } catch (error) {
      console.error('Error fetching tours for country:', error);
      setTours([]);
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

        {/* Tours Section */}
        <section className="country-section tours-section">
          <h2>
            <FaSuitcase className="section-icon" />
            Available Tour Packages
          </h2>
          
          {tours.length === 0 ? (
            <p className="no-tours-message">No tour packages available for {country.name} yet. Check back soon!</p>
          ) : (
            <div className="tours-grid">
              {tours.map(tour => (
                <div key={tour._id} className="tour-card">
                  <div className="tour-image-container">
                    <img 
                      src={tour.coverImage} 
                      alt={tour.title} 
                      className="tour-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Tour+Image';
                      }}
                    />
                  </div>
                  <div className="tour-content">
                    <h3>{tour.title}</h3>
                    <div className="tour-details">
                      <span className="tour-duration">{tour.duration} days</span>
                      <span className="tour-price">${tour.price}</span>
                    </div>
                    <Link 
                      to={`/countries/${continent}/${countryName}/tours/${tour._id}`} 
                      className="view-tour-btn"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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
