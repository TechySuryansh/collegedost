import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => (
  <div className="hidden md:flex flex-1 max-w-xl mx-8">
    <div className="relative w-full">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
      <input
        type="text"
        placeholder="Search colleges, exams, courses..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
      />
    </div>
  </div>
);

export default SearchBar;
