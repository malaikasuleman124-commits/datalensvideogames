import React, { useEffect, useState } from 'react';
import { api, Filters } from '../lib/api';
import { FileSearch, Activity, Hash, AlignLeft, AlertTriangle } from 'lucide-react';

interface ColumnStats {
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  std?: number;
  outliers?: number;
  unique?: number;
}

interface ColumnProfile {
  name: string;
  type: string;
  null_count: number;
  stats: ColumnStats;
}

interface ProfileData {
  total_games: number;
  min_year: number | null;
  max_year: number | null;
  total_global_sales: number;
  columns: ColumnProfile[];
}

interface DataProfileProps {
  refreshTrigger: number;
  filters: Filters;
}

export const DataProfile: React.FC<DataProfileProps> = ({ refreshTrigger, filters }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await api.getProfile(filters);
        if (data && data.columns && data.columns.length > 0) {
          setProfile(data);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Failed to fetch data profile', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [refreshTrigger, filters]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 p-6 glass-container rounded-2xl animate-pulse flex items-center justify-center h-48">
        <div className="text-gray-400 font-medium">Loading data profile...</div>
      </div>
    );
  }

  if (!profile) return null;

  const renderStats = (col: ColumnProfile) => {
    if (col.type === 'numeric') {
      return (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">Min:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{col.stats.min?.toFixed(2) ?? 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Max:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{col.stats.max?.toFixed(2) ?? 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Mean:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{col.stats.mean?.toFixed(2) ?? 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Median:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{col.stats.median?.toFixed(2) ?? 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Std:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{col.stats.std?.toFixed(2) ?? 'N/A'}</span></div>
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1">Outliers: </span>
            <span className={`font-medium ${(col.stats.outliers ?? 0) > 0 ? 'text-orange-500' : 'text-gray-800 dark:text-gray-200'}`}>
              {col.stats.outliers ?? 0}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">Unique Values:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{col.stats.unique ?? 'N/A'}</span></div>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 p-6 glass-container rounded-[2rem]">
      <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold mb-6 text-lg tracking-wide">
        <FileSearch className="h-6 w-6 mr-3" />
        Dataset Profile
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.columns.map((col, idx) => (
          <div key={idx} className="bg-white/40 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-3">
              <div className="font-bold text-gray-800 dark:text-gray-100 truncate flex items-center gap-2" title={col.name}>
                {col.type === 'numeric' ? <Hash className="h-4 w-4 text-purple-500" /> : <AlignLeft className="h-4 w-4 text-emerald-500" />}
                {col.name}
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${col.type === 'numeric' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                {col.type}
              </span>
            </div>
            
            <div className="mb-3 text-xs flex items-center gap-1">
               <AlertTriangle className={`h-3 w-3 ${col.null_count > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
               <span className="text-gray-500">Nulls:</span>
               <span className={`font-semibold ${col.null_count > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'}`}>{col.null_count}</span>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700/50 pt-3">
              {renderStats(col)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
