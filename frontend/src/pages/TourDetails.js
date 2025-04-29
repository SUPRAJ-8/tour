import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './TourDetails.css';

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTour = async () => {
      try {
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
  }, [id]);

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
      <div className="tour-header">
        <div className="container">
          <h1 className="tour-title">{tour.title}</h1>
          <div className="tour-price">NPR {tour.price} <span>per person</span></div>
          <div className="tour-meta">
            <div className="meta-item">
              <FaMapMarkerAlt />
              <span>{tour.destination.name}, {tour.destination.country}</span>
            </div>
            <div className="meta-item">
              <FaCalendarAlt />
              <span>{tour.duration} days</span>
            </div>
            <div className="meta-item">
              <FaUsers />
              <span>Max Group Size: {tour.maxGroupSize}</span>
            </div>
            <div className="meta-item">
              <FaStar />
              <span>{tour.ratingsAverage} ({tour.ratingsQuantity} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="tour-gallery">
          {tour.images && tour.images.length > 0 ? (
            tour.images.map((image, index) => (
              <div key={index} className="gallery-item">
                <img src={image} alt={`${tour.title} - ${index + 1}`} />
              </div>
            ))
          ) : (
            <div className="gallery-item">
              <img src={tour.coverImage} alt={tour.title} />
            </div>
          )}
        </div>

        <div className="tour-content">
          <div className="tour-main">
            <div className="tour-description">
              <h2>Tour Overview</h2>
              <p>{tour.description}</p>
            </div>

            <div className="tour-itinerary">
              <h2>Itinerary</h2>
              {tour.itinerary && tour.itinerary.length > 0 ? (
                <div className="itinerary-list">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="itinerary-item">
                      <div className="itinerary-day">Day {item.day}</div>
                      <div className="itinerary-content">
                        <h3>{item.title || `Day ${item.day}`}</h3>
                        <p>{item.description}</p>
                        {item.activities && item.activities.length > 0 && (
                          <div className="itinerary-activities">
                            <h4>Activities:</h4>
                            <ul>
                              {item.activities.map((activity, idx) => (
                                <li key={idx}>{activity}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Detailed itinerary will be provided upon booking.</p>
              )}
            </div>

            <div className="tour-features">
              <div className="feature-section">
                <h2>What's Included</h2>
                <ul className="feature-list">
                  {tour.includes && tour.includes.length > 0 ? (
                    tour.includes.map((item, index) => (
                      <li key={index} className="feature-item">
                        <FaStar />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li>Details will be provided upon booking</li>
                  )}
                </ul>
              </div>

              <div className="feature-section">
                <h2>What's Not Included</h2>
                <ul className="feature-list">
                  {tour.excludes && tour.excludes.length > 0 ? (
                    tour.excludes.map((item, index) => (
                      <li key={index} className="feature-item">
                        <FaStar />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li>Details will be provided upon booking</li>
                  )}
                </ul>
              </div>
            </div>

            {tour.reviews && tour.reviews.length > 0 && (
              <div className="tour-reviews">
                <h2>Reviews</h2>
                <div className="reviews-list">
                  {tour.reviews.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="review-user">
                          <img 
                            src={review.user.profileImage || '/images/default-user.jpg'} 
                            alt={review.user.name} 
                            className="review-user-image" 
                          />
                          <div>
                            <h4>{review.user.name}</h4>
                            <p className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < review.rating ? 'star-filled' : 'star-empty'} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="review-text">{review.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="tour-sidebar">
            <div className="booking-card">
              <div className="booking-price">
                <h3>NPR {tour.price}</h3>
                <span>per person</span>
              </div>

              <div className="booking-info">
                <div className="booking-info-item">
                  <FaClock />
                  <div>
                    <span className="info-label">Duration</span>
                    <span className="info-value">{tour.duration} days</span>
                  </div>
                </div>
                <div className="booking-info-item">
                  <FaUsers />
                  <div>
                    <span className="info-label">Group Size</span>
                    <span className="info-value">Max {tour.maxGroupSize} people</span>
                  </div>
                </div>
                <div className="booking-info-item">
                  <FaMoneyBillWave />
                  <div>
                    <span className="info-label">Difficulty</span>
                    <span className="info-value">{tour.difficulty}</span>
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <Link to={`/book/${tour._id}`} className="btn btn-primary btn-block">
                  Book Now
                </Link>
              ) : (
                <div>
                  <Link to="/login" className="btn btn-primary btn-block">
                    Login to Book
                  </Link>
                  <p className="booking-login-text">
                    Don't have an account? <Link to="/register">Sign up</Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDetails;
