import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorkingVisa.css';

const WorkingVisa = () => {
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisas = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/visas`);
        // API returns { data: { data: visas[] } }
        const list = response.data?.data?.data || [];
        setVisas(list.filter(v => v.status === 'active'));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch visa information. Please try again later.');
        setLoading(false);
      }
    };

    fetchVisas();
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="loader"></div></div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="working-visa-container">
      <header className="working-visa-header">
        <h1>Available Work Visas</h1>
        <p>Explore job opportunities and visa requirements for working in the Maldives.</p>
      </header>

      {visas.length > 0 ? (
        <div className="visa-cards-container">
          {visas.map((visa) => (
            <div key={visa._id} className="visa-card">
              <h2>{visa.tourPackageName || visa.title}</h2>
              <p><strong>Destination:</strong> {visa.destination || visa.country}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${visa.status}`}>{visa.status}</span></p>

              {visa.description && (
                <>
                  <h4>Description</h4>
                  <p>{visa.description}</p>
                </>
              )}

              {visa.requirements && visa.requirements.length > 0 && (
                <>
                  <h4>Requirements</h4>
                  <ul>
                    {visa.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </>
              )}

              {visa.culturalNotes && visa.culturalNotes.length > 0 && (
                <>
                  <h4>Cultural Notes</h4>
                  <ul>
                    {visa.culturalNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-visas-message">
          <p>No working visa information is available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default WorkingVisa;
