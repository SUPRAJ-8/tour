import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaClock, FaMoneyBillWave, 
  FaCheck, FaTimes, FaInfoCircle, FaPassport, FaUmbrellaBeach, FaDownload, FaShare, FaHeart, FaExpand, FaMapMarkedAlt, FaCheckCircle, FaTag, FaCog, FaArrowRight, FaEnvelope, FaPhone, FaUser, FaFlag, FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';
import './TourDetails.css';

// Booking Form Modal Component
const BookingFormModal = ({ isOpen, onClose, tour }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelers: '',
    startDate: '',
    nationality: 'Nepal',
    message: '',
    agreeToTerms: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    toast.success('Booking request sent successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <div className="booking-modal-content">
          <div className="modal-grid">
            {/* Left Section */}
            <div className="modal-left">
              <div className="modal-tour-image">
                <img src={tour.images?.[0] || tour.coverImage || '/images/placeholder.jpg'} alt={tour.title} />
              </div>
              <div className="modal-tour-info">
                <h3>{tour.title || '4N/5D Bangkok-Pattaya Tour Package'}</h3>
                <div className="modal-tour-duration">
                  <FaClock />
                  <span>{tour.duration || '5 Days 4 Nights'}</span>
                </div>
              </div>
              
              {/* Confusion Section */}
              <div className="confusion-section modal-confusion">
                <h3>Have confusion?</h3>
                <p>Feel free to call us with any questions or uncertainties.</p>
                <a href="https://wa.me/9802392709" className="whatsapp-link" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp /> 9802392709
                </a>
              </div>
            </div>

            {/* Right Section - Booking Form */}
            <div className="modal-right">
              <div className="booking-modal-header">
                <h2>Book for {tour.title || '4N/5D Bangkok-Pattaya Tour Package'}</h2>
                <button className="close-button" onClick={onClose}>
                  <FaTimes />
                </button>
              </div>

              <div className="booking-form-grid">
                <div className="form-group">
                  <label>
                    <FaUser className="input-icon" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaEnvelope className="input-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaPhone className="input-icon" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaUsers className="input-icon" />
                    Total No. of Travellers
                  </label>
                  <select
                    value={formData.travelers}
                    onChange={(e) => setFormData({...formData, travelers: e.target.value})}
                  >
                    <option value="">Enter the no. of Travellers</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <FaCalendarAlt className="input-icon" />
                    Tour Start Date
                  </label>
                  <input
                    type="date"
                    placeholder="Select the Start Date of Tour"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaFlag className="input-icon" />
                    Nationality
                  </label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  >
                    <option value="Nepal">Nepal</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group message-group">
                  <label>
                    <FaInfoCircle className="input-icon" />
                    Message
                  </label>
                  <textarea
                    placeholder="Any messeries/queries/inquiries you would like to convey to us."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="form-group terms-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                    />
                    By submitting, you agree to our and <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>.
                  </label>
                </div>

                <button 
                  className="confirm-booking-btn"
                  onClick={handleSubmit}
                  disabled={!formData.agreeToTerms}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
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
    setShowBookingModal(true);
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
        {/* Breadcrumbs
        <div className="breadcrumbs">
          <Link to="/">Home</Link> <span className="separator">›</span> 
          <Link to="/tours">Tours</Link> <span className="separator">›</span> 
          <span>{tour.title}</span>
        </div> */}

        {/* Tour Header */}
        <div className="tour-header">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>›</span>
            <Link to="/tours">Tours</Link> <span>›</span>
            <Link to="/tours/thailand">Thailand</Link> <span>›</span>
            <span>{tour.title}</span>
          </div>

          <div className="tour-title-section">
            <div className="title-section">
              <h1>{tour.title}</h1>
            </div>

            
          </div>

          <div className="duration-badge">
            <FaClock />
            <span>{tour.duration || 5} Days {tour.nights || 4} Nights</span>
          </div>
          
          {/* Tour content wrapper for positioning */}
          <div className="tour-content-wrapper">
            {/* Tour Meta Section */}
            <div className="tour-meta-grid">
              <div className="meta-item">
                <div className="meta-icon">
                  <img src="/images/icons/globe.svg" alt="Country" />
                </div>
                <div className="meta-content">
                  <span className="meta-label">Country</span>
                  <span className="meta-value">Thailand</span>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">
                  <img src="/images/icons/weather.svg" alt="Best Season" />
                </div>
                <div className="meta-content">
                  <span className="meta-label">Best Season</span>
                  <span className="meta-value">Jan-Jun, Sept-Nov</span>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">
                  <img src="/images/icons/calendar.svg" alt="Duration" />
                </div>
                <div className="meta-content">
                  <span className="meta-label">Duration</span>
                  <span className="meta-value">4N/5D</span>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">
                  <img src="/images/icons/group.svg" alt="Group Size" />
                </div>
                <div className="meta-content">
                  <span className="meta-label">Group Size</span>
                  <span className="meta-value">15-30 travelers</span>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="booking-sidebar">
              <div className="discount-banner">
                <div className="discount-amount">20% OFF</div>
                <div className="discount-text">on all packages</div>
              </div>

              <div className="booking-content">
                <div className="service-features">
                  <div className="service-feature">
                    <FaCheckCircle />
                    <span>Best Service Guaranteed</span>
                  </div>
                  <div className="service-feature">
                    <FaTag />
                    <span>Best Price</span>
                  </div>
                  <div className="service-feature">
                    <FaCog />
                    <span>Customize according to your need</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="book-tour-btn"
                  onClick={handleBookNow}
                >
                  <span>Book This Tour</span>
                  <FaArrowRight />
                </button>

                {/* Confusion Section */}
                <div className="confusion-section">
                  <h3>Have confusion?</h3>
                  <p>Feel free to call us with any questions or uncertainties.</p>
                  <a href="https://wa.me/9802392709" className="whatsapp-link">
                    <FaWhatsapp /> 9802392709
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container tour-content-container">
          <div className="tour-content">
                          <div className="tour-main">
                {/* Tour Description */}
              <div className="tour-description">
                <h2>Tour Overview</h2>
                <p>{tour.description || `Experience the best of ${tour.title || 'this destination'} with our comprehensive tour package. This carefully crafted itinerary takes you through the most iconic landmarks and hidden gems, ensuring an unforgettable journey.`}</p>
              </div>

              {/* Highlights Section */}
              <div className="highlights-section">
                <h2>Highlights</h2>
                <div className="highlights-grid">
                  <div className="highlight-item">
                    <FaStar className="highlight-icon" />
                    <span className="highlight-content">Visit the iconic Grand Palace and Temple of the Emerald Buddha</span>
                  </div>
                  <div className="highlight-item">
                    <FaStar className="highlight-icon" />
                    <span className="highlight-content">Experience traditional Thai massage and spa treatments</span>
                  </div>
                  <div className="highlight-item">
                    <FaStar className="highlight-icon" />
                    <span className="highlight-content">Explore the famous floating markets of Bangkok</span>
                  </div>
                  <div className="highlight-item">
                    <FaStar className="highlight-icon" />
                    <span className="highlight-content">Enjoy pristine beaches and crystal-clear waters in Pattaya</span>
                  </div>
                  <div className="highlight-item">
                    <FaStar className="highlight-icon" />
                    <span className="highlight-content">Visit the Sanctuary of Truth wooden temple</span>
                  </div>
                  <div className="highlight-item">
                    <FaStar className="highlight-icon" />
                    <span className="highlight-content">Experience vibrant nightlife and cultural shows</span>
                  </div>
                </div>
              </div>

              {/* Inclusions Section */}
              <div className="inclusions">
                <h2>Inclusions</h2>
                <p className="inclusions-subtitle">What's Covered in Your Adventure</p>
                
                <div className="includes-excludes-grid">
                  <div className="includes-section">
                    <h3>Includes</h3>
                    <ul className="includes-list">
                      <li>
                        <FaCheck className="include-icon" />
                        <span>Visa processing fee</span>
                      </li>
                      <li>
                        <FaCheck className="include-icon" />
                        <span>3/4-star accommodations with daily breakfast (double/twin sharing)</span>
                      </li>
                      <li>
                        <FaCheck className="include-icon" />
                        <span>Airport pickup and drop-off in shared vehicles</span>
                      </li>
                      <li>
                        <FaCheck className="include-icon" />
                        <span>Guided tours to destinations mentioned in the itinerary</span>
                      </li>
                    </ul>
                  </div>

                  <div className="excludes-section">
                    <h3>Excludes</h3>
                    <ul className="excludes-list">
                      <li>
                        <FaTimes className="exclude-icon" />
                        <span>International and domestic airfare</span>
                      </li>
                      <li>
                        <FaTimes className="exclude-icon" />
                        <span>Transportation outside the specified itinerary</span>
                      </li>
                      <li>
                        <FaTimes className="exclude-icon" />
                        <span>Personal expenses (tips, shopping, laundry, activities not listed)</span>
                      </li>
                      <li>
                        <FaTimes className="exclude-icon" />
                        <span>Lunch & Dinner</span>
                      </li>
                      <li>
                        <FaTimes className="exclude-icon" />
                        <span>Personal Expenses</span>
                      </li>
                      <li>
                        <FaTimes className="exclude-icon" />
                        <span>National Park Fees</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

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


            </div>

            <div className="tour-sidebar">
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <BookingFormModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        tour={tour}
      />
    </section>
  );
};

export default TourDetails;
