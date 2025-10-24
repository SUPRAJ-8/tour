import React from 'react';
import './HeroSkeleton.css';

const HeroSkeleton = () => {
  return (
    <section className="section hottest-tours-section">
      <div className="hero-slider">
        <div className="hero-skeleton">
          <div className="tour-slide two-column skeleton-slide">
            <div className="tour-slide-content">
              <div className="skeleton-badge"></div>
              <div className="skeleton-hero-title"></div>
              <div className="skeleton-hero-text"></div>
              <div className="skeleton-hero-text short"></div>
              <div className="tour-slide-info">
                <div className="skeleton-info-item"></div>
                <div className="skeleton-info-item"></div>
              </div>
              <div className="skeleton-hero-button"></div>
            </div>
            <div className="skeleton-hero-image"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
