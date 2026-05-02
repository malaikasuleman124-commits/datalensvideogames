import React, { useEffect, useState } from 'react';
import { api, Filters as FilterType } from '../lib/api';
import { Filter as FilterIcon, RotateCcw } from 'lucide-react';

interface FiltersProps {
  filters: FilterType;
  onGenreChange: (genre: string) => void;
  onPlatformChange: (platform: string) => void;
  onReset: () => void;
  refreshTrigger: number;
}

export const Filters: React.FC<FiltersProps> = ({ 
  filters, 
  onGenreChange, 
  onPlatformChange, 
  onReset,
  refreshTrigger 
}) => {
  const [options, setOptions] = useState<{ genres: string[], platforms: string[] }>({ genres: [], platforms: [] });

  useEffect(() => {
    api.getFilters().then(setOptions).catch(console.error);
  }, [refreshTrigger]);

  if (options.genres.length === 0 && options.platforms.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium shrink-0">
        <FilterIcon className="h-5 w-5 mr-2" />
        Filters
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Genre</label>
          <select 
            value={filters.genre || ''} 
            onChange={(e) => onGenreChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="">All Genres</option>
            {options.genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Platform</label>
          <select 
            value={filters.platform || ''} 
            onChange={(e) => onPlatformChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="">All Platforms</option>
            {options.platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <button 
        onClick={onReset}
        className="flex items-center text-gray-500 hover:text-red-500 transition-colors pt-2 md:pt-4"
        title="Reset Filters"
      >
        <RotateCcw className="h-4 w-4 mr-1" />
        <span className="text-sm font-medium">Reset</span>
      </button>
    </div>
  );
};
