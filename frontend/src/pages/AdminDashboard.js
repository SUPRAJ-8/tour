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
  FaPlane,
  FaDollarSign,
  FaPassport,
  FaSearch,
  FaBell,
  FaQuestionCircle,
  FaInbox,
  FaPlus
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/common/ConfirmationModal';

import CountryManagement from '../components/admin/CountryManagement';
import TourManagement from '../components/admin/TourManagement';
import BookingManagement from '../components/admin/BookingManagement';
import UserManagement from '../components/admin/UserManagement';
import WorkingVisaManagement from '../components/admin/WorkingVisaManagement';
import { DashboardSkeleton } from '../components/admin/AdminSkeleton';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTours: 0,
    totalCountries: 0,
    totalBookings: 0,
    recentBookings: [],
    newUsersThisWeek: 0,
    newToursThisMonth: 0,
    newBookingsThisWeek: 0
  });

  useEffect(() => {
    fetchData();
  }, [navigate, user, activeTab]);

  const fetchData = async () => {
    // Only show loading if fetch takes longer than 200ms
    const timeoutId = setTimeout(() => setLoading(true), 200);
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
        case 'bookings':
          await fetchBookings();
          break;
        case 'users':
          await fetchUsers();
          break;
        case 'working-visa':
          // No data fetching needed for this tab yet
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(`Failed to load ${activeTab} data. Please try again.`);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch all necessary data in parallel for the dashboard
      const [users, tours, countries, bookings] = await Promise.all([
        fetchUsers(),
        fetchTours(),
        fetchCountries(),
        fetchBookings()
      ]);
      
      // Calculate statistics from the fetched data
      const totalUsers = Array.isArray(users) ? users.length : 0;
      const totalTours = Array.isArray(tours) ? tours.length : 0;
      const totalCountries = Array.isArray(countries) ? countries.length : 0;
      const totalBookings = Array.isArray(bookings) ? bookings.length : 0;

      // Real trend counts (based on each record's createdAt), replacing the
      // previously hardcoded "+12% vs last month" style placeholder badges.
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
      const createdAfter = (item, cutoff) => {
        const created = new Date(item.createdAt).getTime();
        return !isNaN(created) && created >= cutoff;
      };
      const newUsersThisWeek = Array.isArray(users)
        ? users.filter(u => createdAfter(u, sevenDaysAgo)).length
        : 0;
      const newToursThisMonth = Array.isArray(tours)
        ? tours.filter(t => createdAfter(t, thirtyDaysAgo)).length
        : 0;
      const newBookingsThisWeek = Array.isArray(bookings)
        ? bookings.filter(b => createdAfter(b, sevenDaysAgo)).length
        : 0;

      // Get recent bookings (latest 5)
      const recentBookings = Array.isArray(bookings) 
        ? bookings
            .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
            .slice(0, 5)
            .map(booking => ({
              _id: booking._id,
              customerName: booking.user?.name || booking.guestInfo?.name || booking.customerName || 'Unknown',
              phone: booking.user?.phone || booking.guestInfo?.phone || booking.phone || 'N/A',
              tourName: booking.tour?.title || booking.tourName || 'Unknown Tour',
              date: booking.date || booking.createdAt || new Date(),
              status: booking.status || 'Pending'
            }))
        : [];

      // Set the calculated stats
      setStats({
        totalUsers,
        totalTours,
        totalCountries,
        totalBookings,
        recentBookings,
        newUsersThisWeek,
        newToursThisMonth,
        newBookingsThisWeek
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard statistics');
    }
  };

  const fetchTours = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/tours`);
      const toursData = response.data?.data || response.data || [];
      return Array.isArray(toursData) ? toursData : [];
    } catch (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
  };

  const fetchCountries = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/countries`);
      const countriesData = response.data?.data || response.data || [];
      return Array.isArray(countriesData) ? countriesData : [];
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  };

  const fetchDestinations = async () => {
    try {
      // For development, simulate API call with mock data
      // In production, uncomment the API call
      // const response = await axios.get('/api/destinations');
      // return response.data;
      
      // Mock data for development
      return [];
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to fetch countries data');
      return [];
    }
  };

  const fetchBookings = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/bookings`);
      const bookingsData = response.data?.data || response.data || [];
      return Array.isArray(bookingsData) ? bookingsData : [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      // /api/users doesn't exist (404) — the real route is /api/admin/users,
      // and it's admin-only, so it needs the Bearer token (see
      // UserManagement.js for the same pattern). Without this, Total Users
      // silently always showed 0.
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = response.data?.data || response.data || [];
      return Array.isArray(usersData) ? usersData : [];
    } catch (error) {
      console.error('Error fetching users:', error);
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
      return <DashboardSkeleton />;
    }

    return (
      <div className="admin-tab-content admin-dashboard-overview">
        <h2>Dashboard Overview</h2>
        <p className="dashboard-subtitle">
          Welcome back, {user?.name ? user.name.split(' ')[0] : 'Admin'}. Here's a summary of your travel ecosystem today.
        </p>

        <div className="stats-grid">
          {/* Users Stats */}
          <div className="stat-card users">
            <div className="stat-card-top">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <span className={`stat-trend ${stats.newUsersThisWeek > 0 ? 'up' : 'neutral'}`}>
                +{stats.newUsersThisWeek} this week
              </span>
            </div>
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{stats.totalUsers.toLocaleString()}</p>
          </div>

          {/* Tours Stats */}
          <div className="stat-card tours">
            <div className="stat-card-top">
              <div className="stat-icon">
                <FaRoute />
              </div>
              <span className={`stat-trend ${stats.newToursThisMonth > 0 ? 'up' : 'neutral'}`}>
                +{stats.newToursThisMonth} this month
              </span>
            </div>
            <p className="stat-label">Active Tours</p>
            <p className="stat-value">{stats.totalTours.toLocaleString()}</p>
          </div>

          {/* Countries Stats */}
          <div className="stat-card countries">
            <div className="stat-card-top">
              <div className="stat-icon">
                <FaGlobeAsia />
              </div>
              <span className="stat-trend static">Static</span>
            </div>
            <p className="stat-label">Countries</p>
            <p className="stat-value">{stats.totalCountries.toLocaleString()}</p>
          </div>

          {/* Bookings Stats */}
          <div className="stat-card bookings">
            <div className="stat-card-top">
              <div className="stat-icon">
                <FaCalendarAlt />
              </div>
              <span className={`stat-trend ${stats.newBookingsThisWeek > 0 ? 'up' : 'neutral'}`}>
                +{stats.newBookingsThisWeek} this week
              </span>
            </div>
            <p className="stat-label">Total Bookings</p>
            <p className="stat-value">{stats.totalBookings.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="recent-section">
          <div className="recent-header">
            <div>
              <h3>Recent Bookings</h3>
              <p className="recent-subtitle">Activity from the last 24 hours</p>
            </div>
            <button className="btn btn-primary btn-compact" onClick={() => setActiveTab('bookings')}>
              <FaPlus /> New Booking
            </button>
          </div>
          <div className="table-responsive">
            <table className="admin-table recent-bookings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Contact Number</th>
                  <th>Tour Package</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings && stats.recentBookings.length > 0 ? (
                  stats.recentBookings.map((booking, index) => (
                    <tr key={booking._id}>
                      <td>{index + 1}</td>
                      <td>{booking.customerName}</td>
                      <td>{booking.phone}</td>
                      <td>{booking.tourName}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="empty-row">
                    <td colSpan="6">
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <FaInbox />
                        </div>
                        <h4>No Recent Activity</h4>
                        <p>
                          Your booking engine is currently idle. When travelers start booking
                          tours or visas, their details will appear here in real-time.
                        </p>
                        <div className="empty-state-actions">
                          <button className="btn btn-outline btn-compact" onClick={fetchDashboardStats}>
                            Refresh Data
                          </button>
                          <button
                            className="btn btn-primary btn-compact"
                            onClick={() => setActiveTab('bookings')}
                          >
                            View All Bookings
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="admin-dashboard-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src="/images/logo.png" alt="Logo" />
        </div>
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
              className={`admin-menu-item ${activeTab === 'working-visa' ? 'active' : ''}`}
              onClick={() => handleTabChange('working-visa')}
            >
              <FaPassport />
              <span>Working Visa</span>
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
          <li className="admin-menu-spacer"></li>
          <li>
            <button className="admin-menu-item logout" onClick={handleLogoutClick}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </aside>

      <div className="admin-content-wrapper">
        <header className="admin-topbar">
          <div className="admin-search">
            <FaSearch className="admin-search-icon" />
            <input type="text" placeholder="Search bookings, tours, or users..." />
          </div>
          <div className="admin-topbar-right">
            <button className="icon-btn" type="button" aria-label="Notifications">
              <FaBell />
            </button>
            <button className="icon-btn" type="button" aria-label="Help">
              <FaQuestionCircle />
            </button>
            <div className="admin-user-chip">
              <div className="admin-user-text">
                <span className="admin-user-name">{user?.name || 'Admin User'}</span>
                <span className="admin-user-role">Administrator</span>
              </div>
              <div className="admin-user-avatar">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="admin-main">
          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'tours' && <TourManagement />}
          {activeTab === 'countries' && <CountryManagement />}
          {activeTab === 'bookings' && <BookingManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'working-visa' && <WorkingVisaManagement />}
        </main>
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
