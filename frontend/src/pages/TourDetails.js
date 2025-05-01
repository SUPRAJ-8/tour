import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaClock, FaMoneyBillWave, 
  FaCheck, FaTimes, FaInfoCircle, FaPassport, FaUmbrellaBeach, FaDownload, FaShare, FaHeart, FaExpand } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';
import './TourDetails.css';

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { tours } = useData();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        // First try to find the tour in the context
        if (tours && tours.length > 0) {
          const foundTour = tours.find(t => t._id === id);
          if (foundTour) {
            setTour(foundTour);
            setLoading(false);
            return;
          }
        }
        
        // If not found in context, fetch from API
        const res = await axios.get(`/api/tours/${id}`);
        setTour(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Failed to load tour details');
        setLoading(false);
      }
    };

    fetchTour();
  }, [id, tours]);
  
  // Function to navigate through images
  const nextImage = () => {
    if (tour && tour.images && tour.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === tour.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const prevImage = () => {
    if (tour && tour.images && tour.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? tour.images.length - 1 : prevIndex - 1
      );
    }
  };
  
  // Auto-advance images every 5 seconds
  useEffect(() => {
    if (!showAllImages && tour && tour.images && tour.images.length > 1) {
      const interval = setInterval(nextImage, 5000);
      return () => clearInterval(interval);
    }
  }, [tour, currentImageIndex, showAllImages]);
  
  const handleBookNow = () => {
    if (isAuthenticated) {
      navigate(`/book/${id}`);
    } else {
      toast.info('Please login to book this tour');
      navigate('/login', { state: { from: `/tours/${id}` } });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/tours" className="btn btn-primary">Back to Tours</Link>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Tour Not Found</h2>
          <p>The tour you're looking for doesn't exist or has been removed.</p>
          <Link to="/tours" className="btn btn-primary">Back to Tours</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="tour-details-page">
      {/* Image Gallery */}
      <div className="tour-gallery-container">
        <div className="gallery-grid">
          {tour.images && tour.images.length > 0 ? (
            tour.images.slice(0, 5).map((image, index) => (
              <div 
                key={index} 
                className={`gallery-item item-${index + 1}`}
                style={{ backgroundImage: `url(${image})` }}
              >
                {index === 4 && (
                  <button className="view-all-btn" onClick={() => setShowAllImages(true)}>
                    <FaExpand /> View All Images
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="gallery-item item-1" style={{ backgroundImage: `url(${tour.coverImage})` }}></div>
          )}
        </div>
      </div>

      <div className="container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link to="/">Home</Link> <span className="separator">›</span> 
          <Link to="/tours">Tours</Link> <span className="separator">›</span> 
          <span>{tour.title}</span>
        </div>
        
        {/* Tour Title and Rating */}
        <div className="tour-header-content">
          <h1 className="tour-title">{tour.title}</h1>
          <div className="tour-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(tour.ratingsAverage || 4.5) ? 'star-filled' : 'star-empty'} />
            ))}
            <span className="rating-text">({tour.ratingsQuantity || 49})</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="tour-actions">
          <button className="action-btn" onClick={() => toast.info('Added to wishlist')}>
            <FaHeart /> Add to wishlist
          </button>
          <button className="action-btn" onClick={() => toast.info('Link copied to clipboard')}>
            <FaShare /> Copy link
          </button>
          <button className="action-btn" onClick={() => toast.info('Downloading PDF...')}>
            <FaDownload /> Download (PDF)
          </button>
        </div>

        <div className="container tour-content-container">
          <div className="tour-content">
            <div className="tour-main">
              {/* Tour Info */}
              <div className="tour-info-card">
                <div className="tour-meta">
                  <div className="meta-item">
                    <FaCalendarAlt />
                    <span>{tour.duration} days {tour.duration - 1} nights</span>
                  </div>
                  <div className="meta-item">
                    <FaMapMarkerAlt />
                    <span>{tour.destination?.name || tour.country?.name}</span>
                  </div>
                  <div className="meta-item">
                    <FaUsers />
                    <span>Max {tour.maxGroupSize || 15} people</span>
                  </div>
                </div>
              </div>

              {/* Tour Description */}
              <div className="tour-description">
                <h2>Tour Overview</h2>
                <p>{tour.description || `Experience the best of ${tour.title} with our comprehensive tour package. This carefully crafted itinerary takes you through the most iconic landmarks and hidden gems, ensuring an unforgettable journey through this beautiful destination.`}</p>
              </div>

              {/* Tour Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <div className="tour-highlights">
                  <h2>Tour Highlights</h2>
                  <ul className="highlights-list">
                    {tour.highlights.map((highlight, index) => (
                      <li key={index}>
                        <FaCheck className="highlight-icon" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tour Itinerary */}
              <div className="tour-itinerary">
                <h2>Itinerary</h2>
                <div className="itinerary-days">
                  {tour.itinerary && tour.itinerary.length > 0 ? (
                    tour.itinerary.map((day, index) => (
                      <div className="itinerary-day" key={index}>
                        <div className="day-header">
                          <div className="day-number">Day {index + 1}</div>
                          <div className="day-title">{day.title || `Day ${index + 1}`}</div>
                        </div>
                        <div className="day-content">
                          <p>{day.description || 'Explore and enjoy the day at your own pace.'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Generate sample itinerary if none exists
                    [...Array(tour.duration || 5)].map((_, index) => (
                      <div className="itinerary-day" key={index}>
                        <div className="day-header">
                          <div className="day-number">Day {index + 1}</div>
                          <div className="day-title">{index === 0 ? 'Arrival & Welcome' : 
                            index === tour.duration - 1 ? 'Departure' : 
                            `Explore ${tour.destination?.name || tour.country?.name}`}</div>
                        </div>
                        <div className="day-content">
                          <p>{index === 0 ? `Arrive in ${tour.destination?.name || tour.country?.name}. Transfer to your hotel and attend a welcome dinner.` : 
                            index === tour.duration - 1 ? 'Check out from your hotel. Transfer to the airport for your departure flight.' : 
                            `Explore the beautiful sights and attractions of ${tour.destination?.name || tour.country?.name}.`}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="tour-inclusions-exclusions">
                <h2>What's Included/Excluded</h2>
                <div className="inclusions-exclusions-grid">
                  <div className="inclusions">
                    <h3>Inclusions</h3>
                    <ul>
                      {tour.includes && tour.includes.length > 0 ? (
                        tour.includes.map((item, index) => (
                          <li key={index}>
                            <FaCheck className="include-icon" />
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        // Default inclusions if none provided
                        [
                          'Accommodation in 3-4 star hotels',
                          'Daily breakfast and selected meals',
                          'All transportation within the itinerary',
                          'English-speaking tour guide',
                          'Entrance fees to attractions mentioned in the itinerary',
                          'Airport transfers'
                        ].map((item, index) => (
                          <li key={index}>
                            <FaCheck className="include-icon" />
                            <span>{item}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  <div className="exclusions">
                    <h3>Exclusions</h3>
                    <ul>
                      {tour.excludes && tour.excludes.length > 0 ? (
                        tour.excludes.map((item, index) => (
                          <li key={index}>
                            <FaTimes className="exclude-icon" />
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        // Default exclusions if none provided
                        [
                          'International airfare',
                          'Travel insurance',
                          'Personal expenses',
                          'Optional activities not mentioned in the itinerary',
                          'Visa fees (if applicable)',
                          'Tips and gratuities'
                        ].map((item, index) => (
                          <li key={index}>
                            <FaTimes className="exclude-icon" />
                            <span>{item}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="additional-info">
                <h2>Additional Information</h2>
                
                {tour.bestTimeToVisit && (
                  <div className="info-section">
                    <h3><FaUmbrellaBeach /> Best Time to Visit</h3>
                    <p>{tour.bestTimeToVisit}</p>
                  </div>
                )}
                
                {tour.visaRequirements && (
                  <div className="info-section">
                    <h3><FaPassport /> Visa Requirements</h3>
                    <p>{tour.visaRequirements}</p>
                  </div>
                )}
                
                <div className="info-section">
                  <h3><FaInfoCircle /> Important Notes</h3>
                  <ul>
                    <li>Please ensure your passport is valid for at least 6 months beyond your travel dates</li>
                    <li>We recommend purchasing comprehensive travel insurance</li>
                    <li>Tour itinerary may be subject to change due to local conditions</li>
                    <li>Please inform us of any dietary restrictions or special requirements</li>
                  </ul>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="tour-reviews">
                <h2>Reviews</h2>
                <div className="reviews-summary">
                  <div className="average-rating">
                    <span className="rating-number">{tour.ratingsAverage || 4.8}</span>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(tour.ratingsAverage || 4.8) ? 'star-filled' : 'star-empty'} />
                      ))}
                    </div>
                    <span className="rating-count">{tour.ratingsQuantity || 49} reviews</span>
                  </div>
                </div>
                
                <div className="reviews-list">
                  {tour.reviews && tour.reviews.length > 0 ? (
                    tour.reviews.map((review, index) => (
                      <div className="review-card" key={index}>
                        <div className="review-header">
                          <div className="review-user">
                            <img 
                              src={review.user?.profileImage || '/images/default-user.jpg'} 
                              alt={review.user?.name || 'User'} 
                              className="review-user-image" 
                            />
                            <div>
                              <h4>{review.user?.name || 'Anonymous User'}</h4>
                              <p className="review-date">
                                {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={i < (review.rating || 5) ? 'star-filled' : 'star-empty'} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="review-text">{review.review || 'Great experience! Highly recommended tour.'}</p>
                      </div>
                    ))
                  ) : (
                    // Sample reviews if none exist
                    [
                      { name: 'John Smith', date: '2024-04-15', rating: 5, text: 'Amazing experience! The tour guide was knowledgeable and the itinerary was perfect.' },
                      { name: 'Sarah Johnson', date: '2024-03-22', rating: 4, text: 'Great tour overall. Loved the activities and accommodations were comfortable.' },
                      { name: 'Michael Brown', date: '2024-02-10', rating: 5, text: 'Excellent service from start to finish. Would definitely book again!' }
                    ].map((review, index) => (
                      <div className="review-card" key={index}>
                        <div className="review-header">
                          <div className="review-user">
                            <img 
                              src={`/images/default-user-${index + 1}.jpg`} 
                              alt={review.name} 
                              className="review-user-image" 
                              onError={(e) => { e.target.src = '/images/default-user.jpg' }}
                            />
                            <div>
                              <h4>{review.name}</h4>
                              <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < review.rating ? 'star-filled' : 'star-empty'} />
                            ))}
                          </div>
                        </div>
                        <p className="review-text">{review.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="tour-sidebar">
            <div className="booking-card">
              {/* Price information removed */}

              <div className="tour-duration">
                <div className="duration-icon">
                  <FaCalendarAlt />
                </div>
                <div className="duration-text">
                  <span>{tour.duration} Days {tour.duration - 1} Nights</span>
                </div>
              </div>

              <div className="booking-info">
                <div className="booking-info-item">
                  <FaClock />
                  <div>
                    <span className="info-label">Tour Type</span>
                    <span className="info-value">Group Tour</span>
                  </div>
                </div>
                <div className="booking-info-item">
                  <FaUsers />
                  <div>
                    <span className="info-label">Group Size</span>
                    <span className="info-value">Max {tour.maxGroupSize || 15} people</span>
                  </div>
                </div>
                <div className="booking-info-item">
                  <div>
                    <span className="info-label">Difficulty</span>
                    <span className="info-value">{tour.difficulty || 'Medium'}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleBookNow} 
                className="book-now-btn"
              >
                Book Now
              </button>
              
              {!isAuthenticated && (
                <p className="booking-login-text">
                  Don't have an account? <Link to="/register">Sign up</Link>
                </p>
              )}
              
              <div className="booking-contact">
                <p>Need help? Contact us:</p>
                <a href="tel:+9779876543210" className="contact-phone">+977 9876543210</a>
                <a href="mailto:info@toursnepal.com" className="contact-email">info@toursnepal.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDetails;
