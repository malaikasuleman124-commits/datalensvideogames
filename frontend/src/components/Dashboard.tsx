import React, { useEffect, useState } from 'react';
import { SalesByGenreChart } from './charts/SalesByGenreChart';
import { TopPlatformsChart } from './charts/TopPlatformsChart';
import { SalesOverTimeChart } from './charts/SalesOverTimeChart';
import { api } from '../lib/api';

interface DashboardProps {
  refreshTrigger: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ refreshTrigger }) => {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Check if there's data by calling profile
    api.getProfile().then(data => {
      setHasData(data && data.total_games > 0);
    }).catch(() => setHasData(false));
  }, [refreshTrigger]);

  if (!hasData) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
      <SalesByGenreChart refreshTrigger={refreshTrigger} />
      <TopPlatformsChart refreshTrigger={refreshTrigger} />
      <SalesOverTimeChart refreshTrigger={refreshTrigger} />
    </div>
  );
};
