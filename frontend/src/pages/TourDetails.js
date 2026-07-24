import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaClock, 
  FaCheck, FaTimes, FaInfoCircle, FaPassport, FaUmbrellaBeach, FaDownload, FaShare, FaHeart, FaExpand, FaMapMarkedAlt, FaCheckCircle, FaTag, FaCog, FaArrowRight, FaEnvelope, FaPhone, FaUser, FaFlag, FaWhatsapp, FaRegCalendar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';
import TourDetailsSkeleton from '../components/TourDetailsSkeleton';
import SEO from '../components/SEO';
import './TourDetails.css';

// Swiper for related tours
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

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
                    <span>{tour.type === 'visa' ? (tour.duration || '') : `${tour.nights} Nights - ${tour.days} Days`}</span>
                  </div>
                  <div className="detail-item">
                    <img src="images/icons/weather.svg" alt="" className="detail-icon" />
                    <span className="detail-label">Best Season:</span>
                    <span>{tour.bestSeason || tour.bestTimeToVisit}</span>
                  </div>
                  <div className="detail-item">
                    <img src="images/icons/group.svg" alt="" className="detail-icon" />
                    <span className="detail-label">Group Size:</span>
                    <span>{tour.groupSize} </span>
                  </div>
                </div>
              </div>
              
              {/* Confusion Section */}
              <div className="confusion-section modal-confusion">
                <h3>Have confusion?</h3>
                <p>Feel free to call us with any questions or uncertainties.</p>
                <a href="https://wa.me/+9779765198757" className="whatsapp-link" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp /> +9779765198757
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
  const prevRelatedRef = useRef(null);
  const nextRelatedRef = useRef(null);
  // accordion state for itinerary
  const [openDays, setOpenDays] = useState([]);
  const toggleDay = (idx) => {
    setOpenDays((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [isVisa, setIsVisa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  // Related tours
  const [relatedTours, setRelatedTours] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { tours } = useData();

  // Fetch tour or visa by ID
  const fetchTourData = async () => {
    if (!id) return;

    // Only show skeleton if fetch takes longer than 200ms
    const timeoutId = setTimeout(() => setLoading(true), 200);
    setError(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      let fetchedTour = null;

      // Try tour endpoint first; if it fails for any reason, fall back to visa
      try {
        const tourResp = await axios.get(`${apiUrl}/api/tours/${id}`);
        if (tourResp.data?.success) {
          fetchedTour = tourResp.data.data;
        }
      } catch (err) {
        // Log but continue to attempt visa endpoint
        console.warn('Tour fetch failed, trying visa endpoint', err?.response?.status);
      }

      // Fallback to visa endpoint
      if (!fetchedTour) {
        try {
          const visaResp = await axios.get(`${apiUrl}/api/visas/${id}`);
          const visaRaw = visaResp.data?.data || visaResp.data; // handle different shapes
          const visa = visaRaw?.data || visaRaw; // support nested data
          if (visa) {
            fetchedTour = {
              ...visa,
              title: visa.tourPackageName || visa.title || 'Working Visa',
              destination: { country: visa.destination || visa.country },
              coverImage: visa.mainCoverImage || visa.coverImage,
              images: visa.heroImages || visa.images || [],
              nights: visa.nights || 0,
            type: 'visa',
          groupSize: visa.groupSize || visa.group_size || '',
          bestSeason: visa.bestSeason || visa.best_season || '',
              days: visa.days || 0,
            };
          }
        } catch (visaErr) {
          // ignore, will handle below
        }
      }

      if (fetchedTour) {
        setTour(fetchedTour);
        setIsVisa(fetchedTour.type === 'visa');
      } else {
        setError('Tour or Visa not found');
      }
    } catch (err) {
      console.error('Error fetching details:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch details');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourData();
  }, [id]);

  // Load related tours once main tour is fetched
  // Fetch related tours once the main tour is available
  useEffect(() => {
    if (!tour) return;

    const fetchRelatedTours = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const endpoint = (tour && (tour.type === 'visa' || isVisa)) ? '/api/visas' : '/api/tours';
    const response = await axios.get(`${apiUrl}${endpoint}`);

        // Normalise the response to an array (handles various shapes)
        let allTours = [];
        const resData = response.data;
        if (Array.isArray(resData)) {
          allTours = resData;
        } else if (Array.isArray(resData?.data)) {
          allTours = resData.data;
        } else if (Array.isArray(resData?.data?.data)) {
          allTours = resData.data.data;
        } else if (resData && typeof resData === 'object') {
          allTours = [resData];
        }

        // Map each tour/visa to ensure a consistent `coverImage` field for rendering
        allTours = allTours.map(t => ({
          ...t,
          coverImage: t.coverImage || t.mainCoverImage || t.imageCover || t.image_cover || t.image_cover_url || '',
          title: t.title || t.tourPackageName || t.name || 'Untitled',
          destination: (typeof t.destination === 'string' ? { country: t.destination } : t.destination) || (t.country ? { country: t.country } : undefined),
          country: t.country || (typeof t.destination === 'string' ? t.destination : (t.destination && t.destination.country)) || ''
        }));

        // Exclude the current tour from suggestions
        allTours = allTours.filter(
          (t) => (t._id || t.id) !== (tour._id || tour.id)
        );

        // Filter by country / destination if possible
        const tourCountry =
          (tour.destination && tour.destination.country) || tour.country || '';
        let filtered = allTours;
        if (tourCountry) {
          const countryLower = tourCountry.toLowerCase();
          const countryMatches = allTours.filter((t) => {
            const c = (t.destination && t.destination.country) || t.country || '';
            return c && c.toLowerCase() === countryLower;
          });
          if (countryMatches.length >= 4) {
            filtered = countryMatches;
          }
        }
        // If still empty, use the entire list except current
        if (filtered.length === 0) {
          filtered = allTours;
        }

        // Shuffle (Fisher–Yates)
        for (let i = filtered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
        }

        // If no items found for visas, fallback to tours list
        if (filtered.length === 0 && endpoint === '/api/visas') {
          try {
            const toursResp = await axios.get(`${apiUrl}/api/tours`);
            let tourRes = toursResp.data;
            let tourList = [];
            if (Array.isArray(tourRes)) {
              tourList = tourRes;
            } else if (Array.isArray(tourRes?.data)) {
              tourList = tourRes.data;
            } else if (Array.isArray(tourRes?.data?.data)) {
              tourList = tourRes.data.data;
            }
            tourList = tourList.filter((t) => (t._id || t.id) !== (tour._id || tour.id));
            // simple shuffle
            for (let i = tourList.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [tourList[i], tourList[j]] = [tourList[j], tourList[i]];
            }
            filtered = tourList.slice(0,6);
          } catch(err) {
            console.error('Fallback tour fetch failed:', err);
          }
        }

        const finalList = filtered.slice(0,6);
        console.log('Related items found:', finalList.length, finalList);
        setRelatedTours(finalList);
      } catch (err) {
        console.error('Error fetching related tours:', err);
      }
    };

    fetchRelatedTours();
  }, [tour]);
  
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

  // Show skeleton while loading OR when tour is null and no error (initial state)
  if (loading || (!tour && !error)) {
    return <TourDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className={`tour-details-page ${isVisa ? 'visa-details-page' : ''}`}>
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
      <div className={`tour-details-page ${isVisa ? 'visa-details-page' : ''}`}>
        <SEO title="Tour Not Found" canonical={`https://goldenhopetravels.com/tours/${id}`} noIndex />
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
    <section className={`tour-details-page ${isVisa ? 'visa-details-page' : ''}`}>
      <SEO
        title={tour.title}
        description={
          (tour.summary && tour.summary.slice(0, 155)) ||
          (tour.description && tour.description.replace(/<[^>]*>/g, '').slice(0, 155)) ||
          `Book ${tour.title} with Golden Hope Travels — ${tour.destination?.country || tour.country || ''} tour package.`
        }
        canonical={`https://goldenhopetravels.com/${isVisa ? 'working-visa' : 'tours'}/${tour._id || id}`}
      />
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
        {/* Tour Header */}
        <div className="tour-header">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span className="breadcrumb-arrow">›</span>
            <Link to="/tours">Tours</Link> <span className="breadcrumb-arrow">›</span>
            <Link to={`/countries/${tour.category}/${tour.destination?._id || tour.destination}`}>{tour.destination?.name || tour.country}</Link> <span className="breadcrumb-arrow">›</span>
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
            <span className="duration-value">
              {isVisa ? (tour.duration || '') : `${tour.nights} Nights - ${tour.days} Days`}
            </span>
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
                  <span className="meta-value">
                    {isVisa ? (tour.duration || '') : `${tour.nights} Nights - ${tour.days} Days`}
                  </span>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">
                  <img src="/images/icons/group.svg" alt="Group Size" />
                </div>
                <div className="meta-content">
                  <span className="meta-label">Group Size</span>
                  <span className="meta-value">{tour.groupSize} </span>
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
                  <p className="confusion-title">Have confusion?</p>
                  <p>Feel free to call us with any questions or uncertainties.</p>
                  <a href="https://wa.me/+9779765198757" className="whatsapp-link">
                    <FaWhatsapp /> +9779765198757
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
              <div className="tour-description ql-editor">
                <h2>Tour Overview</h2>
                {tour.description ? (
                  <div className="rich-text" dangerouslySetInnerHTML={{ __html: tour.description }} />
                ) : (
                  <p>{`Experience the best of ${tour.title || 'this destination'} with our comprehensive tour package. This carefully crafted itinerary takes you through the most iconic landmarks and hidden gems, ensuring an unforgettable journey.`}</p>
                )}
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
              {(!isVisa || ((tour.includes && tour.includes.some(item => item && item.trim() !== '')) || (tour.excludes && tour.excludes.some(item => item && item.trim() !== '')))) && (
              <div className="inclusions">
                <h2>Inclusions</h2>
                <div className="includes-excludes-grid">
                  {tour.includes && tour.includes.some(item => item && item.trim() !== '') && (
                  <div className="includes-section">
                    <h3>What's Included</h3>
                    <ul className="includes-list">
                      {tour.includes.map((item, index) => {
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
                  )}

                  {tour.excludes && tour.excludes.some(item => item && item.trim() !== '') && (
                  <div className="excludes-section">
                    <h3>What's Not Included</h3>
                    <ul className="excludes-list">
                      {tour.excludes.map((item, index) => {
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
                  )}
                </div>
              </div>
              )}

              {/* Visa Headlines */}
              {isVisa && tour.headlines && tour.headlines.length > 0 && (
                <div className="visa-section visa-headlines">
                  {tour.headlines.map((h, idx)=>(
                    <div key={idx} className="visa-headline-item">
                      {h.title && <h2>{h.title}</h2>}
                      {h.details && (
                        <ul className="headline-details-list">
                          {h.details.split(',,').map((d,i)=>(d.trim() && <li key={i}>{d.trim()}</li>))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Visa Specific Sections */}
              {/* Job Opportunities Section */}
              {/* Removed Job Opportunities section */
/*
                <div className="visa-section job-opportunities">
                  <h2>Job Opportunities</h2>
                  <ul>
                    {tour.jobOpportunities.map((job, idx) => (
                      <li key={idx}>{job}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Removed Work Permit/Visa section */ /*
                <div className="visa-section work-permit">
                  <h2>Work Permit/Visa</h2>
                  {tour.workPermitVisa && (
                    <p>{tour.workPermitVisa}</p>
                  )}
                  
                </div>
              )}

              {/* Existing sections */}
              {/* Removed Common Sectors section */ /*
                <div className="visa-section common-sectors">
                  <h2>{tour.sectorsTitle || 'Common Sectors Available'}</h2>
                  <ul>
                    {tour.workPermitVisa.split(/\n|,,/).map((item, idx)=>(
                      item.trim() && <li key={idx}>{item.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Removed Requirements section */ /*
                <div className="visa-section req-to-work">
                  <h2>{tour.requirementsTitle || 'Requirements to Work'}</h2>
                  <ul>
                    {tour.requirements.map((req, idx)=>{
                      const points=req.split(',,').map(p=>p.trim()).filter(Boolean);
                      return points.map((p,i)=>(<li key={`${idx}-${i}`}>{p}</li>));
                    })}
                  </ul>
                </div>
              )}

              {/* Removed Application Process section */ /*
                <div className="visa-section app-process">
                  <h2>{tour.applicationProcessTitle || 'Application Process'}</h2>
                  <ul>
                    {tour.importantNotes.map((note, idx)=>{
                      const points=note.split(',,').map(p=>p.trim()).filter(Boolean);
                      return points.map((p,i)=>(<li key={`${idx}-${i}`}>{p}</li>));
                    })}
                  </ul>
                </div>
              )}

              {/* Removed Things to Keep in Mind section */ /*
                <div className="visa-section keep-mind">
                  <h2>Things to Keep in Mind</h2>
                  <ul>
                    {tour.culturalNotes.map((note, idx)=>{
                      const points=note.split(',,').map(p=>p.trim()).filter(Boolean);
                      return points.map((p,i)=>(<li key={`${idx}-${i}`}>{p}</li>));
                    })}
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
               {(!isVisa || (tour.itinerary && tour.itinerary.length > 0)) && (
               <div className="tour-itinerary">
                 <h2>Itinerary</h2>
                 <div className="itinerary-days">
                   {tour.itinerary && tour.itinerary.length > 0 ? (
                     tour.itinerary.map((day, index) => (
                       <div className={`itinerary-day ${openDays.includes(index)?'open':''}`} key={index}>
                         <div className="day-header" onClick={() => toggleDay(index)}>
                           <div className="header-text">
                             <span className="day-number">DAY {String(index+1).padStart(2,'0')}</span>
                            <h3 className="day-title">{day.title || day.dayTitle || `Day ${index+1}`}</h3>
                           </div>
                           <FaChevronDown className={`chevron ${openDays.includes(index)?'rotate':''}`} />
                         </div>
                         {openDays.includes(index) && (
             <div className="day-content">
                           {day.description && (
                               <div className="rich-text" dangerouslySetInnerHTML={{ __html: day.description }} />
                             )}
                           {day.activities && day.activities.filter(a=>a && a.trim()!=='').length > 0 && (
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
           )}
         </div>
                     ))
                   ) : (
                      <p>Detailed itinerary will be provided upon booking.</p>
                    ) }
                 </div>
               </div>
               )}

            </div>

            <div className="tour-sidebar">
            </div>
          </div>
        </div>
        </div>

      {/* Related Tours */}
      {relatedTours && relatedTours.length > 0 && (
        <div className="related-tours-section">
          <h2 className="related-title">Discover Similar Tours You'll Love</h2>
          <div className="related-swiper-wrapper">
            <div className="custom-nav-btn prev" ref={prevRelatedRef}><FaChevronLeft/></div>
            <div className="custom-nav-btn next" ref={nextRelatedRef}><FaChevronRight/></div>

            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{ prevEl: prevRelatedRef.current, nextEl: nextRelatedRef.current }}
              onInit={(swiper)=>{swiper.params.navigation.prevEl=prevRelatedRef.current;swiper.params.navigation.nextEl=nextRelatedRef.current;swiper.navigation.init();swiper.navigation.update();}}
              spaceBetween={20}
              loop={relatedTours.length>3}
              breakpoints={{
                0: { slidesPerView: 1.2 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 4 }
              }}
              grabCursor={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="related-tours-swiper"
            >
              {relatedTours.map((rt) => (
                <SwiperSlide key={rt._id || rt.id}>
                  <Link to={`/tours/${rt._id || rt.id}`} className="tour-card">
                    <div className="tour-image">
                      <img
                        src={rt.coverImage || rt.imageCover || '/images/placeholder.jpg'}
                        alt={rt.title || rt.name}
                      />
                    </div>
                    <div className="tour-info">
                      <div className="tour-rating">
                        <FaStar style={{ color: '#f39c12' }} />{' '}
                        {Number(rt.ratingsAverage || 5).toFixed(1)}
                      </div>
                      <h3 className="tour-name">{rt.title || rt.name}</h3>
                      <div className="tour-location">
                        <FaMapMarkerAlt />
                        <span>
                          {(rt.destination && rt.destination.country) || rt.country}
                        </span>
                      </div>
                      <div className="tour-duration-info">
                        <FaCalendarAlt />{' '}
                        {rt.nights ? `${rt.nights} Nights - ${rt.days || ''} Days` : (rt.days ? `${rt.days} Days` : (rt.duration || '?'))}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Mobile fixed Book button */}
      <button className="mobile-book-btn" onClick={handleBookNow}>
        Book This Tour
      </button>

      <BookingFormModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        tour={tour}
      />
    </section>
  );
};

export default TourDetails;