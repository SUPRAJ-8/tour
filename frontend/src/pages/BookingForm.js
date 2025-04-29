import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaUsers, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './BookingForm.css';

const BookingForm = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    numberOfPeople: 1,
    paymentMethod: 'credit_card',
    specialRequests: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axios.get(`/api/tours/${tourId}`);
        setTour(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Failed to load tour details');
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

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

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
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
    }
    
    if (!bookingData.startDate) {
      errors.startDate = 'Start date is required';
    } else if (bookingData.startDate < today) {
      errors.startDate = 'Start date cannot be in the past';
    }
    
    if (!bookingData.numberOfPeople || bookingData.numberOfPeople < 1) {
      errors.numberOfPeople = 'Number of people must be at least 1';
    } else if (tour && bookingData.numberOfPeople > tour.maxGroupSize) {
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
          specialRequests: bookingData.specialRequests
        };
        
        // For direct bookings without login, use a different endpoint
        await axios.post('/api/bookings/guest', bookingPayload);
        setBookingSuccess(true);
        setIsSubmitting(false);
        
        // Just stay on success page, no redirect
      } catch (err) {
        console.error('Error creating booking:', err);
        setError(err.response?.data?.message || 'Failed to create booking');
        setIsSubmitting(false);
      }
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
          <p>The tour you're trying to book doesn't exist or has been removed.</p>
          <Link to="/tours" className="btn btn-primary">Back to Tours</Link>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="container">
        <div className="booking-success">
          <h2>Booking Successful!</h2>
          <p>Your booking for {tour.title} has been confirmed.</p>
          <p>A confirmation email has been sent to {bookingData.email}.</p>
          <p>Please check your email for booking details.</p>
          <Link to="/tours" className="btn btn-primary">Explore More Tours</Link>
        </div>
      </div>
    );
  }

  const totalPrice = tour.price * bookingData.numberOfPeople;

  return (
    <section className="booking-page">
      <div className="booking-header">
        <div className="container">
          <h1 className="booking-title">Book Your Tour</h1>
          <p className="booking-subtitle">Complete the form below to book your adventure</p>
        </div>
      </div>

      <div className="container">
        <div className="booking-content">
          <div className="booking-form-container">
            <h2>Booking Details</h2>
            
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="tourName" className="form-label">Tour</label>
                <input
                  type="text"
                  id="tourName"
                  className="form-control"
                  value={tour.title}
                  disabled
                />
              </div>
              
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
                  required
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
                  required
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
                  required
                />
                {formErrors.phone && (
                  <div className="error-message">{formErrors.phone}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">Start Date</label>
                <div className="date-picker-container">
                  <DatePicker
                    selected={bookingData.startDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`}
                    dateFormat="MMMM d, yyyy"
                  />
                  <FaCalendarAlt className="date-picker-icon" />
                </div>
                {formErrors.startDate && (
                  <div className="error-message">{formErrors.startDate}</div>
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
                  max={tour.maxGroupSize}
                />
                {formErrors.numberOfPeople && (
                  <div className="error-message">{formErrors.numberOfPeople}</div>
                )}
                <small className="form-text">Maximum group size: {tour.maxGroupSize}</small>
              </div>
              
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
                <Link to={`/tours/${tourId}`} className="btn btn-outline">
                  Cancel
                </Link>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
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
                      <span>Max {tour.maxGroupSize} people</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Tour Price</span>
                  <span>NPR {tour.price} per person</span>
                </div>
                <div className="price-item">
                  <span>Number of People</span>
                  <span>{bookingData.numberOfPeople}</span>
                </div>
                <div className="price-item total">
                  <span>Total</span>
                  <span>NPR {totalPrice}</span>
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
