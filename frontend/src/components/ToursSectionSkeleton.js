import React from 'react';
import './ToursSectionSkeleton.css';

const ToursSectionSkeleton = ({ title = "Loading Tours" }) => {
  return (
    <section className="section tours-section-skeleton">
      <div className="container">
        <div className="section-header-skeleton">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-section-subtitle"></div>
        </div>
        
        <div className="tours-grid-skeleton">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="tour-card-skeleton">
              <div className="skeleton-tour-image"></div>
              <div className="skeleton-tour-content">
                <div className="skeleton-tour-title"></div>
                <div className="skeleton-tour-text"></div>
                <div className="skeleton-tour-text short"></div>
                <div className="skeleton-tour-footer">
                  <div className="skeleton-tour-price"></div>
                  <div className="skeleton-tour-rating"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToursSectionSkeleton;
