import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../context/DataContext';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaFilter, FaTimes } from 'react-icons/fa';
import './Tours.css';

const Tours = () => {
  // Use the shared data context
  const { 
    tours: allTours, 
    countries: allCountries, 
    loading: dataLoading
  } = useData();
  
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    destination: '',
    duration: '',
    difficulty: '',
    price: ''
  });

  const [countries, setCountries] = useState([]);
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  
  // Use countries from the shared context
  useEffect(() => {
    // Process countries regardless of whether the array is empty
    try {
      // Filter out Nepal with safety checks
      const filteredCountries = allCountries.filter(country => 
        country && country.name !== 'Nepal'
      );
      setCountries(filteredCountries);
    } catch (error) {
      console.error('Error processing countries:', error);
      setCountries([]);
    }
  }, [allCountries]);

  useEffect(() => {
    // Debug: Log all tours to find the Japan Complete Tour
    console.log('All tours from context:', allTours);
    
    // Process tours regardless of whether data is loaded or not
    setLoading(true);
    
    try {
      // Apply filters to the tours from context
      let filteredTours = Array.isArray(allTours) ? [...allTours] : [];
      
      // Only proceed with filtering if we have tours
      if (filteredTours.length > 0) {
        // Filter by destination/country (with safety checks)
        if (filters.destination) {
          filteredTours = filteredTours.filter(tour => 
            tour?.country && tour.country._id === filters.destination
          );
        }
        
        // Filter by duration (with safety checks)
        if (filters.duration) {
          const [min, max] = filters.duration.split('-').map(Number);
          if (min && max) {
            filteredTours = filteredTours.filter(tour => 
              tour?.duration && tour.duration >= min && tour.duration <= max
            );
          }
        }
        
        // Filter by difficulty (with safety checks)
        if (filters.difficulty) {
          filteredTours = filteredTours.filter(tour => 
            tour?.difficulty && tour.difficulty === filters.difficulty
          );
        }
        
        // Filter by price (with safety checks)
        if (filters.price) {
          const [min, max] = filters.price.split('-').map(Number);
          if (min && max) {
            filteredTours = filteredTours.filter(tour => 
              tour?.price && tour.price >= min && tour.price <= max
            );
          }
        }
        
        // Filter out Nepal tours (with safety checks)
        filteredTours = filteredTours.filter(tour => {
          if (!tour) return false;
          const title = tour.title || '';
          const countryName = tour.country?.name || '';
          const destination = tour.destination || '';
          return !title.includes('Nepal') && 
                 !countryName.includes('Nepal') &&
                 !destination.includes('Nepal');
        });
      }
      
      setTours(filteredTours);
    } catch (error) {
      console.error('Error filtering tours:', error);
      setTours([]);
    } finally {
      // Always set loading to false, even if there were errors
      setLoading(false);
    }
  }, [filters, allTours]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading || dataLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading amazing tours...</p>
      </div>
    );
  }

  // Toggle mobile filters visibility
  const toggleMobileFilters = () => {
    setMobileFiltersVisible(!mobileFiltersVisible);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      destination: '',
      duration: '',
      difficulty: '',
      price: ''
    });
  };

  // Group tours by country with safety checks
  const toursByCountry = tours.reduce((acc, tour) => {
    if (!tour) return acc;
    
    // Use a safe fallback if destination or country is missing
    const country = tour.destination?.country || tour.country?.name || 'Other';
    
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(tour);
    return acc;
  }, {});

  return (
    <section className="tours-page">
      <div className="tours-header">
        <div className="container">
          <h1 className="tours-title">Explore Our Tours</h1>
          <p className="tours-subtitle">Discover amazing places at exclusive deals</p>
          
          <div className="mobile-filter-toggle" onClick={toggleMobileFilters}>
            <FaFilter /> Filter Tours
          </div>
        </div>
      </div>

      <div className="container">
        <div className="tours-content">
          <div className={`tours-sidebar ${mobileFiltersVisible ? 'mobile-visible' : ''}`}>
            <div className="filter-container">
              <div className="filter-header">
                <h3>Filter Tours</h3>
                <button className="close-filters" onClick={toggleMobileFilters}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="filter-group">
                <label htmlFor="destination">Destination</label>
                <select
                  id="destination"
                  name="destination"
                  value={filters.destination}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="">All Destinations</option>
                  <option value="asia">Asia</option>
                  <option value="europe">Europe</option>
                  {countries.map(country => (
                    <option key={country._id} value={country.name.toLowerCase()}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="duration">Duration</label>
                <select
                  id="duration"
                  name="duration"
                  value={filters.duration}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="">Any Duration</option>
                  <option value="1-3">1-3 Days</option>
                  <option value="4-7">4-7 Days</option>
                  <option value="8-14">8-14 Days</option>
                  <option value="15+">15+ Days</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="">Any Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="price">Price Range</label>
                <select
                  id="price"
                  name="price"
                  value={filters.price}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="">Any Price</option>
                  <option value="0-50000">NPR 0 - 50,000</option>
                  <option value="50000-100000">NPR 50,000 - 100,000</option>
                  <option value="100000-200000">NPR 100,000 - 200,000</option>
                  <option value="200000-500000">NPR 200,000 - 500,000</option>
                  <option value="500000+">NPR 500,000+</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="tours-main">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading tours...</p>
              </div>
            ) : (
              Object.keys(toursByCountry).length > 0 ? (
                <div className="tours-by-country">
                  {/* Show all tours if a filter is applied */}
                  {(filters.destination || filters.duration || filters.difficulty || filters.price) ? (
                    <div className="filtered-tours-section">
                      <div className="country-header">
                        <h2>Filtered Tours</h2>
                        <button className="reset-filters" onClick={resetFilters}>Reset Filters</button>
                      </div>
                      <div className="tours-grid">
                        {tours.map(tour => (
                          <div key={tour._id} className="tour-card">
                            <div className="tour-card-image">
                              <img src={tour.coverImage} alt={tour.title} />
                              <div className="tour-card-price">NPR {tour.price}</div>
                              {tour.destination?.country && (
                                <div className="tour-card-country">{tour.destination.country}</div>
                              )}
                            </div>
                            <div className="tour-card-content">
                              <h3 className="tour-card-title">{tour.title}</h3>
                              <div className="tour-card-info">
                                <div className="info-item">
                                  <FaMapMarkerAlt />
                                  <span>{tour.destination?.name}</span>
                                </div>
                                <div className="info-item">
                                  <FaCalendarAlt />
                                  <span>{tour.duration} days</span>
                                </div>
                              </div>
                              <p className="tour-card-text">
                                {tour.description?.substring(0, 100) || "Experience this amazing tour package"}...
                              </p>
                              <div className="tour-card-footer">
                                <div className="tour-card-rating">
                                  <FaStar />
                                  <span>{tour.ratingsAverage || 4.5} ({tour.ratingsQuantity || 0})</span>
                                </div>
                                <Link to={`/tours/${tour._id}`} className="btn btn-outline">View Details</Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Show tours grouped by country when no filters are applied
                    Object.entries(toursByCountry).map(([country, countryTours]) => (
                      <div key={country} className="country-tours-section">
                        <div className="country-header">
                          <h2>{country} Tours</h2>
                          <Link to={`/tours?destination=${country.toLowerCase()}`} className="view-all-link">
                            View All {country} Tours
                          </Link>
                        </div>
                        <div className="tours-grid">
                          {countryTours.slice(0, 4).map(tour => (
                            <div key={tour._id} className="tour-card">
                              <div className="tour-card-image">
                                <img src={tour.coverImage} alt={tour.title} />
                                <div className="tour-card-price">NPR {tour.price}</div>
                              </div>
                              <div className="tour-card-content">
                                <h3 className="tour-card-title">{tour.title}</h3>
                                <div className="tour-card-info">
                                  <div className="info-item">
                                    <FaMapMarkerAlt />
                                    <span>{tour.destination?.name}</span>
                                  </div>
                                  <div className="info-item">
                                    <FaCalendarAlt />
                                    <span>{tour.duration} days</span>
                                  </div>
                                  <div className="info-item">
                                    <FaUsers />
                                    <span>Max: {tour.maxGroupSize || 15} people</span>
                                  </div>
                                </div>
                                <p className="tour-card-text">
                                  {tour.description?.substring(0, 100) || "Experience this amazing tour package"}...
                                </p>
                                
                                {tour.highlights && tour.highlights.length > 0 && (
                                  <div className="tour-highlights">
                                    <h4>Highlights:</h4>
                                    <ul>
                                      {tour.highlights.slice(0, 2).map((highlight, index) => (
                                        <li key={index}>{highlight}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                <div className="tour-card-footer">
                                  <div className="tour-card-rating">
                                    <FaStar />
                                    <span>{tour.ratingsAverage || 4.5} ({tour.ratingsQuantity || 0})</span>
                                  </div>
                                  <Link to={`/tours/${tour._id}`} className="btn btn-outline">View Details</Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="no-tours">
                  <h3>No tours found</h3>
                  <p>Try adjusting your filters to find tours.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tours;
