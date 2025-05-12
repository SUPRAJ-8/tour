import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaClock, FaMoneyBillWave, 
  FaCheck, FaTimes, FaInfoCircle, FaPassport, FaUmbrellaBeach, FaDownload, FaShare, FaHeart, FaExpand } from 'react-icons/fa';
import './TourDetail.css';
import { getAsianCountries, getEuropeanCountries } from '../utils/countryData';

const TourDetail = () => {
  const { countryId, tourId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState(null);
  const [country, setCountry] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);

  // Function to handle hero image navigation
  const nextSlide = () => {
    // Removed as carousel is replaced with grid
  };

  const prevSlide = () => {
    // Removed as carousel is replaced with grid
  };

  // Auto-advance slides
  useEffect(() => {
    // Removed as carousel is replaced with grid
  }, []);

  useEffect(() => {
    // Simulate loading tour data
    const timer = setTimeout(() => {
      // Find the country first
      let countryData;
      let category;
      
      // Check in Asian countries
      countryData = getAsianCountries().find(c => c.id === countryId);
      if (countryData) {
        category = 'asia';
      } else {
        // Check in European countries
        countryData = getEuropeanCountries().find(c => c.id === countryId);
        if (countryData) {
          category = 'europe';
        }
      }
      
      if (!countryData) {
        navigate('/not-found');
        return;
      }
      
      setCountry(countryData);
      
      // Generate tour data based on tourId
      const durations = ['5 Days 4 Nights', '6 Days 5 Nights', '8 Days 7 Nights', '9 Days 8 Nights'];
      const attractions = countryData.highlights || ['City Tour', 'Beach Tour', 'Mountain Tour', 'Cultural Tour'];
      
      // Parse tour ID to get index
      const tourIndex = parseInt(tourId.replace('tour', '')) - 1;
      
      if (isNaN(tourIndex) || tourIndex < 0 || tourIndex > 3) {
        navigate('/not-found');
        return;
      }
      
      const duration = durations[tourIndex % durations.length];
      const days = parseInt(duration.split(' ')[0]);
      const nights = parseInt(duration.split(' ')[3]);
      
      // Create tour title based on country and attractions
      let title;
      if (tourIndex === 0) {
        title = `${nights}N/${days}D ${countryData.name} Complete Tour`;
      } else if (attractions.length >= 3 && tourIndex < 3) {
        // Use actual attractions if available
        const usedAttractions = attractions.slice(0, Math.min(3, attractions.length));
        title = `${nights}N/${days}D ${usedAttractions.join('-')} Tour`;
      } else {
        title = `${nights}N/${days}D ${countryData.name} Explorer Tour`;
      }
      
      // Static tour images
      const tourImages = [
        'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1540329957110-b87f1f53f2a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1516496636080-3566af2b4dfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      ];
      
      // Additional images for the tour gallery
      const additionalImages = [
        'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      ];
      
      // Hero images
      const heroImages = [
        'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1540329957110-b87f1f53f2a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      ];
      
      // Generate itinerary based on duration
      const itinerary = [];
      for (let i = 1; i <= days; i++) {
        let dayTitle;
        let activities;
        
        if (i === 1) {
          dayTitle = 'Arrival';
          activities = [
            `Arrive at ${countryData.name} International Airport`,
            'Transfer to your hotel',
            'Welcome dinner',
            'Overnight stay at hotel'
          ];
        } else if (i === days) {
          dayTitle = 'Departure';
          activities = [
            'Breakfast at hotel',
            'Free time for shopping',
            'Transfer to airport',
            'Departure'
          ];
        } else {
          // Use attractions for middle days
          const attraction = attractions[(i - 2) % attractions.length];
          dayTitle = attraction;
          activities = [
            'Breakfast at hotel',
            `Full day ${attraction} tour`,
            'Lunch at local restaurant',
            'Continue sightseeing',
            'Return to hotel',
            'Dinner and overnight stay'
          ];
        }
        
        itinerary.push({
          day: i,
          title: dayTitle,
          activities: activities
        });
      }
      
      const tourData = {
        id: tourId,
        title: title,
        image: tourImages[tourIndex % tourImages.length],
        heroImages: heroImages,
        gallery: [
          tourImages[tourIndex % tourImages.length],
          ...additionalImages.slice(0, 3)
        ],
        rating: 4.5 + (Math.random() * 0.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 50) + 5,
        location: countryData.name,
        duration: duration,
        tag: tourIndex === 0 ? 'Hottest Tour' : 'Most Popular',
        price: 1200 + (tourIndex * 300),
        overview: `Experience the best of ${countryData.name} with our ${title}. This comprehensive tour takes you through the most beautiful and culturally rich destinations in ${countryData.name}, including ${attractions.slice(0, 3).join(', ')}. Enjoy comfortable accommodations, expert guides, and unforgettable experiences throughout your journey.`,
        highlights: [
          `Explore the vibrant city of ${attractions[0] || countryData.name + ' City'}`,
          `Visit the famous ${attractions[1] || 'landmarks'} and learn about local culture`,
          `Experience the natural beauty of ${attractions[2] || countryData.name}`,
          'Enjoy authentic local cuisine',
          'Comfortable accommodations throughout your stay'
        ],
        inclusions: [
          'Airport transfers',
          `${nights} nights accommodation`,
          'Daily breakfast',
          'Welcome dinner',
          'Transportation in air-conditioned vehicle',
          'English-speaking guide',
          'Entrance fees to attractions',
          'Bottled water during tours'
        ],
        exclusions: [
          'International airfare',
          'Travel insurance',
          'Personal expenses',
          'Optional activities',
          'Visa fees (if applicable)',
          'Tips and gratuities'
        ],
        itinerary: itinerary,
        category: category
      };
      
      setTour(tourData);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [countryId, tourId, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tour details...</p>
      </div>
    );
  }

  return (
    <section className="tour-details-page">
      {/* Image Gallery */}
      <div className="tour-gallery-container">
        <div className="gallery-grid">
          {tour.heroImages && tour.heroImages.length > 0 ? (
            tour.heroImages.slice(0, 5).map((image, index) => (
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
            <div className="no-images">No images available</div>
          )}
        </div>
      </div>

      <div className="container">
        <div className="tour-details-content">
          <div className="tour-main-content">
            {/* Breadcrumb */}
            <div className="breadcrumb">
              <Link to="/">Home</Link> / 
              <Link to="/tours">Tours</Link> / 
              <Link to={`/countries/${tour.category}/${countryId}`}>{country.name}</Link> / 
              <span>{tour.title}</span>
            </div>

            {/* Tour Header */}
            <div className="tour-header">
              <h1 className="tour-title">{tour.title}</h1>
              <div className="tour-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < 4.5 ? 'star-filled' : 'star-empty'} />
                ))}
                <span className="rating-text">4.5 (24 reviews)</span>
              </div>
            </div>

            {/* Tour Actions */}
            <div className="tour-actions">
              <button className="action-btn">
                <FaHeart /> Add to Wishlist
              </button>
              <button className="action-btn">
                <FaShare /> Share
              </button>
              <button className="action-btn">
                <FaDownload /> Download PDF
              </button>
            </div>

            {/* Tour Info Cards */}
            <div className="tour-info-cards">
              <div className="info-card">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="info-content">
                  <h4>Destination</h4>
                  <p>{country.name}</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <FaCalendarAlt />
                </div>
                <div className="info-content">
                  <h4>Duration</h4>
                  <p>{tour.duration}</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <FaUsers />
                </div>
                <div className="info-content">
                  <h4>Group Size</h4>
                  <p>Max 15 people</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <FaClock />
                </div>
                <div className="info-content">
                  <h4>Tour Type</h4>
                  <p>Group Tour</p>
                </div>
              </div>
            </div>

            {/* Tour Overview */}
            <div className="tour-section">
              <h2 className="section-title">Overview</h2>
              <div className="tour-overview">
                <p>{tour.overview}</p>
              </div>
            </div>

            {/* Tour Highlights */}
            <div className="tour-section">
              <h2 className="section-title">Tour Highlights</h2>
              <div className="tour-highlights">
                <ul className="highlights-list">
                  {tour.highlights.map((highlight, index) => (
                    <li key={index}>
                      <FaCheck className="highlight-icon" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tour Itinerary */}
            <div className="tour-section">
              <h2 className="section-title">Detailed Itinerary</h2>
              <div className="tour-itinerary">
                {tour.itinerary.map((day) => (
                  <div className="itinerary-day" key={day.day}>
                    <div className="day-header">
                      <div className="day-number">Day {day.day}</div>
                      <div className="day-title">{day.title}</div>
                    </div>
                    <div className="day-content">
                      <ul>
                        {day.activities.map((activity, index) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="tour-section">
              <h2 className="section-title">What's Included/Excluded</h2>
              <div className="inclusions-exclusions">
                <div className="inclusions">
                  <h3>Included</h3>
                  <ul>
                    {tour.inclusions.map((item, index) => (
                      <li key={index}>
                        <FaCheck className="included-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="exclusions">
                  <h3>Excluded</h3>
                  <ul>
                    {tour.exclusions.map((item, index) => (
                      <li key={index}>
                        <FaTimes className="excluded-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="tour-section">
              <h2 className="section-title">Additional Information</h2>
              <div className="additional-info">
                <div className="info-item">
                  <FaInfoCircle />
                  <div>
                    <h4>Difficulty Level</h4>
                    <p>Easy to Moderate</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaPassport />
                  <div>
                    <h4>Visa Requirements</h4>
                    <p>Visa on arrival available for most nationalities</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaUmbrellaBeach />
                  <div>
                    <h4>Best Time to Visit</h4>
                    <p>{country.bestTimeToVisit || 'October to April'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="tour-section">
              <h2 className="section-title">Reviews</h2>
              <div className="reviews-container">
                <div className="review-summary">
                  <div className="average-rating">
                    <h3>4.5</h3>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < 4.5 ? 'star-filled' : 'star-empty'} />
                      ))}
                    </div>
                    <p>Based on 24 reviews</p>
                  </div>
                </div>
                
                <div className="reviews-list">
                  {[
                    { name: 'John Doe', date: '2024-04-15', rating: 5, text: 'Amazing experience! The tour guide was knowledgeable and the itinerary was perfect.' },
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
                  ))}
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
                  <span>{tour.duration}</span>
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
                    <span className="info-value">Max 15 people</span>
                  </div>
                </div>
                <div className="booking-info-item">
                  <div>
                    <span className="info-label">Difficulty</span>
                    <span className="info-value">Medium</span>
                  </div>
                </div>
              </div>

              <Link 
                to={`/book/${tourId}?country=${countryId}&category=${tour.category}`} 
                className="book-now-btn"
              >
                Book Now
              </Link>
              
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

export default TourDetail;
