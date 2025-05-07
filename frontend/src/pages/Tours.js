import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUsers, FaClock, FaGlobe, FaChevronDown, FaFilter, FaCog, FaList, FaGlobeAmericas, FaMapMarkedAlt, FaTh, FaStar, FaRegStar, FaHeart, FaRegHeart, FaBolt, FaCalendarAlt, FaMapMarkerAlt, FaChevronRight, FaFire } from 'react-icons/fa';
import { fetchAllTours } from '../services/tourService';
import RegionalToursList from '../components/RegionalToursList';
import './Tours.css';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [regionalTours, setRegionalTours] = useState({ regions: {}, countries: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('');  
  const [travelWith, setTravelWith] = useState('');  
  const [showTravelOptions, setShowTravelOptions] = useState(false);
  const [showCountryOptions, setShowCountryOptions] = useState(true);
  const [showDurationOptions, setShowDurationOptions] = useState(false);
  const [duration, setDuration] = useState('');
  const [countries, setCountries] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // Only grid view is now available
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 9; // 3 rows of 3 cards
  
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    
    return stars;
  };
  
  // Format duration as "X Days Y Nights"
  const formatDuration = (days) => {
    if (!days || isNaN(days)) return '? Days ? Nights';
    return `${days} Days ${days - 1} Nights`;
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch tours...');
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Fallback to localhost:5000
        console.log('API URL:', apiUrl);
        
        // Fetch tours organized by region and country
        console.log('Fetching regional tours data...');
        const regionalToursData = await fetchAllTours();
        console.log('Regional tours data received:', regionalToursData);
        setRegionalTours(regionalToursData);
        setCountries(regionalToursData.countries);
        
        // First try to fetch tours from the Tour Management endpoint for the grid view
        try {
          // Try to fetch from the Tour Management API
          console.log('Trying to fetch from Tour Management API...');
          const managementResponse = await fetch(`${apiUrl}/api/tours/all`);
          const managementData = await managementResponse.json();
          console.log('Tour Management API Response:', managementData);
          
          // Process management tours data
          let managementTours = [];
          if (managementData.tours) {
            managementTours = managementData.tours;
            console.log('Found tours in managementData.tours:', managementTours.length);
          } else if (Array.isArray(managementData)) {
            managementTours = managementData;
            console.log('Found tours in array:', managementTours.length);
          } else if (managementData.data && managementData.data.tours) {
            managementTours = managementData.data.tours;
            console.log('Found tours in managementData.data.tours:', managementTours.length);
          }
          
          if (managementTours.length > 0) {
            console.log('Successfully fetched tours from Tour Management:', managementTours);
            setTours(managementTours);
            setLoading(false);
            return; // Exit if we successfully got tours from management
          } else {
            console.log('Tour Management returned empty tours array');
          }
        } catch (managementError) {
          console.log('Could not fetch tours from Tour Management:', managementError);
        }
        
        // If management tours failed, try other possible endpoints
        try {
          console.log('Trying regular API endpoint...');
          const response = await fetch(`${apiUrl}/api/tours`);
          const data = await response.json();
          console.log('Regular API Response:', data);
          
          // Handle different possible response structures
          let toursData;
          if (data.data && data.data.tours) {
            toursData = data.data.tours;
            console.log('Found tours in data.data.tours:', toursData.length);
          } else if (Array.isArray(data)) {
            toursData = data;
            console.log('Found tours in array:', toursData.length);
          } else if (data.tours) {
            toursData = data.tours;
            console.log('Found tours in data.tours:', toursData.length);
          } else {
            toursData = [];
            console.error('Unexpected API response structure:', data);
          }
          
          console.log('Setting tours from regular API:', toursData);
          setTours(toursData);
        } catch (regularApiError) {
          console.log('Regular API failed, trying fallback endpoint');
          try {
            console.log('Trying fallback endpoint...');
            const response = await fetch(`${apiUrl}/tours`);
            const fallbackData = await response.json();
            console.log('Fallback API Response:', fallbackData);
            
            // Handle different possible response structures
            let toursData;
            if (fallbackData.data && fallbackData.data.tours) {
              toursData = fallbackData.data.tours;
              console.log('Found tours in fallbackData.data.tours:', toursData.length);
            } else if (Array.isArray(fallbackData)) {
              toursData = fallbackData;
              console.log('Found tours in array:', toursData.length);
            } else if (fallbackData.tours) {
              toursData = fallbackData.tours;
              console.log('Found tours in fallbackData.tours:', toursData.length);
            } else {
              toursData = [];
              console.error('Unexpected API response structure:', fallbackData);
            }
            
            console.log('Setting tours from fallback API:', toursData);
            setTours(toursData);
          } catch (fallbackError) {
            console.log('All API endpoints failed:', fallbackError);
            
            // If all API calls fail, use the tours from regionalTours
            console.log('Using tours from regionalTours as fallback');
            const allTours = getAllTours();
            setTours(allTours);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setLoading(false);
        
        // If all else fails, use the tours from regionalTours
        console.log('Using tours from regionalTours due to error');
        const allTours = getAllTours();
        setTours(allTours);
      }
    };
    
    fetchTours();
  }, []);

  // Add a direct API check when the component mounts
  useEffect(() => {
    // Function to check API connectivity
    const checkApiConnection = async () => {
      try {
        console.log('Checking API connection...');
        // Try to determine the API URL
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        console.log('Using API URL:', apiUrl);
        
        // Try each possible endpoint
        const endpoints = [
          `${apiUrl}/api/tours/all`,
          `${apiUrl}/api/tours`,
          `${apiUrl}/tours`
        ];
        
        for (const endpoint of endpoints) {
          try {
            console.log(`Testing endpoint: ${endpoint}`);
            const response = await fetch(endpoint);
            const data = await response.json();
            console.log(`Response from ${endpoint}:`, data);
            
            if (data) {
              console.log(`Successfully connected to ${endpoint}`);
              // If we get here, we have a successful connection
              return;
            }
          } catch (error) {
            console.log(`Failed to connect to ${endpoint}:`, error);
          }
        }
        
        console.log('Could not connect to any API endpoint. Using sample data instead.');
      } catch (error) {
        console.error('API connection check failed:', error);
      }
    };
    
    // Run the API check
    checkApiConnection();
  }, []);

  // Get all tours from regional data
  const getAllTours = () => {
    const allTours = [];
    
    if (regionalTours && regionalTours.regions) {
      Object.keys(regionalTours.regions).forEach(regionKey => {
        const region = regionalTours.regions[regionKey];
        
        Object.keys(region.countries).forEach(countryName => {
          const countryTours = region.countries[countryName] || [];
          
          countryTours.forEach(tour => {
            if (tour) {
              // Add region and country info to the tour object
              allTours.push({
                ...tour,
                regionKey,
                countryName
              });
            }
          });
        });
      });
    }
    
    return allTours;
  };
  
  // Filter tours based on selected filters
  const filteredTours = tours.filter(tour => {
    // Filter by search term
    const matchesSearch = 
      (tour.name && tour.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (tour.summary && tour.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tour.description && tour.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by country
    let tourCountry = '';
    if (tour.startLocation && tour.startLocation.description) {
      tourCountry = tour.startLocation.description.split(',')[0].trim();
    } else if (tour.country) {
      tourCountry = tour.country;
    } else if (tour.location) {
      tourCountry = typeof tour.location === 'string' ? 
        tour.location.split(',')[0].trim() : 
        tour.location.description ? tour.location.description.split(',')[0].trim() : '';
    }
    
    const matchesCountry = country === '' || tourCountry === country;
    
    // Filter by travel with
    const matchesTravelWith = travelWith === '' || tour.travelWith === travelWith;
    
    // Tour Type filter removed
    const matchesTourType = true;
    
    // Filter by duration
    let matchesDuration = true;
    if (tour.duration) {
      if (duration === '1-3') {
        matchesDuration = tour.duration >= 1 && tour.duration <= 3;
      } else if (duration === '4-7') {
        matchesDuration = tour.duration >= 4 && tour.duration <= 7;
      } else if (duration === '8-14') {
        matchesDuration = tour.duration >= 8 && tour.duration <= 14;
      } else if (duration === '15+') {
        matchesDuration = tour.duration >= 15;
      }
    }
    
    return matchesSearch && matchesCountry && matchesTravelWith && matchesTourType && matchesDuration;
  });
  
  // Get all tours from regional data and apply filters
  const filteredAllTours = getAllTours().filter(tour => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      (tour.name && tour.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (tour.title && tour.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tour.summary && tour.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tour.description && tour.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by country
    const matchesCountry = country === '' || tour.countryName === country;
    
    // Filter by travel with
    const matchesTravelWith = travelWith === '' || tour.travelWith === travelWith;
    
    // Filter by duration
    let matchesDuration = true;
    if (duration !== '' && tour.duration) {
      if (duration === '1-3') {
        matchesDuration = tour.duration >= 1 && tour.duration <= 3;
      } else if (duration === '4-7') {
        matchesDuration = tour.duration >= 4 && tour.duration <= 7;
      } else if (duration === '8-14') {
        matchesDuration = tour.duration >= 8 && tour.duration <= 14;
      } else if (duration === '15+') {
        matchesDuration = tour.duration >= 15;
      }
    }
    
    return matchesSearch && matchesCountry && matchesTravelWith && matchesDuration;
  });
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCountry('');
    setTravelWith('');
    setDuration('');
  };

  // Filter regional tours based on search term
  const filteredRegionalTours = {
    regions: { ...regionalTours.regions },
    countries: regionalTours.countries
  };

  if (searchTerm || country || travelWith || duration) {
    // Apply filters to regional tours
    Object.keys(filteredRegionalTours.regions).forEach(regionKey => {
      const region = filteredRegionalTours.regions[regionKey];
      
      Object.keys(region.countries).forEach(countryName => {
        // Filter tours for this country
        region.countries[countryName] = region.countries[countryName].filter(tour => {
          // Filter by search term
          const matchesSearch = searchTerm === '' || 
            (tour.name && tour.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (tour.title && tour.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tour.summary && tour.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tour.description && tour.description.toLowerCase().includes(searchTerm.toLowerCase()));
          
          // Filter by country
          const matchesCountry = country === '' || countryName === country;
          
          // Filter by travel with
          const matchesTravelWith = travelWith === '' || tour.travelWith === travelWith;
          
          // Filter by duration
          let matchesDuration = true;
          if (duration !== '' && tour.duration) {
            if (duration === '1-3') {
              matchesDuration = tour.duration >= 1 && tour.duration <= 3;
            } else if (duration === '4-7') {
              matchesDuration = tour.duration >= 4 && tour.duration <= 7;
            } else if (duration === '8-14') {
              matchesDuration = tour.duration >= 8 && tour.duration <= 14;
            } else if (duration === '15+') {
              matchesDuration = tour.duration >= 15;
            }
          }
          
          return matchesSearch && matchesCountry && matchesTravelWith && matchesDuration;
        });
      });
    });
  }

  return (
    <div className="tours-page">
      <div className="tours-header">
        <h1 className="tours-title">Explore Our Tours</h1>
      </div>
      
      <div className="tours-container">
        <div className="filters-wrapper">
          {/* Filter Header */}
          <div className="filter-title">
            <span className="filter-title-icon"></span>
            <h3>Filter</h3>
          </div>
          
          {/* Search Section */}
          <div className="search-box">
            <FaSearch className="search-icon" />
            <span className="filter-label">Search</span>
            <input 
              type="text" 
              placeholder="Enter any keyword" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Countries Filter */}
          <div className="filter-item">
            <div className="filter-header" onClick={() => setShowCountryOptions(!showCountryOptions)}>
              <FaGlobe className="filter-icon" />
              <span className="filter-label">Countries</span>
              <FaChevronDown className={`dropdown-arrow ${showCountryOptions ? 'open' : ''}`} />
            </div>
            {showCountryOptions && (
              <div className="filter-dropdown">
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="country-all" 
                    name="country" 
                    value="" 
                    checked={country === ''}
                    onChange={() => setCountry('')} 
                  />
                  <label htmlFor="country-all">All Countries</label>
                </div>
                {countries.map(countryName => (
                  <div className="radio-option" key={countryName}>
                    <input 
                      type="radio" 
                      id={`country-${countryName}`} 
                      name="country" 
                      value={countryName} 
                      checked={country === countryName}
                      onChange={() => setCountry(countryName)} 
                    />
                    <label htmlFor={`country-${countryName}`}>{countryName}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Travel With Filter */}
          <div className="filter-item">
            <div className="filter-header" onClick={() => setShowTravelOptions(!showTravelOptions)}>
              <FaUsers className="filter-icon" />
              <span className="filter-label">Travel With</span>
              <FaChevronDown className={`dropdown-arrow ${showTravelOptions ? 'open' : ''}`} />
            </div>
            
            {/* Travel With Options */}
            {showTravelOptions && (
              <div className="filter-dropdown">
                <div className="travel-options-grid">
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="travel-couple" 
                      name="travelWith" 
                      value="couple" 
                      checked={travelWith === 'couple'}
                      onChange={() => setTravelWith('couple')} 
                    />
                    <label htmlFor="travel-couple">Couple</label>
                  </div>
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="travel-family" 
                      name="travelWith" 
                      value="family" 
                      checked={travelWith === 'family'}
                      onChange={() => setTravelWith('family')} 
                    />
                    <label htmlFor="travel-family">Family</label>
                  </div>
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="travel-friends" 
                      name="travelWith" 
                      value="friends" 
                      checked={travelWith === 'friends'}
                      onChange={() => setTravelWith('friends')} 
                    />
                    <label htmlFor="travel-friends">Friends</label>
                  </div>
                  <div className="radio-option">
                    <input 
                      type="radio" 
                      id="travel-single" 
                      name="travelWith" 
                      value="solo" 
                      checked={travelWith === 'solo'}
                      onChange={() => setTravelWith('solo')} 
                    />
                    <label htmlFor="travel-single">Single</label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Duration Filter */}
          <div className="filter-item">
            <div className="filter-header" onClick={() => setShowDurationOptions(!showDurationOptions)}>
              <FaClock className="filter-icon" />
              <span className="filter-label">Duration (Days)</span>
              <FaChevronDown className={`dropdown-arrow ${showDurationOptions ? 'open' : ''}`} />
            </div>
            {showDurationOptions && (
              <div className="filter-dropdown">
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="duration-all" 
                    name="duration" 
                    value="" 
                    checked={duration === ''}
                    onChange={() => setDuration('')} 
                  />
                  <label htmlFor="duration-all">All</label>
                </div>
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="duration-1-3" 
                    name="duration" 
                    value="1-3" 
                    checked={duration === '1-3'}
                    onChange={() => setDuration('1-3')} 
                  />
                  <label htmlFor="duration-1-3">1-3 Days</label>
                </div>
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="duration-4-7" 
                    name="duration" 
                    value="4-7" 
                    checked={duration === '4-7'}
                    onChange={() => setDuration('4-7')} 
                  />
                  <label htmlFor="duration-4-7">4-7 Days</label>
                </div>
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="duration-8-14" 
                    name="duration" 
                    value="8-14" 
                    checked={duration === '8-14'}
                    onChange={() => setDuration('8-14')} 
                  />
                  <label htmlFor="duration-8-14">8-14 Days</label>
                </div>
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="duration-15+" 
                    name="duration" 
                    value="15+" 
                    checked={duration === '15+'}
                    onChange={() => setDuration('15+')} 
                  />
                  <label htmlFor="duration-15+">15+ Days</label>
                </div>
              </div>
            )}
          </div>
          
          <button className="reset-filters-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
        
        {/* Tours Content */}
        <div className="tours-content">
          {loading ? (
            <div className="loading">Loading tours...</div>
          ) : (
            <>
              {/* Grid View - All tours without any categorization */}
              {filteredAllTours.length > 0 ? (
                <>
                  <div className="tours-grid-view">
                    {filteredAllTours
                      .slice((currentPage - 1) * toursPerPage, currentPage * toursPerPage)
                      .map(tour => {
                      const tourId = tour._id || tour.id;
                      const tourName = tour.name || tour.title;
                      const tourSummary = tour.summary || tour.description || 'No description available';
                      const tourImage = tour.imageCover || tour.coverImage || tour.image || 'https://via.placeholder.com/304.39x189';
                      const tourDuration = tour.duration || '?';
                      const tourPrice = tour.price || '?';
                      const tourRating = tour.ratingsAverage || 4.5;
                      const tourReviews = tour.ratingsQuantity || Math.floor(Math.random() * 30) + 5;
                      const countryName = tour.countryName || tour.country || 'Unknown';
                      // Check for different badge types
                      const isHottest = tour.hottestTour === true;
                      const isPopular = tour.popularTour === true;
                      const isFeatured = tour.featured === true;
                      
                      // For debugging
                      if (tour.hottestTour || tour.popularTour || tour.featured) {
                        console.log(`Tour ${tourName} badge status:`, {
                          hottestTour: tour.hottestTour,
                          popularTour: tour.popularTour,
                          featured: tour.featured,
                          tourId: tourId
                        });
                      }
                      
                      // Generate the tour URL based on region and country
                      const tourUrl = `/countries/${tour.regionKey}/${countryName.toLowerCase().replace(/\s+/g, '-')}/tour/${tourId}`;
                      
                      return (
                        <Link to={tourUrl} key={tourId} className="tour-card">
                          {/* Display appropriate badge based on tour properties */}
                          {isHottest && (
                            <div className="tour-popular-badge hottest-badge">
                              <FaFire /> Hottest Tour
                            </div>
                          )}
                          {isPopular && !isHottest && (
                            <div className="tour-popular-badge popular-badge">
                              <FaBolt /> Most Popular
                            </div>
                          )}
                          {isFeatured && !isHottest && !isPopular && (
                            <div className="tour-popular-badge featured-badge">
                              <FaStar /> Featured Tour
                            </div>
                          )}
                          <div className="tour-image">
                            <img 
                              src={tourImage} 
                              alt={tourName} 
                              style={{ width: '304.39px', height: '189px', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="tour-info">
                            <div className="tour-rating">
                              <div className="tour-rating-stars">
                                {renderStars(tourRating)}
                              </div>
                              <span className="tour-rating-count">({tourReviews})</span>
                            </div>
                            <h3 className="tour-name">{tourName}</h3>
                            <div className="tour-location">
                              <FaMapMarkerAlt />
                              <span>{countryName}</span>
                            </div>
                            <div className="tour-duration-info">
                              <FaCalendarAlt />
                              <span>{formatDuration(tourDuration)}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  
                  {/* Pagination */}
                  {filteredAllTours.length > toursPerPage && (
                    <div className="pagination-container">
                      <ul className="pagination">
                        {Array.from({ length: Math.ceil(filteredAllTours.length / toursPerPage) }).map((_, index) => (
                          <li key={index} className="pagination-item">
                            <button 
                              className={`pagination-link ${currentPage === index + 1 ? 'active' : ''}`}
                              onClick={() => {
                                setCurrentPage(index + 1);
                                window.scrollTo(0, 0);
                              }}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        {currentPage < Math.ceil(filteredAllTours.length / toursPerPage) && (
                          <li className="pagination-item">
                            <button 
                              className="pagination-next"
                              onClick={() => {
                                setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAllTours.length / toursPerPage)));
                                window.scrollTo(0, 0);
                              }}
                            >
                              Next <FaChevronRight />
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-tours">No tours found matching your criteria. Try adjusting your filters.</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tours;
