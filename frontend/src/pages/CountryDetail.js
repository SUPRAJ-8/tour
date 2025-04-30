import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CountryDetail.css';

// Static tour images
const tourImages = [
  'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1540329957110-b87f1f53f2a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1516496636080-14fb876e029d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
];

const CountryDetail = ({ category }) => {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState(null);
  const [tourPackages, setTourPackages] = useState([]);
  const [timestamp, setTimestamp] = useState(new Date().getTime());

  // Function to force a complete data refresh
  const forceRefresh = useCallback(async () => {
    setLoading(true);
    setTimestamp(new Date().getTime());
    try {
      // Directly fetch from the API with cache busting
      const response = await axios.get(`/api/countries/name/${countryId}?_=${Date.now()}`);
      setCountry(response.data);
      console.log('Forced refresh completed, new data:', response.data);
    } catch (error) {
      console.error('Error during forced refresh:', error);
    } finally {
      setLoading(false);
    }
  }, [countryId]);
  
  // Set up a one-time refresh when component mounts
  useEffect(() => {
    // Force a refresh when the component mounts
    forceRefresh();
  }, [forceRefresh]);

  // This effect handles generating tour packages once we have country data
  useEffect(() => {
    // Skip if we don't have country data yet
    if (!country) return;
    
    // Generate tour packages based on country
    const generateTourPackages = () => {
      const durations = ['5 Days 4 Nights', '6 Days 5 Nights', '8 Days 7 Nights', '9 Days 8 Nights'];
      const attractions = country.popularDestinations || ['City Tour', 'Beach Tour', 'Mountain Tour', 'Cultural Tour'];
      const tourPackagesData = [];
      
      // Create 4 tour packages for the country
      for (let i = 0; i < 4; i++) {
        const duration = durations[i % durations.length];
        const days = parseInt(duration.split(' ')[0]);
        const nights = parseInt(duration.split(' ')[3]);
        
        // Create tour title based on country and attractions
        let title;
        if (i === 0) {
          title = `${nights}N/${days}D ${country.name} Complete Tour`;
        } else if (attractions.length >= 3 && i < 3) {
          // Use actual attractions if available
          const usedAttractions = attractions.slice(0, Math.min(3, attractions.length));
          title = `${nights}N/${days}D ${usedAttractions.join('-')} Tour`;
        } else {
          title = `${nights}N/${days}D ${country.name} Explorer Tour`;
        }
        
        // Create a unique image URL for each tour
        const imageIndex = i % tourImages.length;
        
        tourPackagesData.push({
          id: `tour${i + 1}`,
          title: title,
          image: tourImages[imageIndex],
          rating: 4.5 + (Math.random() * 0.5).toFixed(1), // Random rating between 4.5 and 5.0
          reviewCount: Math.floor(Math.random() * 50) + 5, // Random review count between 5 and 55
          location: country.name,
          duration: duration,
          tag: i === 0 ? 'Hottest Tour' : 'Most Popular'
        });
      }
      
      setTourPackages(tourPackagesData);
    };
    
    generateTourPackages();
  }, [country]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading country information...</p>
      </div>
    );
  }

  return (
    <div className="country-detail-container">
      {/* Hero Section */}
      <div 
        className="country-hero" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${country.heroImage || country.image}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'high-quality'
        }}
      >
        <div className="hero-overlay">
          <h1>{country.name}</h1>
          <p>{country.description}</p>
          <img 
            src={country.flagImage} 
            alt={`${country.name} flag`} 
            className="country-flag" 
            onError={(e) => {
              console.error('Flag image failed to load');
              e.target.style.display = 'none';
            }}
          />
          <Link to={`/countries/${category}`} className="back-button">
            &larr; Back to {category === 'asia' ? 'Asian' : 'European'} Countries
          </Link>
        </div>
      </div>
      
      {/* Tour Packages */}
      <div className="tour-packages-section">
        <h2>Popular Tour Packages</h2>
        <div className="tour-cards-grid">
          {tourPackages.map((tour) => (
            <Link to={`/countries/${category}/${countryId}/tours/${tour.id}`} className="tour-card" key={tour.id}>
              <div className="tour-card-image">
                <img src={tour.image} alt={tour.title} />
                <div className={`tour-tag ${tour.tag === 'Hottest Tour' ? 'hot' : 'popular'}`}>
                  {tour.tag}
                </div>
              </div>
              <div className="tour-card-content">
                <div className="tour-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="star filled">★</span>
                  ))}
                  <span className="review-count">({tour.reviewCount})</span>
                </div>
                <h3 className="tour-title">{tour.title}</h3>
                <div className="tour-location">
                  <span className="location-icon">📍</span> {tour.location}
                </div>
                <div className="tour-divider"></div>
                <div className="tour-duration">
                  <span className="duration-icon">🗓️</span> {tour.duration}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
