import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaCreditCard, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/bookings/my-bookings');
        setBookings(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setLoading(false);
      }
    };

    if (activeTab === 'bookings') {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setUpdateSuccess(false);
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
    
    // Clear error for this field
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!profileData.name) {
      errors.name = 'Name is required';
    }
    
    if (!profileData.email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(profileData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await updateProfile(profileData);
        setUpdateSuccess(true);
      } catch (err) {
        console.error('Error updating profile:', err);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const renderProfileTab = () => {
    return (
      <div className="dashboard-tab-content">
        <h2>My Profile</h2>
        
        {updateSuccess && (
          <div className="alert alert-success">
            Profile updated successfully!
          </div>
        )}
        
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
              value={profileData.name}
              onChange={handleProfileChange}
            />
            {formErrors.name && (
              <div className="error-message">{formErrors.name}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
              value={profileData.email}
              onChange={handleProfileChange}
            />
            {formErrors.email && (
              <div className="error-message">{formErrors.email}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-control"
              value={profileData.phone}
              onChange={handleProfileChange}
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </form>
      </div>
    );
  };

  const renderBookingsTab = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    return (
      <div className="dashboard-tab-content">
        <h2>My Bookings</h2>
        
        {bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.tour.title}</h3>
                  <span className={`booking-status status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="booking-details">
                  <div className="booking-detail">
                    <span className="detail-label">Booking Date:</span>
                    <span className="detail-value">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="booking-detail">
                    <span className="detail-label">Travel Date:</span>
                    <span className="detail-value">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="booking-detail">
                    <span className="detail-label">Travelers:</span>
                    <span className="detail-value">{booking.numberOfPeople}</span>
                  </div>
                  
                  <div className="booking-detail">
                    <span className="detail-label">Total Amount:</span>
                    <span className="detail-value">${booking.totalAmount}</span>
                  </div>
                  
                  <div className="booking-detail">
                    <span className="detail-label">Payment Status:</span>
                    <span className={`detail-value status-${booking.paymentStatus}`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
                
                <div className="booking-actions">
                  <Link to={`/tours/${booking.tour._id}`} className="btn btn-outline">
                    View Tour
                  </Link>
                  
                  {booking.status === 'pending' && (
                    <button className="btn btn-danger">
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <p>You don't have any bookings yet.</p>
            <Link to="/tours" className="btn btn-primary">Browse Tours</Link>
          </div>
        )}
      </div>
    );
  };

  const renderPasswordTab = () => {
    return (
      <div className="dashboard-tab-content">
        <h2>Change Password</h2>
        
        <form className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Update Password
          </button>
        </form>
      </div>
    );
  };

  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">Manage your profile and bookings</p>
        </div>
      </div>

      <div className="container">
        <div className="dashboard-content">
          <div className="dashboard-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                <FaUser />
              </div>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>
            
            <ul className="dashboard-menu">
              <li>
                <button
                  className={`dashboard-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => handleTabChange('profile')}
                >
                  <FaUser />
                  <span>My Profile</span>
                </button>
              </li>
              <li>
                <button
                  className={`dashboard-menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => handleTabChange('bookings')}
                >
                  <FaCalendarAlt />
                  <span>My Bookings</span>
                </button>
              </li>
              <li>
                <button
                  className={`dashboard-menu-item ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => handleTabChange('password')}
                >
                  <FaEdit />
                  <span>Change Password</span>
                </button>
              </li>
              <li>
                <button
                  className="dashboard-menu-item logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
          
          <div className="dashboard-main">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'bookings' && renderBookingsTab()}
            {activeTab === 'password' && renderPasswordTab()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
