import React, { useEffect, useState } from 'react';
import { api, Filters } from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlatformData {
  name: string;
  sales: number;
}

export const TopPlatformsChart: React.FC<{ refreshTrigger: number, filters: Filters }> = ({ refreshTrigger, filters }) => {
  const [data, setData] = useState<PlatformData[]>([]);

  useEffect(() => {
    api.getPlatformSales(filters).then(setData).catch(console.error);
  }, [refreshTrigger, filters]);

  if (!data.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">Top Platforms by Global Sales</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={80} />
          <Tooltip formatter={(value: number) => [`${value}M`, 'Sales']} />
          <Bar dataKey="sales" fill="#82ca9d" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
