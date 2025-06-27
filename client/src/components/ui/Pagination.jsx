import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNext, 
  hasPrev,
  total,
  limit 
}) => {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="bg-background-secondary border-t-2 border-border-primary px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Results info */}
        <div className="flex items-center text-sm text-text-secondary font-medium">
          <span>Showing</span>
          <span className="mx-2 px-3 py-1 bg-accent-beige text-text-primary border-2 border-border-primary font-bold">
            {startItem}-{endItem}
          </span>
          <span>of</span>
          <span className="ml-2 px-3 py-1 bg-accent-green text-text-primary border-2 border-border-primary font-bold">
            {total}
          </span>
          <span className="ml-2">results</span>
        </div>
        
        {/* Pagination controls */}
        <div className="flex items-center space-x-3">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="pagination-btn w-10 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-text-secondary" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-2">
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`pagination-btn w-10 h-10 text-sm font-bold ${
                  page === currentPage
                    ? 'active'
                    : ''
                }`}
              >
                {page}
              </button>
            ))}
            
            {/* Ellipsis if needed */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <div className="w-10 h-10 flex items-center justify-center border-2 border-border-primary bg-background-secondary">
                <MoreHorizontal className="w-4 h-4 text-text-muted" />
              </div>
            )}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            className="pagination-btn w-10 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;