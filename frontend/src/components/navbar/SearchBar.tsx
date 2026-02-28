import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFocus?: () => void;
  onClear?: () => void;
  onSearch?: () => void;
  isActive?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onFocus,
  onClear,
  onSearch,
  isActive
}) => (
  <div className={`flex w-full ${isActive ? 'shadow-premium z-50 relative' : ''} bg-white rounded-full overflow-hidden`}>
    <div className="relative flex-1">
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder="Search Colleges, Courses, Exams & more..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
        className="w-full h-11 pl-11 pr-10 text-sm text-gray-800 placeholder-text-muted-light border border-gray-200 rounded-l-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {searchQuery && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
    <button
      onClick={onSearch}
      className="h-11 px-6 bg-primary hover:bg-primary/90 text-white font-medium text-sm rounded-r-full transition-colors cursor-pointer"
    >
      Search
    </button>
  </div>
);

export default SearchBar;
