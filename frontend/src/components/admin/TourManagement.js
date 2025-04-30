import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmationModal from '../common/ConfirmationModal';

const TourManagement = () => {
  const [tours, setTours] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/tours?page=${page}&limit=${pagination.limit}`);
      // Extract tours from the nested data property
      const toursData = response.data.data || [];
      setTours(Array.isArray(toursData) ? toursData : []);
      
      // Update pagination if available
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      setError('Failed to fetch tours. Please try again later.');
      setTours([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (tour) => {
    setTourToDelete(tour);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tours/${id}`);
      toast.success('Tour deleted successfully!');
      fetchTours(); // Refresh the list
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Failed to delete tour. Please try again.');
      setError('Failed to delete tour. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading tours...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="tour-management">
      <div className="header-actions">
        <h2>Tour Management</h2>
        <button className="btn-primary">Add New Tour</button>
      </div>

      {tours.length === 0 ? (
        <p>No tours found. Add some tours to get started.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour._id}>
                    <td>{tour.title}</td>
                    <td>{tour.duration} days</td>
                    <td>${tour.price}</td>
                    <td>{tour.destination?.name || 'N/A'}</td>
                    <td>
                      <span className={`status ${tour.status?.toLowerCase() || 'pending'}`}>
                        {tour.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" title="View">
                          <FaEye />
                        </button>
                        <button className="btn-icon" title="Edit">
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          title="Delete"
                          onClick={() => handleDeleteClick(tour)}
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
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                disabled={pagination.page === 1}
                onClick={() => fetchTours(pagination.page - 1)}
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.totalPages}</span>
              <button 
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchTours(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={() => {
          if (tourToDelete) {
            handleDelete(tourToDelete._id);
            setShowDeleteConfirmation(false);
            setTourToDelete(null);
          }
        }}
        title="Confirm Delete"
        message={`Are you sure you want to delete the tour "${tourToDelete?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default TourManagement;
