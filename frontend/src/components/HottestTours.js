import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaFire, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useData } from '../context/DataContext';
import HeroSkeleton from './HeroSkeleton';
import './HottestTours.css';

// Custom arrow components for slider
const NextArrow = ({ onClick }) => (
  <div className="slider-arrow next-arrow" onClick={onClick}>
    <FaArrowRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="slider-arrow prev-arrow" onClick={onClick}>
    <FaArrowLeft />
  </div>
);

const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80';

const HottestTours = () => {
  const { tours, loading: dataLoading } = useData();

  const hottestTours = useMemo(() => {
    if (!Array.isArray(tours) || tours.length === 0) return [];

    const isHottest = (t) =>
      (t.hottestTour === true || t.hottestTour === 'true') &&
      (t.status === 'active' || t.status === undefined);

    const base = tours.filter(isHottest);
    const candidates = base.length > 0 ? base : tours.slice(0, 5);

    return candidates
      .filter((t) => t?.destination?.name || t?.country)
      .map((t) => ({
        ...t,
        processedImageUrl:
          t.coverImage || t.imageCover || t.mainCoverImage ||
          t.mainCoverImageURL || t.image || t.heroImage,
      }))
      .slice(0, 10);
  }, [tours]);

  const initialSlide = useMemo(
    () => (hottestTours.length ? Math.floor(Math.random() * hottestTours.length) : 0),
    [hottestTours.length]
  );

  // While DataContext hasn't resolved yet, or resolved with nothing usable,
  // show the skeleton instead of an empty slider.
  if (dataLoading || hottestTours.length === 0) {
    return <HeroSkeleton />;
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    initialSlide,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: 'hero-slider-inner',
  };

  return (
    <section className="section hottest-tours-section">
      <div className="hero-slider">
        <Slider {...sliderSettings}>
          {hottestTours.map((tour, index) => {
            const imgSrc = tour.processedImageUrl || FALLBACK_HERO_IMAGE;
            const isFirst = index === 0;
            return (
              <div key={tour._id || tour.id || index} className="tour-slide two-column" style={{ display: 'flex' }}>
                <div className="tour-slide-content">
                  <div className="tour-card-badge hottest-tour">
                    <FaFire style={{ marginRight: '5px', color: 'white' }} /> Hottest Tour
                  </div>
                  <h3 className="tour-slide-title">{tour.title || tour.name}</h3>
                  <p className="tour-slide-description">
                    {(tour.description?.replace(/<[^>]*>/g, '') ||
                      'Experience an unforgettable journey with our expertly crafted tour package').substring(0, 120)}...
                  </p>
                  <div className="tour-slide-info">
                    <div className="slide-info-item">
                      <FaMapMarkerAlt />
                      <span>{tour.destination?.country || tour.country}</span>
                    </div>
                    <div className="slide-info-item">
                      <FaCalendarAlt />
                      <span>{tour.nights} Nights - {tour.days} Days</span>
                    </div>
                  </div>
                  <Link to={`/tours/${tour._id || tour.id}`} className="btn btn-primary">View Details</Link>
                </div>

                <div className="tour-slide-image-wrapper">
                  <img
                    className="hero-img"
                    src={imgSrc}
                    alt={tour.title || tour.name || 'Featured tour'}
                    fetchpriority={isFirst ? 'high' : 'low'}
                    loading="eager"
                    decoding="async"
                    width="1920"
                    height="1080"
                  />
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
};

export default HottestTours;
