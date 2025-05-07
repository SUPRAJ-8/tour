import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HottestTours.css';

// Custom arrow components for slider
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="slider-arrow next-arrow" onClick={onClick}>
      <FaArrowRight />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="slider-arrow prev-arrow" onClick={onClick}>
      <FaArrowLeft />
    </div>
  );
};

const HottestTours = () => {
  const [hottestTours, setHottestTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHottestTours = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/tours`);
        
        let tours = [];
        // Handle different API response formats
        if (response.data && Array.isArray(response.data)) {
          tours = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data.tours)) {
          tours = response.data.data.tours;
        } else if (response.data && Array.isArray(response.data.tours)) {
          tours = response.data.tours;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          tours = response.data.data;
        }
        
        // Filter for hottest tours
        const hottest = tours.filter(tour => 
          tour.hottestTour === true || 
          tour.hottestTour === 'true' || 
          tour.hottestTour === 1 || 
          String(tour.hottestTour).toLowerCase() === 'true'
        );
        
        console.log('Hottest tours found:', hottest.length);
        
        // Process tours to ensure image fields are properly handled and filter out tours without destinations
        const processedTours = (hottest.length > 0 ? hottest : tours.slice(0, 5))
          .filter(tour => {
            // Only include tours that have a destination specified
            const hasDestination = tour.destination?.name || tour.country;
            if (!hasDestination) {
              console.log(`Skipping tour ${tour.title || tour.name} because it has no destination specified`);
            }
            return hasDestination;
          })
          .map(tour => {
            // Ensure we have a valid image URL
            const imageUrl = tour.coverImage || tour.imageCover || tour.mainCoverImage || 
                            tour.mainCoverImageURL || tour.image || tour.heroImage;
            
            console.log(`Processing tour ${tour.title || tour.name} with destination: ${tour.destination?.name || tour.country}`);
            
            return {
              ...tour,
              processedImageUrl: imageUrl
            };
          });
        
        // Set the processed tours to state (only if there are valid tours)
        if (processedTours.length > 0) {
          setHottestTours(processedTours.slice(0, 10));
        } else {
          console.log('No tours with valid destinations found');
          // Don't update state if no valid tours are found
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hottest tours:', error);
        
        // Fallback to sample data in case of error
        try {
          const tourService = await import('../services/tourService');
          const sampleTours = tourService.getSampleTours();
          
          // Use tours marked as hottestTour or the first 5
          const hottestSampleTours = sampleTours.filter(tour => tour.hottestTour === true);
          setHottestTours(hottestSampleTours.length > 0 ? hottestSampleTours : sampleTours.slice(0, 5));
        } catch (sampleError) {
          console.error('Error loading sample tours:', sampleError);
        }
        
        setLoading(false);
      }
    };
    
    fetchHottestTours();
  }, []);

  if (loading) {
    return (
      <section className="section hottest-tours-section">
        <div className="container">
          <div className="loading">Loading hottest tours...</div>
        </div>
      </section>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: "hero-slider-inner"
  };

  return (
    <section className="section hottest-tours-section">
      <div className="hero-slider">
        <Slider {...sliderSettings}>
          {hottestTours.map((tour, index) => (
            <div key={tour._id || tour.id || index} className="tour-slide">
              <div className="tour-slide-image" style={{ 
                backgroundImage: `url("${tour.processedImageUrl || tour.coverImage || tour.imageCover || tour.mainCoverImage || tour.mainCoverImageURL || tour.image || tour.heroImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80'}")`,
              }}></div>
              <div className="tour-slide-overlay"></div>
              <div className="tour-slide-content">
                <div className="tour-card-badge hottest-tour">Hottest Tour</div>
                <h1 className="tour-slide-title">{tour.title || tour.name}</h1>
                <p className="tour-slide-description">{tour.description?.substring(0, 120) || 'Experience an unforgettable journey with our expertly crafted tour package'}...</p>
                <div className="tour-slide-info">
                  <div className="slide-info-item">
                    <FaMapMarkerAlt />
                    <span>{tour.destination?.name || tour.country || 'China'}</span>
                  </div>
                  <div className="slide-info-item">
                    <FaCalendarAlt />
                    <span>{tour.duration || 5} Days {tour.nights || 4} Nights</span>
                  </div>
                </div>
                <Link to={`/tours/${tour._id || tour.id}`} className="btn btn-primary">View Details</Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default HottestTours;
