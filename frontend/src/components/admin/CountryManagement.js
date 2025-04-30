import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useData } from "../../context/DataContext";
import { toast } from 'react-toastify';
import ConfirmationModal from '../common/ConfirmationModal';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import "./AdminComponents.css";

const styles = {
  adminComponentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  continentLinks: {
    display: 'flex',
    gap: '0.5rem',
    marginRight: '1rem',
  },
  continentBtn: {
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    color: 'white',
    display: 'inline-block',
  },
  asiaBtnStyle: {
    backgroundColor: '#4CAF50',
    '&:hover': {
      backgroundColor: '#45a049',
    },
  },
  europeBtnStyle: {
    backgroundColor: '#2196F3',
    '&:hover': {
      backgroundColor: '#1e88e5',
    },
  },
};

// Function to get flag URL based on country name
const getCountryFlagUrl = (countryName) => {
  // Map country names to their local flag image filenames
  const countryToFilename = {
    "Japan": "japan.jpg",
    "Thailand": "thailand.jpg",
    "Vietnam": "vietnam.jpg",
    "China": "china.jpg",
    "Singapore": "singapore.jpg",
    "Malaysia": "malaysia.jpg",
    "Italy": "italy.jpg",
    "France": "france.jpg",
    "Spain": "spain.jpg",
    "Germany": "germany.jpg",
    "United Kingdom": "uk.jpg",
    "Switzerland": "switzerland.jpg",
    "Greece": "greece.jpg",
    "Portugal": "portugal.jpg"
  };
  
  const filename = countryToFilename[countryName];
  // The server serves static files from /images route
  return filename ? `http://localhost:5000/images/flags/${filename}` : null;
};

// FlagImage component to handle flag display and error states
const FlagImage = ({ countryName, flagImageUrl }) => {
  const [imageError, setImageError] = useState(false);
  
  // Try different sources in order of preference
  const getImageSource = () => {
    // 1. First try the direct flagImageUrl if provided
    if (flagImageUrl && flagImageUrl.trim() !== '') {
      return flagImageUrl;
    }
    
    // 2. Then try the mapped country flag
    const mappedFlag = getCountryFlagUrl(countryName);
    if (mappedFlag) {
      return mappedFlag;
    }
    
    // 3. If all else fails, return null
    return null;
  };
  
  const flagUrl = getImageSource();
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  if (!flagUrl || imageError) {
    return (
      <div className="table-flag">
        <div className="no-flag" style={{ 
          width: '40px', 
          height: '30px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          color: '#666',
          fontSize: '10px',
          borderRadius: '3px'
        }}>
          No flag
        </div>
      </div>
    );
  }
  
  return (
    <div className="table-flag">
      <img 
        src={flagUrl} 
        alt={`${countryName} flag`} 
        onError={handleImageError} 
        style={{ 
          width: '40px', 
          height: '30px', 
          objectFit: 'cover',
          border: '1px solid #ddd',
          borderRadius: '3px'
        }}
      />
    </div>
  );
};

