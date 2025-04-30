import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaEnvelope, FaTimes, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import deerBackground from '../images/deer.jpg';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated and is an admin, redirect to admin dashboard
    if (isAuthenticated && user && user.role === 'admin') {
      navigate('/admin-dashboard');
    }
    
    // Check for saved email in localStorage (Remember Me feature)
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, [isAuthenticated, user, navigate]);

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Handle Remember Me - save email to localStorage if checked
      if (rememberMe) {
        localStorage.setItem('adminEmail', email);
      } else {
        localStorage.removeItem('adminEmail');
      }
      
      const userData = await login(email, password);
      
      if (userData && userData.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        setIsSubmitting(false);
        return;
      }
      
      // Redirect to admin dashboard
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials');
      setIsSubmitting(false);
    }
  };
  
  const handleForgotPassword = async e => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    if (!resetEmail) {
      setError('Please enter your email address');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // In a real application, this would call a backend API endpoint
      // For demo purposes, we'll just simulate a successful password reset request
      // await axios.post('/api/auth/forgotpassword', { email: resetEmail });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Password reset link sent to your email. Please check your inbox.');
      setIsSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="forest-login-page" style={{ backgroundImage: `url(${deerBackground})` }}>
      <div className="login-modal">
        <button className="close-button" onClick={() => navigate('/')}>
          <FaTimes />
        </button>
        
        {!showForgotPassword ? (
          // Admin Login Form
          <>
            <h1>ADMIN LOGIN</h1>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label>Email</label>
                <div className="input-container">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                  />
                  <FaEnvelope className="input-icon" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <div className="input-container">
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    minLength="6"
                  />
                  <FaLock className="input-icon" />
                </div>
              </div>
              
              <div className="form-options">
                <div className="remember-me">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <button 
                  type="button" 
                  className="forgot-password"
                  onClick={toggleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
              
              <button 
                type="submit" 
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </>
        ) : (
          // Forgot Password Form
          <>
            <div className="forgot-password-header">
              <button 
                className="back-to-login" 
                onClick={toggleForgotPassword}
              >
                <FaArrowLeft /> Back to Login
              </button>
              <h1>Reset Password</h1>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label>Email</label>
                <div className="input-container">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="Enter your admin email"
                  />
                  <FaEnvelope className="input-icon" />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
        
        <div className="back-link">
          <Link to="/" className="back-button">Back to Main</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;