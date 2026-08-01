import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaUser, FaEnvelope, FaPhone, FaUsers, FaCalendarAlt, FaComments, FaFlag, FaExclamationCircle } from 'react-icons/fa';
import './BookingFormFields.css';

const nationalities = [
  'Nepal', 'India', 'USA', 'UK', 'China', 'Japan', 'Australia', 'France', 'Germany', 'Other'
];

const BookingFormFields = ({
  bookingData,
  formErrors,
  availableDates,
  onChange,
  onDateChange,
  onSubmit,
  onClose,
  mode = 'add',
  tourTitle = '',
}) => {
  return (
    <div className="booking-form-shell">
      <div className="booking-form-header">
        <h2 className="form-title">{mode === 'edit' ? `Edit Booking for ${tourTitle}` : `Book for ${tourTitle}`}</h2>
        {onClose && (
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        )}
      </div>
      <form onSubmit={onSubmit} className="booking-form-body">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            <FaUser className="label-icon" /> Full Name
          </label>
          <input
            type="text"
            name="name"
            value={bookingData.name}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your Full Name"
          />
          {formErrors.name && <div className="error-message">{formErrors.name}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">
            <FaEnvelope className="label-icon" /> Email Address
          </label>
          <input
            type="email"
            name="email"
            value={bookingData.email}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your Email Address"
          />
          {formErrors.email && <div className="error-message">{formErrors.email}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">
            <FaPhone className="label-icon" /> Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={bookingData.phone}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your Phone Number"
          />
          {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">
            <FaUsers className="label-icon" /> Total No. of Travellers
          </label>
          <input
            type="number"
            name="numberOfPeople"
            value={bookingData.numberOfPeople}
            onChange={onChange}
            className="form-control"
            placeholder="Enter the no. of Travellers"
            min={1}
            max={100}
          />
          {formErrors.numberOfPeople && <div className="error-message">{formErrors.numberOfPeople}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">
            <FaCalendarAlt className="label-icon" /> Tour Start Date
          </label>
          <DatePicker
            selected={bookingData.startDate}
            onChange={onDateChange}
            minDate={new Date()}
            className="form-control"
            placeholderText="Select the Start Date of Tour"
            dateFormat="MM/dd/yyyy"
            includeDates={availableDates}
          />
          {formErrors.startDate && <div className="error-message">{formErrors.startDate}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">
            <FaFlag className="label-icon" /> Nationality
          </label>
          <select
            name="nationality"
            value={bookingData.nationality || 'Nepal'}
            onChange={onChange}
            className="form-control"
          >
            {nationalities.map(nat => (
              <option key={nat} value={nat}>{nat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">
            <FaExclamationCircle className="label-icon" /> Status
          </label>
          <select
            name="status"
            value={bookingData.status}
            onChange={onChange}
            className="form-control"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">
            <FaComments className="label-icon" /> Special Requests
          </label>
          <textarea
            name="specialRequests"
            value={bookingData.specialRequests}
            onChange={onChange}
            className="form-control"
            placeholder="Any special requests"
            rows={3}
          />
        </div>
      </div>
      <div className="form-actions">
        {onClose && (
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {mode === 'edit' ? 'Update Booking' : 'Add Booking'}
        </button>
      </div>
      </form>
    </div>
  );
};

export default BookingFormFields;