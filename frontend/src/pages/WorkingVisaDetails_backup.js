/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './TourDetails.css';
import './WorkingVisaDetails.css';

const WorkingVisaDetails = () => {
  const { id } = useParams();
  const [visa, setVisa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/visas/${id}`);
        const data = response.data?.data || response.data;
        setVisa(data?.data || data);
      } catch (err) {
        setError('Visa not found');
      } finally {
        setLoading(false);
      }
    };

    fetchVisa();
  }, [id]);

  if (loading) {
    return (
      <div className="tour-details-page visa-details-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading visa details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !visa) {
    return (
      <div className="tour-details-page visa-details-page">
        <div className="container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error || 'Visa not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="tour-details-page visa-details-page">
      <div className="tour-gallery-container">
        <div className="gallery-grid">
          {(visa.heroImages || []).slice(0, 5).map((img, idx) => (
            <div
              key={idx}
              className="gallery-item"
              style={{ backgroundImage: `url(${img})`, height: '365px' }}
            />
          ))}
        </div>
      </div>
      <div className="container tour-content-container">
        <div className="tour-content">
          <h1 className="tour-title">{visa.tourPackageName || visa.title}</h1>
          {visa.description && (
            <div className="tour-description" dangerouslySetInnerHTML={{ __html: visa.description }} />
          )}

          {visa.requirements?.length > 0 && (
            <section>
              <h2>Requirements</h2>
              <ul className="requirements-list">
                {visa.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {visa.culturalNotes?.length > 0 && (
            <section>
              <h2>Cultural Notes</h2>
              <ul>
                {visa.culturalNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </section>
          )}

          {visa.importantNotes?.length > 0 && (
            <section>
              <h2>Important Notes</h2>
              <ul>
                {visa.importantNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkingVisaDetails;
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './TourDetails.css';
import './WorkingVisaDetails.css';

const WorkingVisaDetails = () => {
  const { id } = useParams();
  const [visa, setVisa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/visas/${id}`);
        const data = response.data?.data || response.data;
        setVisa(data?.data || data);
      } catch (err) {
        setError('Visa not found');
      } finally {
        setLoading(false);
      }
    };

    fetchVisa();
  }, [id]);

  if (loading) {
    return (
      <div className="tour-details-page visa-details-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading visa details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !visa) {
    return (
      <div className="tour-details-page visa-details-page">
        <div className="container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error || 'Visa not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="tour-details-page visa-details-page">
      <div className="tour-gallery-container">
        <div className="gallery-grid">
          {(visa.heroImages || []).slice(0, 5).map((img, idx) => (
            <div
              key={idx}
              className="gallery-item"
              style={{ backgroundImage: `url(${img})`, height: '365px' }}
            />
          ))}
        </div>
      </div>
      <div className="container tour-content-container">
        <div className="tour-content">
          <h1 className="tour-title">{visa.tourPackageName || visa.title}</h1>
          {visa.description && (
            <div className="tour-description" dangerouslySetInnerHTML={{ __html: visa.description }} />
          )}

          {visa.requirements?.length > 0 && (
            <section>
              <h2>Requirements</h2>
              <ul className="requirements-list">
                {visa.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {visa.culturalNotes?.length > 0 && (
            <section>
              <h2>Cultural Notes</h2>
              <ul>
                {visa.culturalNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </section>
          )}

          {visa.importantNotes?.length > 0 && (
            <section>
              <h2>Important Notes</h2>
              <ul>
                {visa.importantNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkingVisaDetails;
import React, { useEffect, useState } from 'react';


import './TourDetails.css';
import './WorkingVisaDetails.css';

const WorkingVisaDetails = () => {
  const { id } = useParams();
  const [visa, setVisa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/visas/${id}`);
        const data = response.data?.data || response.data;
        setVisa(data?.data || data);
      } catch (err) {
        setError('Visa not found');
      } finally {
        setLoading(false);
      }
    

    fetchVisa();
  }, [id]);

  if (loading) {
    return (
      <div className="tour-details-page visa-details-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading visa details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !visa) {
    return (
      <div className="tour-details-page visa-details-page">
        <div className="container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error || 'Visa not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="tour-details-page visa-details-page">
      <div className="tour-gallery-container">
        <div className="gallery-grid">
          {(visa.heroImages || []).slice(0, 5).map((img, idx) => (
            <div
              key={idx}
              className="gallery-item"
              style={{ backgroundImage: `url(${img})`, height: '365px' }}
            />
          ))}
        </div>
      </div>
      <div className="container tour-content-container">
        <div className="tour-content">
          <h1 className="tour-title">{visa.tourPackageName || visa.title}</h1>
          {visa.description && (
            <div className="tour-description" dangerouslySetInnerHTML={{ __html: visa.description }} />
          )}

          {visa.requirements?.length > 0 && (
            <section>
              <h2>Requirements</h2>
              <ul className="requirements-list">
                {visa.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {visa.culturalNotes?.length > 0 && (
            <section>
              <h2>Cultural Notes</h2>
              <ul>
                {visa.culturalNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </section>
          )}

          {visa.importantNotes?.length > 0 && (
            <section>
              <h2>Important Notes</h2>
              <ul>
                {visa.importantNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </section>
  );


export default WorkingVisaDetails; React, { useEffect, useState } from 'react';




const WorkingVisaDetails = () => {
  const { id } = useParams();
  
    const { id } = useParams();
   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/visas/${id}`);
        const visaData = response.data?.data || response.data;
        setVisa(visaData?.data || visaData);
      } catch (err) {
        setError('Visa not found');
      } finally {
        setLoading(false);
      }
    

    fetchVisa();
  }, [id]);

  if (loading) {
    return (
      <div className="tour-details-page visa-details-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading visa details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !visa) {
    return (
      <div className="tour-details-page visa-details-page">
        <div className="container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error || 'Visa not found'}</p>
          </div>
        </div>
      </div>
    );
  }

   
  return (
    <section className="tour-details-page visa-details-page">
      <div className="tour-gallery-container">
        <div className="gallery-grid">
          {(visa.heroImages || []).slice(0, 5).map((img, idx) => (
            <div
              key={idx}
              className="gallery-item"
              style={{ backgroundImage: `url(${img})`, height: '365px' }}
            />
          ))}
        </div>
      </div>
      <div className="container tour-content-container">
        <div className="tour-content">
          <h1 className="tour-title">{visa.tourPackageName || visa.title}</h1>
          {visa.description && (
            <div className="tour-description" dangerouslySetInnerHTML={{ __html: visa.description }} />
          )}

          {visa.requirements?.length > 0 && (
            <section>
              <h2>Requirements</h2>
              <ul className="requirements-list">
                {visa.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {visa.culturalNotes?.length > 0 && (
            <section>
              <h2>Cultural Notes</h2>
              <ul>
                {visa.culturalNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </section>
          )}

          {visa.importantNotes?.length > 0 && (
            <section>
              <h2>Important Notes</h2>
              <ul>
                {visa.importantNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </section>
  );


export default WorkingVisaDetails;
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/visas/${id}`);
        setVisa(response.data?.data?.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load visa details.');
        setLoading(false);
      }
    

    fetchVisa();
  }, [id]);

  if (loading) return <div className="loading-container"><div className="loader" /></div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!visa) return <div className="error-container">Visa not found</div>;

  return (
    <div className="visa-details-container">
      <header className="working-visa-header">
        <h1>{visa.tourPackageName || 'Visa Details'}</h1>
        <p><strong>Destination:</strong> {visa.destination}</p>
      </header>

      {visa.description && <p>{visa.description}</p>}

      {visa.requirements && visa.requirements.length > 0 && (
        <section>
          <h3>Requirements</h3>
          <ul>
            {visa.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
          </ul>
        </section>
      )}

      {visa.culturalNotes && visa.culturalNotes.length > 0 && (
        <section>
          <h3>Cultural Notes</h3>
          <ul>
            {visa.culturalNotes.map((note, idx) => <li key={idx}>{note}</li>)}
          </ul>
        </section>
      )}

      {visa.importantNotes && visa.importantNotes.length > 0 && (
        <section>
          <h3>Important Notes</h3>
          <ul>
            {visa.importantNotes.map((note, idx) => <li key={idx}>{note}</li>)}
          </ul>
        </section>
      )}
    </div>
  );



