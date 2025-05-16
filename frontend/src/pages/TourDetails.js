import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaClock, FaMoneyBillWave, 
  FaCheck, FaTimes, FaInfoCircle, FaPassport, FaUmbrellaBeach, FaDownload, FaShare, FaHeart, FaExpand, FaMapMarkedAlt } from 'react-icons/fa';
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
    // Helper function to process API responses
    const processApiResponse = (res) => {
      console.log('Processing API response:', res.data);
      
      // Handle different possible response structures
      if (res.data && res.data.data) {
        console.log('Found tour in data.data format');
        setTour(res.data.data);
      } else if (res.data && res.data.success && res.data.data) {
        console.log('Found tour in success.data format');
        setTour(res.data.data);
      } else if (res.data && !res.data.success) {
        console.log('API returned error:', res.data.message || 'Unknown error');
        throw new Error(res.data.message || 'Failed to load tour');
      } else if (res.data && (Object.keys(res.data).includes('title') || Object.keys(res.data).includes('name'))) {
        // Direct tour object in response
        console.log('Found direct tour object in response');
        setTour(res.data);
      } else {
        console.log('Invalid API response format:', res.data);
        throw new Error('Invalid response format');
      }
    };
    
    // Function to find a tour by ID in an array of tours
    const findTourById = (toursArray, tourId) => {
      if (!toursArray || !Array.isArray(toursArray) || toursArray.length === 0) return null;
      
      return toursArray.find(t => {
        if (!t) return false;
        
        // Check all possible ID formats
        const possibleId = t._id || t.id || t.tourId || t.objectId;
        return possibleId === tourId || 
               t._id === tourId || 
               t.id === tourId || 
               t.tourId === tourId || 
               t.objectId === tourId;
      });
    };
    
    // Function to fetch all tours and find the specific one
    const fetchAllToursAndFindOne = async () => {
      try {
        console.log('Fetching all tours as fallback...');
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        
        // Try different endpoints to get all tours
        const allToursEndpoints = [
          `${apiUrl}/api/tours`,
          `${apiUrl}/tours`,
          `${apiUrl}/api/tours/all`
        ];
        
        for (const endpoint of allToursEndpoints) {
          try {
            console.log(`Trying to fetch all tours from: ${endpoint}`);
            const res = await axios.get(endpoint, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            console.log('All tours response:', res.data);
            
            // Extract tours array from different possible response formats
            let allTours = [];
            if (res.data && res.data.data && Array.isArray(res.data.data)) {
              allTours = res.data.data;
            } else if (res.data && Array.isArray(res.data)) {
              allTours = res.data;
            } else if (res.data && res.data.tours && Array.isArray(res.data.tours)) {
              allTours = res.data.tours;
            } else if (res.data && res.data.data && res.data.data.tours && Array.isArray(res.data.data.tours)) {
              allTours = res.data.data.tours;
            }
            
            console.log(`Found ${allTours.length} tours, searching for ID: ${id}`);
            
            // Find the specific tour by ID
            const foundTour = findTourById(allTours, id);
            
            if (foundTour) {
              console.log('Found tour in all tours response:', foundTour);
              setTour(foundTour);
              return true;
            }
          } catch (error) {
            console.log(`Failed to fetch all tours from ${endpoint}:`, error.message);
          }
        }
        
        return false;
      } catch (error) {
        console.error('Error in fetchAllToursAndFindOne:', error);
        return false;
      }
    };
    
    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching tour with ID:', id);

        // First try to find the tour in the context
        if (tours && tours.length > 0) {
          console.log('Tours in context:', tours.length);
          const foundTour = findTourById(tours, id);
          
          if (foundTour) {
            console.log('Found tour in context:', foundTour);
            setTour(foundTour);
            setLoading(false);
            return;
          } else {
            console.log('Tour not found in context, trying API');
          }
        } else {
          console.log('No tours in context');
        }
        
        // If not found in context, fetch from API
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        console.log('Fetching from API:', `${apiUrl}/api/tours/${id}`);
        
        // Try all possible endpoints for direct tour fetch
        const endpoints = [
          `${apiUrl}/api/tours/${id}`,
          `${apiUrl}/tours/${id}`,
          `${apiUrl}/api/tour/${id}`,
          `${apiUrl}/tour/${id}`
        ];
        
        let success = false;
        
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            const res = await axios.get(endpoint, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            // Process this response
            processApiResponse(res);
            success = true;
            break;
          } catch (error) {
            console.log(`Endpoint ${endpoint} failed:`, error.message);
          }
        }
        
        // If direct endpoints failed, try fetching all tours and finding the specific one
        if (!success) {
          console.log('All direct endpoints failed, trying to fetch all tours...');
          success = await fetchAllToursAndFindOne();
          
          if (!success) {
            throw new Error('Could not find tour with ID: ' + id);
          }
        }

      } catch (err) {
        console.error('All API endpoints failed:', err);
        console.log('Error details:', err.response || err.request || err.message);
        let errorMessage = 'Failed to load tour details. ';
        
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage = 'Tour not found. The tour may have been removed or the ID is incorrect.';
          } else {
            errorMessage += err.response.data?.message || 'Please try again later.';
          }
        } else if (err.request) {
          errorMessage += 'No response from server. Please check your connection or try again later.';
        } else {
          errorMessage += err.message || 'An unexpected error occurred.';
        }
        
        setError(errorMessage);
        toast.error('Error loading tour details');
      } finally {
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
    if (!tour) return;
    
    if (!isAuthenticated) {
      toast.info('Please login to book this tour');
      navigate('/login', { state: { from: `/tours/${id}` } });
      return;
    }

    if (tour.status && tour.status !== 'active') {
      toast.error('This tour is currently not available for booking');
      return;
    }
    
    const tourId = tour._id || tour.id;
    console.log('Navigating to booking with tour ID:', tourId);
    navigate(`/book/${tourId}`);
    toast.success('Redirecting to booking page...');
  };

  if (loading) {
    return (
      <div className="tour-details-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading tour details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tour-details-page">
        <div className="container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/tours" className="btn-primary">Back to Tours</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="tour-details-page">
        <div className="container">
          <div className="error-container">
            <h2>Tour Not Found</h2>
            <p>The tour you're looking for doesn't exist or has been removed.</p>
            <Link to="/tours" className="btn-primary">Back to Tours</Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Debug output
  console.log('Rendering tour:', tour);

  return (
    <section className="tour-details-page">
      {/* Image Gallery */}
      <div className="tour-gallery-container">
        <div className="gallery-grid">
          {tour.images && tour.images.length > 0 ? (
            tour.images.slice(0, 5).map((image, index) => (
              <div 
                key={index}
                className={`gallery-item`} 
                style={{ 
                  backgroundImage: `url(${image})`,
                  height: '365px'
                }}
                onClick={() => setCurrentImageIndex(index)}
              >
                {index === 4 && tour.images.length > 5 && (
                  <div className="gallery-overlay">
                    <FaExpand />
                    <span>View All Images ({tour.images.length})</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div 
              className="gallery-item" 
              style={{ 
                backgroundImage: `url(${tour.coverImage || 'https://via.placeholder.com/800x600?text=No+Image+Available'})`,
                height: '365px'
              }} 
            />
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

        {/* Tour Header */}
        <div className="tour-header">
          <div className="tour-title">
            <h1>{tour.title}</h1>
            {tour.status && tour.status !== 'active' && (
              <span className="tour-status inactive">Inactive</span>
            )}
          </div>
          <div className="tour-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= (tour.ratingsAverage || 4.5) ? 'star-filled' : 'star-empty'}>
                <FaStar />
              </span>
            ))}
            <span className="rating-text">
              {tour.ratingsAverage || 4.5} ({tour.ratingsQuantity || 0} reviews)
            </span>
          </div>
        </div>

        <div className="container tour-content-container">
          <div className="tour-content">
            <div className="tour-main">
              {/* Tour Info */}
              <div className="tour-info-card">
                <div className="tour-meta">
                  <div className="meta-item">
                    <FaCalendarAlt />
                    <span>{tour.duration || tour.days || 0} days {(tour.duration ? tour.duration - 1 : tour.nights) || 0} nights</span>
                  </div>
                  <div className="meta-item">
                    <FaMapMarkerAlt />
                    <span>{tour.country || (tour.destination && (tour.destination.name || tour.destination)) || 'Various Locations'}</span>
                  </div>
                  <div className="meta-item">
                    <FaUsers />
                    <span>Max {tour.maxGroupSize || 15} people</span>
                  </div>
                  <div className="meta-item">
                    <FaMoneyBillWave />
                    <span>
                      {tour.discountPrice && tour.discountPrice < tour.price ? (
                        <>
                          <span className="original-price">${tour.price}</span>
                          <span className="discount-price">${tour.discountPrice}</span>
                        </>
                      ) : (
                        <span>${tour.price || 0}</span>
                      )}
                    </span>
                  </div>
                  {tour.bestTimeToVisit && (
                    <div className="meta-item">
                      <FaClock />
                      <span>Best Time: {tour.bestTimeToVisit}</span>
                    </div>
                  )}
                  {tour.visaRequirements && (
                    <div className="meta-item">
                      <FaPassport />
                      <span>Visa: {tour.visaRequirements || 'Contact for details'}</span>
                    </div>
                  )}
                  <div className="meta-item status-badge">
                    <span className={`status ${tour.status || 'active'}`}>{tour.status || 'active'}</span>
                  </div>
                </div>
              </div>

              {/* Tour Description */}
              <div className="tour-description">
                <h2>Tour Overview</h2>
                <p>{tour.description || `Experience the best of ${tour.title || 'this destination'} with our comprehensive tour package. This carefully crafted itinerary takes you through the most iconic landmarks and hidden gems, ensuring an unforgettable journey.`}</p>
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

              {/* Includes */}
              {tour.includes && tour.includes.length > 0 && (
                <div className="tour-includes">
                  <h2>What's Included</h2>
                  <ul className="includes-list">
                    {tour.includes.map((item, index) => (
                      <li key={index}>
                        <FaCheck className="include-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Excludes */}
              {tour.excludes && tour.excludes.length > 0 && (
                <div className="tour-excludes">
                  <h2>What's Not Included</h2>
                  <ul className="excludes-list">
                    {tour.excludes.map((item, index) => (
                      <li key={index}>
                        <FaTimes className="exclude-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Travel Tips */}
              {tour.travelTips && tour.travelTips.length > 0 && (
                <div className="travel-tips">
                  <h2>Travel Tips</h2>
                  <ul className="tips-list">
                    {tour.travelTips.map((tip, index) => (
                      <li key={index}>
                        <FaInfoCircle className="tip-icon" />
                        <span>{tip}</span>
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
                          <h3>Day {index + 1}: {day.title || 'Exploration Day'}</h3>
                        </div>
                        <div className="day-content">
                          <p>{day.description || 'Details for this day will be provided upon booking.'}</p>
                          {day.activities && day.activities.length > 0 && (
                            <div className="day-activities">
                              <h4>Activities:</h4>
                              <ul>
                                {day.activities.map((activity, actIndex) => (
                                  <li key={actIndex}>{activity}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {day.meals && (
                            <div className="day-meals">
                              <h4>Meals:</h4>
                              <p>{day.meals}</p>
                            </div>
                          )}
                          {day.accommodation && (
                            <div className="day-accommodation">
                              <h4>Accommodation:</h4>
                              <p>{day.accommodation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Detailed itinerary will be provided upon booking.</p>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="additional-info">
                <h2>Additional Information</h2>
                
                {tour.bestTimeToVisit && (
                  <div className="info-item">
                    <h3><FaUmbrellaBeach /> Best Time to Visit</h3>
                    <p>{tour.bestTimeToVisit}</p>
                  </div>
                )}
                
                {tour.visaRequirements && (
                  <div className="info-item">
                    <h3><FaPassport /> Visa Requirements</h3>
                    <p>{tour.visaRequirements}</p>
                  </div>
                )}
                
                {tour.cancellationPolicy && (
                  <div className="info-item">
                    <h3>Cancellation Policy</h3>
                    <p>{tour.cancellationPolicy}</p>
                  </div>
                )}
              </div>

              {/* Tour Reviews */}
              <div className="tour-reviews">
                <h2>Reviews</h2>
                <div className="reviews-summary">
                  <div className="average-rating">
                    <span className="rating-number">{tour.ratingsAverage || 4.8}</span>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= (tour.ratingsAverage || 4.8) ? 'star-filled' : 'star-empty'}>
                          <FaStar />
                        </span>
                      ))}
                    </div>
                    <span className="rating-count">Based on {tour.ratingsQuantity || 0} reviews</span>
                  </div>
                  
                  <div className="rating-breakdown">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div className="rating-bar" key={rating}>
                        <span className="rating-label">{rating} stars</span>
                        <div className="progress-bar">
                          <div 
                            className="progress" 
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                        <span className="rating-percent">{Math.floor(Math.random() * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="reviews-list">
                  {tour.reviews && tour.reviews.length > 0 ? (
                    tour.reviews.map((review, index) => (
                      <div className="review-card" key={index}>
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar" style={{ backgroundImage: `url(${review.user?.photo || 'https://via.placeholder.com/50?text=User'})` }}></div>
                            <div className="reviewer-name-date">
                              <h4>{review.user?.name || 'Anonymous User'}</h4>
                              <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="review-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= review.rating ? 'star-filled' : 'star-empty'}>
                                <FaStar />
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="review-content">
                          <p>{review.review}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-reviews">No reviews yet. Be the first to review this tour!</p>
                  )}
                </div>
              </div>
            </div>

            <div className="tour-sidebar">
              <div className="booking-card">
                <div className="booking-price">
                  <span className="price-label">From</span>
                  <span className="price-value">${tour.price}</span>
                  <span className="price-per">per person</span>
                </div>
                
                <div className="booking-form">
                  <button 
                    className="btn-book-now"
                    onClick={handleBookNow}
                    disabled={tour.status === 'inactive'}
                  >
                    {tour.status === 'inactive' ? 'Currently Unavailable' : 'Book Now'}
                  </button>
                  
                  <div className="booking-guarantee">
                    <p>✓ Instant confirmation</p>
                    <p>✓ Best price guarantee</p>
                    <p>✓ No booking fees</p>
                  </div>
                </div>
                
                <div className="booking-contact">
                  <h3>Need help with booking?</h3>
                  <p>Contact our travel experts for assistance.</p>
                  <span className="contact-phone">+1 (800) 123-4567</span>
                  <span className="contact-email">booking@traveltour.com</span>
                </div>
              </div>
              
              <div className="tour-map">
                <h3>Tour Location</h3>
                <div className="map-placeholder">
                  <FaMapMarkedAlt />
                  <p>Map loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDetails;
