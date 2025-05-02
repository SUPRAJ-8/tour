import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { getTourUrl } from '../services/tourService';
import './RegionalToursList.css';

const RegionalToursList = ({ toursData, loading, viewMode }) => {
  if (loading) {
    return <div className="loading">Loading tours...</div>;
  }

  if (!toursData || !toursData.regions) {
    return <div className="no-tours">No tours available. Please try again later.</div>;
  }

  // For the simplified view (all countries without regions)
  if (viewMode === 'countries') {
    // Collect all tours from all regions and countries
    const allCountries = {};
    
    // Process each region
    Object.keys(toursData.regions).forEach(regionKey => {
      const region = toursData.regions[regionKey];
      
      // Process each country in this region
      Object.keys(region.countries).forEach(countryName => {
        if (!allCountries[countryName]) {
          allCountries[countryName] = {
            tours: [],
            region: regionKey
          };
        }
        
        // Add tours from this country to the collection
        allCountries[countryName].tours = [
          ...allCountries[countryName].tours,
          ...region.countries[countryName]
        ];
      });
    });
    
    // Check if there are any countries with tours
    const countryNames = Object.keys(allCountries);
    if (countryNames.length === 0) {
      return <div className="no-tours">No tours found matching your criteria. Try adjusting your filters.</div>;
    }
    
    // Sort country names alphabetically
    countryNames.sort();
    
    return (
      <div className="all-countries-container">
        {countryNames.map(countryName => {
          const countryData = allCountries[countryName];
          const tours = countryData.tours;
          
          // Skip countries with no tours
          if (tours.length === 0) {
            return null;
          }
          
          return (
            <div key={countryName} className="country-section">
              <h3 className="country-heading">
                <FaMapMarkerAlt className="country-icon" /> {countryName}
              </h3>
              
              <div className="tours-grid">
                {tours.map(tour => {
                  if (!tour) return null;
                  
                  const tourId = tour._id || tour.id;
                  const tourName = tour.name || tour.title;
                  const tourSummary = tour.summary || tour.description || 'No description available';
                  const tourImage = tour.imageCover || tour.coverImage || tour.image || 'https://via.placeholder.com/300x200';
                  const tourDuration = tour.duration || '?';
                  const tourPrice = tour.price || '?';
                  const tourRating = tour.ratingsAverage || '5.0';
                  const tourReviews = tour.ratingsQuantity || '0';
                  
                  // Generate the tour URL based on region and country
                  const tourUrl = getTourUrl(countryData.region, countryName, tourId);
                  
                  return (
                    <Link to={tourUrl} key={tourId} className="tour-card">
                      <div className="tour-image">
                        <img src={tourImage} alt={tourName} />
                        <div className="tour-duration">{tourDuration} days</div>
                        <div className="tour-country">{countryName}</div>
                      </div>
                      <div className="tour-info">
                        <h3 className="tour-name">{tourName}</h3>
                        <p className="tour-summary">{tourSummary.length > 100 ? `${tourSummary.substring(0, 100)}...` : tourSummary}</p>
                        <div className="tour-details">
                          <span className="tour-price">${tourPrice}</span>
                          <span className="tour-rating">★ {tourRating} ({tourReviews})</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Original regional view code
  const { regions } = toursData;
  const regionKeys = Object.keys(regions);

  if (regionKeys.length === 0) {
    return <div className="no-tours">No tours found in any region.</div>;
  }

  // Check if there are any tours in any region
  let hasTours = false;
  Object.keys(regions).forEach(regionKey => {
    const region = regions[regionKey];
    Object.keys(region.countries).forEach(countryKey => {
      if (region.countries[countryKey] && region.countries[countryKey].length > 0) {
        hasTours = true;
      }
    });
  });

  if (!hasTours) {
    return <div className="no-tours">No tours found matching your criteria. Try adjusting your filters.</div>;
  }

  return (
    <div className="regional-tours-container">
      {regionKeys.map(regionKey => {
        const region = regions[regionKey];
        const countryKeys = Object.keys(region.countries);
        
        // Skip empty regions
        if (countryKeys.length === 0) {
          return null;
        }
        
        // Check if this region has any tours after filtering
        let regionHasTours = false;
        countryKeys.forEach(country => {
          if (region.countries[country] && region.countries[country].length > 0) {
            regionHasTours = true;
          }
        });
        
        if (!regionHasTours) {
          return null;
        }
        
        return (
          <div key={regionKey} className="region-section">
            <h2 className="region-heading">
              <FaGlobe className="region-icon" /> {region.name}
            </h2>
            
            {countryKeys.map(countryName => {
              const tours = region.countries[countryName] || [];
              
              // Skip countries with no tours
              if (tours.length === 0) {
                return null;
              }
              
              return (
                <div key={countryName} className="country-section">
                  <h3 className="country-heading">
                    <FaMapMarkerAlt className="country-icon" /> {countryName}
                  </h3>
                  
                  <div className="tours-grid">
                    {tours.map(tour => {
                      if (!tour) return null;
                      
                      const tourId = tour._id || tour.id;
                      const tourName = tour.name || tour.title;
                      const tourSummary = tour.summary || tour.description || 'No description available';
                      const tourImage = tour.imageCover || tour.coverImage || tour.image || 'https://via.placeholder.com/300x200';
                      const tourDuration = tour.duration || '?';
                      const tourPrice = tour.price || '?';
                      const tourRating = tour.ratingsAverage || '5.0';
                      const tourReviews = tour.ratingsQuantity || '0';
                      
                      // Generate the tour URL based on region and country
                      const tourUrl = getTourUrl(regionKey, countryName, tourId);
                      
                      return (
                        <Link to={tourUrl} key={tourId} className="tour-card">
                          <div className="tour-image">
                            <img src={tourImage} alt={tourName} />
                            <div className="tour-duration">{tourDuration} days</div>
                            <div className="tour-country">{countryName}</div>
                          </div>
                          <div className="tour-info">
                            <h3 className="tour-name">{tourName}</h3>
                            <p className="tour-summary">{tourSummary.length > 100 ? `${tourSummary.substring(0, 100)}...` : tourSummary}</p>
                            <div className="tour-details">
                              <span className="tour-price">${tourPrice}</span>
                              <span className="tour-rating">★ {tourRating} ({tourReviews})</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default RegionalToursList;
