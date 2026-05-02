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
    <div className="chart-container h-[450px]">
      <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
        Top Platforms
      </h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip 
              cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              formatter={(value: number) => [`${value.toFixed(1)}M`, 'Sales']}
            />
            <Bar dataKey="sales" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
