import React from 'react';
import './AdminSkeleton.css';

export const DashboardSkeleton = () => {
  return (
    <div className="admin-skeleton">
      {/* Stats Cards */}
      <div className="skeleton-stats-grid">
        <div className="skeleton-stat-card"></div>
        <div className="skeleton-stat-card"></div>
        <div className="skeleton-stat-card"></div>
        <div className="skeleton-stat-card"></div>
      </div>

      {/* Charts/Tables Section */}
      <div className="skeleton-content-grid">
        <div className="skeleton-content-card">
          <div className="skeleton-card-header"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
        </div>
        <div className="skeleton-content-card">
          <div className="skeleton-card-header"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="admin-skeleton">
      {/* Search and Filter Bar */}
      <div className="skeleton-filter-bar">
        <div className="skeleton-search-box"></div>
        <div className="skeleton-filter-button"></div>
        <div className="skeleton-filter-button"></div>
        <div className="skeleton-action-button"></div>
      </div>

      {/* Table */}
      <div className="skeleton-table">
        <div className="skeleton-table-header"></div>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="skeleton-table-row"></div>
        ))}
      </div>

      {/* Pagination */}
      <div className="skeleton-pagination">
        <div className="skeleton-pagination-info"></div>
        <div className="skeleton-pagination-buttons">
          <div className="skeleton-page-button"></div>
          <div className="skeleton-page-button"></div>
          <div className="skeleton-page-button"></div>
        </div>
      </div>
    </div>
  );
};

export default { DashboardSkeleton, TableSkeleton };
