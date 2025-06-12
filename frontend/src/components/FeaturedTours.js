import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaBolt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import './PopularTours.css';
import '../pages/Tours.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const FeaturedTours = ({ tours }) => {
  const [initialSlide, setInitialSlide] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(tours) && tours.length > 0) {
      setInitialSlide(Math.floor(Math.random() * tours.length));
    }
  }, [tours]);

  if (!tours || tours.length === 0) {
    return (
      <section className="section popular-tours-section" style={{ marginTop: 0 }}>
        <div className="container">
          <h2 className="section-title">Featured International Tours</h2>
          <p className="section-subtitle">Handpicked global experiences by our travel experts</p>
          <p className="text-center">No featured tours available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section popular-tours-section" style={{ marginTop: 0 }}>
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured International Tours</h2>
            <h1 className="section-subtitle">Handpicked global experiences by our travel experts</h1>
          </div>
          <Link to="/tours" className="view-all-tours-button">
            View All Tours <FaChevronRight className="view-all-icon" />
          </Link>
        </div>
        <div className="popular-tours-swiper-container">
          <div className="custom-nav-btn prev" ref={prevRef}><FaChevronLeft /></div>
          <div className="custom-nav-btn next" ref={nextRef}><FaChevronRight /></div>
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
            {tours.map(tour => (
              <SwiperSlide key={tour._id || tour.id}>
                <Link to={`/tours/${tour._id || tour.id}`} className="popular-tour-card">
                  <div className="popular-tour-image">
                    <img src={tour.coverImage || tour.imageCover} alt={tour.title || tour.name} />
                    <div className="tour-popular-badge featured-badge"><FaStar /> Featured Tour</div>
                  </div>
                  <div className="popular-tour-content">
                    <div className="tour-rating">
                      {[1,2,3,4,5].map(s => <FaStar key={s} style={{ color: '#f39c12' }} />)}
                      <span className="rating-count">({tour.ratingsQuantity || 0})</span>
                    </div>
                    <h3 className="popular-tour-title">{tour.title || tour.name}</h3>
                    <div className="popular-tour-info">
                      <div className="info-item"><FaMapMarkerAlt style={{ color: '#0095ff' }} /><span>{tour.destination?.name || tour.country}</span></div>
                      <div className="info-item">
                        <BsCalendar3 style={{ color: '#0095ff' }} />
                        <span>{tour.nights || '?'} Nights - {tour.days || tour.duration || '?'} Days</span>
                      </div>
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

export default FeaturedTours;
