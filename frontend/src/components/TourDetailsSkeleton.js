import React from 'react';
import './TourDetailsSkeleton.css';

const TourDetailsSkeleton = () => {
  return (
    <div className="tour-details-skeleton">
      {/* Hero Image Skeleton */}
      <div className="skeleton-hero-section">
        <div className="skeleton-hero-image"></div>
      </div>

      <div className="container tour-details-container">
        <div className="tour-details-content">
          {/* Left Column - Tour Info */}
          <div className="tour-main-content">
            {/* Title Section */}
            <div className="skeleton-title-section">
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
            </div>

            {/* Info Cards */}
            <div className="skeleton-info-cards">
              <div className="skeleton-info-card"></div>
              <div className="skeleton-info-card"></div>
              <div className="skeleton-info-card"></div>
              <div className="skeleton-info-card"></div>
            </div>

            {/* Description */}
            <div className="skeleton-section">
              <div className="skeleton-section-title"></div>
              <div className="skeleton-text-line"></div>
              <div className="skeleton-text-line"></div>
              <div className="skeleton-text-line"></div>
              <div className="skeleton-text-line short"></div>
            </div>

            {/* Itinerary */}
            <div className="skeleton-section">
              <div className="skeleton-section-title"></div>
              <div className="skeleton-itinerary-item"></div>
              <div className="skeleton-itinerary-item"></div>
              <div className="skeleton-itinerary-item"></div>
            </div>

            {/* Inclusions/Exclusions */}
            <div className="skeleton-section">
              <div className="skeleton-section-title"></div>
              <div className="skeleton-list-item"></div>
              <div className="skeleton-list-item"></div>
              <div className="skeleton-list-item"></div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="tour-sidebar">
            <div className="skeleton-booking-card">
              <div className="skeleton-price"></div>
              <div className="skeleton-button"></div>
              <div className="skeleton-contact-info"></div>
              <div className="skeleton-contact-info"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailsSkeleton;
