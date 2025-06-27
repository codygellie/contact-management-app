import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useMemo } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search contacts...", className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    useMemo(
      () => {
        let timeoutId;
        return (term) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => onSearch(term), 300);
        };
      },
      [onSearch]
    ),
    [onSearch]
  );

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="input pl-10 pr-10"
      />
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;