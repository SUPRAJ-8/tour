import React from 'react';
import { useParams, Link } from 'react-router-dom';

const TestTourDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="container" style={{ padding: '50px 20px' }}>
      <h1>Tour Details Test Page</h1>
      <p>Tour ID: {id}</p>
      <p>This is a test page to verify that the routing to tour details is working correctly.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/tours" className="btn btn-primary">Back to Tours</Link>
      </div>
    </div>
  );
};

export default TestTourDetails;
