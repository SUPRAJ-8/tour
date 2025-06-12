import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaArrowLeft, 
  FaInfoCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaMapMarkerAlt,
  FaClock,
  FaPlane,
  FaPassport,
  FaLanguage,
  FaRegClock,
  FaHotel,
  FaUtensils,
  FaCarSide
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';
import './BookingForm.css';

const BookingForm = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { tours } = useData();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    numberOfPeople: 1,
    paymentMethod: 'credit_card',
    specialRequests: '',
    agreeToTerms: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Tour Options, 3: Payment

  useEffect(() => {
    const fetchTour = async () => {
      try {
        // Ensure tourId is a valid MongoDB ObjectId format
        if (!tourId || !/^[0-9a-fA-F]{24}$/.test(tourId)) {
          setError('Invalid tour ID. Please check the URL and try again.');
          setLoading(false);
          return;
        }

        // First try to find the tour in the context
        if (tours && tours.length > 0) {
          const foundTour = tours.find(t => t._id === tourId);
          if (foundTour) {
            setTour(foundTour);
            setLoading(false);
            return;
          }
        }

        // If not found in context, fetch from API
        const res = await axios.get(`/api/tours/${tourId}`);
        const tourData = res.data.data;
        
        if (!tourData) {
          setError('Tour not found. Please check the URL and try again.');
          setLoading(false);
          return;
        }

        setTour(tourData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError(err.response?.data?.message || 'Failed to load tour details. Please try again later.');
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId, tours]);

  
  // Generate available dates for the tour (next 3 months)
  const generateAvailableDates = (tourData) => {
    const dates = [];
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + 3); // 3 months from now
    
    // If tour has specific start dates, use those
    if (tourData.startDates && tourData.startDates.length > 0) {
      tourData.startDates.forEach(dateString => {
        const date = new Date(dateString);
        if (date > today) {
          dates.push(date);
        }
      });
    } else {
      // Otherwise generate dates every 3 days for the next 3 months
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + 3); // Start 3 days from now
      
      while (currentDate < endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 3);
      }
    }
    
    setAvailableDates(dates);
    
    // Set the first available date as the default
    if (dates.length > 0) {
      setBookingData(prev => ({
        ...prev,
        startDate: dates[0]
      }));
    }
  };

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
    
    // Clear error for this field
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const handleDateChange = (date) => {
    setBookingData({
      ...bookingData,
      startDate: date
    });
    
    // Clear error for startDate
    if (formErrors.startDate) {
      setFormErrors({ ...formErrors, startDate: '' });
    }
  };
  
  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      const errors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9\+\-\s]{7,15}$/;
      
      if (!bookingData.name.trim()) {
        errors.name = 'Name is required';
      }
      
      if (!bookingData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!emailRegex.test(bookingData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (!bookingData.phone.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(bookingData.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }
    
    if (step === 2) {
      const errors = {};
      const today = new Date();
      
      if (!bookingData.startDate) {
        errors.startDate = 'Start date is required';
      } else if (bookingData.startDate < today) {
        errors.startDate = 'Start date cannot be in the past';
      }
      
      if (!bookingData.numberOfPeople || bookingData.numberOfPeople < 1) {
        errors.numberOfPeople = 'Number of people must be at least 1';
      } else if (tour && tour.maxGroupSize && bookingData.numberOfPeople > tour.maxGroupSize) {
        errors.numberOfPeople = `Maximum group size is ${tour.maxGroupSize}`;
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }
    
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get tour details to calculate price and total amount
      const tourResponse = await axios.get(`/api/tours/${tourId}`);
      const tour = tourResponse.data;

      // Validate form data
      const errors = {};
      
      // Basic validation
      if (!bookingData.name?.trim()) {
        errors.name = 'Name is required';
      }

      if (!bookingData.email?.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
        errors.email = 'Please enter a valid email address';
      }

      if (!bookingData.phone?.trim()) {
        errors.phone = 'Phone number is required';
      }

      if (!bookingData.startDate) {
        errors.startDate = 'Start date is required';
      } else if (new Date(bookingData.startDate) < new Date()) {
        errors.startDate = 'Start date cannot be in the past';
      }

      if (!bookingData.numberOfPeople || bookingData.numberOfPeople < 1) {
        errors.numberOfPeople = 'Number of people must be at least 1';
      } else if (tour.maxGroupSize && bookingData.numberOfPeople > tour.maxGroupSize) {
        errors.numberOfPeople = `Maximum group size is ${tour.maxGroupSize}`;
      }

      if (!bookingData.paymentMethod) {
        errors.paymentMethod = 'Payment method is required';
      }

      if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
      }

      let bookingPayload;
      let endpoint;
      if (!isAuthenticated) {
        // For guest booking, send only validated fields at root
        bookingPayload = {
          tour: tourId,
          name: bookingData.name.trim(),
          email: bookingData.email.trim(),
          phone: bookingData.phone.trim(),
          startDate: bookingData.startDate.toISOString(),
          numberOfPeople: parseInt(bookingData.numberOfPeople),
          paymentMethod: bookingData.paymentMethod.toLowerCase(),
          specialRequests: bookingData.specialRequests || ''
        };
        endpoint = '/api/bookings/guest';
      } else {
        // For authenticated booking, send full payload
        bookingPayload = {
          tour: tourId,
          name: bookingData.name.trim(),
          email: bookingData.email.trim(),
          phone: bookingData.phone.trim(),
          startDate: bookingData.startDate.toISOString(),
          numberOfPeople: parseInt(bookingData.numberOfPeople),
          paymentMethod: bookingData.paymentMethod.toLowerCase(),
          specialRequests: bookingData.specialRequests || '',
          user: user._id,
          price: tour.price,
          currency: tour.currency || 'NPR',
          totalAmount: tour.price * parseInt(bookingData.numberOfPeople),
          status: 'pending',
          paymentStatus: 'pending'
        };
        endpoint = '/api/bookings';
      }
      
      // Log request payload and endpoint for debugging
      console.log('Guest booking submit:', { endpoint, bookingPayload });
      const response = await axios.post(endpoint, bookingPayload);
      
      if (response.data.success) {
        setBookingSuccess(true);
        setIsSubmitting(false);
        toast.success('Booking successful! Check your email for confirmation.');
      } else {
        console.error('Backend error:', response.data);
        throw new Error(response.data.message || 'Booking failed');
      }
      
    } catch (err) {
      console.error('Error creating booking:', err);
      
      // Handle different types of errors
      // Log backend error for debugging
      console.error('FULL AXIOS ERROR OBJECT:', err);
      if (err.response) {
        console.error('Backend error response:', err.response.data);
      } else {
        console.error('No backend response. Error:', err.message);
      }
      if (err.response?.data?.errors) {
        // Handle validation errors from backend
        setError(Object.values(err.response.data.errors).join('\n'));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create booking. Please check all fields.');
      }
      
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (bookingSuccess) {
    const bookingRef = `BK${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    return (
      <div className="container">
        <div className="success-container">
          <div className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2>Booking Successful!</h2>
          <p>Thank you for booking the {tour.title}. We've sent a confirmation email to {bookingData.email}.</p>
          <div className="booking-details">
            <div className="booking-detail-item">
              <span className="detail-label">Booking Reference:</span>
              <span className="detail-value">{bookingRef}</span>
            </div>
            <div className="booking-detail-item">
              <span className="detail-label">Tour Date:</span>
              <span className="detail-value">{bookingData.startDate.toLocaleDateString()}</span>
            </div>
            <div className="booking-detail-item">
              <span className="detail-label">Number of People:</span>
              <span className="detail-value">{bookingData.numberOfPeople}</span>
            </div>
            <div className="booking-detail-item">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value">NPR {(tour.price * bookingData.numberOfPeople).toLocaleString()}</span>
            </div>
          </div>
          <p className="booking-note">Please save your booking reference for future inquiries.</p>
          <div className="success-actions">
            <Link to="/tours" className="btn btn-outline">Explore More Tours</Link>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = tour.price * bookingData.numberOfPeople;

  const renderPersonalInfo = () => {
    return (
      <div className="form-section">
        <h2 className="form-title">Book for 4N/5D Bangkok-Pattaya Tour Package</h2>
        <button className="modal-close">×</button>
        
        <div className="form-group">
          <label className="form-label">
            <FaUser className="input-icon" />
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={bookingData.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your Full Name"
          />
          {formErrors.name && <div className="error-message">{formErrors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaEnvelope className="input-icon" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={bookingData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your Email Address"
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          />
          {formErrors.email && <div className="error-message">{formErrors.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaPhone className="input-icon" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={bookingData.phone}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your Phone Number"
            pattern="^[0-9]+$"
            inputMode="numeric"
            required
          />
          {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaUsers className="input-icon" />
            Total No. of Travellers
          </label>
          <input
            type="number"
            name="numberOfPeople"
            min="1"
            step="1"
            value={bookingData.numberOfPeople}
            onChange={e => setBookingData({ ...bookingData, numberOfPeople: parseInt(e.target.value) || '' })}
            className="form-control"
            placeholder="Enter the no. of Travellers"
          />
          {formErrors.numberOfPeople && <div className="error-message">{formErrors.numberOfPeople}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaCalendarAlt className="input-icon" />
            Tour Start Date
          </label>
          <DatePicker
            selected={bookingData.startDate}
            onChange={handleDateChange}
            minDate={new Date()}
            className="form-control"
            placeholderText="mm/dd/yyyy"
            dateFormat="MM/dd/yyyy"
            includeDates={availableDates}
          />
          {formErrors.startDate && <div className="error-message">{formErrors.startDate}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaComments className="input-icon" />
            Message
          </label>
          <textarea
            name="specialRequests"
            value={bookingData.specialRequests}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Any messeries/queries/inquiries you would like to convey to us."
          />
        </div>

        <div className="form-group full-width" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <label className="checkbox-label" style={{ fontWeight: 400 }}>
            <input
              type="checkbox"
              checked={bookingData.agreeToTerms || false}
              onChange={e => setBookingData({ ...bookingData, agreeToTerms: e.target.checked })}
              style={{ accentColor: '#2196F3' }}
            />
            <span>
              By submitting, you agree to our and{' '}
              <Link to="/terms" style={{ color: '#2196F3', fontWeight: 500 }}>Terms & Conditions</Link>{' '}and{' '}
              <Link to="/privacy" style={{ color: '#2196F3', fontWeight: 500 }}>Privacy Policy</Link>.
            </span>
          </label>
        </div>
        <div className="form-actions full-width" style={{ marginTop: 0 }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !bookingData.agreeToTerms}
            style={{ minWidth: 180 }}
          >
            {isSubmitting ? 'Processing...' : 'Submit Booking'}
          </button>
        </div>
      </div>
    );
  };

  const renderBookingSummary = () => {
    return (
      <div className="booking-summary">
        <div className="summary-card">
          <h3 className="summary-title">
            <FaInfoCircle className="summary-icon" /> Booking Summary
          </h3>
          
          <div className="tour-info">
            <img src={tour.coverImage} alt={tour.title} className="tour-image" />
            <div className="tour-details">
              <h4>{tour.title}</h4>
              <div className="tour-meta">
                <div className="meta-item">
                  <FaRegClock className="meta-icon" />
                  <span>{tour.duration} days</span>
                </div>
                <div className="meta-item">
                  <FaUsers className="meta-icon" />
                  <span>Max {tour.maxGroupSize || 15} people</span>
                </div>
                <div className="meta-item">
                  <FaMapMarkerAlt className="meta-icon" />
                  <span>{tour.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="tour-highlights">
            <div className="highlight-item">
              <FaHotel className="highlight-icon" />
              <span>Hotel Accommodation</span>
            </div>
            <div className="highlight-item">
              <FaUtensils className="highlight-icon" />
              <span>Meals Included</span>
            </div>
            <div className="highlight-item">
              <FaCarSide className="highlight-icon" />
              <span>Transportation</span>
            </div>
          </div>
          
          <div className="price-breakdown">
            <div className="price-item">
              <span>
                <FaUser className="price-icon" /> Tour Price (per person)
              </span>
              <span>NPR {tour.price.toLocaleString()}</span>
            </div>
            <div className="price-item">
              <span>
                <FaUsers className="price-icon" /> Number of People
              </span>
              <span>{bookingData.numberOfPeople}</span>
            </div>
            <div className="price-item total">
              <span>
                <FaMoneyBillWave className="price-icon" /> Total Amount
              </span>
              <span>NPR {(tour.price * bookingData.numberOfPeople).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="booking-notes">
            <h4>
              <FaInfoCircle className="note-icon" /> Important Notes:
            </h4>
            <ul>
              <li>
                <FaCreditCard className="note-list-icon" />
                <span>20% deposit required to confirm booking</span>
              </li>
              <li>
                <FaCalendarAlt className="note-list-icon" />
                <span>Full payment due 30 days before tour</span>
              </li>
              <li>
                <FaClock className="note-list-icon" />
                <span>Free cancellation up to 14 days before tour</span>
              </li>
              <li>
                <FaPassport className="note-list-icon" />
                <span>Valid passport required for travel</span>
              </li>
              <li>
                <FaLanguage className="note-list-icon" />
                <span>English-speaking guide provided</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <FaInfoCircle /> {error}
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="error-message">
        <FaInfoCircle /> Tour not found
      </div>
    );
  }

  return (
    <section className="booking-page">
      <div className="container">
        <div className="booking-header">
          <Link to={`/tours/${tourId}`} className="back-link">
            <FaArrowLeft /> Back to Tour
          </Link>
          <h1>Book Your Tour</h1>
          <h2 className="tour-title">{tour.title}</h2>
          <div className="tour-quick-info">
            <div className="quick-info-item">
              <FaMapMarkerAlt className="info-icon" />
              <span><strong>Country:</strong> {tour.country}</span>
            </div>
            <div className="quick-info-item">
              <FaRegClock className="info-icon" />
              <span><strong>Duration:</strong> {tour.days} Days / {tour.nights} Nights</span>
            </div>
            <div className="quick-info-item">
              <FaCalendarAlt className="info-icon" />
              <span><strong>Best Season:</strong> {tour.bestTimeToVisit}</span>
            </div>
            <div className="quick-info-item">
              <FaUsers className="info-icon" />
              <span><strong>Group Size:</strong> {tour.groupSize}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="booking-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Personal Details</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Tour Options</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Payment</div>
          </div>
        </div>
        
        <div className="booking-content">
          <div className="booking-form-container">
            <form onSubmit={handleSubmit} className="booking-form">
              {renderPersonalInfo()}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;