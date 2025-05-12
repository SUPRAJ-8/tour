import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const { login, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Clear any previous errors
    clearError();
  }, [isAuthenticated, navigate, clearError]);

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear error for this field
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (validateForm()) {
      const success = await login(email, password);
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
            <img src="/images/login-image.jpg" alt="Login" />
          </div>
          
          <div className="auth-form-container">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account</p>
            
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            
            <form className="auth-form" onSubmit={onSubmit}>
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
              
              <div className="form-group form-check">
                <input type="checkbox" id="remember" className="form-check-input" />
                <label htmlFor="remember" className="form-check-label">Remember me</label>
                <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
              </div>
              
              <button type="submit" className="btn btn-primary btn-block">Sign In</button>
            </form>
            
            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
