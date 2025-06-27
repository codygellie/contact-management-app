import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-text-muted" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-bar pl-12 pr-12"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-95 transition-transform"
        >
          <X className="h-5 w-5 text-text-muted hover:text-text-secondary" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;