import React from 'react';
import './AdminSkeleton.css';

export const DashboardSkeleton = () => {
  return (
    <section className="admin-dashboard-page">
      {/* Header Skeleton */}
      <div className="admin-dashboard-header">
        <div className="container">
          <div className="skeleton-header-title"></div>
          <div className="skeleton-user-info">
            <div className="skeleton-user-name"></div>
            <div className="skeleton-user-role"></div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="admin-dashboard-content">
          {/* Sidebar Skeleton */}
          <div className="admin-sidebar">
            <ul className="admin-menu">
              {Array.from({ length: 7 }).map((_, index) => (
                <li key={index}>
                  <div className="skeleton-menu-item">
                    <div className="skeleton-menu-icon"></div>
                    <div className="skeleton-menu-text"></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content Skeleton */}
          <div className="admin-main">
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
          </div>
        </div>
      </div>
    </section>
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
