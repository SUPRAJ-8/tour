import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
    <nav className="navbar">
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
                    <Link to="/dashboard" onClick={() => {
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
