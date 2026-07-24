import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaGlobe, FaHandshake, FaLeaf } from 'react-icons/fa';
import SEO from '../components/SEO';
import './About.css';

const About = () => {
  return (
    <section className="about-page">
      <SEO
        title="About Us"
        description="Learn about Golden Hope Travels' story, mission, and values — the tour operator helping travelers explore the world sustainably since 2023."
        canonical="https://goldenhopetravels.com/about"
      />
      <div className="about-header">
        <div className="container">
          <h1 className="about-title">About Us</h1>
        </div>
      </div>

      <div className="container">
        <div className="about-content">
          <div className="about-image">
            <img src="/images/logo.png" alt="About Golden Hope Travels" />
          </div>
          
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              <b>Golden Hope Travels</b> was founded in <b>2023</b> with a simple mission: to help people explore the world in a meaningful and sustainable way. What started as a small team of passionate travelers has grown into a leading tour operator with a global presence.
            </p>
            <p>
              We believe that travel has the power to transform lives, broaden perspectives, and create lasting connections between people and cultures. Our carefully curated tours are designed to provide authentic experiences that go beyond typical tourist attractions.
            </p>
            <p>
              Over the years, we've helped <b>thousands of travelers</b> discover new destinations, create unforgettable memories, and develop a deeper appreciation for the diverse <b>cultures and landscapes</b> our world has to offer.
            </p>
          </div>
        </div>

        <div className="values-section">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FaUsers />
              </div>
              <h3>Customer First</h3>
              <p>
                We prioritize our customers' needs and preferences, ensuring personalized service and exceptional experiences.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <FaGlobe />
              </div>
              <h3>Cultural Respect</h3>
              <p>
                We promote understanding and respect for local cultures, traditions, and environments in all our tours.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <FaHandshake />
              </div>
              <h3>Community Support</h3>
              <p>
                We partner with local businesses and communities to ensure that tourism benefits the places we visit.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <FaLeaf />
              </div>
              <h3>Sustainability</h3>
              <p>
                We are committed to sustainable travel practices that minimize environmental impact and preserve natural resources.
              </p>
            </div>
          </div>
        </div>

        

        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Explore the World with Us?</h2>
            <p>Browse our selection of tours and start planning your next adventure today.</p>
            <div className="cta-buttons">
              <Link to="/tours" className="btn btn-primary">View Tours</Link>
              <Link to="/contact" className="btn btn-outline">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
