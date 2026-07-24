import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaChevronLeft, FaChevronRight, FaPassport } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import ToursSectionSkeleton from './ToursSectionSkeleton';
import './PopularTours.css';
import '../pages/Tours.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import axios from 'axios';

const WorkingVisaCards = () => {
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchVisas = async () => {
      // Only show skeleton if fetch takes longer than 200ms
      const timeoutId = setTimeout(() => setLoading(true), 200);
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/visas`);
        const visasRaw = res?.data?.data?.data || res?.data?.data || res?.data || [];
        const formatted = visasRaw.map(v => ({
          ...v,
          _id: v._id,
          title: v.tourPackageName || v.title || 'Working Visa',
          destination: { country: v.destination || v.country || 'N/A' },
          coverImage: v.mainCoverImage,
          duration: v.duration || v.durationText || (v.days ? `${v.days} Days` : ''),
          days: v.days || 0,
          nights: v.nights || (v.days ? Math.max(v.days - 1, 0) : 0),
          type: 'visa'
        }));
        setVisas(formatted);
        if (formatted.length > 0) {
          setInitialSlide(Math.floor(Math.random() * formatted.length));
        }
        clearTimeout(timeoutId);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load visas', err);
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchVisas();
  }, []);

  if (loading) {
    return <ToursSectionSkeleton title="Working Visa Packages" />;
  }

  if (!visas || visas.length === 0) {
    return null; // Do not render the section if no visas
  }

  return (
    <section className="section popular-tours-section" style={{ marginTop: 0, paddingTop: 0 }}>
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Working Visa</h2>
            <p className="section-subtitle">Explore global opportunities to work abroad</p>
          </div>
          {/* Add link to generic visa listing or tours */}
          <Link to="/tours" className="view-all-tours-button">
            View All <FaChevronRight className="view-all-icon" />
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
            breakpoints={{
              0: { slidesPerView: 1.1, spaceBetween: 10 },
              480: { slidesPerView: 1.4, spaceBetween: 14 },
              768: { slidesPerView: 2, spaceBetween: 18 },
              992: { slidesPerView: 3, spaceBetween: 20 }
            }}
            grabCursor={true}
            threshold={5}
            className="popular-tours-swiper"
          >
            {visas.map(visa => (
              <SwiperSlide key={visa._id || visa.id}>
                <Link to={`/tours/${visa._id || visa.id}`} className="popular-tour-card">
                  <div className="popular-tour-image">
                    <img src={visa.coverImage || '/images/placeholder.jpg'} alt={visa.title} loading="lazy" decoding="async" />
                    <div className="tour-popular-badge working-visa-badge"><FaPassport /> Working Visa</div>
                  </div>
                  <div className="popular-tour-content">
                    <div className="tour-rating">
                      {[1,2,3,4,5].map(s => <FaStar key={s} style={{ color: '#f39c12' }} />)}
                      <span className="rating-count">(0)</span>
                    </div>
                    <h3 className="popular-tour-title">{visa.title}</h3>
                    <div className="popular-tour-info">
                      <div className="info-item"><FaMapMarkerAlt style={{ color: '#0095ff' }} /><span>{visa.destination?.country || visa.country}</span></div>
                      <div className="info-item">
                        <BsCalendar3 style={{ color: '#0095ff' }} />
                        <span>{visa.duration || (visa.nights ? `${visa.nights} Nights - ${visa.days || ''} Days` : (visa.days ? `${visa.days} Days` : '?'))}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Mobile-only View All button */}
        <Link to="/tours" className="view-all-tours-button mobile-only">
          View All <FaChevronRight className="view-all-icon" />
        </Link>
      </div>
    </section>
  );
};

export default WorkingVisaCards;
