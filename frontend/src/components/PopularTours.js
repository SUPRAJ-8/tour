import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaBolt, FaHeart } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import './PopularTours.css';

const PopularTours = () => {
  const [popularTours, setPopularTours] = useState([]);
  const [loading, setLoading] = useState(true);

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
        
        // If no popular tours found, use the first 3 tours
        if (popular.length === 0) {
          setPopularTours(tours.slice(0, 3));
        } else {
          setPopularTours(popular.slice(0, 3));
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
          <p className="section-subtitle">Our travelers' favorite experiences</p>
          <div className="loading">Loading popular tours...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section popular-tours-section">
      <div className="container">
        <h2 className="section-title">Most Popular Tours</h2>
        <p className="section-subtitle">Our travelers' favorite experiences</p>
        
        <div className="popular-tours-grid">
          {popularTours.map(tour => (
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
        
        <div className="text-center mt-4">
          <Link to="/tours" className="btn btn-primary">View All Tours</Link>
        </div>
      </div>
    </section>
  );
};

export default PopularTours;
