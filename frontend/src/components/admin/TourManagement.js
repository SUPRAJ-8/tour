import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye, FaSearch, FaPlus, FaSyncAlt, FaStar, FaMapMarkerAlt, FaCamera, FaMountain, FaTree, FaUtensils, FaBed, FaCar, FaUsers, FaHeart, FaPlane, FaBus, FaTicketAlt, FaPassport, FaWifi, FaUmbrellaBeach, FaCheck, FaTimes, FaInfoCircle, FaLink, FaUpload, FaCloudUploadAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../common/ConfirmationModal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { TableSkeleton } from './AdminSkeleton';
import './TourManagement.css';

// Quill toolbar configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', { 'align': [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: ['#000000', '#111111', '#333333', '#666666', '#999999', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', false] }, { background: [] }],
    ['link', 'clean']
  ]
};
const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'align', 'list', 'bullet', 'color', 'background', 'link'
];

const TourManagement = () => {
  const navigate = useNavigate();
  const { addTour, updateTour, deleteTour, refreshData, countries } = useData();
  const { user, logout, token } = useAuth();

  // State definitions
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const PAGE_SIZE = 5;
  const [pagination, setPagination] = useState({ page: 1 });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const initialFormState = {
    title: '',
    destination: '',
    description: '',
    duration: '',
    days: '',
    nights: '',
    groupSize: '',
    price: '',
    maxGroupSize: '',
    difficulty: '',
    coverImage: '',
    heroImages: Array(5).fill(''),
    highlights: [''],
    includes: [''],
    excludes: [''],
    visaRequirements: '',
    bestSeason: '',
    travelTips: [''],
    status: 'active',
    featured: false,
    hottestTour: false,
    popularTour: false,
    itinerary: [{ day: 1, title: '', description: '' }]
  };

  const [formData, setFormData] = useState(initialFormState);

  // Cover image input mode: 'link' | 'upload' | 'dragdrop'
  const [coverImageTab, setCoverImageTab] = useState('link');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  const handleCoverImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCoverUploadError('Please select an image file.');
      return;
    }

    setCoverUploadError('');
    setUploadingCover(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const data = new FormData();
      data.append('image', file);

      const res = await axios.post(`${apiUrl}/api/upload`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({ ...prev, coverImage: res.data.url }));
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Cover image upload failed:', err);
      setCoverUploadError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploadingCover(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (tour) => {
    setTourToDelete(tour);
    setShowDeleteConfirmation(true);
  };
  async function handleConfirmDelete() {
    try {
      await deleteTour(tourToDelete._id);
      toast.success('Tour deleted successfully!');
      setShowDeleteConfirmation(false);
      setTourToDelete(null);
    } catch (err) {
      toast.error('Failed to delete tour.');
      console.error('Delete tour error:', err);
    }
  }

  const fetchTours = useCallback(async () => {
    const timeoutId = setTimeout(() => setLoading(true), 200);
    try {
      setError(null);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

      if (!token) {
        setError('Please log in to view tours');
        setLoading(false);
        return;
      }

      // Admin view manages the full tour list client-side (search/status/country
      // filtering and pagination all happen in the browser), so request a high
      // limit here rather than relying on the API's default page size of 10.
      const response = await axios.get(`${apiUrl}/api/tours`, {
        params: { limit: 1000 },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data.data)) {
        const tours = response.data.data;
        setTours(tours);
      } else {
        console.warn('Invalid API response format:', response.data);
        setTours([]);
        toast.error('Invalid response format from server');
      }
      clearTimeout(timeoutId);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tours:', error);
      setError(error.response?.data?.message || 'Failed to load tours');
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [token, logout]);

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

  const filteredTours = useMemo(() => {
    let filtered = tours;
    
    // Apply status filter
    filtered = tours.filter(tour => {
      if (!tour) return false;
      
      // For 'all' filter, show all tours
      if (statusFilter === 'all') return true;
      
      // For inactive filter, show both inactive and undefined status
      if (statusFilter === 'inactive') {
        return tour.status === 'inactive';
      }
      
      // For active filter, only show active status
      return tour.status === 'active';
    });

    // Apply country filter
    if (countryFilter !== 'all') {
      filtered = filtered.filter(tour => tour?.destination?.country === countryFilter);
    }

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

    return filtered;
  }, [tours, statusFilter, countryFilter, searchTerm]);

  // Reset back to page 1 whenever the filtered set changes, so we don't get
  // stuck on a page that no longer has any rows.
  useEffect(() => {
    setPagination(prev => (prev.page === 1 ? prev : { ...prev, page: 1 }));
  }, [statusFilter, countryFilter, searchTerm]);

  const totalFilteredPages = Math.max(1, Math.ceil(filteredTours.length / PAGE_SIZE));

  const paginatedTours = useMemo(() => {
    const start = (pagination.page - 1) * PAGE_SIZE;
    return filteredTours.slice(start, start + PAGE_SIZE);
  }, [filteredTours, pagination.page]);

  const tourCountryOptions = useMemo(() => {
    const set = new Set();
    tours.forEach(tour => {
      if (tour?.destination?.country) set.add(tour.destination.country);
    });
    return Array.from(set).sort();
  }, [tours]);

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
      destination: countryName
    });
    setCountrySearchTerm(countryName);
    setShowCountryDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coverImage) {
      toast.error('Please provide a main cover image (paste a link or upload one).');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      let destinationId = null;

      if (formData.destination) {
        const destinationsResponse = await axios.get(`${apiUrl}/api/destinations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const destinations = destinationsResponse.data.data || [];
        const matchingDestination = destinations.find(
          dest => dest.country?.toLowerCase() === formData.destination.toLowerCase()
        );
        
        if (matchingDestination) {
          destinationId = matchingDestination._id;
        } else {
          const newDestination = await axios.post(`${apiUrl}/api/destinations`, {
            name: formData.destination,
            country: formData.destination,
            description: `Tours in ${formData.destination}`,
            continent: 'Asia',
            coverImage: formData.coverImage || 'https://example.com/default.jpg'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          destinationId = newDestination.data.data._id;
        }
      } else if (currentTour && currentTour.destination) {
        destinationId = currentTour.destination._id;
      }

      if (!destinationId) {
        throw new Error('No valid destination found or created');
      }

      const tourData = {
        title: formData.title,
        description: formData.description || '',
        destination: destinationId,
        duration: formData.duration,
        days: formData.days || '',
        nights: formData.nights || '',
        maxGroupSize: formData.maxGroupSize,
        groupSize: formData.groupSize || '',
        bestSeason: formData.bestSeason || '',
        highlights: formData.highlights.filter(item => item.trim() !== ''),
        includes: formData.includes.filter(item => item.trim() !== ''),
        excludes: formData.excludes.filter(item => item.trim() !== ''),
        coverImage: formData.coverImage,
        images: formData.heroImages.filter(img => img.trim() !== ''),
        status: formData.status === 'inactive' ? 'inactive' : 'active',
        featured: Boolean(formData.featured),
        hottestTour: Boolean(formData.hottestTour),
        popularTour: Boolean(formData.popularTour),
        price: formData.price,
        difficulty: formData.difficulty,
        visaRequirements: formData.visaRequirements || '',
        travelTips: formData.travelTips.filter(tip => tip.trim() !== ''),
        itinerary: formData.itinerary || [{ day: 1, title: '', description: '' }]
      };

      let response;
      if (currentTour) {
        response = await axios.put(`${apiUrl}/api/tours/${currentTour._id}`, tourData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Tour updated successfully!');
      } else {
        response = await axios.post(`${apiUrl}/api/tours`, tourData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Tour created successfully!');
      }

      setShowModal(false);
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchTours();
    } catch (err) {
      console.error('Error saving tour:', err);
      console.error('Error response:', err.response);

      let errorMessage = 'Failed to save tour. ';
      const resp = err.response?.data;
      if (resp) {
        if (Array.isArray(resp.errors)) {
          errorMessage += resp.errors.map(e => e.msg || e.message).join(' ');
        } else if (resp.errors && typeof resp.errors === 'object') {
          errorMessage += Object.values(resp.errors).join(' ');
        } else if (resp.message) {
          errorMessage += resp.message;
        } else {
          errorMessage += 'Please try again later.';
        }
      } else if (err.request) {
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        errorMessage += 'An unexpected error occurred.';
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewClick = useCallback(() => {
    setFormData({
      title: '',
      destination: '',
      description: '',
      duration: '',
      days: '',
      nights: '',
      groupSize: '',
      price: '',
      maxGroupSize: '',
      difficulty: '',
      coverImage: '',
      heroImages: Array(5).fill(''),
      highlights: [''],
      includes: [''],
      excludes: [''],
      visaRequirements: '',
      bestSeason: '',
      travelTips: [''],
      status: 'active',
      featured: false,
      hottestTour: false,
      popularTour: false,
      itinerary: [{ day: 1, title: '', description: '' }]
    });
    setCurrentTour(null);
    setCountrySearchTerm('');
    setShowModal(true);
  }, []);

  const handleEditClick = (tour) => {
    setCurrentTour(tour);
    const newFormData = {
      title: tour.title || '',
      destination: tour.destination?.country || '',
      description: tour.description || '',
      coverImage: tour.coverImage || '',
      heroImages: (tour.images?.length ? [...tour.images] : []).concat(Array(5).fill('')).slice(0,5),
      days: tour.days || '',
      nights: tour.nights || '',
      groupSize: tour.groupSize || '',
      bestSeason: tour.bestSeason || '',
      highlights: tour.highlights?.length ? [...tour.highlights] : [''],
      includes: tour.includes?.length ? [...tour.includes] : [''],
      excludes: tour.excludes?.length ? [...tour.excludes] : [''],
      visaRequirements: tour.visaRequirements || '',
      travelTips: tour.travelTips?.length ? [...tour.travelTips] : [''],
      status: tour.status === 'inactive' ? 'inactive' : 'active',
      featured: Boolean(tour.featured),
      hottestTour: Boolean(tour.hottestTour),
      popularTour: Boolean(tour.popularTour),
      itinerary: tour.itinerary || [{ day: 1, title: '', description: '' }]
    };
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

  const clearForm = () => {
    setFormData(initialFormState);
    toast.success('Form cleared successfully');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for status field
    if (name === 'status') {
      setFormData(prev => ({
        ...prev,
        status: value === 'inactive' ? 'inactive' : 'active'
      }));
      return;
    }
    
    // Handle regular input changes including textareas
    if (type === 'textarea' || type === 'text' || type === 'number' || !['popularTour', 'hottestTour', 'featured'].includes(name)) {
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
    setFormData(prev => {
      const newData = { ...prev };
      const array = [...prev[field]];
      
      if (subfield) {
        // Handle nested object updates
        array[index] = {
          ...array[index],
          [subfield]: value
        };
      } else {
        array[index] = value;
      }
      
      newData[field] = array;
      return newData;
    });
  };

  const handleAddArrayItem = (field, defaultValue = '') => {
    const updatedArray = [...formData[field]];
    
    if (field === 'itinerary') {
      const nextDay = updatedArray.length + 1;
      updatedArray.push({ day: nextDay, title: '', description: '' });
    } else if (field === 'highlights') {
      updatedArray.push({ text: '', icon: 'FaStar' });
    } else if (field === 'includes') {
      updatedArray.push({ text: '', category: 'accommodation' });
    } else if (field === 'excludes') {
      updatedArray.push({ text: '', category: 'general' });
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

  // Group tours by country
  const groupToursByCountry = () => {
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
      
      if (!groupedTours[country]) {
        groupedTours[country] = [];
      }
      
      groupedTours[country].push(tour);
    });
    
    return groupedTours;
  };
  
  const groupedTours = groupToursByCountry();

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="tour-management">
      <div className="tour-mgmt-header">
        <h2>Tour Management</h2>
        <div className="tour-mgmt-header-actions">
          <button
            className={`btn-icon-refresh ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh tour data"
          >
            <FaSyncAlt className={refreshing ? 'spin' : ''} />
          </button>
          <button className="btn-create-tour" onClick={handleAddNewClick}>
            <FaPlus /> Create New Tour
          </button>
        </div>
      </div>

      <div className="tour-filter-bar">
        <div className="tour-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="tour-filter-group">
          <span className="tour-filter-label">Status</span>
          <div className="status-pill-group">
            <button
              type="button"
              className={`status-pill ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`status-pill ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active
            </button>
            <button
              type="button"
              className={`status-pill ${statusFilter === 'inactive' ? 'active' : ''}`}
              onClick={() => setStatusFilter('inactive')}
            >
              Inactive
            </button>
          </div>
        </div>

        <div className="tour-filter-group">
          <span className="tour-filter-label">Country</span>
          <select
            className="tour-country-select"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <option value="all">All Countries</option>
            {tourCountryOptions.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredTours.length === 0 ? (
        <p>No tours found. {searchTerm ? 'Try a different search term or ' : ''}Add some tours to get started.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table tour-mgmt-table">
              <thead>
                <tr>
                  <th className="col-index">#</th>
                  <th>Tour Name</th>
                  <th>Country</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTours.map((tour, index) => (
                  <tr key={tour._id}>
                    <td className="col-index">
                      {(pagination.page - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td>
                      <div className="tour-name-cell">
                        <img
                          src={tour.coverImage}
                          alt=""
                          className="tour-thumb"
                          onError={(e) => { e.target.style.visibility = 'hidden'; }}
                        />
                        <span>{tour.title}</span>
                      </div>
                    </td>
                    <td>{tour.destination?.country || 'N/A'}</td>
                    <td>{tour.days ? `${tour.days} Days` : (tour.duration || 'N/A')}</td>
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
                            navigate(`/tours/${tour._id}`);
                          }}
                          title="View tour details"
                        >
                          <FaEye /> <span>View</span>
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(tour)}
                          title="Edit tour"
                        >
                          <FaEdit /> <span>Edit</span>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteClick(tour)}
                          title="Delete tour"
                        >
                          <FaTrash /> <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalFilteredPages > 1 && (
            <div className="pagination">
              <button
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </button>
              <span>Page {pagination.page} of {totalFilteredPages}</span>
              <button
                disabled={pagination.page === totalFilteredPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
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
                <div className="form-row">
                  <div className="form-group half-width">
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
                  <div className="form-group half-width">
                    <label>Destination*</label>
                    <div className="custom-dropdown">
                      <input
                        type="text"
                        placeholder="Search and select a destination..."
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
                            <div className="dropdown-item no-results">No destinations found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half-width">
                    <label>Description (Optional)</label>
                    <ReactQuill
                      modules={quillModules}
                      formats={quillFormats}
                      theme="snow"
                      value={formData.description}
                      onChange={(value)=> setFormData(prev=>({...prev, description: value}))}
                    />
                  </div>
                  <div className="form-group half-width">
                    <label>Main Cover Image</label>

                    <div className="cover-image-card">
                      <div className="cover-image-tabs">
                        <button
                          type="button"
                          className={`cover-tab ${coverImageTab === 'link' ? 'active' : ''}`}
                          onClick={() => setCoverImageTab('link')}
                        >
                          <FaLink /> Paste Link
                        </button>
                        <button
                          type="button"
                          className={`cover-tab upload-tab ${coverImageTab === 'upload' ? 'active' : ''}`}
                          onClick={() => setCoverImageTab('upload')}
                        >
                          <FaUpload /> Browse Files
                        </button>
                      </div>

                      {coverImageTab === 'link' ? (
                        <>
                          <input
                            type="text"
                            name="coverImage"
                            value={formData.coverImage}
                            onChange={handleInputChange}
                            placeholder="Paste an image URL"
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
                        </>
                      ) : (
                        <div
                          className={`cover-dropzone ${isDragActive ? 'active' : ''} ${uploadingCover ? 'uploading' : ''} ${formData.coverImage ? 'has-image' : ''}`}
                          onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                          onDragLeave={() => setIsDragActive(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragActive(false);
                            const file = e.dataTransfer.files && e.dataTransfer.files[0];
                            if (file) handleCoverImageUpload(file);
                          }}
                        >
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            id="cover-image-file-input"
                            className="visually-hidden-file-input"
                            onChange={(e) => handleCoverImageUpload(e.target.files[0])}
                            disabled={uploadingCover}
                          />
                          {formData.coverImage ? (
                            <label htmlFor="cover-image-file-input" className="cover-dropzone-preview-wrap">
                              <img
                                src={formData.coverImage}
                                alt="Cover preview"
                                className="cover-dropzone-preview"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                              <span className="cover-dropzone-replace-hint">
                                {uploadingCover ? 'Uploading...' : 'Click or drag to replace'}
                              </span>
                            </label>
                          ) : (
                            <>
                              <FaCloudUploadAlt className="cover-dropzone-icon" />
                              <label htmlFor="cover-image-file-input" className="btn btn-primary cover-browse-btn">
                                {uploadingCover ? 'Uploading...' : 'Browse Files'}
                              </label>
                              <span className="cover-dropzone-hint">or drag &amp; drop an image here</span>
                            </>
                          )}
                        </div>
                      )}

                      {coverUploadError && <p className="cover-upload-error">{coverUploadError}</p>}

                      <p className="cover-image-hint">Recommended: 1920×1200px in .jpg file</p>
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half-width">
                    <label>Hero Images (Up to 5 images)</label>
                    {[...formData.heroImages, ...Array(5 - formData.heroImages.length).fill('')].slice(0,5).map((image, index) => (
                      <div key={`hero-${index}`} className="array-input-group">
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => handleArrayInputChange(index, 'heroImages', e.target.value)}
                          placeholder={`Enter hero image ${index + 1} URL`}
                        />
                        {image && (
                          <img 
                            src={image} 
                            alt={`Hero ${index + 1} preview`} 
                            className="image-preview-small"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}

                      </div>
                    ))}
                  </div>
                  <div className="form-group half-width">
                    <label>Itinerary</label>
                    {formData.itinerary?.map((day, index) => (
                      <div key={`day-${index}`} className="itinerary-day">
                        <div className="itinerary-header">
                          <h4>Day {day.day}</h4>
                          <button 
                            type="button" 
                            className="btn-remove"
                            onClick={() => handleRemoveArrayItem('itinerary', index)}
                          >
                            Remove Day
                          </button>
                        </div>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => handleArrayInputChange(index, 'itinerary', e.target.value, 'title')}
                          placeholder="Enter day title"
                        />
                        <ReactQuill
                          modules={quillModules}
                          formats={quillFormats}
                          theme="snow"
                          value={day.description}
                          onChange={(value)=>handleArrayInputChange(index,'itinerary',value,'description')}
                        />
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="btn-add"
                      onClick={() => handleAddArrayItem('itinerary', { day: formData.itinerary?.length + 1 || 1, title: '', description: '' })}
                    >
                      Add Day
                    </button>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half-width">
                    <label>Days</label>
                    <input
                      type="text"
                      name="days"
                      value={formData.days}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div className="form-group half-width">
                    <label>Nights</label>
                    <input
                      type="text"
                      name="nights"
                      value={formData.nights}
                      onChange={handleInputChange}
                      placeholder="e.g., 4"
                    />
                  </div>
                  <div className="form-group half-width">
                    <label>Group Size</label>
                    <input
                      type="text"
                      name="groupSize"
                      value={formData.groupSize}
                      onChange={handleInputChange}
                      placeholder="e.g., 2-10 people"
                    />
                  </div>
                  <div className="form-group half-width">
                    <label>Best Season</label>
                    <input
                      type="text"
                      name="bestSeason"
                      value={formData.bestSeason}
                      onChange={handleInputChange}
                      placeholder="e.g., October to March"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Highlights (use ,, to separate points)</label>
                  <textarea
                    value={formData.highlights.join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
                      setFormData(prev => ({
                        ...prev,
                        highlights: lines
                      }));
                    }}
                    placeholder="Enter highlights with double commas (,,) to separate points\nExample:\nScenic mountain views,, Local experiences\nBeach activities,, Water sports"
                    rows="6"
                    className="highlights-textarea"
                  />
                  <small className="input-help">Use double commas (,,) to create separate points in the same line</small>
                </div>

                <div className="form-group">
                  <label>What's Included (use ,, to separate points)</label>
                  <textarea
                    value={formData.includes.join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
                      setFormData(prev => ({
                        ...prev,
                        includes: lines
                      }));
                    }}
                    placeholder="Enter included items with double commas (,,) to separate points\nExample:\nAccommodation,, All meals\nGuided tours,, Transportation"
                    rows="6"
                    className="includes-textarea"
                  />
                  <small className="input-help">Use double commas (,,) to create separate points in the same line</small>
                </div>

                <div className="form-group">
                  <label>What's Not Included (use ,, to separate points)</label>
                  <textarea
                    value={formData.excludes.join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
                      setFormData(prev => ({
                        ...prev,
                        excludes: lines
                      }));
                    }}
                    placeholder="Enter excluded items with double commas (,,) to separate points\nExample:\nInternational flights,, Travel insurance\nPersonal expenses,, Visa fees"
                    rows="6"
                    className="excludes-textarea"
                  />
                  <small className="input-help">Use double commas (,,) to create separate points in the same line</small>
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
                  <div className="form-group half-width checkbox-group horizontal-badges">
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
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn-secondary" onClick={clearForm}>
                    Clear Form
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
