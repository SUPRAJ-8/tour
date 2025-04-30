import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye, FaSearch, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmationModal from '../common/ConfirmationModal';
import { useData } from '../../context/DataContext';
import './TourManagement.css';

const TourManagement = () => {
  const { addTour, updateTour, deleteTour, refreshData, countries } = useData();
  const [tours, setTours] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    country: '',
    description: '',
    coverImage: '',
    heroImages: ['', '', '', '', ''],
    days: 1,
    nights: 0,
    highlights: [''],
    includes: [''],
    excludes: [''],
    visaRequirements: '',
    bestTimeToVisit: '',
    travelTips: [''],
    price: 0,
    discountPrice: 0,
    difficulty: 'easy',
    status: 'active',
    featured: false
  });
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  useEffect(() => {
    fetchTours();
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('/api/destinations');
      // Ensure destinations is always an array
      const destinationsData = response.data || [];
      setDestinations(Array.isArray(destinationsData) ? destinationsData : []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Failed to load destinations');
      setDestinations([]); // Set to empty array on error
    }
  };

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTours = tours.filter(tour => 
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tour.country?.name && tour.country.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCountries = Array.isArray(countries) 
    ? countries.filter(country => 
        country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
      )
    : [];

  const handleCountrySearch = (e) => {
    setCountrySearchTerm(e.target.value);
    setShowCountryDropdown(true);
  };
  
  const handleCountrySelect = (countryName) => {
    setFormData({
      ...formData,
      country: countryName
    });
    setCountrySearchTerm(countryName);
    setShowCountryDropdown(false);
  };

  const handleDeleteClick = (tour) => {
    setTourToDelete(tour);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTour(id);
      toast.success('Tour deleted successfully!');
      fetchTours(); // Refresh the list
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Failed to delete tour. Please try again.');
      setError('Failed to delete tour. Please try again.');
    }
  };

  const handleAddNewClick = () => {
    setCurrentTour(null);
    setFormData({
      title: '',
      country: '',
      description: '',
      coverImage: '',
      heroImages: ['', '', '', '', ''],
      days: 1,
      nights: 0,
      highlights: [''],
      includes: [''],
      excludes: [''],
      visaRequirements: '',
      bestTimeToVisit: '',
      travelTips: [''],
      price: 0,
      discountPrice: 0,
      difficulty: 'easy',
      status: 'active',
      featured: false
    });
    setShowModal(true);
  };

  const handleEditClick = (tour) => {
    setCurrentTour(tour);
    // Map tour data to form fields
    setFormData({
      title: tour.title || '',
      country: tour.country || '',
      description: tour.description || '',
      coverImage: tour.coverImage || '',
      heroImages: tour.heroImages?.length ? tour.heroImages : ['', '', '', '', ''],
      days: tour.days || 1,
      nights: tour.nights || 0,
      highlights: tour.highlights?.length ? tour.highlights : [''],
      includes: tour.includes?.length ? tour.includes : [''],
      excludes: tour.excludes?.length ? tour.excludes : [''],
      visaRequirements: tour.visaRequirements || '',
      bestTimeToVisit: tour.bestTimeToVisit || '',
      travelTips: tour.travelTips?.length ? tour.travelTips : [''],
      price: tour.price || 0,
      discountPrice: tour.discountPrice || 0,
      difficulty: tour.difficulty || 'easy',
      status: tour.status || 'active',
      featured: tour.featured || false
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleArrayInputChange = (index, field, value, subfield = null) => {
    const updatedArray = [...formData[field]];
    
    if (subfield) {
      // Handle nested objects like itinerary
      updatedArray[index] = {
        ...updatedArray[index],
        [subfield]: value
      };
    } else {
      // Handle simple arrays like images
      updatedArray[index] = value;
    }
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  const handleAddArrayItem = (field, defaultValue = '') => {
    const updatedArray = [...formData[field]];
    
    if (field === 'itinerary') {
      const nextDay = updatedArray.length + 1;
      updatedArray.push({ day: nextDay, description: '', activities: [''] });
    } else {
      updatedArray.push(defaultValue);
    }
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  const handleRemoveArrayItem = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    
    // If removing an itinerary day, update the day numbers
    if (field === 'itinerary') {
      updatedArray.forEach((item, idx) => {
        item.day = idx + 1;
      });
    }
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  const handleAddActivity = (itineraryIndex) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[itineraryIndex].activities.push('');
    
    setFormData({
      ...formData,
      itinerary: updatedItinerary
    });
  };

  const handleRemoveActivity = (itineraryIndex, activityIndex) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[itineraryIndex].activities.splice(activityIndex, 1);
    
    setFormData({
      ...formData,
      itinerary: updatedItinerary
    });
  };

  const handleActivityChange = (itineraryIndex, activityIndex, value) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[itineraryIndex].activities[activityIndex] = value;
    
    setFormData({
      ...formData,
      itinerary: updatedItinerary
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare form data for submission
      const tourData = {
        ...formData,
        // Map the fields to match the backend Tour model structure
        destination: formData.country, // Using country as destination
        duration: formData.days,
        coverImage: formData.coverImage,
        images: formData.heroImages.filter(img => img.trim() !== ''),
        includes: formData.includes.filter(item => item.trim() !== ''),
        excludes: formData.excludes.filter(item => item.trim() !== ''),
        highlights: formData.highlights.filter(item => item.trim() !== ''),
        travelTips: formData.travelTips.filter(tip => tip.trim() !== ''),
        // Add createdBy if it's a new tour - assuming we have a user ID from auth context
        createdBy: currentTour ? undefined : '64f9c39c1d67b5d1f9fcb1a3' // Replace with actual user ID from auth context
      };
      
      let result;
      if (currentTour) {
        // Update existing tour
        result = await updateTour(currentTour._id, tourData);
        toast.success(`${tourData.title} has been updated successfully!`);
      } else {
        // Add new tour
        result = await addTour(tourData);
        toast.success(`${tourData.title} has been added successfully!`);
      }
      
      // Close modal and refresh data
      setShowModal(false);
      
      // Refresh both the local tour list and the global data context
      fetchTours();
      
      // Force a refresh of the DataContext to update the main website
      if (typeof refreshData === 'function') {
        refreshData();
      }
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error(`Failed to save tour: ${error.response?.data?.message || 'An unknown error occurred'}`);
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
        <button className="btn-primary" onClick={handleAddNewClick}>
          <FaPlus /> Add New Tour
        </button>
      </div>

      <div className="search-filter-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tours by title or destination..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {filteredTours.length === 0 ? (
        <p>No tours found. {searchTerm ? 'Try a different search term or ' : ''}Add some tours to get started.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTours.map((tour) => (
                  <tr key={tour._id}>
                    <td>{tour.title}</td>
                    <td>{tour.days} days / {tour.nights} nights</td>
                    <td>${tour.price}</td>
                    <td>{tour.country?.name || 'N/A'}</td>
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
                        <button 
                          className="btn-icon" 
                          title="Edit"
                          onClick={() => handleEditClick(tour)}
                        >
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

      {/* Tour Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content tour-form-modal">
            <div className="modal-header">
              <h2>{currentTour ? 'Edit Tour' : 'Add New Tour'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tour Package Name</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter tour package name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Country</label>
                  <div className="custom-dropdown">
                    <input
                      type="text"
                      placeholder="Search and select a country..."
                      value={countrySearchTerm}
                      onChange={handleCountrySearch}
                      onFocus={() => setShowCountryDropdown(true)}
                      required
                    />
                    {showCountryDropdown && (
                      <div className="dropdown-options">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map(country => (
                            <div 
                              key={country._id} 
                              className="dropdown-item"
                              onClick={() => handleCountrySelect(country.name)}
                            >
                              {country.name}
                            </div>
                          ))
                        ) : (
                          <div className="dropdown-item no-results">No countries found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Enter tour description"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Main Cover Image URL</label>
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter main cover image URL"
                  />
                  {formData.coverImage && (
                    <img 
                      src={formData.coverImage} 
                      alt="Cover preview" 
                      className="image-preview"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                
                <div className="form-group">
                  <label>Hero Images (At least 5 recommended)</label>
                  {formData.heroImages.map((image, index) => (
                    <div key={`image-${index}`} className="array-input-group">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => handleArrayInputChange(index, 'heroImages', e.target.value)}
                        placeholder={`Image ${index + 1} URL`}
                      />
                      {index >= 5 && (
                        <button 
                          type="button" 
                          className="btn-remove"
                          onClick={() => handleRemoveArrayItem('heroImages', index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn-add"
                    onClick={() => handleAddArrayItem('heroImages', '')}
                  >
                    Add More Images
                  </button>
                </div>
                
                <div className="form-row">
                  <div className="form-group half-width">
                    <label>Number of days</label>
                    <input
                      type="number"
                      name="days"
                      value={formData.days}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="form-group half-width">
                    <label>Number of nights</label>
                    <input
                      type="number"
                      name="nights"
                      value={formData.nights}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Highlights</label>
                  {formData.highlights.map((item, index) => (
                    <div key={`highlight-${index}`} className="array-input-group">
                      <span className="input-icon">★</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayInputChange(index, 'highlights', e.target.value)}
                        placeholder="Enter key highlight (e.g., Safari in Maasai Mara)"
                      />
                      <button 
                        type="button" 
                        className="btn-remove"
                        onClick={() => handleRemoveArrayItem('highlights', index)}
                        disabled={formData.highlights.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn-add"
                    onClick={() => handleAddArrayItem('highlights', '')}
                  >
                    + Add Highlight
                  </button>
                </div>
                
                <div className="form-group">
                  <label>Includes</label>
                  {formData.includes.map((item, index) => (
                    <div key={`include-${index}`} className="array-input-group">
                      <span className="input-icon">✓</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayInputChange(index, 'includes', e.target.value)}
                        placeholder="Enter what's included (e.g., 8 nights' accommodation)"
                      />
                      <button 
                        type="button" 
                        className="btn-remove"
                        onClick={() => handleRemoveArrayItem('includes', index)}
                        disabled={formData.includes.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn-add"
                    onClick={() => handleAddArrayItem('includes', '')}
                  >
                    + Add Include Item
                  </button>
                </div>
                
                <div className="form-group">
                  <label>Excludes</label>
                  {formData.excludes.map((item, index) => (
                    <div key={`exclude-${index}`} className="array-input-group">
                      <span className="input-icon">✗</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayInputChange(index, 'excludes', e.target.value)}
                        placeholder="Enter what's excluded (e.g., International flights)"
                      />
                      <button 
                        type="button" 
                        className="btn-remove"
                        onClick={() => handleRemoveArrayItem('excludes', index)}
                        disabled={formData.excludes.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn-add"
                    onClick={() => handleAddArrayItem('excludes', '')}
                  >
                    + Add Exclude Item
                  </button>
                </div>
                
                <div className="form-group">
                  <label>Visa Requirements</label>
                  <div className="array-input-group">
                    <span className="input-icon">🔒</span>
                    <textarea
                      name="visaRequirements"
                      value={formData.visaRequirements}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter detailed visa and documentation requirements (e.g., Tourist visa required for all nationalities, processing time 7-10 business days)"
                    ></textarea>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Best Time to Visit (Optional)</label>
                  <input
                    type="text"
                    name="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={handleInputChange}
                    placeholder="e.g., October to March"
                  />
                </div>
                
                <div className="form-group">
                  <label>Travel Tips (Optional)</label>
                  {formData.travelTips.map((item, index) => (
                    <div key={`tip-${index}`} className="array-input-group">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayInputChange(index, 'travelTips', e.target.value)}
                        placeholder="Enter travel tip"
                      />
                      <button 
                        type="button" 
                        className="btn-remove"
                        onClick={() => handleRemoveArrayItem('travelTips', index)}
                        disabled={formData.travelTips.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn-add"
                    onClick={() => handleAddArrayItem('travelTips', '')}
                  >
                    Add Travel Tip
                  </button>
                </div>
                
                <div className="form-row">
                  <div className="form-group half-width">
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="form-group half-width">
                    <label>Discount Price (Optional)</label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half-width">
                    <label>Difficulty</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="difficult">Difficult</option>
                    </select>
                  </div>
                  
                  <div className="form-group half-width">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                    />
                    Featured Tour
                  </label>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {currentTour ? 'Update Tour' : 'Add Tour'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
