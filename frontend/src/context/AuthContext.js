import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // Set to true to show skeleton during auth check
  const [error, setError] = useState(null);

  // Set axios default headers and base URL
  useEffect(() => {
    const envUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    // Ensure single '/api' prefix
    const rootUrl = envUrl.endsWith('/api') ? envUrl : envUrl.replace(/\/+$/, '');
    axios.defaults.baseURL = rootUrl.endsWith('/api') ? rootUrl : `${rootUrl}/api`;

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user from token
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Check if token is expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token expired, logout user
            logout();
            setLoading(false);
            return;
          }
          
          // Get user data
          const res = await axios.get('/auth/me');
          setUser(res.data.data);
        } catch (err) {
          console.error('Error loading user:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('/auth/register', userData);
      
      // Set token and user
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors?.[0]?.msg || 
        'Registration failed'
      );
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post('/auth/login', { email, password });
      
      // Set token and user
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return user; // Return user data instead of boolean
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors?.[0]?.msg || 
        'Login failed'
      );
      throw err; // Throw error to be caught by the login component
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const res = await axios.put('/auth/updatedetails', userData);
      setUser(res.data.data);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors?.[0]?.msg || 
        'Profile update failed'
      );
      return false;
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      setError(null);
      const res = await axios.put('/auth/updatepassword', passwordData);
      
      // Update token
      const { token } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors?.[0]?.msg || 
        'Password update failed'
      );
      return false;
    }
  };

  // Clear error
  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
