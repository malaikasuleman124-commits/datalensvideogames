import React, { useEffect, useState } from 'react';
import { SalesByGenreChart } from './charts/SalesByGenreChart';
import { TopPlatformsChart } from './charts/TopPlatformsChart';
import { ForecastChart } from './ForecastChart';
import { api, Filters } from '../lib/api';

interface DashboardProps {
  refreshTrigger: number;
  filters: Filters;
}

export const Dashboard: React.FC<DashboardProps> = ({ refreshTrigger, filters }) => {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Check if there's data by calling profile
    api.getProfile(filters).then(data => {
      setHasData(data && data.total_games > 0);
    }).catch(() => setHasData(false));
  }, [refreshTrigger, filters]);

  if (!hasData) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
      <SalesByGenreChart refreshTrigger={refreshTrigger} filters={filters} />
      <TopPlatformsChart refreshTrigger={refreshTrigger} filters={filters} />
      <ForecastChart refreshTrigger={refreshTrigger} filters={filters} />
    </div>
  );
};
