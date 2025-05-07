import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../context/DataContext';
import { getSampleTours } from '../services/tourService';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaArrowRight, FaArrowLeft, FaSyncAlt } from 'react-icons/fa';
import PopularTours from '../components/PopularTours';
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
    getCountriesByContinent,
    refreshData
  } = useData();
  
  const [featuredTours, setFeaturedTours] = useState([]);
  const [asianTours, setAsianTours] = useState([]);
  const [europeanTours, setEuropeanTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Function to check if a tour is popular
  const isPopularTour = (tour) => {
    // For debugging
    console.log(`Checking tour ${tour.title || tour.name}:`, {
      popularTour: tour.popularTour,
      type: typeof tour.popularTour,
      isTrue: tour.popularTour === true,
      isStringTrue: tour.popularTour === 'true',
      isOne: tour.popularTour === 1
    });
    
    return tour.popularTour === true || 
           tour.popularTour === 'true' || 
           tour.popularTour === 1;
  };
  
  // Function to manually refresh tour data
  const handleRefreshData = async () => {
    console.log('Manually refreshing tour data...');
    
    try {
      // First try to refresh data through the context
      if (typeof refreshData === 'function') {
        console.log('Using context refreshData function...');
        await refreshData();
        
        // Wait a moment for the context to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Context data refreshed, tours:', tours?.length);
        
        if (Array.isArray(tours) && tours.length > 0) {
          console.log('Setting tours from refreshed context data');
          setAllTours(tours);
          setLastRefresh(Date.now());
          return;
        }
      }
      
      // If context refresh failed or isn't available, make a direct API call
      console.log('Making direct API call...');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/tours`);
      
      console.log('Fresh data from API:', response.data);
      
      let freshTours = [];
      
      // Handle different API response formats
      if (response.data && Array.isArray(response.data)) {
        freshTours = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data.tours)) {
        freshTours = response.data.data.tours;
      } else if (response.data && Array.isArray(response.data.tours)) {
        freshTours = response.data.tours;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        freshTours = response.data.data;
      } else if (response.data && response.data.success && response.data.data) {
        // Handle the common {success: true, data: [...]} format
        freshTours = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      }
      
      if (freshTours.length > 0) {
        console.log('Setting fresh tours data from API:', freshTours.length);
        console.log('Popular tours in API data:', freshTours.filter(t => t.popularTour).length);
        setAllTours(freshTours);
      } else {
        // If API call fails or returns no data, use the context data
        console.log('No tours found in API response, using context data');
        if (Array.isArray(tours) && tours.length > 0) {
          setAllTours(tours);
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      // On error, still try to use the context data
      if (Array.isArray(tours) && tours.length > 0) {
        console.log('Using tours from context after error:', tours.length);
        setAllTours(tours);
      }
    }
    
    // Force UI refresh
    setLastRefresh(Date.now());
  };

  useEffect(() => {
    const loadTourData = async () => {
      try {
        setLoading(true);
        console.log('Loading tour data, lastRefresh:', lastRefresh);
        
        let toursToUse = [];
        
        // Try to get data from API first
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          const response = await axios.get(`${apiUrl}/api/tours`);
          console.log('API response:', response.data);
          
          // Handle different API response formats
          if (response.data && Array.isArray(response.data)) {
            toursToUse = response.data;
          } else if (response.data && response.data.data && Array.isArray(response.data.data.tours)) {
            toursToUse = response.data.data.tours;
          } else if (response.data && Array.isArray(response.data.tours)) {
            toursToUse = response.data.tours;
          }
          
          console.log('Tours from API:', toursToUse.length);
        } catch (apiError) {
          console.log('API error, falling back to context data:', apiError);
        }
        
        // If API call failed or returned no data, try context data
        if (toursToUse.length === 0 && Array.isArray(tours) && tours.length > 0) {
          console.log('Using tours from context:', tours.length);
          toursToUse = tours;
        }
        
        // If still no data, use sample data
        if (toursToUse.length === 0) {
          console.log('No data from API or context, using sample data');
          const sampleTours = getSampleTours();
          console.log('Sample tours:', sampleTours.length);
          toursToUse = sampleTours;
        }
        
        // Log tours with popularTour property
        const popularTours = toursToUse.filter(tour => {
          const isPopular = tour.popularTour === true || 
                           tour.popularTour === 'true' || 
                           tour.popularTour === 1 || 
                           String(tour.popularTour).toLowerCase() === 'true';
          
          console.log(`Tour ${tour.title || tour.name} popularTour:`, {
            value: tour.popularTour,
            type: typeof tour.popularTour,
            isPopular: isPopular
          });
          
          return isPopular;
        });
        
        console.log('Popular tours found:', popularTours.length);
        console.log('Popular tour details:', popularTours);
        
        // Set all tours and update loading state
        setAllTours(toursToUse);
        setLoading(false);
      } catch (error) {
        console.error('Error loading tour data:', error);
        // Fallback to sample data in case of error
        const sampleTours = getSampleTours();
        setAllTours(sampleTours);
        setLoading(false);
      }
    };

    loadTourData();

    // Then proceed with loading actual data if available
    if (!dataLoading && tours && tours.length > 0) {
      try {
        // Filter out Nepal tours (with safety checks for undefined properties)
        const filteredAllTours = tours.filter(tour => {
          try {
            if (!tour) return false;
            const title = tour.title || tour.name || '';
            const countryName = tour.country?.name || tour.country || '';
            
            // Handle destination properly based on its type
            let destinationName = '';
            if (typeof tour.destination === 'string') {
              destinationName = tour.destination;
            } else if (tour.destination && tour.destination.name) {
              destinationName = tour.destination.name;
            } else if (tour.destination && tour.destination.country) {
              destinationName = tour.destination.country;
            }
            
            return !title.includes('Nepal') && 
                   !countryName.includes('Nepal') &&
                   !destinationName.includes('Nepal');
          } catch (err) {
            console.log('Error filtering tour:', tour, err);
            return true; // Include the tour if there's an error filtering
          }
        });
        
        // Only update if we have actual data
        if (filteredAllTours.length > 0) {
          console.log('Using actual tour data:', filteredAllTours.length);
          setAllTours(filteredAllTours);
        }
        
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
  }, [tours, countries, dataLoading, getPopularTours, getCountriesByContinent, lastRefresh]);
  
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
      {/* Static Hero Section */}
      <section className="hero-section">
        <div className="hero-slide" style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80")',
          height: '80vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div className="hero-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}></div>
          <div className="hero-content" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
            zIndex: 1,
            width: '80%'
          }}>
            <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Discover the World with Us</h1>
            <p className="hero-subtitle" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Explore Asia and Europe with our expertly crafted tour packages</p>
            <Link to="/tours" className="btn btn-primary" style={{
              padding: '12px 30px',
              backgroundColor: '#1e88e5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              display: 'inline-block'
            }}>Explore Tours</Link>
          </div>
        </div>
      </section>

      {/* Most Popular Tours Section */}
      {/* Popular Tours Section */}
      <PopularTours />
      
      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Explore by Continent</h2>
          <p className="section-subtitle">Choose your dream destination</p>
          
          <div className="categories-container">
            {/* Asia Category */}
            <div className="category-card">
              <div className="category-image">
                <img src={`${process.env.PUBLIC_URL}/images/categories/asia.jpg`} alt="Asia Tours" />
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
                <img src={`${process.env.PUBLIC_URL}/images/categories/europe.jpg`} alt="Europe Tours" />
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
                    <img src={tour.coverImage || tour.imageCover} alt={tour.title || tour.name} />
                    <div className="tour-card-price">NPR {tour.price}</div>
                    {tour.hottestTour && <div className="tour-card-badge hottest-tour">Hottest Tour</div>}
                    {tour.popularTour && <div className="tour-card-badge popular-tour">Popular Tour</div>}
                  </div>
                  <div className="tour-card-content">
                    <h3 className="tour-card-title">{tour.title || tour.name}</h3>
                    <div className="tour-card-info">
                      <div className="info-item">
                        <FaMapMarkerAlt />
                        <span>{tour.destination?.name || tour.country}</span>
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
                      <Link to={`/tours/${tour._id || tour.id}`} className="btn btn-secondary">View Details</Link>
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
