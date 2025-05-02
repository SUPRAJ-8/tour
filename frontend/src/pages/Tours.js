import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaUsers, FaClock, FaGlobe, FaChevronDown, FaFilter, FaCog, FaLock } from 'react-icons/fa';
import './Tours.css';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('');  
  const [travelWith, setTravelWith] = useState('');  
  const [showTravelOptions, setShowTravelOptions] = useState(false);
  const [showCountryOptions, setShowCountryOptions] = useState(true);
  const [showDurationOptions, setShowDurationOptions] = useState(false);
  const [duration, setDuration] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        
        // First try to fetch tours from the Tour Management endpoint
        try {
          // Try all possible API endpoints to find tours
          const managementResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/tours/all`);
          console.log('Tour Management API Response:', managementResponse.data);
          
          // Process management tours data
          let managementTours = [];
          if (managementResponse.data.tours) {
            managementTours = managementResponse.data.tours;
          } else if (Array.isArray(managementResponse.data)) {
            managementTours = managementResponse.data;
          } else if (managementResponse.data.data && managementResponse.data.data.tours) {
            managementTours = managementResponse.data.data.tours;
          }
          
          if (managementTours.length > 0) {
            console.log('Successfully fetched tours from Tour Management');
            setTours(managementTours);
            
            // Extract countries from management tours
            const uniqueCountries = [...new Set(managementTours.map(tour => {
              return tour.country || (tour.startLocation ? tour.startLocation.description.split(',')[0].trim() : 'Other');
            }))];
            
            setCountries(uniqueCountries.sort());
            setLoading(false);
            return; // Exit if we successfully got tours from management
          }
        } catch (managementError) {
          console.log('Could not fetch tours from Tour Management:', managementError);
          // Continue with regular API endpoint
        }
        
        // If management tours failed, try other possible endpoints
        let response;
        try {
          response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tours`);
          console.log('Regular API Response:', response.data);
        } catch (regularApiError) {
          console.log('Regular API failed, trying fallback endpoint');
          try {
            response = await axios.get(`${process.env.REACT_APP_API_URL}/tours`);
            console.log('Fallback API Response:', response.data);
          } catch (fallbackError) {
            console.log('All API endpoints failed');
            throw new Error('Could not fetch tours from any endpoint');
          }
        }
        
        // Handle different possible response structures
        let toursData;
        if (response.data.data && response.data.data.tours) {
          toursData = response.data.data.tours;
        } else if (Array.isArray(response.data)) {
          toursData = response.data;
        } else if (response.data.tours) {
          toursData = response.data.tours;
        } else {
          toursData = [];
          console.error('Unexpected API response structure:', response.data);
        }
        
        // If still no tours found, add some default tours for testing
        if (toursData.length === 0) {
          console.log('No tours found in any API response, adding default tours');
          toursData = [
            {
              _id: '1',
              name: 'Beautiful Thailand Tour',
              summary: 'Explore the beautiful beaches and temples of Thailand',
              description: 'A 7-day tour of Thailand\'s most beautiful locations',
              duration: 7,
              price: 1299,
              imageCover: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              country: 'Thailand',
              ratingsAverage: 4.7,
              ratingsQuantity: 23
            },
            {
              _id: '2',
              name: 'Japan Cherry Blossom Tour',
              summary: 'Experience the beauty of Japan during cherry blossom season',
              description: 'A 10-day tour of Japan during the cherry blossom season',
              duration: 10,
              price: 2499,
              imageCover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              country: 'Japan',
              ratingsAverage: 4.9,
              ratingsQuantity: 47
            },
            {
              _id: '3',
              name: 'Vietnam Heritage Tour',
              summary: 'Discover the rich heritage and culture of Vietnam',
              description: 'A 9-day tour of Vietnam\'s most important cultural sites',
              duration: 9,
              price: 1799,
              imageCover: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              country: 'Vietnam',
              ratingsAverage: 4.5,
              ratingsQuantity: 31
            },
            {
              _id: '4',
              name: 'Bali Paradise Tour',
              summary: 'Relax in the paradise island of Bali',
              description: 'A 5-day relaxing tour of Bali\'s most beautiful beaches and temples',
              duration: 5,
              price: 999,
              imageCover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
              country: 'Indonesia',
              ratingsAverage: 4.8,
              ratingsQuantity: 28
            }
          ];
        }
        
        // Debug log tours data
        console.log('Final tours data:', toursData);
        
        setTours(toursData);
        
        // Extract unique countries from tours
        // Fallback to different possible structures
        const uniqueCountries = [];
        toursData.forEach(tour => {
          let country = '';
          
          // Try different possible structures to extract country
          if (tour.startLocation && tour.startLocation.description) {
            country = tour.startLocation.description.split(',')[0].trim();
          } else if (tour.country) {
            country = tour.country;
          } else if (tour.location) {
            country = typeof tour.location === 'string' ? 
              tour.location.split(',')[0].trim() : 
              tour.location.description ? tour.location.description.split(',')[0].trim() : '';
          }
          
          if (country && !uniqueCountries.includes(country)) {
            uniqueCountries.push(country);
          }
        });
        
        // Log the countries found in the database
        console.log('Countries found in database:', uniqueCountries);
        
        // If no countries were found, add some defaults
        if (uniqueCountries.length === 0) {
          const defaultCountries = [
            'Thailand', 'Japan', 'Vietnam', 'Indonesia', 'Malaysia', 'Singapore', 'Philippines',
            'China', 'South Korea', 'India', 'Nepal', 'Bhutan', 'Sri Lanka', 'Maldives',
            'Australia', 'New Zealand', 'United States', 'Canada', 'Mexico',
            'Brazil', 'Argentina', 'Peru', 'Chile', 
            'United Kingdom', 'France', 'Italy', 'Spain', 'Germany', 'Greece',
            'Egypt', 'Morocco', 'South Africa', 'Kenya', 'Tanzania'
          ];
          uniqueCountries.push(...defaultCountries);
        }
        
        // Remove duplicates and sort
        const uniqueSortedCountries = [...new Set(uniqueCountries)].sort();
        console.log('All available countries:', uniqueSortedCountries);
        
        setCountries(uniqueSortedCountries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setLoading(false);
        
        // In case of error, still show default countries
        const defaultCountries = [
          'Thailand', 'Japan', 'Vietnam', 'Indonesia', 'Malaysia', 'Singapore', 'Philippines',
          'China', 'South Korea', 'India', 'Nepal', 'Bhutan', 'Sri Lanka', 'Maldives',
          'Australia', 'New Zealand', 'United States', 'Canada', 'Mexico',
          'Brazil', 'Argentina', 'Peru', 'Chile', 
          'United Kingdom', 'France', 'Italy', 'Spain', 'Germany', 'Greece',
          'Egypt', 'Morocco', 'South Africa', 'Kenya', 'Tanzania'
        ];
        
        setCountries(defaultCountries.sort());
      }
    };
    
    fetchTours();
  }, []);
  
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
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCountry('');
    setTravelWith('');
    setDuration('');
  };

  return (
    <div className="tours-page">
      <div className="tours-header">
        <h1 className="tours-title">Explore Our Tours</h1>
        <Link to="/admin/tour-management" className="admin-link">
          <FaCog className="admin-icon" />
          <span>Tour Management</span>
        </Link>
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
          
          {/* Tour Type filter removed as requested */}
          
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
          ) : filteredTours.length > 0 ? (
            <div>
              {/* Group tours by country */}
              {(() => {
                // Get unique countries from filtered tours
                const tourCountries = [];
                const toursByCountry = {};
                
                // Group tours by country
                filteredTours.forEach(tour => {
                  let country = '';
                  
                  // Extract country from tour data - prioritize the direct country field
                  if (tour.country) {
                    country = tour.country;
                  } else if (tour.startLocation && tour.startLocation.description) {
                    country = tour.startLocation.description.split(',')[0].trim();
                  } else if (tour.location) {
                    country = typeof tour.location === 'string' ? 
                      tour.location.split(',')[0].trim() : 
                      tour.location.description ? tour.location.description.split(',')[0].trim() : 'Other';
                  } else {
                    country = 'Other';
                  }
                  
                  console.log(`Tour: ${tour.name}, Country: ${country}`);
                  
                  // Add country to list if not already there
                  if (!tourCountries.includes(country)) {
                    tourCountries.push(country);
                  }
                  
                  // Add tour to country group
                  if (!toursByCountry[country]) {
                    toursByCountry[country] = [];
                  }
                  toursByCountry[country].push(tour);
                });
                
                // Sort countries alphabetically
                tourCountries.sort();
                
                // Return JSX for each country group
                return tourCountries.map(country => (
                  <div key={country} className="country-tour-section">
                    <h2 className="country-heading">
                      <FaGlobe className="country-icon" /> {country}
                    </h2>
                    <div className="tours-grid">
                      {toursByCountry[country].map(tour => (
                        <Link to={`/tour/${tour._id || tour.id}`} key={tour._id || tour.id} className="tour-card">
                          <div className="tour-image">
                            <img src={tour.imageCover || tour.image || 'https://via.placeholder.com/300x200'} alt={tour.name} />
                            <div className="tour-duration">{tour.duration || '?'} days</div>
                          </div>
                          <div className="tour-info">
                            <h3 className="tour-name">{tour.name}</h3>
                            <p className="tour-summary">{tour.summary || tour.description || 'No description available'}</p>
                            <div className="tour-details">
                              <span className="tour-price">${tour.price || '?'}</span>
                              <span className="tour-rating">★ {tour.ratingsAverage || '5.0'} ({tour.ratingsQuantity || '0'})</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ));
              })()} 
            </div>
          ) : (
            <div className="no-tours">No tours found matching your criteria. Try adjusting your filters.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tours;
