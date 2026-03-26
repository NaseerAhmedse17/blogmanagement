import React, { memo } from 'react';

/**
 * Pagination - Reusable pagination component.
 * Shows numbered pages with prev/next buttons.
 */
const Pagination = memo(({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, hasPrev, hasNext } = pagination;

  // Generate page numbers: show up to 5, centered on current page
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    for (let i = left; i <= right; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
      >
        &laquo; Prev
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
      >
        Next &raquo;
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';
export default Pagination;
