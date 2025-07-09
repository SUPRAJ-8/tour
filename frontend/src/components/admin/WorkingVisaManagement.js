import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSyncAlt, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmationModal from '../common/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './WorkingVisaManagement.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const WorkingVisaManagement = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [visas, setVisas] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const filteredCountries = countries.filter(c => c.toLowerCase().includes(countrySearchTerm.toLowerCase()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentVisa, setCurrentVisa] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [visaToDelete, setVisaToDelete] = useState(null);
  const [detailsVisa, setDetailsVisa] = useState(null);

  const initialFormState = {
    tourPackageName: '',
    destination: [],
    description: '',
    mainCoverImage: '',
    heroImages: Array(5).fill(''),
    workPermitVisa: '',
    jobOpportunities: '',
    groupSize: '',
    bestSeason: '',
    duration: '',
    requirements: '', // one per line
    culturalNotes: '',
    importantNotes: '', // one per line
    sectorsTitle: '',
    requirementsTitle: '',
    applicationProcessTitle: '',
    headlines: [ { title: '', details: '' } ],
    status: 'active',
  };
  const [formData, setFormData] = useState(initialFormState);

  // Fetch distinct country list
  const fetchCountries = useCallback(async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/countries?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const list = (response.data?.data || response.data || []).map(d => d.country || d.name).filter(Boolean);
      const unique = [...new Set(list)].sort();
      // merge with any locally stored custom additions
      const local = JSON.parse(localStorage.getItem('customCountries') || '[]');
      const merged = [...new Set([...unique, ...local])].sort();
      setCountries(merged);
    } catch (err) {
      console.error('Failed to fetch destinations', err);
    }
  }, [token]);

  const fetchVisas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/visas`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      // The API returns data in the shape: { data: { data: visas[] } }
      // So we need to access the nested `data` key to get the actual array
      setVisas(response.data?.data?.data || []);
    } catch (err) {
      setError('Failed to fetch visa information.');
      toast.error('Failed to fetch visa information.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchVisas();
    fetchCountries();
  }, [fetchVisas, fetchCountries]);

  const handleCountrySearch = (e) => {
    setCountrySearchTerm(e.target.value);
  };

  const handleSelectCountry = (country) => {
    setFormData(prev => {
      const selected = Array.isArray(prev.destination) ? prev.destination : [];
      if (selected.includes(country)) return prev;
      return { ...prev, destination: [...selected, country] };
    });
    setCountrySearchTerm('');
    setShowCountryDropdown(false);
  };

  // Add typed country when user presses Enter
  const handleCountryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = countrySearchTerm.trim();
      if (val && !formData.destination.includes(val)) {
      // add to destination list
      setFormData(prev => ({ ...prev, destination: [...prev.destination, val] }));
      // include in dropdown options for immediate reuse
      setCountries(prev => prev.includes(val) ? prev : [...prev, val].sort());
      // persist to backend destinations collection (ignore errors)
           (async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          await axios.post(`${apiUrl}/api/countries`, { name: val }, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (err) {
          // backend may already have entry or endpoint may not exist; silently ignore
          console.error('Add country failed', err?.response?.data || err.message);
        }
      })();
      setCountries(prev => prev.includes(val) ? prev : [...prev, val].sort());
        
      }
      setCountrySearchTerm('');
      setShowCountryDropdown(false);
    }
  };

  const handleRemoveCountry = (country) => {
    setFormData(prev => ({
      ...prev,
      destination: prev.destination.filter(c => c !== country),
    }));
  };

  // Headline handlers
  const addHeadline = () => {
    setFormData(prev => ({ ...prev, headlines: [...prev.headlines, { title: '', details: '' }] }));
  };
  const removeHeadline = (idx) => {
    setFormData(prev => ({ ...prev, headlines: prev.headlines.filter((_, i) => i !== idx) }));
  };
  const handleHeadlineChange = (idx, field, value) => {
    setFormData(prev => {
      const updated = [...prev.headlines];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, headlines: updated };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!Array.isArray(formData.destination) || formData.destination.length === 0) {
      toast.error('Please select at least one destination.');
      return;
    }
    let apiData = {
        ...formData,
        heroImages: formData.heroImages.filter((url) => url.trim() !== ''),
        requirements: formData.requirements.split(',,').map(s => s.trim()).filter(Boolean),
        culturalNotes: formData.culturalNotes.split(',,').map(s => s.trim()).filter(Boolean),
        importantNotes: formData.importantNotes.split(',,').map(s => s.trim()).filter(Boolean),
        headlines: formData.headlines.filter(h => h.title.trim() || h.details.trim()),
        jobOpportunities: formData.jobOpportunities.split(',,').map(s => s.trim()).filter(Boolean),
        groupSize: formData.groupSize,
        bestSeason: formData.bestSeason,
        duration: formData.duration,
        destination: Array.isArray(formData.destination) ? formData.destination.join(', ') : formData.destination,
  };
  // remove empty string description
  if (apiData.description === '') delete apiData.description;

    try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        if (currentVisa) {
            await axios.patch(`${apiUrl}/api/visas/${currentVisa._id}`, apiData, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            toast.success('Visa information updated successfully!');
        } else {
            await axios.post(`${apiUrl}/api/visas`, apiData, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            toast.success('Visa information added successfully!');
        }
        fetchVisas();
        fetchCountries();
        setShowModal(false);
    } catch (err) {
        const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Failed to save visa information.';
        toast.error(msg);
        console.error('Visa save error:', err?.response || err);
    }
  };

  const handleAddNewClick = () => {
  fetchCountries();
    setCurrentVisa(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const handleEditClick = (visa) => {
  fetchCountries();
    setCurrentVisa(visa);
    setFormData({
        ...visa,
        destination: Array.isArray(visa.destination) ? visa.destination : (visa.destination ? [visa.destination] : []),
        // Ensure heroImages is an array of 5 strings (URLs or empty)
      heroImages: (() => {
        let arr = [];
        if (Array.isArray(visa.heroImages)) {
          arr = [...visa.heroImages];
        } else if (typeof visa.heroImages === 'string' && visa.heroImages.trim() !== '') {
          arr = [visa.heroImages.trim()];
        }
        while (arr.length < 5) arr.push('');
        return arr.slice(0, 5);
      })(),
        requirements: visa.requirements ? visa.requirements.join(',,') : '',
        culturalNotes: visa.culturalNotes ? visa.culturalNotes.join(',,') : '',
        importantNotes: visa.importantNotes ? visa.importantNotes.join(',,') : '',
    sectorsTitle: visa.sectorsTitle || '',
    requirementsTitle: visa.requirementsTitle || '',
    applicationProcessTitle: visa.applicationProcessTitle || '',
    headlines: (visa.headlines && visa.headlines.length ? visa.headlines : [{ title: visa.headline || '', details: visa.headlineDetails || '' }]),
    jobOpportunities: visa.jobOpportunities ? visa.jobOpportunities.join(',,') : '',
    groupSize: visa.groupSize || visa.group_size || '',
    bestSeason: visa.bestSeason || visa.best_season || '',
    duration: visa.duration || visa.days || '',
    });
    setShowModal(true);
  };

  const handleViewDetails = (visa) => {
    navigate(`/tours/${visa._id}`);
  };

  const handleDeleteClick = (visa) => {
    setVisaToDelete(visa);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/visas/${visaToDelete._id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Visa information deleted successfully!');
      fetchVisas();
      setShowDeleteConfirmation(false);
      setVisaToDelete(null);
    } catch (err) {
      toast.error('Failed to delete visa information.');
      console.error(err);
    }
  };

  return (
    <div className="admin-management-container">
      <div className="admin-management-header">
        <h2>Working Visa Management</h2>
        <div className="header-actions">
            <button onClick={handleAddNewClick} className="action-btn add-btn">
                <FaPlus /> Add New Visa Info
            </button>
            <button onClick={fetchVisas} className="action-btn refresh-btn" disabled={loading}>
                <FaSyncAlt className={loading ? 'rotating' : ''} /> Refresh
            </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tour Package</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visas.length > 0 ? (
                visas.map((visa) => (
                  <tr key={visa._id}>
                    <td>{visa.tourPackageName}</td>
                    <td>{Array.isArray(visa.destination) ? visa.destination.join(', ') : visa.destination}</td>
                    <td>
                        <span className={`status-badge status-${visa.status}`}>
                            {visa.status}
                        </span>
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => handleViewDetails(visa)} className="action-btn view-btn" title="View Details"><FaEye /></button>
                      <button onClick={() => handleEditClick(visa)} className="action-btn edit-btn" title="Edit"><FaEdit /></button>
                      <button onClick={() => handleDeleteClick(visa)} className="action-btn delete-btn" title="Delete"><FaTrash /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No visa information found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Details modal removed since we navigate to public page */}
{false && detailsVisa && (
        <div className="modal-overlay">
          <div className="modal-content visa-details-modal">
            <div className="modal-header">
              <h2>Visa Details</h2>
              <button type="button" className="close-btn" onClick={() => setDetailsVisa(null)}>×</button>
            </div>
            <div className="modal-body details-body">
              <p><strong>Tour Package:</strong> {detailsVisa.tourPackageName}</p>
              <p><strong>Destination:</strong> {detailsVisa.destination}</p>
              {detailsVisa.description && <p><strong>Description:</strong> {detailsVisa.description}</p>}
              {detailsVisa.requirements && detailsVisa.requirements.length > 0 && (
                <div>
                  <strong>Requirements:</strong>
                  <ul>
                    {detailsVisa.requirements.map((req, idx) => (<li key={idx}>{req}</li>))}
                  </ul>
                </div>
              )}
              {detailsVisa.culturalNotes && detailsVisa.culturalNotes.length > 0 && (
                <div>
                  <strong>Cultural Notes:</strong>
                  <ul>
                    {detailsVisa.culturalNotes.map((note, idx) => (<li key={idx}>{note}</li>))}
                  </ul>
                </div>
              )}
              {detailsVisa.importantNotes && detailsVisa.importantNotes.length > 0 && (
                <div>
                  <strong>Important Notes:</strong>
                  <ul>
                    {detailsVisa.importantNotes.map((note, idx) => (<li key={idx}>{note}</li>))}
                  </ul>
                </div>
              )}
              <p><strong>Status:</strong> {detailsVisa.status}</p>
              <p><strong>Created:</strong> {new Date(detailsVisa.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
       )}

       {showModal && (
        <div className="modal-overlay">
          <div className="modal-content visa-form-modal">
            <div className="modal-header">
              <h2>{currentVisa ? 'Edit Visa Information' : 'Add New Visa Information'}</h2>
              <button type="button" className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group half-width">
                    <label>Tour Package Name</label>
                    <input
                      type="text"
                      name="tourPackageName"
                      value={formData.tourPackageName}
                      onChange={handleInputChange}
                      required
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
                        onKeyDown={handleCountryKeyDown}
                        onFocus={() => setShowCountryDropdown(true)}
                      />
                      {showCountryDropdown && (
                        <div className="dropdown-options">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((c) => (
                              <div
                                key={c}
                                className="dropdown-item"
                                onClick={() => handleSelectCountry(c)}
                              >
                                {c}
                              </div>
                            ))
                          ) : (
                            <div className="dropdown-item no-results">No results</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="selected-countries">
                      {(Array.isArray(formData.destination) ? formData.destination : (formData.destination ? [formData.destination] : [])).map((c) => (
                        <span key={c} className="selected-country-chip">
                          {c}
                          <button type="button" onClick={() => handleRemoveCountry(c)}>×</button>
                        </span>
                       ))}
                     </div>
                   </div>
                 </div>
 
                 <div className="form-group">
                  <label>Description</label>
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                    modules={{ toolbar: [ ['bold', 'italic', 'underline'], [{ 'align': [] }], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image'] ] }}
                    formats={['bold','italic','underline','align','list','bullet','link','image'] }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group half-width">
                    <label>Group Size</label>
                    <input
                      type="text"
                      name="groupSize"
                      value={formData.groupSize}
                      onChange={handleInputChange}
                      
                    />
                  </div>
                  <div className="form-group half-width">
                    <label>Best Season</label>
                    <input
                      type="text"
                      name="bestSeason"
                      value={formData.bestSeason}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half-width">
                    <label>Duration (Days)</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Main Cover Image URL</label>
                  <input
                    type="text"
                    name="mainCoverImage"
                    value={formData.mainCoverImage}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Hero Images (Up to 5 images)</label>
                  {[...formData.heroImages].slice(0,5).map((img, idx) => (
                    <div key={`visa-hero-${idx}`} className="array-input-group">
                      <input
                        type="text"
                        value={img}
                        onChange={(e)=>{
                          const arr=[...formData.heroImages];
                          arr[idx]=e.target.value;
                          setFormData(prev=>({...prev, heroImages: arr}));
                        }}
                        placeholder={`Enter hero image ${idx+1} URL`}
                      />
                      {img && (
                        <img src={img} alt={`Hero ${idx+1}`} className="image-preview-small" onError={(e)=>{e.target.style.display='none';}}/>
                      )}
                    </div>
                  ))}
                </div>
                

                
                
                

                {/* Headlines List */}
                <div className="form-group">
                  <label>Headlines</label>
                  {formData.headlines.map((h, idx) => (
                    <div key={idx} className="headline-group">
                      <input
                        type="text"
                        placeholder="Headline"
                        value={h.title}
                        onChange={(e) => handleHeadlineChange(idx, 'title', e.target.value)}
                      />
                      <textarea
                        placeholder="Headline details"
                        rows="2"
                        value={h.details}
                        onChange={(e) => handleHeadlineChange(idx, 'details', e.target.value)}
                      ></textarea>
                      <button type="button" className="remove-headline-btn" onClick={() => removeHeadline(idx)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-headline-btn" onClick={addHeadline}>Add Headline</button>
                </div>

                
                
                
                
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      


          

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this visa information? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default WorkingVisaManagement;
