import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GenreData {
  name: string;
  sales: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1', '#83a6ed', '#8e4585'];

export const SalesByGenreChart: React.FC<{ refreshTrigger: number }> = ({ refreshTrigger }) => {
  const [data, setData] = useState<GenreData[]>([]);

  useEffect(() => {
    api.getGenreSales().then(setData).catch(console.error);
  }, [refreshTrigger]);

  if (!data.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">Global Sales by Genre</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="sales"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value}M`, 'Sales']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
