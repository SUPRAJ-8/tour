import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaEye, 
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaMoneyBillWave,
  FaEdit,
  FaTrash,
  FaSync
} from 'react-icons/fa';
import './AdminComponents.css';
import BookingFormFields from './BookingFormFields';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingModalMode, setBookingModalMode] = useState('add'); // 'add' or 'edit'
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfPeople: 1,
    startDate: new Date(),
    specialRequests: ''
  });
  const [bookingFormErrors, setBookingFormErrors] = useState({});
  const [bookingFormAvailableDates, setBookingFormAvailableDates] = useState([]);
  const [bookingFormTourTitle, setBookingFormTourTitle] = useState('');
  
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
      toast.success(`Booking status updated to ${newStatus}!`);
      fetchBookings();
      
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          status: newStatus
        });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status. Please try again.');
    }
  };
  
  const handlePaymentStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.patch(`/api/admin/bookings/${bookingId}/payment`, { paymentStatus: newStatus });
      toast.success(`Payment status updated to ${newStatus}!`);
      fetchBookings();
      
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          paymentStatus: newStatus
        });
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status. Please try again.');
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
  
  const openAddBookingModal = () => {
    setBookingModalMode('add');
    setBookingFormData({
      name: '',
      email: '',
      phone: '',
      numberOfPeople: 1,
      startDate: new Date(),
      specialRequests: ''
    });
    setBookingFormErrors({});
    setBookingFormAvailableDates([]); // You can fetch available dates if needed
    setBookingFormTourTitle('');
    setShowBookingModal(true);
  };
  
  const openEditBookingModal = (booking) => {
    setBookingModalMode('edit');
    setBookingFormData({
      name: booking.user?.name || booking.name || '',
      email: booking.user?.email || booking.email || '',
      phone: booking.phone || '',
      numberOfPeople: booking.numberOfPeople || 1,
      startDate: booking.startDate ? new Date(booking.startDate) : new Date(),
      specialRequests: booking.specialRequests || ''
    });
    setBookingFormErrors({});
    setBookingFormAvailableDates([]); // You can fetch available dates if needed
    setBookingFormTourTitle(booking.tour?.title || '');
    setShowBookingModal(true);
  };
  
  const closeBookingModal = () => {
    setShowBookingModal(false);
  };
  
  const handleBookingFormChange = (e) => {
    setBookingFormData({
      ...bookingFormData,
      [e.target.name]: e.target.value
    });
    if (bookingFormErrors[e.target.name]) {
      setBookingFormErrors({ ...bookingFormErrors, [e.target.name]: '' });
    }
  };
  
  const handleBookingFormDateChange = (date) => {
    setBookingFormData({
      ...bookingFormData,
      startDate: date
    });
    if (bookingFormErrors.startDate) {
      setBookingFormErrors({ ...bookingFormErrors, startDate: '' });
    }
  };
  
  const validateBookingForm = () => {
    const errors = {};
    if (!bookingFormData.name.trim()) errors.name = 'Name is required';
    if (!bookingFormData.email.trim()) errors.email = 'Email is required';
    if (!bookingFormData.phone.trim()) errors.phone = 'Phone number is required';
    if (!bookingFormData.startDate) errors.startDate = 'Start date is required';
    if (!bookingFormData.numberOfPeople || bookingFormData.numberOfPeople < 1) errors.numberOfPeople = 'Number of people must be at least 1';
    setBookingFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleBookingFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateBookingForm()) return;
    try {
      if (bookingModalMode === 'add') {
        await axios.post('/api/admin/bookings', bookingFormData);
        toast.success('Booking added successfully!');
      } else {
        await axios.put(`/api/admin/bookings/${selectedBooking._id}`, bookingFormData);
        toast.success('Booking updated successfully!');
      }
      closeBookingModal();
      fetchBookings();
    } catch (error) {
      toast.error('Failed to save booking.');
    }
  };
  
  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      toast.info('Delete booking feature coming soon!');
    }
  };
  
  const handleAddBooking = openAddBookingModal;
  const handleEditBooking = openEditBookingModal;
  
  const filteredBookings = bookings.filter(booking => {
    // Handle cases where tour might be deleted
    const tourTitle = booking.tour?.title || 'Deleted Tour';
    const userName = booking.user?.name || 'Unknown User';
    const userEmail = booking.user?.email || 'unknown@email.com';

    const matchesSearch = 
      tourTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
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
      <div className="admin-content-header" style={{ display: 'flex', alignItems: 'center' }}>
        <h2>Booking Management</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
          <button className="btn btn-secondary" title="Refresh Bookings" onClick={fetchBookings}>
            <FaSync />
          </button>
          <button className="btn btn-primary" onClick={handleAddBooking}>
            Add New Booking
          </button>
        </div>
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
              </div>
              
              <div className="booking-info-section">
                <h4>Customer Information</h4>
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{selectedBooking.user?.name || selectedBooking.guestInfo?.name || 'Unknown User'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{selectedBooking.user?.email || selectedBooking.guestInfo?.email || 'unknown@email.com'}</span>
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
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking._id.substring(0, 8)}...</td>
                      <td>{booking.tour?.title || 'Deleted Tour'}</td>
                      <td>{booking.user?.name || booking.guestInfo?.name || 'Unknown User'}</td>
                      <td>{formatDate(booking.startDate)}</td>
                      <td>{booking.numberOfPeople}</td>
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
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-view" 
                            title="View Details"
                            onClick={() => viewBookingDetails(booking)}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn-action btn-edit"
                            title="Edit Booking"
                            onClick={() => handleEditBooking(booking)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-action btn-delete"
                            title="Delete Booking"
                            onClick={() => handleDeleteBooking(booking._id)}
                          >
                            <FaTrash />
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
      {showBookingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <BookingFormFields
              bookingData={bookingFormData}
              formErrors={bookingFormErrors}
              availableDates={bookingFormAvailableDates}
              onChange={handleBookingFormChange}
              onDateChange={handleBookingFormDateChange}
              onSubmit={handleBookingFormSubmit}
              onClose={closeBookingModal}
              mode={bookingModalMode}
              tourTitle={bookingFormTourTitle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
