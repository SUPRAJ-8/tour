import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../context/DataContext';
import { getSampleTours } from '../services/tourService';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaSyncAlt, FaChevronRight } from 'react-icons/fa';
import PopularTours from '../components/PopularTours';
import HottestTours from '../components/HottestTours';
import FeaturedTours from '../components/FeaturedTours';
import WorkingVisaCards from '../components/WorkingVisaCards';
import './Home.css';
import './Categories.css';
import { Helmet } from 'react-helmet';



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
  
  const [asianTours, setAsianTours] = useState([]);
  const [europeanTours, setEuropeanTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [hottestTours, setHottestTours] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [featuredTours, setFeaturedTours] = useState([]);

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
  
  // Function to check if a tour is hottest
  const isHottestTour = (tour) => {
    // For debugging
    console.log(`Checking if tour ${tour.title || tour.name} is hottest:`, {
      hottestTour: tour.hottestTour,
      type: typeof tour.hottestTour,
      isTrue: tour.hottestTour === true,
      isStringTrue: tour.hottestTour === 'true',
      isOne: tour.hottestTour === 1,
      stringValue: String(tour.hottestTour).toLowerCase()
    });
    
    return tour.hottestTour === true || 
           tour.hottestTour === 'true' || 
           tour.hottestTour === 1 ||
           String(tour.hottestTour).toLowerCase() === 'true';
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
          if (response.data && response.data.success && Array.isArray(response.data.data)) {
            toursToUse = response.data.data;
            console.log('Found tours in success.data format:', toursToUse.length);
          } else if (response.data && Array.isArray(response.data)) {
            toursToUse = response.data;
            console.log('Found tours in array format:', toursToUse.length);
          } else if (response.data && response.data.data && Array.isArray(response.data.data.tours)) {
            toursToUse = response.data.data.tours;
            console.log('Found tours in data.data.tours format:', toursToUse.length);
          } else if (response.data && Array.isArray(response.data.tours)) {
            toursToUse = response.data.tours;
            console.log('Found tours in data.tours format:', toursToUse.length);
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            toursToUse = response.data.data;
            console.log('Found tours in data.data format:', toursToUse.length);
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
        
        if (toursToUse.length === 0) {
          console.log('No tour data available');
          setError('No tours available. Please try again later.');
          setLoading(false); // Make sure to set loading to false even if no tours are found
          return;
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
        setError('Failed to load tours. Please try again later.');
      } finally {
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
        
        // Get hottest tours for the hero slider (up to 10)
        let hottestToursList = tours.filter(isHottestTour);
        console.log('Hottest tours found:', hottestToursList.length);
        
        // If no hottest tours found, use the first 5 tours as hottest
        if (hottestToursList.length === 0 && tours.length > 0) {
          console.log('No hottest tours found, using first 5 tours');
          hottestToursList = tours.slice(0, 5).map(tour => ({
            ...tour,
            hottestTour: true
          }));
        }
        
        // Ensure we have valid tour data with required fields
        const validHottestTours = hottestToursList.filter(tour => 
          tour && tour.title && (tour.coverImage || tour.imageCover)
        ).slice(0, 10);
        
        console.log('Valid hottest tours:', validHottestTours.length);
        setHottestTours(validHottestTours);
        
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
        setHottestTours([]);
        setAsianTours([]);
        setEuropeanTours([]);
        setPopularDestinations([]);
      } finally {
        // Always set loading to false when data processing is complete
        setLoading(false);
      }
    }
  }, [tours, countries, dataLoading, getPopularTours, getCountriesByContinent, lastRefresh]);

  // Function to check if a tour is featured
  const isFeaturedTour = tour => (
    tour.featured === true ||
    tour.featured === 'true' ||
    tour.featured === 1
  );

  // Derive featured tours whenever allTours changes
  useEffect(() => {
    const list = allTours.filter(isFeaturedTour).slice(0, 6);
    console.log('Derived featured tours from allTours:', list);
    setFeaturedTours(list);
  }, [allTours]);

  // Also derive featured tours from raw context tours (untouched)
  useEffect(() => {
    if (!dataLoading && Array.isArray(tours)) {
      const list = tours.filter(isFeaturedTour).slice(0, 6);
      console.log('Derived featured tours from context tours:', list);
      setFeaturedTours(list);
    }
  }, [tours, dataLoading]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="home">
      <Helmet>
        <title>Explore Tours | Home</title>
        <link rel="canonical" href="https://zyphertours.com/" />
        <meta name="description" content="Discover hottest and popular tours around the world." />
      </Helmet>
      {/* Hottest Tours Section */}
      <HottestTours />

      {/* Most Popular Tours Section */}
      <PopularTours />
      
      {/* Featured Tours Section */}
      <FeaturedTours tours={featuredTours} />

      {/* Working Visa Section */}
      <WorkingVisaCards />
      
      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header categories-header">
              <div>
                <h2 className="section-title">Explore by Continent</h2>
                <p className="section-subtitle">Choose your dream destination</p>
     
              </div>
              <Link to="/countries" className="view-all-continents">View All Continents <FaChevronRight className="view-all-icon" /></Link>
            </div>

          
          <div className="categories-container">
            {/* Asia Category */}
            <Link to="/countries/asia" className="category-card">
              <div className="category-image">
                <img src={`${process.env.PUBLIC_URL}/images/categories/asia.jpg`} alt="Asia Tours" />
                <div className="category-overlay"></div>
              </div>
              <div className="category-content">
                <h3>Asia</h3>
                <p>Discover ancient traditions, vibrant cultures, and breathtaking landscapes</p>
              </div>
            </Link>
            
            {/* Europe Category */}
            <Link to="/countries/europe" className="category-card">
              <div className="category-image">
                <img src={`${process.env.PUBLIC_URL}/images/categories/europe.jpg`} alt="Europe Tours" />
                <div className="category-overlay"></div>
              </div>
              <div className="category-content">
                <h3>Europe</h3>
                <p>Experience rich history, stunning architecture, and diverse cultures</p>
              </div>
            </Link>
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
      
    </div>
  );
};

export default Home;
