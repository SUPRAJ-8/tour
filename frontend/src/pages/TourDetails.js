import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaClock, 
  FaCheck, FaTimes, FaInfoCircle, FaPassport, FaUmbrellaBeach, FaDownload, FaShare, FaHeart, FaExpand, FaMapMarkedAlt, FaCheckCircle, FaTag, FaCog, FaArrowRight, FaEnvelope, FaPhone, FaUser, FaFlag, FaWhatsapp, FaRegCalendar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';
import './TourDetails.css';
import { getSampleTours } from '../services/tourService';

// Booking Form Modal Component
const BookingFormModal = ({ isOpen, onClose, tour }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelers: '',
    startDate: null,
    nationality: 'Nepal',
    message: '',
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) return;
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.travelers || !formData.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      // Do NOT send Authorization header for guest bookings
      const response = await axios.post(`${apiUrl}/api/bookings/guest`, {
        tour: tour._id,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        startDate: formData.startDate,
        numberOfPeople: parseInt(formData.travelers) || 1,
        specialRequests: formData.message,
        nationality: formData.nationality,
        // Default payment method for guest bookings
        paymentMethod: 'cash'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // No Authorization header here
        }
      });

      if (response.data.success) {
        toast.success('Booking successful! Check your email for confirmation.');
        onClose();
      } else {
        throw new Error(response.data.message || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                <h3>{tour.title}</h3>
                <div className="tour-details">
                  <div className="detail-item">
                    <img src="/images/icons/globe.svg" alt="" className="detail-icon" />
                    <span className="detail-label">Country:</span>
                    <span>{tour.destination?.country || tour.country}</span>
                  </div>
                  <div className="detail-item">
                    <img src="images/icons/calendar.svg" alt="" className="detail-icon" />
                    <span className="detail-label">Duration:</span>
                    <span>{tour.nights} Nights - {tour.days} Days</span>
                  </div>
                  <div className="detail-item">
                    <img src="images/icons/weather.svg" alt="" className="detail-icon" />
                    <span className="detail-label">Best Season:</span>
                    <span>{tour.bestSeason || tour.bestTimeToVisit}</span>
                  </div>
                  <div className="detail-item">
                    <img src="images/icons/group.svg" alt="" className="detail-icon" />
                    <span className="detail-label">Group Size:</span>
                    <span>{tour.groupSize} Travellers</span>
                  </div>
                </div>
              </div>
              
              {/* Confusion Section */}
              <div className="confusion-section modal-confusion">
                <h3>Have confusion?</h3>
                <p>Feel free to call us with any questions or uncertainties.</p>
                <a href="https://wa.me/9700664343" className="whatsapp-link" target="_blank" rel="noopener noreferrer">
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

              <form onSubmit={handleSubmit} className="booking-form-grid">
                <div className="form-group">
                  <div className="form-label">
                    <FaUser className="label-icon" />
                    Full Name
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">
                    <FaEnvelope className="label-icon" />
                    Email Address
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">
                    <FaPhone className="label-icon" />
                    Phone Number
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter your Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    pattern="[0-9]{10}"
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">
                    <FaUsers className="label-icon" />
                    Total No. of Travellers
                  </div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter the no. of Travellers"
                    value={formData.travelers}
                    onChange={(e) => setFormData({...formData, travelers: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="form-label">
                    <FaCalendarAlt className="label-icon" />
                    Tour Start Date
                  </div>
                  <div className="date-input-container">
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) => {
                        setFormData({...formData, startDate: date});
                        setIsCalendarOpen(false);
                      }}
                      onClickOutside={() => setIsCalendarOpen(false)}
                      onInputClick={() => setIsCalendarOpen(true)}
                      open={isCalendarOpen}
                      minDate={new Date()}
                      placeholderText="Select the Start Date of Tour"
                      className="date-picker-input"
                      dateFormat="dd/MM/yyyy"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-label">
                    <FaFlag className="label-icon" />
                    Nationality
                  </div>
                  <select
                    value={formData.nationality}
                    onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                    required
                  >
                    <option value="Nepal">Nepal</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group message-group">
                  <div className="form-label">
                    <FaInfoCircle className="label-icon" />
                    Message
                  </div>
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
                      required
                    />
                    By submitting, you agree to our and <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
                  </label>
                </div>

                <button 
                  className="confirm-booking-btn"
                  type="submit"
                  disabled={!formData.agreeToTerms || isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
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
    const fetchTourData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching tour with ID:', id);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/tours/${id}`);
        
        console.log('Tour API response:', response.data);
        
        if (response.data.success) {
          setTour(response.data.data);
        } else {
          setError(response.data.message || 'Tour not found');
        }
      } catch (err) {
        console.error('Error fetching tour:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tour details';
        console.error('Error message:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);
  
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
            <FaCalendarAlt className="duration-icon" />
            <span>Duration</span>
            <span className="duration-value">{tour.nights || 4} Nights/{tour.days || 5} Days</span>
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
                  <span className="meta-value">{tour.destination?.country || tour.country}</span>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">
                  <img src="/images/icons/weather.svg" alt="Best Season" />
                </div>
                <div className="meta-content">
                  <span className="meta-label">Best Season</span>
                  <span className="meta-value">{tour.bestSeason || tour.bestTimeToVisit || ''}</span>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">
                  <img src="/images/icons/calendar.svg" alt="Duration" />
                </div>
                <div className="meta-content">
                  <span className="meta-label">Duration</span>
                  <span className="meta-value">{tour.nights} Nights - {tour.days} Days</span>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">
                  <img src="/images/icons/group.svg" alt="Group Size" />
                </div>
                <div className="meta-content">
                  <span className="meta-label">Group Size</span>
                  <span className="meta-value">{tour.groupSize} Travellers</span>
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
                  <a href="https://wa.me/9700664343" className="whatsapp-link">
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
              {tour.highlights && tour.highlights.length > 0 && (
                <div className="highlights-section">
                  <h2><img src="/images/icons/highlight.svg" alt="" className="highlight-icon-head" /> Highlights</h2>
                  <div className="highlights-grid">
                    {tour.highlights.map((highlight, index) => {
                      // Split if the highlight contains ,,
                      const points = highlight.split(',,').map(point => point.trim()).filter(point => point !== '');
                      
                      return points.map((point, pointIndex) => (
                        <div key={`${index}-${pointIndex}`} className="highlight-item">
                          <FaStar className="highlight-icon" />
                          <span className="highlight-content">{point}</span>
                        </div>
                      ));
                    }).flat()}
                  </div>
                </div>
              )}

              {/* Inclusions Section */}
              <div className="inclusions">
                <h2>Inclusions</h2>
                <div className="includes-excludes-grid">
                  <div className="includes-section">
                    <h3>What's Included</h3>
                    <ul className="includes-list">
                      {tour.includes && tour.includes.map((item, index) => {
                        const points = item.split(',,').map(point => point.trim()).filter(point => point !== '');
                        return points.map((point, pointIndex) => (
                          <li key={`${index}-${pointIndex}`}>
                            <FaCheck className="include-icon" />
                            <span>{point}</span>
                          </li>
                        ));
                      }).flat()}
                    </ul>
                  </div>

                  <div className="excludes-section">
                    <h3>What's Not Included</h3>
                    <ul className="excludes-list">
                      {tour.excludes && tour.excludes.map((item, index) => {
                        const points = item.split(',,').map(point => point.trim()).filter(point => point !== '');
                        return points.map((point, pointIndex) => (
                          <li key={`${index}-${pointIndex}`}>
                            <FaTimes className="exclude-icon" />
                            <span>{point}</span>
                          </li>
                        ));
                      }).flat()}
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
