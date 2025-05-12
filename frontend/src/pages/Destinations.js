import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { FaMapMarkerAlt, FaGlobeAsia, FaGlobeEurope } from 'react-icons/fa';
import './Destinations.css';

const Destinations = () => {
  const { countries, loading: dataLoading } = useData();
  const [loading, setLoading] = useState(true);
  const [allDestinations, setAllDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeContinent, setActiveContinent] = useState('all');

  useEffect(() => {
    if (!dataLoading) {
      try {
        // Extract all destinations from all countries
        const destinations = [];
        
        if (Array.isArray(countries)) {
          countries.forEach(country => {
            if (country && country.popularDestinations && Array.isArray(country.popularDestinations)) {
              country.popularDestinations.forEach(destination => {
                destinations.push({
                  name: destination,
                  country: country.name,
                  countryId: country._id,
                  continent: country.continent,
                  image: country.image // Use country image as fallback
                });
              });
            }
          });
        }
        
        setAllDestinations(destinations);
        setFilteredDestinations(destinations);
        setLoading(false);
      } catch (error) {
        console.error('Error processing destinations:', error);
        setAllDestinations([]);
        setFilteredDestinations([]);
        setLoading(false);
      }
    }
  }, [countries, dataLoading]);

  // Filter destinations based on search term and active continent
  useEffect(() => {
    try {
      let filtered = [...allDestinations];
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          dest => dest.name.toLowerCase().includes(term) || 
                 dest.country.toLowerCase().includes(term)
        );
      }
      
      // Filter by continent
      if (activeContinent !== 'all') {
        filtered = filtered.filter(dest => dest.continent === activeContinent);
      }
      
      setFilteredDestinations(filtered);
    } catch (error) {
      console.error('Error filtering destinations:', error);
      setFilteredDestinations([]);
    }
  }, [searchTerm, activeContinent, allDestinations]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleContinentFilter = (continent) => {
    setActiveContinent(continent);
  };

  if (loading || dataLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading amazing destinations...</p>
      </div>
    );
  }

  return (
    <div className="destinations-page">
      <div className="destinations-header">
        <div className="container">
          <h1 className="destinations-title">Explore Amazing Destinations</h1>
          <p className="destinations-subtitle">Discover the most beautiful places around the world</p>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeContinent === 'all' ? 'active' : ''}`}
              onClick={() => handleContinentFilter('all')}
            >
              All Destinations
            </button>
            <button 
              className={`filter-tab ${activeContinent === 'asia' ? 'active' : ''}`}
              onClick={() => handleContinentFilter('asia')}
            >
              <FaGlobeAsia /> Asian Destinations
            </button>
            <button 
              className={`filter-tab ${activeContinent === 'europe' ? 'active' : ''}`}
              onClick={() => handleContinentFilter('europe')}
            >
              <FaGlobeEurope /> European Destinations
            </button>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="destinations-grid">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((destination, index) => (
              <div className="destination-card" key={`${destination.countryId}-${index}`}>
                <div className="destination-image">
                  <img src={destination.image} alt={destination.name} />
                  <div className="destination-overlay"></div>
                  <div className="destination-content">
                    <h3 className="destination-name">{destination.name}</h3>
                    <div className="destination-location">
                      <FaMapMarkerAlt />
                      <span>{destination.country}</span>
                    </div>
                    <Link 
                      to={`/countries/${destination.continent}/${destination.countryId}`} 
                      className="btn-explore"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-destinations">
              <h3>No destinations found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Destinations;
