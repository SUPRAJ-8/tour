import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../context/DataContext';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
import './Categories.css';

// Custom arrow components for slider
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div className="slider-arrow next-arrow" onClick={onClick}>
      <FaArrowRight />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div className="slider-arrow prev-arrow" onClick={onClick}>
      <FaArrowLeft />
    </div>
  );
};

const Home = () => {
  // Use the shared data context
  const { 
    tours, 
    countries, 
    loading: dataLoading, 
    getPopularTours,
    getCountriesByContinent 
  } = useData();
  
  const [featuredTours, setFeaturedTours] = useState([]);
  const [asianTours, setAsianTours] = useState([]);
  const [europeanTours, setEuropeanTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only proceed if data loading is complete
    if (!dataLoading) {
      try {
        // Filter out Nepal tours (with safety checks for undefined properties)
        const filteredAllTours = tours.filter(tour => {
          if (!tour) return false;
          const title = tour.title || '';
          const countryName = tour.country?.name || '';
          const destination = tour.destination || '';
          return !title.includes('Nepal') && 
                 !countryName.includes('Nepal') &&
                 !destination.includes('Nepal');
        });
        setAllTours(filteredAllTours);
        
        // Get featured/popular tours from context
        setFeaturedTours(getPopularTours(6) || []);
        
        // Get Asian tours (with safety checks)
        const asianCountries = getCountriesByContinent('asia') || [];
        const asianCountryIds = asianCountries.map(country => country?._id).filter(Boolean);
        const asianToursList = tours.filter(tour => 
          tour?.country?._id && asianCountryIds.includes(tour.country._id)
        ).slice(0, 3);
        setAsianTours(asianToursList);
        
        // Get European tours (with safety checks)
        const europeanCountries = getCountriesByContinent('europe') || [];
        const europeanCountryIds = europeanCountries.map(country => country?._id).filter(Boolean);
        const europeanToursList = tours.filter(tour => 
          tour?.country?._id && europeanCountryIds.includes(tour.country._id)
        ).slice(0, 3);
        setEuropeanTours(europeanToursList);
        
        // Set popular destinations from countries (with safety checks)
        const popularDests = countries
          .filter(country => country?.popularDestinations && country.popularDestinations.length > 0)
          .slice(0, 6);
        setPopularDestinations(popularDests);
      } catch (error) {
        console.error('Error processing tour data:', error);
        // Set empty arrays to prevent rendering errors
        setAllTours([]);
        setFeaturedTours([]);
        setAsianTours([]);
        setEuropeanTours([]);
        setPopularDestinations([]);
      } finally {
        // Always set loading to false when data processing is complete
        setLoading(false);
      }
    }
  }, [tours, countries, dataLoading, getPopularTours, getCountriesByContinent]);
  
  if (loading || dataLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading amazing destinations...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Tour Packages Slider Section */}
      <section className="hero-slider">
        {allTours.length > 0 ? (
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={8000}
            pauseOnHover={true}
            nextArrow={<NextArrow />}
            prevArrow={<PrevArrow />}
          >
            {allTours.map(tour => (
              <div key={tour._id} className="tour-slide">
                <div className="tour-slide-image" style={{ backgroundImage: `url(${tour.coverImage})` }}></div>
                <div className="tour-slide-overlay"></div>
                <div className="tour-slide-content">
                  <h1 className="tour-slide-title">{tour.title}</h1>
                  <p className="tour-slide-description">Experience the world with our international tour packages</p>
                  <div className="tour-slide-info">
                    <div className="slide-info-item">
                      <FaMapMarkerAlt />
                      <span>{tour.destination.name}</span>
                    </div>
                    <div className="slide-info-item">
                      <FaCalendarAlt />
                      <span>{tour.duration} days</span>
                    </div>
                    <div className="slide-info-item">
                      <FaUsers />
                      <span>Max: {tour.maxGroupSize} people</span>
                    </div>
                  </div>
                  <p className="tour-slide-price">NPR {tour.price} <span>per person</span></p>
                  <Link to={`/tours/${tour._id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="hero-slide" style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}>
            <div className="hero-content">
              <h1 className="hero-title">International Tour Specialists</h1>
              <p className="hero-subtitle">Explore Asia and Europe with our expertly crafted tour packages</p>
              <Link to="/tours" className="btn btn-primary">Explore Tours</Link>
            </div>
          </div>
        )}
      </section>

      {/* Most Popular Section */}
      <section className="section most-popular-section">
        <div className="container">
          <h2 className="section-title">Most Popular Tours</h2>
          <p className="section-subtitle">Our travelers' favorite experiences</p>
          
          <div className="popular-tours-grid">
            {allTours.slice(0, 4).map(tour => (
              <div key={tour._id} className="popular-tour-card">
                <div className="popular-tour-image">
                  <img src={tour.coverImage} alt={tour.title} />
                  <div className="popular-tour-badge">Most Popular</div>
                </div>
                <div className="popular-tour-content">
                  <h3 className="popular-tour-title">{tour.title}</h3>
                  <div className="popular-tour-info">
                    <div className="info-item">
                      <FaMapMarkerAlt />
                      <span>{tour.destination?.name}</span>
                    </div>
                    <div className="info-item">
                      <FaCalendarAlt />
                      <span>{tour.duration} days</span>
                    </div>
                    <div className="info-item">
                      <FaStar />
                      <span>{tour.ratingsAverage || 4.5} ({tour.ratingsQuantity || 12})</span>
                    </div>
                  </div>
                  <div className="popular-tour-footer">
                    <div className="popular-tour-price">NPR {tour.price}</div>
                    <Link to={`/tours/${tour._id}`} className="btn btn-sm btn-outline">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Link to="/tours" className="btn btn-primary">View All Tours</Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Explore by Continent</h2>
          <p className="section-subtitle">Choose your dream destination</p>
          
          <div className="categories-container">
            {/* Asia Category */}
            <div className="category-card">
              <div className="category-image">
                <img src="/images/categories/asia.jpg" alt="Asia Tours" />
                <div className="category-overlay"></div>
              </div>
              <div className="category-content">
                <h3>Asia</h3>
                <p>Discover ancient traditions, vibrant cultures, and breathtaking landscapes</p>
                <div className="category-destinations">
                  <span>Thailand</span>
                  <span>Japan</span>
                  <span>India</span>
                  <span>China</span>
                  <span>Singapore</span>
                </div>
                <Link to="/countries/asia" className="btn btn-outline">Explore Asia</Link>
              </div>
            </div>
            
            {/* Europe Category */}
            <div className="category-card">
              <div className="category-image">
                <img src="/images/categories/europe.jpg" alt="Europe Tours" />
                <div className="category-overlay"></div>
              </div>
              <div className="category-content">
                <h3>Europe</h3>
                <p>Experience rich history, stunning architecture, and diverse cultures</p>
                <div className="category-destinations">
                  <span>France</span>
                  <span>Italy</span>
                  <span>Spain</span>
                  <span>Germany</span>
                  <span>UK</span>
                </div>
                <Link to="/countries/europe" className="btn btn-outline">Explore Europe</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured International Tours</h2>
          <p className="section-subtitle">Handpicked global experiences by our travel experts</p>
          
          <div className="tours-grid">
            {featuredTours.length > 0 ? (
              featuredTours.map(tour => (
                <div key={tour._id} className="tour-card">
                  <div className="tour-card-image">
                    <img src={tour.coverImage} alt={tour.title} />
                    <div className="tour-card-price">NPR {tour.price}</div>
                  </div>
                  <div className="tour-card-content">
                    <h3 className="tour-card-title">{tour.title}</h3>
                    <div className="tour-card-info">
                      <div className="info-item">
                        <FaMapMarkerAlt />
                        <span>{tour.destination.name}</span>
                      </div>
                      <div className="info-item">
                        <FaCalendarAlt />
                        <span>{tour.duration} days</span>
                      </div>
                    </div>
                    <div className="tour-card-footer">
                      <div className="tour-card-rating">
                        <FaStar />
                        <span>{tour.ratingsAverage} ({tour.ratingsQuantity})</span>
                      </div>
                      <Link to={`/tours/${tour._id}`} className="btn btn-outline">View Details</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No featured tours available at the moment.</p>
            )}
          </div>
          
          <div className="text-center mt-4">
            <Link to="/tours" className="btn btn-primary">View All Tours</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">We offer the best experience for your journey</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaStar />
              </div>
              <h3 className="feature-title">Handpicked Tours</h3>
              <p className="feature-text">
                Our travel experts personally select the best tours and experiences for you.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3 className="feature-title">Small Groups</h3>
              <p className="feature-text">
                Travel in small groups for a more personalized and intimate experience.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaMapMarkerAlt />
              </div>
              <h3 className="feature-title">Local Experiences</h3>
              <p className="feature-text">
                Immerse yourself in local cultures with authentic experiences.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaCalendarAlt />
              </div>
              <h3 className="feature-title">Flexible Booking</h3>
              <p className="feature-text">
                Change your travel dates or cancel your booking with flexible policies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get exclusive deals, travel tips, and more delivered to your inbox.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your Email Address" className="form-control" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
