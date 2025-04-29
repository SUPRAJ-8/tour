import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../../context/DataContext';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaGlobeAsia,
  FaGlobeEurope,
  FaArrowLeft
} from 'react-icons/fa';
import './AdminComponents.css';

const DestinationManagement = () => {
  // Fetch countries from the new /api/countries endpoint
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      setCountriesLoading(true);
      try {
        const res = await axios.get('/api/countries');
        setCountries(res.data);
      } catch (err) {
        setCountries([]);
      } finally {
        setCountriesLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Local state for tour packages
  const [tourPackages, setTourPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    duration: '',
    price: '',
    highlights: [''],
    includes: [''],
    excludes: [''],
    visaRequirements: '',
    bestTimeToVisit: '',
    travelTips: [''],
    image: '',
    heroImages: ['', '', '', '', '']
  });
  

  // No need to extract destinations from countries. Tour packages are managed locally.
  useEffect(() => {
    setLoading(false);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleArrayInputChange = (e, index, field) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };
  
  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };
  
  const removeArrayItem = (index, field) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editMode) {
      setTourPackages([...tourPackages, formData]);
    } else if (currentPackage) {
      setTourPackages(
        tourPackages.map(pkg =>
          pkg === currentPackage ? formData : pkg
        )
      );
    }
    resetForm();
    setShowModal(false);
  };
  
  const handleEdit = (pkg) => {
    setEditMode(true);
    setCurrentPackage(pkg);
    setFormData({ ...pkg });
    setShowModal(true);
  };
    
  
  const handleDelete = (pkg) => {
    if (window.confirm(`Are you sure you want to delete the package "${pkg.name}"?`)) {
      setTourPackages(tourPackages.filter(p => p !== pkg));
    }
  };

  const handleCancel = () => {
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      country: '',
      duration: '',
      price: '',
      highlights: [''],
      includes: [''],
      excludes: [''],
      visaRequirements: '',
      bestTimeToVisit: '',
      travelTips: [''],
      image: '',
      heroImages: ['', '', '', '', '']
    });
    setEditMode(false);
    setCurrentPackage(null);
  };
  
  if (loading || countriesLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading tour package data...</p>
      </div>
    );
  }

  return (
    <div className="admin-tab-content">
      <div className="admin-content-header">
        <h2>Tour Destination Management</h2>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditMode(false); resetForm(); }}>
          <FaPlus /> Add New Package
        </button>
      </div>
      
      {/* Modal for adding/editing destinations */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{editMode ? 'Edit Package' : 'Add New Package'}</h3>
              <button className="modal-close" onClick={handleCancel}>
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Destination Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="country-select"
              >
                <option value="">Select a Country</option>
                {countriesLoading ? (
                  <option value="" disabled>Loading countries...</option>
                ) : countries && countries.length > 0 ? (
                  countries.map(country => (
                    <option key={country._id} value={country._id}>
                      {country.name} ({country.continent === 'asia' ? 'Asia' : 'Europe'})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No countries available</option>
                )}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Main Cover Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Enter main cover image URL"
              />
            </div>

            <div className="form-group">
              <label>Hero Images (At least 5 recommended)</label>
              <div className="hero-images-grid">
                {formData.heroImages.map((imageUrl, index) => (
                  <div key={index} className="hero-image-input">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => handleArrayInputChange(e, index, 'heroImages')}
                      placeholder={`Image ${index + 1} URL`}
                    />
                    {imageUrl && (
                      <div className="image-preview">
                        <img src={imageUrl} alt={`Preview ${index + 1}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn-add"
                onClick={() => addArrayItem('heroImages')}
              >
                Add More Images
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (Optional)</label>
              <input
                type="text"
                id="duration"
                name="duration"
                placeholder="e.g., 3-5 days"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </div>
            

            
            <div className="form-group">
              <label>Highlights</label>
              <div className="includes-excludes-container">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="highlights-item">
                    <span className="highlights-icon">★</span>
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayInputChange(e, index, 'highlights')}
                      placeholder="Enter key highlight (e.g., Safari in Maasai Mara)"
                      className="highlights-input"
                    />
                    {formData.highlights.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => removeArrayItem(index, 'highlights')}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add-item"
                  onClick={() => addArrayItem('highlights')}
                >
                  + Add Highlight
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Includes</label>
              <div className="includes-excludes-container">
                {formData.includes.map((include, index) => (
                  <div key={index} className="includes-item">
                    <span className="includes-icon">✓</span>
                    <input
                      type="text"
                      value={include}
                      onChange={(e) => handleArrayInputChange(e, index, 'includes')}
                      placeholder="Enter what's included (e.g., 8 nights' accommodation)"
                      className="includes-input"
                    />
                    {formData.includes.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => removeArrayItem(index, 'includes')}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add-item"
                  onClick={() => addArrayItem('includes')}
                >
                  + Add Include Item
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Excludes</label>
              <div className="includes-excludes-container">
                {formData.excludes.map((exclude, index) => (
                  <div key={index} className="excludes-item">
                    <span className="excludes-icon">✗</span>
                    <input
                      type="text"
                      value={exclude}
                      onChange={(e) => handleArrayInputChange(e, index, 'excludes')}
                      placeholder="Enter what's excluded (e.g., International flights)"
                      className="excludes-input"
                    />
                    {formData.excludes.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => removeArrayItem(index, 'excludes')}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add-item"
                  onClick={() => addArrayItem('excludes')}
                >
                  + Add Exclude Item
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Visa Requirements</label>
              <div className="visa-requirements-container">
                <div className="visa-requirements-item">
                  <span className="visa-icon">🔒</span>
                  <textarea
                    id="visaRequirements"
                    name="visaRequirements"
                    value={formData.visaRequirements}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Enter detailed visa and documentation requirements (e.g., Tourist visa required for all nationalities, processing time 7-10 business days)"
                    className="visa-requirements-input"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bestTimeToVisit">Best Time to Visit (Optional)</label>
              <input
                type="text"
                id="bestTimeToVisit"
                name="bestTimeToVisit"
                value={formData.bestTimeToVisit}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Travel Tips (Optional)</label>
              {formData.travelTips.map((tip, index) => (
                <div key={index} className="array-input-group">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => handleArrayInputChange(e, index, 'travelTips')}
                    placeholder="Enter travel tip"
                  />
                  {formData.travelTips.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeArrayItem(index, 'travelTips')}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn-add"
                onClick={() => addArrayItem('travelTips')}
              >
                Add Travel Tip
              </button>
            </div>
            
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <h3>{editMode ? 'Edit Package' : 'Add New Package'}</h3>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
        <>
          
          <div className="admin-filters">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <FaFilter />
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              >
                <option value="">All Countries</option>
                {(countries || []).map(country => (
                  <option key={country._id} value={country._id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filter and search logic for packages */}
          {tourPackages.filter(pkg =>
            (!searchTerm || pkg.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!filterCountry || pkg.country === filterCountry)
          ).length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Package Name</th>
                    <th>Country</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tourPackages.filter(pkg =>
                    (!searchTerm || pkg.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                    (!filterCountry || pkg.country === filterCountry)
                  ).map(pkg => {
                    const countryObj = (countries || []).find(c => c._id === pkg.country);
                    return (
                      <tr key={pkg.id}>
                        <td>{pkg.name}</td>
                        <td>{countryObj ? countryObj.name : ''}</td>
                        <td>{pkg.duration}</td>
                        <td>{pkg.price}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-action btn-view"
                              title="View Package"
                              onClick={() => alert('View not implemented')}
                            >
                              <FaEye />
                            </button>
                            <button
                              className="btn-action btn-edit"
                              title="Edit Package"
                              onClick={() => handleEdit(pkg)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn-action btn-delete"
                              title="Delete Package"
                              onClick={() => handleDelete(pkg)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              <p>No packages found matching your criteria.</p>
            </div>
          )}
        </>
      </div>
  );
};

export default DestinationManagement;
