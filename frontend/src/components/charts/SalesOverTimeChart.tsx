import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimeData {
  year: number;
  sales: number;
}

export const SalesOverTimeChart: React.FC<{ refreshTrigger: number }> = ({ refreshTrigger }) => {
  const [data, setData] = useState<TimeData[]>([]);

  useEffect(() => {
    api.getSalesOverTime().then(setData).catch(console.error);
  }, [refreshTrigger]);

  if (!data.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-[400px] md:col-span-2">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">Global Sales Over Time</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value: number) => [`${value}M`, 'Sales']} />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
