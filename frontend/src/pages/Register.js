import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const { register, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Clear any previous errors
    clearError();
  }, [isAuthenticated, navigate, clearError]);

  const { name, email, password, confirmPassword, phone } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear error for this field
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!name) {
      errors.name = 'Name is required';
    }
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (validateForm()) {
      const userData = {
        name,
        email,
        password,
        phone
      };
      
      const success = await register(userData);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <section className="auth-section">
      <div className="container">
        <div className="auth-container">
          <div className="auth-image">
            <img src="/images/register-image.jpg" alt="Register" />
          </div>
          
          <div className="auth-form-container">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us and start exploring</p>
            
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            
            <form className="auth-form" onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                  value={name}
                  onChange={onChange}
                  placeholder="Enter your full name"
                />
                {formErrors.name && (
                  <div className="error-message">{formErrors.name}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                  value={email}
                  onChange={onChange}
                  placeholder="Enter your email"
                />
                {formErrors.email && (
                  <div className="error-message">{formErrors.email}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={phone}
                  onChange={onChange}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                  value={password}
                  onChange={onChange}
                  placeholder="Enter your password"
                />
                {formErrors.password && (
                  <div className="error-message">{formErrors.password}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                  value={confirmPassword}
                  onChange={onChange}
                  placeholder="Confirm your password"
                />
                {formErrors.confirmPassword && (
                  <div className="error-message">{formErrors.confirmPassword}</div>
                )}
              </div>
              
              <div className="form-group form-check">
                <input type="checkbox" id="terms" className="form-check-input" required />
                <label htmlFor="terms" className="form-check-label">
                  I agree to the <Link to="/terms-of-service">Terms of Service</Link> and <Link to="/privacy-policy">Privacy Policy</Link>
                </label>
              </div>
              
              <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
            </form>
            
            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
