import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaEye, 
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaMoneyBillWave
} from 'react-icons/fa';
import './AdminComponents.css';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.patch(`/api/admin/bookings/${bookingId}/status`, { status: newStatus });
      fetchBookings();
      
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          status: newStatus
        });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };
  
  const handlePaymentStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.patch(`/api/admin/bookings/${bookingId}/payment`, { paymentStatus: newStatus });
      fetchBookings();
      
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          paymentStatus: newStatus
        });
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };
  
  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };
  
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedBooking(null);
  };
  
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || booking.status === filterStatus;
    const matchesPayment = filterPayment === '' || booking.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }
  
  return (
    <div className="admin-tab-content">
      <div className="admin-content-header">
        <h2>Booking Management</h2>
      </div>
      
      {showDetails ? (
        <div className="booking-details-container">
          <div className="details-header">
            <h3>Booking Details</h3>
            <button className="btn btn-outline" onClick={closeDetails}>
              Back to Bookings
            </button>
          </div>
          
          <div className="booking-details">
            <div className="booking-info-grid">
              <div className="booking-info-section">
                <h4>Booking Information</h4>
                <div className="info-item">
                  <span className="info-label">Booking ID:</span>
                  <span className="info-value">{selectedBooking._id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Booking Date:</span>
                  <span className="info-value">{formatDate(selectedBooking.createdAt)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Travel Date:</span>
                  <span className="info-value">{formatDate(selectedBooking.startDate)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Number of People:</span>
                  <span className="info-value">{selectedBooking.numberOfPeople}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Total Amount:</span>
                  <span className="info-value">${selectedBooking.totalAmount}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <div className="status-selector">
                    <select 
                      value={selectedBooking.status}
                      onChange={(e) => handleStatusChange(selectedBooking._id, e.target.value)}
                      className={`status-${selectedBooking.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-label">Payment Status:</span>
                  <div className="status-selector">
                    <select 
                      value={selectedBooking.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(selectedBooking._id, e.target.value)}
                      className={`status-${selectedBooking.paymentStatus}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="booking-info-section">
                <h4>Customer Information</h4>
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{selectedBooking.user.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{selectedBooking.user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{selectedBooking.phone || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Special Requests:</span>
                  <span className="info-value">{selectedBooking.specialRequests || 'None'}</span>
                </div>
              </div>
            </div>
            
            <div className="booking-tour-info">
              <h4>Tour Information</h4>
              <div className="tour-card">
                <div className="tour-image">
                  <img src={selectedBooking.tour.imageCover} alt={selectedBooking.tour.title} />
                </div>
                <div className="tour-details">
                  <h5>{selectedBooking.tour.title}</h5>
                  <p className="tour-destination">
                    {selectedBooking.tour.destination}, {selectedBooking.tour.country.name}
                  </p>
                  <div className="tour-meta">
                    <span>Duration: {selectedBooking.tour.duration} days</span>
                    <span>Price: ${selectedBooking.tour.price} per person</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-filters">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <div className="filter-box">
                <FaFilter />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="filter-box">
                <FaMoneyBillWave />
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                >
                  <option value="">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>
          
          {filteredBookings.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Tour</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>People</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking._id.substring(0, 8)}...</td>
                      <td>{booking.tour.title}</td>
                      <td>{booking.user.name}</td>
                      <td>{formatDate(booking.startDate)}</td>
                      <td>{booking.numberOfPeople}</td>
                      <td>${booking.totalAmount}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status === 'pending' && <FaExclamationCircle />}
                          {booking.status === 'confirmed' && <FaCheckCircle />}
                          {booking.status === 'completed' && <FaCalendarAlt />}
                          {booking.status === 'cancelled' && <FaTimesCircle />}
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${booking.paymentStatus}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-view" 
                            title="View Details"
                            onClick={() => viewBookingDetails(booking)}
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              <p>No bookings found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingManagement;
