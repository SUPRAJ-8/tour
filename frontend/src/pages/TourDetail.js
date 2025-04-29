import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
    <div className="tour-detail-container">
      {/* Hero Section with Image Grid */}
      <div className="tour-hero-grid">
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(`/countries/${tour.category}/${countryId}`)}>
            ← Back to {country.name}
          </button>
        </div>
        
        <div className="tour-title-container">
          <h1>{tour.title}</h1>
        </div>
        
        <div className="hero-grid-container">
          {tour.heroImages.map((image, index) => (
            <div 
              key={index} 
              className="hero-grid-item"
              style={{ backgroundImage: `url(${image})` }}
            >
            </div>
          ))}
          
          <button className="view-all-images" onClick={() => setShowAllImages(true)}>
            View All Images
          </button>
        </div>
      </div>
      
      {/* Tour Content */}
      <div className="tour-content">
        <div className="tour-main">
          {/* Gallery */}
          <div className="tour-gallery">
            <h2>Tour Gallery</h2>
            <div className="gallery-grid">
              {tour.gallery.map((image, index) => (
                <div className="gallery-item" key={index}>
                  <img src={image} alt={`Tour gallery ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Overview */}
          <div className="tour-overview">
            <h2>Tour Overview</h2>
            <p>{tour.overview}</p>
          </div>
          
          {/* Highlights */}
          <div className="tour-highlights">
            <h2>Tour Highlights</h2>
            <ul>
              {tour.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
          
          {/* Itinerary */}
          <div className="tour-itinerary">
            <h2>Itinerary</h2>
            <div className="itinerary-timeline">
              {tour.itinerary.map((day) => (
                <div className="itinerary-day" key={day.day}>
                  <div className="day-header">
                    <div className="day-number">Day {day.day}</div>
                    <div className="day-title">{day.title}</div>
                  </div>
                  <div className="day-activities">
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
        </div>
        
        <div className="tour-sidebar">
          {/* Price Card */}
          <div className="price-card">
            <div className="price-header">
              <h3>Price Details</h3>
              <div className="price-amount">${tour.price}</div>
              <div className="price-per">per person</div>
            </div>
            <div className="price-body">
              <div className="tour-inclusions">
                <h4>Inclusions</h4>
                <ul>
                  {tour.inclusions.map((inclusion, index) => (
                    <li key={index}>{inclusion}</li>
                  ))}
                </ul>
              </div>
              <div className="tour-exclusions">
                <h4>Exclusions</h4>
                <ul>
                  {tour.exclusions.map((exclusion, index) => (
                    <li key={index}>{exclusion}</li>
                  ))}
                </ul>
              </div>
              <button className="book-now-button">Book Now</button>
              <button className="inquiry-button">Send Inquiry</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
