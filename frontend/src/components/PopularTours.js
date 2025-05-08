import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaBolt, FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import './PopularTours.css';

const PopularTours = () => {
  const [popularTours, setPopularTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toursPerPage = 3; // Fixed at 3 cards per page
  
  // Function to navigate to next set of cards
  const navigateNext = () => {
    setCurrentIndex(prev => Math.min(popularTours.length - toursPerPage, prev + 1));
  };
  
  // Function to navigate to previous set of cards
  const navigatePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  // Function to handle pagination dot clicks
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const fetchPopularTours = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/tours`);
        
        let tours = [];
        // Handle different API response formats
        if (response.data && Array.isArray(response.data)) {
          tours = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data.tours)) {
          tours = response.data.data.tours;
        } else if (response.data && Array.isArray(response.data.tours)) {
          tours = response.data.tours;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          tours = response.data.data;
        }
        
        // Filter for popular tours
        const popular = tours.filter(tour => 
          tour.popularTour === true || 
          tour.popularTour === 'true' || 
          tour.popularTour === 1 || 
          String(tour.popularTour).toLowerCase() === 'true'
        );
        
        console.log('Popular tours found:', popular.length);
        
        // If no popular tours found, use the first tours that are multiples of 3
        if (popular.length === 0) {
          // Make sure we have a number of tours divisible by 3 for clean pagination
          const numTours = Math.min(Math.floor(tours.length / 3) * 3, 12);
          setPopularTours(tours.slice(0, numTours));
        } else {
          // For popular tours, ensure we have a number divisible by 3
          const numPopular = Math.ceil(popular.length / 3) * 3;
          
          // If we don't have enough popular tours, pad with non-popular ones
          if (popular.length < numPopular && popular.length % 3 !== 0) {
            const neededExtras = 3 - (popular.length % 3);
            const nonPopularTours = tours.filter(t => 
              !popular.some(p => (p._id || p.id) === (t._id || t.id))
            ).slice(0, neededExtras);
            
            setPopularTours([...popular, ...nonPopularTours]);
          } else {
            setPopularTours(popular);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular tours:', error);
        setLoading(false);
      }
    };
    
    fetchPopularTours();
  }, []);

  if (loading) {
    return (
      <section className="section popular-tours-section">
        <div className="container">
          <h2 className="section-title">Most Popular Tours</h2>
          <p className="section-subtitle">Discover Top International Tour Packages: Your Adventure Awaits!</p>
          <div className="loading">Loading popular tours...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section popular-tours-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Most Popular Tours</h2>
            <h1 className="section-subtitle">Discover Top International Tour Packages:<br/>Your Adventure Awaits!</h1>
          </div>
          <Link to="/tours" className="view-all-tours-button">
            View All Tours <FaChevronRight className="view-all-icon" />
          </Link>
        </div>
        
        <div className="popular-tours-container">
          <button 
            className="nav-arrow nav-arrow-left" 
            onClick={navigatePrevious}
            disabled={currentIndex === 0}
          >
            <FaChevronLeft />
          </button>
          
          <div className="popular-tours-scroll-container">
            <div className="popular-tours-row">
            {popularTours
              .slice(currentIndex, currentIndex + toursPerPage)
              .map((tour, index) => (
            <div key={tour._id || tour.id} className="popular-tour-card">
              <div className="popular-tour-image">
                <img src={tour.coverImage || tour.imageCover} alt={tour.title || tour.name} />
                <div className="popular-tour-badge"><FaBolt /> Most Popular</div>
                
              </div>
              <div className="popular-tour-content">
                <div className="tour-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} style={{ color: '#f39c12' }} />
                  ))}
                  <span className="rating-count">({tour.ratingsQuantity || 9})</span>
                </div>
                <h3 className="popular-tour-title">{tour.title || tour.name || "fdfs"}</h3>
                <div className="popular-tour-info">
                  <div className="info-item">
                    <FaMapMarkerAlt style={{ color: '#0095ff' }} />
                    <span>{tour.destination?.name || tour.country || "Thailand"}</span>
                  </div>
                  <div className="info-item">
                    <BsCalendar3 style={{ color: '#0095ff' }} />
                    <span>{tour.duration || 5} Days {tour.nights || 4} Nights</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
            </div>
          </div>
          
          <button 
            className="nav-arrow nav-arrow-right" 
            onClick={navigateNext}
            disabled={currentIndex >= popularTours.length - toursPerPage}
          >
            <FaChevronRight />
          </button>
        </div>
        
        <div className="pagination-dots">
          {Array.from({ length: Math.max(1, popularTours.length - toursPerPage + 1) }).map((_, index) => (
            <span 
              key={index} 
              className={`pagination-dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
        

      </div>
    </section>
  );
};

export default PopularTours;
