import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../context/DataContext';
import { getSampleTours } from '../services/tourService';
import { FaMapMarkerAlt, FaCalendarCheck, FaUsers, FaCompass, FaStar, FaSyncAlt, FaChevronRight } from 'react-icons/fa';
import PopularTours from '../components/PopularTours';
import HottestTours from '../components/HottestTours';
import FeaturedTours from '../components/FeaturedTours';
import WorkingVisaCards from '../components/WorkingVisaCards';
import ToursSectionSkeleton from '../components/ToursSectionSkeleton';
import './Home.css';
import './Categories.css';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';



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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [featuredTours, setFeaturedTours] = useState([]);

  // Function to check if a tour is popular
  const isPopularTour = (tour) => {
    return tour.popularTour === true ||
           tour.popularTour === 'true' ||
           tour.popularTour === 1;
  };

  // Function to check if a tour is hottest
  const isHottestTour = (tour) => {
    return tour.hottestTour === true ||
           tour.hottestTour === 'true' ||
           tour.hottestTour === 1 ||
           String(tour.hottestTour).toLowerCase() === 'true';
  };

  // Function to manually refresh tour data
  const handleRefreshData = async () => {
    try {
      // First try to refresh data through the context
      if (typeof refreshData === 'function') {
        await refreshData();

        // Wait a moment for the context to update
        await new Promise(resolve => setTimeout(resolve, 500));

        if (Array.isArray(tours) && tours.length > 0) {
          setAllTours(tours);
          setLastRefresh(Date.now());
          return;
        }
      }

      // If context refresh failed or isn't available, make a direct API call
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/tours`);

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
        setAllTours(freshTours);
      } else {
        // If API call fails or returns no data, use the context data
        if (Array.isArray(tours) && tours.length > 0) {
          setAllTours(tours);
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      // On error, still try to use the context data
      if (Array.isArray(tours) && tours.length > 0) {
        setAllTours(tours);
      }
    }

    // Force UI refresh
    setLastRefresh(Date.now());
  };

  useEffect(() => {
    const loadTourData = async () => {
      // Only show skeleton if fetch takes longer than 200ms
      const timeoutId = setTimeout(() => setLoading(true), 200);
      // Clear any error from a previous attempt so a stale failure doesn't
      // permanently block the page once a later fetch (this one, or the
      // context's own) succeeds — the error UI takes precedence in render.
      setError(null);
      try {
        let toursToUse = [];

        // Try to get data from API first
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          const response = await axios.get(`${apiUrl}/api/tours`);

          // Handle different API response formats
          if (response.data && response.data.success && Array.isArray(response.data.data)) {
            toursToUse = response.data.data;
          } else if (response.data && Array.isArray(response.data)) {
            toursToUse = response.data;
          } else if (response.data && response.data.data && Array.isArray(response.data.data.tours)) {
            toursToUse = response.data.data.tours;
          } else if (response.data && Array.isArray(response.data.tours)) {
            toursToUse = response.data.tours;
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            toursToUse = response.data.data;
          }
        } catch (apiError) {
          // Fall back to context data below.
        }

        // If API call failed or returned no data, try context data
        if (toursToUse.length === 0 && Array.isArray(tours) && tours.length > 0) {
          toursToUse = tours;
        }

        if (toursToUse.length === 0) {
          setError('No tours available. Please try again later.');
          // setLoading(false); // Temporarily disabled
          return;
        }

        // Set all tours and update loading state
        setAllTours(toursToUse);
        clearTimeout(timeoutId);
        setLoading(false);
      } catch (error) {
        console.error('Error loading tour data:', error);
        setError('Failed to load tours. Please try again later.');
        clearTimeout(timeoutId);
      } finally {
        clearTimeout(timeoutId);
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
            return true; // Include the tour if there's an error filtering
          }
        });

        // Only update if we have actual data
        if (filteredAllTours.length > 0) {
          setAllTours(filteredAllTours);
        }

        // Get hottest tours for the hero slider (up to 10)
        let hottestToursList = tours.filter(isHottestTour);

        // If no hottest tours found, use the first 5 tours as hottest
        if (hottestToursList.length === 0 && tours.length > 0) {
          hottestToursList = tours.slice(0, 5).map(tour => ({
            ...tour,
            hottestTour: true
          }));
        }

        // Ensure we have valid tour data with required fields
        const validHottestTours = hottestToursList.filter(tour =>
          tour && tour.title && (tour.coverImage || tour.imageCover)
        ).slice(0, 10);

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
        // setLoading(false); // Handled by first useEffect
      }
    }
  }, [tours, countries, dataLoading, getPopularTours, getCountriesByContinent, lastRefresh]);

  // Function to check if a tour is featured
  const isFeaturedTour = tour => (
    tour.featured === true ||
    tour.featured === 'true' ||
    tour.featured === 1
  );

  // Derive featured tours from context tours
  useEffect(() => {
    if (!dataLoading && Array.isArray(tours)) {
      setFeaturedTours(tours.filter(isFeaturedTour).slice(0, 6));
    }
  }, [tours, dataLoading]);

  if (loading) {
    return (
      <div className="home">
        <SEO
          title="Explore Tours | Home"
          description="Discover hottest and popular tours around the world."
          canonical="https://goldenhopetravels.com/"
        />
        {/* Hottest Tours will load independently */}
        <HottestTours />

        {/* Popular Tours Skeleton */}
        <ToursSectionSkeleton title="Most Popular Tours" />

        {/* Featured Tours Skeleton */}
        <ToursSectionSkeleton title="Featured Tours" />

        {/* Working Visa Skeleton */}
        <ToursSectionSkeleton title="Working Visa Packages" />
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
      <SEO
        title="Golden Hope Travels - Discover Amazing Travel Destinations & Tour Packages"
        description="Explore the world with Golden Hope Travels. Book exclusive travel packages, guided tours, and unforgettable experiences across multiple countries. Best deals on adventure, cultural, and luxury tours."
        canonical="https://goldenhopetravels.com/"
      />
      <StructuredData type="organization" />
      <StructuredData type="website" />
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
                <img src={`${process.env.PUBLIC_URL}/images/categories/asia.jpg`} alt="Asia Tours" loading="lazy" decoding="async" />
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
                <img src={`${process.env.PUBLIC_URL}/images/categories/europe.jpg`} alt="Europe Tours" loading="lazy" decoding="async" />
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
      <section className="section why-choose-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">We offer the best experience for your journey</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaCompass />
              </div>
              <h3 className="feature-title">Handpicked Tours:</h3>
              <p className="feature-text">
                Our travel experts personally select the best tours and experiences for you.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3 className="feature-title">Small Groups:</h3>
              <p className="feature-text">
                Travel in small groups for a more personalized and intimate experience.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaMapMarkerAlt />
              </div>
              <h3 className="feature-title">Local Experiences:</h3>
              <p className="feature-text">
                Immerse yourself in local cultures with authentic experiences.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaCalendarCheck />
              </div>
              <h3 className="feature-title">Flexible Booking:</h3>
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
