import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ConfirmationModal from '../common/ConfirmationModal';
import { 
  FaSearch,
  FaFilter,
  FaUserEdit,
  FaUserSlash,
  FaUserCheck,
  FaUserCog,
  FaEnvelope,
  FaCalendarAlt,
  FaShieldAlt
} from 'react-icons/fa';
import './AdminComponents.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    isActive: true
  });
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setShowEditModal(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.patch(`/api/admin/users/${currentUser._id}`, formData);
      toast.success('User updated successfully!');
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user. Please try again.');
    }
  };
  
  const handleToggleStatusClick = (user) => {
    setUserToToggle(user);
    setShowStatusConfirmation(true);
  };
  
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/status`, {
        isActive: !currentStatus
      });
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status. Please try again.');
    }
  };
  
  const closeModal = () => {
    setShowEditModal(false);
    setCurrentUser(null);
  };
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === '' || user.role === filterRole;
    const matchesStatus = filterStatus === '' || 
      (filterStatus === 'active' && user.isActive) || 
      (filterStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return <div className="loading">Loading users...</div>;
  }
  
  return (
    <div className="admin-tab-content">
      <div className="admin-content-header">
        <h2>User Management</h2>
      </div>
      
      <div className="admin-filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <div className="filter-box">
            <FaShieldAlt />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="filter-box">
            <FaUserCheck />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredUsers.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Bookings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`} className="user-email">
                      <FaEnvelope /> {user.email}
                    </a>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? <FaUserCog /> : <FaUserCheck />}
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className="date-with-icon">
                      <FaCalendarAlt /> {formatDate(user.createdAt)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{user.bookingsCount || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-edit" 
                        title="Edit User"
                        onClick={() => handleEditUser(user)}
                      >
                        <FaUserEdit />
                      </button>
                      <button 
                        className={`btn-action ${user.isActive ? 'btn-delete' : 'btn-view'}`}
                        title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        onClick={() => handleToggleStatusClick(user)}
                      >
                        {user.isActive ? <FaUserSlash /> : <FaUserCheck />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">
          <p>No users found matching your criteria.</p>
        </div>
      )}
      
      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="close-modal" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                  />
                  Active Account
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal for Status Toggle */}
      <ConfirmationModal
        isOpen={showStatusConfirmation}
        onClose={() => setShowStatusConfirmation(false)}
        onConfirm={() => {
          if (userToToggle) {
            handleToggleUserStatus(userToToggle._id, userToToggle.isActive);
            setShowStatusConfirmation(false);
            setUserToToggle(null);
          }
        }}
        title={userToToggle?.isActive ? "Confirm Deactivation" : "Confirm Activation"}
        message={
          userToToggle?.isActive 
            ? `Are you sure you want to deactivate ${userToToggle?.name}'s account? They will no longer be able to log in.` 
            : `Are you sure you want to activate ${userToToggle?.name}'s account? They will be able to log in again.`
        }
        confirmText={userToToggle?.isActive ? "Yes, Deactivate" : "Yes, Activate"}
        cancelText="Cancel"
        type={userToToggle?.isActive ? "danger" : "info"}
      />
    </div>
  );
};

export default UserManagement;
