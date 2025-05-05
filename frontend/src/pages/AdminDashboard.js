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
    // DEVELOPMENT MODE: Bypass authentication check
    // if (!user || user.role !== 'admin') {
    //   navigate('/admin');
    //   return;
    // }
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
      // Fetch all necessary data in parallel for the dashboard
      const [users, tours, countries, destinations, bookings] = await Promise.all([
        fetchUsers(),
        fetchTours(),
        fetchCountries(),
        fetchDestinations(),
        fetchBookings()
      ]);
      
      // Calculate statistics from the fetched data
      const totalUsers = Array.isArray(users) ? users.length : 0;
      const totalTours = Array.isArray(tours) ? tours.length : 0;
      const totalCountries = Array.isArray(countries) ? countries.length : 0;
      const totalDestinations = Array.isArray(destinations) ? destinations.length : 0;
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
        totalDestinations,
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
      // For development, simulate API call with mock data
      // In production, uncomment the API call
      // const response = await axios.get('/api/tours');
      // return Array.isArray(response.data) ? response.data : [];
      
      // Mock data for development
      return [
        { _id: 't1', title: 'Bangkok Explorer', country: 'Thailand', duration: { days: 5, nights: 4 }, price: 1299, rating: 4.8 },
        { _id: 't2', title: 'Phuket Adventure', country: 'Thailand', duration: { days: 7, nights: 6 }, price: 1599, rating: 4.6 },
        { _id: 't3', title: 'Chiang Mai Trek', country: 'Thailand', duration: { days: 4, nights: 3 }, price: 899, rating: 4.9 },
        { _id: 't4', title: 'Bali Paradise', country: 'Indonesia', duration: { days: 6, nights: 5 }, price: 1399, rating: 4.7 },
        { _id: 't5', title: 'Vietnam Heritage', country: 'Vietnam', duration: { days: 8, nights: 7 }, price: 1799, rating: 4.5 }
      ];
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast.error('Failed to fetch tours data');
      return [];
    }
  };

  const fetchCountries = async () => {
    try {
      // For development, simulate API call with mock data
      // In production, uncomment the API call
      // const response = await axios.get('/api/countries');
      // return response.data;
      
      // Mock data for development
      return [
        { _id: 'c1', name: 'Thailand', continent: 'Asia' },
        { _id: 'c2', name: 'Indonesia', continent: 'Asia' },
        { _id: 'c3', name: 'Vietnam', continent: 'Asia' },
        { _id: 'c4', name: 'Japan', continent: 'Asia' },
        { _id: 'c5', name: 'Nepal', continent: 'Asia' }
      ];
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to fetch countries data');
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
      return [
        { _id: 'd1', name: 'Bangkok', country: 'Thailand' },
        { _id: 'd2', name: 'Phuket', country: 'Thailand' },
        { _id: 'd3', name: 'Chiang Mai', country: 'Thailand' },
        { _id: 'd4', name: 'Bali', country: 'Indonesia' },
        { _id: 'd5', name: 'Hanoi', country: 'Vietnam' },
        { _id: 'd6', name: 'Tokyo', country: 'Japan' },
        { _id: 'd7', name: 'Kathmandu', country: 'Nepal' }
      ];
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Failed to fetch destinations data');
      return [];
    }
  };

  const fetchBookings = async () => {
    try {
      // For development, simulate API call with mock data
      // In production, uncomment the API call
      // const response = await axios.get('/api/bookings');
      // return response.data;
      
      // Generate random dates within the last 30 days
      const getRandomDate = () => {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30);
        now.setDate(now.getDate() - daysAgo);
        return now;
      };
      
      // Mock data for development with realistic booking data
      return [
        { _id: 'b1', user: { name: 'John Doe', email: 'john@example.com' }, tour: { _id: 't1', title: 'Bangkok Explorer' }, date: getRandomDate(), status: 'Confirmed', totalAmount: 1299, createdAt: getRandomDate() },
        { _id: 'b2', user: { name: 'Jane Smith', email: 'jane@example.com' }, tour: { _id: 't2', title: 'Phuket Adventure' }, date: getRandomDate(), status: 'Pending', totalAmount: 1599, createdAt: getRandomDate() },
        { _id: 'b3', user: { name: 'Mike Wilson', email: 'mike@example.com' }, tour: { _id: 't3', title: 'Chiang Mai Trek' }, date: getRandomDate(), status: 'Completed', totalAmount: 899, createdAt: getRandomDate() },
        { _id: 'b4', user: { name: 'Sarah Johnson', email: 'sarah@example.com' }, tour: { _id: 't1', title: 'Bangkok Explorer' }, date: getRandomDate(), status: 'Confirmed', totalAmount: 2598, createdAt: getRandomDate() },
        { _id: 'b5', user: { name: 'Robert Brown', email: 'robert@example.com' }, tour: { _id: 't4', title: 'Bali Paradise' }, date: getRandomDate(), status: 'Confirmed', totalAmount: 1399, createdAt: getRandomDate() },
        { _id: 'b6', user: { name: 'Emily Davis', email: 'emily@example.com' }, tour: { _id: 't2', title: 'Phuket Adventure' }, date: getRandomDate(), status: 'Cancelled', totalAmount: 1599, createdAt: getRandomDate() },
        { _id: 'b7', user: { name: 'Thomas Wilson', email: 'thomas@example.com' }, tour: { _id: 't5', title: 'Vietnam Heritage' }, date: getRandomDate(), status: 'Pending', totalAmount: 1799, createdAt: getRandomDate() },
        { _id: 'b8', user: { name: 'Jennifer Lee', email: 'jennifer@example.com' }, tour: { _id: 't3', title: 'Chiang Mai Trek' }, date: getRandomDate(), status: 'Confirmed', totalAmount: 899, createdAt: getRandomDate() },
        { _id: 'b9', user: { name: 'Michael Johnson', email: 'michael@example.com' }, tour: { _id: 't1', title: 'Bangkok Explorer' }, date: getRandomDate(), status: 'Completed', totalAmount: 1299, createdAt: getRandomDate() },
        { _id: 'b10', user: { name: 'Lisa Anderson', email: 'lisa@example.com' }, tour: { _id: 't4', title: 'Bali Paradise' }, date: getRandomDate(), status: 'Confirmed', totalAmount: 1399, createdAt: getRandomDate() }
      ];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings data');
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      // For development, simulate API call with mock data
      // In production, uncomment the API call
      // const response = await axios.get('/api/users');
      // return response.data;
      
      // Mock data for development
      return [
        { _id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'user' },
        { _id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { _id: 'u3', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
        { _id: 'u4', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user' },
        { _id: 'u5', name: 'Mike Wilson', email: 'mike@example.com', role: 'user' }
      ];
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
