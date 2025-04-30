import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AsianCountries.css';

const AsianCountries = () => {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [asianCountries, setAsianCountries] = useState([]);
  
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('/api/countries');
        const countries = response.data.filter(country => country.continent === 'asia');
        setAsianCountries(countries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setLoading(false);
      }
    };

    fetchCountries();

    // Set up polling to check for updates every 5 seconds
    const interval = setInterval(fetchCountries, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter countries by region
  const regions = ['East Asia', 'Southeast Asia', 'South Asia', 'Central Asia'];
  
  const filteredCountries = activeFilter === 'all' 
    ? asianCountries 
    : asianCountries.filter(country => country.region === activeFilter);

  const handleCountrySelect = (e) => {
    const countryId = e.target.value;
    if (countryId) {
      // Find the country by ID to get its name
      const selectedCountry = asianCountries.find(country => country._id === countryId);
      if (selectedCountry) {
        // Navigate to country detail page using lowercase name
        window.location.href = `/countries/asia/${selectedCountry.name.toLowerCase()}`;
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading Asian destinations...</p>
      </div>
    );
  }

  return (
    <div className="asian-countries-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Explore Asian Countries</h1>
          <p>Discover the rich cultures, ancient traditions, and breathtaking landscapes of Asia</p>
          <Link to="/countries" className="back-button">
            &larr; Back to Categories
          </Link>
        </div>
      </div>

      <div className="region-filters">
        <button 
          className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Regions
        </button>
        {regions.map(region => (
          <button 
            key={region} 
            className={`filter-button ${activeFilter === region ? 'active' : ''}`}
            onClick={() => setActiveFilter(region)}
          >
            {region}
          </button>
        ))}
        
        <div className="country-dropdown">
          <select 
            value={selectedCountry} 
            onChange={handleCountrySelect}
            className="country-select"
          >
            <option value="">Select a Country</option>
            {asianCountries.map(country => (
              <option key={country._id} value={country._id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="asian-countries-grid">
        {filteredCountries.map((country) => (
          <Link to={`/countries/asia/${country.name.toLowerCase()}`} className="card-link" key={country._id}>
            <div className="country-card">
              <div className="country-image">
                <img src={country.image} alt={country.name} />
                <div className="country-badge">{country.region}</div>
              </div>
              <div className="country-content">
                <h2>{country.name}</h2>
                <p className="country-description">{country.description}</p>
                
                <div className="explore-button">
                  Explore {country.name}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AsianCountries;
