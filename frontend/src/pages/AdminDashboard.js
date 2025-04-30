import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaGlobeAsia, 
  FaRoute, 
  FaCalendarAlt, 
  FaChartLine, 
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaPlane,
  FaStar,
  FaDollarSign
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/common/ConfirmationModal';

import CountryManagement from '../components/admin/CountryManagement';
import TourManagement from '../components/admin/TourManagement';
import DestinationManagement from '../components/admin/DestinationManagement';
import BookingManagement from '../components/admin/BookingManagement';
import UserManagement from '../components/admin/UserManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTours: 0,
    totalCountries: 0,
    totalDestinations: 0,
    totalBookings: 0,
    recentBookings: [],
    topTours: [],
    revenue: {
      total: 0,
      monthly: 0,
      yearly: 0
    }
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [navigate, user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch(activeTab) {
        case 'dashboard':
          await fetchDashboardStats();
          break;
        case 'tours':
          await fetchTours();
          break;
        case 'countries':
          await fetchCountries();
          break;
        case 'destinations':
          await fetchDestinations();
          break;
        case 'bookings':
          await fetchBookings();
          break;
        case 'users':
          await fetchUsers();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(`Failed to load ${activeTab} data. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard statistics');
    }
  };

  const fetchTours = async () => {
    try {
      const response = await axios.get('/api/tours');
      return response.data;
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast.error('Failed to fetch tours data');
      return [];
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get('/api/countries');
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to fetch countries data');
      return [];
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('/api/destinations');
      return response.data;
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Failed to fetch destinations data');
      return [];
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings data');
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users data');
      return [];
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/admin');
  };

  const renderDashboardTab = () => {
    if (loading) {
      return <div className="loading">Loading statistics...</div>;
    }

    return (
      <div className="admin-tab-content">
        <h2>Dashboard Overview</h2>
        
        <div className="stats-grid">
          {/* Revenue Stats */}
          <div className="stat-card revenue">
            <div className="stat-icon">
              <FaDollarSign />
            </div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p className="stat-value">${stats.revenue.total.toLocaleString()}</p>
              <div className="stat-details">
                <span>Monthly: ${stats.revenue.monthly.toLocaleString()}</span>
                <span>Yearly: ${stats.revenue.yearly.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Users Stats */}
          <div className="stat-card users">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>

          {/* Tours Stats */}
          <div className="stat-card tours">
            <div className="stat-icon">
              <FaRoute />
            </div>
            <div className="stat-info">
              <h3>Active Tours</h3>
              <p className="stat-value">{stats.totalTours.toLocaleString()}</p>
            </div>
          </div>

          {/* Countries Stats */}
          <div className="stat-card countries">
            <div className="stat-icon">
              <FaGlobeAsia />
            </div>
            <div className="stat-info">
              <h3>Countries</h3>
              <p className="stat-value">{stats.totalCountries.toLocaleString()}</p>
            </div>
          </div>

          {/* Bookings Stats */}
          <div className="stat-card bookings">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-info">
              <h3>Total Bookings</h3>
              <p className="stat-value">{stats.totalBookings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="recent-section">
          <h3>Recent Bookings</h3>
          <div className="table-responsive">
            {stats.recentBookings && stats.recentBookings.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Tour</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map(booking => (
                    <tr key={booking._id}>
                      <td>#{booking._id.slice(-6)}</td>
                      <td>{booking.customerName}</td>
                      <td>{booking.tourName}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>${booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No recent bookings available.</p>
            )}
          </div>
        </div>

        {/* Popular Tours Section */}
        <div className="recent-section">
          <h3>Popular Tours</h3>
          <div className="table-responsive">
            {stats.topTours && stats.topTours.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tour</th>
                    <th>Bookings</th>
                    <th>Rating</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topTours.map(tour => (
                    <tr key={tour._id}>
                      <td>{tour.title}</td>
                      <td>{tour.bookingsCount}</td>
                      <td>
                        <div className="rating">
                          <FaStar className="star" />
                          <span>{tour.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td>${tour.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No tour data available.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <div className="container">
          <h1 className="admin-dashboard-title">Admin Dashboard</h1>
          <div className="admin-user-info">
            <span>Welcome, {user?.name}</span>
            <span className="admin-role">Administrator</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="admin-dashboard-content">
          <div className="admin-sidebar">
            <ul className="admin-menu">
              <li>
                <button
                  className={`admin-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => handleTabChange('dashboard')}
                >
                  <FaChartLine />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  className={`admin-menu-item ${activeTab === 'tours' ? 'active' : ''}`}
                  onClick={() => handleTabChange('tours')}
                >
                  <FaRoute />
                  <span>Tours</span>
                </button>
              </li>
              <li>
                <button
                  className={`admin-menu-item ${activeTab === 'countries' ? 'active' : ''}`}
                  onClick={() => handleTabChange('countries')}
                >
                  <FaGlobeAsia />
                  <span>Countries</span>
                </button>
              </li>
              <li>
                <button
                  className={`admin-menu-item ${activeTab === 'destinations' ? 'active' : ''}`}
                  onClick={() => handleTabChange('destinations')}
                >
                  <FaMapMarkerAlt />
                  <span>Destinations</span>
                </button>
              </li>
              <li>
                <button
                  className={`admin-menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => handleTabChange('bookings')}
                >
                  <FaCalendarAlt />
                  <span>Bookings</span>
                </button>
              </li>
              <li>
                <button
                  className={`admin-menu-item ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => handleTabChange('users')}
                >
                  <FaUsers />
                  <span>Users</span>
                </button>
              </li>
              <li>
                <button
                  className="admin-menu-item logout"
                  onClick={handleLogoutClick}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
          
          <div className="admin-main">
            {activeTab === 'dashboard' && renderDashboardTab()}
            {activeTab === 'tours' && <TourManagement />}
            {activeTab === 'countries' && <CountryManagement />}
            {activeTab === 'destinations' && <DestinationManagement />}
            {activeTab === 'bookings' && <BookingManagement />}
            {activeTab === 'users' && <UserManagement />}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Logout */}
      <ConfirmationModal
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out? Any unsaved changes will be lost."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        type="warning"
      />
    </section>
  );
};

export default AdminDashboard;
