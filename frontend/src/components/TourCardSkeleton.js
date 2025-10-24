import React from 'react';
import './TourCardSkeleton.css';

const TourCardSkeleton = () => {
  return (
    <div className="tour-card skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
        <div className="skeleton-footer">
          <div className="skeleton-price"></div>
          {/* <div className="skeleton-button"></div> */}
        </div>
      </div>
    </div>
  );
};

export default TourCardSkeleton;
