import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaUsers, FaCreditCard, FaMoneyBillWave, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
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
    specialRequests: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Tour Options, 3: Payment

  useEffect(() => {
    const fetchTour = async () => {
      try {
        // First try to find the tour in the context
        if (tours && tours.length > 0) {
          const foundTour = tours.find(t => t._id === tourId);
          if (foundTour) {
            setTour(foundTour);
            generateAvailableDates(foundTour);
            setLoading(false);
            return;
          }
        }
        
        // If not found in context, fetch from API
        const res = await axios.get(`/api/tours/${tourId}`);
        const tourData = res.data.data;
        setTour(tourData);
        generateAvailableDates(tourData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Failed to load tour details');
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

  const validateForm = () => {
    const errors = {};
    const today = new Date();
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
    
    if (!bookingData.paymentMethod) {
      errors.paymentMethod = 'Payment method is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const bookingPayload = {
          tour: tourId,
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          startDate: bookingData.startDate,
          numberOfPeople: parseInt(bookingData.numberOfPeople),
          paymentMethod: bookingData.paymentMethod,
          specialRequests: bookingData.specialRequests,
          user: user?._id // Include user ID if authenticated
        };
        
        // Choose endpoint based on authentication status
        const endpoint = isAuthenticated ? '/api/bookings' : '/api/bookings/guest';
        await axios.post(endpoint, bookingPayload);
        
        setBookingSuccess(true);
        setIsSubmitting(false);
        toast.success('Booking successful! Check your email for confirmation.');
        
      } catch (err) {
        console.error('Error creating booking:', err);
        setError(err.response?.data?.message || 'Failed to create booking');
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading booking form...</p>
      </div>
    );
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

  return (
    <section className="booking-page">
      <div className="container">
        <div className="booking-header">
          <Link to={`/tours/${tourId}`} className="back-link">
            <FaArrowLeft /> Back to Tour
          </Link>
          <h1>Book Your Tour</h1>
          <p>Complete the form below to book {tour.title}</p>
        </div>
        
        {/* Progress Steps */}
        <div className="booking-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Personal Details</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
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
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div className="form-step">
                  <h3>Personal Details</h3>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                      value={bookingData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && (
                      <div className="error-message">{formErrors.name}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      value={bookingData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && (
                      <div className="error-message">{formErrors.email}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                      value={bookingData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phone && (
                      <div className="error-message">{formErrors.phone}</div>
                    )}
                  </div>
                  
                  <div className="form-actions">
                    <Link to={`/tours/${tourId}`} className="btn btn-outline">
                      Cancel
                    </Link>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={nextStep}
                    >
                      Next: Tour Options
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Tour Options */}
              {step === 2 && (
                <div className="form-step">
                  <h3>Tour Options</h3>
                  
                  <div className="form-group">
                    <label htmlFor="startDate" className="form-label">Tour Start Date</label>
                    <div className="date-picker-container">
                      <DatePicker
                        selected={bookingData.startDate}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`}
                        dateFormat="MMMM d, yyyy"
                        includeDates={availableDates.length > 0 ? availableDates : null}
                      />
                      <FaCalendarAlt className="date-picker-icon" />
                    </div>
                    {formErrors.startDate && (
                      <div className="error-message">{formErrors.startDate}</div>
                    )}
                    {availableDates.length > 0 && (
                      <div className="form-hint">
                        <FaInfoCircle /> Only highlighted dates are available for booking
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="numberOfPeople" className="form-label">Number of People</label>
                    <input
                      type="number"
                      id="numberOfPeople"
                      name="numberOfPeople"
                      className={`form-control ${formErrors.numberOfPeople ? 'is-invalid' : ''}`}
                      value={bookingData.numberOfPeople}
                      onChange={handleChange}
                      min="1"
                      max={tour.maxGroupSize || 15}
                    />
                    {formErrors.numberOfPeople && (
                      <div className="error-message">{formErrors.numberOfPeople}</div>
                    )}
                    <div className="form-hint">
                      <FaInfoCircle /> Maximum group size: {tour.maxGroupSize || 15} people
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="specialRequests" className="form-label">Special Requests (Optional)</label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      className="form-control"
                      value={bookingData.specialRequests}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Any special requirements or requests..."
                    ></textarea>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={nextStep}
                    >
                      Next: Payment
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="form-step">
                  <h3>Payment Details</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <div className="payment-methods">
                      <div className="payment-method">
                        <input
                          type="radio"
                          id="credit_card"
                          name="paymentMethod"
                          value="credit_card"
                          checked={bookingData.paymentMethod === 'credit_card'}
                          onChange={handleChange}
                        />
                        <label htmlFor="credit_card">
                          <FaCreditCard />
                          <span>Credit Card</span>
                        </label>
                      </div>
                      
                      <div className="payment-method">
                        <input
                          type="radio"
                          id="paypal"
                          name="paymentMethod"
                          value="paypal"
                          checked={bookingData.paymentMethod === 'paypal'}
                          onChange={handleChange}
                        />
                        <label htmlFor="paypal">
                          <FaMoneyBillWave />
                          <span>PayPal</span>
                        </label>
                      </div>
                      
                      <div className="payment-method">
                        <input
                          type="radio"
                          id="bank_transfer"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={bookingData.paymentMethod === 'bank_transfer'}
                          onChange={handleChange}
                        />
                        <label htmlFor="bank_transfer">
                          <FaMoneyBillWave />
                          <span>Bank Transfer</span>
                        </label>
                      </div>
                    </div>
                    {formErrors.paymentMethod && (
                      <div className="error-message">{formErrors.paymentMethod}</div>
                    )}
                  </div>
                  
                  <div className="payment-note">
                    <FaInfoCircle />
                    <p>A 20% deposit (NPR {(totalPrice * 0.2).toLocaleString()}) is required to confirm your booking. The remaining balance will be due 30 days before your tour date.</p>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          <div className="booking-summary">
            <div className="summary-card">
              <h3>Booking Summary</h3>
              
              <div className="tour-info">
                <img src={tour.coverImage} alt={tour.title} className="tour-image" />
                <div className="tour-details">
                  <h4>{tour.title}</h4>
                  <div className="tour-meta">
                    <div className="meta-item">
                      <FaCalendarAlt />
                      <span>{tour.duration} days</span>
                    </div>
                    <div className="meta-item">
                      <FaUsers />
                      <span>Max {tour.maxGroupSize || 15} people</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Tour Price</span>
                  <span>NPR {tour.price.toLocaleString()} per person</span>
                </div>
                <div className="price-item">
                  <span>Number of People</span>
                  <span>{bookingData.numberOfPeople}</span>
                </div>
                <div className="price-item total">
                  <span>Total</span>
                  <span>NPR {totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="booking-notes">
                <h4>Important Notes:</h4>
                <ul>
                  <li>A 20% deposit is required to confirm your booking.</li>
                  <li>Full payment is due 30 days before the tour start date.</li>
                  <li>Free cancellation up to 14 days before the tour.</li>
                  <li>Read our <Link to="/terms-of-service">Terms of Service</Link> for more details.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
