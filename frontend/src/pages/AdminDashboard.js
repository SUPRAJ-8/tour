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
  FaStar,
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
  const { user, logout } = useAuth();
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
    topTours: []
  });

  const [newBookingForm, setNewBookingForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    tourId: '',
    tourName: '',
    date: '',
    numberOfPeople: 1,
    specialRequests: ''
  });
  
  const [availableTours, setAvailableTours] = useState([]);

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
      const [users, tours, countries, destinations, bookings] = await Promise.all([
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
      
      // Get recent bookings (latest 5)
      const recentBookings = Array.isArray(bookings) 
        ? bookings
            .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
            .slice(0, 5)
            .map(booking => ({
              _id: booking._id,
              customerName: booking.user?.name || booking.customerName || 'Unknown',
              tourName: booking.tour?.title || booking.tourName || 'Unknown Tour',
              date: booking.date || booking.createdAt || new Date(),
              status: booking.status || 'Pending',
              amount: booking.totalAmount || booking.amount || 0
            }))
        : [];
      
      // Calculate top tours based on bookings
      const tourBookingCount = {};
      const tourRatings = {};
      const tourRevenue = {};
      
      if (Array.isArray(bookings)) {
        bookings.forEach(booking => {
          const tourId = booking.tour?._id || booking.tourId;
          const tourName = booking.tour?.title || booking.tourName;
          const amount = booking.totalAmount || booking.amount || 0;
          
          if (tourId && tourName) {
            // Count bookings per tour
            tourBookingCount[tourId] = (tourBookingCount[tourId] || 0) + 1;
            
            // Sum revenue per tour
            tourRevenue[tourId] = (tourRevenue[tourId] || 0) + amount;
            
            // Store tour name for later use
            if (!tourRatings[tourId]) {
              tourRatings[tourId] = {
                title: tourName,
                totalRating: 0,
                count: 0
              };
            }
          }
        });
      }
      
      // Add ratings data if available in tours
      if (Array.isArray(tours)) {
        tours.forEach(tour => {
          if (tour._id && tour.rating) {
            if (!tourRatings[tour._id]) {
              tourRatings[tour._id] = {
                title: tour.title,
                totalRating: tour.rating,
                count: 1
              };
            } else {
              tourRatings[tour._id].totalRating += tour.rating;
              tourRatings[tour._id].count += 1;
            }
          }
        });
      }
      
      // Create top tours array
      const topTours = Object.keys(tourBookingCount)
        .map(tourId => ({
          _id: tourId,
          title: tourRatings[tourId]?.title || 'Unknown Tour',
          bookingsCount: tourBookingCount[tourId] || 0,
          rating: tourRatings[tourId] ? (tourRatings[tourId].totalRating / tourRatings[tourId].count) : 0,
          revenue: tourRevenue[tourId] || 0
        }))
        .sort((a, b) => b.bookingsCount - a.bookingsCount)
        .slice(0, 5);
      
      // Set the calculated stats
      setStats({
        totalUsers,
        totalTours,
        totalCountries,
        totalBookings,
        recentBookings,
        topTours
      });
      
      // Set available tours for the new booking form
      setAvailableTours(Array.isArray(tours) ? tours : []);
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
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/users`);
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
      <div className="admin-tab-content">
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
              <span className="stat-trend neutral">+0% this week</span>
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
              <span className="stat-trend up">+12% vs last month</span>
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
              <span className="stat-trend live">Real-time sync</span>
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
                  <th>Customer</th>
                  <th>Tour Package</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings && stats.recentBookings.length > 0 ? (
                  stats.recentBookings.map(booking => (
                    <tr key={booking._id}>
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
                  ))
                ) : (
                  <tr className="empty-row">
                    <td colSpan="5">
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

        {/* New Booking Section */}
        <div className="recent-section">
          <h3>Create New Booking</h3>
          <div className="new-booking-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerName">Customer Name</label>
                <input
                  type="text"
                  id="customerName"
                  value={newBookingForm.customerName}
                  onChange={(e) => setNewBookingForm({...newBookingForm, customerName: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={newBookingForm.email}
                  onChange={(e) => setNewBookingForm({...newBookingForm, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  value={newBookingForm.phone}
                  onChange={(e) => setNewBookingForm({...newBookingForm, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="tourSelect">Select Tour</label>
                <select
                  id="tourSelect"
                  value={newBookingForm.tourId}
                  onChange={(e) => {
                    const selectedTour = availableTours.find(tour => tour._id === e.target.value);
                    setNewBookingForm({
                      ...newBookingForm, 
                      tourId: e.target.value,
                      tourName: selectedTour ? selectedTour.title : ''
                    });
                  }}
                >
                  <option value="">-- Select a Tour --</option>
                  {Array.isArray(availableTours) && availableTours.length > 0 ? (
                    availableTours.map(tour => (
                      <option key={tour._id} value={tour._id}>{tour.title}</option>
                    ))
                  ) : (
                    <option value="">No tours available</option>
                  )}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Travel Date</label>
                <input
                  type="date"
                  id="date"
                  value={newBookingForm.date}
                  onChange={(e) => setNewBookingForm({...newBookingForm, date: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="numberOfPeople">Number of People</label>
                <input
                  type="number"
                  id="numberOfPeople"
                  min="1"
                  value={newBookingForm.numberOfPeople}
                  onChange={(e) => setNewBookingForm({...newBookingForm, numberOfPeople: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests</label>
              <textarea
                id="specialRequests"
                value={newBookingForm.specialRequests}
                onChange={(e) => setNewBookingForm({...newBookingForm, specialRequests: e.target.value})}
                placeholder="Any special requests or requirements"
                rows="3"
              ></textarea>
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  // In a real application, we would submit the form to the API
                  // For now, just show a success message
                  if (!newBookingForm.customerName || !newBookingForm.email || !newBookingForm.tourId || !newBookingForm.date) {
                    toast.error('Please fill in all required fields');
                    return;
                  }
                  
                  toast.success('New booking created successfully!');
                  // Reset the form
                  setNewBookingForm({
                    customerName: '',
                    email: '',
                    phone: '',
                    tourId: '',
                    tourName: '',
                    date: '',
                    numberOfPeople: 1,
                    specialRequests: ''
                  });
                  
                  // In a real application, we would refresh the bookings list
                  // fetchDashboardStats();
                }}
              >
                Create Booking
              </button>
            </div>
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
