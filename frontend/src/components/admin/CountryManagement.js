import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useData } from "../../context/DataContext";
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

const CountryManagement = () => {
  const { countries, setCountries, dataLoading } = useData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [continentFilter, setContinentFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    continent: "asia",
    description: "",
    mainImage: "",
    heroImage: "",
  });

  const [imageErrors, setImageErrors] = useState({
    mainImage: false,
    heroImage: false,
  });

  const validateImageUrl = async (url) => {
    try {
      const img = new Image();
      return new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    } catch (error) {
      return false;
    }
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
    if (name === 'mainImage' || name === 'heroImage') {
      const isValid = await validateImageUrl(value);
      setImageErrors(prev => ({
        ...prev,
        [name]: !isValid
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate both image URLs before submitting
    const mainImageValid = await validateImageUrl(formData.mainImage);
    const heroImageValid = await validateImageUrl(formData.heroImage);
    
    setImageErrors({
      mainImage: !mainImageValid,
      heroImage: !heroImageValid
    });

    if (!mainImageValid || !heroImageValid) {
      setError("Please provide valid image URLs");
      return;
    }

    try {
      if (currentCountry) {
        const response = await axios.patch(
          `/api/countries/${currentCountry._id}`,
          formData
        );
        setCountries((prev) =>
          prev.map((c) => (c._id === currentCountry._id ? response.data : c))
        );
      } else {
        const response = await axios.post("/api/countries", formData);
        setCountries((prev) => [...prev, response.data]);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      try {
        await axios.delete(`/api/countries/${id}`);
        setCountries((prev) => prev.filter((country) => country._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }
  };

  const handleView = (country) => {
    navigate(`/countries/${country.continent}/${country.name.toLowerCase()}`);
  };

  const handleEdit = (country) => {
    setCurrentCountry(country);
    setFormData({
      name: country.name,
      continent: country.continent,
      description: country.description,
      mainImage: country.mainImage || "",
      heroImage: country.heroImage || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      continent: "asia",
      description: "",
      mainImage: "",
      heroImage: "",
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
                    <div className="table-flag">
                      {country.flagImage ? (
                        <img src={country.flagImage} alt={`${country.name} flag`} />
                      ) : (
                        <div className="no-flag">No flag</div>
                      )}
                    </div>
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
                        onClick={() => handleDelete(country._id)}
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
                    <label>Front Main Image URL:</label>
                    <input
                      type="url"
                      name="mainImage"
                      value={formData.mainImage}
                      onChange={handleInputChange}
                      required
                      className={imageErrors.mainImage ? "error" : ""}
                    />
                    {imageErrors.mainImage && (
                      <span className="error-message">Please provide a valid image URL</span>
                    )}
                    {formData.mainImage && !imageErrors.mainImage && (
                      <img 
                        src={formData.mainImage} 
                        alt="Main preview" 
                        className="image-preview"
                        onError={(e) => {
                          setImageErrors(prev => ({ ...prev, mainImage: true }));
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  <div className="form-group">
                    <label>Hero Image URL:</label>
                    <input
                      type="url"
                      name="heroImage"
                      value={formData.heroImage}
                      onChange={handleInputChange}
                      required
                      className={imageErrors.heroImage ? "error" : ""}
                    />
                    {imageErrors.heroImage && (
                      <span className="error-message">Please provide a valid image URL</span>
                    )}
                    {formData.heroImage && !imageErrors.heroImage && (
                      <img 
                        src={formData.heroImage} 
                        alt="Hero preview" 
                        className="image-preview"
                        onError={(e) => {
                          setImageErrors(prev => ({ ...prev, heroImage: true }));
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
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
    </div>
  );
};

export default CountryManagement;