const CountryManagement = () => {
  const { countries, dataLoading, addCountry, updateCountry, deleteCountry, refreshData } = useData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [continentFilter, setContinentFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    continent: "asia",
    description: "",
    mainImage: "",
    heroImage: "",
    flagImage: "",
    capital: "",
    language: "",
    currency: "",
    timeZone: "",
    popularDestinations: [],
    bestTimeToVisit: "",
    travelTips: [],
  });

  const [imageErrors, setImageErrors] = useState({
    mainImage: false,
    heroImage: false,
    flagImage: false,
  });

  const validateImageUrl = async (path) => {
    // Always return true to accept any path format
    // This allows both URLs and local paths to be accepted
    return true;
  };

  useEffect(() => {
    if (!dataLoading) {
      setLoading(false);
    }
  }, [dataLoading]);

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesContinent =
      continentFilter === "all" || country.continent === continentFilter;
    return matchesSearch && matchesContinent;
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate image URLs when they change
    if (name === 'mainImage' || name === 'heroImage' || name === 'flagImage') {
      const isValid = await validateImageUrl(value);
      setImageErrors(prev => ({
        ...prev,
        [name]: !isValid
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create a copy of the form data to avoid modifying the original state directly
      const updatedFormData = { ...formData };
      
      // Explicitly ensure heroImage is included and not empty
      if (!updatedFormData.heroImage) {
        updatedFormData.heroImage = updatedFormData.mainImage; // Use main image as fallback
      }

      // Map form fields to database fields
      const countryData = {
        ...updatedFormData,
        image: updatedFormData.mainImage, // Map mainImage to image field in database
        _id: currentCountry ? currentCountry._id : undefined, // Ensure ID is included for updates
      };
      
      console.log("Submitting country data:", countryData);
      console.log("Hero image:", countryData.heroImage);
      
      let result;
      if (currentCountry) {
        // Update existing country using DataContext method
        result = await updateCountry(currentCountry._id, countryData);
        console.log("Country updated:", result);
        toast.success(`${countryData.name} has been updated successfully!`);
      } else {
        // Add new country using DataContext method
        result = await addCountry(countryData);
        console.log("Country added:", result);
        toast.success(`${countryData.name} has been added successfully!`);
      }
      
      // Refresh data to ensure changes are reflected everywhere
      refreshData();
      
      // Close modal and reset form
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Error saving country:", err);
      setError(err.response?.data?.message || "An error occurred");
      toast.error(`Failed to save country: ${err.response?.data?.message || "An unknown error occurred"}`);
    }
  };

  const handleDeleteClick = (country) => {
    setCountryToDelete(country);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async (id) => {
    try {
      // Get country name before deletion for the toast message
      const countryToDelete = countries.find(country => country._id === id);
      const countryName = countryToDelete ? countryToDelete.name : 'Country';
      
      // Use DataContext deleteCountry method
      await deleteCountry(id);
      
      // Show success toast
      toast.success(`${countryName} has been deleted successfully!`);
      
      // Refresh data to ensure changes are reflected everywhere
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(`Failed to delete country: ${err.response?.data?.message || "An unknown error occurred"}`);
    }
  };

  const handleView = (country) => {
    navigate(`/countries/${country.continent}/${country.name.toLowerCase()}`);
  };

  const handleEdit = (country) => {
    // Store the full country object for reference during update
    setCurrentCountry(country);
    
    // Set form data with proper image mappings
    setFormData({
      name: country.name,
      continent: country.continent,
      description: country.description,
      // Map image fields correctly
      mainImage: country.image || "", // Use image field from database for mainImage
      heroImage: country.heroImage || "",
      flagImage: country.flagImage || "",
      capital: country.capital || "",
      language: country.language || "",
      currency: country.currency || "",
      timeZone: country.timeZone || "",
      popularDestinations: country.popularDestinations || [],
      bestTimeToVisit: country.bestTimeToVisit || "",
      travelTips: country.travelTips || [],
    });
    
    // Show the edit modal
    setShowModal(true);
    
    // Log for debugging
    console.log("Editing country:", country);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      continent: "asia",
      description: "",
      mainImage: "",
      heroImage: "",
      flagImage: "",
      capital: "",
      language: "",
      currency: "",
      timeZone: "",
      popularDestinations: [],
      bestTimeToVisit: "",
      travelTips: [],
    });
    setCurrentCountry(null);
  };

  return (
    <div className="admin-container">
      <div style={styles.adminComponentHeader}>
        <h2>Country Management</h2>
        <div style={styles.headerActions}>
          <div style={styles.continentLinks}>
            <Link 
              to="/countries/asia" 
              style={{...styles.continentBtn, ...styles.asiaBtnStyle}}
            >
              Asia
            </Link>
            <Link 
              to="/countries/europe" 
              style={{...styles.continentBtn, ...styles.europeBtnStyle}}
            >
              Europe
            </Link>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add New Country
          </button>
        </div>
      </div>

      <div className="admin-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <select
            value={continentFilter}
            onChange={(e) => setContinentFilter(e.target.value)}
          >
            <option value="all">All Continents</option>
            <option value="asia">Asia</option>
            <option value="europe">Europe</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading countries...</div>
      ) : countries.length === 0 ? (
        <div className="no-data">No countries found</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Flag</th>
                <th>Name</th>
                <th>Continent</th>
                <th>Capital</th>
                <th>Popular Destinations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCountries.map((country) => (
                <tr key={country._id}>
                  <td>
                    <FlagImage countryName={country.name} flagImageUrl={country.flagImage} />
                  </td>
                  <td>{country.name}</td>
                  <td>
                    <span className={`continent-badge ${country.continent}`}>
                      {country.continent.charAt(0).toUpperCase() + country.continent.slice(1)}
                    </span>
                  </td>
                  <td>{country.capital}</td>
                  <td>
                    <div className="destinations-list">
                      {country.popularDestinations.join(", ")}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-view"
                        title="View Country"
                        onClick={() => handleView(country)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-action btn-edit"
                        title="Edit Country"
                        onClick={() => handleEdit(country)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-action btn-delete"
                        title="Delete Country"
                        onClick={() => handleDeleteClick(country)}
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
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{currentCountry ? "Edit Country" : "Add New Country"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Continent:</label>
                    <select
                      name="continent"
                      value={formData.continent}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="asia">Asia</option>
                      <option value="europe">Europe</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                    />
                  </div>

                  <div className="form-group">
                    <label>Main Image Path:</label>
                    <input
                      type="text"
                      name="mainImage"
                      value={formData.mainImage}
                      onChange={handleInputChange}
                      required
                      className={imageErrors.mainImage ? "error" : ""}
                      placeholder="/images/countries/japan.jpg"
                    />

                    {formData.mainImage && (
                      <img 
                        src={formData.mainImage} 
                        alt="Main preview" 
                        className="image-preview"
                        onError={(e) => {
                          // Don't set error, just hide the preview
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  <div className="form-group">
                    <label>Hero Image Path:</label>
                    <input
                      type="text"
                      name="heroImage"
                      value={formData.heroImage}
                      onChange={handleInputChange}
                      required
                      className={imageErrors.heroImage ? "error" : ""}
                      placeholder="/images/countries/japan-hero.jpg"
                    />

                    {formData.heroImage && (
                      <div className="preview-container">
                        <img 
                          src={formData.heroImage} 
                          alt="Hero preview" 
                          className="image-preview"
                          onError={(e) => {
                            // Don't set error, just hide the preview
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Flag Image Path:</label>
                    <input
                      type="text"
                      name="flagImage"
                      value={formData.flagImage}
                      onChange={handleInputChange}
                      required
                      className={imageErrors.flagImage ? "error" : ""}
                      placeholder="http://localhost:5000/images/flags/japan.jpg"
                    />

                    {formData.flagImage && (
                      <img 
                        src={formData.flagImage} 
                        alt="Flag preview" 
                        className="image-preview"
                        style={{ maxWidth: '100px', maxHeight: '60px', objectFit: 'contain' }}
                        onError={(e) => {
                          // Don't set error, just hide the preview
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Capital:</label>
                    <input
                      type="text"
                      name="capital"
                      value={formData.capital}
                      onChange={handleInputChange}
                      required
                      placeholder="Capital city"
                    />
                  </div>

                  <div className="form-group">
                    <label>Language:</label>
                    <input
                      type="text"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      required
                      placeholder="Official language"
                    />
                  </div>

                  <div className="form-group">
                    <label>Currency:</label>
                    <input
                      type="text"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      required
                      placeholder="Currency name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Time Zone:</label>
                    <input
                      type="text"
                      name="timeZone"
                      value={formData.timeZone}
                      onChange={handleInputChange}
                      required
                      placeholder="UTC+X:XX"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Best Time to Visit:</label>
                    <input
                      type="text"
                      name="bestTimeToVisit"
                      value={formData.bestTimeToVisit}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Spring (March-May)"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {currentCountry ? "Update Country" : "Add Country"}
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
          if (countryToDelete) {
            handleDelete(countryToDelete._id);
            setShowDeleteConfirmation(false);
            setCountryToDelete(null);
          }
        }}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${countryToDelete?.name}? This action cannot be undone and will also remove all associated tours.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default CountryManagement;
