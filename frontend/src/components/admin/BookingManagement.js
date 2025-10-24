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
  FaSync,
  FaPlus
} from 'react-icons/fa';
import './AdminComponents.css';
import BookingFormFields from './BookingFormFields';
import { useAuth } from '../../context/AuthContext';
import { TableSkeleton } from './AdminSkeleton';

const BookingManagement = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
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
    status: 'pending',
    specialRequests: ''
  });
  const [bookingFormErrors, setBookingFormErrors] = useState({});
  const [bookingFormAvailableDates, setBookingFormAvailableDates] = useState([]);
  const [bookingFormTourTitle, setBookingFormTourTitle] = useState('');
  const [deleteBookingId, setDeleteBookingId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    const timeoutId = setTimeout(() => setLoading(true), 200);
    try {
      const response = await axios.get('/bookings', { headers: { Authorization: `Bearer ${token}` } });
      console.log('Admin GET /bookings response:', response.data);
      const fetchedBookings = response.data.data || response.data;
      setBookings(fetchedBookings);
      clearTimeout(timeoutId);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const bookingToUpdate = bookings.find(b => b._id === bookingId);
      await axios.put(`/bookings/${bookingId}`, { 
        status: newStatus,
        paymentStatus: bookingToUpdate?.paymentStatus || 'pending'
      }, { headers: { Authorization: `Bearer ${token}` } });
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
      const bookingToUpdate = bookings.find(b => b._id === bookingId);
      await axios.put(`/bookings/${bookingId}`, { 
        status: bookingToUpdate?.status || 'pending',
        paymentStatus: newStatus
      }, { headers: { Authorization: `Bearer ${token}` } });
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
      status: 'pending',
      specialRequests: ''
    });
    setBookingFormErrors({});
    setBookingFormAvailableDates([]); // You can fetch available dates if needed
    setBookingFormTourTitle('');
    setShowBookingModal(true);
  };
  
  const openEditBookingModal = (booking) => {
    setSelectedBooking(booking);
    setBookingModalMode('edit');
    setBookingFormData({
      name: booking.user?.name || booking.guestInfo?.name || '',
      email: booking.user?.email || booking.guestInfo?.email || '',
      phone: booking.user?.phone || booking.guestInfo?.phone || '',
      numberOfPeople: booking.numberOfPeople || 1,
      startDate: booking.startDate ? new Date(booking.startDate) : new Date(),
      status: booking.status || 'pending',
      specialRequests: booking.specialRequests || ''
    });
    setBookingFormErrors({});
    setBookingFormAvailableDates([]); // You can fetch available dates if needed
    setBookingFormTourTitle(booking.tour?.title || '');
    setShowBookingModal(true);
  };
  
  const closeBookingModal = () => {
    setSelectedBooking(null);
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
    console.log('Submitting booking update:', selectedBooking?._id, bookingFormData);
    try {
      if (bookingModalMode === 'add') {
        await axios.post('/bookings', bookingFormData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Booking added successfully!');
      } else {
        console.log('PUT /bookings/', selectedBooking._id, bookingFormData);
        await axios.put(`/bookings/${selectedBooking._id}`, bookingFormData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Booking updated successfully!');
      }
      closeBookingModal();
      fetchBookings();
    } catch (error) {
      toast.error('Failed to save booking.');
    }
  };
  
  const handleDeleteBooking = (bookingId) => {
    setDeleteBookingId(bookingId);
  };
  
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/bookings/${deleteBookingId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Booking deleted successfully!');
      fetchBookings();
      setDeleteBookingId(null);
    } catch (error) {
      console.error('Delete booking error status:', error.response?.status);
      console.error('Delete booking error:', error);
      if (error.response) console.error('Response data:', error.response.data);
      toast.error('Failed to delete booking.');
    }
  };
  
  const handleCancelDelete = () => setDeleteBookingId(null);
  
  const handleAddBooking = openAddBookingModal;
  const handleEditBooking = openEditBookingModal;
  
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };
  
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedBooking(null);
  };

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

  useEffect(() => {
    console.log('Admin bookings state:', bookings);
    console.log('Admin filteredBookings:', filteredBookings);
  }, [bookings, filteredBookings]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return <TableSkeleton />;
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
      
      <div className="admin-actions">
        <button className="btn btn-success add-booking-btn" onClick={handleAddBooking}>
          <FaPlus /> Add Booking
        </button>
      </div>
      
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
                  <td>{booking._id}</td>
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
                        onClick={() => handleViewBooking(booking)}
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
      {showDetailsModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content details-modal">
            <h3>Booking Details</h3>
            <div><strong>Booking ID:</strong> {selectedBooking._id}</div>
            <div><strong>Tour:</strong> {selectedBooking.tour?.title || 'Deleted Tour'}</div>
            <div><strong>Date:</strong> {new Date(selectedBooking.startDate).toLocaleDateString()}</div>
            <div><strong>People:</strong> {selectedBooking.numberOfPeople}</div>
            <div><strong>Status:</strong> {selectedBooking.status}</div>
            <div><strong>Name:</strong> {selectedBooking.user?.name || selectedBooking.guestInfo?.name || ''}</div>
            <div><strong>Email:</strong> {selectedBooking.user?.email || selectedBooking.guestInfo?.email || ''}</div>
            <div><strong>Phone:</strong> {selectedBooking.user?.phone || selectedBooking.guestInfo?.phone || ''}</div>
            <div><strong>Requests:</strong> {selectedBooking.specialRequests || 'None'}</div>
            <button className="btn btn-secondary" onClick={handleCloseDetails}>Close</button>
          </div>
        </div>
      )}
      {deleteBookingId && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal">
            <div className="confirmation-icon">
              <FaTrash size={24} color="#e74c3c" />
            </div>
            <h3>Delete</h3>
            <p>Are you sure you want to delete this booking?</p>
            <div className="confirmation-buttons">
              <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
