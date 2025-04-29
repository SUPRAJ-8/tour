import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAsia, FaGlobeEurope, FaMapMarkedAlt, FaPlane, FaPassport } from 'react-icons/fa';
import './Countries.css';

const Categories = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Hero section background images
  const heroBackgrounds = [
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // World map
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Airplane view
    'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'  // Passport and map
  ];
  
  // Stats for the hero section
  const travelStats = [
    { icon: <FaGlobeAsia />, value: '20+', label: 'Asian Countries' },
    { icon: <FaGlobeEurope />, value: '25+', label: 'European Countries' },
    { icon: <FaMapMarkedAlt />, value: '100+', label: 'Destinations' },
    { icon: <FaPlane />, value: '500+', label: 'Tours Available' }
  ];
  
  // Main categories data
  const categories = [
    {
      id: 'asia',
      name: 'Asia',
      description: 'Explore the diverse cultures, ancient temples, and stunning landscapes of Asia. From the bustling streets of Tokyo to the serene beaches of Thailand, Asia offers a rich tapestry of experiences for every traveler.',
      image: 'https://images.unsplash.com/photo-1535139262971-c51845709a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      icon: <FaGlobeAsia />,
      countries: 'Japan, China, India, Thailand, Vietnam, Singapore, Malaysia, and more',
      featuredDestinations: 'Tokyo, Bali, Bangkok, Great Wall of China, Taj Mahal',
      color: '#e74c3c'
    },
    {
      id: 'europe',
      name: 'Europe',
      description: 'Discover historic cities, charming villages, and breathtaking scenery across Europe. From the romantic streets of Paris to the ancient ruins of Rome, Europe is a treasure trove of cultural and historical wonders.',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      icon: <FaGlobeEurope />,
      countries: 'France, Italy, Spain, Germany, UK, Switzerland, Greece, Portugal, and more',
      featuredDestinations: 'Paris, Rome, Barcelona, Santorini, Swiss Alps',
      color: '#3498db'
    }
  ];
  
  // Change hero background every 5 seconds
  useEffect(() => {
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroBackgrounds.length]);

  return (
    <div className="countries-page">
      {/* Hero Section */}
      <div className="countries-hero">
        {heroBackgrounds.map((bg, index) => (
          <div 
            key={index} 
            className={`hero-slide ${activeSlide === index ? 'active' : ''}`}
            style={{ backgroundImage: `url(${bg})` }}
          ></div>
        ))}
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <h1 className={`hero-title ${isLoaded ? 'loaded' : ''}`}>Discover the World</h1>
          <p className={`hero-subtitle ${isLoaded ? 'loaded' : ''}`}>
            Explore amazing destinations across continents and create unforgettable memories
          </p>
          
          <div className={`hero-stats ${isLoaded ? 'loaded' : ''}`}>
            {travelStats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className={`hero-cta ${isLoaded ? 'loaded' : ''}`}>
            <Link to="/tours" className="cta-button primary">Browse All Tours</Link>
            <Link to="/contact" className="cta-button secondary">Contact Us</Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="categories-container">
        <div className="categories-header">
          <h2>Explore By Continent</h2>
          <p>Begin your journey by choosing a continent to explore</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.id}>
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <div className="category-icon" style={{ backgroundColor: category.color }}>
                    {category.icon}
                  </div>
                  <h2>{category.name}</h2>
                </div>
              </div>
              <div className="category-content">
                <p>{category.description}</p>
                
                <div className="category-details">
                  <div className="detail-section">
                    <h3>Featured Countries</h3>
                    <p>{category.countries}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Top Destinations</h3>
                    <p>{category.featuredDestinations}</p>
                  </div>
                </div>
                
                <Link to={`/countries/${category.id}`} className="explore-button" style={{ backgroundColor: category.color }}>
                  Explore {category.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Why Choose Us Section */}
      <div className="why-choose-us">
        <div className="container">
          <h2>Why Travel With Us</h2>
          <p className="section-subtitle">We provide unforgettable experiences with premium service</p>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <FaPassport />
              </div>
              <h3>Expert Guides</h3>
              <p>Our experienced local guides provide insider knowledge and authentic experiences</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <FaMapMarkedAlt />
              </div>
              <h3>Curated Itineraries</h3>
              <p>Carefully planned routes that balance must-see attractions with hidden gems</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <FaPlane />
              </div>
              <h3>Hassle-Free Travel</h3>
              <p>We handle all the logistics so you can focus on enjoying your journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
