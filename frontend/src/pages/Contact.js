import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaUser, FaTag, FaComment } from 'react-icons/fa';
import SEO from '../components/SEO';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { name, email, subject, message } = formData;

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
    
    if (!subject) {
      errors.subject = 'Subject is required';
    }
    
    if (!message) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = e => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real application, you would send the form data to your backend
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }
  };

  return (
    <section className="contact-page">
      <SEO
        title="Contact Us"
        description="Get in touch with Golden Hope Travels for tour inquiries, bookings, and support. Find our location, phone number, email, and working hours."
        canonical="https://goldenhopetravels.com/contact"
      />
      <div className="contact-header">
        <div className="container">
          <h1 className="contact-title">Contact Us</h1>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>
              Have questions about our tours or need help planning your trip? Our team is here to assist you. Fill out the form or use the contact information below to reach us.
            </p>
            
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="info-content">
                  <h3>Our Location</h3>
                  <a href="https://www.google.com/maps?q=Imadol+Krishna+Mandir+Rd,+Near+NMB+Bank,+Lalitpur+44700" target="_blank" rel="noopener noreferrer" className="location-link">Imadol Krishna Mandir Rd, Near NMB Bank, Lalitpur 44700</a>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <div className="info-content">
                  <h3>Phone Number</h3>
                  <a href="tel:+9779765198757" className="phone-link">+9779765198757</a>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div className="info-content">
                  <h3>Email Address</h3>
                  <a href="mailto:goldenhopetoursandtravels@gmail.com" className="email-link">goldenhopetoursandtravels@gmail.com</a>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaClock />
                </div>
                <div className="info-content">
                  <h3>Working Hours</h3>
                  <p>Monday - Friday: 9am - 5pm</p>
                  <p>Saturday: Holliday</p>
                  <p>Government Holiday: Holliday</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
            <h2>Send a Message</h2>
            
            {isSubmitted ? (
              <div className="form-success">
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={onSubmit}>
                <div className="form-group">
                   <label className="form-label">
                              <FaUser className="input-icon" />
                              Full Name
                            </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                    value={name}
                    onChange={onChange}
                    placeholder="Enter your name"
                  />
                  {formErrors.name && (
                    <div className="error-message">{formErrors.name}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label"><FaEnvelope className="input-icon" /> Email Address</label>
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
                  <label className="form-label"><FaTag className="input-icon" /> Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className={`form-control ${formErrors.subject ? 'is-invalid' : ''}`}
                    value={subject}
                    onChange={onChange}
                    placeholder="Enter subject"
                  />
                  {formErrors.subject && (
                    <div className="error-message">{formErrors.subject}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label"><FaComment className="input-icon" /> Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className={`form-control ${formErrors.message ? 'is-invalid' : ''}`}
                    value={message}
                    onChange={onChange}
                    placeholder="Enter your message"
                  ></textarea>
                  {formErrors.message && (
                    <div className="error-message">{formErrors.message}</div>
                  )}
                </div>
                
                <button type="submit" className="btn btn-primary btn-block">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Contact;
