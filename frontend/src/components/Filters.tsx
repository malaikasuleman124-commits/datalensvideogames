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
    <div className="w-full max-w-6xl mx-auto mt-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-500">
      <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold shrink-0 uppercase text-xs tracking-widest">
        <FilterIcon className="h-4 w-4 mr-2" />
        Filter Data
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Genre</label>
          <select 
            value={filters.genre || ''} 
            onChange={(e) => onGenreChange(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border-none shadow-inner rounded-2xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none"
          >
            <option value="">All Genres</option>
            {options.genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Platform</label>
          <select 
            value={filters.platform || ''} 
            onChange={(e) => onPlatformChange(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border-none shadow-inner rounded-2xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none"
          >
            <option value="">All Platforms</option>
            {options.platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <button 
        onClick={onReset}
        className="flex items-center group text-gray-400 hover:text-red-500 transition-all pt-2 md:pt-4"
        title="Reset Filters"
      >
        <RotateCcw className="h-4 w-4 mr-2 group-hover:rotate-[-45deg] transition-transform" />
        <span className="text-xs font-bold uppercase tracking-wider">Reset</span>
      </button>
    </div>
  );
};
