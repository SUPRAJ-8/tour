import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaBolt, FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import './PopularTours.css';
import { Swiper, SwiperSlide } from 'swiper/react';
// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Swiper modules
import { Navigation, Pagination } from 'swiper/modules';

const PopularTours = () => {
  const [popularTours, setPopularTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialSlide, setInitialSlide] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchPopularTours = async () => {
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
        
        // Filter for active and popular tours
        const popular = tours.filter(tour => 
          (tour.popularTour === true || 
          tour.popularTour === 'true' || 
          tour.popularTour === 1 || 
          String(tour.popularTour).toLowerCase() === 'true') &&
          (tour.status === 'active' || tour.status === undefined) // include undefined for backward compatibility
        );
        
        console.log('Popular tours found:', popular.length);
        
        // Decide which tours to show
        let toursToShow = [];
        if (popular.length > 0) {
          toursToShow = popular;
        } else {
          // fallback: pick first few active tours as popular replacement
          toursToShow = tours.filter(t => t.status === 'active' || t.status === undefined).slice(0, 10);
        }

        // post-process for image & destination presence
        const processed = toursToShow.filter(t => (t.coverImage || t.imageCover) && (t.destination?.name || t.country)).map(t => ({
          ...t,
          processedImageUrl: t.coverImage || t.imageCover
        }));

        setPopularTours(processed);
        if (processed.length > 0) {
          setInitialSlide(Math.floor(Math.random() * processed.length));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular tours:', error);
        setLoading(false);
      }
    };
    
    fetchPopularTours();
  }, []);

  if (loading) {
    return (
      <section className="section popular-tours-section loading-section" role="status" aria-live="polite">
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <span className="loading-percent">Loading popular tours…</span>
        </div>
      </section>
    );
  }

  return (
    <section className="section popular-tours-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Most Popular Tours</h2>
            <h1 className="section-subtitle">Discover Top International Tour Packages:<br/>Your Adventure Awaits!</h1>
          </div>
          <Link to="/tours" className="view-all-tours-button">
            View All Tours <FaChevronRight className="view-all-icon" />
          </Link>
        </div>
        <div className="popular-tours-swiper-container">
          <div className="custom-nav-btn prev" ref={prevRef}><FaChevronLeft/></div>
          <div className="custom-nav-btn next" ref={nextRef}><FaChevronRight/></div>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onInit={swiper => { swiper.params.navigation.prevEl = prevRef.current; swiper.params.navigation.nextEl = nextRef.current; swiper.navigation.init(); swiper.navigation.update(); }}
            pagination={{ clickable: true }}
            loop={true}
            initialSlide={initialSlide}
            spaceBetween={20}
            slidesPerView={3}
            className="popular-tours-swiper"
          >
            {popularTours.map(tour => (
              <SwiperSlide key={tour._id || tour.id}>
                <Link to={`/tours/${tour._id||tour.id}`} className="popular-tour-card">
                  <div className="popular-tour-image">
                    <img src={tour.coverImage||tour.imageCover} alt={tour.title||tour.name} />
                    <div className="popular-tour-badge"><FaBolt/> Most Popular</div>
                  </div>
                  <div className="popular-tour-content">
                    <div className="tour-rating">{[1,2,3,4,5].map(s=> <FaStar key={s} style={{color:'#f39c12'}}/>)}<span className="rating-count">({tour.ratingsQuantity||9})</span></div>
                    <h3 className="popular-tour-title">{tour.title||tour.name}</h3>
                    <div className="popular-tour-info">
                      <div className="info-item"><FaMapMarkerAlt style={{color:'#0095ff'}}/><span>{tour.destination?.name||tour.country}</span></div>
                      <div className="info-item"><BsCalendar3 style={{color:'#0095ff'}}/><span>{tour.duration||5} Days {tour.nights||4} Nights</span></div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PopularTours;
