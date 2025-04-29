import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaGlobe, FaHandshake, FaLeaf } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <section className="about-page">
      <div className="about-header">
        <div className="container">
          <h1 className="about-title">About Us</h1>
          <p className="about-subtitle">Learn more about TravelTour and our mission</p>
        </div>
      </div>

      <div className="container">
        <div className="about-content">
          <div className="about-image">
            <img src="/images/about-image.jpg" alt="About TravelTour" />
          </div>
          
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              TravelTour was founded in 2015 with a simple mission: to help people explore the world in a meaningful and sustainable way. What started as a small team of passionate travelers has grown into a leading tour operator with a global presence.
            </p>
            <p>
              We believe that travel has the power to transform lives, broaden perspectives, and create lasting connections between people and cultures. Our carefully curated tours are designed to provide authentic experiences that go beyond typical tourist attractions.
            </p>
            <p>
              Over the years, we've helped thousands of travelers discover new destinations, create unforgettable memories, and develop a deeper appreciation for the diverse cultures and landscapes our world has to offer.
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

        <div className="team-section">
          <h2 className="section-title">Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-1.jpg" alt="John Doe" />
              </div>
              <h3>John Doe</h3>
              <p className="member-role">Founder & CEO</p>
              <p className="member-bio">
                With over 20 years of experience in the travel industry, John founded TravelTour with a vision to create meaningful travel experiences.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-2.jpg" alt="Jane Smith" />
              </div>
              <h3>Jane Smith</h3>
              <p className="member-role">Head of Operations</p>
              <p className="member-bio">
                Jane ensures that every tour runs smoothly, from planning to execution, with a focus on quality and customer satisfaction.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-3.jpg" alt="Michael Johnson" />
              </div>
              <h3>Michael Johnson</h3>
              <p className="member-role">Lead Tour Designer</p>
              <p className="member-bio">
                Michael combines his passion for travel with deep cultural knowledge to create unique and authentic tour experiences.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-4.jpg" alt="Sarah Williams" />
              </div>
              <h3>Sarah Williams</h3>
              <p className="member-role">Customer Relations Manager</p>
              <p className="member-bio">
                Sarah is dedicated to providing exceptional customer service and ensuring that every traveler's needs are met.
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
