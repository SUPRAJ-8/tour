import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Check if current page is home page
  const isHomePage = location.pathname === '/';
  
  // Add scroll event listener to detect when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      // Add scrolled class when user scrolls down more than 50px
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${isHomePage ? 'transparent' : ''} ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          TravelTour
        </Link>

        <div className="navbar-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/tours" className="navbar-link" onClick={() => setIsOpen(false)}>
              Tours
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/destinations" className="navbar-link" onClick={() => setIsOpen(false)}>
              Destinations
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/countries" className="navbar-link" onClick={() => setIsOpen(false)}>
              Countries
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link" onClick={() => setIsOpen(false)}>
              About
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </li>

          {isAuthenticated && user.role === 'admin' && (
            <li className="navbar-item user-dropdown">
              <div className="user-menu" onClick={toggleDropdown}>
                <FaUserCircle />
                <span>{user.name}</span>
              </div>
              {showDropdown && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/admin-dashboard" onClick={() => {
                      setIsOpen(false);
                      setShowDropdown(false);
                    }}>
                      Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                      setShowDropdown(false);
                    }}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
