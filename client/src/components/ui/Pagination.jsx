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
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Results info */}
        <div className="flex items-center text-sm text-gray-700">
          <span>Showing</span>
          <span className="mx-2 px-2 py-1 bg-gray-100 text-gray-900 rounded font-medium">
            {startItem}-{endItem}
          </span>
          <span>of</span>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-900 rounded font-medium">
            {total}
          </span>
          <span className="ml-2">results</span>
        </div>
        
        {/* Pagination controls */}
        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="w-8 h-8 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center justify-center rounded"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 text-sm font-medium transition-colors flex items-center justify-center border rounded ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            {/* Ellipsis if needed */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <div className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white">
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            className="w-8 h-8 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center justify-center rounded"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;