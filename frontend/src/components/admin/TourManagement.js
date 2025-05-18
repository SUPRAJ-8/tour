import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye, FaSearch, FaPlus, FaSyncAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../common/ConfirmationModal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import './TourManagement.css';

const TourManagement = () => {
  const navigate = useNavigate();
  const { addTour, updateTour, deleteTour, refreshData, countries } = useData();
  const { user, logout, token } = useAuth();

  // State definitions
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
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
    featured: false,
    hottestTour: false,
    popularTour: false
  });

  const fetchTours = useCallback(async (page = pagination.page) => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      if (!token) {
        setError('Please log in to view tours');
        setLoading(false);
        return;
      }
      
      console.log('Making API request to:', `${apiUrl}/api/tours`);
      console.log('Using token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get(`${apiUrl}/api/tours`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      
      if (response.data && Array.isArray(response.data.data)) {
        const tours = response.data.data;
        console.log('Found tours:', tours.length);
        if (tours.length > 0) {
          console.log('Sample tour:', tours[0]);
        }
        
        setTours(tours);
        
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            ...response.data.pagination
          }));
        }
        
        console.log('Tours state updated, total tours:', tours.length);
      } else {
        console.warn('Invalid API response format:', response.data);
        setTours([]);
        toast.error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      console.error('Error response:', err.response);
      
      let errorMessage = 'Failed to fetch tours. ';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error status:', err.response.status);
        console.error('Error data:', err.response.data);
        
        if (err.response.status === 401) {
          errorMessage += 'Please log in again.';
          // Force logout on authentication error
          logout();
        } else {
          errorMessage += err.response.data?.message || 'Please try again later.';
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', err.message);
        errorMessage += 'An unexpected error occurred.';
      }
      
      setError(errorMessage);
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, token, logout]);

  useEffect(() => {
    const initializeTours = async () => {
      if (!token) {
        setError('Please log in to view tours');
        setLoading(false);
        return;
      }

      try {
        await fetchTours();
      } catch (error) {
        console.error('Error in initial tour fetch:', error);
        setError('Failed to load tours. Please refresh the page.');
        setLoading(false);
      }
    };

    initializeTours();
  }, [token, fetchTours]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchTours();
      toast.success('Tour data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing tours:', error);
      toast.error('Failed to refresh tours. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  console.log('Current status filter:', statusFilter);
  console.log('All tours before filtering:', tours);

  const filteredTours = useMemo(() => {
    console.log('Filtering tours:', tours);
    if (!Array.isArray(tours)) return [];
    
    let filtered = tours;
    
    console.log('Current status filter:', statusFilter);
    console.log('Tours before filtering:', tours);

    // Apply status filter
    filtered = tours.filter(tour => {
      if (!tour) return false;
      
      console.log('Checking tour:', tour.title, 'Status:', tour.status);
      
      // For 'all' filter, show all tours
      if (statusFilter === 'all') return true;
      
      // For inactive filter, show both inactive and undefined status
      if (statusFilter === 'inactive') {
        return tour.status === 'inactive';
      }
      
      // For active filter, only show active status
      return tour.status === 'active';
    });

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(tour => {
        if (!tour) return false;
        
        const titleMatch = tour.title?.toLowerCase().includes(searchLower);
        const countryMatch = tour.destination?.country?.toLowerCase().includes(searchLower);
        const descriptionMatch = tour.description?.toLowerCase().includes(searchLower);
        
        return titleMatch || countryMatch || descriptionMatch;
      });
    }

    console.log('Filtered tours:', filtered);
    return filtered;
  }, [tours, statusFilter, searchTerm]);

  const filteredCountries = Array.isArray(countries) 
    ? countries.filter(country => 
        country && country.name && country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    try {
      // Handle destination ID
      let destinationId;
      
      if (currentTour && currentTour.destination) {
        // If editing an existing tour, use its current destination
        destinationId = currentTour.destination._id;
        console.log('Using existing destination:', destinationId);
      } else if (formData.country) {
        // If creating a new tour or changing destination
        console.log('Looking up destination for country:', formData.country);
        
        // Get all destinations
        const destinationsResponse = await axios.get(`${apiUrl}/api/destinations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const destinations = destinationsResponse.data.data || [];
        console.log('Found destinations:', destinations.length);
        
        const matchingDestination = destinations.find(
          dest => dest.country?.toLowerCase() === formData.country.toLowerCase()
        );
        
        if (matchingDestination) {
          destinationId = matchingDestination._id;
          console.log('Found matching destination:', matchingDestination.name);
        } else {
          console.log('Creating new destination for:', formData.country);
          // Create a new destination
          const newDestination = await axios.post(`${apiUrl}/api/destinations`, {
            name: formData.country,
            country: formData.country,
            description: `Tours in ${formData.country}`,
            continent: 'Asia', // Default to Asia
            coverImage: formData.coverImage || 'https://example.com/default.jpg'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          destinationId = newDestination.data.data._id;
          console.log('Created new destination:', destinationId);
        }
      } else {
        console.log('No country specified and no existing destination');
      }

      if (!destinationId) {
        throw new Error('No valid destination found or created');
      }

      const tourData = {
        title: formData.title,
        description: formData.description || '',
        destination: destinationId,
        duration: parseInt(formData.days) || 1,
        price: parseFloat(formData.price) || 0,
        discountPrice: parseFloat(formData.discountPrice) || 0,
        maxGroupSize: 10,
        difficulty: formData.difficulty || 'easy',
        images: formData.heroImages.filter(img => img.trim() !== ''),
        coverImage: formData.coverImage,
        includes: formData.includes.filter(item => item.trim() !== ''),
        excludes: formData.excludes.filter(item => item.trim() !== ''),
        status: formData.status === 'inactive' ? 'inactive' : 'active', // Ensure status is included
        featured: Boolean(formData.featured),
        hottestTour: Boolean(formData.hottestTour),
        popularTour: Boolean(formData.popularTour),
        status: formData.status || 'active'
      };

      console.log('Submitting tour data:', tourData);

      let response;
      if (currentTour) {
        // Update existing tour
        console.log('Current tour data:', currentTour);
        console.log('Tour ID for update:', currentTour._id);
        console.log('Update URL:', `${apiUrl}/api/tours/${currentTour._id}`);
        console.log('Update data:', tourData);
        
        try {
          response = await axios.put(`${apiUrl}/api/tours/${currentTour._id}`, tourData, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Update response:', response.data);
          toast.success('Tour updated successfully!');
        } catch (updateError) {
          console.error('Update error:', updateError);
          console.error('Update error response:', updateError.response);
          throw updateError;
        }
      } else {
        // Create new tour
        console.log('Creating new tour with data:', tourData);
        response = await axios.post(`${apiUrl}/api/tours`, tourData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Create response:', response.data);
        toast.success('Tour created successfully!');
      }

      setShowModal(false);
      fetchTours(); // Refresh the tours list
      toast.success('Tour saved successfully!');
    } catch (error) {
      console.error('Error saving tour:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to save tour. ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage += error.response.data.error;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again.';
      }
      
      toast.error(errorMessage);
    }
  };

  const handleAddNewClick = useCallback(() => {
    console.log('Adding new tour');
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
      featured: false,
      hottestTour: false,
      popularTour: false
    });
    setCurrentTour(null);
    setCountrySearchTerm('');
    setShowModal(true);
  }, []);

  const handleEditClick = (tour) => {
    console.log('Editing tour:', tour);
    console.log('Tour status before edit:', tour.status);
    
    setCurrentTour(tour);
    const newFormData = {
      title: tour.title || '',
      country: tour.destination?.country || '',
      description: tour.description || '',
      coverImage: tour.coverImage || '',
      heroImages: tour.images?.length ? [...tour.images] : ['', '', '', '', ''],
      days: tour.duration || 1,
      nights: (tour.duration || 1) - 1,
      highlights: tour.highlights?.length ? [...tour.highlights] : [''],
      includes: tour.includes?.length ? [...tour.includes] : [''],
      excludes: tour.excludes?.length ? [...tour.excludes] : [''],
      visaRequirements: tour.visaRequirements || '',
      bestTimeToVisit: tour.bestTimeToVisit || '',
      travelTips: tour.travelTips?.length ? [...tour.travelTips] : [''],
      price: tour.price || 0,
      discountPrice: tour.discountPrice || 0,
      difficulty: tour.difficulty || 'easy',
      status: tour.status === 'inactive' ? 'inactive' : 'active',
      featured: Boolean(tour.featured),
      hottestTour: Boolean(tour.hottestTour),
      popularTour: Boolean(tour.popularTour)
    };
    console.log('Setting form data with status:', newFormData.status);
    setFormData(newFormData);
    setShowModal(true);
    
    if (tour.destination && tour.destination.country) {
      setCountrySearchTerm(tour.destination.country);
    }
  };

  // Track previous badge state to prevent duplicate notifications
  const [prevBadgeState, setPrevBadgeState] = useState({
    featured: false,
    hottestTour: false,
    popularTour: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for status field
    if (name === 'status') {
      console.log('Status changed to:', value);
      setFormData(prev => ({
        ...prev,
        status: value === 'inactive' ? 'inactive' : 'active'
      }));
      return;
    }
    
    // Handle regular input changes
    if (type !== 'checkbox' || !['popularTour', 'hottestTour', 'featured'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      return;
    }
    
    // Special handling for badge checkboxes
    if (checked) {
      // Create a new form state with only this badge selected
      const updatedFormData = {
        ...formData,
        featured: name === 'featured',
        hottestTour: name === 'hottestTour',
        popularTour: name === 'popularTour'
      };
      
      setFormData(updatedFormData);
      
      // Only show toast if this is a new selection (not from re-render)
      if (!prevBadgeState[name]) {
        // Prevent duplicate toasts by dismissing all existing ones first
        toast.dismiss();
        
        // Show the new toast with a fixed ID
        toast.info(
          `Tour marked as ${name === 'popularTour' ? 'Popular' : name === 'hottestTour' ? 'Hottest' : 'Featured'}`,
          { toastId: 'badge-selection' }
        );
      }
      
      // Update the previous badge state
      setPrevBadgeState({
        featured: name === 'featured',
        hottestTour: name === 'hottestTour',
        popularTour: name === 'popularTour'
      });
    } else {
      // If unchecking, just update that specific badge
      setFormData(prev => ({
        ...prev,
        [name]: false
      }));
      
      // Update the previous badge state for this badge
      setPrevBadgeState(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleArrayInputChange = (index, field, value, subfield = null) => {
    const updatedArray = [...formData[field]];
    
    // Handle bulk input for highlights, includes, and excludes
    if ((field === 'highlights' || field === 'includes' || field === 'excludes') && value.includes('\n')) {
      const items = value.split('\n').filter(item => item.trim() !== '');
      setFormData({
        ...formData,
        [field]: items
      });
      return;
    }

    if (subfield) {
      updatedArray[index] = {
        ...updatedArray[index],
        [subfield]: value
      };
    } else {
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

  const handleConfirmDelete = async () => {
    if (!tourToDelete) return;
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/tours/${tourToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Tour deleted successfully!');
      setShowDeleteConfirmation(false);
      setTourToDelete(null);
      fetchTours(); // Refresh the tours list
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Failed to delete tour. Please try again.');
    }
  };

  // Group tours by country
  const groupToursByCountry = () => {
    console.log('Current Tours State:', tours);
    console.log('Filtered Tours:', filteredTours);
    
    const groupedTours = {};
    
    if (!Array.isArray(filteredTours)) {
      console.error('filteredTours is not an array:', filteredTours);
      return {};
    }
    
    filteredTours.forEach(tour => {
      if (!tour) {
        console.warn('Found null/undefined tour in filteredTours');
        return;
      }
      
      const country = tour.destination?.country || 'Other';
      console.log('Processing tour:', tour.title, 'Country:', country);
      
      if (!groupedTours[country]) {
        groupedTours[country] = [];
      }
      
      groupedTours[country].push(tour);
    });
    
    console.log('Grouped Tours:', groupedTours);
    return groupedTours;
  };
  
  const groupedTours = groupToursByCountry();

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
        <div className="action-buttons-container">
          <button 
            className={`btn-secondary ${refreshing ? 'refreshing' : ''}`} 
            onClick={handleRefresh} 
            disabled={refreshing}
            title="Refresh tour data"
          >
            <FaSyncAlt className={refreshing ? 'spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn-primary" onClick={handleAddNewClick}>
            <FaPlus /> Add New Tour
          </button>
        </div>
      </div>

      <div className="search-filter-container">
        <div className="search-filters">
          <div className="filters-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="status-filter">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

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
                  <th>Country</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTours.map((tour) => (
                  <tr key={tour._id}>
                    <td>{tour.title}</td>
                    <td>{tour.duration} days</td>
                    <td>{tour.destination?.country || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${tour.status === 'inactive' ? 'inactive' : 'active'}`}>
                        {tour.status === 'inactive' ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="tour-actions">
                        <button
                          className="btn-view"
                          onClick={() => {
                            console.log('Tour data:', tour);
                            // Log all possible ID formats
                            console.log('Tour IDs:', {
                              _id: tour._id,
                              id: tour.id,
                              tourId: tour.tourId,
                              objectId: tour.objectId
                            });
                            // Use the first available ID format
                            const tourId = tour._id || tour.id || tour.tourId || tour.objectId;
                            console.log('Using tour ID for navigation:', tourId);
                            navigate(`/tours/${tourId}`);
                          }}
                          title="View tour details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(tour)}
                          title="Edit tour"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteClick(tour)}
                          title="Delete tour"
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
                  <label>Country*</label>
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
                  <label>Highlights (Enter each highlight on a new line)</label>
                  <textarea
                    value={formData.highlights.join('\n')}
                    onChange={(e) => handleArrayInputChange(0, 'highlights', e.target.value)}
                    placeholder="Enter highlights, one per line
Example:
Scenic mountain views
Local cultural experiences
Adventure activities"
                    rows="6"
                    className="highlights-textarea"
                  />
                  <small className="input-help">Each line will be treated as a separate highlight</small>
                </div>
                
                <div className="form-group">
                  <label>Includes (Enter each item on a new line)</label>
                  <textarea
                    value={formData.includes.join('\n')}
                    onChange={(e) => handleArrayInputChange(0, 'includes', e.target.value)}
                    placeholder="Enter included items, one per line
Example:
8 nights' accommodation
All meals and beverages
Guided tours
Transportation"
                    rows="6"
                    className="includes-textarea"
                  />
                  <small className="input-help">Each line will be treated as a separate included item</small>
                </div>
                
                <div className="form-group">
                  <label>Excludes (Enter each item on a new line)</label>
                  <textarea
                    value={formData.excludes.join('\n')}
                    onChange={(e) => handleArrayInputChange(0, 'excludes', e.target.value)}
                    placeholder="Enter excluded items, one per line
Example:
International flights
Travel insurance
Personal expenses
Visa fees"
                    rows="6"
                    className="excludes-textarea"
                  />
                  <small className="input-help">Each line will be treated as a separate excluded item</small>
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
                      className={`status-select ${formData.status}`}
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group checkbox-group" style={{ display: 'flex', gap: '20px' }}>
                  <label>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                    />
                    Featured Tour
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="hottestTour"
                      checked={formData.hottestTour}
                      onChange={handleInputChange}
                    />
                    Hottest Tour
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="popularTour"
                      checked={formData.popularTour}
                      onChange={handleInputChange}
                    />
                    Popular Tour
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

      {showDeleteConfirmation && (
        <ConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={() => {
            setShowDeleteConfirmation(false);
            setTourToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Tour"
          message={`Are you sure you want to delete ${tourToDelete?.title}? This action cannot be undone.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
};

export default TourManagement;
