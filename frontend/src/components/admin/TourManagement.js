import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye, FaSearch, FaPlus, FaSyncAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmationModal from '../common/ConfirmationModal';
import { useData } from '../../context/DataContext';
import './TourManagement.css';

const TourManagement = () => {
  const { addTour, updateTour, deleteTour, refreshData, countries } = useData();
  const [tours, setTours] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/tours?page=${page}&limit=${pagination.limit}`);
      const toursData = response.data.data || [];
      setTours(Array.isArray(toursData) ? toursData : []);
      
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

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      // Call the refreshData function from context to refresh all data
      // This will now fetch fresh data from the API
      const refreshSuccess = await refreshData();
      
      if (refreshSuccess) {
        // Then fetch the tours again to update the local state
        const response = await axios.get(`/api/tours?page=${pagination.page}&limit=${pagination.limit}`);
        const toursData = response.data.data || [];
        setTours(Array.isArray(toursData) ? toursData : []);
        
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
        
        toast.success('Tour data refreshed successfully!');
        console.log('Tour management refreshed with latest data');
      } else {
        toast.warning('Data may not be fully refreshed. Please check the console for details.');
      }
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

  const filteredTours = tours.filter(tour => 
    (tour.title && tour.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (tour.destination?.name && tour.destination.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleDelete = async (id) => {
    try {
      await deleteTour(id);
      toast.success('Tour deleted successfully!');
      // No need to call fetchTours() here as the context will handle the data refresh
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
      featured: false,
      hottestTour: false
    });
    
    setCountrySearchTerm('');
    
    setShowModal(true);
  };

  const handleEditClick = (tour) => {
    setCurrentTour(tour);
    setFormData({
      title: tour.title || '',
      country: tour.destination?.country || '',
      description: tour.description || '',
      coverImage: tour.coverImage || '',
      heroImages: tour.images && tour.images.length > 0 
        ? [...tour.images, ...Array(5 - tour.images.length).fill('')] 
        : ['', '', '', '', ''],
      days: tour.duration || 1,
      nights: (tour.duration > 0) ? tour.duration - 1 : 0,
      highlights: tour.highlights && tour.highlights.length > 0 
        ? [...tour.highlights] 
        : [''],
      includes: tour.includes && tour.includes.length > 0 
        ? [...tour.includes] 
        : [''],
      excludes: tour.excludes && tour.excludes.length > 0 
        ? [...tour.excludes] 
        : [''],
      visaRequirements: tour.visaRequirements || '',
      bestTimeToVisit: tour.bestTimeToVisit || '',
      travelTips: tour.travelTips && tour.travelTips.length > 0 
        ? [...tour.travelTips] 
        : [''],
      price: tour.price || 0,
      discountPrice: tour.discountPrice || 0,
      difficulty: tour.difficulty || 'easy',
      status: tour.status || 'active',
      featured: tour.featured || false,
      hottestTour: tour.hottestTour || false,
      popularTour: tour.popularTour || false
    });
    
    if (tour.destination && tour.destination.country) {
      setCountrySearchTerm(tour.destination.country);
    }
    
    setShowModal(true);
  };

  // Track previous badge state to prevent duplicate notifications
  const [prevBadgeState, setPrevBadgeState] = useState({
    featured: false,
    hottestTour: false,
    popularTour: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Handle regular input changes
    if (type !== 'checkbox' || !['popularTour', 'hottestTour', 'featured'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: newValue
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please enter a tour package name');
      return;
    }
    
    if (!formData.country) {
      toast.error('Please select a country');
      return;
    }
    
    if (!formData.coverImage) {
      toast.error('Please enter a main cover image URL');
      return;
    }
    
    try {
      // Helper function to determine continent based on country
      const getContinent = (country) => {
        // Map of countries to continents (simplified version)
        const continentMap = {
          // Asia
          'Thailand': 'Asia',
          'Nepal': 'Asia',
          'India': 'Asia',
          'China': 'Asia',
          'Japan': 'Asia',
          'Vietnam': 'Asia',
          'Cambodia': 'Asia',
          'Malaysia': 'Asia',
          'Singapore': 'Asia',
          'Indonesia': 'Asia',
          'Philippines': 'Asia',
          'South Korea': 'Asia',
          'Sri Lanka': 'Asia',
          'Maldives': 'Asia',
          'Bhutan': 'Asia',
          'Myanmar': 'Asia',
          'Laos': 'Asia',
          'Bangladesh': 'Asia',
          'Pakistan': 'Asia',
          'Mongolia': 'Asia',
          
          // Europe
          'France': 'Europe',
          'Italy': 'Europe',
          'Spain': 'Europe',
          'United Kingdom': 'Europe',
          'Germany': 'Europe',
          'Greece': 'Europe',
          'Portugal': 'Europe',
          'Switzerland': 'Europe',
          'Netherlands': 'Europe',
          'Belgium': 'Europe',
          'Austria': 'Europe',
          'Sweden': 'Europe',
          'Norway': 'Europe',
          'Denmark': 'Europe',
          'Finland': 'Europe',
          'Ireland': 'Europe',
          'Poland': 'Europe',
          'Czech Republic': 'Europe',
          'Hungary': 'Europe',
          'Croatia': 'Europe',
          
          // North America
          'United States': 'North America',
          'Canada': 'North America',
          'Mexico': 'North America',
          'Costa Rica': 'North America',
          'Panama': 'North America',
          'Jamaica': 'North America',
          'Cuba': 'North America',
          'Bahamas': 'North America',
          'Dominican Republic': 'North America',
          'Puerto Rico': 'North America',
          
          // South America
          'Brazil': 'South America',
          'Argentina': 'South America',
          'Peru': 'South America',
          'Colombia': 'South America',
          'Chile': 'South America',
          'Ecuador': 'South America',
          'Bolivia': 'South America',
          'Venezuela': 'South America',
          'Uruguay': 'South America',
          'Paraguay': 'South America',
          
          // Africa
          'South Africa': 'Africa',
          'Egypt': 'Africa',
          'Morocco': 'Africa',
          'Kenya': 'Africa',
          'Tanzania': 'Africa',
          'Nigeria': 'Africa',
          'Ghana': 'Africa',
          'Ethiopia': 'Africa',
          'Uganda': 'Africa',
          'Zimbabwe': 'Africa',
          
          // Oceania
          'Australia': 'Oceania',
          'New Zealand': 'Oceania',
          'Fiji': 'Oceania',
          'Papua New Guinea': 'Oceania',
          'Solomon Islands': 'Oceania',
          'Vanuatu': 'Oceania',
          'Samoa': 'Oceania',
          'Tonga': 'Oceania'
        };
        
        return continentMap[country] || 'Asia'; // Default to Asia if not found
      };
      
      // Find destination ID for the selected country
      let destinationId;
      
      try {
        // Get all destinations
        const destinationsResponse = await axios.get('/api/destinations');
        const allDestinations = Array.isArray(destinationsResponse.data) 
          ? destinationsResponse.data 
          : (destinationsResponse.data.data || []);
        
        // Find a destination that matches the country
        const matchingDestination = allDestinations.find(
          dest => dest.country && dest.country.toLowerCase() === formData.country.toLowerCase()
        );
        
        if (matchingDestination) {
          destinationId = matchingDestination._id;
          console.log('Found matching destination:', matchingDestination.name);
        } else {
          // Create a new destination for this country
          try {
            // We need to create a new destination for this country
            toast.info(`Creating new destination for ${formData.country}...`);
            
            // Determine the continent for this country
            const continent = getContinent(formData.country);
            
            const newDestinationData = {
              name: `${formData.country}`,
              description: `Explore the beautiful country of ${formData.country}`,
              country: formData.country,
              continent: continent,
              coverImage: formData.coverImage,
              featured: false,
              hottestTour: false
            };
            
            // Try to create a destination directly
            const createDestResponse = await axios.post('/api/destinations', newDestinationData, {
              headers: {
                'Content-Type': 'application/json',
                // Add authorization headers if needed
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (createDestResponse.data && createDestResponse.data._id) {
              destinationId = createDestResponse.data._id;
              console.log('Created new destination:', createDestResponse.data.name);
            } else {
              // If we can't create, use the first destination as fallback
              if (allDestinations.length > 0) {
                destinationId = allDestinations[0]._id;
                console.log('Using default destination:', allDestinations[0].name);
                toast.warning(`Using default destination (${allDestinations[0].name}) for this tour.`);
              } else {
                throw new Error('No destinations available');
              }
            }
          } catch (createError) {
            console.error('Error creating destination:', createError);
            
            // Fallback to using first destination
            if (allDestinations.length > 0) {
              destinationId = allDestinations[0]._id;
              console.log('Using default destination after create error:', allDestinations[0].name);
              toast.warning(`Using default destination (${allDestinations[0].name}) for this tour.`);
            } else {
              throw new Error('No destinations available');
            }
          }
        }
      } catch (destError) {
        console.error('Error finding destination:', destError);
        toast.error('Error finding destination. Please try again.');
        return;
      }
      
      if (!destinationId) {
        toast.error('No valid destination found. Please contact administrator.');
        return;
      }
      
      // Now create the tour with the destination ID
      const tourData = {
        title: formData.title,
        description: formData.description || 'No description provided',
        destination: destinationId,
        duration: parseInt(formData.days) || 1,
        price: parseFloat(formData.price) || 0,
        discountPrice: parseFloat(formData.discountPrice) || 0,
        maxGroupSize: 10,
        difficulty: formData.difficulty || 'easy',
        coverImage: formData.coverImage,
        images: formData.heroImages.filter(img => img.trim() !== ''),
        included: formData.includes.filter(item => item.trim() !== ''),
        excluded: formData.excludes.filter(item => item.trim() !== ''),
        highlights: formData.highlights.filter(item => item.trim() !== ''),
        visaRequirements: formData.visaRequirements || '',
        bestTimeToVisit: formData.bestTimeToVisit || '',
        travelTips: formData.travelTips.filter(tip => tip.trim() !== ''),
        // Ensure boolean values are explicitly set as booleans
        featured: Boolean(formData.featured),
        hottestTour: Boolean(formData.hottestTour),
        popularTour: Boolean(formData.popularTour),
        status: formData.status || 'active',
        createdBy: '64f9c39c1d67b5d1f9fcb1a3'
      };
      
      // Log the boolean values for debugging
      console.log('Boolean values being sent:', {
        featured: tourData.featured,
        hottestTour: tourData.hottestTour,
        popularTour: tourData.popularTour,
        featuredType: typeof tourData.featured,
        hottestTourType: typeof tourData.hottestTour,
        popularTourType: typeof tourData.popularTour
      });
      
      console.log('Submitting tour data:', tourData);
      console.log('Popular Tour value being sent:', tourData.popularTour, typeof tourData.popularTour);
      
      let result;
      if (currentTour) {
        // Use the context's updateTour method
        result = await updateTour(currentTour._id, tourData);
        toast.success(`${tourData.title} has been updated successfully!`);
      } else {
        // Use the context's addTour method
        result = await addTour(tourData);
        toast.success(`${tourData.title} has been added successfully!`);
      }
      
      setShowModal(false);
      // No need to call fetchTours() here as the context will handle the data refresh
    } catch (error) {
      console.error('Error saving tour:', error);
      
      // Extract a meaningful error message
      let errorMessage = 'An unknown error occurred';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response) {
        if (error.response.data && typeof error.response.data === 'object') {
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else {
            // Convert object to string for display
            errorMessage = JSON.stringify(error.response.data);
          }
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      toast.error(`Failed to save tour: ${errorMessage}`);
    }
  };

  // Group tours by country
  const groupToursByCountry = () => {
    const groupedTours = {};
    
    filteredTours.forEach(tour => {
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
            {Object.keys(groupedTours).map(country => (
              <div key={country} className="country-tour-group">
              
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
                    {groupedTours[country].map((tour) => (
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
            ))}
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
