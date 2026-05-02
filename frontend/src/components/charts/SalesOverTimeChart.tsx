import React, { useEffect, useState } from 'react';
import { api, Filters } from '../../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimeData {
  year: number;
  sales: number;
}

export const SalesOverTimeChart: React.FC<{ refreshTrigger: number, filters: Filters }> = ({ refreshTrigger, filters }) => {
  const [data, setData] = useState<TimeData[]>([]);

  useEffect(() => {
    api.getSalesOverTime(filters).then(setData).catch(console.error);
  }, [refreshTrigger, filters]);

  if (!data.length) return null;

  return (
    <div className="chart-container h-[450px] md:col-span-2">
      <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        <span className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></span>
        Global Sales Over Time
      </h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              formatter={(value: number) => [`${value.toFixed(1)}M`, 'Sales']}
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#6366f1" 
              strokeWidth={4} 
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
