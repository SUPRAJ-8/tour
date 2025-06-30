import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Zypher Tour And Travels</h3>
            <p className="footer-text">
              Discover the world with our premium travel experiences. We offer the best tours and travel packages to destinations worldwide.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/profile.php?id=61576786452991" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://wa.me/+9779840007310" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/tours">Tours</Link>
              </li>
              <li>
                <Link to="/countries">Continents</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Top Continents</h3>
            <ul className="footer-links">
              <li>
                <Link to="/countries/asia">Asia</Link>
              </li>
              <li>
                <Link to="/countries/europe">Europe</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt />
                <a href="https://www.google.com/maps?q=Budhanilkantha+Sadak,+bansbari,+Kathmandu,+Nepal" target="_blank" rel="noopener noreferrer" className="location-link">Budhanilkantha Sadak, bansbari, Kathmandu, Nepal</a>
              </li>
              <li>
                <FaPhone />
                <a href="tel:+9779765198757" className="phone-link">+9779765198757</a>
              </li>
              <li>
                <FaEnvelope />
                <a href="mailto:Zyphertourandtravel@gmail.com" className="email-link">Zyphertourandtravel@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Zypher. All rights reserved.</p>
          <p>Made with ❤️ by Supraj Shrestha</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
