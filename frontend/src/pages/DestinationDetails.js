import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';
import './DestinationDetails.css';

const DestinationDetails = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await axios.get(`/api/destinations/${id}`);
        setDestination(res.data.data);
        
        // Fetch tours for this destination
        const toursRes = await axios.get(`/api/tours?destination=${id}`);
        setTours(toursRes.data.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching destination:', err);
        setError('Failed to load destination details');
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/destinations" className="btn btn-primary">Back to Destinations</Link>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Destination Not Found</h2>
          <p>The destination you're looking for doesn't exist or has been removed.</p>
          <Link to="/destinations" className="btn btn-primary">Back to Destinations</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="destination-details-page">
      <div className="destination-header" style={{ backgroundImage: `url(${destination.coverImage})` }}>
        <div className="container">
          <div className="destination-header-content">
            <h1 className="destination-title">{destination.name}</h1>
            <p className="destination-country">{destination.country}</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="destination-content">
          <div className="destination-main">
            <div className="destination-description">
              <h2>About {destination.name}</h2>
              <p>{destination.description}</p>
            </div>

            <div className="destination-gallery">
              <h2>Gallery</h2>
              <div className="gallery-grid">
                {destination.images && destination.images.length > 0 ? (
                  destination.images.map((image, index) => (
                    <div key={index} className="gallery-item">
                      <img src={image} alt={`${destination.name} - ${index + 1}`} />
                    </div>
                  ))
                ) : (
                  <div className="gallery-item">
                    <img src={destination.coverImage} alt={destination.name} />
                  </div>
                )}
              </div>
            </div>

            {destination.attractions && destination.attractions.length > 0 && (
              <div className="destination-attractions">
                <h2>Top Attractions</h2>
                <ul className="attractions-list">
                  {destination.attractions.map((attraction, index) => (
                    <li key={index} className="attraction-item">
                      <FaStar />
                      <span>{attraction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {destination.travelTips && destination.travelTips.length > 0 && (
              <div className="destination-tips">
                <h2>Travel Tips</h2>
                <ul className="tips-list">
                  {destination.travelTips.map((tip, index) => (
                    <li key={index} className="tip-item">
                      <FaStar />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="destination-sidebar">
            <div className="info-card">
              <h3>Destination Information</h3>
              
              <div className="info-item">
                <span className="info-label">Continent</span>
                <span className="info-value">{destination.continent}</span>
              </div>
              
              {destination.bestTimeToVisit && (
                <div className="info-item">
                  <span className="info-label">Best Time to Visit</span>
                  <span className="info-value">{destination.bestTimeToVisit}</span>
                </div>
              )}
              
              {destination.coordinates && destination.coordinates.latitude && destination.coordinates.longitude && (
                <div className="info-item">
                  <span className="info-label">Coordinates</span>
                  <span className="info-value">
                    {destination.coordinates.latitude}, {destination.coordinates.longitude}
                  </span>
                </div>
              )}
              
              <Link to="/contact" className="btn btn-outline btn-block">
                Inquire About This Destination
              </Link>
            </div>
          </div>
        </div>

        <div className="destination-tours">
          <h2>Tours in {destination.name}</h2>
          
          {tours.length > 0 ? (
            <div className="tours-grid">
              {tours.map(tour => (
                <div key={tour._id} className="tour-card">
                  <div className="tour-card-image">
                    <img src={tour.coverImage} alt={tour.title} />
                    <div className="tour-card-price">${tour.price}</div>
                  </div>
                  <div className="tour-card-content">
                    <h3 className="tour-card-title">{tour.title}</h3>
                    <div className="tour-card-info">
                      <div className="info-item">
                        <FaMapMarkerAlt />
                        <span>{destination.name}</span>
                      </div>
                      <div className="info-item">
                        <FaCalendarAlt />
                        <span>{tour.duration} days</span>
                      </div>
                    </div>
                    <div className="tour-card-footer">
                      <div className="tour-card-rating">
                        <FaStar />
                        <span>{tour.ratingsAverage} ({tour.ratingsQuantity})</span>
                      </div>
                      <Link to={`/tours/${tour._id}`} className="btn btn-outline">View Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-tours">
              <p>No tours available for this destination at the moment.</p>
              <Link to="/tours" className="btn btn-primary">View All Tours</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DestinationDetails;
