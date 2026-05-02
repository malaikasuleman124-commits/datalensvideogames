import React, { useEffect, useState } from 'react';
import { api, Filters } from '../lib/api';
import { Gamepad2, CalendarDays, DollarSign, Loader2 } from 'lucide-react';

interface ProfileData {
  total_games: number;
  min_year: number | null;
  max_year: number | null;
  total_global_sales: number;
}

interface SummaryStatsProps {
  refreshTrigger: number;
  filters: Filters;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ refreshTrigger, filters }) => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profile = await api.getProfile(filters);
        setData(profile);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [refreshTrigger, filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data || data.total_games === 0) {
    return null; // Don't show stats if no data
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mt-8">
      {/* Total Games */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center space-x-4 transition-all hover:shadow-lg">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
          <Gamepad2 className="h-8 w-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Games</p>
          <h3 className="text-2xl font-bold">{data.total_games.toLocaleString()}</h3>
        </div>
      </div>

      {/* Years Covered */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center space-x-4 transition-all hover:shadow-lg">
        <div className="p-3 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-lg">
          <CalendarDays className="h-8 w-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Years Covered</p>
          <h3 className="text-2xl font-bold">
            {data.min_year && data.max_year ? `${data.min_year} - ${data.max_year}` : 'N/A'}
          </h3>
        </div>
      </div>

      {/* Total Sales */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center space-x-4 transition-all hover:shadow-lg">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-lg">
          <DollarSign className="h-8 w-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Global Sales (M)</p>
          <h3 className="text-2xl font-bold">{data.total_global_sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>
      </div>
    </div>
  );
};
