import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = "",
  showFilters = false,
  filters = [],
  activeFilter = null,
  onFilterChange
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ width: isExpanded ? '100%' : 'auto' }}
        className="relative"
      >
        <div className="relative">
          <ApperIcon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" 
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            placeholder={placeholder}
            className="input-field pl-10 pr-4 w-full min-w-[280px]"
          />
        </div>
      </motion.div>

      {showFilters && filters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mt-3"
        >
          <button
            onClick={() => onFilterChange(null)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeFilter === null 
                ? 'bg-primary-500 text-white' 
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            All
          </button>
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeFilter === filter.value 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;