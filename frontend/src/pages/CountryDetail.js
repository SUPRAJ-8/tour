import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './CountryDetail.css';

// Static tour images
const tourImages = [
  'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1540329957110-b87f1f53f2a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1516496636080-14fb876e029d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
];

const CountryDetail = ({ category }) => {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { addTour, refreshData } = useData();
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState(null);
  const [tourPackages, setTourPackages] = useState([]);
  const [timestamp, setTimestamp] = useState(new Date().getTime());
  const [savingTour, setSavingTour] = useState(false);
  const [savedTours, setSavedTours] = useState([]);
  const [databaseTours, setDatabaseTours] = useState([]);

  // Function to fetch tours for this country from the database
  const fetchToursForCountry = useCallback(async () => {
    try {
      console.log('Fetching tours for country:', countryId);
      const response = await axios.get('/api/tours');
      
      // Process the response to get tours array
      let toursArray = [];
      if (Array.isArray(response.data)) {
        toursArray = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        toursArray = response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        toursArray = [response.data];
      }
      
      // Filter tours for this country
      const countryTours = toursArray.filter(tour => {
        // Check if the tour is related to this country
        const tourCountry = tour.destination?.country || '';
        const tourTitle = tour.title || '';
        
        return (
          (typeof tourCountry === 'string' && tourCountry.toLowerCase() === countryId.toLowerCase()) ||
          (typeof tourCountry === 'object' && tourCountry.name && tourCountry.name.toLowerCase() === countryId.toLowerCase()) ||
          tourTitle.toLowerCase().includes(countryId.toLowerCase())
        );
      });
      
      console.log('Found tours for this country:', countryTours.length);
      setDatabaseTours(countryTours);
    } catch (error) {
      console.error('Error fetching tours for country:', error);
    }
  }, [countryId]);

  // Function to force a complete data refresh
  const forceRefresh = useCallback(async () => {
    setLoading(true);
    setTimestamp(new Date().getTime());
    try {
      // Directly fetch from the API with cache busting
      const response = await axios.get(`/api/countries/name/${countryId}?_=${Date.now()}`);
      setCountry(response.data);
      console.log('Forced refresh completed, new data:', response.data);
      
      // Also fetch all tours for this country
      await fetchToursForCountry();
    } catch (error) {
      console.error('Error during forced refresh:', error);
    } finally {
      setLoading(false);
    }
  }, [countryId, fetchToursForCountry]);
  
  // Function to check if a tour already exists in the database
  const checkIfTourExists = async (tourTitle) => {
    try {
      // Get all tours
      const response = await axios.get('/api/tours');
      console.log('Checking if tour exists:', tourTitle);
      
      // Check the structure of the response
      let toursArray = [];
      if (Array.isArray(response.data)) {
        toursArray = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        toursArray = response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        toursArray = [response.data];
      }
      
      // Check if any tour has the same title
      const existingTour = toursArray.find(t => 
        t && t.title && t.title.toLowerCase() === tourTitle.toLowerCase());
      
      return existingTour;
    } catch (error) {
      console.error('Error checking if tour exists:', error);
      return null;
    }
  };
  
  // Function to save a tour to the database
  const saveTourToDatabase = async (tour) => {
    setSavingTour(true);
    try {
      console.log('Starting to save tour:', tour.title);
      
      // Check if the tour already exists
      const existingTour = await checkIfTourExists(tour.title);
      if (existingTour) {
        console.log('Tour already exists:', existingTour);
        // Mark this tour as saved
        setSavedTours(prev => [...prev, tour.id]);
        toast.info(`"${tour.title}" is already saved in the database!`);
        setSavingTour(false);
        return;
      }
      
      // Instead of creating a new destination, let's find an existing one
      // Get all destinations
      const destinationsResponse = await axios.get('/api/destinations');
      console.log('Destinations response:', destinationsResponse.data);
      
      // Check the structure of the response data
      let destinationsArray = [];
      
      if (Array.isArray(destinationsResponse.data)) {
        destinationsArray = destinationsResponse.data;
      } else if (destinationsResponse.data && Array.isArray(destinationsResponse.data.data)) {
        destinationsArray = destinationsResponse.data.data;
      } else if (destinationsResponse.data && typeof destinationsResponse.data === 'object') {
        destinationsArray = [destinationsResponse.data];
      }
      
      // Find a destination for this country
      let destinationId = null;
      
      // Check if we have a destination for this country
      const matchingDestination = destinationsArray.find(
        dest => dest.country && dest.country.toLowerCase() === country.name.toLowerCase()
      );
      
      if (matchingDestination) {
        destinationId = matchingDestination._id;
        console.log('Found matching destination:', matchingDestination.name);
      } else {
        console.log('No matching destination found, will use first available or create new');
        
        // If no matching destination, use the first one as a fallback
        if (destinationsArray.length > 0) {
          destinationId = destinationsArray[0]._id;
          console.log('Using first destination as fallback:', destinationsArray[0].name);
        } else {
          console.log('No destinations available, will try to create one');
          
          // Try to create a new destination for this country
          try {
            const newDestination = {
              name: country.name,
              description: `Explore the beautiful country of ${country.name}`,
              country: country.name,
              continent: category || 'asia', // Default to Asia if category not provided
              coverImage: country.image || tour.image
            };
            
            const createDestResponse = await axios.post('/api/destinations', newDestination);
            if (createDestResponse.data && createDestResponse.data._id) {
              destinationId = createDestResponse.data._id;
              console.log('Created new destination:', createDestResponse.data.name);
            }
          } catch (destError) {
            console.error('Error creating destination:', destError);
            toast.error('Could not create destination. Tour may not be properly categorized.');
          }
        }
      }
      
      // Parse the duration string to get days and nights
      const durationParts = tour.duration.split(' ');
      const days = parseInt(durationParts[0]) || 5;
      const nights = parseInt(durationParts[3]) || 4;
      
      // Generate a more realistic price based on days
      const basePrice = 100 + (days * 150);
      const price = basePrice + Math.floor(Math.random() * 100);
      const discountPrice = price - Math.floor(price * 0.1); // 10% discount
      
      // Generate a detailed description
      const description = `Experience the beauty and culture of ${country.name} with our ${days}-day ${tour.title}. This carefully crafted itinerary takes you through the most iconic sights and hidden gems of ${country.name}, providing an unforgettable travel experience with comfortable accommodations, expert guides, and authentic local experiences.`;
      
      // Generate a dynamic itinerary based on tour duration
      const itinerary = [];
      for (let i = 1; i <= days; i++) {
        let dayDescription = '';
        
        if (i === 1) {
          dayDescription = `Arrival in ${country.name} - Welcome dinner and hotel check-in`;
        } else if (i === days) {
          dayDescription = `Farewell breakfast - Airport transfer and departure`;
        } else {
          const activities = [
            `Visit to ${country.name}'s famous landmarks`,
            'Cultural experience with local artisans',
            'Guided tour of historical sites',
            'Free time for shopping and exploration',
            'Scenic drive through countryside',
            'Traditional cooking class',
            'Visit to local markets',
            'Boat tour of scenic waterways'
          ];
          
          dayDescription = activities[i % activities.length];
        }
        
        itinerary.push({
          day: i,
          description: `Day ${i}: ${dayDescription}`,
          activities: ['Morning activity', 'Lunch at local restaurant', 'Afternoon excursion', 'Evening entertainment']
        });
      }
      
      // Prepare the tour data
      const tourData = {
        title: tour.title,
        description: description,
        destination: destinationId,
        duration: days,
        price: price,
        discountPrice: discountPrice,
        maxGroupSize: 12,
        difficulty: 'easy',
        ratings: 4.5,
        coverImage: tour.image,
        images: [tour.image],
        itinerary: itinerary,
        includes: [
          'Hotel Accommodation',
          'Daily Breakfast',
          'Airport Transfers',
          'Local English-speaking Guide',
          'Entrance Fees to Attractions',
          'Welcome Dinner'
        ],
        excludes: [
          'International Flights',
          'Travel Insurance',
          'Personal Expenses',
          'Optional Activities',
          'Visa Fees (if applicable)'
        ],
        featured: tour.tag === 'Hottest Tour',
        status: 'active' // Set status to active instead of pending
      };

      console.log('Sending tour data to API:', tourData);
      
      // Make a direct API call instead of using the context function
      // First check if the tour requires a createdBy field
      try {
        const response = await axios.post('/api/tours', tourData);
        console.log('Tour creation response:', response.data);
      } catch (tourError) {
        // If the error is about missing createdBy field, try to get the current user ID
        if (tourError.response && tourError.response.data && 
            (tourError.response.data.message || '').includes('createdBy')) {
          console.log('Tour requires createdBy field, getting current user');
          
          // Try to get the current user
          const userResponse = await axios.get('/api/auth/me');
          if (userResponse.data && userResponse.data._id) {
            console.log('Adding createdBy field with user ID:', userResponse.data._id);
            tourData.createdBy = userResponse.data._id;
            
            // Try again with the createdBy field
            const retryResponse = await axios.post('/api/tours', tourData);
            console.log('Tour creation retry response:', retryResponse.data);
          } else {
            throw new Error('Could not get current user ID for createdBy field');
          }
        } else {
          // Rethrow the original error
          throw tourError;
        }
      }
      
      // Mark this tour as saved
      setSavedTours(prev => [...prev, tour.id]);
      
      // Refresh data to update the database tours list
      await refreshData();
      await fetchToursForCountry();
      
      // Show success message
      toast.success(`"${tour.title}" has been saved to the database!`);
    } catch (error) {
      console.error('Error saving tour to database:', error);
      // Show more detailed error message
      const errorMessage = error.response ? 
        `Error ${error.response.status}: ${JSON.stringify(error.response.data)}` : 
        error.message;
      
      toast.error(`Failed to save tour: ${errorMessage}`);
    } finally {
      setSavingTour(false);
    }
  };

  // Set up a one-time refresh when component mounts
  useEffect(() => {
    // Force a refresh when the component mounts
    forceRefresh();
  }, [forceRefresh]);

  // This effect handles generating tour packages once we have country data
  useEffect(() => {
    // Skip if we don't have country data yet
    if (!country) return;
    
    // Fetch tours for this country
    fetchToursForCountry();
    
    // Generate tour packages based on country
    const generateTourPackages = () => {
      const durations = ['5 Days 4 Nights', '6 Days 5 Nights', '8 Days 7 Nights', '9 Days 8 Nights'];
      const attractions = country.popularDestinations || ['City Tour', 'Beach Tour', 'Mountain Tour', 'Cultural Tour'];
      const tourPackagesData = [];
      
      // Create 4 tour packages for the country
      for (let i = 0; i < 4; i++) {
        const duration = durations[i % durations.length];
        const days = parseInt(duration.split(' ')[0]);
        const nights = parseInt(duration.split(' ')[3]);
        
        // Create tour title based on country and attractions
        let title;
        if (i === 0) {
          title = `${nights}N/${days}D ${country.name} Complete Tour`;
        } else if (attractions.length >= 3 && i < 3) {
          // Use actual attractions if available
          const usedAttractions = attractions.slice(0, Math.min(3, attractions.length));
          title = `${nights}N/${days}D ${usedAttractions.join('-')} Tour`;
        } else {
          title = `${nights}N/${days}D ${country.name} Explorer Tour`;
        }
        
        // Create a unique image URL for each tour
        const imageIndex = i % tourImages.length;
        
        tourPackagesData.push({
          id: `tour${i + 1}`,
          title: title,
          image: tourImages[imageIndex],
          rating: 4.5 + (Math.random() * 0.5).toFixed(1), // Random rating between 4.5 and 5.0
          reviewCount: Math.floor(Math.random() * 50) + 5, // Random review count between 5 and 55
          location: country.name,
          duration: duration,
          tag: i === 0 ? 'Hottest Tour' : 'Most Popular'
        });
      }
      
      setTourPackages(tourPackagesData);
    };
    
    generateTourPackages();
  }, [country, fetchToursForCountry]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading country information...</p>
      </div>
    );
  }

  // Safety check for country data
  if (!country) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Country information not available. Please try again later.</p>
        <button onClick={forceRefresh} className="refresh-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="country-detail-container">
      {/* Hero Section */}
      <div 
        className="country-hero" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${country?.heroImage || country?.image || '/images/default-country.jpg'}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'high-quality'
        }}
      >
        <div className="hero-overlay">
          <h1>{country.name}</h1>
          <p>{country.description}</p>
          <img 
            src={country.flagImage} 
            alt={`${country.name} flag`} 
            className="country-flag" 
            onError={(e) => {
              console.error('Flag image failed to load');
              e.target.style.display = 'none';
            }}
          />
          <Link to={`/countries/${category}`} className="back-button">
            &larr; Back to {category === 'asia' ? 'Asian' : 'European'} Countries
          </Link>
        </div>
      </div>
      
      <div className="tour-packages-section">
        <h2>Tour Packages</h2>
        
        {/* Database Tours Section */}
        {databaseTours.length > 0 ? (
          <div className="database-tours-section">
            <h3 className="section-subtitle">Available Tours</h3>
            <div className="tour-cards-grid">
              {databaseTours.map((tour) => (
                <div className="tour-card-wrapper" key={tour._id}>
                  <Link to={`/tours/${tour._id}`} className="country-tour-card">
                    <div className="tour-card-image">
                      <img src={tour.coverImage} alt={tour.title} />
                      {tour.featured && (
                        <div className="tour-tag hot">Featured</div>
                      )}
                      <div className="tour-duration-overlay">
                        <FaCalendarAlt className="duration-icon-overlay" />
                        <span>{tour.duration} Days {tour.duration - 1} Nights</span>
                      </div>
                    </div>
                    <div className="tour-card-content">
                      <div className="tour-rating">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span key={index} className={index < Math.floor(tour.ratingsAverage || 5) ? "star-icon" : "star-icon empty"}>
                            {index < Math.floor(tour.ratingsAverage || 5) ? <FaStar /> : <FaRegStar />}
                          </span>
                        ))}
                        <span className="review-count">({tour.ratingsQuantity || tour.reviewsCount || 'New'})</span>
                      </div>
                      <h3 className="tour-title">{tour.title}</h3>
                      <div className="tour-location">
                        <FaMapMarkerAlt className="location-icon" />
                        <span>{tour.destination?.country || country.name}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-tours-message">
            <h3>Sorry, currently unavailable. Coming soon</h3>
            <p>We're working on adding tour packages for {country.name}. Please check back later!</p>
          </div>
        )}
        
        {/* Dynamic Tour Packages Section - Removed */}
      </div>
      
      {/* Country Information Section - Removed */}
    </div>
  );
};

export default CountryDetail;
